
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SignInForm from '@/components/auth/SignInForm';
import Navbar from '@/components/Navbar';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SignIn = () => {
  const { user, loading } = useAuth();

  // If user is already logged in, redirect to dashboard
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 mt-16">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-4"
            asChild
          >
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>
          <h1 className="text-3xl font-display font-bold">Sign In</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Sign in to your account</p>
        </div>
        
        <div className="glass-panel p-8 rounded-xl">
          <SignInForm />
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account yet?{' '}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignIn;
