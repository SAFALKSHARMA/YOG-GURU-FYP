import React, { useEffect, useState, useRef } from "react";
import {
  SearchOutlined,
  SyncOutlined,
  UserOutlined,
  CloseOutlined,
  SafetyOutlined,
  PlusOutlined,
  DownOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  Table,
  Input,
  Button,
  Avatar,
  Dropdown,
  Menu,
  message,
  Spin,
  Empty,
  Card,
  Form,
  Modal,
  Badge,
  Tag,
} from "antd";
import Sidebar from "./Sidebar";

const { Search } = Input;
const { confirm } = Modal;

const AllAdmins = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddAdminForm, setShowAddAdminForm] = useState(false);
  const [form] = Form.useForm();
  const dropdownRef = useRef(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/user/all-admins");
      if (!response.ok) throw new Error("Failed to fetch admins");
      const data = await response.json();

      // Normalize the admin data
      const admins = Array.isArray(data?.admins) ? data.admins : [];

      setUsers(
        admins.map((admin) => ({
          ...admin,
          // Set defaults for required fields
          image: admin.image || "/default-user.png",
          name: admin.name || "Unknown Admin",
          email: admin.email || "No email provided",
        }))
      );
    } catch (err) {
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddAdmin = async (values) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/user/create-admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create admin");
      }

      const data = await response.json();
      const newCreatedAdmin = data?.admin || {};

      setUsers([
        ...users,
        {
          ...newCreatedAdmin,
          image: newCreatedAdmin.image || "/default-user.png",
          name: newCreatedAdmin.name || "Unknown Admin",
          email: newCreatedAdmin.email || "No email provided",
        },
      ]);

      message.success("Admin created successfully");
      setShowAddAdminForm(false);
      form.resetFields();
    } catch (err) {
      message.error(err.message);
    }
  };

  const showDeleteConfirm = (userId) => {
    confirm({
      title: "Are you sure you want to delete this admin?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        return new Promise(async (resolve, reject) => {
          try {
            const response = await fetch(
              `http://localhost:3000/api/user/delete-admin/${userId}`,
              {
                method: "DELETE",
              }
            );

            if (!response.ok) {
              throw new Error("Failed to delete admin");
            }

            setUsers(users.filter((user) => user._id !== userId));
            message.success("Admin deleted successfully");
            resolve();
          } catch (err) {
            message.error(err.message);
            reject(err);
          }
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();
    return (
      (user.name || "").toLowerCase().includes(search) ||
      (user.email || "").toLowerCase().includes(search)
    );
  });

  const columns = [
    {
      title: "Admin",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center">
          <Avatar src={record.image} icon={<UserOutlined />} className="mr-3" />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      key: "status",
      render: () => (
        <Tag color="green" className="capitalize">
          Active
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="edit"
                icon={<EditOutlined />}
                onClick={() => {
                  // Handle edit action
                  message.info("Edit functionality to be implemented");
                }}
              >
                Edit
              </Menu.Item>
              <Menu.Item
                key="delete"
                icon={<DeleteOutlined />}
                onClick={() => showDeleteConfirm(record._id)}
                danger
              >
                Delete
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button
            type="text"
            icon={<DownOutlined />}
            className="text-gray-500 hover:bg-gray-100"
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <Card className="shadow-sm rounded-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
              <SafetyOutlined className="mr-3 text-purple-600" />
              Admins
            </h1>

            <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3 w-full md:w-auto">
              <Search
                placeholder="Search by name or email..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64"
              />

              <div className="flex space-x-3">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setShowAddAdminForm(true)}
                >
                  Add Admin
                </Button>

                <Button
                  icon={<SyncOutlined spin={loading} />}
                  onClick={fetchUsers}
                  disabled={loading}
                >
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          <Modal
            title="Add New Admin"
            visible={showAddAdminForm}
            onCancel={() => {
              setShowAddAdminForm(false);
              form.resetFields();
            }}
            footer={null}
            destroyOnClose
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleAddAdmin}
              autoComplete="off"
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  { required: true, message: "Please input the admin name!" },
                ]}
              >
                <Input placeholder="Admin name" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input the admin email!" },
                  { type: "email", message: "Please input a valid email!" },
                ]}
              >
                <Input placeholder="admin@example.com" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input the password!" },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters!",
                  },
                ]}
              >
                <Input.Password placeholder="At least 6 characters" />
              </Form.Item>

              <Form.Item className="flex justify-end space-x-3 mb-0">
                <Button
                  onClick={() => {
                    setShowAddAdminForm(false);
                    form.resetFields();
                  }}
                >
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Create Admin
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          {loading && (
            <div className="flex justify-center items-center py-12">
              <Spin
                indicator={
                  <SyncOutlined spin className="text-purple-600 text-2xl" />
                }
              />
              <span className="ml-3 text-gray-600">Loading admins...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 p-4 rounded-lg flex items-center text-red-600 mb-4">
              <CloseOutlined className="mr-3" />
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && filteredUsers.length === 0 && (
            <Empty
              image={<UserOutlined className="text-4xl text-gray-400" />}
              description="No admins found"
              className="py-12"
            />
          )}

          {!loading && !error && filteredUsers.length > 0 && (
            <Table
              columns={columns}
              dataSource={filteredUsers}
              rowKey="_id"
              className="w-full"
              pagination={{ pageSize: 10 }}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default AllAdmins;
