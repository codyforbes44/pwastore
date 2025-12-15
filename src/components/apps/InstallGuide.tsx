import { Monitor, Smartphone, Chrome, Apple } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface InstallGuideProps {
  appName: string;
  websiteUrl?: string | null;
}

export function InstallGuide({ appName, websiteUrl }: InstallGuideProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="gradient-primary shadow-glow">
          Install App
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Install {appName}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="desktop" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="desktop" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" /> Desktop
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" /> Mobile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="desktop" className="space-y-4 mt-4">
            <div className="flex items-start gap-3">
              <Chrome className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Chrome / Edge</h4>
                <ol className="text-sm text-muted-foreground mt-1 space-y-1 list-decimal list-inside">
                  <li>Visit the app website</li>
                  <li>Click the install icon in the address bar</li>
                  <li>Click "Install" in the popup</li>
                </ol>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mobile" className="space-y-4 mt-4">
            <div className="flex items-start gap-3">
              <Chrome className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Android (Chrome)</h4>
                <ol className="text-sm text-muted-foreground mt-1 space-y-1 list-decimal list-inside">
                  <li>Open the app in Chrome</li>
                  <li>Tap the menu (⋮) button</li>
                  <li>Select "Add to Home screen"</li>
                </ol>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Apple className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">iOS (Safari)</h4>
                <ol className="text-sm text-muted-foreground mt-1 space-y-1 list-decimal list-inside">
                  <li>Open the app in Safari</li>
                  <li>Tap the Share button</li>
                  <li>Select "Add to Home Screen"</li>
                </ol>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {websiteUrl && (
          <Button asChild className="w-full mt-4" variant="outline">
            <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
              Open App Website
            </a>
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
