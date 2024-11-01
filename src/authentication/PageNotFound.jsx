import React from 'react';

const PageNotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-6 bg-white shadow-md rounded-lg w-full max-w-md">
        <div className="text-6xl font-bold text-gray-600 mb-4">
          404
        </div>
        <div className="text-2xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </div>
        <div className="text-gray-600 mb-6">
          The page you are looking for might have been removed or is temporarily unavailable.
        </div>
        <a href="/" className="btn bg-blue text-white hover:bg-blue">Go to Home</a>
      </div>
    </div>
  );
}

export default PageNotFound;
