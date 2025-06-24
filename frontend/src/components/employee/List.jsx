import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { columns, EmployeeButtons } from "../../utils/EmployeeHelper";
import DataTable from "react-data-table-component";

const List = () => {
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [filteredEmployee, setFilteredEmployees] = useState([])

  useEffect(() => {
    const fetchEmployees = async () => {
      setEmpLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/employee", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          let sno = 1;
          const data = response.data.employees.map((emp) => ({
            _id: emp._id,
            sno: sno++,
            dep_name: emp.department.dep_name,
            name: emp.userId.name,
            dob: new Date(emp.dob).toLocaleDateString(),
            profileImage: (
              <img
                width={40}
                className="rounded-full"
                src={`http://localhost:5000/${emp.userId.profileImage}`}
              />
            ),
            action: <EmployeeButtons Id={emp._id} />,
          }));
          setEmployees(data);
          setFilteredEmployees(data)
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } finally {
        setEmpLoading(false);
      }
    };
    fetchEmployees();
  }, []);


  const handleFilter = (e) => {
    const records= employees.filter((emp) => (
      emp.name.toLowerCase().includes(e.target.value.toLowerCase())
    ))
    setFilteredEmployees(records)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-white shadow-lg rounded-xl">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          Manage Employees
        </h3>
        <p className="text-sm text-gray-500 mt-2">
          View, filter, and add employees with ease.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search Employees"
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
          onChange={handleFilter}
        />
        <Link
          to="/admin-dashboard/add-employee"
          className="inline-block px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-sm transition"
        >
          Add New Employee
        </Link>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
        <DataTable columns={columns} data={filteredEmployee} pagination />
      </div>
    </div>
  );
};

export default List;
