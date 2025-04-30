import React, { useEffect, useState, useRef } from "react";
import {
  MoreOutlined,
  SearchOutlined,
  ReloadOutlined,
  UserOutlined,
  DeleteOutlined,
  StopOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  Table,
  Input,
  Button,
  Space,
  Dropdown,
  Menu,
  Modal,
  Avatar,
  Tag,
  message,
  Spin,
  Empty,
  Alert,
} from "antd";
import Sidebar from "./Sidebar";

const { TextArea } = Input;
const { confirm } = Modal;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/user/all-users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      const usersWithStatus = data.users.map((user) => ({
        ...user,
        status: user.status || "Active",
        banReason: user.banReason || "",
      }));
      setUsers(usersWithStatus);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (userId) => {
    confirm({
      title: "Are you sure you want to delete this user?",
      icon: <ExclamationCircleOutlined />,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        setIsUpdating(true);
        try {
          const res = await fetch(
            `http://localhost:3000/api/user/delete/${userId}`,
            {
              method: "DELETE",
            }
          );
          if (!res.ok) throw new Error("Failed to delete user");
          setUsers(users.filter((user) => user._id !== userId));
          message.success("User deleted successfully");
        } catch (err) {
          message.error(err.message);
        } finally {
          setIsUpdating(false);
        }
      },
    });
  };

  const openBanModal = (userId) => {
    setSelectedUserId(userId);
    setShowBanModal(true);
  };

  const handleBan = async () => {
    if (!banReason) return;
    setIsUpdating(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/user/ban/${selectedUserId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: banReason }),
        }
      );
      if (!res.ok) throw new Error("Failed to ban user");
      setUsers(
        users.map((user) =>
          user._id === selectedUserId
            ? {
                ...user,
                banInfo: { isBanned: true, banReason },
                status: "Banned",
              }
            : user
        )
      );
      setBanReason("");
      setShowBanModal(false);
      message.success("User banned successfully");
    } catch (err) {
      message.error(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUnban = async (userId) => {
    setIsUpdating(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/user/unban/${userId}`,
        {
          method: "PATCH",
        }
      );
      if (!res.ok) throw new Error("Failed to unban user");
      setUsers(
        users.map((user) =>
          user._id === userId
            ? {
                ...user,
                banInfo: { isBanned: false, banReason: "" },
                status: "Active",
              }
            : user
        )
      );
      message.success("User unbanned successfully");
    } catch (err) {
      message.error(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <Avatar src={record.image} icon={<UserOutlined />} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => role || "User",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <Tag color={record.banInfo?.isBanned ? "error" : "success"}>
          {record.banInfo?.isBanned ? "Banned" : "Active"}
        </Tag>
      ),
    },
    {
      title: "Ban Reason",
      dataIndex: "banReason",
      key: "banReason",
      render: (_, record) => record.banInfo?.banReason || "-",
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Space>
          {record.banInfo?.isBanned ? (
            <Button
              onClick={() => handleUnban(record._id)}
              loading={isUpdating}
              size="small"
            >
              Unban
            </Button>
          ) : (
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                    key="delete"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(record._id)}
                    danger
                  >
                    Delete
                  </Menu.Item>
                  <Menu.Item
                    key="ban"
                    icon={<StopOutlined />}
                    onClick={() => openBanModal(record._id)}
                  >
                    Ban
                  </Menu.Item>
                </Menu>
              }
              trigger={["click"]}
              placement="bottomRight"
            >
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
              <UserOutlined className="mr-3 text-gray-600" />
              Manage Users
            </h1>

            <div className="flex space-x-3 w-full md:w-auto">
              <Input
                placeholder="Search by name or email..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64"
              />
              <Button
                onClick={fetchUsers}
                loading={loading}
                icon={<ReloadOutlined />}
              >
                Refresh
              </Button>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-12">
              <Spin indicator={<ReloadOutlined spin />} />
              <span className="ml-3 text-gray-600">Loading users...</span>
            </div>
          )}

          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              closable
              className="mb-4"
            />
          )}

          {!loading && !error && filteredUsers.length === 0 && (
            <Empty
              image={
                <UserOutlined style={{ fontSize: 48, color: "#bfbfbf" }} />
              }
              description="No users found"
              className="py-12"
            />
          )}

          {!loading && !error && filteredUsers.length > 0 && (
            <Table
              columns={columns}
              dataSource={filteredUsers}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: true }}
            />
          )}
        </div>
      </div>

      <Modal
        title="Ban User"
        visible={showBanModal}
        onCancel={() => {
          setShowBanModal(false);
          setBanReason("");
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setShowBanModal(false);
              setBanReason("");
            }}
          >
            Cancel
          </Button>,
          <Button
            key="ban"
            type="primary"
            danger
            onClick={handleBan}
            disabled={!banReason || isUpdating}
            loading={isUpdating}
          >
            Confirm Ban
          </Button>,
        ]}
      >
        <TextArea
          value={banReason}
          onChange={(e) => setBanReason(e.target.value)}
          placeholder="Enter ban reason..."
          rows={4}
        />
      </Modal>
    </div>
  );
};

export default ManageUsers;
