import { Table, Input, Button } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import OrderModalForm from './OrderModalForm';
import OrderAddForm from './OrderAddForm';

interface ProductoOrdenado {
  productId: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface Orden {
  _id: string;
  userId: string;
  total: number;
  subtotal: number;
  status: string;
  createDate: string;
  products: ProductoOrdenado[];
}

export default function OrderData() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Orden | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchOrdenes = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:4000/api/v1/auth/allorders');
      setOrdenes(res.data);
    } catch (error) {
      console.error('Error al obtener órdenes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdenes();
  }, []);

  const filteredOrders = ordenes.filter((orden) => {
    const lowerSearch = search.toLowerCase();

    return (
      orden.userId.toLowerCase().includes(lowerSearch) ||
      orden.status.toLowerCase().includes(lowerSearch) ||
      new Date(orden.createDate).toLocaleDateString().includes(lowerSearch) ||
      orden.products.some((prod) =>
        prod.productId?.name?.toLowerCase().includes(lowerSearch)
      )
    );
  });

  const columns = [
  {
    title: 'Usuario',
    dataIndex: 'userId',
    key: 'userId',
  },
  {
    title: 'Subtotal',
    dataIndex: 'subtotal',
    key: 'subtotal',
    render: (value: number) => `$${value.toFixed(2)}`
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    render: (value: number) => `$${value.toFixed(2)}`
  },
  {
    title: 'Productos',
    key: 'products',
    render: (_: any, record: Orden) => (
      <ul className="text-sm text-gray-600 pl-4 list-disc">
        {record.products.map((prod) => (
          prod.productId ? (
            <li key={prod.productId._id}>
              {prod.productId.name} (x{prod.quantity}) - ${prod.price.toFixed(2)}
            </li>
          ) : (
            <li key={Math.random()}>
              Producto eliminado (x{prod.quantity}) - ${prod.price.toFixed(2)}
            </li>
          )
        ))}
      </ul>
    )
  },
  {
    title: 'Estado',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: 'Fecha',
    dataIndex: 'createDate',
    key: 'createDate',
    render: (date: string) => new Date(date).toLocaleDateString()
  },
  {
    title: 'Acciones',
    key: 'actions',
    render: (_: any, record: Orden) => (
      <Button
        type="primary"
        onClick={() => {
          setSelectedOrder(record);
          setIsModalVisible(true);
        }}
      >
        Editar
      </Button>
    ),
  },
];


  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Órdenes</h2>

      <OrderAddForm onOrderAdded={fetchOrdenes} />

      <Input.Search
        className="mb-6 w-80"
        placeholder="Buscar por usuario, estado, fecha o nombre de producto"
        onChange={(e) => setSearch(e.target.value)}
        allowClear
        size="large"
      />

      <Table
        dataSource={filteredOrders}
        columns={columns}
        loading={loading}
        rowKey="_id"
        bordered
        pagination={{ pageSize: 5 }}
      />

      <OrderModalForm
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        order={selectedOrder}
        onOrderUpdated={fetchOrdenes}
      />
    </div>
  );
}
