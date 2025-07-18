import { Button, Form, Input, InputNumber, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface ProductOption {
  _id: string;
  name: string;
  price: number;
  stock: number;
}

interface OrderAddFormProps {
  onOrderAdded: () => void;
}

export default function OrderAddForm({ onOrderAdded }: OrderAddFormProps) {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductOption[]>([]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get<ProductOption[]>('http://localhost:4000/api/v1/auth/orders');
      setProducts(data.filter(p => p.status === 'activo'));
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const showModal = () => {
    fetchProducts();
    setVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const productos = values.products.map((productId: string) => {
        const product = products.find(p => p._id === productId);
        return {
          productId,
          quantity: 1,
          price: product?.price || 0
        };
      });

      const subtotal = productos.reduce((acc, p) => acc + p.price * p.quantity, 0);
      const total = subtotal * 1.1; // 10% de impuesto por ejemplo

      await axios.post('http://localhost:4000/api/v1/auth/createorder', {
        userId: values.userId,
        products: productos,
        subtotal,
        total
      });

      form.resetFields();
      setVisible(false);
      onOrderAdded();
    } catch (error) {
      console.error('Error al crear orden:', error);
    }
  };

  return (
    <>
      <Button type="primary" onClick={showModal} className="mb-4">
        Crear Orden
      </Button>

      <Modal
        title="Nueva Orden"
        open={visible}
        onCancel={handleCancel}
        onOk={handleOk}
        confirmLoading={loading}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="ID de Usuario"
            name="userId"
            rules={[
              { required: true, message: 'Ingresa el ID del usuario' },
              { min: 8, message: 'El ID debe tener al menos 8 caracteres' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Productos"
            name="products"
            rules={[
              { required: true, message: 'Selecciona al menos un producto' },
              { validator: (_, value) => Array.isArray(value) && value.length > 0 ? Promise.resolve() : Promise.reject('Selecciona al menos un producto') }
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Selecciona productos"
              options={products.map((p) => ({
                label: `${p.name} ($${p.price})`,
                value: p._id
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
