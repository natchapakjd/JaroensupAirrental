import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import UserContent from '../DashboardContent/UserContent'
import ProductContent from '../DashboardContent/Products/ProductContent'
const Dashboard = () => {
  return (
    <>
    <div className='flex '>
        <Sidebar/>
        <div className='w-full' >
            {/* <Header className='mb-5'/> */}
            {/* <UserContent/> */}
            <ProductContent/>
        </div>
    </div>
   
    </>
  )
}

export default Dashboard