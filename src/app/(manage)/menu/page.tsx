"use client";
import React, { useState, useEffect, useRef } from 'react';
import Swal from "sweetalert2";
import { Menu } from "@/types/menu";
import { Category } from "@/types/category";
import { useMenu } from '@/hooks/useMenu';
import { useCategory } from '@/hooks/useCategory';
import { motion } from "framer-motion";
import UpdateMenuForm from '@/components/(Manage)/Menu/UpdateMenuForm';
import AddMenuForm from '@/components/(Manage)/Menu/AddMenuForm';
import { API_URL } from "@/utils/config";

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
    fetchDataCategory();
    fetchDataMenu();
  }, []);

  const fetchDataMenu = async () => {
    setMenus(await getMenuBy())
  }

  const fetchDataCategory = async () => {
    setCategory(await getCategoryBy())
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
        fetchDataMenu();
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to delete menu", "error");
      }
    }
  };

  return (
    <>
      <div className="container mx-auto p-4 w-3/4">
        <h1 className="text-2xl font-bold mb-4">Menu Management</h1>
        <button
          onClick={() => setIsAddDialogOpen(true)}
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Menu
        </button>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Menu Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Img
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Delete</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {menus.map((menu) => (
                <tr key={menu.menu_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {menu.menu_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <img
                      src={`${API_URL}/${menu.menu_img}`}
                      alt={menu.menu_name}
                      className="mt-2 w-20 h-20 object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {menu.menu_price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.find((cat) => cat.category_id === menu.category_id)?.category_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(menu.menu_id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(menu.menu_id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
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
          exit={{ opacity: 10 }}
          transition={{ duration: 0.3 }}
          className="my-box"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={() => setIsUpdateDialogOpen(false)} >
            <div className="bg-white p-6 rounded-lg w-4/5 max-w-4xl relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setIsUpdateDialogOpen(false)}
                className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded absolute top-5 right-5"
              > X </button>
              <UpdateMenuForm menu_id={ref_menu_id.current} onClose={() => { setIsUpdateDialogOpen(false); fetchDataMenu(); }} />
            </div >
          </div >
        </motion.div>
      )}

      {isAddDialogOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 10 }}
          transition={{ duration: 0.3 }}
          className="my-box"
        >
          <AddMenuForm onClose={() => { setIsAddDialogOpen(false); fetchDataMenu(); }} />\
        </motion.div>
      )}
    </>
  );
};

export default MenuPage;
