
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AdventureGenerator from '@/components/AdventureGenerator';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Compass, Mountain, Route, MapPin, Tent } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <AdventureGenerator />
        
        {/* Adventure Suggestions section */}
        <section className="py-16 bg-adventure-100/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Popular Adventure Suggestions
              </h2>
              <p className="text-lg text-foreground/70">
                Discover our most loved adventures curated by our community
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-panel p-6 rounded-xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center text-white mb-2">
                    <Mountain className="h-5 w-5 mr-2" />
                    <span className="font-semibold">Mountain Trekking</span>
                  </div>
                  <p className="text-white/90 text-sm">Experience breathtaking views on our guided mountain trails</p>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                  alt="Mountain Trek"
                  className="w-full h-64 object-cover rounded-lg transform group-hover:scale-105 transition-transform"
                />
              </div>
              
              <div className="glass-panel p-6 rounded-xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center text-white mb-2">
                    <Route className="h-5 w-5 mr-2" />
                    <span className="font-semibold">City Food Tour</span>
                  </div>
                  <p className="text-white/90 text-sm">Explore local cuisine with expert guides and hidden gems</p>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                  alt="Food Tour"
                  className="w-full h-64 object-cover rounded-lg transform group-hover:scale-105 transition-transform"
                />
              </div>
              
              <div className="glass-panel p-6 rounded-xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center text-white mb-2">
                    <Compass className="h-5 w-5 mr-2" />
                    <span className="font-semibold">Coastal Exploration</span>
                  </div>
                  <p className="text-white/90 text-sm">Discover hidden beaches and amazing sunset viewpoints</p>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                  alt="Coastal Exploration"
                  className="w-full h-64 object-cover rounded-lg transform group-hover:scale-105 transition-transform"
                />
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Link to="/dashboard">
                <Button 
                  className="bg-adventure-600 hover:bg-adventure-700 text-white px-8 h-12 rounded-full"
                >
                  View All Suggestions
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Testimonial section */}
        <section className="py-16 bg-adventure-50/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Adventure Stories
              </h2>
              <p className="text-lg text-foreground/70">
                Hear what our adventure buddies have to say about their experiences
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-panel p-8 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-adventure-200 overflow-hidden mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah J.</h4>
                    <p className="text-sm text-muted-foreground">Photography Enthusiast</p>
                  </div>
                </div>
                <p className="text-foreground/80 italic">
                  "The coastal hike suggestion was perfect for my schedule. I captured amazing sunset photos and even spotted dolphins! Would never have found this gem without Adventure Buddy."
                </p>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <div className="glass-panel p-8 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-adventure-200 overflow-hidden mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">Mr. Aditya.</h4>
                    <p className="text-sm text-muted-foreground">Food Lover</p>
                  </div>
                </div>
                <p className="text-foreground/80 italic">
                  "The food tour recommended by Adventure Buddy was incredible. In just 3 hours, I discovered 5 amazing local restaurants I'd never have found on my own. Great value!"
                </p>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < 5 ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <div className="glass-panel p-8 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-adventure-200 overflow-hidden mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">Emma R.</h4>
                    <p className="text-sm text-muted-foreground">Weekend Explorer</p>
                  </div>
                </div>
                <p className="text-foreground/80 italic">
                  "Used Adventure Buddy for a spontaneous day trip and it suggested kayaking at sunset. It was absolutely magical and fit perfectly within my budget. Will definitely use again!"
                </p>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-adventure-50/40 rounded-l-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-adventure-100/30 rounded-tr-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Ready for your next adventure?
              </h2>
              <p className="text-lg text-foreground/70 mb-8">
                Create your account now to save your favorite adventures, get personalized recommendations, and start tracking your journey.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/dashboard">
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white px-10 h-12 rounded-full"
                  >
                    Get Started
                  </Button>
                </Link>
                <Link to="/admin">
                  <Button 
                    variant="outline"
                    className="border-primary/20 text-primary hover:bg-primary/5 px-10 h-12 rounded-full"
                  >
                    Admin Panel
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-display font-bold text-lg mb-4">Adventure Buddy</h3>
              <p className="text-foreground/70 text-sm">
                Discover personalized adventures tailored to your available time and budget.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-foreground/70 hover:text-primary text-sm">Adventure Generator</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary text-sm">Time-Based Options</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary text-sm">Budget Planning</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary text-sm">Location Finder</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-foreground/70 hover:text-primary text-sm">Our Story</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary text-sm">Blog</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary text-sm">Team</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary text-sm">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-foreground/70 hover:text-primary text-sm">Help Center</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary text-sm">Contact Us</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary text-sm">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
            <p className="text-foreground/60 text-sm">
              Embark on unforgettable journeys with Adventure Buddy — where every moment becomes a cherished memory.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <a href="#" className="text-foreground/60 hover:text-primary">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a href="#" className="text-foreground/60 hover:text-primary">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                </svg>
              </a>
              <a href="#" className="text-foreground/60 hover:text-primary">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
