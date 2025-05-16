import { useState, useEffect } from 'react';
import { useCommandPalette } from '@/components/command-palette';
import { SkeletonDemo } from '@/components/ui/skeleton-demo';
import { useOptimisticUpdate } from '@/hooks/use-optimistic-update';
import { Search, Sun, Moon, Settings, User, LogOut, Plus, Check, X, Command as CommandIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

export default function PatternsDemo() {
  // Command palette state and commands
  const commands = [
    {
      heading: 'Navigation',
      items: [
        {
          id: 'home',
          title: 'Go to Home',
          icon: <Sun className="w-4 h-4" />,
          onSelect: () => console.log('Navigating to home...'),
        },
        {
          id: 'settings',
          title: 'Settings',
          icon: <Settings className="w-4 h-4" />,
          onSelect: () => console.log('Opening settings...'),
        },
      ],
    },
    {
      heading: 'Theme',
      items: [
        {
          id: 'light-theme',
          title: 'Light Theme',
          icon: <Sun className="w-4 h-4" />,
          onSelect: () => console.log('Setting light theme...'),
        },
        {
          id: 'dark-theme',
          title: 'Dark Theme',
          icon: <Moon className="w-4 h-4" />,
          onSelect: () => console.log('Setting dark theme...'),
        },
      ],
    },
  ];

  const { CommandPalette } = useCommandPalette(commands);

  // Optimistic update demo
  const [likes, setLikes] = useState(42);
  const [isLiked, setIsLiked] = useState(false);

  const likePost = async () => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Simulate 10% chance of failure
        if (Math.random() < 0.9) {
          resolve();
        } else {
          throw new Error('Failed to like post');
        }
      }, 800);
    });
  };

  const { execute: handleLike } = useOptimisticUpdate(likePost, {
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Post liked successfully!',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
    rollbackOnError: true,
  });

  const onLikeClick = () => {
    const newLikedState = !isLiked;
    const likeDelta = newLikedState ? 1 : -1;
    
    handleLike(
      () => {
        // Optimistic update
        setLikes(prev => prev + likeDelta);
        setIsLiked(newLikedState);
      },
      // No additional args needed for this example
    );
  };

  // Prefetching demo
  const [prefetchData, setPrefetchData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (id: string) => {
    setIsLoading(true);
    // Simulate API call
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(`Data for item ${id}`);
        setIsLoading(false);
      }, 1000);
    });
  };

  // Prefetch on hover
  const handleHover = (id: string) => {
    if (!prefetchData) {
      fetchData(id).then(setPrefetchData);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">UI Patterns Demo</h1>
      
      <Tabs defaultValue="skeletons" className="space-y-4">
        <TabsList>
          <TabsTrigger value="skeletons">Skeleton Loading</TabsTrigger>
          <TabsTrigger value="optimistic">Optimistic UI</TabsTrigger>
          <TabsTrigger value="prefetch">Prefetching</TabsTrigger>
          <TabsTrigger value="commands">Command Palette</TabsTrigger>
        </TabsList>

        <TabsContent value="skeletons">
          <Card>
            <CardHeader>
              <CardTitle>Skeleton Loading</CardTitle>
            </CardHeader>
            <CardContent>
              <SkeletonDemo />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimistic">
          <Card>
            <CardHeader>
              <CardTitle>Optimistic UI Updates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Button 
                  variant={isLiked ? 'default' : 'outline'} 
                  onClick={onLikeClick}
                  disabled={isLoading}
                >
                  {isLiked ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Liked
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Like
                    </>
                  )}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {likes} {likes === 1 ? 'like' : 'likes'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Try clicking the like button. The UI updates immediately, and if there's an error, it rolls back.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prefetch">
          <Card>
            <CardHeader>
              <CardTitle>Prefetching Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {['Item 1', 'Item 2', 'Item 3'].map((item) => (
                    <div 
                      key={item}
                      className="border rounded-lg p-4 cursor-pointer hover:bg-accent transition-colors"
                      onMouseEnter={() => handleHover(item)}
                    >
                      <h3 className="font-medium">{item}</h3>
                      <p className="text-sm text-muted-foreground">
                        Hover to prefetch data
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">Prefetched Data:</h3>
                  {isLoading ? (
                    <div className="animate-pulse flex space-x-4">
                      <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
                    </div>
                  ) : prefetchData ? (
                    <p>{prefetchData}</p>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Hover over an item to prefetch its data
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commands">
          <Card>
            <CardHeader>
              <CardTitle>Command Palette</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Press <kbd className="px-2 py-1 rounded bg-muted text-muted-foreground text-xs">⌘K</kbd> or <kbd className="px-2 py-1 rounded bg-muted text-muted-foreground text-xs">Ctrl+K</kbd> to open the command palette
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const event = new KeyboardEvent('keydown', {
                      key: 'k',
                      metaKey: true,
                      ctrlKey: true,
                    });
                    document.dispatchEvent(event);
                  }}
                >
                  <CommandIcon className="w-4 h-4 mr-2" />
                  Open Command Palette
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CommandPalette />
    </div>
  );
}
