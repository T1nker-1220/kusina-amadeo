'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', content: '' });

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      currentPassword: formData.get('currentPassword') as string,
      newPassword: formData.get('newPassword') as string,
    };

    // Basic validation
    if (data.phone && !/^\+?[\d\s-]{10,}$/.test(data.phone)) {
      setMessage({
        type: 'error',
        content: 'Please enter a valid phone number',
      });
      setIsLoading(false);
      return;
    }

    if (data.newPassword && data.newPassword.length < 6) {
      setMessage({
        type: 'error',
        content: 'New password must be at least 6 characters long',
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      // Update session with new user data including phone and address
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
        },
      });

      setMessage({
        type: 'success',
        content: 'Profile updated successfully',
      });

      // Clear password fields after successful update
      const form = e.currentTarget as HTMLFormElement;
      form.currentPassword.value = '';
      form.newPassword.value = '';
    } catch (error) {
      setMessage({
        type: 'error',
        content: error instanceof Error ? error.message : 'Failed to update profile',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

      {message.content && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {message.content}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              name="name"
              type="text"
              defaultValue={session.user.name || ''}
              required
            />
            
            <Input
              label="Email"
              name="email"
              type="email"
              defaultValue={session.user.email || ''}
              required
            />

            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              defaultValue={session.user.phone || ''}
              placeholder="+63 XXX XXX XXXX"
              pattern="^\+?[\d\s-]{10,}$"
              title="Please enter a valid phone number"
            />

            <Input
              label="Address"
              name="address"
              type="text"
              defaultValue={session.user.address || ''}
              placeholder="Enter your complete delivery address"
              required
            />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold">Change Password</h2>
          <p className="text-sm text-gray-600">Leave blank if you don't want to change your password</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
            />
            
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              minLength={6}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full md:w-auto"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
