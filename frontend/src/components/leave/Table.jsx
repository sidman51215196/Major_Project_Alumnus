import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { columns, LeaveButtons } from "../../utils/LeaveHelper";

const Table = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Pending");

  const fetchleaves = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/leave", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        let sno = 1;
        const data = response.data.leaves.map((leave) => ({
          _id: leave._id,
          sno: sno++,
          employeeId: leave.employeeId.employeeId,
          name: leave.employeeId.userId.name,
          leaveType: leave.leaveType,
          department: leave.employeeId.department.dep_name,
          days:
            new Date(leave.endDate).getDate() -
            new Date(leave.startDate).getDate(),
          status: leave.status,
          action: <LeaveButtons Id={leave._id} />,
        }));

        const pendingLeaves = data.filter(
          (leave) => leave.status === "Pending"
        );

        setLeaves(data);
        setFilteredLeaves(pendingLeaves);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };

  useEffect(() => {
    fetchleaves();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchQuery(value);

    const filtered = leaves.filter(
      (leave) =>
        leave.name.toLowerCase().includes(value) ||
        leave.employeeId.toLowerCase().includes(value) ||
        leave.leaveType.toLowerCase().includes(value) ||
        leave.department.toLowerCase().includes(value)
    );
    setFilteredLeaves(filtered);
  };

  const filterByButton = (status) => {
    setFilterStatus(status);
    const filtered = leaves.filter((leave) =>
      leave.status.toLowerCase().includes(status.toLowerCase())
    );
    setFilteredLeaves(filtered);
  };

  return (
    <>
      {leaves.length > 0 ? (
        <div className="">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold">
                Employee Leaves ({filterStatus})
              </h3>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search by id, name or department"
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 w-full md:w-1/3"
              />
              <div className="flex gap-3">
                <button
                  className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition cursor-pointer"
                  onClick={() => {
                    setFilterStatus("All");
                    setFilteredLeaves(leaves);
                  }}
                >
                  All
                </button>
                <button
                  className="px-4 py-2 bg-yellow-400 text-white font-medium rounded-md hover:bg-yellow-500 transition cursor-pointer"
                  onClick={() => filterByButton("Pending")}
                >
                  Pending
                </button>
                <button
                  className="px-4 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition cursor-pointer"
                  onClick={() => filterByButton("Approved")}
                >
                  Approved
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 transition cursor-pointer"
                  onClick={() => filterByButton("Rejected")}
                >
                  Rejected
                </button>
              </div>
            </div>

            <div className="bg-white shadow overflow-x-auto">
              <DataTable columns={columns} data={filteredLeaves} pagination highlightOnHover pointerOnHover />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-center h-screen">
            <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default Table;
