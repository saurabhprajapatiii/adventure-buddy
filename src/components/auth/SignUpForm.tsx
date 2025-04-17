
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const SignUpForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    try {
      await signUp(email, password, name);
      if (!error) {
        toast.success('Account created!', { 
          description: 'Please check your email to confirm your account.'
        });
        navigate('/signin');
      }
    } catch (err) {
      console.error('Sign up error:', err);
      // Error is handled in the AuthContext
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={toggleShowPassword}
            tabIndex={-1}
          >
            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Password must be at least 6 characters long
        </p>
      </div>
      
      {error && (
        <div className="px-3 py-2 rounded-md bg-destructive/15 text-destructive text-sm">
          {error instanceof Error ? error.message : String(error)}
        </div>
      )}
      
      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90"
        disabled={loading}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>
      
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <a 
          href="/signin" 
          className="text-primary hover:underline"
          onClick={(e) => {
            e.preventDefault();
            navigate('/signin');
          }}
        >
          Sign in
        </a>
      </div>
    </form>
  );
};

export default SignUpForm;
