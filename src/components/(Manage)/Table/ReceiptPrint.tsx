import React from 'react';
import ReactDOM from 'react-dom/client'; // ใช้ `react-dom/client` สำหรับ React 18+
import { Bill, Payment } from '@/types/types';
import { formatDate } from '@/utils/date-func';
import QRCodeGenerator from '@/utils/qrcode-generater';

interface ReceiptPrintProps {
    billData: Bill;
    paymentData: Payment;
    show_qr_code: boolean;
}

const ReceiptPrint: React.FC<ReceiptPrintProps> = ({ billData, paymentData, show_qr_code }) => {
    const printDetail = async () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            // สร้าง div ที่จะใช้เป็น root container
            const container = printWindow.document.createElement('div');
            printWindow.document.body.appendChild(container); // เพิ่ม div ลงใน body

            // ใช้ ReactDOM.createRoot เพื่อ render
            const root = ReactDOM.createRoot(container);

            root.render(
                <div className="font-sans p-5">
                    <div className="max-w-xs mx-auto border-2 border-gray-300 rounded-lg shadow-lg bg-white p-4">
                        <h2 className="text-center text-blue-600 text-xl font-semibold mb-4">ร้านอาหาร XYZ</h2>
                        <p className="text-center text-sm">123 ถนนสุขุมวิท, กรุงเทพฯ</p>
                        <p className="text-center text-sm">โทร: 099-123-4567</p>
                        <hr className="my-4" />

                        <div className="text-sm">
                            <p><strong>โต๊ะ:</strong> {billData.table_number || 'N/A'}</p>
                            <p><strong>เลขที่ใบเสร็จ:</strong> {paymentData.payment_id || 'N/A'}</p>
                            <p><strong>วันที่:</strong> {formatDate(billData.add_date, 'dd/MM/yyyy HH:mm') || 'N/A'}</p>
                            <p><strong>จำนวนลูกค้า:</strong> {billData.amount_customer || 'N/A'} ท่าน</p>
                            <p><strong>เวลาเริ่มทาน:</strong> {formatDate(billData.start_time, 'HH:mm (dd/MM/yyyy)') || 'N/A'}</p>
                            <p><strong>เวลาหมดอายุ:</strong> {formatDate(billData.expired_time, 'HH:mm (dd/MM/yyyy)') || 'N/A'}</p>
                        </div>
                        <hr className="my-4" />

                        <div className="text-center font-bold text-lg mb-2">
                            <p>ยอดรวม: {paymentData.amount_total.toFixed(2)} ฿</p>
                            <p className="text-xs">(ราคารวมภาษีมูลค่าเพิ่ม)</p>
                        </div>

                        <hr className="my-4" />

                        {show_qr_code && (
                            <div className="text-center mt-4">
                                {QRCodeGenerator({ link: billData.qr_code, size: 150 })}
                            </div>
                        )}

                        <hr className="my-4" />

                        <div className="text-center text-xs text-gray-600 mt-5">
                            ขอบคุณที่ใช้บริการ!
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="flex justify-center">
            <button
                onClick={printDetail}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                ปริ้นใบเสร็จ
            </button>
        </div>
    );
};

export default ReceiptPrint;
