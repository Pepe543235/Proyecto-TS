import React from 'react';
import { Button, Form, Input, Card, message } from 'antd';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [form] = Form.useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

const handlerSubmit = async (values: { email: string; password: string }) => {
  try {
    const response = await fetch('http://localhost:4000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión');
    }

    // 🔁 Usa "token" si así lo llama tu backend
    login(data.token);

    message.success('Inicio de sesión exitoso');
    form.resetFields();
    navigate('/dashboard');

  } catch (error) {
    console.error('Error de login:', error);
    message.error(error.message || 'Error al iniciar sesión');
  }
};

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card title="Iniciar Sesión" style={{ width: 300 }}>
        <Form
          form={form}
          name="login"
          layout="vertical"
          onFinish={handlerSubmit}
        >
          <Form.Item
            name="email"
            rules={[ 
              { required: true, message: 'Por favor ingresa tu correo' },
              { type: 'email', message: 'Ingresa un correo válido' }
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Por favor ingresa tu contraseña' },
              { min: 5, message: 'La contraseña debe tener al menos 5 caracteres' }
            ]}
          >
            <Input.Password placeholder="Contraseña" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Iniciar Sesión
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
