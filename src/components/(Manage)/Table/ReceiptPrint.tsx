import React from 'react';
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
            let qrCodeDataUrl = '';
            if (show_qr_code && billData.qr_code) {
                const qrCodeElement = QRCodeGenerator({ link: billData.qr_code, size: 150 });
                qrCodeDataUrl = qrCodeElement instanceof HTMLImageElement ? qrCodeElement.src : '';  // Extract the src URL
            }

            printWindow.document.write(`
                <html>
                    <head>
                        <title>ใบเสร็จรับเงิน</title>
                        <style>
                            @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@200;300;400;500;600;700&display=swap');
                            body {
                                font-family: "Kanit", sans-serif;
                                background-color: #f4f4f4;
                                padding: 20px;
                            }
                            .receipt-container {
                                width: 320px;
                                padding: 20px;
                                margin: 0 auto;
                                border: 2px solid #333;
                                border-radius: 8px;
                                background-color: #fff;
                                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                                text-align: left;
                            }
                            .header, .footer {
                                text-align: center;
                                font-size: 14px;
                            }
                            .header h2 {
                                color: #007BFF;
                                font-size: 22px;
                                margin-bottom: 8px;
                            }
                            .details p, .summary p {
                                font-size: 14px;
                                margin: 4px 0;
                            }
                            .summary {
                                text-align: center;
                                font-size: 18px;
                                font-weight: bold;
                            }
                            .qr-code {
                                text-align: center;
                                margin-top: 10px;
                            }
                            .footer {
                                font-size: 12px;
                                color: #888;
                                margin-top: 15px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="receipt-container">
                            <div class="header">
                                <h2>ร้านอาหาร XYZ</h2>
                                <p>123 ถนนสุขุมวิท, กรุงเทพฯ</p>
                                <p>โทร: 099-123-4567</p>
                            </div>
                            <hr />
                            <div class="details">
                                <p><strong>โต๊ะ:</strong> ${billData.table_number || 'N/A'}</p>
                                <p><strong>เลขที่ใบเสร็จ:</strong> ${paymentData.payment_id || 'N/A'}</p>
                                <p><strong>วันที่:</strong> ${formatDate(billData.add_date, 'dd/MM/yyyy HH:mm') || 'N/A'}</p>
                                <p><strong>จำนวนลูกค้า:</strong> ${billData.amount_customer || 'N/A'} ท่าน</p>
                                <p><strong>เวลาเริ่มทาน:</strong> ${formatDate(billData.start_time, 'HH:mm (dd/MM/yyyy)') || 'N/A'}</p>
                                <p><strong>เวลาหมดอายุ:</strong> ${formatDate(billData.expired_time, 'HH:mm (dd/MM/yyyy)') || 'N/A'}</p>
                            </div>
                            <hr />
                            <div class="summary">
                                <p>ยอดรวม: ${paymentData.amount_total.toFixed(2)} ฿</p>
                                <p style="font-size: 10px;">(ราคารวมภาษีมูลค่าเพิ่ม)</p>
                            </div>
                            <hr />
                            ${show_qr_code && qrCodeDataUrl ? `
                                <div class="qr-code">
                                    <img src="${qrCodeDataUrl}" alt="QR Code" />
                                </div>
                            ` : ''} <!-- ถ้า show_qr_code เป็น false จะไม่แสดง QR Code -->
                            <hr />
                            <div class="footer">ขอบคุณที่ใช้บริการ!</div>
                        </div>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
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
