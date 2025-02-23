"use client";
import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@/hooks/useUser";
import { User } from "@/types/user";
import AddUserForm from "@/components/(Manage)/User/AddUserForm";
import UpdateUserForm from "@/components/(Manage)/User/UpdateUserForm";

import { Add, AccountBox } from '@mui/icons-material';
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { API_URL } from "@/utils/config";

const ManageUserPage = () => {
  const { getUserBy, deleteUserBy } = useUser();
  const [userData, setUserData] = useState<User[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const ref_user_id = useRef('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const res = await getUserBy();
    setUserData(res);
  };

  const DialogUpdate = async (user_id: string) => {
    setIsUpdateDialogOpen(true);
    ref_user_id.current = user_id;
  };

  const onDelete = (user_id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteUserBy({ user_id: user_id });
        Swal.fire(
          'Deleted!',
          'The user has been deleted.',
          'success'
        );
        fetchUserData();
      }
    });
  };

  return (
    <>
      <div className="container mx-auto p-6 w-3/4 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between">
          <h1 className="text-xl font-bold text-gray-700 flex items-center">
            <AccountBox className="w-10 h-10 mr-2" /> User List
          </h1>
          <div>
            <button
              onClick={() => setIsAddDialogOpen(!isAddDialogOpen)}
              className="bg-green-500 flex items-center text-white font-bold px-5 py-2 rounded-md hover:bg-green-600"
            >
              Add
            </button>
          </div>
        </div>
        <div className="overflow-x-auto mt-5">
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead className="bg-gray-600 text-white uppercase">
              <tr>
                <th className="px-4 py-2 text-left font-bold">User ID</th>
                <th className="px-4 py-2 text-left font-bold">Image</th>
                <th className="px-4 py-2 text-left font-bold">Full Name</th>
                <th className="px-4 py-2 text-left font-bold">Email</th>
                <th className="px-4 py-2 text-left font-bold">Phone</th>
                <th className="px-4 py-2 text-left font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((item) => (
                <tr key={item.user_id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{item.user_id}</td>
                  <td className="px-4 py-2">
                    <img
                      src={`${API_URL}/${item.user_img}`}
                      className="w-12 h-12 object-cover rounded-full"
                      alt="User Image"
                    />
                  </td>
                  <td className="px-4 py-2">{item.user_fullname}</td>
                  <td className="px-4 py-2">{item.user_email}</td>
                  <td className="px-4 py-2">{item.user_phone}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => DialogUpdate(item.user_id)}
                        className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-lg shadow-md"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(item.user_id)}
                        className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg shadow-md"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isAddDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 10 }}
            transition={{ duration: 0.1 }}
            className="my-box"
          >
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
              onClick={() => setIsAddDialogOpen(false)}
            >
              <div
                className="bg-white p-6 rounded-lg w-4/5 max-w-4xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsAddDialogOpen(false)}
                  className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded absolute top-5 right-5"
                >
                  X
                </button>
                <AddUserForm
                  onClose={() => {
                    setIsAddDialogOpen(false);
                    fetchUserData();
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {isUpdateDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 10 }}
            transition={{ duration: 0.1 }}
            className="my-box"
          >
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
              onClick={() => setIsUpdateDialogOpen(false)}
            >
              <div
                className="bg-white p-6 rounded-lg w-4/5 max-w-4xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsUpdateDialogOpen(false)}
                  className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded absolute top-5 right-5"
                >
                  X
                </button>
                <UpdateUserForm
                  user_id={ref_user_id.current}
                  onClose={() => {
                    setIsUpdateDialogOpen(false);
                    fetchUserData();
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default ManageUserPage;
