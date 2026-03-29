"use client";

import { useState } from "react";

export default function MemberDashboard() {
  const [link, setLink] = useState("");

  const generate = async () => {
    try {
      const res = await fetch("/api/referrals/generate");
      const data = await res.json();
      setLink(data.link);
    } catch (err) {
      alert("Error generating link");
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(link);
    alert("Copied!");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">My Dashboard</h1>

      <div className="mt-6">
        <button
          onClick={generate}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Generate Referral Link
        </button>
      </div>

      {link && (
        <div className="mt-4">
          <p className="text-sm break-all">{link}</p>

          <button
            onClick={copy}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Copy Link
          </button>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(link)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 bg-green-600 text-white px-4 py-2 rounded"
          >
            Share on WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}