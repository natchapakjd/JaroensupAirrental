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
const Dashboard = () => {
  return (
      <div className='flex'>
        <Sidebar />
        
        <div className='w-full bg-gray-50'>
          <Header/>

          <Routes>
            <Route path="*" element={<PageNotFound />} />
            <Route path="home" element={<DashboardContent />} />
            <Route path="user" element={<UserContent />} />
            <Route path="brands" element={<BrandContent />} />
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

export default Dashboard
