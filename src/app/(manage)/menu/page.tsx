"use client";
import React, { useState, useEffect, useRef } from 'react';
import Swal from "sweetalert2";
import { Menu } from "@/types/menu";
import { Category } from "@/types/category";
import { useMenu } from '@/hooks/useMenu';
import { useCategory } from '@/hooks/useCategory';
import { motion } from "framer-motion";
import UpdateMenuForm from '@/components/Menu/UpdateMenuForm';
import { ul } from 'motion/react-client';

const { getCategoryBy } = useCategory();

const MenuPage = () => {
  const {
    insertMenu,
    deleteMenuBy,
    getMenuBy,
  } = useMenu();
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
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
    const res = await getMenuBy()
    console.log(res);
    
    // setMenus(Array.isArray(res) ? res : [res])
  }

  const fetchDataCategory = async () => {
    const res = await getCategoryBy()
    setCategory(Array.isArray(res) ? res : [res])
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setMenu((prevMenu) => ({
      ...prevMenu,
      [name]: value,
    }));
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
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Insert Menu</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="menu_name" className="block text-sm font-medium text-gray-700">Menu Name</label>
          <input
            type="text"
            name="menu_name"
            id="menu_name"
            value={menu.menu_name}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="menu_price"
            id="price"
            value={menu.menu_price}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category_id"
            id="category_id"
            value={menu.category_id}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Category</option>
            {category.map((item: any) => (
              <option key={item.category_id} value={item.category_id}>
                {item.category_name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="menu_nmenu_imgame" className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="file"
            name="menu_img"
            id="menu_img"
            value={menu.menu_img}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-2 mt-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </form>
      <h2 className="text-2xl font-semibold text-center mt-6">Menu List</h2>
      <ul className="mt-4">
        {menus.map((item:any) => (
          <ul>
            <li></li>
          </ul>
        ))}

      </ul>

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
              <UpdateMenuForm menu_id={ref_menu_id.current} onClose={() => { setIsUpdateDialogOpen(false); fetchDataMenu(); }} />
            </div >
          </div >
        </motion.div>
      )}
    </div>
  );
};

export default MenuPage;
