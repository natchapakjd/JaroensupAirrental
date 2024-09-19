import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Home from "./pages/common/Home";
import Login from "./pages/Authentication/Login";
import Register from "./pages/Authentication/Register";
import Dashboard from "./DashboardPage/Dashboard";
import Contact from "./pages/common/Contact";
import Noti from "./pages/common/Noti";
import WorkExperience from "./pages/common/WorkExperience";
import ProtectedRoute from "./authentication/ProtectedRoute";
import PageNotFound from "./authentication/PageNotFound";
import ProductDetails from "./pages/Products/ProductDetails";
import Service from "./pages/Services/Service";
import RentAC from "./pages/Services/RentAC";
import Checkout from "./pages/Products/Checkout";
import AddToCart from "./pages/Products/AddToCart";
import Product from "./pages/Products/Product";
import { CartProvider } from "./context/CartContext"; 
import UserHistory from "./pages/History/UserHistory";
import ProfileSetting from "./pages/Settings/ProfileSetting";
import Settings from "./pages/Settings/Settings";

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
    element: <PageNotFound />,
  },
  {
    path: "/service/rental/:id",
    element: <RentAC />,
  },
  {
    path: "/product/:id",
    element: <ProductDetails />,
  },
  {
    path: "/services",
    element: <Service />,
  },
  {
    path: "/add-to-cart",
    element: <AddToCart />,
  },
  {
    path: "/checkout",
    element: (
      <ProtectedRoute>
        <Checkout />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile-setting",
    element: <ProfileSetting />,
  },
  {
    path: "/history",
    element: <UserHistory />,
  },
  {
    path: "/settings",
    element: <Settings />,
  }
]);

// Render the application
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </React.StrictMode>
);
