import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Table } from 'antd';
import { ColumnsType, TableProps } from 'antd/es/table';
import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import OSApi from 'renderer/os-api';
import EditTeamModal from './edit.modal';

interface TeamEntity {
  id: React.Key;
  name: string;
}

interface TeamTableProps {
  isReloading: boolean;
}

export const TeamTable = (props: TeamTableProps) => {
  const columns: ColumnsType<TeamEntity> = [
    {
      title: 'STT',
      dataIndex: 'id',
      width: '10%',
    },
    {
      title: 'Tên đội',
      dataIndex: 'name',
      filterSearch: true,
      onFilter: (value: any, record) => record.name.startsWith(value),
    },
    {
      title: 'Action',
      width: '10%',
      render: (value: any, record) => {
        return (
          <>
            <Button
              type="default"
              icon={<EditOutlined />}
              size={'small'}
              onClick={() => edit(value)}
            />

            <Popconfirm
              title="Xoá đội"
              description="Bạn có chắc xóa đội này không?"
              onConfirm={(e) => delete_team(value)}
              // onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <Button
                style={{ margin: '0 10px' }}
                type="default"
                danger
                icon={<DeleteOutlined />}
                size={'small'}
              />
            </Popconfirm>
          </>
        );
      },
    },
  ];

  let [data, set_data] = useState<TeamEntity[]>([]);
  let [data_selected, set_data_selected] = useState<TeamEntity>();
  let [open, set_open] = useState(false);

  const onChange: TableProps<TeamEntity>['onChange'] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  const edit = (value: any) => {
    console.log('value', value);
    set_data_selected(value);
    set_open(true);
  };

  const delete_team = (value: any) => {
    console.log('value', value);
    toast.success(' Chưa làm!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  };

  const get_data = async () => {
    let data = await ipcRenderer.invoke('GET_LIST_TEAM', true);
    set_data(data);
  };

  useEffect(() => {
    get_data();
  }, [props.isReloading, open]);

  return (
    <>
      <Table columns={columns} dataSource={data} onChange={onChange} />
      {open && (
        <EditTeamModal
          isOpen={open}
          toggle={() => set_open(false)}
          data={data_selected}
        />
      )}
    </>
  );
};
