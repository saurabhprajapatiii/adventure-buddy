
import React, { useState, useEffect } from 'react';
import FilterPanel, { FilterValues } from './FilterPanel';
import AdventureCard, { Adventure } from './AdventureCard';
import { Button } from '@/components/ui/button';
import { Compass, Download, Filter } from 'lucide-react';
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase, adventureService } from '@/lib/supabase';

// Extended Adventure type that includes user-specific properties
interface AdventureWithUserData extends Adventure {
  savedByUser?: boolean;
  completedByUser?: boolean;
  relevanceScore?: number;
  location_name: string; // Added the missing property
}

// Mock data for fallback when Supabase connection fails
const mockAdventures: AdventureWithUserData[] = [
  {
    id: "mock-1",
    title: "Himalayan Trek Adventure",
    description: "Experience the breathtaking beauty of the Himalayan mountains on this guided trek through scenic valleys and mountain passes.",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    duration: 3,
    cost: 15000,
    type: "outdoors",
    rating: 4.8,
    location_name: "Himachal Pradesh",
    savedByUser: false,
    completedByUser: false
  },
  {
    id: "mock-2",
    title: "Goa Beach Relaxation",
    description: "Unwind on the pristine beaches of Goa with this perfect weekend getaway. Includes seaside accommodation and sunset cruise.",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    duration: 2,
    cost: 8000,
    type: "outdoors",
    rating: 4.5,
    location_name: "Goa",
    savedByUser: false,
    completedByUser: false
  },
  {
    id: "mock-3",
    title: "Delhi Food Tour",
    description: "Taste your way through Delhi's vibrant culinary scene with our expert food guides. Visit hidden gems and famous eateries.",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    duration: 1,
    cost: 2500,
    type: "food",
    rating: 4.7,
    location_name: "Delhi",
    savedByUser: false,
    completedByUser: false
  }
];

