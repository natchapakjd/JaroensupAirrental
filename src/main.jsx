import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Reward from "./pages/Reward";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Product from "./pages/Product"
import Contact from "./pages/Contact";
import Noti from "./pages/Noti";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/reward",
    element: <Reward/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/register",
    element: <Register/>,
  },
  {
    path: "/dashboard",
    element: <Dashboard/>
  },
  {
    path: "/product",
    element: <Product/>
  },
  {
    path: "/contact",
    element: <Contact/>
  },
  {
    path: "/notification",
    element: <Noti/>
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);