import { useState, useEffect } from "react";
import {
  SearchOutlined,
  FilterOutlined,
  SyncOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
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
  Descriptions,
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

      <div className="flex-1 overflow-auto p-6">
        <Card title="Shop Inventory" bordered={false}>
          <Space className="mb-4 w-full" direction="vertical">
            <Space
              className="w-full"
              style={{ justifyContent: "space-between" }}
            >
              <Input
                placeholder="Search products"
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: 300 }}
              />
              <Space>
                <Button icon={<FilterOutlined />}>Filter</Button>
                <Button icon={<SyncOutlined />} onClick={handleRefresh}>
                  Refresh
                </Button>
              </Space>
            </Space>
          </Space>

          <Table
            columns={columns}
            dataSource={filteredItems}
            rowKey="_id"
            loading={loading}
            locale={{
              emptyText: (
                <div className="py-12">
                  <FilterOutlined style={{ fontSize: 32, color: "#9CA3AF" }} />
                  <p className="text-lg text-gray-700 mt-2">
                    No products found
                  </p>
                  <p className="text-gray-500">Try adjusting your search</p>
                </div>
              ),
            }}
          />
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
