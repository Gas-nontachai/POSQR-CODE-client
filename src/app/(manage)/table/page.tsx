"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTable } from "@/hooks/useTable";
import { Table } from "@/types/table";
import Swal from "sweetalert2";
import AddTableForm from "@/components/Table/AddTableForm";
import UpdateTableForm from "@/components/Table/UpdateTableForm";
import { motion } from "framer-motion";

const ManageTablePage = () => {
  const { getTableBy, insertTable, updateTableBy, deleteTableBy } = useTable();
  const [newTable, setNewTable] = useState<Table[]>([{
    table_id: '',
    table_number: '',
    qrcode: '',
    table_status: '',
    add_date: new Date()
  }]);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [loading, SetLoading] = useState<boolean>(true)
  const tableToUpdate = useRef<Table>({
    table_id: '',
    table_number: '',
    qrcode: '',
    table_status: '',
    add_date: ''
  })

  const manageItems = [
    { text: "Table Number", },
    { text: "Status", },
    { text: "QR Code", },
    { text: "Action", },
  ]

  const statusItems = [
    { value: "available", title: "ว่าง" },
    { value: "occupied", title: "มีผู้ใช้งาน" },
    { value: "reserved", title: "จองแล้ว" },
    { value: "pending", title: "กำลังรอการยืนยัน" },
    { value: "confirmed", title: "ยืนยันการจองแล้ว" },
    { value: "cancelled", title: "ยกเลิกการจอง" },
    { value: "no_show", title: "ลูกค้าไม่มา" },
    { value: "in_use", title: "กำลังถูกใช้งาน" },
    { value: "closed", title: "ปิดการใช้งาน" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getTableBy();
      setNewTable(Array.isArray(res) ? res : [res])
    } catch (error) {
      console.error("Error fetching table data:", error);
    } finally {
      SetLoading(false)
      setOpenUpdateDialog(false)
      setOpenAddDialog(false)
    }
  };

  const onSubmit = async (TableData: Table) => {
    await insertTable(TableData).then(() => {
      Swal.fire({
        toast: true,
        icon: "success",
        title: "Table has been added successfully!",
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      fetchData();
    }).catch((error) => {
      Swal.fire(
        'Error!',
        'There was an error adding the table.',
        'error'
      );
      console.error("Error adding table:", error);
    });
  }

  const onUpdate = async (TableData: Table) => {
    await updateTableBy(TableData).then(() => {
      Swal.fire({
        toast: true,
        icon: "success",
        title: "Table has been updated successfully!",
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      fetchData();
    }).catch((error) => {
      Swal.fire(
        'Error!',
        'There was an error adding the table.',
        'error'
      );
      console.error("Error adding table:", error);
    });
  }

  const openDialogUpdate = async (table_id: string) => {
    tableToUpdate.current = newTable.find(table => table.table_id === table_id) || {
      table_id: '',
      table_number: '',
      qrcode: '',
      table_status: '',
      add_date: new Date()
    };
    if (tableToUpdate) {
      setOpenUpdateDialog(true);
    }
  }

  const onDelete = async (table_id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteTableBy({ table_id });
          Swal.fire(
            'Deleted!',
            'Your table has been deleted.',
            'success'
          );
          fetchData();
        } catch (error) {
          Swal.fire(
            'Error!',
            'There was an error deleting the table.',
            'error'
          );
        }
      }
    });
  };

  return (
    <div>
      {loading && (
        <div className=" flex justify-center">
          <span className="text-xl font-semibold text-gray-700">Loading...</span>
        </div>
      )}
      <div className="container mx-auto mt-10">
        <div className="flex justify-end mb-4">
          <button onClick={() => setOpenAddDialog(!openAddDialog)}
            className=" bg-green-500 hover:bg-green-700 p-2 rounded text-white font-bold">+ เพิ่มโต๊ะ</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left" >
                {manageItems.map(item => (
                  <th className="px-4 py-2 border" key={item.text}>{item.text}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!loading && newTable.map((item) => (
                <tr key={item.table_id} className="border-b">
                  <td className="px-4 py-2">{item.table_number}</td>
                  <td className="px-4 py-2">{item.table_status}</td>
                  <td className="px-4 py-2">{item.qrcode}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button onClick={() => openDialogUpdate(item.table_id)} className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded">
                        Edit
                      </button>
                      <button onClick={() => onDelete(item.table_id)} className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded">
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

      {openAddDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 10 }}
          transition={{ duration: 0.1 }}
          className="my-box"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={() => setOpenAddDialog(false)} >
            <div className="bg-white p-6 rounded-lg w-4/5 max-w-4xl relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setOpenAddDialog(false)}
                className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded absolute top-5 right-5"
              > X </button>
              <AddTableForm count_table={newTable.length} statusItems={statusItems} onSubmit={onSubmit} />
            </div>
          </div>
        </motion.div>
      )
      }

      {openUpdateDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 10 }}
          transition={{ duration: 0.1 }}
          className="my-box"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={() => setOpenUpdateDialog(false)} >
            <div className="bg-white p-6 rounded-lg w-4/5 max-w-4xl relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setOpenUpdateDialog(false)}
                className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded absolute top-5 right-5"
              > X </button>
              <UpdateTableForm table_data={tableToUpdate.current} statusItems={statusItems} onSubmit={onUpdate} />
            </div>
          </div>
        </motion.div>
      )}

    </div >
  );
};

export default ManageTablePage;
