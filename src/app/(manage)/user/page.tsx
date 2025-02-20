"use client";
import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@/hooks/useUser";
import { User } from "@/types/user";
import AddUserForm from "@/components/User/AddUserForm";
import UpdateUserForm from "@/components/User/UpdateUserForm";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const ManageUserPage = () => {
  const { getUserBy, deleteUserBy } = useUser();
  const [userData, setUserData] = useState<User[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const ref_user_id = useRef('')
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const res = await getUserBy();
    setUserData(res);
  };

  const DialogUpdate = async (user_id: string) => {
    setIsUpdateDialogOpen(true);
    ref_user_id.current = user_id
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
      <div className="container mx-auto mt-10">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsAddDialogOpen(!isAddDialogOpen)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            + Add
          </button>
        </div>
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
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  </td>
                  <td className="px-4 py-2">{item.user_fullname}</td>
                  <td className="px-4 py-2">{item.user_email}</td>
                  <td className="px-4 py-2">{item.user_phone}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => DialogUpdate(item.user_id)}
                        className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded"
                      >
                        Edit
                      </button>
                      <button onClick={() => onDelete(item.user_id)} className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded">
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={() => setIsAddDialogOpen(false)} >
              <div className="bg-white p-6 rounded-lg w-4/5 max-w-4xl relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setIsAddDialogOpen(false)}
                  className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded absolute top-5 right-5"
                > X </button>
                <AddUserForm onClose={() => { setIsAddDialogOpen(false); fetchUserData(); }} />
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={() => setIsUpdateDialogOpen(false)} >
              <div className="bg-white p-6 rounded-lg w-4/5 max-w-4xl relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setIsUpdateDialogOpen(false)}
                  className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded absolute top-5 right-5"
                > X </button>
                <UpdateUserForm user_id={ref_user_id.current} onClose={() => { setIsUpdateDialogOpen(false); fetchUserData(); }} />
              </div >
            </div >
          </motion.div>
        )}
      </div>
    </>
  );
};

export default ManageUserPage;
