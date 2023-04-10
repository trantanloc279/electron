import { Button } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useEffect, useState } from 'react';
import MenuApp from 'renderer/components/layout/Menu';
import CreateTeamModal from './create.modal';
import { TeamTable } from './team.table';

export const TeamsModule = () => {
  let [open, set_open] = useState(false);

  useEffect(() => {
    console.log('open', open);
  }, [open]);
  return (
    <Content>
      <MenuApp />
      <div style={{ margin: '12px' }}>
        <Button
          type="primary"
          style={{ marginLeft: '8px' }}
          onClick={(e) => {
            console.log('click');
            set_open(true);
          }}
        >
          Thêm mới
        </Button>
        {open && (
          <CreateTeamModal isOpen={open} toggle={() => set_open(false)} />
        )}
      </div>
      <TeamTable isReloading={open} />
    </Content>
  );
};
