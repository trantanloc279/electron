/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import isDev from 'electron-is-dev';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import RESULT_STATUS from './ResultStatus';
import fs from 'fs';
import EVALUATION_METHOD from './EvaluationMethod';
// import { PrismaClient } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));
  // mainWindow.webContents.openDevTools();

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

// Prisma
const dbPath = isDev
  ? path.join(__dirname, '../../prisma/database_dev.db')
  : path.join(app.getPath('userData'), 'database_qlct_prod.db');

if (!isDev) {
  try {
    // database file does not exist, need to create
    let isExist = fs.existsSync(
      path.join(app.getPath('userData'), 'database_qlct_prod.db')
    );
    if (!isExist) {
      fs.copyFileSync(
        path.join(process.resourcesPath, 'prisma/database_dev.db'),
        dbPath,
        fs.constants.COPYFILE_EXCL
      );
      console.log(
        `DB does not exist. Create new DB from ${path.join(
          process.resourcesPath,
          'prisma/dev.db'
        )}`
      );
    }
  } catch (err) {
    if (
      err &&
      'code' in (err as { code: string }) &&
      (err as { code: string }).code !== 'EEXIST'
    ) {
      console.error(`DB creation faild. Reason:`, err);
    } else {
      throw err;
    }
  }
}

const platformToExecutables: Record<string, any> = {
  win32: {
    migrationEngine:
      'node_modules/@prisma/engines/migration-engine-windows.exe',
    queryEngine: 'node_modules/@prisma/engines/query_engine-windows.dll.node',
  },
  linux: {
    migrationEngine:
      'node_modules/@prisma/engines/migration-engine-debian-openssl-1.1.x',
    queryEngine:
      'node_modules/@prisma/engines/libquery_engine-debian-openssl-1.1.x.so.node',
  },
  darwin: {
    migrationEngine: 'node_modules/@prisma/engines/migration-engine-darwin',
    queryEngine:
      'node_modules/@prisma/engines/libquery_engine-darwin.dylib.node',
  },
  darwinArm64: {
    migrationEngine:
      'node_modules/@prisma/engines/migration-engine-darwin-arm64',
    queryEngine:
      'node_modules/@prisma/engines/libquery_engine-darwin-arm64.dylib.node',
  },
};

function getPlatformName(): string {
  const isDarwin = process.platform === 'darwin';
  if (isDarwin && process.arch === 'arm64') {
    return `${process.platform}Arm64`;
  }

  return process.platform;
}

const extraResourcesPath = app.getAppPath().replace('app.asar', ''); // impacted by extraResources setting in electron-builder.yml
const platformName = getPlatformName();

const mePath = path.join(
  extraResourcesPath,
  platformToExecutables[platformName].migrationEngine
);
const qePath = path.join(
  extraResourcesPath,
  platformToExecutables[platformName].queryEngine
);

ipcMain.on('config:get-app-path', (event) => {
  event.returnValue = app.getAppPath();
});

ipcMain.on('config:get-platform-name', (event) => {
  const isDarwin = process.platform === 'darwin';
  event.returnValue =
    isDarwin && process.arch === 'arm64'
      ? `${process.platform}Arm64`
      : (event.returnValue = process.platform);
});

ipcMain.on('config:get-prisma-db-path', (event) => {
  event.returnValue = dbPath;
});

ipcMain.on('config:get-prisma-me-path', (event) => {
  event.returnValue = mePath;
});

