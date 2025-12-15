import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { z } from 'zod';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().optional(),
});

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') === 'signup' ? 'signup' : 'signin';
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', fullName: '' });

  // Redirect if already logged in
  if (user) {
    navigate('/', { replace: true });
    return null;
  }

  const handleSubmit = async (type: 'signin' | 'signup') => {
    try {
      const validation = authSchema.safeParse(formData);
      if (!validation.success) {
        toast({ title: 'Validation Error', description: validation.error.errors[0].message, variant: 'destructive' });
        return;
      }

      setLoading(true);
      const { error } = type === 'signin'
        ? await signIn(formData.email, formData.password)
        : await signUp(formData.email, formData.password, formData.fullName);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: type === 'signin' ? 'Welcome back!' : 'Account created!', description: 'You are now signed in.' });
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-md py-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to PWA Store</h1>
          <p className="text-muted-foreground">Sign in to save favorites and submit apps</p>
        </div>

        <div className="p-6 rounded-xl bg-card border border-border/50">
          <Tabs defaultValue={defaultTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="you@example.com" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" />
              </div>
              <Button className="w-full gradient-primary" onClick={() => handleSubmit('signin')} disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="John Doe" />
              </div>
              <div>
                <Label htmlFor="signupEmail">Email</Label>
                <Input id="signupEmail" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="you@example.com" />
              </div>
              <div>
                <Label htmlFor="signupPassword">Password</Label>
                <Input id="signupPassword" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" />
              </div>
              <Button className="w-full gradient-primary" onClick={() => handleSubmit('signup')} disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}