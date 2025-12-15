import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { useCategories } from '@/hooks/useApps';
import { useCreateApp, useUpdateApp, useDeveloperApps } from '@/hooks/useDeveloper';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function SubmitAppContent() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: categories } = useCategories();
  const { data: apps } = useDeveloperApps();
  const { mutate: createApp, isPending: creating } = useCreateApp();
  const { mutate: updateApp, isPending: updating } = useUpdateApp();
  const { toast } = useToast();

  const existingApp = apps?.find(a => a.id === id);
  const isEdit = !!id && !!existingApp;

  const [formData, setFormData] = useState({
    name: existingApp?.name || '',
    tagline: existingApp?.tagline || '',
    description: existingApp?.description || '',
    icon_url: existingApp?.icon_url || '',
    manifest_url: existingApp?.manifest_url || '',
    website_url: existingApp?.website_url || '',
    privacy_policy_url: existingApp?.privacy_policy_url || '',
    support_url: existingApp?.support_url || '',
    category_id: existingApp?.category_id || '',
    tags: existingApp?.tags?.join(', ') || '',
    pwa_offline: existingApp?.pwa_offline || false,
    pwa_push_notifications: existingApp?.pwa_push_notifications || false,
    pwa_installable: existingApp?.pwa_installable || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({ title: 'Name is required', variant: 'destructive' });
      return;
    }

    const appData = {
      name: formData.name,
      slug: slugify(formData.name),
      tagline: formData.tagline || undefined,
      description: formData.description || undefined,
      icon_url: formData.icon_url || undefined,
      manifest_url: formData.manifest_url || undefined,
      website_url: formData.website_url || undefined,
      privacy_policy_url: formData.privacy_policy_url || undefined,
      support_url: formData.support_url || undefined,
      category_id: formData.category_id || undefined,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean).slice(0, 5) : [],
      pwa_offline: formData.pwa_offline,
      pwa_push_notifications: formData.pwa_push_notifications,
      pwa_installable: formData.pwa_installable,
    };

    if (isEdit) {
      updateApp(
        { id, ...appData },
        {
          onSuccess: () => {
            toast({ title: 'App updated!' });
            navigate('/developer/dashboard');
          },
          onError: (err) => {
            toast({ title: 'Error', description: err.message, variant: 'destructive' });
          },
        }
      );
    } else {
      createApp(appData, {
        onSuccess: () => {
          toast({ title: 'App submitted!', description: 'Your app is now live.' });
          navigate('/developer/dashboard');
        },
        onError: (err) => {
          toast({ title: 'Error', description: err.message, variant: 'destructive' });
        },
      });
    }
  };

  return (
    <Layout>
      <div className="container py-8 max-w-2xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/developer/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
        </Button>

        <h1 className="text-3xl font-bold mb-2">{isEdit ? 'Edit App' : 'Submit New App'}</h1>
        <p className="text-muted-foreground mb-8">
          {isEdit ? 'Update your app details' : 'Fill in the details to publish your PWA'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-6 rounded-xl bg-card border border-border/50 space-y-4">
            <h2 className="font-semibold">Basic Information</h2>

            <div>
              <Label htmlFor="name">App Name *</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="My Awesome PWA" required />
            </div>

            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" value={formData.tagline} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} placeholder="A short description of your app" maxLength={100} />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe your app in detail..." rows={5} />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category_id} onValueChange={(v) => setFormData({ ...formData, category_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {categories?.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma separated, max 5)</Label>
              <Input id="tags" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="productivity, tools, offline" />
            </div>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border/50 space-y-4">
            <h2 className="font-semibold">URLs & Assets</h2>

            <div>
              <Label htmlFor="icon_url">Icon URL</Label>
              <Input id="icon_url" type="url" value={formData.icon_url} onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })} placeholder="https://..." />
            </div>

            <div>
              <Label htmlFor="manifest_url">Manifest URL</Label>
              <Input id="manifest_url" type="url" value={formData.manifest_url} onChange={(e) => setFormData({ ...formData, manifest_url: e.target.value })} placeholder="https://yourapp.com/manifest.json" />
            </div>

            <div>
              <Label htmlFor="website_url">Website URL</Label>
              <Input id="website_url" type="url" value={formData.website_url} onChange={(e) => setFormData({ ...formData, website_url: e.target.value })} placeholder="https://yourapp.com" />
            </div>

            <div>
              <Label htmlFor="support_url">Support URL</Label>
              <Input id="support_url" type="url" value={formData.support_url} onChange={(e) => setFormData({ ...formData, support_url: e.target.value })} placeholder="https://yourapp.com/support" />
            </div>

            <div>
              <Label htmlFor="privacy_policy_url">Privacy Policy URL</Label>
              <Input id="privacy_policy_url" type="url" value={formData.privacy_policy_url} onChange={(e) => setFormData({ ...formData, privacy_policy_url: e.target.value })} placeholder="https://yourapp.com/privacy" />
            </div>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border/50 space-y-4">
            <h2 className="font-semibold">PWA Capabilities</h2>

            <div className="flex items-center justify-between">
              <div>
                <Label>Installable</Label>
                <p className="text-sm text-muted-foreground">Can be installed to device</p>
              </div>
              <Switch checked={formData.pwa_installable} onCheckedChange={(v) => setFormData({ ...formData, pwa_installable: v })} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Works Offline</Label>
                <p className="text-sm text-muted-foreground">Functions without internet</p>
              </div>
              <Switch checked={formData.pwa_offline} onCheckedChange={(v) => setFormData({ ...formData, pwa_offline: v })} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Supports push notifications</p>
              </div>
              <Switch checked={formData.pwa_push_notifications} onCheckedChange={(v) => setFormData({ ...formData, pwa_push_notifications: v })} />
            </div>
          </div>

          <Button type="submit" className="w-full gradient-primary shadow-glow" disabled={creating || updating}>
            {creating || updating ? 'Saving...' : isEdit ? 'Update App' : 'Submit App'}
          </Button>
        </form>
      </div>
    </Layout>
  );
}

export default function SubmitApp() {
  return (
    <ProtectedRoute requireDeveloper>
      <SubmitAppContent />
    </ProtectedRoute>
  );
}
