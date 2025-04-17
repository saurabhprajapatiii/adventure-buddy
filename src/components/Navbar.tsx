
import React, { useState, useEffect } from 'react';
import { Menu, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, loading, signOut, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-panel py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <span className="text-2xl font-display font-bold text-gradient">Adventure Buddy</span>
            </a>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="/#features" 
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              Features
            </a>
            <a 
              href="/#adventures" 
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              Adventures
            </a>
            <a 
              href="/#about" 
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              About
            </a>
            
            {loading ? (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    {user.email?.split('@')[0]}
                    {isAdmin && <Shield className="h-4 w-4 text-primary" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => handleNavigation('/dashboard')}>
                    Dashboard
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => handleNavigation('/admin')}>
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost"
                  onClick={() => handleNavigation('/signin')}
                >
                  Sign In
                </Button>
                
                <Button 
                  className="bg-primary text-white hover:bg-primary/90"
                  onClick={() => handleNavigation('/signup')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </nav>

          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <a 
                href="/#features" 
                className="text-foreground/80 hover:text-primary transition-colors font-medium py-2"
              >
                Features
              </a>
              <a 
                href="/#adventures" 
                className="text-foreground/80 hover:text-primary transition-colors font-medium py-2"
              >
                Adventures
              </a>
              <a 
                href="/#about" 
                className="text-foreground/80 hover:text-primary transition-colors font-medium py-2"
              >
                About
              </a>
              
              {loading ? (
                <div className="py-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : user ? (
                <>
                  <Button 
                    variant="ghost" 
                    className="justify-start"
                    onClick={() => handleNavigation('/dashboard')}
                  >
                    Dashboard
                  </Button>
                  {isAdmin && (
                    <Button 
                      variant="ghost" 
                      className="justify-start"
                      onClick={() => handleNavigation('/admin')}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Panel
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    className="justify-start text-destructive"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    className="justify-start"
                    onClick={() => handleNavigation('/signin')}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="bg-primary text-white hover:bg-primary/90 w-full"
                    onClick={() => handleNavigation('/signup')}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
