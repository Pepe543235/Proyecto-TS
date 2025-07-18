import type { JSX } from "react/jsx-runtime";
import UserForm from "../modulos/users/UserForm"
import ProductData from "../modulos/productos/ProductData";
import OrderData from "../modulos/ordenes/OrderData";
import Dashboard from "../modulos/dashboard/Dashboard";
import Login from "../modulos/login/login";

export interface AppRoute {
    path: string;
    element: JSX.Element;
    label?: string;
    icon?: string;
    // roleIds?: string[];
    // hidden?: boolean;
}

const routes: AppRoute[] = [
    {
        path: '/login',
        element: <Login />,
        label: 'Login',
        icon: 'HomeOutlined',
    },
    {
        path: '/dashboard',
        element: <UserForm />,
        label: 'Inicio',
        icon: 'HomeOutlined',
    },
    {
        path: '/users',
        element: <UserForm />,
        label: 'Usuarios',
        icon: 'UserOutlined',
    },
    {
        path: '/products',
        element: <ProductData />,
        label: 'Usuarios',
        icon: 'UserOutlined',
    },
    {
        path: '/orders',
        element: <OrderData />,
        label: 'Usuarios',
        icon: 'UserOutlined',
    },
    {
        path: '/report',
        element: <UserForm />,
        label: 'Reportes',
        icon: 'UserOutlined',
    },

]

export default routes;