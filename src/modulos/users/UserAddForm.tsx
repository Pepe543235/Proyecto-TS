import { Button, Form, Input, Modal } from 'antd';
import { useState } from 'react';
import axios from 'axios';

interface UserAddFormProps {
  onUserAdded: () => void;
}

export default function UserAddForm({ onUserAdded }: UserAddFormProps) {
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

      await axios.post('http://localhost:4000/api/v1/auth/save', values);

      form.resetFields();
      setVisible(false);
      onUserAdded();
    } catch (error) {
      console.error('Error al crear usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="primary" onClick={showModal} className="mb-4">
        Agregar Usuario
      </Button>

      <Modal
        title="Nuevo Usuario"
        open={visible}
        onCancel={handleCancel}
        onOk={handleOk}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Nombre"
            name="name"
            rules={[
              { required: true, message: 'Por favor ingresa un nombre' },
              { min: 3, message: 'El nombre debe tener al menos 3 caracteres' }
            ]}
          >
            <Input placeholder="Nombre completo" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Ingresa un email' },
              { type: 'email', message: 'Ingresa un email válido' }
            ]}
          >
            <Input placeholder="correo@ejemplo.com" />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[
              { required: true, message: 'Ingresa una contraseña' },
              { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
            ]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
