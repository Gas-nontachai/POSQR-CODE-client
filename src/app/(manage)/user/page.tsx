"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { User } from "@/types/user";
import Swal from "sweetalert2";
import UpdateUserForm from "@/components/User/UpdateUserForm";

const ManageUserPage: React.FC = () => {

  const { getUserBy, getUserByID, insertUser, deleteUserBy } = useUser();
  const [newUser, setNewUser] = useState<User>({
    user_id: "",
    user_fullname: "",
    user_email: "",
    user_phone: "",
    user_password: "",
    user_img: ""
  });
  const [updateUser, setUpdateUser] = useState<User[]>([{
    user_id: "",
    user_fullname: "",
    user_email: "",
    user_phone: "",
    user_password: "",
    user_img: ""
  }]);
  const [FetchUser, setFetchUser] = useState<User[]>([{
    user_id: "",
    user_fullname: "",
    user_email: "",
    user_phone: "",
    user_password: "",
    user_img: ""
  }]);
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getUserBy();
    setFetchUser(res);
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await insertUser(newUser);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'User added successfully',
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      await fetchData()
      setNewUser({
        user_id: "",
        user_fullname: "",
        user_email: "",
        user_phone: "",
        user_password: "",
        user_img: ""
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Failed to add user',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  const handleDialogUpdate = async (user_id: string, role: string) => {
    role === 'open'
      ? (setUpdateUser(await getUserByID({ user_id })), setShowModal(true))
      : (setShowModal(false), await fetchData());
  };

  const onDelete = (user_id: string) => {
    user_id && Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteUserBy({ user_id });
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Deleted!',
          text: 'User has been deleted.',
          showConfirmButton: false,
          timer: 1500,
          toast: true
        });
        await fetchData();
      }
    });
  };


  return (
    <div className="container mx-auto my-40 p-5 max-w-3xl bg-white shadow-lg rounded-lg">
      <h1 className="bg-blue-600 text-white text-center p-4 rounded-md text-2xl font-bold">
        จัดการ User
      </h1>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-2 mt-5">
          <input
            type="text"
            name="user_fullname"
            value={newUser.user_fullname}
            onChange={onChangeInput}
            placeholder="ชื่อสกุล"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="user_email"
            value={newUser.user_email}
            onChange={onChangeInput}
            placeholder="อีเมล"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="user_phone"
            value={newUser.user_phone}
            onChange={onChangeInput}
            placeholder="เบอร์โทร"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="user_password"
            value={newUser.user_password}
            onChange={onChangeInput}
            placeholder="รหัสผ่าน"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="file"
            name="user_img"
            value={newUser.user_img}
            onChange={onChangeInput}
            placeholder="รูปภาพ"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="bg-green-500 text-white px-5 py-2 rounded-md hover:bg-green-600"
          >
            ➕ เพิ่ม
          </button>
        </div>
      </form>
      <table className="min-w-full table-auto mt-5">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">Full Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Phone</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {FetchUser.map((item) => (
            <tr key={item.user_id} className="border-b">
              <td className="py-2">{item.user_fullname}</td>
              <td className="py-2">{item.user_email}</td>
              <td className="py-2">{item.user_phone}</td>
              <td className="py-2">
                <div className="flex">
                  <button
                    onClick={() => handleDialogUpdate(item.user_id, 'open')}
                    className="bg-sky-500 text-white py-1 px-3 rounded-lg text-sm hover:bg-sky-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item.user_id)}
                    className="bg-red-500 text-white py-1 px-3 rounded-lg text-sm hover:bg-red-600 ml-2"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <UpdateUserForm user={FetchUser} onClose={() => handleDialogUpdate(updateUser[0].user_id, 'close')} />
      )}
    </div >
  );
};

export default ManageUserPage;