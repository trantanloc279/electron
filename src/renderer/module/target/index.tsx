import { Button } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useState } from 'react';
import MenuApp from 'renderer/components/layout/Menu';
import CreateTargetModal from './create.modal';
import { TargetTable } from './target.table';

export const TargetModule = () => {
  let [open, set_open] = useState(false);
  return (
    <Content>
      <MenuApp />
      <div style={{ margin: '12px' }}>
        <Button
          type="primary"
          style={{ marginLeft: '8px' }}
          onClick={() => set_open(true)}
        >
          Thêm mới
        </Button>
        {open && (
          <CreateTargetModal isOpen={open} toggle={() => set_open(false)} />
        )}
        <TargetTable isReloading={open} />
      </div>
    </Content>
  );
};
