import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { useEffect } from 'react';
import axios from 'axios';

const { Option } = Select;

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

interface Props {
  visible: boolean;
  onClose: () => void;
  producto: Producto | null;
  onProductUpdated: () => void;
}

export default function ProductModalForm({ visible, onClose, producto, onProductUpdated }: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (producto) {
      form.setFieldsValue({
        name: producto.name,
        description: producto.description,
        price: producto.price,
        stock: producto.stock,
        status: producto.status,
      });
    } else {
      form.resetFields();
    }
  }, [producto, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await axios.put(`http://localhost:4000/api/v1/auth/updateproduct/${producto?._id}`, values);
      message.success('Producto actualizado correctamente');
      onProductUpdated();
      onClose();
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      message.error('No se pudo actualizar el producto');
    }
  };

  return (
    <Modal
      title="Editar Producto"
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
          label="Descripción"
          name="description"
          rules={[
            { required: true, message: 'La descripción es requerida' }
          ]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="Precio"
          name="price"
          rules={[
            { required: true, message: 'El precio es requerido' },
            { type: 'number', min: 0.01, message: 'El precio debe ser mayor a 0' }
          ]}
        >
          <InputNumber style={{ width: '100%' }} min={0.01} step={0.01} />
        </Form.Item>

        <Form.Item
          label="Stock"
          name="stock"
          rules={[
            { required: true, message: 'El stock es requerido' },
            { type: 'number', min: 0, message: 'El stock no puede ser negativo' }
          ]}
        >
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>

        <Form.Item
          label="Estado"
          name="status"
          rules={[
            { required: true, message: 'Selecciona un estado' },
            { validator: (_, value) => ['activo','inactivo','eliminado'].includes(value) ? Promise.resolve() : Promise.reject('Estado inválido') }
          ]}
        >
          <Select>
            <Option value="Activo">Activo</Option>
            <Option value="Inactivo">Inactivo</Option>
            <Option value="Eliminado">Eliminado</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
