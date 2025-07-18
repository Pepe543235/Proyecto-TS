import { Table, Input, Tag, Button } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductModalForm from './ProductModalForm';
import ProductAddForm from './ProductAddForm';

interface Producto {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  createDate: string;
  deleteDate?: string | null;
}

export default function ProductosData() {
  const [search, setSearch] = useState('');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get<Producto[]>('http://localhost:4000/api/v1/auth/allproductos');
        setProductos(data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const filteredData = productos.filter((p) =>
    `${p.name} ${p.description} ${p.status}`.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className="text-base text-gray-800">{text}</span>,
    },
    {
      title: 'Descripción',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => <span className="text-sm text-gray-600">{text}</span>,
    },
    {
      title: 'Precio',
      dataIndex: 'price',
      key: 'price',
      sorter: (a: Producto, b: Producto) => a.price - b.price,
      render: (price: number) => (
        <span className="text-sm text-green-600">${price.toFixed(2)}</span>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a: Producto, b: Producto) => a.stock - b.stock,
      render: (stock: number) => (
        <span className={stock === 0 ? 'text-red-500' : 'text-blue-600'}>
          {stock}
        </span>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Activo', value: 'activo' },
        { text: 'Inactivo', value: 'inactivo' },
        { text: 'Eliminado', value: 'eliminado' },
      ],
      onFilter: (value: string | number | boolean, record: Producto) => record.status === value,
      render: (status: string) => {
        let color = 'default';
        if (status === 'activo') color = 'green';
        else if (status === 'inactivo') color = 'gold';
        else if (status === 'eliminado') color = 'volcano';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Fecha de creación',
      dataIndex: 'createDate',
      key: 'createDate',
      render: (date: string) => (
        <span className="text-sm text-gray-500">
          {new Date(date).toLocaleDateString()}
        </span>
      ),
      sorter: (a: Producto, b: Producto) =>
        new Date(a.createDate).getTime() - new Date(b.createDate).getTime(),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: Producto) => (
        <Button
          type="primary"
          onClick={() => {
            setSelectedProducto(record);
            setIsModalVisible(true);
          }}
        >
          Editar
        </Button>
      ),
    },
  ];

  const refreshProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<Producto[]>('http://localhost:4000/api/v1/auth/allproductos');
      setProductos(data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Productos</h2>

      <ProductAddForm onProductAdded={refreshProducts} />

      <Input.Search
        className="mb-6 w-80"
        placeholder="Buscar por nombre, descripción o estado"
        onChange={(e) => setSearch(e.target.value)}
        allowClear
        size="large"
      />

      <Table
        rowKey="_id"
        className="custom-table"
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 6 }}
        loading={loading}
        bordered
      />

      <ProductModalForm
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        producto={selectedProducto}
        onProductUpdated={refreshProducts}
      />
    </div>
  );
}
