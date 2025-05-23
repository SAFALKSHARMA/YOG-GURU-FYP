import React, { useEffect, useState } from "react";
import {
  Table,
  Typography,
  Image,
  Spin,
  message,
  Button,
  Modal,
  Form,
  Input,
  Layout,
} from "antd";
import axios from "axios";
import Sidebar from "./Sidebar"; // Import your sidebar component

const { Title } = Typography;
const { TextArea } = Input;
const { Content, Sider } = Layout;

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/blogs");
      const formattedData = response.data.map((blog) => ({
        key: blog._id,
        image: blog.image,
        title: blog.title,
        content: blog.content,
        createdAt: new Date(blog.createdAt).toLocaleString(),
      }));
      setBlogs(formattedData);
    } catch (err) {
      message.error("Failed to fetch blogs.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBlog = async (values) => {
    try {
      await axios.post("http://localhost:3000/api/blogs/create", values);
      message.success("Blog added successfully!");
      setIsModalVisible(false);
      form.resetFields();
      fetchBlogs();
    } catch (err) {
      message.error("Failed to add blog.");
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (img) => <Image src={img} width={50} height={50} />,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      render: (text) => (
        <Typography.Paragraph
          ellipsis={{ rows: 2, expandable: true, symbol: "more" }}
          style={{ fontSize: "12px" }}
        >
          {text}
        </Typography.Paragraph>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        width={256}
        style={{ background: "#fff" }}
        breakpoint="lg"
        collapsedWidth="0"
      >
        <Sidebar />
      </Sider>

      {/* Main Content */}
      <Layout style={{ padding: "24px 24px 24px 48px" }}>
        <Content>
          <Title level={2}>All Blog Posts</Title>
          <Button
            type="primary"
            style={{ marginBottom: 16 }}
            onClick={() => setIsModalVisible(true)}
          >
            Add Blog
          </Button>

          {loading ? (
            <Spin size="large" />
          ) : (
            <Table
              dataSource={blogs}
              columns={columns}
              bordered
              pagination={{ pageSize: 5 }}
              size="small"
              style={{ maxWidth: "1200px" }}
              scroll={{ x: "max-content" }}
            />
          )}

          <Modal
            title="Add New Blog"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            onOk={() => form.submit()}
            okText="Submit"
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleAddBlog}
              initialValues={{
                title: "",
                content: "",
                image: "",
              }}
            >
              <Form.Item
                label="Title"
                name="title"
                rules={[
                  { required: true, message: "Please input the blog title!" },
                ]}
              >
                <Input placeholder="Enter blog title" />
              </Form.Item>

              <Form.Item
                label="Content"
                name="content"
                rules={[
                  { required: true, message: "Please input the blog content!" },
                ]}
              >
                <TextArea rows={4} placeholder="Enter blog content" />
              </Form.Item>

              <Form.Item
                label="Image URL"
                name="image"
                rules={[
                  { required: true, message: "Please provide an image URL!" },
                ]}
              >
                <Input placeholder="Enter image URL" />
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminBlogs;
