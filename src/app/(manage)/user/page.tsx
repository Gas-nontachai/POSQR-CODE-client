"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { User } from "@/types/user";
import AddUserForm from "@/components/User/AddUserForm";

const ManageUserPage = () => {
  const { getUserBy } = useUser();
  const [userData, setUserData] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const res = await getUserBy();
    setUserData(res);
  };

  return (
    <>
      <div className="container mx-auto mt-10">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsDialogOpen(!isDialogOpen)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            + Add
          </button>
        </div>

        {isDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={() => setIsDialogOpen(false)} >
            <div className="bg-white p-6 rounded-lg w-4/5 max-w-4xl relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setIsDialogOpen(false)}
                className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded absolute top-5 right-5"
              > X </button>
              <AddUserForm />
            </div>
          </div>
        )}


        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2 border">User ID</th>
                <th className="px-4 py-2 border">Image</th>
                <th className="px-4 py-2 border">Full Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((item) => (
                <tr key={item.user_id} className="border-b">
                  <td className="px-4 py-2">{item.user_id}</td>
                  <td className="px-4 py-2">
                    <img
                      src={item.user_img}
                      alt={item.user_fullname}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  </td>
                  <td className="px-4 py-2">{item.user_fullname}</td>
                  <td className="px-4 py-2">{item.user_email}</td>
                  <td className="px-4 py-2">{item.user_phone}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded">
                        Edit
                      </button>
                      <button className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ManageUserPage;
