import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { AppGrid } from '@/components/apps/AppGrid';
import { AppCard } from '@/components/apps/AppCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useTrendingApps, useNewApps, useCategories } from '@/hooks/useApps';

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'trending');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [pwaFilters, setPwaFilters] = useState({ offline: false, push: false, installable: false });

  const { data: trendingApps, isLoading: trendingLoading } = useTrendingApps();
  const { data: newApps, isLoading: newLoading } = useNewApps();
  const { data: categories } = useCategories();

  const apps = sortBy === 'new' ? newApps : trendingApps;
  const loading = sortBy === 'new' ? newLoading : trendingLoading;

  const filteredApps = useMemo(() => {
    if (!apps) return [];
    return apps.filter(app => {
      if (categoryFilter !== 'all' && app.category_id !== categoryFilter) return false;
      if (pwaFilters.offline && !app.pwa_offline) return false;
      if (pwaFilters.push && !app.pwa_push_notifications) return false;
      if (pwaFilters.installable && !app.pwa_installable) return false;
      return true;
    });
  }, [apps, categoryFilter, pwaFilters]);

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium mb-2 block">Category</Label>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">PWA Features</Label>
        <div className="space-y-2">
          {[
            { key: 'installable', label: 'Installable' },
            { key: 'offline', label: 'Works Offline' },
            { key: 'push', label: 'Push Notifications' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2">
              <Checkbox
                id={key}
                checked={pwaFilters[key as keyof typeof pwaFilters]}
                onCheckedChange={(checked) => setPwaFilters(prev => ({ ...prev, [key]: !!checked }))}
              />
              <Label htmlFor={key} className="text-sm cursor-pointer">{label}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Browse Apps</h1>
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="new">Newest</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
              </SelectContent>
            </Select>

            <div className="hidden md:flex border border-border rounded-lg">
              <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                <div className="mt-6"><FilterPanel /></div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24 p-4 rounded-xl bg-card border border-border/50">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filters
              </h3>
              <FilterPanel />
            </div>
          </aside>

          <div className="flex-1">
            {viewMode === 'grid' ? (
              <AppGrid apps={filteredApps} loading={loading} columns={3} />
            ) : (
              <div className="space-y-3">
                {filteredApps.map(app => (
                  <AppCard key={app.id} app={app} variant="compact" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
