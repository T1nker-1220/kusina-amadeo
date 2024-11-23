"use client";

import { FiShoppingBag, FiClock, FiCheck, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";

export function OrderStats() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/orders/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    {
      icon: FiShoppingBag,
      label: "Total Orders",
      value: stats.total.toString(),
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: FiClock,
      label: "Pending",
      value: stats.pending.toString(),
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: FiCheck,
      label: "Completed",
      value: stats.completed.toString(),
      color: "bg-green-100 text-green-600",
    },
    {
      icon: FiX,
      label: "Cancelled",
      value: stats.cancelled.toString(),
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
