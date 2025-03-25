"use client"

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function QR() {
  const [QRData, setQRData] = useState("")

  fetch("http://localhost:3000/api?fetch=getQR").then((res) => {
    res.json().then((val) => {
      setQRData(JSON.stringify(val))
    })
  })

  if (QRData == "") return ( <div className="mt-20 w-96 h-96 bg-white"/> )
    else return (
      <QRCodeSVG
        className="mt-20 w-96 h-96"
        marginSize={1}
        value={QRData}
      />
    )
}
