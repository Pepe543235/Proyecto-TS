import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import { DashboardOutlined, UserOutlined, BarChartOutlined } from '@ant-design/icons';
import { useAuth } from '../auth/AuthContext';

const icons = {
  DashboardOutlined,
  UserOutlined,
  BarChartOutlined,
};

interface MenuItemData {
  title: string;
  path: string;
  icon: keyof typeof icons;
  roles: string[];
}

function MenuDynamic() {
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { roles: userRoles } = useAuth(); 

  const fakeMenuData: MenuItemData[] = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: "DashboardOutlined",
      roles: ["admin", "user"]
    },
    {
      title: "Usuarios",
      path: "/users",
      icon: "UserOutlined",
      roles: ["admin", "user"]
    },
    {
      title: "Productos",
      path: "/products",
      icon: "BarChartOutlined",
      roles: ["admin"]
    },
    {
      title: "Ordenes",
      path: "/orders",
      icon: "BarChartOutlined",
      roles: ["admin"]
    },
    {
      title: "Reportes",
      path: "/report",
      icon: "BarChartOutlined",
      roles: ["admin"]
    },
  ];

  useEffect(() => {
    const filtered = fakeMenuData.filter(item =>
      item.roles.some(role => userRoles.includes(role))
    );
    setMenuItems(filtered);
  }, [userRoles]);

  const renderMenu = () => {
    return menuItems.map((item) => {
      const IconComponent = icons[item.icon];
      return {
        key: item.path,
        icon: IconComponent ? <IconComponent /> : null,
        label: item.title,
      };
    });
  };

  return (
    <Menu
      theme='dark'
      mode='inline'
      selectedKeys={[location.pathname]}
      onClick={({ key }) => navigate(key)}
      items={renderMenu()}
      style={{ height: '100%', borderRight: 0 }}
    />
  );
}

export default MenuDynamic;

