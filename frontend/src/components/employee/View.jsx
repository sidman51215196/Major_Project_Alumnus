import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const View = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/employee/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          setEmployee(response.data.employee);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      }
    };
    fetchEmployee();
  }, []);

  return (
    <>
      {employee ? (
        <div className=" flex items-center justify-center bg-gray-100">
        <div className="max-w-5xl mx-auto mt-12 bg-white p-10 rounded-xl shadow-md">
          <h2 className="text-3xl font-bold mb-10 text-center">
            Employee Details
          </h2>

          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Left: Profile Image */}
            <div className="flex-shrink-0 self-center md:self-start">
              <img
                src={`http://localhost:5000/${employee?.userId?.profileImage}`}
                alt="Employee"
                className="rounded-2xl border-4 border-gray-300 w-40 h-60 object-cover"
              />
            </div>

            {/* Right: Employee Details */}
            <div className="flex-1 flex flex-col gap-6 ">
              <div className="flex">
                <p className="font-semibold w-40">Name:</p>
                <p>{employee?.userId?.name}</p>
              </div>
              <div className="flex">
                <p className="font-semibold w-40">Employee ID:</p>
                <p>{employee?.employeeId}</p>
              </div>
              <div className="flex">
                <p className="font-semibold w-40">Date of Birth:</p>
                <p>
                  {employee?.dob
                    ? new Date(employee.dob).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div className="flex">
                <p className="font-semibold w-40">Gender:</p>
                <p>{employee?.gender}</p>
              </div>
              <div className="flex">
                <p className="font-semibold w-40">Department:</p>
                <p>{employee?.department?.dep_name}</p>
              </div>
              <div className="flex">
                <p className="font-semibold w-40">Marital Status:</p>
                <p>{employee?.martialStatus}</p>
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

export default View;
