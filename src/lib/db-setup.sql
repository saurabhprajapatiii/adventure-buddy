
-- Create adventures table
CREATE TABLE IF NOT EXISTS adventures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  imageUrl TEXT NOT NULL,
  duration INTEGER NOT NULL,
  cost INTEGER NOT NULL,
  type TEXT NOT NULL,
  rating NUMERIC(3,1) NOT NULL,
  location_name TEXT,
  lat NUMERIC,
  lng NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_adventures join table for saves and completed adventures
CREATE TABLE IF NOT EXISTS user_adventures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  adventure_id UUID REFERENCES adventures(id) NOT NULL,
  is_saved BOOLEAN DEFAULT FALSE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, adventure_id)
);

-- Sample data insertion
INSERT INTO adventures (title, description, imageUrl, duration, cost, type, rating, location_name, lat, lng)
VALUES
  ('Coastal Hiking Trail', 'Explore beautiful ocean views on this coastal trail with stunning cliffs and beaches.', 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 3, 5000, 'Outdoors', 4.7, 'Pacific Coast Trail', 37.7749, -122.4194),
  ('Local Craft Brewery Tour', 'Sample unique craft beers at three local breweries with expert guides explaining the brewing process.', 'https://images.unsplash.com/photo-1559526324-593bc073d938?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 1, 2500, 'Food & Drink', 4.5, 'Downtown Brewery District', 37.7833, -122.4167),
  ('Modern Art Museum', 'Discover contemporary artworks from local and international artists in this modern gallery space.', 'https://images.unsplash.com/photo-1618331833071-ce81bd50d300?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 1, 1200, 'Cultural', 4.3, 'City Art Gallery', 37.7855, -122.4001),
  ('Mountain Biking Trail', 'Hit the trails with moderate difficulty routes through forest and mountain terrain.', 'https://images.unsplash.com/photo-1576858574144-9ae1ebcf5ae5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 2, 3500, 'Outdoors', 4.6, 'Mountain Ridge Park', 37.8014, -122.4016),
  ('Local Food Walking Tour', 'Experience the best local cuisine with this guided tour of authentic eateries and hidden gems.', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 1, 4000, 'Food & Drink', 4.8, 'Historic Food District', 37.7585, -122.4175),
  ('Sunset Kayaking Adventure', 'Paddle through calm waters while enjoying breathtaking sunset views and potentially spotting wildlife.', 'https://images.unsplash.com/photo-1602088769897-ec042f5a2901?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 1, 2000, 'Outdoors', 4.9, 'Bay Kayak Launch', 37.8083, -122.4156),
  ('Historic Downtown Walking Tour', 'Learn about the city''s rich history with this guided walking tour through historic neighborhoods.', 'https://images.unsplash.com/photo-1569880153113-76e33fc52d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 1, 1500, 'Cultural', 4.4, 'Old Town Square', 37.7991, -122.3994),
  ('Golden Triangle Tour', 'Explore the famous tourist circuit of Delhi, Agra and Jaipur with guided tours of iconic landmarks.', 'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 7, 45000, 'Cultural', 4.8, 'Delhi-Agra-Jaipur', 28.6139, 77.2090),
  ('Kerala Backwaters Houseboat Stay', 'Experience the tranquil backwaters of Kerala on a traditional houseboat with authentic cuisine.', 'https://images.unsplash.com/photo-1602301363653-23b9a8b3f304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 3, 18000, 'Entertainment', 4.9, 'Alleppey Backwaters', 9.4981, 76.3388),
  ('Himalayan Trek', 'Adventure through breathtaking trails in the Himalayas with experienced guides and porters.', 'https://images.unsplash.com/photo-1593064607153-068ca3843dc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 5, 25000, 'Outdoors', 4.7, 'Kedarkantha', 31.0243, 78.2262);
