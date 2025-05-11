import { useState, useEffect } from "react";
import {
  ReadOutlined,
  SearchOutlined,
  FilterOutlined,
  SyncOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  Table,
  Input,
  Button,
  Space,
  Dropdown,
  Menu,
  Modal,
  Card,
  Tag,
  Image,
  Spin,
  message,
  Form,
  InputNumber,
  Select,
  Empty,
} from "antd";
import Sidebar from "./Sidebar";

const { TextArea } = Input;
const { Option } = Select;

export default function AdminShopList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/shop/getAll-items"
        );
        if (!response.ok) throw new Error("Failed to fetch items");
        const data = await response.json();
        setItems(data.data);
      } catch (err) {
        message.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (itemId) => {
    console.log("Delete item:", itemId);
    setDeleteConfirmId(null);
    // Implement your delete functionality here
    message.success("Product deleted successfully");
  };

  const handleRefresh = () => {
    setLoading(true);
    window.location.reload();
  };

  const handleEditSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Edited values:", values);
        // Implement your update functionality here
        message.success("Product updated successfully");
        setEditItem(null);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <Image
            width={64}
            height={64}
            src={record.images?.[0] || "https://via.placeholder.com/64"}
            alt={text}
            fallback="https://via.placeholder.com/64"
          />
          <div>
            <div>{text}</div>
            <Tag>{record.category}</Tag>
          </div>
        </Space>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price?.toFixed(2) || "0.00"}`,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (stock) => stock || "0",
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
                onClick={() => setViewItem(record)}
              >
                View Details
              </Menu.Item>
              <Menu.Item
                key="edit"
                icon={<EditOutlined />}
                onClick={() => {
                  setEditItem(record);
                  form.setFieldsValue(record);
                }}
              >
                Edit Product
              </Menu.Item>
              <Menu.Item
                key="delete"
                icon={<DeleteOutlined />}
                danger
                onClick={() => setDeleteConfirmId(record._id)}
              >
                Delete Product
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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-6 overflow-auto">
        <Card className="shadow-sm rounded-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
              <ReadOutlined className="mr-3 text-purple-600" />
              Shop Inventory
            </h1>

            <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3 w-full md:w-auto">
              <Input
                placeholder="Search products..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64"
              />
              <Select
                value="All" // Placeholder since no status filter exists
                suffixIcon={<FilterOutlined className="text-gray-400" />}
                className="w-full md:w-40"
                disabled
              >
                <Option value="All">All Status</Option>
              </Select>
              <Button
                icon={<SyncOutlined spin={loading} />}
                onClick={handleRefresh}
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
                  <SyncOutlined spin className="text-gray-600 text-2xl" />
                }
              />
              <span className="ml-3 text-gray-600">Loading products...</span>
            </div>
          )}

          {!loading && filteredItems.length === 0 && (
            <Empty
              image={<ReadOutlined className="text-4xl text-gray-400" />}
              description="No products found"
              className="py-12"
            />
          )}

          {!loading && filteredItems.length > 0 && (
            <Table
              columns={columns}
              dataSource={filteredItems}
              rowKey="_id"
              loading={loading}
            />
          )}
        </Card>

        {/* Delete Confirmation Modal */}
        <Modal
          title="Confirm Delete"
          visible={deleteConfirmId !== null}
          onOk={() => handleDelete(deleteConfirmId)}
          onCancel={() => setDeleteConfirmId(null)}
          okText="Delete"
          okButtonProps={{ danger: true }}
        >
          <p>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </p>
        </Modal>

        {/* View Details Modal */}
        <Modal
          title="Product Details"
          visible={!!viewItem}
          onCancel={() => setViewItem(null)}
          footer={[
            <Button key="close" onClick={() => setViewItem(null)}>
              Close
            </Button>,
          ]}
          width={800}
        >
          {viewItem && (
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Name">
                {viewItem.name}
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                {viewItem.category}
              </Descriptions.Item>
              <Descriptions.Item label="Price">
                ${viewItem.price?.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="Stock">
                {viewItem.stock}
              </Descriptions.Item>
              <Descriptions.Item label="Brand">
                {viewItem.brand || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>
                {viewItem.description || "No description available"}
              </Descriptions.Item>
              <Descriptions.Item label="Images" span={2}>
                <Space>
                  {viewItem.images?.map((img, i) => (
                    <Image key={i} width={100} src={img} />
                  )) || "No images available"}
                </Space>
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>

        {/* Edit Product Modal */}
        <Modal
          title="Edit Product"
          visible={!!editItem}
          onOk={handleEditSubmit}
          onCancel={() => setEditItem(null)}
          okText="Save Changes"
          width={600}
        >
          <Form form={form} layout="vertical" initialValues={editItem || {}}>
            <Form.Item
              name="name"
              label="Product Name"
              rules={[{ required: true, message: "Please enter product name" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select category" }]}
            >
              <Select>
                <Option value="electronics">Electronics</Option>
                <Option value="clothing">Clothing</Option>
                <Option value="home">Home</Option>
                <Option value="books">Books</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: "Please enter price" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>

            <Form.Item
              name="stock"
              label="Stock Quantity"
              rules={[
                { required: true, message: "Please enter stock quantity" },
              ]}
            >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>

            <Form.Item name="description" label="Description">
              <TextArea rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
