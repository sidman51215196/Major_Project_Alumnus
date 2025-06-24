import React, { useEffect, useState } from "react";
import SummaryCard from "./SummaryCard";
import axios from "axios";
import {
  FaBuilding,
  FaCheckCircle,
  FaFileAlt,
  FaHourglassHalf,
  FaMoneyBillWave,
  FaTimesCircle,
  FaUsers,
} from "react-icons/fa";
import AmsChart5 from "../leave/AmsChart5";

const AdminSummary = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const summary = await axios.get(
          "http://localhost:5000/api/dashboard/summary",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSummary(summary.data);
      } catch (error) {
        if (error.response) {
          alert(error.response.data.error);
        }
        console.log(error.message);
      }
    };
    fetchSummary();
  }, []);

  if (!summary) {
    return (
      <div>
        <div className="flex items-center justify-center h-screen">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const totalLeaveApplications =
    summary.leaveSummary.approved +
    summary.leaveSummary.pending +
    summary.leaveSummary.rejected;

  return (
    <div className="p-6  bg-gray-100 min-h-screen">
      <h3 className="text-3xl text-center font-bold text-gray-800 mb-8">
        Dashboard Overview
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          icon={<FaUsers />}
          text="Total Employees"
          number={summary.totalEmployees}
          color="bg-teal-500"
        />
        <SummaryCard
          icon={<FaBuilding />}
          text="Total Departments"
          number={summary.totalDepartments}
          color="bg-yellow-500"
        />
        <SummaryCard
          icon={<FaMoneyBillWave />}
          text="Monthly Salary"
          number={summary.totalSalary}
          color="bg-red-500"
        />
      </div>

      <div className="mt-16">
        <h4 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Leave Details
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard
            icon={<FaFileAlt />}
            text="Leave Applied"
            number={totalLeaveApplications}
            color="bg-teal-600"
          />
          <SummaryCard
            icon={<FaCheckCircle />}
            text="Leave Approved"
            number={summary.leaveSummary.approved}
            color="bg-green-500"
          />
          <SummaryCard
            icon={<FaHourglassHalf />}
            text="Leave Pending"
            number={summary.leaveSummary.pending}
            color="bg-yellow-500"
          />
          <SummaryCard
            icon={<FaTimesCircle />}
            text="Leave Rejected"
            number={summary.leaveSummary.rejected}
            color="bg-red-500"
          />
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-6">
          <h5 className="text-lg font-semibold text-gray-700 text-center mb-4">
            Leave Status Distribution
          </h5>
          <AmsChart5
            data={[
              { category: "Approved", value: summary.leaveSummary.approved },
              { category: "Pending", value: summary.leaveSummary.pending },
              { category: "Rejected", value: summary.leaveSummary.rejected },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;
