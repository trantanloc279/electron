import { Table } from "antd";
import { ColumnsType, TableProps } from "antd/es/table";

interface UserEntity {
  id: React.Key;
  name: string;
  age: number;
  address: string;
  teamId: number;
}

export const UserTable = () => {
  const columns: ColumnsType<UserEntity> = [
    {
      title: "STT",
      dataIndex: "id",
      width: "10%",
    },
    {
      title: "Name",
      dataIndex: "name",
      filters: [
        {
          text: "Joe",
          value: "Joe",
        },
        {
          text: "Category 1",
          value: "Category 1",
        },
        {
          text: "Category 2",
          value: "Category 2",
        },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value: any, record) => record.name.startsWith(value),
      width: "30%",
    },
    {
      title: "Age",
      dataIndex: "age",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Address",
      dataIndex: "address",
      filters: [
        {
          text: "London",
          value: "London",
        },
        {
          text: "New York",
          value: "New York",
        },
      ],
      onFilter: (value: any, record: any) => record.address.startsWith(value),
      filterSearch: true,
      width: "40%",
    },
  ];

  const data: UserEntity[] = [
    {
      id: 1,
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
      teamId: 1,
    },
    {
      id: 2,
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
      teamId: 2,
    },
    {
      id: 3,
      name: "Joe Black",
      age: 32,
      address: "Sydney No. 1 Lake Park",
      teamId: 3,
    },
    {
      id: 4,
      name: "Jim Red",
      age: 32,
      address: "London No. 2 Lake Park",
      teamId: 4,
    },
    {
      id: 5,
      name: "Jim Red",
      age: 32,
      address: "London No. 2 Lake Park",
      teamId: 4,
    },
  ];

  const onChange: TableProps<UserEntity>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  return <Table columns={columns} dataSource={data} onChange={onChange} />;
};
