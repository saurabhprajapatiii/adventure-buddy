
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, User, Shield, LogOut } from 'lucide-react';

const UserProfilePage = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p>Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto glass-panel rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to view your profile settings.
            </p>
            <Button 
              onClick={() => navigate('/signin')}
              className="bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90 transition-colors"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      // This would typically call an API to update the user's profile
      // await authService.updateUserProfile(user.id, { name });
      
      // For now we'll just show a toast
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign out');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="pb-6 mb-6 border-b border-border">
            <h1 className="text-3xl font-bold font-display mb-2">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your profile and preferences
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              {user.isAdmin && (
                <TabsTrigger value="admin" className="flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your account details and personal information.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={user.email}
                          disabled
                        />
                        <p className="text-xs text-muted-foreground">
                          Your email cannot be changed.
                        </p>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          disabled={saving || name === user.name}
                        >
                          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Account Management</CardTitle>
                  <CardDescription>
                    Sign out or manage your account settings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    onClick={handleSignOut}
                    className="flex items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            {user.isAdmin && (
              <TabsContent value="admin">
                <Card>
                  <CardHeader>
                    <CardTitle>Admin Access</CardTitle>
                    <CardDescription>
                      You have admin privileges on this platform.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      As an administrator, you have access to additional features and settings.
                      Use the admin panel to manage users, adventures, and site settings.
                    </p>
                    <Button 
                      onClick={() => navigate('/admin')}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Go to Admin Panel
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
