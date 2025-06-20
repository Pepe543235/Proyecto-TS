import { icons } from 'antd/es/image/PreviewGroup';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Menu } from 'antd';
import { DashboardOutlined, UserOutlined,BarChartOutlined } from '@ant-design/icons'

const icons = {
    DashboardOutlined,
    UserOutlined,
    BarChartOutlined,
}

function MenuDynamic() {
    const[menuItems, setMenuItems] = useState([]);
    const navigate = useNavigate();

    const fakeMenuData = [
        {
            title: "Dashboard",
            path: "/dashboard",
            icon: "DashboardOutlined",
            roles: ["665a1f2b40fd3a12b3e77611"]
        },
        {
            title: "Usuarios",
            path: "/users",
            icon: "UserOutlined",
            roles: ["665a1f2b40fd3a12b3e77612"]
        },
        {
            title: "Productos",
            path: "/products",
            icon: "BarChartOutlined",
            roles: ["665a1f2b40fd3a12b3e77611", "665a1f2b40fd3a12b3e77612"]
        },
        {
            title: "Ordenes",
            path: "/orders",
            icon: "BarChartOutlined",
            roles: ["665a1f2b40fd3a12b3e77611", "665a1f2b40fd3a12b3e77612"]
        },
        {
            title: "Reportes",
            path: "/report",
            icon: "BarChartOutlined",
            roles: ["665a1f2b40fd3a12b3e77611", "665a1f2b40fd3a12b3e77612"]
        },
    ];

    useEffect(() => {
        setTimeout(() => {
            setMenuItems(fakeMenuData);
        }, 500);
    });

    const renderMenu = () => {
        return menuItems.map((item: any) => {
            const IconComponent = icons[item.icon as keyof typeof icons];
            return {
                key: item.path,
                icon: IconComponent ? <IconComponent /> : null,
                label: item.tittle
            }
        })
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
    )
}