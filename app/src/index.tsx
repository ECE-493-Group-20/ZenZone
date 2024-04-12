/**
 * FR1 - User.Register
 * FR2 - User.Authenticate
 * FR12 - Admin.Register
 * FR13 - Admin.Authenticate
 * 
 * This is used to navigate to the different screens for authentication 
 */

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthProvider } from "./components/authentication/AuthProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {UserSignIn, UserSignUp, AdminSignUp} from './components/authentication/Authentication';
import { AdminFeatContext, AdminFeatProvider, useAdminFeat } from './components/admin/AdminFeatProvider';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/signin",
    element: <UserSignIn />
  },
  {
    path: "/register",
    element: <UserSignUp />
  },
  {
    path: "/adminregister",
    element: <AdminSignUp />
  }
    
])

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <AdminFeatProvider>
        <RouterProvider router = {router} />
      </AdminFeatProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);