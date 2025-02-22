"use client";
import React, { useState, useEffect, useRef } from 'react';
import Swal from "sweetalert2";
import { Menu } from "@/types/menu";
import { Category } from "@/types/category";
import { useMenu } from '@/hooks/useMenu';
import { useCategory } from '@/hooks/useCategory';
import { motion } from "framer-motion";
import UpdateMenuForm from '@/components/(Manage)/Menu/UpdateMenuForm';
import { API_URL } from "@/utils/config";

const { getCategoryBy } = useCategory();

const MenuPage = () => {
  const {
    insertMenu,
    deleteMenuBy,
    getMenuBy,
  } = useMenu();
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const ref_menu_id = useRef('')
  const [menu, setMenu] = useState<Menu>({
    menu_id: '',
    menu_name: '',
    menu_price: 0,
    menu_img: '',
    category_id: ''
  });

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

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    if (name === "menu_img" && files && files[0]) {
      setMenu((prevMenu) => ({
        ...prevMenu,
        [name]: files[0],
      }));
    } else {
      setMenu((prevMenu) => ({
        ...prevMenu,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await insertMenu(menu);
      Swal.fire("Success", "Menu inserted successfully", "success");
      setMenu({
        menu_id: '',
        menu_name: '',
        menu_price: 0,
        menu_img: '',
        category_id: '',
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      fetchDataMenu();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to insert menu", "error");
    }
  };


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
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Menu Management</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Menu Name</label>
            <input
              type="text"
              name="menu_name"
              value={menu.menu_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Menu Price</label>
            <input
              type="number"
              name="menu_price"
              value={menu.menu_price}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Menu Image</label>
            <input
              type="file"
              name="menu_img"
              ref={fileInputRef}
              onChange={handleChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category_id"
              value={menu.category_id}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select a category</option>
              {category.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Menu
          </button>
        </form>
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
    </>
  );
};

export default MenuPage;
