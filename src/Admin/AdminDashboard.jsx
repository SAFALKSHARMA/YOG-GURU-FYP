import React, { useEffect, useState } from "react";
import {
  User,
  Users,
  GraduationCap,
  BookOpen,
  ShoppingCart,
  Clock,
  FileText,
  PieChart,
  CheckCircle,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Sidebar from "./Sidebar";

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminLayout = ({ children }) => (
  <div className="flex h-screen bg-gray-50">
    <Sidebar />
    <div className="flex-1 overflow-auto">{children}</div>
  </div>
);

const StatCard = ({ icon: Icon, title, value, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    yellow: "bg-yellow-50 text-yellow-600",
    pink: "bg-pink-50 text-pink-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center">
        <div
          className={`p-2 rounded-lg ${
            colorClasses[color] || "bg-gray-50 text-gray-600"
          } mr-3`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-xl font-semibold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
};

const ChartCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
    <div className="flex items-center mb-3">
      <Icon className="w-5 h-5 text-gray-600 mr-2" />
      <h3 className="text-md font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="h-40">{children}</div>
  </div>
);

const Table = ({ title, icon: Icon, data, columns }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
    <div className="flex items-center mb-3">
      <Icon className="w-5 h-5 text-gray-600 mr-2" />
      <h3 className="text-md font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item._id}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-3 py-2 whitespace-nowrap text-sm text-gray-700"
                >
                  {column.render
                    ? column.render(item[column.dataIndex], item)
                    : item[column.dataIndex]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/stats/admin-dashboard"
        );
        const data = await response.json();
        setStats(data.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse text-lg text-gray-600">
            Loading dashboard...
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen text-lg text-red-500">
          Failed to load dashboard data
        </div>
      </AdminLayout>
    );
  }

  const createChartData = (items, colors) => ({
    labels: items.map((item) => item._id),
    datasets: [
      {
        data: items.map((item) => item.count),
        backgroundColor: colors,
        borderWidth: 0,
      },
    ],
  });

  const userDistributionData = createChartData(stats.breakdowns.userRoles, [
    "#8b5cf6", // Purple 500 (for Admin)
    "#10b981", // Green 500 (for User)
    "#f59e0b", // Yellow 500 (for Instructor if exists)
  ]);

  const classStatusData = createChartData(stats.breakdowns.classStatuses, [
    "#10b981", // Green 500 (for Approved)
    "#f59e0b", // Yellow 500 (for Pending)
  ]);

  const applicationStatusData = createChartData(
    stats.breakdowns.applicationStatuses,
    [
      "#10b981", // Green 500 (for Approved)
      "#f59e0b", // Yellow 500 (for Pending)
      "#ef4444", // Red 500 (for Rejected)
    ]
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          padding: 10,
          font: { size: 11 },
        },
      },
    },
  };

  const userColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center">
          <img
            src={record.image}
            alt={text}
            className="w-7 h-7 rounded-full mr-2"
          />
          <div>
            <span className="font-medium">{text}</span>
            <p className="text-xs text-gray-500">{record.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            role === "instructor"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {role === "instructor" ? "INSTRUCTOR" : "USER"}
        </span>
      ),
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <div className="flex items-center">
          <Calendar className="w-3 h-3 mr-1 text-gray-500" />
          {new Date(date).toLocaleDateString()}
        </div>
      ),
    },
    {
      title: "",
      key: "action",
      render: () => (
        <button className="text-blue-500 hover:text-blue-700">
          <ChevronRight className="w-4 h-4" />
        </button>
      ),
    },
  ];

  const classColumns = [
    {
      title: "Class Name",
      dataIndex: "className",
      key: "className",
      render: (text) => <div className="font-medium">{text}</div>,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => (
        <div className="flex items-center">
          <Calendar className="w-3 h-3 mr-1 text-gray-500" />
          {new Date(date).toLocaleDateString()}
        </div>
      ),
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (time) => (
        <div className="flex items-center">
          <Clock className="w-3 h-3 mr-1 text-gray-500" />
          {time}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === "Approved"
              ? "bg-green-100 text-green-800"
              : "bg-orange-100 text-orange-800"
          }`}
        >
          <CheckCircle className="w-3 h-3 inline mr-1" />
          {status}
        </span>
      ),
    },
  ];

  const applicationColumns = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">{record.email}</div>
        </div>
      ),
    },
    {
      title: "Experience",
      dataIndex: "experience",
      key: "experience",
      render: (exp) => (
        <div className="flex items-center">
          <GraduationCap className="w-3 h-3 mr-1 text-gray-500" />
          <span>{exp} years</span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === "Approved"
              ? "bg-green-100 text-green-800"
              : status === "Pending"
              ? "bg-orange-100 text-orange-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          <CheckCircle className="w-3 h-3 inline mr-1" />
          {status}
        </span>
      ),
    },
    {
      title: "Applied",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <div className="flex items-center">
          <Calendar className="w-3 h-3 mr-1 text-gray-500" />
          {new Date(date).toLocaleDateString()}
        </div>
      ),
    },
    {
      title: "",
      key: "action",
      render: () => (
        <button className="text-blue-500 hover:text-blue-700">
          <ChevronRight className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="p-5 min-h-screen">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={User}
            title="Total Users"
            value={stats.totals.users}
            color="blue"
          />
          <StatCard
            icon={Users}
            title="Instructors"
            value={stats.totals.instructors}
            color="indigo"
          />
          <StatCard
            icon={GraduationCap}
            title="Enrolled Students"
            value={stats.totals.students}
            color="green"
          />
          <StatCard
            icon={BookOpen}
            title="Approved Classes"
            value={stats.totals.classes}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={ShoppingCart}
            title="Products"
            value={stats.totals.products}
            color="yellow"
          />
          <StatCard
            icon={FileText}
            title="Applications"
            value={stats.totals.applications}
            color="pink"
          />
          <StatCard
            icon={Clock}
            title="Pending Classes"
            value={stats.totals.pendingClasses}
            color="orange"
          />
          <StatCard
            icon={Clock}
            title="Pending Apps"
            value={stats.totals.pendingApplications}
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6 align-middle ">
          <ChartCard title="User Distribution" icon={PieChart}>
            <Pie data={userDistributionData} options={chartOptions} />
          </ChartCard>
          <ChartCard title="Class Status" icon={PieChart}>
            <Pie data={classStatusData} options={chartOptions} />
          </ChartCard>
          <ChartCard title="Instructor Application Status" icon={PieChart}>
            <Pie data={applicationStatusData} options={chartOptions} />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <Table
            title="Recent Users"
            icon={User}
            data={stats.recent.users}
            columns={userColumns}
          />
          <Table
            title="Recent Classes"
            icon={BookOpen}
            data={stats.recent.classes}
            columns={classColumns}
          />
        </div>

        <div className="mb-6">
          <Table
            title="Recent Applications"
            icon={FileText}
            data={stats.recent.applications}
            columns={applicationColumns}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
