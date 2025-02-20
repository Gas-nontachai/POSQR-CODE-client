import React from "react";
import { QRCodeCanvas } from "qrcode.react"; // ✅ เปลี่ยนจาก QRCode เป็น QRCodeCanvas

const QRCodeGenerator = ({ link, size }) => {
    return (
        <div>
            <QRCodeCanvas value={link} size={size} />
        </div>
    );
};

export default QRCodeGenerator;
 