import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, Clock, Zap, Shield, Wifi } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { AppCard } from '@/components/apps/AppCard';
import { CategoryCard } from '@/components/apps/CategoryCard';
import { InstantSearch } from '@/components/search/InstantSearch';
import { HorizontalScroll } from '@/components/ui/horizontal-scroll';
import { AppCardSkeleton } from '@/components/common/AppCardSkeleton';
import { useCategories, useFeaturedApps, useTrendingApps, useNewApps } from '@/hooks/useApps';

export default function Index() {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: featuredApps, isLoading: featuredLoading } = useFeaturedApps();
  const { data: trendingApps, isLoading: trendingLoading } = useTrendingApps();
  const { data: newApps, isLoading: newLoading } = useNewApps();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-28">
        {/* Background Effects */}
        <div className="absolute inset-0 gradient-glow opacity-50" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Discover Amazing{' '}
              <span className="text-gradient">PWA Apps</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Install progressive web apps directly to your device. No app store required.
              Fast, free, and always up to date.
            </p>
            
            {/* Instant Search */}
            <div className="max-w-xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <InstantSearch size="large" placeholder="Search for apps..." />
            </div>

            {/* Quick Category Pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              {categories?.slice(0, 5).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-secondary transition-all"
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                to="/categories"
                className="px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-sm text-primary hover:bg-primary/20 transition-all"
              >
                All Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PWA Benefits Bar */}
      <section className="py-8 border-t border-b border-border/40 bg-card/50">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="font-medium text-foreground">Lightning Fast</p>
                <p className="text-sm">Instant loading</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center">
                <Wifi className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="font-medium text-foreground">Works Offline</p>
                <p className="text-sm">No internet needed</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="font-medium text-foreground">Always Secure</p>
                <p className="text-sm">HTTPS protected</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Apps - Horizontal Scroll */}
      {(featuredLoading || (featuredApps && featuredApps.length > 0)) && (
        <section className="py-12 border-b border-border/40">
          <div className="container">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold">Featured Apps</h2>
              </div>
              <Button variant="ghost" asChild className="group">
                <Link to="/browse?filter=featured">
                  View All 
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            
            <HorizontalScroll>
              {featuredLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-[280px] md:w-[320px] snap-start">
                      <AppCardSkeleton />
                    </div>
                  ))
                : featuredApps?.map((app, i) => (
                    <div 
                      key={app.id} 
                      className={`flex-shrink-0 w-[280px] md:w-[320px] snap-start opacity-0 animate-scale-in stagger-${Math.min(i + 1, 8)}`}
                    >
                      <AppCard app={app} />
                    </div>
                  ))}
            </HorizontalScroll>
          </div>
        </section>
      )}

      {/* Categories Grid */}
      <section className="py-12 border-b border-border/40">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Browse Categories</h2>
            <Button variant="ghost" asChild className="group">
              <Link to="/categories">
                All Categories 
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categoriesLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-32 rounded-xl bg-card border border-border/50 animate-pulse" />
                ))
              : categories?.slice(0, 8).map((category, i) => (
                  <div 
                    key={category.id} 
                    className={`opacity-0 animate-scale-in stagger-${Math.min(i + 1, 8)}`}
                  >
                    <CategoryCard category={category} />
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Trending Apps - Horizontal Scroll */}
      {(trendingLoading || (trendingApps && trendingApps.length > 0)) && (
        <section className="py-12 border-b border-border/40">
          <div className="container">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-warning" />
                </div>
                <h2 className="text-2xl font-bold">Trending Now</h2>
              </div>
              <Button variant="ghost" asChild className="group">
                <Link to="/browse?sort=trending">
                  View All 
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            
            <HorizontalScroll>
              {trendingLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-[280px] md:w-[320px] snap-start">
                      <AppCardSkeleton />
                    </div>
                  ))
                : trendingApps?.map((app, i) => (
                    <div 
                      key={app.id} 
                      className={`flex-shrink-0 w-[280px] md:w-[320px] snap-start opacity-0 animate-scale-in stagger-${Math.min(i + 1, 8)}`}
                    >
                      <AppCard app={app} />
                    </div>
                  ))}
            </HorizontalScroll>
          </div>
        </section>
      )}

      {/* New Apps - Horizontal Scroll */}
      {(newLoading || (newApps && newApps.length > 0)) && (
        <section className="py-12 border-b border-border/40">
          <div className="container">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-info" />
                </div>
                <h2 className="text-2xl font-bold">New Arrivals</h2>
              </div>
              <Button variant="ghost" asChild className="group">
                <Link to="/browse?sort=new">
                  View All 
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            
            <HorizontalScroll>
              {newLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-[280px] md:w-[320px] snap-start">
                      <AppCardSkeleton />
                    </div>
                  ))
                : newApps?.map((app, i) => (
                    <div 
                      key={app.id} 
                      className={`flex-shrink-0 w-[280px] md:w-[320px] snap-start opacity-0 animate-scale-in stagger-${Math.min(i + 1, 8)}`}
                    >
                      <AppCard app={app} />
                    </div>
                  ))}
            </HorizontalScroll>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Are you a developer?</h2>
            <p className="text-muted-foreground mb-8">
              Share your PWA with thousands of users. Submit your app and reach a wider audience — completely free.
            </p>
            <Button size="lg" asChild className="gradient-primary shadow-glow hover-lift">
              <Link to="/become-developer">Become a Developer</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
