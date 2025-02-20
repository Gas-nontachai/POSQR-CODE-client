import React, { useState } from "react";

const AddUserForm = () => {
    const [formData, setFormData] = useState({
        user_fullname: "",
        user_email: "",
        user_phone: "",
        user_img: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission (e.g., call an API to add the user)
        console.log("User added:", formData);
        // closeDialog(); // Close the dialog after submission
    };

    return (
        <>
            <h2 className="text-xl mb-4">Add New User</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="user_fullname" className="block text-sm font-medium text-gray-700">
                        Full Name
                    </label>
                    <input
                        type="text"
                        name="user_fullname"
                        value={formData.user_fullname}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="user_email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        name="user_email"
                        value={formData.user_email}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="user_phone" className="block text-sm font-medium text-gray-700">
                        Phone
                    </label>
                    <input
                        type="text"
                        name="user_phone"
                        value={formData.user_phone}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="user_img" className="block text-sm font-medium text-gray-700">
                        Image URL
                    </label>
                    <input
                        type="file"
                        name="user_img"
                        value={formData.user_img}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add User
                    </button>
                </div>
            </form>
        </>
    );
};

export default AddUserForm;
