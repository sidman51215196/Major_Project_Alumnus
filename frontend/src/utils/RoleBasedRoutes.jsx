import React from 'react'
import { useAuth } from '../context/authContext'
import { Navigate } from 'react-router-dom'

const RoleBasedRoutes = ({children, requiredRole}) => {
  const {user, loading}= useAuth()
  
  if(loading){
    return (
      <div>
        <div className="flex items-center justify-center h-screen">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if(!requiredRole.includes(user.role)){
    <Navigate to= "/unauthorized" />
  }

  return user ? children : <Navigate to= "/login" />
}

export default RoleBasedRoutes