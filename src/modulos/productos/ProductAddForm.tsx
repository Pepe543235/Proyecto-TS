import { Button, Form, Input, InputNumber, Modal, Select } from 'antd';
import { useState } from 'react';
import axios from 'axios';

interface ProductAddFormProps {
  onProductAdded: () => void;
}

export default function ProductAddForm({ onProductAdded }: ProductAddFormProps) {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const showModal = () => setVisible(true);
  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await axios.post('http://localhost:4000/api/v1/auth/createproduct', values);
      form.resetFields();
      setVisible(false);
      onProductAdded();
    } catch (error) {
      console.error('Error al agregar producto:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="primary" onClick={showModal} className="mb-4">
        Agregar Producto
      </Button>

      <Modal
        title="Agregar Producto"
        open={visible}
        onCancel={handleCancel}
        onOk={handleOk}
        confirmLoading={loading}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Nombre"
            name="name"
            rules={[
              { required: true, message: 'Ingresa el nombre del producto' },
              { min: 3, message: 'El nombre debe tener al menos 3 caracteres' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Descripción"
            name="description"
            rules={[
              { required: true, message: 'Ingresa la descripción' }
            ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Precio"
            name="price"
            rules={[
              { required: true, message: 'Ingresa el precio' },
              { type: 'number', min: 0.01, message: 'El precio debe ser mayor a 0' }
            ]}
          >
            <InputNumber min={0.01} step={0.01} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Stock"
            name="stock"
            rules={[
              { required: true, message: 'Ingresa el stock' },
              { type: 'number', min: 0, message: 'El stock no puede ser negativo' }
            ]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Estado"
            name="status"
            rules={[
              { required: true, message: 'Selecciona un estado' },
              { validator: (_, value) => ['activo','inactivo','eliminado'].includes(value) ? Promise.resolve() : Promise.reject('Estado inválido') }
            ]}
          >
            <Select options={[
              { label: 'Activo', value: 'activo' },
              { label: 'Inactivo', value: 'inactivo' },
              { label: 'Eliminado', value: 'eliminado' },
            ]} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
