import axios from "axios";
import { useNavigate } from "react-router-dom";

export const columns=[
  {
    name: "Sl No",
    selector: (row) => row.sno,
    width: "80px",
    cell: row => <h3> {row.sno} </h3>,
    sortable: true,
  },
  {
    name: " Name",
    selector: (row) => row.name,
    width: "150px",
    cell: row => <h3> {row.name} </h3>,
    sortable: true,
  },
  {
    name: " Image",
    selector: (row) => row.profileImage,
    width: "100px"
  },
  {
    name: " Department",
    selector: (row) => row.dep_name,
    width: "150px"
  },
  {
    name: " DOB",
    selector: (row) => row.dob,
    width: "100px"
  },
  {
    name: "Action",
    selector: (row) => row.action,
  }
]


export const fetchDepartments = async () => {
  let departments
  try {
    const response = await axios.get("http://localhost:5000/api/department", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.data.success) {
      departments = response.data.departments
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    }
  }
  return departments
};

export const getEmployees = async (id) => {
  let employees
  try {
    const response = await axios.get(`http://localhost:5000/api/employee/department/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.data.success) {
      employees = response.data.employees
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    }
  }
  return employees
};

export const EmployeeButtons = ({ Id }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-3">
  <button
    className="px-4 py-2 rounded-md bg-teal-600 hover:bg-teal-700 text-white font-medium shadow-sm transition duration-200 cursor-pointer"
    onClick={() => navigate(`/admin-dashboard/employees/${Id}`)}
  >
    View
  </button>

  <button
    className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition duration-200 cursor-pointer"
    onClick={() => navigate(`/admin-dashboard/employees/edit/${Id}`)}
  >
    Edit
  </button>

  <button
    className="px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white font-medium shadow-sm transition duration-200 cursor-pointer"
    onClick={() => navigate(`/admin-dashboard/employees/salary/${Id}`)}
  >
    Salary
  </button>

  <button
    className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm transition duration-200 cursor-pointer"
    onClick={() => navigate(`/admin-dashboard/employees/leaves/${Id}`)}
  >
    Leave
  </button>
</div>

  );
};