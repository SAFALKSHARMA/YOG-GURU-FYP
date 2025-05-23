import React, { useState, useContext, useEffect } from "react";
import {
  BookOutlined,
  SearchOutlined,
  ShoppingOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Table,
  Input,
  Select,
  Button,
  Modal,
  Form,
  DatePicker,
  TimePicker,
  Card,
  Tag,
  Space,
  message,
  Popconfirm,
  Divider,
  Descriptions,
  Image,
} from "antd";
import Sidebar from "./Sidebar"; // Adjust path as needed
import { AppContent } from "../../context/AppContext"; // Adjust path as needed
import moment from "moment";

const { Option } = Select;
const { TextArea } = Input;

const MyClasses = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const { instructorData, setInstructorData } = useContext(AppContent);
  const [classes, setClasses] = useState([]);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);

  // Fetch classes when instructorData._id changes
  useEffect(() => {
    const fetchClasses = async () => {
      if (!instructorData?._id) return;
      const endpoint = `http://localhost:3000/api/classes/instructor/${instructorData._id}`;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch classes");
        }
        const data = await response.json();
        setClasses(Array.isArray(data.classes) ? data.classes : []);
        if (setInstructorData) {
          setInstructorData((prev) => ({
            ...prev,
            classes: data.classes || [],
          }));
        }
      } catch (err) {
        setError(err.message);
        message.error("Failed to load classes");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [instructorData?._id, setInstructorData]);

  // Handle clicking View button
  const handleViewClassDetails = (classItem) => {
    setCurrentClass(classItem);
    const { image, ...formValues } = classItem;
    form.setFieldsValue({
      ...formValues,
      date: classItem.date ? moment(classItem.date) : null,
      time: classItem.time ? moment(classItem.time, "HH:mm") : null,
    });
    setIsModalVisible(true);
  };

  // Handle modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentClass(null);
    form.resetFields();
  };

  const handleUpdateClass = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      setError(null);

      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "date" && values[key]) {
          formData.append(key, values[key].format("YYYY-MM-DD"));
        } else if (key === "time" && values[key]) {
          formData.append(key, values[key].format("HH:mm"));
        } else if (key === "image" && values[key]?.file) {
          formData.append(key, values[key].file);
        } else if (values[key] !== undefined) {
          formData.append(key, values[key]);
        }
      });

      if (currentClass?._id) {
        formData.append("_id", currentClass._id);
        if (instructorData?._id && !formData.get("instructorId")) {
          formData.append("instructorId", instructorData._id);
        }

        // Debug: log all formData entries before sending
        console.log("FormData being sent:");
        for (const [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }

        const response = await fetch(
          `http://localhost:3000/api/classes/${currentClass._id}`,
          {
            method: "PUT",
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update class");
        }

        const { class: updatedClass } = await response.json();
        setClasses((prev) =>
          prev.map((cls) => (cls._id === updatedClass._id ? updatedClass : cls))
        );

        if (setInstructorData) {
          setInstructorData((prev) => ({
            ...prev,
            classes: prev.classes.map((cls) =>
              cls._id === updatedClass._id ? updatedClass : cls
            ),
          }));
        }

        message.success("Class updated successfully!");
      }

      setIsModalVisible(false);
      setCurrentClass(null);
      form.resetFields();
    } catch (err) {
      setError(err.message);
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a class
  const handleDeleteClass = async (classId) => {
    if (!classId || !instructorData?._id) {
      message.error("Invalid class or instructor ID");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3000/api/classes/delete-class`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            classId,
            instructorId: instructorData._id,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete class");
      }
      setClasses((prev) => prev.filter((cls) => cls._id !== classId));
      if (setInstructorData) {
        setInstructorData((prev) => ({
          ...prev,
          classes: prev.classes.filter((cls) => cls._id !== classId),
        }));
      }
      message.success("Class deleted successfully!");
    } catch (err) {
      setError(err.message);
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter classes based on search term and status
  const filteredClasses = classes.filter((classItem) => {
    const matchesSearch =
      typeof classItem.className === "string" &&
      classItem.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || classItem.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Table columns
  const columns = [
    {
      title: "Class",
      dataIndex: "className",
      key: "className",
      render: (text) => (
        <div className="flex items-center">
          <ShoppingOutlined className="mr-2" />
          <span className="font-medium">{text}</span>
        </div>
      ),
      sorter: (a, b) => a.className.localeCompare(b.className),
    },
    {
      title: "Schedule",
      key: "schedule",
      render: (record) => (
        <Space direction="vertical" size={0}>
          <div className="flex items-center">
            <CalendarOutlined className="mr-2" />
            {new Date(record.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="flex items-center">
            <ClockCircleOutlined className="mr-2" />
            {record.time}
          </div>
        </Space>
      ),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
      render: (text) => (
        <div className="flex items-center">
          <TeamOutlined className="mr-2" />
          <span>{text}</span>
          <span className="text-gray-500 ml-1">seats</span>
        </div>
      ),
      sorter: (a, b) => a.capacity - b.capacity,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        if (status === "Approved") color = "green";
        else if (status === "Rejected") color = "red";
        else if (status === "Pending") color = "orange";
        return <Tag color={color}>{status || "Pending"}</Tag>;
      },
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleViewClassDetails(record);
            }}
          />
          <Popconfirm
            title="Are you sure to delete this class?"
            onConfirm={() => handleDeleteClass(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 lg:ml-8">
        <Card
          title={
            <div className="flex items-center">
              <BookOutlined className="mr-3" />
              <span>My Classes</span>
            </div>
          }
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="Search classes..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64"
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-full md:w-40"
              suffixIcon={<SearchOutlined />}
            >
              <Option value="All">All Status</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Approved">Approved</Option>
              <Option value="Rejected">Rejected</Option>
            </Select>
          </div>

          <Table
            columns={columns}
            dataSource={filteredClasses}
            loading={loading}
            rowKey="_id"
            locale={{
              emptyText: (
                <div className="flex flex-col items-center py-8">
                  <BookOutlined className="text-4xl mb-4 text-gray-400" />
                  <p className="text-gray-500">No classes found</p>
                </div>
              ),
            }}
            onRow={(record) => ({
              onClick: (e) => {
                if (
                  !(
                    e.target.closest(".ant-btn") ||
                    e.target.closest(".ant-popconfirm")
                  )
                ) {
                  handleViewClassDetails(record);
                }
              },
            })}
          />
        </Card>
      </div>

      <Modal
        title="Class Details"
        open={isModalVisible}
        onCancel={handleCancel}
        width={800}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleUpdateClass}
          >
            Update
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Descriptions bordered column={1} size="small" className="mb-6">
            <Descriptions.Item label="Status">
              <Tag
                color={
                  currentClass?.status === "Approved"
                    ? "green"
                    : currentClass?.status === "Rejected"
                    ? "red"
                    : "orange"
                }
              >
                {currentClass?.status || "Pending"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {currentClass &&
                new Date(currentClass.createdAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
          {currentClass?.image && (
            <div className="mb-6">
              <p>Current Image:</p>
              <Image
                src={currentClass.image}
                alt="Class Image"
                width={100}
                height={100}
                style={{ objectFit: "cover" }}
              />
            </div>
          )}

          <Divider orientation="left">Class Information</Divider>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="className"
              label="Class Name"
              rules={[{ required: true, message: "Please input class name!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select category!" }]}
            >
              <Select>
                <Option value="Yoga">Yoga</Option>
                <Option value="Pilates">Pilates</Option>
                <Option value="HIIT">HIIT</Option>
                <Option value="Strength">Strength Training</Option>
                <Option value="Cardio">Cardio</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Please select date!" }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item
              name="time"
              label="Time"
              rules={[{ required: true, message: "Please select time!" }]}
            >
              <TimePicker format="HH:mm" className="w-full" />
            </Form.Item>

            <Form.Item
              name="duration"
              label="Duration (minutes)"
              rules={[{ required: true, message: "Please input duration!" }]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              name="capacity"
              label="Capacity"
              rules={[{ required: true, message: "Please input capacity!" }]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              name="price"
              label="Price ($)"
              rules={[{ required: true, message: "Please input price!" }]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              name="image"
              label="Upload New Image"
              valuePropName="file"
              getValueFromEvent={(e) => ({ file: e.target.files[0] })}
            >
              <Input type="file" accept="image/*" />
            </Form.Item>
          </div>

          <Divider orientation="left">Additional Information</Divider>
          <Form.Item name="description" label="Description">
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MyClasses;
