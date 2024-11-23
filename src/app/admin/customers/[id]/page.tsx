"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

interface Order {
  _id: string;
  total: number;
  status: string;
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface Customer {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  orders: Order[];
}

export default function CustomerDetailsPage({ params }: { params: { id: string } }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCustomerDetails();
  }, [params.id]);

  const fetchCustomerDetails = async () => {
    try {
      const response = await fetch(`/api/admin/customers/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setCustomer(data);
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return <div className="p-4">Customer not found</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Customers
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Customer Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-500">Name</label>
              <p className="font-medium">{customer.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="font-medium">{customer.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Member Since</label>
              <p className="font-medium">{formatDate(customer.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Order Statistics */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold">{customer.orders?.length || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-semibold">
                ₱{customer.orders?.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="mt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Order History</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customer.orders?.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={`/admin/orders/${order._id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      {order._id}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ₱{order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <ul className="text-sm text-gray-500">
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.quantity}x {item.name}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
