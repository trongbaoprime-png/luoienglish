"use client";

import { useState, useEffect } from "react";
import { Users, Download } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  status: string;
  createdAt: string;
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  useEffect(() => {
    fetch("/api/admin/subscribers")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSubscribers(data.data);
      });
  }, []);

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," + ["Email,Status,Date", ...subscribers.map((s) => `${s.email},${s.status},${s.createdAt}`)].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "subscribers_luoidonnha.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-[#0d9488]" />
          Danh Sách Email Đăng Ký ({subscribers.length})
        </h1>
        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-4 py-2 bg-[#0d9488] text-white text-sm font-medium rounded-lg hover:bg-[#0f766e] transition-colors"
        >
          <Download className="w-4 h-4" />
          Xuất File CSV
        </button>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-xs font-bold text-stone-600 uppercase">
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Trạng thái</th>
              <th className="py-3 px-4">Ngày đăng ký</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-sm">
            {subscribers.map((sub) => (
              <tr key={sub.id} className="hover:bg-stone-50">
                <td className="py-3 px-4 font-mono font-medium text-stone-900">{sub.email}</td>
                <td className="py-3 px-4">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    {sub.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-stone-500 text-xs">
                  {new Date(sub.createdAt).toLocaleDateString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
