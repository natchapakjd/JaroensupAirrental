import React from 'react'

const Loading = () => {
    return (
        <>
          <div className="flex justify-center items-center h-screen">
          <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-t-4 border-blue-500"></div>
        </div>
        </>
      ); 
    
}

export default Loading