import { Link } from 'react-router-dom';
import { Search, ArrowRight, Sparkles, TrendingUp, Clock } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppGrid } from '@/components/apps/AppGrid';
import { CategoryCard } from '@/components/apps/CategoryCard';
import { useCategories, useFeaturedApps, useTrendingApps, useNewApps } from '@/hooks/useApps';

export default function Index() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: featuredApps, isLoading: featuredLoading } = useFeaturedApps();
  const { data: trendingApps, isLoading: trendingLoading } = useTrendingApps();
  const { data: newApps, isLoading: newLoading } = useNewApps();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 gradient-glow opacity-50" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Discover Amazing{' '}
              <span className="text-gradient">PWA Apps</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in">
              Install progressive web apps directly to your device. No app store required.
              Fast, free, and always up to date.
            </p>
            <form onSubmit={handleSearch} className="max-w-xl mx-auto animate-slide-up">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for apps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 h-14 text-lg bg-card border-border/50 focus:border-primary rounded-xl"
                />
                <Button type="submit" size="lg" className="absolute right-2 top-1/2 -translate-y-1/2 gradient-primary shadow-glow">
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Apps */}
      {featuredApps && featuredApps.length > 0 && (
        <section className="py-12 border-t border-border/40">
          <div className="container">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Featured Apps</h2>
              </div>
              <Button variant="ghost" asChild>
                <Link to="/browse?filter=featured">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <AppGrid apps={featuredApps} loading={featuredLoading} columns={3} />
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-12 border-t border-border/40">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Browse Categories</h2>
            <Button variant="ghost" asChild>
              <Link to="/categories">
                All Categories <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categoriesLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-32 rounded-xl bg-card border border-border/50 animate-pulse" />
                ))
              : categories?.slice(0, 8).map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
          </div>
        </div>
      </section>

      {/* Trending Apps */}
      <section className="py-12 border-t border-border/40">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Trending Now</h2>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/browse?sort=trending">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <AppGrid apps={trendingApps || []} loading={trendingLoading} columns={4} />
        </div>
      </section>

      {/* New Apps */}
      <section className="py-12 border-t border-border/40">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">New Arrivals</h2>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/browse?sort=new">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <AppGrid apps={newApps || []} loading={newLoading} columns={4} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border/40">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Are you a developer?</h2>
            <p className="text-muted-foreground mb-6">
              Share your PWA with thousands of users. Submit your app and reach a wider audience.
            </p>
            <Button size="lg" asChild className="gradient-primary shadow-glow">
              <Link to="/become-developer">Become a Developer</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}