const AdventureGenerator: React.FC = () => {
  const [filters, setFilters] = useState<FilterValues>({
    timeRange: [2],
    budget: [10000],
    type: 'all',
    searchQuery: '',
    sortBy: 'rating',
    sortDirection: 'desc'
  });
  
  const [adventures, setAdventures] = useState<AdventureWithUserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedAdventures, setSavedAdventures] = useState<string[]>([]);
  const [completedAdventures, setCompletedAdventures] = useState<string[]>([]);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  // Subscribe to real-time adventure updates
  useEffect(() => {
    const subscription = adventureService.subscribeToAdventures((newAdventure) => {
      console.log('New adventure received:', newAdventure);
      setAdventures(currentAdventures => {
        // Check if adventure already exists
        const exists = currentAdventures.some(adv => adv.id === newAdventure.id);
        if (exists) return currentAdventures;
        
        // Add the new adventure to the list, respecting the current sorting
        const updatedAdventures = [...currentAdventures, {
          ...newAdventure,
          savedByUser: false,
          completedByUser: false
        }];
        
        // Re-sort the adventures based on current filters
        return sortAdventures(updatedAdventures, filters);
      });
      
      toast.success("New adventure added!", {
        description: `"${newAdventure.title}" is now available to explore.`,
      });
    });
    
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [filters]);

  // Helper function to sort adventures
  const sortAdventures = (adventuresToSort: AdventureWithUserData[], currentFilters: FilterValues) => {
    return [...adventuresToSort].sort((a, b) => {
      // If we have a search query and relevance scores, consider them first
      if (currentFilters.searchQuery && a.relevanceScore !== undefined && b.relevanceScore !== undefined) {
        if (a.relevanceScore !== b.relevanceScore) {
          return b.relevanceScore - a.relevanceScore; // Higher relevance first
        }
      }
      
      const sortValue = (adventure: Adventure) => {
        if (currentFilters.sortBy === 'rating') return adventure.rating;
        if (currentFilters.sortBy === 'cost') return adventure.cost;
        if (currentFilters.sortBy === 'duration') return adventure.duration;
        return 0;
      };
      
      const aValue = sortValue(a);
      const bValue = sortValue(b);
      
      return currentFilters.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
  };

  // Filter and fetch adventures based on user criteria
  const fetchAdventures = async (currentFilters: FilterValues) => {
    setLoading(true);
    
    try {
      const fetchedAdventures = await adventureService.getAdventures(currentFilters);
      
      // Mark saved and completed adventures
      const enhancedAdventures = fetchedAdventures.map(adventure => ({
        ...adventure,
        savedByUser: savedAdventures.includes(adventure.id),
        completedByUser: completedAdventures.includes(adventure.id)
      }));
      
      setAdventures(sortAdventures(enhancedAdventures, currentFilters));
      setIsUsingMockData(false);
    } catch (error) {
      console.error('Error fetching adventures:', error);
      
      // Use mock data when Supabase connection fails
      const filteredMockAdventures = mockAdventures.filter(adventure => {
        // Apply time filter
        if (adventure.duration > currentFilters.timeRange[0]) return false;
        
        // Apply budget filter
        if (adventure.cost > currentFilters.budget[0]) return false;
        
        // Apply type filter
        if (currentFilters.type !== 'all' && adventure.type !== currentFilters.type) return false;
        
        // Apply search query filter
        if (currentFilters.searchQuery) {
          const query = currentFilters.searchQuery.toLowerCase();
          const matchesTitle = adventure.title.toLowerCase().includes(query);
          const matchesDescription = adventure.description.toLowerCase().includes(query);
          const matchesLocation = adventure.location_name.toLowerCase().includes(query);
          if (!matchesTitle && !matchesDescription && !matchesLocation) return false;
        }
        
        return true;
      });
      
      // Apply sorting to mock data
      const sortedMockAdventures = sortAdventures(filteredMockAdventures, currentFilters);
      
      setAdventures(sortedMockAdventures);
      setIsUsingMockData(true);
      toast.info("Using offline mode", {
        description: "Couldn't connect to database. Showing sample adventures instead.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    fetchAdventures(newFilters);
  };

  const generateNewAdventures = () => {
    fetchAdventures(filters);
  };

  const handleSaveAdventure = (adventure: Adventure) => {
    if (savedAdventures.includes(adventure.id)) {
      // Remove from saved
      setSavedAdventures(prev => prev.filter(id => id !== adventure.id));
    } else {
      // Add to saved
      setSavedAdventures(prev => [...prev, adventure.id]);
    }
  };

  const handleMarkCompleted = (adventure: Adventure) => {
    if (completedAdventures.includes(adventure.id)) {
      // Remove from completed
      setCompletedAdventures(prev => prev.filter(id => id !== adventure.id));
    } else {
      // Add to completed
      setCompletedAdventures(prev => [...prev, adventure.id]);
      toast("Adventure Completed!", {
        description: `You've marked "${adventure.title}" as completed.`,
      });
    }
  };

  const exportHistory = () => {
    // Prepare CSV data
    const completed = adventures.filter(adv => completedAdventures.includes(adv.id));
    
    if (completed.length === 0) {
      toast("No completed adventures", {
        description: "Complete some adventures to export your history.",
      });
      return;
    }

    const csvHeader = "Title,Type,Duration (Days),Cost (₹),Rating\n";
    const csvRows = completed.map(adv => 
      `"${adv.title}","${adv.type}",${adv.duration},${adv.cost},${adv.rating}`
    ).join('\n');
    const csvContent = csvHeader + csvRows;
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'adventure-history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast("History Exported", {
      description: "Your adventure history has been downloaded as a CSV file.",
    });
  };

  // Initial adventure generation
  useEffect(() => {
    fetchAdventures(filters);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-adventure-50/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Find Your Perfect Adventure
          </h2>
          <p className="text-lg text-foreground/70 mb-8">
            Customize your search to discover adventures that match your available time and budget
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button 
              variant="outline" 
              onClick={exportHistory}
              className="border-primary/20 text-primary hover:bg-primary/5"
            >
              <Download className="mr-2 h-4 w-4" />
              Export History
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="outline"
                  className="md:hidden border-primary/20 text-primary hover:bg-primary/5"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="py-4">
                  <FilterPanel onFilterChange={handleFilterChange} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1 hidden md:block">
            <FilterPanel onFilterChange={handleFilterChange} />
            
            <div className="mt-6 glass-panel rounded-xl p-6 text-center animate-fade-in" style={{ animationDelay: '100ms' }}>
              <Button 
                onClick={generateNewAdventures}
                className="w-full bg-primary hover:bg-primary/90 text-white h-12 rounded-full"
                disabled={loading}
              >
                <Compass className="mr-2 h-5 w-5" />
                {loading ? 'Finding Adventures...' : 'Generate Adventures'}
              </Button>
              <p className="mt-3 text-sm text-muted-foreground">
                Discover new experiences based on your preferences
              </p>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            {loading ? (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="mt-4 text-foreground/70">Finding your next adventure...</p>
                </div>
              </div>
            ) : adventures.length > 0 ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">
                    {adventures.length} Adventures Found
                    {isUsingMockData && <span className="ml-2 text-sm text-muted-foreground">(Sample Data)</span>}
                  </h3>
                  <Button 
                    onClick={generateNewAdventures}
                    className="md:hidden bg-primary hover:bg-primary/90 text-white rounded-full"
                  >
                    <Compass className="mr-2 h-5 w-5" />
                    Refresh
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {adventures.map((adventure, index) => (
                    <div key={adventure.id} style={{ animationDelay: `${index * 100}ms` }}>
                      <AdventureCard 
                        adventure={adventure} 
                        onSave={handleSaveAdventure}
                        onMarkCompleted={handleMarkCompleted}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center glass-panel rounded-xl">
                <div className="text-center p-8">
                  <svg 
                    className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                  <h3 className="text-xl font-semibold mb-2">No adventures found</h3>
                  <p className="text-foreground/70 mb-4">
                    Try adjusting your filters to find more exciting opportunities
                  </p>
                  <Button 
                    onClick={() => handleFilterChange({
                      timeRange: [24],
                      budget: [50000],
                      type: 'all',
                      searchQuery: '',
                      sortBy: 'rating',
                      sortDirection: 'desc'
                    })}
                    variant="outline"
                    className="border-primary/20 text-primary hover:bg-primary/5"
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdventureGenerator;
