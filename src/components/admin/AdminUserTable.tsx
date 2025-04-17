
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, authService } from '@/lib/supabase';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Shield, Trash2, UserX, CheckCircle, Clock } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Function to fetch all users
const fetchAllUsers = async () => {
  try {
    return await authService.getAllUsers();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

const AdminUserTable = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Query to fetch users
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: fetchAllUsers,
  });

  if (isLoading) return <div className="flex justify-center py-8">Loading users...</div>;
  
  if (error) return (
    <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">
      Error loading users: {error instanceof Error ? error.message : String(error)}
    </div>
  );

  const handleDeleteUser = async (userId: string) => {
    try {
      await authService.deleteUser(userId);
      toast.success('User deleted successfully');
      refetch();
      setShowDeleteDialog(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete user');
    }
  };

  const handleToggleAdmin = async (user: User) => {
    try {
      const newIsAdmin = !user.isAdmin;
      await authService.updateUserProfile(user.id, { isAdmin: newIsAdmin });
      toast.success(`User ${newIsAdmin ? 'promoted to admin' : 'demoted from admin'}`);
      refetch();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update user');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <Table>
        <TableCaption>A list of all registered users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users && users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.name || 'No name'}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
                <TableCell>
                  {user.isAdmin ? (
                    <Badge className="bg-purple-500 hover:bg-purple-600">
                      <Shield className="h-3 w-3 mr-1" /> Admin
                    </Badge>
                  ) : (
                    <Badge variant="outline">User</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleAdmin(user)}
                      title={user.isAdmin ? "Remove admin role" : "Make admin"}
                    >
                      {user.isAdmin ? <UserX className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDeleteDialog(true);
                      }}
                      title="Delete user"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.name || selectedUser?.email}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedUser && handleDeleteUser(selectedUser.id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUserTable;
