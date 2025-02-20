"use client";
import React, { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import { Menu } from "@/types/menu";
import { Category } from "@/types/category";
import { useMenu } from '@/hooks/useMenu';
import { useCategory } from '@/hooks/useCategory';

const MenuPage = () => {
  const {
    insertMenu,
    deleteMenuBy,
    getMenuByID,
    getMenuBy,
  } = useMenu();
  const { getCategoryBy } = useCategory();
  const [menus, setMenus] = useState<[]>([])
  const [menu, setMenu] = useState<Menu>({
    menu_id: '',
    menu_name: '',
    price: 0,
    category_id: '',
    image: '',
  });

  const [category, setCategory] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchDataCategory();
      await fetchDataMenu();
    };


    fetchData();
  }, []);

  const fetchDataMenu = async () => {
    const res = await getMenuBy()
    setMenus(res)
  }

  const fetchDataCategory = async () => {
    const res = await getCategoryBy()
    setCategory(res)
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
        price: 0,
        category_id: '',
        image: '',
      });
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to insert menu", "error");
    }
  };

  const handleEdit = (menuId: string) => {
    console.log('Editing menu with ID:', menuId);
  };

  const handleDelete = async (menuId: string) => {
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
        await deleteMenuBy(menuId);
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
            name="price"
            id="price"
            value={menu.price}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Category</label>
          {/* <select
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
          </select> */}
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="text"
            name="image"
            id="image"
            value={menu.image}
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
      {/* <ul className="mt-4">
        {menus.map((menuItem: any) => (
          <li key={menuItem.menu_id} className="mb-2 p-4 bg-gray-100 rounded-md shadow-sm">
            <h3 className="text-lg font-medium">{menuItem.menu_name}</h3>
            <p>Price: ${menuItem.price}</p>
            <p>Category: {menuItem.category_name}</p>
            {menuItem.image && <img src={menuItem.image} alt={menuItem.menu_name} className="mt-2 max-w-full h-auto" />}

            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleEdit(menuItem.menu_id)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(menuItem.menu_id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default MenuPage;
