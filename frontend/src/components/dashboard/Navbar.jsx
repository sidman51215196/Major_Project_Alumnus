import React from "react";
import { useAuth } from "../../context/authContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-teal-700 shadow-md px-6 py-3 flex items-center justify-between text-white">
      <div className="text-lg font-semibold tracking-wide">
        Welcome back, <span className="text-yellow-300">{user.name}</span> 
      </div>
      <button
        onClick={logout}
        className="bg-white text-teal-700 hover:bg-yellow-300 hover:text-teal-900 transition-colors duration-200 font-medium px-4 py-1.5 rounded-md shadow-sm cursor-pointer"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;


// import React from "react";
// import { useAuth } from "../../context/authContext";
// import { useThemeContext } from "../../context/ThemeContext";
// import { Brightness4, Brightness7 } from "@mui/icons-material"; // for the icon flair

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const { mode, toggleTheme } = useThemeContext();

//   return (
//     <nav className="bg-teal-700 shadow-md px-6 py-3 flex items-center justify-between text-white">
//       <div className="flex items-center gap-4">
//         <div className="text-lg font-semibold tracking-wide">
//           Welcome back, <span className="text-yellow-300">{user.name}</span>
//         </div>
//         <button
//           onClick={toggleTheme}
//           className="ml-4 bg-white text-teal-700 hover:bg-yellow-300 hover:text-teal-900 transition-colors duration-200 font-medium px-3 py-1.5 rounded-md shadow-sm cursor-pointer flex items-center gap-1"
//         >
//           {mode === "light" ? <Brightness4 /> : <Brightness7 />}
//           {mode === "light" ? "Dark" : "Light"} Mode
//         </button>
//       </div>
//       <button
//         onClick={logout}
//         className="bg-white text-teal-700 hover:bg-yellow-300 hover:text-teal-900 transition-colors duration-200 font-medium px-4 py-1.5 rounded-md shadow-sm cursor-pointer"
//       >
//         Logout
//       </button>
//     </nav>
//   );
// };

// export default Navbar;

