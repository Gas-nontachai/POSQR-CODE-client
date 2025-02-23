"use client";
import React, { useState, useEffect, useRef } from 'react';
import Swal from "sweetalert2";
import { Category, Menu } from "@/types/types";
import { useMenu, useCategory } from '@/hooks/hooks';
import { Add, RestaurantMenu } from '@mui/icons-material';

import { API_URL } from "@/utils/config";
import { motion } from "framer-motion";

import UpdateMenuForm from '@/components/(Manage)/Menu/UpdateMenuForm';
import AddMenuForm from '@/components/(Manage)/Menu/AddMenuForm';

const { getCategoryBy } = useCategory();
const {
  deleteMenuBy,
  getMenuBy,
} = useMenu();

const MenuPage = () => {

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const ref_menu_id = useRef('')

  const [menus, setMenus] = useState<Menu[]>([])
  const [category, setCategory] = useState<Category[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setCategory(await getCategoryBy())
      setMenus(await getMenuBy())
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const handleEdit = (menu_id: string) => {
    try {
      setIsUpdateDialogOpen(true)
      ref_menu_id.current = menu_id
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (menu_id: string) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "This menu will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirmation.isConfirmed) {
      try {
        await deleteMenuBy({ menu_id: menu_id });
        Swal.fire("Deleted!", "The menu has been deleted.", "success");
        fetchData();
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to delete menu", "error");
      }
    }
  };

  return (
    <>
      <div className="container mx-auto p-6 w-3/4 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between">
          <h1 className="text-xl font-bold text-gray-700 flex items-center">
            <RestaurantMenu className="w-10 h-10 mr-2" /> Menu List
          </h1>
          <div>
            <button
              onClick={() => setIsAddDialogOpen(true)}
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
                <th className="px-6 py-3 text-left font-bold">Menu Name</th>
                <th className="px-6 py-3 text-left font-bold">Image</th>
                <th className="px-6 py-3 text-left font-bold">Price</th>
                <th className="px-6 py-3 text-left font-bold">Category</th>
                <th className="px-6 py-3 text-left font-bold">Menu Status</th>
                <th className="px-6 py-3 font-bold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {menus.map((menu) => (
                <tr key={menu.menu_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-800">{menu.menu_name}</td>
                  <td className="px-6 py-4">
                    <img
                      src={`${API_URL}/${menu.menu_img}`}
                      alt={menu.menu_name}
                      className="w-20 h-20 object-cover rounded-lg shadow-md"
                    />
                  </td>
                  <td className="px-6 py-4 text-gray-600">{menu.menu_price}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {category.find((cat) => cat.category_name === menu.category_name)?.category_name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{menu.menu_status}</td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(menu.menu_id)}
                        className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-lg shadow-md"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(menu.menu_id)}
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
      </div>

      {isUpdateDialogOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={() => setIsUpdateDialogOpen(false)}
        >
          <div className="bg-white p-8 rounded-lg w-4/5 max-w-4xl relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsUpdateDialogOpen(false)}
              className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded absolute top-5 right-5"
            >
              X
            </button>
            <UpdateMenuForm menu_id={ref_menu_id.current} onClose={() => { setIsUpdateDialogOpen(false); fetchData(); }} />
          </div>
        </motion.div>
      )}

      {isAddDialogOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div className="bg-white p-8 rounded-lg w-4/5 max-w-4xl relative">
            <button
              onClick={() => setIsAddDialogOpen(false)}
              className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded absolute top-5 right-5"
            >
              X
            </button>
            <AddMenuForm onClose={() => { setIsAddDialogOpen(false); fetchData(); }} />
          </div>
        </motion.div>
      )}

    </>
  );
};

export default MenuPage;
