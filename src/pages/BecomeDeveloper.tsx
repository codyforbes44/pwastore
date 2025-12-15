import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Rocket, BarChart2, Users } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const features = [
  { icon: Rocket, title: 'Publish Apps', description: 'Share your PWAs with thousands of users' },
  { icon: BarChart2, title: 'Analytics', description: 'Track views, installs, and user engagement' },
  { icon: Users, title: 'Reach Users', description: 'Connect with a growing community of PWA users' },
  { icon: Code2, title: 'Free Forever', description: 'No fees to publish or maintain your apps' },
];

function BecomeDeveloperContent() {
  const navigate = useNavigate();
  const { developer, becomeDeveloper } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    website: '',
    bio: '',
    support_email: '',
  });

  if (developer) {
    navigate('/developer/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await becomeDeveloper(formData);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Welcome, Developer!', description: 'Your developer account is ready.' });
      navigate('/developer/dashboard');
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Become a Developer</h1>
            <p className="text-lg text-muted-foreground">
              Join our community of developers and share your PWA apps with the world
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="p-6 rounded-xl bg-card border border-border/50 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg gradient-primary flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>

          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="p-6 rounded-xl bg-card border border-border/50 space-y-4">
              <h2 className="text-xl font-semibold mb-4">Developer Profile</h2>

              <div>
                <Label htmlFor="company_name">Company / Developer Name</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="Your company or developer name"
                />
              </div>

              <div>
                <Label htmlFor="website">Website (optional)</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://yoursite.com"
                />
              </div>

              <div>
                <Label htmlFor="support_email">Support Email</Label>
                <Input
                  id="support_email"
                  type="email"
                  value={formData.support_email}
                  onChange={(e) => setFormData({ ...formData, support_email: e.target.value })}
                  placeholder="support@yoursite.com"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio (optional)</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell users about yourself..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full gradient-primary" disabled={loading}>
                {loading ? 'Creating Account...' : 'Become a Developer'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function BecomeDeveloper() {
  return (
    <ProtectedRoute>
      <BecomeDeveloperContent />
    </ProtectedRoute>
  );
}
