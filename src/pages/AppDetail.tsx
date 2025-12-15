import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Globe, Shield, HelpCircle, Heart } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ScreenshotGallery } from '@/components/apps/ScreenshotGallery';
import { PWABadges } from '@/components/apps/PWABadges';
import { RatingBreakdown } from '@/components/apps/RatingBreakdown';
import { ReviewCard } from '@/components/apps/ReviewCard';
import { ReviewForm } from '@/components/apps/ReviewForm';
import { InstallGuide } from '@/components/apps/InstallGuide';
import { ShareButtons } from '@/components/apps/ShareButtons';
import { DeveloperCard } from '@/components/developer/DeveloperCard';
import { useApp, useAppReviews, useToggleFavorite, useUserFavorites } from '@/hooks/useApps';
import { useRecordView } from '@/hooks/useDeveloper';
import { useAuth } from '@/hooks/useAuth';

export default function AppDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { data: app, isLoading } = useApp(slug);
  const { data: reviews } = useAppReviews(app?.id);
  const { data: favorites } = useUserFavorites();
  const { mutate: toggleFavorite } = useToggleFavorite();
  const { mutate: recordView } = useRecordView();

  const isFavorite = favorites?.some(f => f.app_id === app?.id);

  useEffect(() => {
    if (app?.id) {
      recordView({ appId: app.id, source: 'direct' });
    }
  }, [app?.id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </div>
            <Skeleton className="h-96 rounded-xl" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!app) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">App not found</h1>
          <Button asChild><Link to="/browse">Browse Apps</Link></Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/browse"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Browse</Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-secondary flex-shrink-0">
                {app.icon_url ? (
                  <img src={app.icon_url} alt={app.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full gradient-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-3xl">{app.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-1">{app.name}</h1>
                    <p className="text-muted-foreground mb-3">{app.tagline}</p>
                    {app.category && <Badge variant="secondary">{app.category.name}</Badge>}
                  </div>
                  {user && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleFavorite({ appId: app.id, isFavorite: !!isFavorite })}
                    >
                      <Heart className={isFavorite ? "fill-primary text-primary" : ""} />
                    </Button>
                  )}
                </div>
                <div className="mt-4">
                  <PWABadges
                    offline={app.pwa_offline}
                    pushNotifications={app.pwa_push_notifications}
                    installable={app.pwa_installable}
                  />
                </div>
              </div>
            </div>

            {/* Screenshots */}
            {app.screenshots && app.screenshots.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Screenshots</h2>
                <ScreenshotGallery screenshots={app.screenshots} />
              </section>
            )}

            {/* Description */}
            <section>
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap">{app.description || 'No description available.'}</p>
              </div>
            </section>

            {/* Tags */}
            {app.tags && app.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {app.tags.map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            )}

            <Separator />

            {/* Reviews */}
            <section>
              <h2 className="text-xl font-semibold mb-6">Ratings & Reviews</h2>
              {reviews && reviews.length > 0 && (
                <div className="mb-8">
                  <RatingBreakdown reviews={reviews} />
                </div>
              )}

              {user && (
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Write a Review</h3>
                  <ReviewForm appId={app.id} />
                </div>
              )}

              <div className="space-y-4">
                {reviews?.map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))}
                {(!reviews || reviews.length === 0) && (
                  <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-card border border-border/50 space-y-4">
              <InstallGuide appName={app.name} websiteUrl={app.website_url} />

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 rounded-lg bg-secondary">
                  <div className="text-2xl font-bold">{app.view_count.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Views</div>
                </div>
                <div className="p-3 rounded-lg bg-secondary">
                  <div className="text-2xl font-bold">{app.install_count.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Installs</div>
                </div>
              </div>

              <Separator />

              <ShareButtons title={app.name} url={window.location.href} />
            </div>

            {/* Links */}
            <div className="p-6 rounded-xl bg-card border border-border/50 space-y-3">
              <h3 className="font-semibold mb-4">Links</h3>
              {app.website_url && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={app.website_url} target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-4 w-4" /> Website
                  </a>
                </Button>
              )}
              {app.support_url && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={app.support_url} target="_blank" rel="noopener noreferrer">
                    <HelpCircle className="mr-2 h-4 w-4" /> Support
                  </a>
                </Button>
              )}
              {app.privacy_policy_url && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={app.privacy_policy_url} target="_blank" rel="noopener noreferrer">
                    <Shield className="mr-2 h-4 w-4" /> Privacy Policy
                  </a>
                </Button>
              )}
            </div>

            {/* Developer */}
            {app.developer && (
              <DeveloperCard developer={app.developer} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
