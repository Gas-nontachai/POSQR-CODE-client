"use client";
import React, { useState, useEffect, useRef } from "react";
import { Menu, MenuItem, Button, Icon } from "@mui/material";
import { Edit, Delete } from '@mui/icons-material';
import { useTable } from "@/hooks/useTable";
import { useTableStatus } from "@/hooks/useTableStatus";
import { Table } from "@/types/table";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import AddTableForm from "@/components/Table/AddTableForm";
import UpdateTableForm from "@/components/Table/UpdateTableForm";
import QRCodeGenerator from '@/utils/qrcode-generater';

const ManageTablePage = () => {
  const { getTableBy, insertTable, updateTableBy, deleteTableBy } = useTable();
  const { getTableStatusBy } = useTableStatus();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openQRCodeDialog, setOpenQRCodeDialog] = useState(false);
  const [loading, SetLoading] = useState<boolean>(true)
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const current_link = useRef('')
  const statusItems = useRef<{ value: string; title: string }[]>([]);

  const [newTable, setNewTable] = useState<Table[]>([{
    table_id: '',
    table_number: '',
    table_status: '',
    add_date: new Date()
  }]);
  const tableToUpdate = useRef<Table>({
    table_id: '',
    table_number: '',
    table_status: '',
    add_date: ''
  })
  const manageItems = [
    { text: "Table Number", },
    { text: "Status", },
    { text: "QR Code", },
    { text: "Action", },
  ]

  useEffect(() => {
    fetchTableStatusOption()
    fetchData();
  }, []);

  const fetchTableStatusOption = async () => {
    const res = await getTableStatusBy();
    statusItems.current = res.map((item: any) => ({
      value: item.table_status_name,
      title: item.table_status_name,
    }))
  }

  const fetchData = async () => {
    try {
      setNewTable(await getTableBy())
    } catch (error) {
      console.error("Error fetching table data:", error);
    } finally {
      SetLoading(false)
      setOpenUpdateDialog(false)
      setOpenAddDialog(false)
      setOpenQRCodeDialog(false)
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
      table_status: '',
      add_date: '',
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

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
                  <td className="px-4 py-2">โต๊ะ {item.table_number}</td>
                  <td className="px-4 py-2">
                    <select
                      name="table_status"
                      value={item.table_status}
                      className="border p-2 w-full"
                    >
                      <option value="" disabled> {item.table_status} (สถานะปัจจุบัน)</option>
                      {statusItems.current.map((item) => (
                        <option value={item.value} key={item.value}>
                          {item.title}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button onClick={() => {
                      current_link.current = `https://www.google.com/search?q=${item.table_number}`;
                      setOpenQRCodeDialog(!openQRCodeDialog);
                    }
                    } className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded">
                      QR Code Gen
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <div>
                      <Button variant="contained" color="primary" onClick={handleClick}>
                        เปิดเมนู
                      </Button>
                      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                        <MenuItem onClick={() => openDialogUpdate(item.table_id)} ><Edit />  Edit</MenuItem>
                        <MenuItem onClick={() => onDelete(item.table_id)}><Delete />Delete</MenuItem>
                      </Menu>
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
              <AddTableForm count_table={newTable.length} statusItems={statusItems.current} onSubmit={onSubmit} />
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
              <UpdateTableForm table_data={tableToUpdate.current} statusItems={statusItems.current} onSubmit={onUpdate} />
            </div>
          </div>
        </motion.div>
      )}

      {openQRCodeDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 10 }}
          transition={{ duration: 0.1 }}
          className="my-box"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={() => setOpenQRCodeDialog(false)} >
            <div className="bg-white p-6 rounded-lg w-4/5 max-w-4xl relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setOpenQRCodeDialog(false)}
                className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded absolute top-5 right-5"
              > X </button>
              <div className="flex justify-center items-center flex-col">
                <QRCodeGenerator link={current_link.current} size={500} />
                <a href={current_link.current} target="_blank" rel="noopener noreferrer" className="mt-5">{current_link.current}</a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div >
  );
};

export default ManageTablePage;
