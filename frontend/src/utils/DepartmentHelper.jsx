import axios from "axios";
import { useNavigate } from "react-router-dom";

export const columns = [
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
    selector: (row) => row.action,
  },
];

export const DepartmentButtons = ({ _id, onDepartmentDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const confirm = window.confirm("Do you want to delete?");
    if (confirm) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/department/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          onDepartmentDelete(id); // Update state in parent component
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      }
    }
  };

  return (
    <div className="flex gap-3">
      <button
        className="px-4 py-2 rounded-md bg-teal-600 hover:bg-teal-700 text-white font-medium shadow-sm transition duration-200 cursor-pointer"
        onClick={() => navigate(`/admin-dashboard/department/${_id}`)}
      >
        Edit
      </button>

      <button
        className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm transition duration-200 cursor-pointer"
        onClick={() => handleDelete(_id)}
      >
        Delete
      </button>
    </div>
  );
};
