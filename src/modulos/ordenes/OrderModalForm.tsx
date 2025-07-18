import { Modal, Form, InputNumber, Select, message, Divider } from 'antd';
import { useEffect } from 'react';
import axios from 'axios';

const { Option } = Select;

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

interface Props {
  visible: boolean;
  onClose: () => void;
  order: Orden | null;
  onOrderUpdated: () => void;
}

export default function OrderModalForm({ visible, onClose, order, onOrderUpdated }: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (order) {
      const productsFields = order.products.map((p, index) => ({
        [`quantity_${index}`]: p.quantity,
        [`price_${index}`]: p.price,
      }));

      form.setFieldsValue({
        status: order.status,
        subtotal: order.subtotal,
        total: order.total,
        ...(productsFields.reduce((acc, cur) => ({ ...acc, ...cur }), {})),
      });
    } else {
      form.resetFields();
    }
  }, [order, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const updatedProducts = order?.products.map((p, index) => ({
        productId: p.productId?._id || '',
        quantity: values[`quantity_${index}`],
        price: values[`price_${index}`]
      })).filter(prod => prod.productId); 


      const payload = {
        status: values.status,
        subtotal: values.subtotal,
        total: values.total,
        products: updatedProducts,
      };

      await axios.put(`http://localhost:4000/api/v1/auth/updateorders/${order?._id}`, payload);
      message.success('Orden actualizada correctamente');
      onOrderUpdated();
      onClose();
    } catch (error) {
      console.error('Error al actualizar orden:', error);
      message.error('No se pudo actualizar la orden');
    }
  };

  return (
    <Modal
      title="Editar Orden"
      open={visible}
      onCancel={onClose}
      onOk={handleSave}
      okText="Guardar"
      cancelText="Cancelar"
      width={700}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Estado" name="status" rules={[{ required: true }]}>
          <Select>
            <Option value="pendiente">Pendiente</Option>
            <Option value="pagado">Pagado</Option>
            <Option value="cancelado">Cancelado</Option>
            <Option value="enviado">Enviado</Option>
            <Option value="entregado">Entregado</Option>
          </Select>
        </Form.Item>
        {/* Validación personalizada para estado */}
        <Form.Item noStyle shouldUpdate={(prev, curr) => prev.status !== curr.status}>
          {({ getFieldValue }) => {
            const value = getFieldValue('status');
            if (value && !['pendiente','pagado','cancelado','enviado','entregado'].includes(value)) {
              return <div style={{color:'red'}}>Estado inválido</div>;
            }
            return null;
          }}
        </Form.Item>

        <Form.Item label="Subtotal" name="subtotal" rules={[
          { required: true, message: 'El subtotal es requerido' },
          { type: 'number', min: 0.01, message: 'El subtotal debe ser mayor a 0' }
        ]}>
          <InputNumber style={{ width: '100%' }} min={0.01} step={0.01} />
        </Form.Item>

        <Form.Item label="Total" name="total" rules={[
          { required: true, message: 'El total es requerido' },
          { type: 'number', min: 0.01, message: 'El total debe ser mayor a 0' }
        ]}>
          <InputNumber style={{ width: '100%' }} min={0.01} step={0.01} />
        </Form.Item>

        <Divider>Productos</Divider>

        {order?.products.map((p, index) => (
        p.productId ? (
            <div key={p.productId._id} className="mb-4 p-2 rounded border">
            <p className="font-semibold mb-1">{p.productId.name}</p>
            <Form.Item
                label="Cantidad"
                name={`quantity_${index}`}
                rules={[
                  { required: true, message: 'La cantidad es requerida' },
                  { type: 'number', min: 1, message: 'La cantidad debe ser al menos 1' }
                ]}
            >
                <InputNumber min={1} />
            </Form.Item>
            <Form.Item
                label="Precio"
                name={`price_${index}`}
                rules={[
                  { required: true, message: 'El precio es requerido' },
                  { type: 'number', min: 0, message: 'El precio no puede ser negativo' }
                ]}
            >
                <InputNumber min={0} step={0.01} />
            </Form.Item>
            </div>
        ) : (
            <div key={index} className="mb-4 p-2 border border-red-300 rounded bg-red-50">
            <p className="font-semibold text-red-500 mb-1">
                Producto no disponible (posiblemente fue eliminado)
            </p>
            <Form.Item
                label="Cantidad"
                name={`quantity_${index}`}
                rules={[{ required: true, type: 'number', min: 1 }]}
            >
                <InputNumber min={1} />
            </Form.Item>
            <Form.Item
                label="Precio"
                name={`price_${index}`}
                rules={[{ required: true, type: 'number', min: 0 }]}
            >
                <InputNumber min={0} step={0.01} />
            </Form.Item>
            </div>
        )
        ))}
      </Form>
    </Modal>
  );
}