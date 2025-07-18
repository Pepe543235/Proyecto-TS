import { Modal, Form, Input, message } from 'antd';
import { useEffect } from 'react';
import axios from 'axios';

interface Props {
  visible: boolean;
  onClose: () => void;
  user: { _id: string; name: string; email: string } | null;
  onUserUpdated: () => void;
}

export default function UserModalForm({ visible, onClose, user, onUserUpdated }: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    }
  }, [user, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await axios.put(`http://localhost:4000/api/v1/auth/users/${user?._id}`, values);
      message.success('Usuario actualizado correctamente');
      onUserUpdated(); // recarga la lista
      onClose(); // cierra el modal
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      message.error('No se pudo actualizar el usuario');
    }
  };

  return (
    <Modal
      title="Editar Usuario"
      open={visible}
      onCancel={onClose}
      onOk={handleSave}
      okText="Guardar"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Nombre"
          name="name"
          rules={[
            { required: true, message: 'El nombre es requerido' },
            { min: 3, message: 'El nombre debe tener al menos 3 caracteres' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Correo electrónico"
          name="email"
          rules={[ 
            { required: true, message: 'El correo es requerido' },
            { type: 'email', message: 'Correo válido requerido' }
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
