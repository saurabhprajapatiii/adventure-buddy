
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Clock, MapPin, Share, CheckCircle } from 'lucide-react';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import { adventureService } from '@/lib/supabase';

export interface Adventure {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  duration: number;
  cost: number;
  type: string;
  rating: number;
  location?: {
    name: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  savedByUser?: boolean;
  completedByUser?: boolean;
  relevanceScore?: number;
}

interface AdventureCardProps {
  adventure: Adventure;
  onSave?: (adventure: Adventure) => void;
  onMarkCompleted?: (adventure: Adventure) => void;
}

const AdventureCard: React.FC<AdventureCardProps> = ({ 
  adventure, 
  onSave,
  onMarkCompleted 
}) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(adventure.savedByUser || false);
  const [isCompleted, setIsCompleted] = useState(adventure.completedByUser || false);
  const [isSaving, setIsSaving] = useState(false);
  const [isMarkingCompleted, setIsMarkingCompleted] = useState(false);

  const handleSave = async () => {
    if (!user) {
      toast("Please sign in", {
        description: "Sign in to save this adventure to your favorites",
        action: {
          label: "Sign In",
          onClick: () => window.location.href = '/signin',
        },
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const newSavedStatus = !isSaved;
      setIsSaved(newSavedStatus);
      
      if (onSave) {
        onSave(adventure);
      }
      
      if (newSavedStatus) {
        await adventureService.saveUserAdventure(user.id, adventure.id);
      } else {
        await adventureService.removeUserSavedAdventure(user.id, adventure.id);
      }
      
      toast(newSavedStatus ? "Added to favorites" : "Removed from favorites", {
        description: newSavedStatus 
          ? "Adventure added to your favorites" 
          : "Adventure removed from your favorites",
        action: {
          label: "View",
          onClick: () => window.location.href = '/dashboard',
        },
      });
    } catch (error) {
      console.error("Error saving adventure:", error);
      setIsSaved(!isSaved); // Revert on error
      toast.error("Failed to update favorites");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkCompleted = async () => {
    if (!user) {
      toast("Please sign in", {
        description: "Sign in to mark this adventure as completed",
        action: {
          label: "Sign In",
          onClick: () => window.location.href = '/signin',
        },
      });
      return;
    }
    
    setIsMarkingCompleted(true);
    
    try {
      const newCompletedStatus = !isCompleted;
      setIsCompleted(newCompletedStatus);
      
      if (onMarkCompleted) {
        onMarkCompleted(adventure);
      }
      
      if (newCompletedStatus) {
        await adventureService.markAdventureCompleted(user.id, adventure.id);
        
        toast("Adventure Completed!", {
          description: `You've marked "${adventure.title}" as completed.`,
          action: {
            label: "View History",
            onClick: () => window.location.href = '/dashboard',
          },
        });
      } else {
        await adventureService.unmarkAdventureCompleted(user.id, adventure.id);
        
        toast("Adventure unmarked", {
          description: `You've unmarked "${adventure.title}" as completed.`,
        });
      }
    } catch (error) {
      console.error("Error marking adventure as completed:", error);
      setIsCompleted(!isCompleted); // Revert on error
      toast.error("Failed to update completion status");
    } finally {
      setIsMarkingCompleted(false);
    }
  };

  return (
    <div className="glass-panel rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-lg animate-fade-in">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={adventure.imageUrl} 
          alt={adventure.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <Button 
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 ${isSaved ? 'bg-primary/90 text-white' : 'bg-white/80 text-foreground'} hover:${isSaved ? 'bg-primary' : 'bg-white/90'} rounded-full`}
          onClick={handleSave}
          disabled={isSaving}
        >
          <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
        </Button>

        <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gradient-to-t from-black/70 to-transparent text-white">
          <p className="text-sm font-semibold uppercase tracking-wide">{adventure.type}</p>
        </div>
      </div>

      <div className="p-5 space-y-3">
        <h3 className="font-display text-xl font-semibold line-clamp-1">{adventure.title}</h3>
        
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>{adventure.duration} {adventure.duration === 1 ? 'day' : 'days'}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <span className="mr-1 font-semibold">₹</span>
            <span>{adventure.cost}</span>
          </div>
          {adventure.location && (
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="truncate max-w-[100px]">{adventure.location.name}</span>
            </div>
          )}
        </div>
        
        <p className="text-foreground/70 text-sm line-clamp-2">{adventure.description}</p>
        
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(adventure.rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-1">({adventure.rating.toFixed(1)})</span>
          </div>
          
          <div className="flex space-x-2">
            {onMarkCompleted && (
              <Button 
                variant="outline"
                size="sm"
                className={`border-primary/20 ${isCompleted ? 'bg-primary/10' : ''} hover:bg-primary/5`}
                onClick={handleMarkCompleted}
                disabled={isMarkingCompleted}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-primary" />
                    Completed
                  </>
                ) : 'Mark Completed'}
              </Button>
            )}
            <Button 
              variant="default"
              size="sm"
              className="bg-primary/90 hover:bg-primary text-white rounded-full px-4"
              onClick={() => {
                // Open map or details in a future implementation
                toast("Adventure details", {
                  description: "View details for " + adventure.title,
                });
              }}
            >
              Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdventureCard;
