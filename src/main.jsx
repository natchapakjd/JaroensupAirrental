import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./DashboardPage/Dashboard";
import Product from "./pages/Product";
import Contact from "./pages/Contact";
import Noti from "./pages/Noti";
import WorkExperience from "./pages/WorkExperience";
import ProtectedRoute from "./authentication/ProtectedRoute";
import AddProduct from "./DashboardContent/Products/AddProduct";
import PageNotFound from "./authentication/PageNotFound";
// Configure the router with routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/experience",
    element: <WorkExperience />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard/*",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/product",
    element: <Product />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/notification",
    element: <Noti />,
  },
  {
    path: "*",
    element: <PageNotFound/>
  }
  
]);

// Render the application
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
