
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { authService } from '@/lib/supabase';
import { CheckCircle, AlertTriangle, Shield } from 'lucide-react';

// Simulated security logs type (to be implemented in the backend)
type SecurityLog = {
  id: string;
  userId: string;
  email: string;
  action: 'login' | 'logout' | 'failed_login' | 'admin_change' | 'password_reset';
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  success: boolean;
};

// This function would be implemented in supabase.ts in a real application
const fetchSecurityLogs = async (): Promise<SecurityLog[]> => {
  // This is just a placeholder for demonstration.
  // In a real implementation, you would fetch actual logs from Supabase.
  
  // Mock data for demonstration
  const mockLogs: SecurityLog[] = [
    {
      id: '1',
      userId: 'user-123',
      email: 'admin@example.com',
      action: 'login',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      timestamp: new Date().toISOString(),
      success: true
    },
    {
      id: '2',
      userId: 'user-456',
      email: 'user@example.com',
      action: 'failed_login',
      ipAddress: '192.168.1.2',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      success: false
    },
    {
      id: '3',
      userId: 'user-789',
      email: 'manager@example.com',
      action: 'admin_change',
      ipAddress: '192.168.1.3',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)',
      timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      success: true
    }
  ];
  
  return mockLogs;
};

const SecurityLogsTable = () => {
  const { data: logs, isLoading, error, refetch } = useQuery({
    queryKey: ['security-logs'],
    queryFn: fetchSecurityLogs,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) return <div className="flex justify-center py-8">Loading security logs...</div>;
  
  if (error) return (
    <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">
      Error loading security logs: {error instanceof Error ? error.message : String(error)}
    </div>
  );

  const getActionName = (action: string): string => {
    switch (action) {
      case 'login': return 'User Login';
      case 'logout': return 'User Logout';
      case 'failed_login': return 'Failed Login Attempt';
      case 'admin_change': return 'Admin Role Change';
      case 'password_reset': return 'Password Reset';
      default: return action;
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Security Logs</h2>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>A log of security-related activities</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs && logs.length > 0 ? (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{formatDate(log.timestamp)}</TableCell>
                  <TableCell>{log.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {log.action === 'admin_change' && <Shield className="h-3 w-3 mr-1" />}
                      {getActionName(log.action)}
                    </div>
                  </TableCell>
                  <TableCell>{log.ipAddress}</TableCell>
                  <TableCell>
                    {log.success ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" /> Success
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        <AlertTriangle className="h-3 w-3 mr-1" /> Failed
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No security logs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground">
        <p>Security logs are retained for 30 days.</p>
      </div>
    </div>
  );
};

export default SecurityLogsTable;
