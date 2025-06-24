import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const LeaveDetail = () => {
  const { id } = useParams();
  const [leave, SetLeave] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/leave/detail/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          SetLeave(response.data.leave);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      }
    };
    fetchLeave();
  }, []);

  const changeStatus = async (id, status) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/leave/${id}`, {status},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        navigate('/admin-dashboard/leaves')
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  }

  return (
    <>
      {leave ? (
        <div className=" flex items-center justify-center bg-gray-100">
        <div className="max-w-5xl mx-auto mt-12 bg-white p-10 rounded-xl shadow-md">
          <h2 className="text-3xl font-bold mb-10 text-center">
            Leave Details
          </h2>

          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="flex-shrink-0 self-center md:self-start">
              <img
                src={`http://localhost:5000/${leave.employeeId.userId.profileImage}`}
                alt="Employee"
                className="rounded-2xl border-4 border-gray-300 w-40 h-60 object-cover"
              />
            </div>

            <div className="flex-1 flex flex-col gap-2 ">
              <div className="flex">
                <p className="font-semibold w-40">Name:</p>
                <p>{leave.employeeId.userId.name}</p>
              </div>
              <div className="flex">
                <p className="font-semibold w-40">Employee ID:</p>
                <p>{leave.employeeId.employeeId}</p>
              </div>
              <div className="flex">
                <p className="font-semibold w-40">Leave Type:</p>
                <p>{leave.leaveType}</p>
              </div>
              <div className="flex">
                <p className="font-semibold w-40">Reason:</p>
                <p>{leave.reason}</p>
              </div>
              <div className="flex">
                <p className="font-semibold w-40">Department:</p>
                <p>{leave.employeeId.department.dep_name}</p>
              </div>
              <div className="flex">
                <p className="font-semibold w-40">Start Date:</p>
                <p>{new Date(leave.startDate).toLocaleDateString()}</p>
              </div>
              <div className="flex">
                <p className="font-semibold w-40">End Date:</p>
                <p>{new Date(leave.endDate).toLocaleDateString()}</p>
              </div>
              <div className="flex">
                <p className="font-semibold w-40">
                  {leave.status === "Pending" ? "Action" : "Status"}
                </p>
                {leave.status === "Pending"? 
                  (
                    <div className="flex space-x-2">
                      <button className=" px-1 py-0.5 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition cursor-pointer"
                      onClick={() => changeStatus(leave._id, "Approved")}>Approve</button>
                      <button className="px-3 py-0.5 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 transition cursor-pointer"
                      onClick={() => changeStatus(leave._id, "Rejected")}>Reject</button>

                    </div>
                  ):
                  <p>{leave.status}</p>
                }
              </div>
            </div>
          </div>
        </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        </div>
      )}
    </>
  );
};

export default LeaveDetail;
