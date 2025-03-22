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

  return (
    <QRCodeSVG
      size={300}
      marginSize={1}
      value={QRData}
    />
  )
}
