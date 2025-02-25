"use client";
import UpdateStoreForm from "@/components/(Manage)/Store/UpdateStoreForm";
import React, { useState, useEffect, useRef } from "react";
import { API_URL } from "@/utils/config";

import { useStore } from "@/hooks/hooks";
import { Store } from "@/types/types";

const { getStoreBy } = useStore()


const ManageStorePage = () => {
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState<Boolean>(false)
    const [data, setData] = useState<Store[]>([])
    const store_id = useRef('')

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const res = await getStoreBy()
        setData(res)
    }
    return (
        <>
            <div className="container mx-auto p-6 w-3/4 bg-white rounded-lg shadow-lg">
                <div className="flex justify-between">
                    <h1 className="text-xl font-bold text-gray-700 flex items-center">
                        Store List
                    </h1>
                </div>
                <div className="overflow-x-auto mt-5">
                    <table className="min-w-full table-auto border-collapse text-sm">
                        <thead className="bg-gray-600 text-white uppercase">
                            <tr>
                                <th className="px-6 py-3 text-left font-bold">Store Name</th>
                                <th className="px-6 py-3 text-left font-bold">Image</th>
                                <th className="px-6 py-3 text-left font-bold">Logo</th>
                                <th className="px-6 py-3 text-left font-bold">Slogan</th>
                                <th className="px-6 py-3 text-left font-bold">Description</th>
                                <th className="px-6 py-3 text-left font-bold">Phone</th>
                                <th className="px-6 py-3 text-left font-bold">Price</th>
                                <th className="px-6 py-3 text-left font-bold">Address</th>
                                <th className="px-6 py-3 text-left font-bold">Open Time</th>
                                <th className="px-6 py-3 text-left font-bold">Close Time</th>
                                <th className="px-6 py-3 font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {data.map((store, index) => (
                                <tr
                                    key={store.store_id}
                                    className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                        } hover:bg-gray-100 transition-all duration-200`}
                                >
                                    <td className="px-6 py-4 text-center">
                                        <img
                                            src={`${API_URL}/${store.store_img}`}
                                            className="w-20 h-20 object-cover rounded-lg shadow-md border border-gray-300"
                                            alt="Store"
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <img
                                            src={`${API_URL}/${store.store_logo}`}
                                            className="w-20 h-20 object-cover rounded-lg shadow-md border border-gray-300"
                                            alt="Store"
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-gray-800 font-medium">{store.store_name}</td>
                                    <td className="px-6 py-4 text-gray-700 italic">{store.store_slogan}</td>
                                    <td className="px-6 py-4 text-gray-600">{store.store_description}</td>
                                    <td className="px-6 py-4 text-gray-600 font-medium">{store.store_phone}</td>
                                    <td className="px-6 py-4 text-gray-600 font-semibold">{store.store_price}</td>
                                    <td className="px-6 py-4 text-gray-600">{store.store_address}</td>
                                    <td className="px-6 py-4 text-green-600 font-bold">
                                        {store.store_open}
                                    </td>
                                    <td className="px-6 py-4 text-red-600 font-bold">
                                        {store.store_close}
                                    </td>

                                    <td className="py-4">
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                onClick={() => {
                                                    setIsUpdateDialogOpen(true)
                                                    store_id.current = store.store_id
                                                }}
                                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-200"
                                            >
                                                Edit
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
                <UpdateStoreForm store_id={store_id.current} onClose={() => { setIsUpdateDialogOpen(false); fetchData(); }} />
            )}
        </>
    )
}
export default ManageStorePage