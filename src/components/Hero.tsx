
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-4 relative">
        {/* Background elements */}
        <div className="absolute top-0 right-0 -z-10 opacity-20 w-96 h-96 bg-adventure-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -z-10 opacity-20 w-96 h-96 bg-adventure-300 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6 animate-fade-in">
            Discover your next <span className="text-gradient">adventure</span>
          </h1>
          
          <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '100ms' }}>
            Find personalized adventures tailored to your time and budget. 
            From spontaneous day trips to epic road journeys, let us inspire your next experience.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-8 h-12 rounded-full"
            >
              Generate Adventure
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary/20 text-primary hover:bg-primary/5 h-12 rounded-full"
            >
              Learn More
            </Button>
          </div>
        </div>
        
        {/* Features section below hero */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="glass-panel p-6 rounded-xl">
            <div className="w-12 h-12 bg-adventure-100 text-adventure-600 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Time-Based Options</h3>
            <p className="text-foreground/70">
              Find the perfect adventure whether you have an hour, a day, or a week to spare.
            </p>
          </div>
          
          <div className="glass-panel p-6 rounded-xl">
            <div className="w-12 h-12 bg-adventure-100 text-adventure-600 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Budget Friendly</h3>
            <p className="text-foreground/70">
              Discover experiences that fit your budget, from free activities to premium adventures.
            </p>
          </div>
          
          <div className="glass-panel p-6 rounded-xl">
            <div className="w-12 h-12 bg-adventure-100 text-adventure-600 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Personalized Picks</h3>
            <p className="text-foreground/70">
              Get recommendations tailored to your preferences and previous adventures.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
