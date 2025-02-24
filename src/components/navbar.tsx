"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Squares2X2Icon, ClipboardDocumentListIcon, ShoppingCartIcon, TableCellsIcon, UserIcon, Cog6ToothIcon, DocumentCheckIcon, ChevronRightIcon, FolderIcon, UsersIcon } from "@heroicons/react/24/outline";

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const [isOpenManage, setIsOpenManage] = useState(false);


    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const menuItems = [
        { name: "Dashboard", path: "/", icon: Squares2X2Icon },
        { name: "Customer Screen", path: "/screen", icon: UsersIcon }
    ];

    const manageItems = [
        { name: "User", path: "/user", icon: UserIcon },
        { name: "Orders", path: "/order", icon: ShoppingCartIcon },
        { name: "Table", path: "/table", icon: TableCellsIcon },
        { name: "Menu", path: "/menu", icon: ClipboardDocumentListIcon },
        { name: "Category", path: "/category", icon: FolderIcon },
        { name: "Status", path: "/table-status", icon: DocumentCheckIcon }
    ];

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-bold">
                    <Link href="/">BrandName</Link>
                </div>
                <button onClick={toggleDrawer} className="text-white md:hidden">
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16m-7 6h7"
                        ></path>
                    </svg>
                </button>
                <Menu as="div" className="relative text-left hidden md:block">
                    <div>
                        <MenuButton onClick={(e) => setIsOpenMenu(!isOpenMenu)} className="inline-flex items-center w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-100">
                            Menu
                            {isOpenMenu ? (
                                <ChevronDownIcon
                                    aria-hidden="true"
                                    className="w-4 h-4 ml-2 font-bold text-gray-700"
                                />
                            ) : (
                                <ChevronRightIcon
                                    aria-hidden="true"
                                    className="w-4 h-4 ml-2 font-bold text-gray-700"
                                />
                            )}
                        </MenuButton>
                    </div>
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none">
                        <div className="py-1">
                            {menuItems.map((item) => (
                                <MenuItem key={item.name}>
                                    {({ active }) => (
                                        <Link
                                            href={item.path}
                                            className={`flex items-center px-4 py-2 text-sm text-gray-700 ${active ? "bg-gray-100 text-gray-900" : ""}`}
                                        >
                                            {item.name}
                                        </Link>
                                    )}
                                </MenuItem>
                            ))}

                            <Menu as="div" className="relative">
                                <MenuButton onClick={(e) => setIsOpenManage(!isOpenManage)} className="flex items-center px-4 py-2 text-sm w-full text-gray-700 hover:bg-gray-100">
                                    Manage
                                    {isOpenManage ? (
                                        <ChevronDownIcon
                                            aria-hidden="true"
                                            className="w-4 h-4 ml-2 font-bold text-gray-700"
                                        />
                                    ) : (
                                        <ChevronRightIcon
                                            aria-hidden="true"
                                            className="w-4 h-4 ml-2 font-bold text-gray-700"
                                        />
                                    )}
                                </MenuButton>
                                <Menu.Items className="absolute left-5 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none">
                                    <div className="py-1">
                                        {manageItems.map((item) => (
                                            <MenuItem key={item.name}>
                                                {({ active }) => (
                                                    <Link
                                                        href={item.path}
                                                        className={`flex items-center px-4 py-2 text-sm text-gray-700 ${active ? "bg-gray-100 text-gray-900" : ""}`}
                                                    >
                                                        <item.icon className="w-5 h-5 mr-2 text-gray-500" />
                                                        {item.name}
                                                    </Link>
                                                )}
                                            </MenuItem>
                                        ))}
                                    </div>
                                </Menu.Items>
                            </Menu>
                        </div>
                    </Menu.Items>
                </Menu>

            </div>
            <div
                className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-50 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-300 ease-in-out md:hidden`}
            >
                <div className="flex justify-end p-4">
                    <button onClick={toggleDrawer} className="text-white">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                </div>
                <ul className="flex flex-col items-center space-y-4 mt-10">
                    {[
                        { name: "Category", path: "/category" },
                        { name: "Menu", path: "/menu" },
                        { name: "Orders", path: "/order" },
                        { name: "Table", path: "/table" },
                        { name: "User", path: "/user" },
                    ].map((item) => (
                        <li key={item.name}>
                            <Link
                                href={item.path}
                                className="text-gray-300 hover:text-white"
                                onClick={toggleDrawer}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
