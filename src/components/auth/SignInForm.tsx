
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, USING_MOCK_AUTH } from '@/contexts/AuthContext';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      await signIn(email, password);
      // Navigation is handled in the AuthContext
    } catch (err) {
      console.error('Sign in error:', err);
      // Error is handled in the AuthContext
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {USING_MOCK_AUTH && (
        <Alert>
          <AlertDescription>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Let,s GO Adventure Buddy</p>
             
            </div>
          </AlertDescription>
        </Alert>
      )}
      
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
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <a 
            href="#" 
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.preventDefault();
              toast.info('Reset functionality coming soon');
            }}
          >
            Forgot password?
          </a>
        </div>
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
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
      
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Don't have an account? </span>
        <a 
          href="/signup" 
          className="text-primary hover:underline"
          onClick={(e) => {
            e.preventDefault();
            navigate('/signup');
          }}
        >
          Sign up
        </a>
      </div>
    </form>
  );
};

export default SignInForm;
