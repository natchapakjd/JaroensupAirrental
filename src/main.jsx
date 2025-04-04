import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Home from "./pages/common/Home";
import Login from "./pages/Authentication/Login";
import Register from "./pages/Authentication/Register";
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
import ChangePassword from "./pages/Settings/ChangePassword";
import Review from "./pages/Review/Review";
import OrderDetails from "./pages/History/OrderDetails";
import LineProfile from "./pages/Settings/LineProfile";
import RegisterToTech from "./pages/Authentication/RegisterToTech";
import DashboardRoute from "./DashboardPage/DashboardRoute";
import { AuthProvider } from "./context/AuthContext";
import Payment from "./pages/Payment/Payment";
import XrGallaryContainer from "./AugmentedReality/containers/ARContainer";
import WorkExperienceDetails from "./pages/common/WorkExperienceDetails";
import TaskDetails from "./pages/History/TaskDetails";
import TaskImages from "./pages/History/TaskImages";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import ResetPassword from "./pages/Authentication/ResetPassword";
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
        <DashboardRoute />
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
    element: (
      <ProtectedRoute>
        <RentAC />
      </ProtectedRoute>
    ),
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
    element: (
      <ProtectedRoute>
        <AddToCart />
      </ProtectedRoute>
    ),
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
  },
  {
    path: "/change-password",
    element: <ChangePassword />,
  },
  {
    path: "/review/:taskId",
    element: <Review />,
  },
  {
    path: "/order-history/:orderId",
    element: <OrderDetails />,
  },
  {
    path: "/line-profile",
    element: <LineProfile />,
  },
  {
    path: "/register-tech",
    element: <RegisterToTech />,
  },
  {
    path: "/payment/:paymentId",
    element: <Payment />,
  },
  {
    path: "/augmented-reality",
    element: <XrGallaryContainer />,
  },
  {
    path: "/experience/:expId",
    element: <WorkExperienceDetails/>,
  },
  {
    path: "/task/:taskId",
    element: <TaskDetails/>,
  },
  {
    path: "/task/edit-img/:taskId",
    element: <TaskImages/>,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword/>,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword/>,
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </CartProvider>
  </React.StrictMode>
);
