
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminDashboard from './AdminDashboard';
import AdminUserTable from './AdminUserTable';
import SecurityLogsTable from './SecurityLogsTable';
import AdventureGenerator from '@/components/AdventureGenerator';
import { Users, BarChart, Shield, MapPin, AlertTriangle } from 'lucide-react';

const AdminTabs = () => {
  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger value="dashboard" className="flex items-center">
          <BarChart className="mr-2 h-4 w-4" />
          Dashboard
        </TabsTrigger>
        <TabsTrigger value="users" className="flex items-center">
          <Users className="mr-2 h-4 w-4" />
          Users
        </TabsTrigger>
        <TabsTrigger value="adventures" className="flex items-center">
          <MapPin className="mr-2 h-4 w-4" />
          Adventures
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center">
          <Shield className="mr-2 h-4 w-4" />
          Security
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="dashboard">
        <AdminDashboard />
      </TabsContent>
      
      <TabsContent value="users">
        <AdminUserTable />
      </TabsContent>
      
      <TabsContent value="adventures">
        <div>
          <h2 className="text-2xl font-bold mb-6">Adventure Management</h2>
          <AdventureGenerator />
        </div>
      </TabsContent>
      
      <TabsContent value="security">
        <SecurityLogsTable />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
