"use client";
import React, { useState, useEffect, useRef } from "react";
import { Menu, MenuItem, Button, Avatar, IconButton, Tooltip, ListItemIcon, Divider } from "@mui/material";
import {
  Edit, Delete, MenuOpen, People, CurrencyBitcoin, PersonOff, QrCode, Payments, PersonAdd, Settings, Logout
} from '@mui/icons-material';
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
  const [openPromtPayDialog, setOpenPromtPayDialog] = useState(false);
  const [openCashDialog, setOpenCashDialog] = useState(false);
  const [loading, SetLoading] = useState<boolean>(true)
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const current_link = useRef('')
  const current_table_id = useRef('')
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

  const changeTableStatus = async (table_id: string, table_status: string) => {
    const updateTableData = newTable.find(table => table.table_id === table_id) || {
      table_id: '',
      table_number: '',
      table_status: '',
      add_date: '',
    };
    updateTableData.table_status = table_status
    await onUpdate(updateTableData)
    setOpenPromtPayDialog(false)
    setOpenCashDialog(false)
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewTable((prevTable) => [
      {
        ...prevTable[0],
        table_status: event.target.value,
      },
    ]);
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
                  <td className="px-4 py-2 flex justify-between">
                    <div>
                      โต๊ะ {item.table_number}
                    </div>
                    <div>
                      <Tooltip title="Account settings">
                        <IconButton
                          onClick={handleClick}
                          size="small"
                          sx={{ ml: 2 }}
                          aria-controls={open ? 'account-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? 'true' : undefined}
                        >
                          <Avatar sx={{ width: 32, height: 32 }}>
                            <MenuOpen />
                          </Avatar>
                        </IconButton>
                      </Tooltip>
                      <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        slotProps={{
                          paper: {
                            elevation: 0,
                            sx: {
                              overflow: 'visible',
                              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                              mt: 1.5,
                              '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                              },
                              '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                              },
                            },
                          },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      >
                        <MenuItem onClick={() => openDialogUpdate(item.table_id)}>
                          <Edit color="error" /> Edit
                        </MenuItem>
                        <MenuItem onClick={() => onDelete(item.table_id)}>
                          <Delete color="primary" />Delete
                        </MenuItem>
                      </Menu>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <select
                      name="table_status"
                      value={item.table_status}
                      onChange={(event) => { changeTableStatus(item.table_id, event.target.value) }}
                      className="border p-2 w-full"
                    >
                      <option value="" disabled>
                        {item.table_status} (สถานะปัจจุบัน)
                      </option>
                      {statusItems.current.map((status) => (
                        <option value={status.value} key={status.value}>
                          {status.title}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    {(() => {
                      switch (item.table_status) {
                        case 'ว่าง':
                          return (
                            <div>
                              <PersonOff /> <span className="ml-3">ยังไม่มีลูกค้าใช้งาน</span>
                            </div>
                          );
                        case 'กำลังใช้งาน':
                          return (
                            <Button
                              variant="contained"
                              onClick={() => {
                                current_link.current = `https://www.google.com/search?q=${item.table_number}`;
                                setOpenQRCodeDialog(!openQRCodeDialog);
                              }}
                              color="success"
                              className="hover:bg-green-500 text-white font-bold py-2 px-4 rounded"
                            >
                              QR Code Gen
                            </Button>
                          );
                        case 'กำลังรอเรียกเก็บเงิน':
                          return (
                            <Button
                              variant="contained"
                              onClick={() => {
                                current_link.current = `https://www.google.com/search?q=${item.table_number}`;
                                setOpenQRCodeDialog(!openQRCodeDialog);
                              }}
                              color="success"
                              className="hover:bg-green-500 text-white font-bold py-2 px-4 rounded"
                            >
                              ใบเสร็จเก็บเงิน
                            </Button>
                          );
                        default:
                          return null;
                      }
                    })()}
                  </td>

                  <td className="px-4 py-2">
                    {(() => {
                      switch (item.table_status) {
                        case 'ว่าง':
                          return (
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => { changeTableStatus(item.table_id, "กำลังใช้งาน") }}
                            >
                              <People /> <span className="ml-3">เปิดโต๊ะ</span>
                            </Button>
                          );
                        case 'จองแล้ว':
                          return (
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => { changeTableStatus(item.table_id, "กำลังใช้งาน") }}
                            >
                              <People /> <span className="ml-3">เปิดโต๊ะ</span>
                            </Button>
                          );
                        case 'กำลังใช้งาน':
                          return (
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => { changeTableStatus(item.table_id, "กำลังรอเรียกเก็บเงิน") }}
                            >
                              <CurrencyBitcoin /> <span className="ml-3">เก็บเงิน</span>
                            </Button>
                          );
                        case 'กำลังรอเรียกเก็บเงิน':
                          return (
                            <div className="flex justify-evenly">
                              <Button
                                variant="contained"
                                color="success"
                                onClick={() => {
                                  current_table_id.current = item.table_id
                                  setOpenPromtPayDialog(true)
                                }}
                              >
                                <QrCode /> <span className="ml-3">แสกน QR COde รับเงิน</span>
                              </Button>
                              <Button
                                variant="contained"
                                color="success"
                                onClick={() => {
                                  current_table_id.current = item.table_id
                                  setOpenCashDialog(true)
                                }}
                              >
                                <Payments /> <span className="ml-3">รับเงินสด</span>
                              </Button>

                            </div>
                          );
                        default:
                          return null;
                      }
                    })()}
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

      {openPromtPayDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 10 }}
          transition={{ duration: 0.1 }}
          className="my-box"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={() => setOpenPromtPayDialog(false)} >
            <div className="bg-white p-6 rounded-lg w-4/5 max-w-4xl relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setOpenPromtPayDialog(false)}
                className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded absolute top-5 right-5"
              > X </button>
              <div className="flex justify-center items-center flex-col">
                <QRCodeGenerator link={current_link.current} size={500} />
                <span className="mt-5">QR Code พร้อมเพย์</span>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    Swal.fire({
                      text: "ได้รับเงินจากลูกค้าเรียบร้อย?",
                      icon: 'question',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      cancelButtonText: 'ยกเลิก',
                      confirmButtonText: 'ได้รับเงินเรียบร้อย'
                    }).then((result) => {
                      if (result.isConfirmed) {
                        changeTableStatus(current_table_id.current, "ว่าง");
                      }
                    });
                  }}
                >
                  <Payments /> <span className="ml-3">ชำระเงิน</span>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {openCashDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 10 }}
          transition={{ duration: 0.1 }}
          className="my-box"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={() => setOpenCashDialog(false)} >
            <div className="bg-white p-6 rounded-lg w-4/5 max-w-4xl relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setOpenCashDialog(false)}
                className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded absolute top-5 right-5"
              > X </button>
              <div className="flex justify-center items-center flex-col">
                <span className="mt-5">รับเงินสด</span>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    Swal.fire({
                      text: "ได้รับเงินจากลูกค้าเรียบร้อย?",
                      icon: 'question',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      cancelButtonText: 'ยกเลิก',
                      confirmButtonText: 'ได้รับเงินเรียบร้อย'
                    }).then((result) => {
                      if (result.isConfirmed) {
                        changeTableStatus(current_table_id.current, "ว่าง");
                      }
                    });
                  }}
                >
                  <Payments /> <span className="ml-3">รับเงินสด</span>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div >
  );
};

export default ManageTablePage;
