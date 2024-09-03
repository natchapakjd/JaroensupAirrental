import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import UserContent from '../Dashboard/UserContent'
const Dashboard = () => {
  return (
    <>
    <div className='flex '>
        <Sidebar/>
        <div className='w-full' >
            <Header className='mb-5'/>
            <UserContent/>
        </div>
    </div>
   
    </>
  )
}

export default Dashboard