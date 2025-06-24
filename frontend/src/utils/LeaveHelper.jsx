import React from "react";
import { useNavigate } from "react-router-dom";

export const columns = [
  {
    name: "Sl. No.",
    selector: (row) => row.sno,
    width: "120px",
    cell: row => <h3> {row.sno} </h3>,
    sortable: true,
  },
  {
    name: "Name",
    selector: (row) => row.name,
    width: "140px",
    cell: row => <h3> {row.name} </h3>,
    sortable: true,
  },
  {
    name: "Leave Type",
    selector: (row) => row.leaveType,
    width: "120px",
  },
  {
    name: "Department",
    selector: (row) => row.department,
    width: "140px",
  },
  {
    name: "Days",
    selector: (row) => row.days,
    width: "90px",
  },
  {
    name: "Status",
    selector: (row) => row.status,
    width: "120px",
  },
  {
    name: "Action",
    selector: (row) => row.action,
  },
];

export const LeaveButtons = ({ Id }) => {
  const navigate = useNavigate();

  const handleView = (id) => {
    navigate(`/admin-dashboard/leaves/${id}`);
  };

  return (
    <button
      className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition duration-200 cursor-pointer"
      onClick={() => handleView(Id)}
    >
      View Detail
    </button>
  );
};
