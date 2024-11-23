"use client";

import { useState, useEffect } from "react";
import { FiSave } from "react-icons/fi";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    storeName: "Kusina De Amadeo",
    storeEmail: "kusinadeamadeo@gmail.com",
    storePhone: "",
    storeAddress: "",
    orderNotifications: true,
    emailNotifications: true,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/admin/settings");
        if (!response.ok) {
          throw new Error("Failed to fetch settings");
        }
        const data = await response.json();
        if (data && Object.keys(data).length > 0) {
          setSettings(data);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        setError("Failed to load settings");
        toast.error("Failed to load settings");
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      setSuccess(true);
      toast.success("Settings saved successfully!");
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setError("Failed to save settings");
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Store Information</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
                Store Name
              </label>
              <input
                type="text"
                name="storeName"
                id="storeName"
                value={settings.storeName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700">
                Store Email
              </label>
              <input
                type="email"
                name="storeEmail"
                id="storeEmail"
                value={settings.storeEmail}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="storePhone" className="block text-sm font-medium text-gray-700">
                Store Phone
              </label>
              <input
                type="tel"
                name="storePhone"
                id="storePhone"
                value={settings.storePhone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700">
                Store Address
              </label>
              <input
                type="text"
                name="storeAddress"
                id="storeAddress"
                value={settings.storeAddress}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow sm:rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Notifications</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="orderNotifications"
                id="orderNotifications"
                checked={settings.orderNotifications}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="orderNotifications" className="ml-2 block text-sm text-gray-700">
                Receive order notifications
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="emailNotifications"
                id="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                Receive email notifications
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3">
          {success && (
            <span className="text-green-600 text-sm">Settings saved successfully!</span>
          )}
          {error && (
            <span className="text-red-600 text-sm">{error}</span>
          )}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <FiSave className="mr-2 -ml-1 h-4 w-4" />
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
