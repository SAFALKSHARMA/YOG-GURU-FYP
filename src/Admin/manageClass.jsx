import React, { useEffect, useState, useRef } from "react";
import {
  BookOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  MoreOutlined,
  ReloadOutlined,
  FilterOutlined,
  SearchOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Table,
  Input,
  Select,
  Button,
  Tag,
  Avatar,
  Dropdown,
  Menu,
  Modal,
  Spin,
  Alert,
  DatePicker,
  Card,
  Divider,
} from "antd";
import Sidebar from "./Sidebar";
import ClassDetailsModal from "./classModal";

const { Search } = Input;
const { Option } = Select;

const ManageClass = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch classes data from API
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/classes/applications"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch classes data");
      }
      const data = await response.json();
      setClasses(data.classes || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewClassDetails = (classItem) => {
    setSelectedClass(classItem);
  };

  const handleCloseModal = () => {
    setSelectedClass(null);
  };

  const handleStatusChange = async (classId, newStatus) => {
    setIsUpdating(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/classes/update-status",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ classId, newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setClasses((prevClasses) =>
        prevClasses.map((classItem) =>
          classItem._id === classId
            ? { ...classItem, status: newStatus }
            : classItem
        )
      );
    } catch (err) {
      console.error("Error updating class status:", err);
      setError("Error updating class status");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredClasses = classes.filter((classItem) => {
    const matchesSearch =
      classItem.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.instructor?.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      classItem.instructor?.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || classItem.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusTag = (status) => {
    let color;
    switch (status) {
      case "Approved":
        color = "green";
        break;
      case "Rejected":
        color = "red";
        break;
      default:
        color = "orange";
    }
    return <Tag color={color}>{status || "Pending"}</Tag>;
  };

  const columns = [
    {
      title: "Instructor",
      dataIndex: "instructor",
      key: "instructor",
      render: (instructor) => (
        <div className="flex items-center">
          <Avatar
            src={instructor?.image}
            icon={<UserOutlined />}
            className="mr-3"
          />
          <span>{instructor?.fullName || "No instructor"}</span>
        </div>
      ),
    },
    {
      title: "Class",
      dataIndex: "className",
      key: "className",
      render: (text) => (
        <div className="flex items-center">
          <BookOutlined className="mr-2 text-blue-500" />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Schedule",
      key: "schedule",
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center">
            <CalendarOutlined className="mr-2 text-gray-400" />
            {new Date(record.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="flex items-center">
            <ClockCircleOutlined className="mr-2 text-gray-400" />
            {record.time}
          </div>
        </div>
      ),
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
      render: (text) => (
        <div className="flex items-center">
          <TeamOutlined className="mr-2 text-gray-400" />
          <span>{text} seats</span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
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
                key="view"
                icon={<EyeOutlined />}
                onClick={() => handleViewClassDetails(record)}
              >
                View Details
              </Menu.Item>
              <Menu.Item
                key="approve"
                icon={<CheckOutlined />}
                onClick={() => handleStatusChange(record._id, "Approved")}
                disabled={isUpdating || record.status === "Approved"}
              >
                Approve Class
              </Menu.Item>
              <Menu.Item
                key="reject"
                icon={<CloseOutlined />}
                onClick={() => handleStatusChange(record._id, "Rejected")}
                disabled={isUpdating || record.status === "Rejected"}
              >
                Reject Class
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/5">
        <Sidebar />
      </div>

      <div className="flex-1 p-6">
        <Card
          title={
            <div className="flex items-center">
              <BookOutlined className="mr-3 text-blue-500" />
              <span className="text-xl font-semibold">Class Applications</span>
            </div>
          }
          extra={
            <Button
              icon={<ReloadOutlined />}
              loading={loading}
              onClick={fetchClasses}
            >
              Refresh
            </Button>
          }
          className="mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Search
              placeholder="Search classes or instructors..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64"
            />

            <Select
              placeholder="Filter by status"
              prefix={<FilterOutlined />}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              className="w-full md:w-40"
            >
              <Option value="All">All Status</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Approved">Approved</Option>
              <Option value="Rejected">Rejected</Option>
            </Select>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-12">
              <Spin indicator={<ReloadOutlined spin />} />
              <span className="ml-3">Loading classes...</span>
            </div>
          )}

          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
            />
          )}

          {!loading && !error && filteredClasses.length === 0 && (
            <div className="text-center py-12">
              <BookOutlined className="text-4xl mb-3 text-gray-400" />
              <p className="text-gray-500">
                No classes found matching your criteria.
              </p>
            </div>
          )}

          {!loading && !error && filteredClasses.length > 0 && (
            <Table
              columns={columns}
              dataSource={filteredClasses}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: true }}
            />
          )}
        </Card>
      </div>

      {selectedClass && (
        <ClassDetailsModal
          selectedClass={selectedClass}
          handleCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ManageClass;
