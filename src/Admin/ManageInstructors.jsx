import React, { useEffect, useState } from "react";
import {
  SearchOutlined,
  FilterOutlined,
  SyncOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  MoreOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  ReadOutlined,
  UserOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  Table,
  Input,
  Select,
  Button,
  Tag,
  Avatar,
  Badge,
  Dropdown,
  Menu,
  message,
  Spin,
  Empty,
  Card,
} from "antd";
import Sidebar from "./Sidebar";
import InstructorDetailsModal from "./instructorModal";

const { Option } = Select;

const ManageInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/instructors/applications"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch instructor applications");
        }
        const data = await response.json();
        setInstructors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  const handleApprove = async (applicationId) => {
    setIsProcessing(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/instructors/approve/${applicationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to approve application");

      message.success("Application approved successfully!");
      setInstructors((prev) =>
        prev.map((instructor) =>
          instructor._id === applicationId
            ? { ...instructor, status: "Approved" }
            : instructor
        )
      );
      setModalVisible(false);
    } catch (err) {
      message.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (applicationId) => {
    setIsProcessing(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/instructors/reject/${applicationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to reject application");

      message.success("Application rejected successfully!");
      setInstructors((prev) =>
        prev.map((instructor) =>
          instructor._id === applicationId
            ? { ...instructor, status: "Rejected" }
            : instructor
        )
      );
      setModalVisible(false);
    } catch (err) {
      message.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/instructors/applications"
      );
      if (!response.ok) throw new Error("Failed to refresh data");
      const data = await response.json();
      setInstructors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredInstructors = instructors.filter((instructor) => {
    const matchesSearch =
      instructor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || instructor.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: "Instructor",
      dataIndex: "fullName",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center">
          <Avatar src={record.image} icon={<UserOutlined />} className="mr-3" />
          <div>
            <p className="font-medium text-gray-800">{text}</p>
            <p className="text-sm text-gray-500">{record.qualifications}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Contact",
      key: "contact",
      render: (record) => (
        <div className="text-sm">
          <div className="flex items-center text-gray-800">
            <MailOutlined className="mr-2 text-gray-400" />
            {record.email}
          </div>
          <div className="flex items-center text-gray-800 mt-1">
            <PhoneOutlined className="mr-2 text-gray-400" />
            {record.phone}
          </div>
        </div>
      ),
    },
    {
      title: "Experience",
      dataIndex: "experience",
      key: "experience",
      render: (text) => (
        <div className="flex items-center">
          <CalendarOutlined className="mr-2 text-gray-400" />
          <span className="font-medium">{text}</span>
          <span className="text-gray-500 ml-1">years</span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "Approved"
              ? "green"
              : status === "Rejected"
              ? "red"
              : "orange"
          }
          className="capitalize"
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="view"
                icon={<EyeOutlined />}
                onClick={() => {
                  setSelectedInstructor(record);
                  setModalVisible(true);
                }}
              >
                View Details
              </Menu.Item>
              {record.status !== "Approved" && (
                <Menu.Item
                  key="approve"
                  icon={<CheckOutlined />}
                  onClick={() => handleApprove(record._id)}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Approve"}
                </Menu.Item>
              )}
              {record.status !== "Rejected" && (
                <Menu.Item
                  key="reject"
                  icon={<CloseOutlined />}
                  onClick={() => handleReject(record._id)}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Reject"}
                </Menu.Item>
              )}
            </Menu>
          }
          trigger={["click"]}
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            className="text-gray-500 hover:bg-gray-100"
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <Card className="shadow-sm rounded-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
              <ReadOutlined className="mr-3 text-purple-600" />
              Instructor Applications
            </h1>

            <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3 w-full md:w-auto">
              <Input
                placeholder="Search instructors..."
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
                <Option value="Pending">Pending</Option>
                <Option value="Approved">Approved</Option>
                <Option value="Rejected">Rejected</Option>
              </Select>

              <Button
                icon={<SyncOutlined spin={loading} />}
                onClick={refreshData}
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
                  <SyncOutlined spin className="text-purple-600 text-2xl" />
                }
              />
              <span className="ml-3 text-gray-600">Loading instructors...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 p-4 rounded-lg flex items-center text-red-600">
              <CloseCircleOutlined className="mr-3" />
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && filteredInstructors.length === 0 && (
            <Empty
              image={<UserOutlined className="text-4xl text-gray-400" />}
              description="No instructor applications found"
              className="py-12"
            />
          )}

          {!loading && !error && filteredInstructors.length > 0 && (
            <Table
              columns={columns}
              dataSource={filteredInstructors}
              rowKey="_id"
              className="w-full"
              pagination={{ pageSize: 10 }}
            />
          )}
        </Card>
      </div>

      <InstructorDetailsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        instructor={selectedInstructor}
        onApprove={handleApprove}
        onReject={handleReject}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default ManageInstructors;
