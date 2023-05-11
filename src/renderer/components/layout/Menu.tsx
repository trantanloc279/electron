import React, { useState } from 'react';
import { AppstoreOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';

const items: MenuProps['items'] = [
  {
    label: 'Đơn vị',
    key: 'team',
    icon: <AppstoreOutlined />,
  },
  {
    label: 'Chỉ tiêu',
    key: 'target',
    icon: <AppstoreOutlined />,
  },
  {
    label: 'Kết quả',
    key: 'result',
    icon: <AppstoreOutlined />,
  },
];

const MenuApp: React.FC = () => {
  const [current, setCurrent] = useState('mail');
  let navigate = useNavigate();
  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
    switch (e.key) {
      case 'target':
        navigate('/target');
        break;
      case 'team':
        navigate('/');
        break;
      case 'result':
        navigate('/result');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};

export default MenuApp;
