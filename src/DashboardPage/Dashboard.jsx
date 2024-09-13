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

const Dashboard = () => {
  return (
      <div className='flex'>
        <Sidebar />
        
        <div className='w-full bg-gray-50'>
          <Header/>

          <Routes>
            <Route path="user" element={<UserContent />} />
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
