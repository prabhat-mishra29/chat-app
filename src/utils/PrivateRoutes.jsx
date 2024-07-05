import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

const PrivateRoutes = () => {
    const {user} = useAuth();
  return (
    // If the user is present,we will pass routes to the child components otherwise it will go to "login" page.
    // An <Outlet> should be used in parent route elements to render their child route elements. This allows nested UI to show up when child routes are rendered 
    <>
      {user ? <Outlet/> : <Navigate to="/register"/>}
    </>
  )
}

export default PrivateRoutes