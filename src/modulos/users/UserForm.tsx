import React from "react";
import { Form, Input, Button } from 'antd';

function UserForm() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Datos del formulario:', values);
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
      <h2>Registro</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Nombre"
          name="nombre"
          rules={[{ required: true, message: 'Por favor ingresa tu nombre' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Correo electrónico"
          name="correo"
          rules={[
            { required: true, message: 'Por favor ingresa tu correo' },
            { type: 'email', message: 'Ingresa un correo válido' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Contraseña"
          name="contraseña"
          rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Enviar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default UserForm;
