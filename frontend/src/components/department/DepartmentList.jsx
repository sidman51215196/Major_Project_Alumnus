import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import axios from "axios";
import { DepartmentButtons } from "../../utils/DepartmentHelper";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [depLoading, setDepLoading] = useState(false);
  const [filteredDepartments, setFilteredDepartments] = useState([])

  const onDepartmentDelete = (id) => {
    setDepartments((prev) => {
      const updated = prev.filter((dep) => dep._id !== id);
      setFilteredDepartments((prevFiltered) => prevFiltered.filter((dep) => dep._id !== id));
      return updated;
    });
  };
  

  const columns = [
    {
      name: "S No",
      selector: (row) => row.sno,
    },
    {
      name: "Department Name",
      selector: (row) => row.dep_name,
    },
    {
      name: "Action",
      cell: (row) => <DepartmentButtons _id={row._id} onDepartmentDelete={onDepartmentDelete} />,
    },
  ];

  useEffect(() => {
    const fetchDepartments = async () => {
      setDepLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/department", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          let sno = 1;
          const data = response.data.departments.map((dep) => ({
            _id: dep._id,
            sno: sno++,
            dep_name: dep.dep_name,
            action: (<DepartmentButtons Id={dep._id} onDepartmentDelete={onDepartmentDelete}/>)
          }));
          setDepartments(data);
          setFilteredDepartments(data)
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } finally {
        setDepLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const filterDepartments = (e) => {
    const records = departments.filter((dep) =>
    dep.dep_name.toLowerCase().includes(e.target.value.toLowerCase())) 

    setFilteredDepartments(records)
  }

  return (
    <>
      {depLoading ? (
        <div>
          <div className="flex items-center justify-center h-screen">
            <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-8 bg-white shadow-lg rounded-xl">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-extrabold text-gray-800 tracking-tight">Manage Departments</h3>
            <p className="text-sm text-gray-500 mt-2">Search, filter, and manage all company departments.</p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Search Departments"
              className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              onChange={filterDepartments}
            />
            <Link
              to="/admin-dashboard/add-department"
              className="inline-block px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-sm transition"
            >
              Add New Department
            </Link>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
            <DataTable columns={columns} data={filteredDepartments} pagination />
          </div>
        </div>

      )}
    </>
  );
};

export default DepartmentList;
