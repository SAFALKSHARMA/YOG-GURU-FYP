import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Empty, Spin, Alert, Typography, Space, Row, Col } from "antd";
import { BookOutlined, SmileOutlined, ReloadOutlined } from "@ant-design/icons";
import { AppContent } from "../context/AppContext";
import ClassCard from "../ui/ClassCard";

const { Title, Text } = Typography;

const EnrolledClasses = () => {
  const { userData, backendUrl } = useContext(AppContent);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledClasses = async () => {
      try {
        if (!userData?.userId) {
          setError("Please login to view enrolled classes");
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

        const response = await fetch(
          `${backendUrl}/api/classes/${userData.userId}/enrolled-classes`
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "No enrolled classes found"
              : "Failed to fetch enrolled classes"
          );
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Error fetching enrolled classes");
        }

        setEnrolledClasses(data.enrolledClasses || []);
      } catch (err) {
        console.error("Error fetching enrolled classes:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledClasses();
  }, [userData, backendUrl]);

  const handleBrowseClasses = () => {
    navigate("/classes");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading your classes..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className="mb-4"
        />
        {error === "Please login to view enrolled classes" ? (
          <Button type="primary" onClick={() => navigate("/login")}>
            Login
          </Button>
        ) : (
          <Space>
            <Button
              type="primary"
              onClick={() => window.location.reload()}
              icon={<ReloadOutlined />}
            >
              Try Again
            </Button>
            <Button onClick={handleBrowseClasses}>Browse Classes</Button>
          </Space>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Space>
          <BookOutlined style={{ fontSize: 24 }} />
          <div>
            <Title level={4} className="m-0">
              My Enrolled Yoga Classes
            </Title>
          </div>
        </Space>
      </div>

      {enrolledClasses.length > 0 ? (
        <Row gutter={[16, 16]}>
          {enrolledClasses.map((yogaClass) => (
            <Col xs={24} sm={12} lg={8} key={yogaClass._id}>
              <ClassCard
                yogaClass={yogaClass}
                isFavorite={false}
                toggleFavorite={null}
                userId={userData?.userId}
                showEnrolledStatus={true}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          image={<SmileOutlined style={{ fontSize: 64 }} />}
          description={
            <Space direction="vertical" size="small" align="center">
              <Text strong style={{ fontSize: 16 }}>
                No enrolled classes yet
              </Text>
              <Text type="secondary">
                Find the perfect yoga class and begin your journey today
              </Text>
              <Button type="primary" onClick={handleBrowseClasses}>
                Browse Available Classes
              </Button>
            </Space>
          }
        />
      )}
    </div>
  );
};

export default EnrolledClasses;
