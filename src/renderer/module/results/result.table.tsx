import { Button, Popconfirm, Table, Tag } from 'antd';
import { ColumnsType, TableProps } from 'antd/es/table';
import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import EditResultModal from './edit.modal';
import RESULT_STATUS from 'renderer/constant/ResultStatus';
import EVALUATION_METHOD from 'renderer/constant/EvaluationMethod';

interface ResultEntity {
  id: React.Key;
  title: string;
  description: string;
  deadline: Date;
}

interface ResultTableProps {
  isReloading: boolean;
}

export const ResultTable = (props: ResultTableProps) => {
  const columns: ColumnsType<ResultEntity> = [
    {
      title: 'STT',
      dataIndex: 'id',
      width: '10%',
    },
    {
      title: 'Chỉ tiêu',
      dataIndex: 'target',
      render: (item) => item.title,
    },
    {
      title: 'Nội dung chỉ tiêu',
      dataIndex: 'target',
      render: (item) => item.description,
    },
    {
      title: 'Đơn vị theo dõi',
      dataIndex: 'team',
      render: (item) => item.name,
    },
    {
      title: 'Thời gian chốt số liệu',
      dataIndex: 'target',
      render: (value) => `${dayjs(value.deadline).format('DD/MM/YYYY')}`,
    },
    {
      title: 'Cụ thể',
      dataIndex: 'target',
      render: (item) => {
        if (
          [
            EVALUATION_METHOD.METHOD_TWO,
            EVALUATION_METHOD.METHOD_THREE,
          ].includes(item.evaluationMethods)
        ) {
          return item.detailPoint;
        }
        return item.detail;
      },
    },
    {
      title: 'Kết quả',

      children: [
        { dataIndex: 'result', render: (item) => item },
        { dataIndex: 'resultPoint', render: (item) => item },
      ],
    },
    {
      title: 'Đánh giá',
      dataIndex: 'status',
      render: (item) => {
        switch (item) {
          case RESULT_STATUS.PROCESS:
            return <Tag color="processing">Chưa đến thời gian đánh giá</Tag>;
          case RESULT_STATUS.SUCCESS:
            return <Tag color="success">Đạt chỉ tiêu</Tag>;
          case RESULT_STATUS.GOOD:
            return <Tag color="default">Vượt chỉ tiêu</Tag>;
          case RESULT_STATUS.FAILED:
            return <Tag color="error">Chưa đạt chỉ tiêu</Tag>;
        }
        // return item;
      },
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
              title="Xoá kết quả"
              description="Bạn có chắc xóa kết quả này không?"
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

  let [data, set_data] = useState<ResultEntity[]>([]);
  let [data_selected, set_data_selected] = useState<ResultEntity>();
  let [open, set_open] = useState(false);

  const onChange: TableProps<ResultEntity>['onChange'] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  const edit = (value: any) => {
    set_data_selected(value);
    set_open(true);
  };

  const delete_team = (value: any) => {
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
    let data = await ipcRenderer.invoke('GET_LIST_RESULT', true);
    set_data(data);
  };

  useEffect(() => {
    get_data();
  }, [props.isReloading, open]);

  return (
    <>
      <Table columns={columns} dataSource={data} onChange={onChange} />
      {open && (
        <EditResultModal
          isOpen={open}
          toggle={() => set_open(false)}
          data={data_selected}
        />
      )}
    </>
  );
};
