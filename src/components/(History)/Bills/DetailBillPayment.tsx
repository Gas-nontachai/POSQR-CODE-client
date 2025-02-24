import React, { useState, useEffect, useRef } from "react";
import { formatDate } from '@/utils/date-func';
import ReceiptPrint from '@/components/(Manage)/Table/ReceiptPrint';
import QRCodeGenerator from '@/utils/qrcode-generater';

import { Close, ShoppingCart } from '@mui/icons-material';
import { Dialog, AppBar, Toolbar } from '@mui/material';

import { useBill, usePayment } from '@/hooks/hooks';
import { Bill, Payment } from '@/types/types';
const { getPaymentBy, } = usePayment();
const { getBillBy } = useBill();
interface DetailBillPaymentProps {
    bill_id: string;
    onClose: () => void;
}

const DetailBillPayment: React.FC<DetailBillPaymentProps> = ({ bill_id, onClose }) => {
    const [billData, setNewBill] = useState<Bill>({
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
    const [paymentData, setNewPayment] = useState<Payment>({
        payment_id: '',
        bill_id: '',
        table_id: '',
        amount_total: 0,
        payment_method: '',
        payment_status: '',
        payment_time: ''
    });

    useEffect(() => {
        fetchBill()
        fetchPayment();
    }, []);

    const fetchBill = async () => {
        try {
            const res = await getBillBy({
                bill_id
            });
            setNewBill(res[0]);
        } catch (error) {
            console.error("Error fetching bill data:", error);
        }
    };

    const fetchPayment = async () => {
        try {
            const res = await getPaymentBy({
                bill_id
            });
            setNewPayment(res[0]);
        } catch (error) {
            console.error("Error fetching payment data:", error);
        }
    };

    return (
        <Dialog fullScreen open={true} onClose={onClose}>
            <AppBar sx={{ position: "relative", backgroundColor: "#f3f4f6", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)" }}>
                <Toolbar className="flex justify-center p-4 text-lg text-gray-800">
                    <ShoppingCart /><span className='ml-1 font-[600]'>ตะกร้า</span>
                </Toolbar>
                <button className="hover:text-gray-700 text-gray-500 p-2 rounded-full absolute right-2 top-2" onClick={onClose}>
                    <Close />
                </button>
            </AppBar>
            <div className="container mx-auto bg-white rounded pb-3 p-6 h-5/6 overflow-auto relative">
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
                            billData.qr_code ? (
                                <div>
                                    <span className="mb-5"><strong>QR Code สั่งอาหาร</strong></span>
                                    <QRCodeGenerator link={billData.qr_code} size={150} />
                                </div>
                            ) : (
                                <p className="text-sm">ไม่มีข้อมูล QR Code</p>
                            )
                        }
                    </div>
                    <hr className="border-dashed mb-2" />
                    <div className="text-center">
                        {billData && paymentData && (
                            <ReceiptPrint billData={billData} paymentData={paymentData} show_qr_code={true} />
                        )}
                    </div>
                    <p className="text-center text-xs mt-2">ขอบคุณที่ใช้บริการ!</p>
                </div>
            </div>
        </Dialog>
    );
};

export default DetailBillPayment;
