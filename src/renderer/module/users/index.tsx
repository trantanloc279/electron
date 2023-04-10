import { Button } from "antd";
import { useEffect } from "react";
import { UserTable } from "./user.table";
import { ipcRenderer } from "electron";

export const UsersModule = () => {
  const get_data = async () => {
    // let data = await prisma.team.count();
    // console.log(data);
    ipcRenderer.send("data", { test: true });
  };
  useEffect(() => {
    get_data();
  }, []);
  return (
    <>
      <div style={{ marginBottom: "12px" }}>
        {/* <Button type="primary">Import</Button> */}
        <Button type="primary" style={{ marginLeft: "8px" }}>
          Thêm mới
        </Button>
      </div>
      <UserTable />
    </>
  );
};
