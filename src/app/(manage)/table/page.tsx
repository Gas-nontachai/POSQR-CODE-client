"use client";
import Swal from "sweetalert2";
import AddTableForm from "@/components/(Manage)/Table/AddTableForm";
import UpdateTableForm from "@/components/(Manage)/Table/UpdateTableForm";
import DetailTable from "@/components/(Manage)/Table/DetailTable";
import OpenTable from "@/components/(Manage)/Table/OpenTable";
import React, { useState, useEffect, useRef } from "react";
import { useTable } from "@/hooks/useTable";
import { useTableStatus, useBill, usePayment } from "@/hooks/hooks";
import { Table, Bill, Payment } from "@/types/types";

import { Menu, MenuItem, Button, Avatar, IconButton, Tooltip, Dialog, } from "@mui/material";
import {
  Edit, Delete, MenuOpen, People, CurrencyBitcoin, QrCode, Payments, Details
} from '@mui/icons-material';

const { getTableBy, insertTable, updateTableBy, deleteTableBy } = useTable();
const { getTableStatusBy } = useTableStatus();
const { getBillBy, updateBillBy } = useBill();
const { getPaymentBy, updatePaymentBy } = usePayment();

const ManageTablePage = () => {
  const [openTableDialog, setOpenTableDialog] = useState(false);
  const [openTableDetailDialog, setOpenTableDetailDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const [loading, SetLoading] = useState<boolean>(true)
  const [anchorEl, setAnchorEl] = useState(null);
  const [state, setState] = useState({
    currentLink: '',
    currentTableID: '',
    currentTableNumber: '',
  });

  const open = Boolean(anchorEl);
  const statusItems = useRef<{ value: string; title: string }[]>([]);

  const [newTable, setNewTable] = useState<Table[]>([{
    table_id: '',
    table_number: '',
    table_status: '',
    add_date: new Date()
  }]);

  const [newBill, setNewBill] = useState<Bill>({
    bill_id: '',
    table_id: '',
    table_number: '',
    amount_customer: '',
    bill_status: '',
    qr_code: '',
    start_time: '',
    expired_time: '',
    add_date: ''
  });

  const [newPayment, setNewPayment] = useState<Payment>({
    payment_id: '',
    bill_id: '',
    table_id: '',
    amount_total: 0,
    payment_method: '',
    payment_status: '',
    payment_time: ''
  });

  const tableToUpdate = useRef<Table>({
    table_id: '',
    table_number: '',
    table_status: '',
    add_date: ''
  })

  const manageItems = [
    { text: "Table Number", },
    { text: "Status", },
    { text: "Action", },
  ]

  useEffect(() => {
    fetchTableStatusOption()
    fetchData();
  }, []);

  useEffect(() => {
  }, [state, newBill, newPayment]);

  const updateState = (key: any, value: any) => {
    setState(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

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
    }
  };

  const fetchBill = async (table_id: string, bill_status: string = "un-paid") => {
    try {
      const res = await getBillBy({
        $and: [{ table_id }, { bill_status }],
      });
      setNewBill(res[0]);
    } catch (error) {
      console.error("Error fetching bill data:", error);
    } finally {
      SetLoading(false);
    }
  };

  const fetchPayment = async (table_id: string, payment_status: string = "un-paid") => {
    try {
      const res = await getPaymentBy({
        $and: [{ table_id }, { payment_status }],
      });
      setNewPayment(res[0]);
    } catch (error) {
      console.error("Error fetching payment data:", error);
    } finally {
      SetLoading(false);
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
    setOpenTableDialog(false)
  }

  const onGetBill = async (payment_method: string = "cash") => {
    await fetchBill(state.currentTableID, "pre-paid")
    await fetchPayment(state.currentTableID, "pre-paid")
    const updatedBill = {
      ...newBill,
      bill_id: newBill.bill_id,
      bill_status: "paid"
    };
    const updatedPayment = {
      ...newPayment,
      payment_id: newPayment.payment_id,
      payment_method: payment_method,
      payment_status: "paid"
    };
    Swal.fire({
      text: "ได้รับเงินจากลูกค้าเรียบร้อย?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'ยกเลิก',
      confirmButtonText: 'ได้รับเงินเรียบร้อย',
      customClass: {
        popup: 'custom-swal',
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        await updateBillBy(updatedBill)
        await updatePaymentBy(updatedPayment)
        changeTableStatus(state.currentTableID, "ว่าง");
      }
    });
  }

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {loading && (
        <div className=" flex justify-center">
          <span className="text-xl font-semibold text-gray-700">Loading...</span>
        </div>
      )}
      <div className="container mx-auto p-6 w-3/4 bg-white shadow-lg rounded-lg">
        <div className="flex justify-end mb-4">
          <button onClick={() => setOpenAddDialog(!openAddDialog)}
            className=" bg-green-500 hover:bg-green-600 p-2 rounded text-white font-bold">Add Table</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead className="bg-gray-600 text-white uppercase">
              <tr>
                {manageItems.map(item => (
                  <th className="px-6 py-3 text-left font-semibold" key={item.text}>{item.text}</th>
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
                      <Tooltip title="จัดการข้อมูลโต๊ะ">
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
                              filter: 'drop-shadow(0px 1px 3px rgba(155, 155, 155, 0.1))',
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
                  <td className="px-4 py-2 flex justify-around">
                    {(() => {
                      switch (item.table_status) {
                        case "ว่าง":
                          return (
                            <Button
                              variant="contained"
                              color="success"
                              onClick={async () => {
                                updateState("currentTableID", item.table_id);
                                updateState("currentTableNumber", item.table_number);
                                setOpenTableDialog(true);
                              }}
                            >
                              <QrCode /> <span className="ml-3">เปิดโต๊ะ</span>
                            </Button>
                          );

                        case "จองแล้ว":
                          return (
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => {
                                changeTableStatus(item.table_id, "กำลังใช้งาน");
                              }}
                            >
                              <People /> <span className="ml-3">เปิดโต๊ะ</span>
                            </Button>
                          );

                        case "กำลังใช้งาน":
                          return (
                            <div className="flex justify-evenly">
                              <Button
                                variant="contained"
                                color="success"
                                onClick={() => {
                                  Swal.fire({
                                    title: "คุณแน่ใจไหม?",
                                    text: "การเปลี่ยนสถานะนี้จะไม่สามารถย้อนกลับได้!",
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#3085d6",
                                    cancelButtonColor: "#d33",
                                    confirmButtonText: "ใช่, เปลี่ยนสถานะเลย!",
                                    cancelButtonText: "ยกเลิก",
                                  }).then(async (result) => {
                                    if (result.isConfirmed) {
                                      try {
                                        const updatedBill = {
                                          ...newBill,
                                          bill_id: newBill.bill_id,
                                          bill_status: "pre-paid"
                                        };
                                        const updatedPayment = {
                                          ...newPayment,
                                          payment_id: newPayment.payment_id,
                                          payment_status: "pre-paid"
                                        };
                                        await updateBillBy(updatedBill)
                                        await updatePaymentBy(updatedPayment)
                                        await changeTableStatus(
                                          item.table_id,
                                          "กำลังรอเรียกเก็บเงิน"
                                        );
                                      } catch (error) {
                                        Swal.fire(
                                          "เกิดข้อผิดพลาด!",
                                          "มีข้อผิดพลาดในการเปลี่ยนสถานะโต๊ะ.",
                                          "error"
                                        );
                                      }
                                    }
                                  });
                                }}
                              >
                                <CurrencyBitcoin /> <span className="ml-3">เปลี่ยนสถานะเป็น "เก็บเงิน"</span>
                              </Button>
                            </div>
                          );
                        default:
                          return null;
                      }
                    })()}
                    {!["ว่าง", "จองแล้ว"].includes(item.table_status) && (
                      <div>
                        {(() => {
                          let status = 'un-paid';
                          if (["กำลังรอเรียกเก็บเงิน"].includes(item.table_status)) {
                            status = 'pre-paid';
                          }
                          return (
                            <Button
                              variant="contained"
                              color="success"
                              onClick={async () => {
                                await fetchBill(item.table_id, status);
                                await fetchPayment(item.table_id, status);
                                setOpenTableDetailDialog(true);
                              }}
                            >
                              <Details /> <span className="ml-3">ดูรายละเอียด</span>
                            </Button>
                          );
                        })()}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="md"
      >
        <div className="bg-white p-6 rounded-lg relative" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setOpenAddDialog(false)}
            className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded absolute top-5 right-5"
          > X </button>
          <div>
            <AddTableForm count_table={newTable.length} statusItems={statusItems.current} onSubmit={onSubmit} />
          </div>
        </div>
      </Dialog>

      <Dialog
        open={openUpdateDialog}
        onClose={() => setOpenUpdateDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="md"
      >
        <div className="bg-white p-6 rounded-lg relative" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setOpenUpdateDialog(false)}
            className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded absolute top-5 right-5"
          > X </button>
          <div>
            <UpdateTableForm table_data={tableToUpdate.current} statusItems={statusItems.current} onSubmit={onUpdate} />
          </div>
        </div>
      </Dialog>

      <Dialog
        open={openTableDetailDialog}
        onClose={() => setOpenTableDetailDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="md"
      >
        <div className="bg-white p-6 rounded-lg relative" onClick={(e) => e.stopPropagation()} >
          <Button onClick={() => setOpenTableDetailDialog(false)}
            className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded absolute top-5 right-5">
            X
          </Button>
          <DetailTable billData={newBill} paymentData={newPayment} show_qr_code={
            newBill.bill_status === "un-paid" ? true : newBill.bill_status === "pre-paid" ? false : false
          } updateState={updateState} onGetBill={onGetBill} setDetailDialog={() => setOpenTableDetailDialog(false)} ></DetailTable>
        </div>
      </Dialog>

      <Dialog
        open={openTableDialog}
        onClose={() => setOpenTableDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="md"
      >
        <div className="bg-white p-6 rounded-lg relative" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setOpenTableDialog(false)}
            className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded absolute top-5 right-5"
          > X </button>
          <OpenTable billData={newBill} currentTableNumber={state.currentTableNumber} currentTableID={state.currentTableID} changeTableStatus={changeTableStatus}></OpenTable>
        </div>
      </Dialog>
    </>
  );
};

export default ManageTablePage; 