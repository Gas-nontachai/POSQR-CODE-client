import React, { useState } from "react";
import { formatDate } from '@/utils/date-func';
import { Bill, Payment } from '@/types/types';
import ReceiptPrint from './ReceiptPrint';
import QRCodeGenerator from '@/utils/qrcode-generater';
import { Button, TextField, Box, Paper } from "@mui/material";
import { QrCode, Payments, } from '@mui/icons-material';

interface DetailTableProps {
    billData?: Bill;
    paymentData?: Payment;
    show_qr_code: boolean;
    setDetailDialog: (v: boolean) => void;
    updateState: (key: any, value: any) => void;
    onGetBill: (payment_method: string) => void;
}

const DetailTable: React.FC<DetailTableProps> = ({ billData, paymentData, show_qr_code, setDetailDialog, updateState, onGetBill, }) => {
    const [openCashRecive, setOpenCashRecive] = useState(false);
    const [receivedAmount, setReceivedAmount] = useState('');
    const [isAmountInvalid, setIsAmountInvalid] = useState(false);

    const handleUpdateState = (key: any, value: any) => {
        updateState(key, value);
    }

    const handleOnGetBill = (payment_method: string = "cash") => {
        onGetBill(payment_method)
    }

    const handleSetDetailDialog = (v: boolean) => {
        setDetailDialog(v)
    }
    if (!billData || !paymentData) {
        return <div className="text-center text-red-500 font-bold">ข้อมูลบิลไม่พบ</div>;
    }
    return (
        <div className="">
            <div className="max-w-md mx-auto p-4 border border-gray-400 shadow-md rounded bg-white">
                <div className="text-center border-b border-dashed pb-2 mb-2">
                    <h2 className="text-lg font-bold">ร้านอาหาร XYZ</h2>
                    <p className="text-sm">123 ถนนสุขุมวิท, กรุงเทพฯ</p>
                    <p className="text-sm">โทร: 099-123-4567</p>
                </div>
                <div className="mb-2 text-sm">
                    <p><strong>โต๊ะ:</strong> {billData.table_number}</p>
                    <p><strong>เลขที่ใบเสร็จ:</strong> {paymentData.payment_id}</p>
                    <p><strong>วันที่:</strong> {formatDate(billData.add_date, 'dd/MM/yyyy HH:mm')}</p>
                </div>
                <hr className="border-dashed mb-2" />
                <div className="text-sm">
                    <p><strong>จำนวนลูกค้า:</strong> {billData.amount_customer} ท่าน</p>
                    <p><strong>สถานะบิล:</strong> {billData.bill_status}</p>
                    <p><strong>เวลาเริ่มทาน:</strong> {formatDate(billData.start_time, 'HH:mm (dd/MM/yyyy)')}</p>
                    <p><strong>เวลาหมดอายุ:</strong> {formatDate(billData.expired_time, 'HH:mm (dd/MM/yyyy)')}</p>
                </div>
                <hr className="border-dashed mb-2" />
                <div className="text-lg font-bold text-center">
                    <p>ยอดรวม: {paymentData.amount_total.toFixed(2)} ฿</p>
                    <p style={{ fontSize: '10px' }}>(ราคารวมภาษีมูลค่าเพิ่ม)</p>
                </div>
                <hr className="border-dashed mb-2" />
                <div className="text-center flex justify-center">
                    {
                        show_qr_code ? (
                            billData.qr_code ? (
                                <div>
                                    <span className="mb-5"><strong>QR Code สั่งอาหาร</strong></span>
                                    <QRCodeGenerator link={billData.qr_code} size={150} />
                                </div>
                            ) : (
                                <p className="text-sm">ไม่มีข้อมูล QR Code</p>
                            )
                        ) : null
                    }
                </div>
                <hr className="border-dashed mb-2" />
                <div className="text-center">
                    {billData && paymentData && (
                        <ReceiptPrint billData={billData} paymentData={paymentData} show_qr_code={true} />
                    )}
                </div>
                <p className="text-center text-xs mt-2">ขอบคุณที่ใช้บริการ!</p>

                {
                    !show_qr_code && (
                        <div className="flex justify-center">
                            <Button
                                className="m-2"
                                variant="contained"
                                color="success"
                                onClick={() => {
                                    handleUpdateState("currentTableID", billData.table_id);
                                    handleSetDetailDialog(false);
                                    handleOnGetBill("promypay")
                                }}
                            >
                                <QrCode /> <span className="ml-3">แสกน QR Code รับเงิน</span>
                            </Button>
                            <Button
                                className="m-2"
                                variant="contained"
                                color="success"
                                onClick={() => {
                                    handleUpdateState("currentTableID", billData.table_id);
                                    setOpenCashRecive(true)
                                }}
                            >
                                <Payments /> <span className="ml-3">รับเงินสด</span>
                            </Button>
                        </div>
                    )
                }
            </div>
            {
                openCashRecive && (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Paper
                            elevation={3}
                            className="p-8 w-full sm:w-96"
                        >
                            <div className="text-center mb-4">
                                <strong className="text-xl">Payment Details</strong>
                            </div>

                            <div className="mb-2">
                                <strong>Payment ID:</strong> {paymentData.payment_id}
                            </div>
                            <div className="mb-4">
                                <strong>Total Amount:</strong> {paymentData.amount_total.toFixed(2)} ฿
                            </div>

                            <div className="mb-4">
                                <TextField
                                    label="Received Amount"
                                    variant="outlined"
                                    type="number"
                                    fullWidth
                                    value={receivedAmount}
                                    onChange={(e) => setReceivedAmount(e.target.value)}
                                    placeholder="กรอกจำนวนเงินที่ได้รับ"
                                    error={isAmountInvalid}
                                    helperText={isAmountInvalid ? "จำนวนเงินที่ได้รับต้องมากกว่าหรือเท่ากับจำนวนเงินที่ต้องชำระ" : ""}
                                />
                            </div>

                            {receivedAmount && (
                                <div className="mt-4">
                                    <div>
                                        <strong>Change:</strong> {(parseFloat(receivedAmount) - Number(paymentData.amount_total)).toFixed(2)} ฿
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 flex justify-center">
                                <Button
                                    variant="contained"
                                    color="success"
                                    className="w-full"
                                    onClick={() => {
                                        if (parseFloat(receivedAmount) < Number(paymentData.amount_total) || !receivedAmount) {
                                            setIsAmountInvalid(true);
                                            return;
                                        }
                                        setIsAmountInvalid(false);
                                        handleSetDetailDialog(false);
                                        handleOnGetBill("promypay");
                                    }}
                                >
                                    ยืนยันการชำระเงิน
                                </Button>
                            </div>
                        </Paper>
                    </Box>
                )
            }
        </div >
    );
};

export default DetailTable;