import React, { useEffect, useState } from "react";
import {
  MoreOutlined,
  SearchOutlined,
  ReloadOutlined,
  UserOutlined,
  DeleteOutlined,
  StopOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
  ReadOutlined,
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
  Card,
  Select,
} from "antd";
import Sidebar from "./Sidebar";

const { TextArea } = Input;
const { Option } = Select;
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
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/user/all-users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      const usersWithStatus = data.users.map((user) => ({
        ...user,
        status: user.banInfo?.isBanned ? "Banned" : "Active",
        banReason: user.banInfo?.banReason || "",
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
    if (!banReason) {
      message.error("Please provide a ban reason");
      return;
    }
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

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
      render: (status) => (
        <Tag color={status === "Banned" ? "error" : "success"}>{status}</Tag>
      ),
    },
    {
      title: "Ban Reason",
      dataIndex: "banReason",
      key: "banReason",
      render: (reason) => reason || "-",
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Space>
          {record.status === "Banned" ? (
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
      <div className="flex-1 p-6 overflow-auto">
        <Card className="shadow-sm rounded-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
              <ReadOutlined className="mr-3 text-purple-600" />
              Manage Users
            </h1>

            <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3 w-full md:w-auto">
              <Input
                placeholder="Search users..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64"
              />
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                suffixIcon={<FilterOutlined className="text-gray-400" />}
                className="w-full md:w-40"
              >
                <Option value="All">All Status</Option>
                <Option value="Active">Active</Option>
                <Option value="Banned">Banned</Option>
              </Select>
              <Button
                icon={<ReloadOutlined spin={loading} />}
                onClick={fetchUsers}
                disabled={loading}
                className="flex items-center"
              >
                Refresh
              </Button>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-12">
              <Spin
                indicator={
                  <ReloadOutlined spin className="text-gray-600 text-2xl" />
                }
              />
              <span className="ml-3 text-gray-600">Loading users...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 p-4 rounded-lg flex items-center text-red-600">
              <CloseOutlined className="mr-3" />
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && filteredUsers.length === 0 && (
            <Empty
              image={<UserOutlined className="text-4xl text-gray-400" />}
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
        </Card>

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
    </div>
  );
};

export default ManageUsers;
