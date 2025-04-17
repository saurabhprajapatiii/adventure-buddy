
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';
import AdminTabs from '@/components/admin/AdminTabs';

const AdminPanel = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    if (!user) {
      navigate('/signin');
      return;
    }
    
    if (!isAdmin) {
      // Redirect non-admin users to the dashboard
      toast.error("You don't have permission to access the admin panel");
      navigate('/dashboard');
    }
  }, [user, isAdmin, navigate]);

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">
            Manage users, adventures, and system settings
          </p>
        </div>
        
        <AdminTabs />
      </main>
    </div>
  );
};

export default AdminPanel;
