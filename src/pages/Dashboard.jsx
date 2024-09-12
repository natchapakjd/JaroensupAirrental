import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import UserContent from '../Dashboard/UserContent'
import ProductContent from '../Dashboard/ProductContent'
const Dashboard = () => {
  return (
    <>
    <div className='flex '>
        <Sidebar/>
        <div className='w-full' >
            <Header className='mb-5'/>
            {/* <UserContent/> */}
            <ProductContent/>
        </div>
    </div>
   
    </>
  )
}

export default Dashboard