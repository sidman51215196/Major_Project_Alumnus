import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const LOCAL_STORAGE_KEY = "addDepartmentDraft";

const AddDepartment = () => {
  const [department, setDepartment] = useState({
    dep_name: '',
    description: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const savedDraft = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedDraft) {
      try {
        setDepartment(JSON.parse(savedDraft));
      } catch (e) {
        console.error("Corrupted department draft:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(department));
  }, [department]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/department/add', department, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        }
      });
      if (response.data.success) {
        // localStorage.removeItem(LOCAL_STORAGE_KEY);
        navigate("/admin-dashboard/departments");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };

  return (
    <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg'>
      <h2 className='text-3xl font-bold text-center mb-8 text-teal-600'>Add a New Department</h2>
      
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label htmlFor="dep_name" className='block text-lg font-medium text-gray-700 mb-2'>
            Department Name
          </label>
          <input
            type="text"
            name='dep_name'
            value={department.dep_name}
            onChange={handleChange}
            placeholder='Enter Department Name'
            className='w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
            required
          />
        </div>

        <div>
          <label htmlFor="description" className='block text-lg font-medium text-gray-700 mb-2'>
            Description
          </label>
          <textarea
            name="description"
            value={department.description}
            placeholder="Write a brief description of the department"
            onChange={handleChange}
            className='w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
            rows="4"
          />
        </div>

        <button
          type="submit"
          className='w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md focus:ring-2 focus:ring-teal-400 transition duration-200 cursor-pointer'
        >
          Add Department
        </button>
      </form>
    </div>
  );
}

export default AddDepartment;