ipcMain.on('config:get-prisma-qe-path', (event) => {
  event.returnValue = qePath;
});

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${dbPath}`,
    },
  },
  // see https://github.com/prisma/prisma/discussions/5200
  __internal: {
    engine: {
      binaryPath: qePath,
    },
  },
});

app.on('ready', () => {
  console.log('ready');
  // module team
  ipcMain.on('data', async (e, message: any) => {
    console.log(message);
    let data = await prisma.team.findMany();
    console.log('data', data);
  });

  ipcMain.handle('GET_LIST_TEAM', async (e, message: any) => {
    console.log('dbpath', path.join(app.getPath('userData'), 'database.db'));
    console.log(message);
    let data = await prisma.team.findMany({
      orderBy: [{ id: 'desc' }],
    });
    console.log('data', data);
    return data;
  });

  ipcMain.handle('CREATE_TEAM', async (e, message) => {
    console.log(message);
    let data = await prisma.team.create({ data: message });
    console.log('data', data);
    return data;
  });

  ipcMain.handle('EDIT_TEAM', async (e, message) => {
    console.log(message);
    let data = await prisma.team.update({
      where: { id: message.id },
      data: message,
    });
    console.log('data', data);
    return data;
  });

  ipcMain.handle('DELETE_TEAM', async (e, message) => {
    console.log(message);
    let data = await prisma.team.delete({
      where: { id: message.id },
    });
    console.log('data', data);
    return data;
  });

  // module target
  ipcMain.handle('GET_LIST_TARGET', async (e, message: any) => {
    console.log(message);
    let data = await prisma.target.findMany();
    console.log('data', data);
    return data;
  });

  ipcMain.handle('CREATE_TARGET', async (e, message: any) => {
    console.log(message);
    let data = await prisma.target.create({ data: message });
    console.log('data', data);
    return data;
  });

  ipcMain.handle('EDIT_TARGET', async (e, message) => {
    console.log(message);
    let data = await prisma.target.update({
      where: { id: message.id },
      data: message,
    });
    console.log('data', data);
    return data;
  });

  ipcMain.handle('DELETE_TARGET', async (e, message) => {
    console.log(message);
    let data = await prisma.target.delete({
      where: { id: message.id },
    });
    console.log('data', data);
    return data;
  });

  // module result
  ipcMain.handle('GET_LIST_RESULT', async (e, message: any) => {
    console.log(message);
    let data = await prisma.result.findMany({
      include: { team: true, target: true },
    });
    console.log('data', data);
    return data;
  });

  ipcMain.handle('CREATE_RESULT', async (e, message: any) => {
    console.log(message);
    let target = await prisma.target.findUnique({
      where: {
        id: message.targetId,
      },
    });
    let dto = {
      targetId: message.targetId,
      teamId: message.teamId,
      status: RESULT_STATUS.PROCESS,
      // target.evaluationMethods == EVALUATION_METHOD.METHOD_FOUR
      //   ? RESULT_STATUS.SUCCESS
      //   : RESULT_STATUS.PROCESS,
      result: '',
      resultPoint: 0,
    };
    let data = await prisma.result.create({
      data: dto,
    });
    console.log('data', data);
    return data;
  });

  ipcMain.handle('EDIT_RESULT', async (e, message: any) => {
    console.log('message', message);
    let status = message.status || 0;
    let target = await prisma.target.findUnique({
      where: {
        id: message.targetId,
      },
    });
    if (target == null) {
      return;
    }
    if (target.evaluationMethods == EVALUATION_METHOD.METHOD_ONE) {
      if (message.status == 0) {
        if (message.result.toUpperCase() == target.detail.toUpperCase()) {
          status = RESULT_STATUS.SUCCESS;
        } else {
          status = RESULT_STATUS.FAILED;
        }
      }
    }
    if (target.evaluationMethods == EVALUATION_METHOD.METHOD_TWO) {
      if (target.conditionEvaluationMethodTwo == 0) {
        if (message.resultPoint < target.detailPoint) {
          status = RESULT_STATUS.SUCCESS;
        } else {
          status = RESULT_STATUS.FAILED;
        }
      } else {
        if (message.resultPoint >= target.detailPoint) {
          status = RESULT_STATUS.SUCCESS;
        } else {
          status = RESULT_STATUS.FAILED;
        }
      }
    }
    if (target.evaluationMethods == EVALUATION_METHOD.METHOD_THREE) {
      if (message.resultPoint == target.detailPoint) {
        status = RESULT_STATUS.SUCCESS;
      }
      if (message.resultPoint < target.detailPoint) {
        status = RESULT_STATUS.FAILED;
      }
      if (message.resultPoint > target.detailPoint) {
        status = RESULT_STATUS.GOOD;
      }
    }
    if (target.evaluationMethods == EVALUATION_METHOD.METHOD_FOUR) {
      if (message.status == 0) {
        if (target.conditionEvaluationMethodTwo == 0) {
          if (message.resultPoint < target.detailPoint) {
            status = RESULT_STATUS.SUCCESS;
          } else {
            status = RESULT_STATUS.FAILED;
          }
        }
        if (target.conditionEvaluationMethodTwo == 1) {
          if (message.resultPoint >= target.detailPoint) {
            status = RESULT_STATUS.SUCCESS;
          } else {
            status = RESULT_STATUS.FAILED;
          }
        }

        if (target.conditionEvaluationMethodTwo == 2) {
          if (message.resultPoint == target.detailPoint) {
            status = RESULT_STATUS.SUCCESS;
          } else {
            status = RESULT_STATUS.FAILED;
          }
        }
      }
      let current = new Date();
      let deadline = new Date(target.deadline.toString());
      console.log('current', current);
      console.log('deadline', deadline);
      if (current.getTime() < deadline.getTime()) {
        status = RESULT_STATUS.PROCESS;
      }
    }

    let data = await prisma.result.update({
      where: { id: message.id },
      data: {
        targetId: message.targetId,
        teamId: message.teamId,
        resultPoint: Number(message.resultPoint),
        result: message.result,
        status: status,
      },
    });
    console.log('data', data);
    return data;
  });

  ipcMain.handle('DELETE_RESULT', async (e, message: any) => {
    console.log('message', message);
    let data = await prisma.result.delete({
      where: {
        id: message.id,
      },
    });
    console.log('data', data);
    return data;
  });
});
