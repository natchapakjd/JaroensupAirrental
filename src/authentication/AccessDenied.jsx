import React from 'react';

const AccessDenied = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-6 bg-white shadow-md rounded-lg w-full max-w-md">
        <div className="text-3xl font-bold text-red-600 mb-4">
          Access Denied
        </div>
        <div className="text-gray-700 mb-6">
          You do not have permission to access this page.
        </div>
        <a href="/" className="btn btn-primary">Go to Home</a>
      </div>
    </div>
  );
}

export default AccessDenied;
