import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import UserContent from '../DashboardContent/Users/UserContent'
import ProductContent from '../DashboardContent/Products/ProductContent'
import AddProduct from '../DashboardContent/Products/AddProduct'
import EditProduct from '../DashboardContent/Products/EditProducts'
import CategoryContent from '../DashboardContent/Categories/CategoryContent'
import AddCategory from '../DashboardContent/Categories/AddCategory'
import AddUser from '../DashboardContent/Users/AddUser'
import UserDetails from '../DashboardContent/Users/UserDetails'
import EditUser from '../DashboardContent/Users/EditUser'
import PageNotFound from '../authentication/PageNotFound'
import BrandContent from '../DashboardContent/Brands/BrandContent'
import AddBrand from '../DashboardContent/Brands/AddBrand'
import WarehouseContent from '../DashboardContent/Warehouses/WarehouseContent'
import AddWarehouse from '../DashboardContent/Warehouses/AddWarehouse'
import AddAttribute from '../DashboardContent/Attributes/AddAttribute'
import AttributeContent from '../DashboardContent/Attributes/AttributeContent'
import DashboardContent from './DashboardContent'
import ThreeScene from '../DashboardContent/AugmentedReality/ThreeScene'
import ReportContent from '../DashboardContent/Reports/ReportContent'
import TaskContent from '../DashboardContent/Tasks/TaskContent'
import AddTask from '../DashboardContent/Tasks/AddTask'
import EditTask from '../DashboardContent/Tasks/EditTask'
import TaskDetails from '../DashboardContent/Tasks/TaskDetails'
import AssignTask from '../DashboardContent/Tasks/AssignTask'
import HistoryLogContent from '../DashboardContent/History-logs/HistoryLogContent'
import PaymentContent from '../DashboardContent/Payments/PaymentContent'
import ReviewContent from '../DashboardContent/Reviews/ReviewContent'
import AddPayment from '../DashboardContent/Payments/AddPayment'
import EditPayment from '../DashboardContent/Payments/EditPayment'
import OrderContent from '../DashboardContent/Orders/OrderContent'
import OrderDetails from '../DashboardContent/Orders/OrderDetails'
import AddOrder from '../DashboardContent/Orders/AddOrder'
import EditOrder from '../DashboardContent/Orders/EditOrder'
import ApplicantContent from '../DashboardContent/TechnicianApplicants/ApplicantContent'
import ApplicantDetails from '../DashboardContent/TechnicianApplicants/ApplicantDetails'
import ChangePassword from '../pages/Settings/ChangePassword'
import ProfileSetting from '../pages/Settings/ProfileSetting'
import LineProfile from '../pages/Settings/LineProfile'

const DashboardRoute = () => {
  return (
      <div className='flex'>
        <Sidebar />
        <div className='w-full bg-gray-50'>
          <Header/>
          <Routes>
            <Route path="*" element={<PageNotFound />} />
            <Route path="home" element={<DashboardContent />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="profile" element={<ProfileSetting />} />
            <Route path="line-notification" element={<LineProfile />} />
            <Route path="tasks" element={<TaskContent />} />
            <Route path="tasks/assign" element={<AssignTask />} />
            <Route path="tasks/:taskId" element={<TaskDetails />} />
            <Route path="applicants" element={<ApplicantContent />} />
            <Route path="applicants/:id" element={<ApplicantDetails />} />
            <Route path="history-log" element={<HistoryLogContent />} />
            <Route path="reviews" element={<ReviewContent />} />
            <Route path="payments" element={<PaymentContent />} />
            <Route path="payments/add" element={<AddPayment />} />
            <Route path="payments/edit/:paymentId" element={<EditPayment />} />
            <Route path="orders" element={<OrderContent />} />
            <Route path="orders/details/:orderId" element={<OrderDetails/>} />
            <Route path="orders/add" element={<AddOrder />} />
            <Route path="orders/edit/:orderId" element={<EditOrder />} />
            <Route path="tasks/add" element={<AddTask />} />
            <Route path="tasks/edit/:taskId" element={<EditTask />} />
            <Route path="user" element={<UserContent />} />
            <Route path="brands" element={<BrandContent />} />
            <Route path="augmented-reality" element={<ThreeScene />} />
            <Route path="analytics" element={<ReportContent />} />
            <Route path="brand/add" element={<AddBrand />} />
            <Route path="warehouses" element={<WarehouseContent />} />
            <Route path="warehouse/add" element={<AddWarehouse />} />
            <Route path="attributes" element={<AttributeContent />} />
            <Route path="attribute/add" element={<AddAttribute />} />
            <Route path="user/add" element={<AddUser />} />
            <Route path="user/edit/:userId" element={<EditUser/>} />
            <Route path="user/:userId" element={<UserDetails/>} />
            <Route path="products" element={<ProductContent />} />
            <Route path="categories" element={<CategoryContent />} />
            <Route path="category/add" element={<AddCategory />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/edit/:productId" element={<EditProduct />} /> 
          </Routes>
        </div>
      </div>
  )
}

export default DashboardRoute
