
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Users, 
  MapPin, 
  Activity, 
  TrendingUp, 
  Calendar, 
  Star,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adventureService, authService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const fetchDashboardStats = async () => {
  try {
    const adventures = await adventureService.getAdventures();
    const users = await authService.getAllUsers();
    const completedCount = await adventureService.getCompletedAdventuresCount();

    const avgRating = adventures.reduce((sum, adv) => sum + (adv.rating || 0), 0) / 
      (adventures.length || 1);

    return {
      userCount: users.length,
      adventureCount: adventures.length,
      completedCount: completedCount,
      avgRating: avgRating.toFixed(1),
      typeDistribution: adventures.reduce((acc, adv) => {
        acc[adv.type] = (acc[adv.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

const AdminDashboard = () => {
  const { toast } = useToast();
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: fetchDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">Loading dashboard...</div>
    );
  }

  const renderErrorState = (error: unknown) => (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="mb-4 rounded-full bg-destructive/10 p-3 w-12 h-12 flex items-center justify-center mx-auto">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="font-medium text-lg mb-2">Something went wrong</h3>
        <p className="text-muted-foreground text-sm max-w-md">
          {error instanceof Error ? error.message : String(error)}
        </p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => window.location.reload()}
        >
          Try again
        </Button>
      </div>
    </div>
  );

  if (error) {
    return renderErrorState(error);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="user-count">{stats?.userCount || 0}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Adventures</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="adventure-count">{stats?.adventureCount || 0}</div>
            <p className="text-xs text-muted-foreground">Available experiences</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="completed-count">{stats?.completedCount || 0}</div>
            <p className="text-xs text-muted-foreground">Adventures completed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="avg-rating">
              {isNaN(Number(stats?.avgRating)) ? '0.0' : stats?.avgRating}
            </div>
            <p className="text-xs text-muted-foreground">out of 5.0</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Adventure Types</CardTitle>
            <CardDescription>Distribution of adventure categories</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.typeDistribution && Object.keys(stats.typeDistribution).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(stats.typeDistribution)
                  .sort(([, a], [, b]) => Number(b) - Number(a))
                  .map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="font-medium">{type}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">{count}</span>
                      <span className="ml-2 text-muted-foreground text-sm">
                        ({Math.round((Number(count) / (stats?.adventureCount || 1)) * 100)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                No adventure data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest user interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-2 p-1 bg-green-100 rounded-full">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">New user registrations</p>
                  <p className="text-xs text-muted-foreground">
                    {stats?.userCount || 0} total users in the system
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-2 p-1 bg-blue-100 rounded-full">
                  <Calendar className="h-3 w-3 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Completed adventures</p>
                  <p className="text-xs text-muted-foreground">
                    {stats?.completedCount || 0} adventures completed by users
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            Updated just now
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
