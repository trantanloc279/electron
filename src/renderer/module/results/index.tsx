import { Button } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useState } from 'react';
import MenuApp from 'renderer/components/layout/Menu';
import CreateResultModal from './create.modal';
import { ResultTable } from './result.table';

export const ResultModule = () => {
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
          <CreateResultModal isOpen={open} toggle={() => set_open(false)} />
        )}
        <ResultTable isReloading={open} />
      </div>
    </Content>
  );
};
