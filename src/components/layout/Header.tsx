import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Heart, History, Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InstantSearch } from '@/components/search/InstantSearch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const navigate = useNavigate();
  const { user, profile, developer, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="/icon-192.png" alt="PWA Store" className="h-8 w-8 rounded-lg" />
          <span className="font-bold text-xl hidden sm:block">PWA Store</span>
        </Link>

        {/* Search - Desktop */}
        <div className="hidden md:block flex-1 max-w-md">
          <InstantSearch />
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/browse" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Browse
          </Link>
          <Link to="/categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Categories
          </Link>
          {developer && (
            <Link to="/developer/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
          )}
        </nav>

        {/* Auth / User Menu */}
        <div className="flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || 'User'} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {profile?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{profile?.full_name || 'User'}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/favorites" className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    Favorites
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/history" className="cursor-pointer">
                    <History className="mr-2 h-4 w-4" />
                    My Apps
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {developer ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/developer/dashboard" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Developer Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/developer/submit" className="cursor-pointer">
                        <Plus className="mr-2 h-4 w-4" />
                        Submit App
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link to="/become-developer" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Become a Developer
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="gradient-primary shadow-glow">
                <Link to="/auth?tab=signup">Get Started</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background p-4 space-y-4 animate-slide-up">
          <InstantSearch />
          <nav className="flex flex-col gap-2">
            <Link
              to="/browse"
              className="px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse
            </Link>
            <Link
              to="/categories"
              className="px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Categories
            </Link>
            {developer && (
              <Link
                to="/developer/dashboard"
                className="px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}