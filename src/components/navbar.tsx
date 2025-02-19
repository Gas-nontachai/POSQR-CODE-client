"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-bold">
                    <Link href="/">BrandName</Link>
                </div>
                {/* ปุ่มเปิดเมนูสำหรับมือถือ */}
                <button onClick={toggleDrawer} className="text-white md:hidden">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
                {/* เมนูสำหรับหน้าจอใหญ่ */}
                <ul className="hidden md:flex space-x-4">
                    <li>
                        <Link href="/home" className="text-gray-300 hover:text-white">Home</Link>
                    </li>
                    <li>
                        <Link href="/about" className="text-gray-300 hover:text-white">About</Link>
                    </li>
                    <li>
                        <Link href="/services" className="text-gray-300 hover:text-white">Services</Link>
                    </li>
                    <li>
                        <Link href="/contact" className="text-gray-300 hover:text-white">Contact</Link>
                    </li>
                </ul>
            </div>
            {/* เมนู Drawer สำหรับมือถือ */}
            <div className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
                <div className="flex justify-end p-4">
                    <button onClick={toggleDrawer} className="text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <ul className="flex flex-col items-center space-y-4 mt-10">
                    <li>
                        <Link href="/home" className="text-gray-300 hover:text-white" onClick={toggleDrawer}>Home</Link>
                    </li>
                    <li>
                        <Link href="/about" className="text-gray-300 hover:text-white" onClick={toggleDrawer}>About</Link>
                    </li>
                    <li>
                        <Link href="/services" className="text-gray-300 hover:text-white" onClick={toggleDrawer}>Services</Link>
                    </li>
                    <li>
                        <Link href="/contact" className="text-gray-300 hover:text-white" onClick={toggleDrawer}>Contact</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
