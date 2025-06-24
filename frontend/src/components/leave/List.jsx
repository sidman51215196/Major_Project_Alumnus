import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/authContext";

const List = () => {
  const [leaves, setLeaves] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  let sno = 1;
  const { id } = useParams();
  const { user } = useAuth();

  const fetchLeaves = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/leave/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        setLeaves(response.data.leaves);
      }
    } catch (error) {
      if (error.response && error.response.status !== 404) {
        alert(error.message);
      }
      setLeaves([]);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  if (!leaves) {
    return (
      <div>
        <div className="flex items-center justify-center h-screen">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const filteredLeaves = leaves.filter((leave) =>
    `${leave.leaveType} ${leave.reason} ${leave.status}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-white shadow-lg rounded-xl">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          List of Applied Leaves
        </h3>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Leaves"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
        />
        {user.role === "employee" && (
          <Link
            to="/employee-dashboard/add-leave"
            className="inline-block px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-sm transition"
          >
            Apply New Leave
          </Link>
        )}
      </div>

      <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden text-sm">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-6 py-3 text-left">SNO</th>
            <th className="px-6 py-3 text-left">Leave Type</th>
            <th className="px-6 py-3 text-left">From</th>
            <th className="px-6 py-3 text-left">To</th>
            <th className="px-6 py-3 text-left">Description</th>
            <th className="px-6 py-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 divide-y divide-gray-200">
          {filteredLeaves.length > 0 ? (
            filteredLeaves.map((leave) => (
              <tr
                key={leave._id}
                className="hover:bg-teal-50 transition-colors duration-200"
              >
                <td className="px-6 py-3">{sno++}</td>
                <td className="px-6 py-3">{leave.leaveType}</td>
                <td className="px-6 py-3">
                  {new Date(leave.startDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-3">
                  {new Date(leave.endDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-3">{leave.reason}</td>
                <td className="px-6 py-3">{leave.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default List;
