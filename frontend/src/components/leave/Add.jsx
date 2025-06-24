import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LOCAL_STORAGE_KEY = 'leaveFormDraft';

const Add = () => {
  const { user } = useAuth();

  const [leave, setLeave] = useState({
    userId: user._id,
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const savedDraft = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        if (parsedDraft.userId === user._id) {
          setLeave(parsedDraft);
        }
      } catch (e) {
        console.error("Invalid draft in localStorage");
      }
    }
  }, [user._id]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(leave));
  }, [leave]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeave((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { startDate, endDate } = leave;

    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      alert("From Date cannot be later than To Date.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/leave/add`,
        leave,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        navigate(`/employee-dashboard/leaves/${user._id}`);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };

  return (
    <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
      <h2 className="text-2xl font-bold mb-6">Request for Leave</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-4">
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Leave Type
            </label>
            <select
              name="leaveType"
              value={leave.leaveType}
              onChange={handleChange}
              className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
              required
            >
              <option value="">Select Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Annual Leave">Annual Leave</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                From Date
              </label>
              <input
                type="date"
                name='startDate'
                value={leave.startDate}
                onChange={handleChange}
                className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                To Date
              </label>
              <input
                type="date"
                name='endDate'
                value={leave.endDate}
                onChange={handleChange}
                className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
              />
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Description
            </label>
            <textarea
              name="reason"
              value={leave.reason}
              placeholder='Reason'
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-2xl p-1.5'
            ></textarea>
          </div>
        </div>
        <button
          type='submit'
          className='w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded cursor-pointer'
        >
          Add Leave
        </button>
      </form>
    </div>
  );
};

export default Add;
