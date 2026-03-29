"use client";

import { useState } from "react";

export default function MpesaPage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const submit = async () => {
    const res = await fetch("/api/payments/mpesa-confirm", {
      method: "POST",
      body: JSON.stringify({ transactionCode: code }),
    });

    const text = await res.text();
    setMessage(text);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Submit Mpesa Payment</h1>

      <input
        placeholder="Enter Mpesa Code"
        className="border p-3 mt-4"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        onClick={submit}
        className="block mt-3 bg-green-600 text-white px-4 py-2 rounded"
      >
        Submit
      </button>

      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}