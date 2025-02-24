"use client";
import React, { useState, useEffect } from "react";
import { useTableStatus } from "@/hooks/useTableStatus";
import { TableStatus } from "@/types/table-status";
import { DocumentCheckIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { CircularProgress } from "@mui/material";

const ManageTableStatusPage: React.FC = () => {
    const { getTableStatusBy, insertTableStatus, deleteTableStatusBy, updateTableStatusBy } = useTableStatus();
    const [newTableStatus, setNewTableStatus] = useState<TableStatus>({
        table_status_id: "",
        table_status_name: "",
    });
    const [FetchCate, setFetchCate] = useState<TableStatus[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getTableStatusBy();
            setFetchCate(Array.isArray(res) ? res : [res]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTableStatus({ ...newTableStatus, table_status_name: e.target.value });
    };

    const validateForm = (table_status_name: string) => {
        if (!table_status_name.trim()) {
            Swal.fire("Error", "กรุณากรอกชื่อ TableStatus", "warning");
            return false;
        }
        return true;
    };

    const validateDuplicate = async (table_status_name: string) => {
        const res = await getTableStatusBy();
        const isDuplicate = res.some(
            (status: TableStatus) =>
                status.table_status_name.trim().toLowerCase() === table_status_name.trim().toLowerCase()
        );
        if (isDuplicate) {
            Swal.fire("Error", "ชื่อสถานะนี้มีอยู่แล้ว", "warning");
            setNewTableStatus({ table_status_id: "", table_status_name: "" });
            return false;
        }
        return true;
    };

    const onSubmit = async () => {
        if (!await validateDuplicate(newTableStatus.table_status_name)) {
            return;
        }
        if (!await validateForm(newTableStatus.table_status_name)) {
            return;
        }
        try {
            const TableStatus = { ...newTableStatus };
            await insertTableStatus(TableStatus);
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "เพิ่มสถานะเรียบร้อย",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
            setNewTableStatus({ table_status_id: "", table_status_name: "" });
            await fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const onDelete = async (table_status_id: string) => {
        Swal.fire({
            title: "ยืนยันการลบ?",
            text: "คุณแน่ใจหรือไม่ว่าต้องการลบสถานะนี้?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ใช่, ลบเลย!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteTableStatusBy({ table_status_id });
                Swal.fire("Deleted!", "ลบสถานะเรียบร้อยแล้ว", "success");
                await fetchData();
            }
        });
    };

    const onUpdate = async (table_status_id: string) => {
        const TableStatusToUpdate = FetchCate.find((TableStatus) => TableStatus.table_status_id === table_status_id);
        if (TableStatusToUpdate) {
            const { value: newTableStatusName } = await Swal.fire({
                title: "แก้ไขสถานะ",
                input: "text",
                inputLabel: "ชื่อสถานะใหม่",
                inputValue: TableStatusToUpdate.table_status_name,
                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value) {
                        return "กรุณากรอกชื่อสถานะ";
                    }
                },
            });

            if (newTableStatusName) {
                const updatedTableStatus = { ...TableStatusToUpdate, table_status_name: newTableStatusName };
                await updateTableStatusBy(updatedTableStatus);
                Swal.fire("สำเร็จ", "แก้ไขสถานะเรียบร้อย", "success");
                await fetchData();
            }
        }
    };

    return (
        <>
            <div className="container mx-auto p-6 w-3/4 bg-white shadow-lg rounded-lg">
                <div className="flex justify-between">
                    <h1 className="text-xl font-bold text-gray-700 flex items-center">
                        <DocumentCheckIcon className="w-10 h-10 mr-2" />
                        Table Status
                    </h1>
                </div>

                <div className="mt-5 flex">
                    <input
                        type="text"
                        value={newTableStatus.table_status_name}
                        onChange={onChangeInput}
                        placeholder="Enter new table status"
                        className="p-2 w-full border border-gray-300 rounded-l-md"
                    />
                    <button
                        onClick={onSubmit}
                        className="bg-green-500 flex items-center text-white font-bold px-5 py-2 rounded-r-md hover:bg-green-600"
                    >
                        Add
                    </button>
                </div>
                <div className="overflow-x-auto mt-5">
                    <table className="min-w-full table-auto border-collapse text-sm">
                        <thead className="bg-gray-600 text-white uppercase">
                            <tr>
                                <th className="px-6 py-3 text-left font-semibold">table_status_id</th>
                                <th className="px-6 py-3 text-left font-semibold">table_status_name</th>
                                <th className="px-6 py-3 text-left font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={3} className="text-center py-10">
                                        <CircularProgress />
                                    </td>
                                </tr>
                            ) : FetchCate.length > 0 ? (
                                FetchCate.map((item) => (
                                    <tr key={item.table_status_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-gray-800">{item.table_status_id}</td>
                                        <td className="px-6 py-4 text-gray-600">{item.table_status_name}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => onUpdate(item.table_status_id)}
                                                    className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-lg shadow-md"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => onDelete(item.table_status_id)}
                                                    className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg shadow-md"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-gray-500 text-center py-4">ไม่มีสถานะ</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </>
    );
};

export default ManageTableStatusPage;
