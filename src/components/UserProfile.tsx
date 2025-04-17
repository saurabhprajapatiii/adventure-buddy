
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, adventureService } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Heart, Clock, MapPin, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { RealtimeChannel } from '@supabase/supabase-js';

interface AdventureItemProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  duration: number;
  cost: number;
  type: string;
  location?: string;
  completedDate?: string;
  onRemove?: (id: string) => void;
}

const AdventureItem: React.FC<AdventureItemProps> = ({
  id,
  title,
  description,
  imageUrl,
  duration,
  cost,
  type,
  location,
  completedDate,
  onRemove
}) => {
  // Use a fallback image if the provided URL is invalid or missing
  const fallbackImageUrl = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=500&q=80";
  
  const [imgSrc, setImgSrc] = useState(imageUrl || fallbackImageUrl);
  
  const handleImageError = () => {
    setImgSrc(fallbackImageUrl);
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 h-48 md:h-auto relative">
          <img 
            src={imgSrc} 
            alt={title}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
          <div className="absolute top-2 right-2">
            {onRemove && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-white/80 hover:bg-white text-foreground rounded-full h-8 w-8"
                onClick={() => onRemove(id)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="p-5 flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold mb-1">{title}</h3>
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{type}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <Clock className="h-4 w-4 mr-1" />
            <span className="mr-3">{duration} {duration === 1 ? 'day' : 'days'}</span>
            <span className="mr-1 font-semibold">₹</span>
            <span>{cost}</span>
            {location && (
              <>
                <MapPin className="h-4 w-4 ml-3 mr-1" />
                <span>{location}</span>
              </>
            )}
          </div>
          
          <p className="text-sm text-foreground/70 mb-4 line-clamp-2">{description}</p>
          
          {completedDate && (
            <div className="flex items-center text-sm text-success mt-2">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>Completed on {new Date(completedDate).toLocaleDateString()}</span>
            </div>
          )}
          
          <div className="mt-auto pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-primary/20 text-primary hover:bg-primary/5"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [savedAdventures, setSavedAdventures] = useState<any[]>([]);
  const [completedAdventures, setCompletedAdventures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let userAdventuresSubscription: RealtimeChannel;
    
    const fetchUserAdventures = async () => {
      if (!user) return;
      
      setLoading(true);
      
      try {
        // Fetch saved adventures
        const saved = await adventureService.getUserSavedAdventures(user.id);
        setSavedAdventures(saved);
        
        // Fetch completed adventures
        const completed = await adventureService.getUserCompletedAdventures(user.id);
        setCompletedAdventures(completed);
      } catch (error) {
        console.error('Error fetching user adventures:', error);
        toast.error('Failed to load your adventures');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserAdventures();
    
    // Subscribe to real-time updates for user adventures
    if (user) {
      userAdventuresSubscription = supabase
        .channel('user-adventures-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'user_adventures',
          filter: `user_id=eq.${user.id}`
        }, () => {
          // Refresh data when changes occur
          fetchUserAdventures();
        })
        .subscribe();
    }
    
    return () => {
      // Cleanup subscription on unmount
      if (userAdventuresSubscription) {
        userAdventuresSubscription.unsubscribe();
      }
    };
  }, [user]);
  
  const handleRemoveSaved = async (adventureId: string) => {
    if (!user) return;
    
    try {
      // Update UI optimistically
      setSavedAdventures(prev => prev.filter(item => item.adventure_id !== adventureId));
      
      // Call API to remove the saved adventure
      await adventureService.removeUserSavedAdventure(user.id, adventureId);
      
      toast.success('Adventure removed from favorites');
    } catch (error) {
      console.error('Error removing saved adventure:', error);
      toast.error('Failed to remove adventure');
      
      // Fetch again to restore state
      const saved = await adventureService.getUserSavedAdventures(user.id);
      setSavedAdventures(saved);
    }
  };
  
  return (
    <div className="mt-6">
      <Tabs defaultValue="saved">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="saved" className="data-[state=active]:bg-primary/10">
            <Heart className="h-4 w-4 mr-2" />
            Saved Adventures
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-primary/10">
            <CheckCircle className="h-4 w-4 mr-2" />
            Completed Adventures
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="saved">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col md:flex-row">
                  <Skeleton className="h-48 md:h-[200px] w-full md:w-1/3" />
                  <div className="p-5 flex-1">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-16 w-full mb-2" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : savedAdventures.length > 0 ? (
            <div className="space-y-4">
              {savedAdventures.map((item) => (
                <AdventureItem
                  key={item.adventure_id}
                  id={item.adventure_id}
                  title={item.adventures.title}
                  description={item.adventures.description}
                  imageUrl={item.adventures.imageUrl}
                  duration={item.adventures.duration}
                  cost={item.adventures.cost}
                  type={item.adventures.type}
                  location={item.adventures.location_name}
                  onRemove={handleRemoveSaved}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass-panel rounded-xl">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No saved adventures yet</h3>
              <p className="text-muted-foreground mb-6">
                Discover and save adventures that interest you
              </p>
              <Button 
                variant="outline"
                className="border-primary/20 text-primary hover:bg-primary/5"
                onClick={() => window.location.href = '/'}
              >
                Find Adventures
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col md:flex-row">
                  <Skeleton className="h-48 md:h-[200px] w-full md:w-1/3" />
                  <div className="p-5 flex-1">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-16 w-full mb-2" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : completedAdventures.length > 0 ? (
            <div className="space-y-4">
              {completedAdventures.map((item) => (
                <AdventureItem
                  key={item.adventure_id}
                  id={item.adventure_id}
                  title={item.adventures.title}
                  description={item.adventures.description}
                  imageUrl={item.adventures.imageUrl}
                  duration={item.adventures.duration}
                  cost={item.adventures.cost}
                  type={item.adventures.type}
                  location={item.adventures.location_name}
                  completedDate={item.completed_at}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass-panel rounded-xl">
              <CheckCircle className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No completed adventures yet</h3>
              <p className="text-muted-foreground mb-6">
                Your completed adventures will appear here
              </p>
              <Button 
                variant="outline"
                className="border-primary/20 text-primary hover:bg-primary/5"
                onClick={() => window.location.href = '/'}
              >
                Find Adventures
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
