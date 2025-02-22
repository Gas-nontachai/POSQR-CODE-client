import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeGenerator = ({ link, size }) => {
    return (
        <div>
            <QRCodeCanvas value={link} size={size} />
        </div>
    );
};

export default QRCodeGenerator;
