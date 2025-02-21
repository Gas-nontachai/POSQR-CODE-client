import React from 'react';

const CustomerHomePage = () => {
    return (
        <div className="bg-green-500 h-screen flex flex-col items-center justify-center text-white">
            <img className="w-72 h-auto mb-6" src="your-image-url.jpg" alt="description" />
            <h1 className="text-2xl mb-6">Welcome to the Customer Home Page</h1>
            <button className="px-16 py-2 bg-white text-green-500 rounded-md hover:bg-green-700 hover:text-white">
                Click Me
            </button>
        </div>
    );
}

export default CustomerHomePage;
