import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import { BiSolidHide, BiShow } from 'react-icons/bi';

const LOCAL_STORAGE_KEY = 'changePasswordDraft';

const Setting = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [setting, setSetting] = useState({
    userId: user._id,
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const savedDraft = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.userId === user._id) {
          setSetting(parsed);
        }
      } catch (e) {
        console.error("Corrupted draft in localStorage:", e);
      }
    }
  }, [user._id]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(setting));
  }, [setting]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSetting({ ...setting, [name]: value });
  };

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (setting.newPassword !== setting.confirmPassword) {
      setError("New password and Confirm password are different");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/api/setting/change-password",
        setting,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setError("");
        navigate("/login");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };

  const inputContainer = `relative mb-6`;
  const inputField = `mt-1 p-2 block w-full border border-gray-300 rounded-md pr-10`;
  const iconBtn = `absolute right-3 top-9 text-gray-500 hover:text-gray-700 cursor-pointer`;

  const renderPasswordField = (label, name, value, show, toggleFunc) => (
    <div className={inputContainer}>
      <label className='block text-sm font-medium text-gray-700'>{label}</label>
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={label}
        className={inputField}
        required
      />
      <span onClick={() => toggleFunc(name)} className={iconBtn}>
        {show ? <BiSolidHide size={20} /> : <BiShow size={20} />}
      </span>
    </div>
  );

  return (
    <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
      <h2 className='text-2xl font-bold mb-6 text-center'>Change Password</h2>
      <p className='text-red-600 mb-6'>{error}</p>
      <form onSubmit={handleSubmit}>
        <div>
          {renderPasswordField("Old Password", "oldPassword", setting.oldPassword, showPassword.old, () => togglePassword("old"))}
          {renderPasswordField("New Password", "newPassword", setting.newPassword, showPassword.new, () => togglePassword("new"))}
          {renderPasswordField("Confirm Password", "confirmPassword", setting.confirmPassword, showPassword.confirm, () => togglePassword("confirm"))}
        </div>

        <button
          type='submit'
          className='w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded cursor-pointer'
        >
          Edit Password
        </button>
      </form>
    </div>
  );
};

export default Setting;
