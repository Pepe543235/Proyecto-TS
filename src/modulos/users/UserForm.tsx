import { Table, Input } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import UserModalForm from './UserModalForm'; 
import UserAddForm from './UserAddForm';

interface User {
  _id: string;
  name: string;
  email: string;
}

export default function UserData() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:4000/api/v1/auth/users');
      setUsers(res.data.userList);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const filteredData = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: <span className="text-lg font-semibold text-gray-700">Nombre</span>,
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className="text-base text-gray-800">{text}</span>,
    },
    {
      title: <span className="text-lg font-semibold text-gray-700">Email</span>,
      dataIndex: 'email',
      key: 'email',
      sorter: (a: User, b: User) => a.email.localeCompare(b.email),
      render: (text: string) => <span className="text-base text-gray-600">{text}</span>,
    },
    {
      title: <span className="text-lg font-semibold text-gray-700">Acciones</span>,
      key: 'actions',
      render: (_: any, record: User) => (
        <button
          onClick={() => handleEditUser(record)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-lg"
        >
          Editar
        </button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Usuarios</h2>

      <UserAddForm onUserAdded={fetchUsers} />

      <Input.Search
        className="mb-6 w-72"
        placeholder="Buscar por nombre"
        onChange={(e) => setSearch(e.target.value)}
        allowClear
        size="large"
      />

      <Table
        className="custom-table"
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
        rowKey="_id"
        loading={loading}
        bordered
      />

      {/* Modal para editar */}
      <UserModalForm
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        user={selectedUser}
        onUserUpdated={fetchUsers}
      />
    </div>
  );
}
