import React from "react";
import {
  Modal,
  Divider,
  Badge,
  Avatar,
  Tag,
  Button,
  message,
  Image,
} from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  ReadOutlined,
  FileTextOutlined,
  TrophyOutlined,
  FileImageOutlined,
  UserOutlined,
  FilePdfOutlined,
  CloseOutlined,
  CheckOutlined,
} from "@ant-design/icons";

const InstructorDetailsModal = ({
  visible,
  onClose,
  instructor,
  onApprove,
  onReject,
  isProcessing,
}) => {
  if (!instructor) return null;

  return (
    <Modal
      title={
        <div className="flex items-center">
          <TrophyOutlined className="mr-3 text-purple-600" />
          Instructor Profile
        </div>
      }
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      className="rounded-xl"
    >
      <div className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex flex-col items-center">
            <Avatar
              src={instructor.image}
              size={150}
              icon={<UserOutlined />}
              className="rounded-lg shadow-md"
            />

            <div className="mt-6 w-full text-center">
              <Badge
                status={
                  instructor.status === "Approved"
                    ? "success"
                    : instructor.status === "Rejected"
                    ? "error"
                    : "warning"
                }
                text={
                  <span className="capitalize font-medium">
                    {instructor.status}
                  </span>
                }
                className="text-sm"
              />
              <p className="text-gray-500 mt-2">
                Applied on:{" "}
                {new Date(instructor.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              {instructor.fullName}
            </h3>

            <div className="space-y-4">
              <div className="flex items-start">
                <MailOutlined className="mr-3 text-purple-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-800">{instructor.email}</p>
                </div>
              </div>

              <div className="flex items-start">
                <PhoneOutlined className="mr-3 text-purple-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-800">{instructor.phone}</p>
                </div>
              </div>

              <div className="flex items-start">
                <CalendarOutlined className="mr-3 text-purple-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="text-gray-800">{instructor.experience} years</p>
                </div>
              </div>

              <div className="flex items-start">
                <ReadOutlined className="mr-3 text-purple-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Qualifications</p>
                  <p className="text-gray-800">{instructor.qualifications}</p>
                </div>
              </div>

              <div className="flex items-start">
                <FileTextOutlined className="mr-3 text-purple-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Bio</p>
                  <p className="text-gray-800 whitespace-pre-line">
                    {instructor.bio}
                  </p>
                </div>
              </div>
            </div>

            <Divider />

            <div>
              <h4 className="font-medium text-gray-700 mb-2">Service Types</h4>
              <div className="flex flex-wrap gap-2">
                {instructor.serviceType?.length > 0 ? (
                  instructor.serviceType.map((service, index) => (
                    <Tag
                      color="purple"
                      key={index}
                      className="px-3 py-1 rounded-full"
                    >
                      {service}
                    </Tag>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No services specified</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <Divider />

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <FileImageOutlined className="mr-2 text-purple-600" />
              Documents ({instructor.documents?.length || 0})
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {instructor.documents?.length > 0 ? (
                instructor.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden"
                  >
                    <Image
                      src={doc}
                      alt={`Document ${index + 1}`}
                      className="w-full h-32 object-cover"
                      preview={{
                        mask: <span className="text-white">View</span>,
                      }}
                    />
                    <p className="text-center py-2 text-sm text-gray-600">
                      Document {index + 1}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-2 flex flex-col items-center justify-center py-4 bg-gray-50 rounded-lg">
                  <FilePdfOutlined className="text-3xl text-gray-400 mb-2" />
                  <p className="text-gray-500">No documents available</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <TrophyOutlined className="mr-2 text-purple-600" />
              Certificates ({instructor.certificates?.length || 0})
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {instructor.certificates?.length > 0 ? (
                instructor.certificates.map((cert, index) => (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden"
                  >
                    <Image
                      src={cert}
                      alt={`Certificate ${index + 1}`}
                      className="w-full h-32 object-cover"
                      preview={{
                        mask: <span className="text-white">View</span>,
                      }}
                    />
                    <p className="text-center py-2 text-sm text-gray-600">
                      Certificate {index + 1}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-2 flex flex-col items-center justify-center py-4 bg-gray-50 rounded-lg">
                  <FileTextOutlined className="text-3xl text-gray-400 mb-2" />
                  <p className="text-gray-500">No certificates available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Divider />

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">
            Application Timeline
          </h4>
          <div className="flex justify-between text-sm text-gray-600">
            <div>
              <p>Created:</p>
              <p className="font-medium">
                {new Date(instructor.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p>Last Updated:</p>
              <p className="font-medium">
                {new Date(instructor.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <Divider />

        <div className="flex justify-end space-x-3">
          {instructor.status !== "Approved" && (
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => onApprove(instructor._id)}
              loading={isProcessing}
              disabled={isProcessing}
            >
              Approve
            </Button>
          )}
          {instructor.status !== "Rejected" && (
            <Button
              danger
              icon={<CloseOutlined />}
              onClick={() => onReject(instructor._id)}
              loading={isProcessing}
              disabled={isProcessing}
            >
              Reject
            </Button>
          )}
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};

export default InstructorDetailsModal;
