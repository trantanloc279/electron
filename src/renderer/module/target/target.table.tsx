import { Button, Popconfirm, Table } from 'antd';
import { ColumnsType, TableProps } from 'antd/es/table';
import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import EditTargetModal from './edit.modal';

interface TargetEntity {
  id: React.Key;
  title: string;
  description: string;
  deadline: Date;
  detail: string;
  detailPoint: number;
}

interface TargetTableProps {
  isReloading: boolean;
}

export const TargetTable = (props: TargetTableProps) => {
  const columns: ColumnsType<TargetEntity> = [
    {
      title: 'STT',
      key: 'index',
      render: (text, record, index) => index + 1,
      width: '10%',
    },
    {
      title: 'Chỉ tiêu',
      dataIndex: 'title',
      filterSearch: true,
      onFilter: (value: any, record) => record.title.startsWith(value),
    },
    {
      title: 'Nội dung',
      dataIndex: 'description',
      filterSearch: true,
      onFilter: (value: any, record) => record.description.includes(value),
    },
    {
      title: 'Phương pháp đánh giá',
      dataIndex: 'evaluationMethods',
      filterSearch: true,
      onFilter: (value: any, record) => record.description.includes(value),
    },
    {
      title: 'Cụ thể',
      render: (_, record) => {
        if (!!record.detail) {
          return record.detail;
        }
        if (!!record.detailPoint) {
          return record.detailPoint;
        }
        return '';
      },
    },

    {
      title: 'Thời hạn',
      dataIndex: 'deadline',
      filterSearch: true,
      render: (value) => `${dayjs(value).format('DD/MM/YYYY')}`,
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
              title="Xoá chỉ tiêu"
              description="Bạn có chắc xóa chỉ tiêu này không?"
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

  let [data, set_data] = useState<TargetEntity[]>([]);
  let [data_selected, set_data_selected] = useState<TargetEntity>();
  let [open, set_open] = useState(false);

  const onChange: TableProps<TargetEntity>['onChange'] = (
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

  const delete_team = async (value: any) => {
    console.log('value', value);
    let data = await ipcRenderer.invoke('DELETE_TARGET', value);
    if (data.id) {
      toast.success(' Xóa thành công!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } else {
      toast.success(' Xóa thất bại!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
    get_data();
  };

  const get_data = async () => {
    let data = await ipcRenderer.invoke('GET_LIST_TARGET', true);
    set_data(data);
  };

  useEffect(() => {
    get_data();
  }, [props.isReloading, open]);

  return (
    <>
      <Table columns={columns} dataSource={data} onChange={onChange} />
      {open && (
        <EditTargetModal
          isOpen={open}
          toggle={() => set_open(false)}
          data={data_selected}
        />
      )}
    </>
  );
};
