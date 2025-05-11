import React, { useEffect, useState } from "react";
import {
  ReadOutlined,
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
  CloseCircleOutlined,
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
  Empty,
  Card,
} from "antd";
import Sidebar from "./Sidebar";
import ClassDetailsModal from "./classModal";

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
          <ReadOutlined className="mr-2 text-purple-600" />
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

      <div className="flex-1 p-6 overflow-auto">
        <Card className="shadow-sm rounded-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
              <ReadOutlined className="mr-3 text-purple-600" />
              Class Applications
            </h1>

            <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3 w-full md:w-auto">
              <Input
                placeholder="Search classes..."
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
                icon={<ReloadOutlined spin={loading} />}
                onClick={fetchClasses}
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
              <span className="ml-3 text-gray-600">Loading classes...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 p-4 rounded-lg flex items-center text-red-600">
              <CloseCircleOutlined className="mr-3" />
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && filteredClasses.length === 0 && (
            <Empty
              image={<ReadOutlined className="text-4xl text-gray-400" />}
              description="No classes found"
              className="py-12"
            />
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
