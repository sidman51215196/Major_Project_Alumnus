import React, { useEffect, useState } from 'react'
import { fetchDepartments } from '../../utils/EmployeeHelper'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BiSolidHide, BiShow } from "react-icons/bi";

const LOCAL_STORAGE_KEY = "addEmployeeDraft";

const Add = () => {

  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    const getDepartments = async () => {
      const departments = await fetchDepartments();
      setDepartments(departments);
    };
    getDepartments();

    const savedDraft = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedDraft) {
      try {
        setFormData(JSON.parse(savedDraft));
      } catch (e) {
        console.error("Error loading saved draft:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });

    try {
      const response = await axios.post('http://localhost:5000/api/employee/add', formDataObj, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.data.success) {
        localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear saved form data on success
        navigate("/admin-dashboard/employees");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };

  return (
    <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
      <h2 className='text-2xl font-bold mb-6 text-center'>Add New Employee</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Name */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              placeholder='Insert Name'
              className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              placeholder='Insert Email'
              className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
              required
            />
          </div>

          {/* Employee ID */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Employee ID
            </label>
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId || ''}
              onChange={handleChange}
              placeholder='Insert Employee ID'
              className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
              required
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob || ''}
              onChange={handleChange}
              placeholder='DOB'
              className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender || ''}
              onChange={handleChange}
              className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Martial Status */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Marital Status
            </label>
            <select
              name="martialStatus"
              value={formData.martialStatus || ''}
              onChange={handleChange}
              placeholder="Martial Status"
              className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
              required
            >
              <option value="">Select Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
            </select>
          </div>

          {/* Designation */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Designation
            </label>
            <input
              type="text"
              name="designation"
              value={formData.designation || ''}
              onChange={handleChange}
              placeholder='Designation'
              className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
              required
            />
          </div>

          {/* Department */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Department
            </label>
            <select
              name="department"
              value={formData.department || ''}
              onChange={handleChange}
              className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
              required
            >
              <option value="">Select Department</option>
              {departments.map(dep => (
                <option key={dep._id} value={dep._id}>{dep.dep_name}</option>
              ))}
            </select>
          </div>

          {/* Salary */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Salary
            </label>
            <input
              type="number"
              name="salary"
              value={formData.salary || ''}
              onChange={handleChange}
              placeholder='Salary'
              className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
              required
            />
          </div>

          {/* Password */}
          <div className='relative'>
  <label className='block text-sm font-medium text-gray-700'>
    Password
  </label>
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    value={formData.password || ''}
    onChange={handleChange}
    placeholder='********'
    className='mt-1 p-2 pr-10 block w-full border border-gray-300 rounded-md'
    required
  />
  <div
    className='absolute right-3 top-9 cursor-pointer text-gray-600 hover:text-gray-900 transition'
    onClick={() => setShowPassword((prev) => !prev)}
  >
    {showPassword ? <BiSolidHide size={20} /> : <BiShow size={20} />}
  </div>
</div>


          {/* Role */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Role
            </label>
            <select
              name="role"
              value={formData.role || ''}
              onChange={handleChange}
              className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          {/* Image */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Upload Image
            </label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              placeholder='Upload Image'
              accept='image/*'
              className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
              required
            />
          </div>

        </div>

        <button
          type='submit'
          className='w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded cursor-pointer'
        >
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default Add;
