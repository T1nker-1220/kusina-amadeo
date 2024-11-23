"use client";
import Link from "next/link";
import { FiHome, FiShoppingBag, FiUsers, FiSettings, FiMenu } from "react-icons/fi";

export function AdminSidebar() {
  const menuItems = [
    { icon: FiHome, label: "Dashboard", href: "/admin" },
    { icon: FiShoppingBag, label: "Orders", href: "/admin/orders" },
    { icon: FiUsers, label: "Customers", href: "/admin/customers" },
    { icon: FiMenu, label: "Products", href: "/admin/products" },
    { icon: FiSettings, label: "Settings", href: "/admin/settings" },
  ];

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
      </div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center space-x-2 text-gray-600 hover:text-black hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
