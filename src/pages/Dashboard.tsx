
import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfile from '@/components/UserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

// Fix the type definition for completed adventures
type CompletedAdventure = {
  adventure_id: string;
  completed_at: string;
  adventures: any; // Type this more specifically if needed
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <Skeleton className="h-12 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <Skeleton className="h-6 w-1/2 mb-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Skeleton className="h-[600px] w-full rounded-xl" />
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
              Please sign in to view your dashboard and adventure history.
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
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="pb-6 mb-6 border-b border-border">
            <h1 className="text-3xl font-bold font-display mb-2">{user.name}'s Dashboard</h1>
            <p className="text-muted-foreground">
              Track your adventure history and manage your saved experiences
            </p>
          </div>
          
          <UserProfile />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
