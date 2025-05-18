import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Home, 
  BookOpen, 
  HelpCircle, 
  Mic, 
  Moon, 
  Sun, 
  Settings, 
  User,
  Bookmark,
  Clock,
  Download,
  Share2,
  Code,
  Info,
  LogOut,
  PlusCircle,
  History,
  Trash2,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useTheme } from './ui/theme-provider';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { useHotkeys } from 'react-hotkeys-hook';
import { useOfflineFirst } from '@/hooks/useOfflineFirst';
import { toast } from '@/components/ui/use-toast';

interface Command {
  id: string;
  label: string;
  icon: React.ReactNode;
  group: string;
  keywords?: string[];
  shortcut?: string;
  onSelect: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [search, setSearch] = useState('');
  
  // Check if we're online
  const { isOffline } = useOfflineFirst({});
  
  // Register global shortcut
  useHotkeys('esc', () => {
    if (open) {
      onOpenChange(false);
    }
  }, { enableOnFormTags: true }, [open]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Toggle with Cmd+K/Ctrl+K
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
        return;
      }
      
      // Close on escape
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        onOpenChange(false);
      }
    };

    // Always listen for the toggle shortcut
    document.addEventListener('keydown', down);
    
    // Cleanup
    return () => {
      document.removeEventListener('keydown', down);
    };
  }, [open, onOpenChange]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme?.(newTheme);
    toast({
      title: `Switched to ${newTheme} mode`,
      variant: 'default',
    });
  }, [theme, setTheme]);

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          text: 'Check out this page on Voice101 AI',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link copied to clipboard',
          variant: 'default',
        });
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  }, []);

  const commands: Command[] = [
    // Navigation
    {
      id: 'home',
      label: 'Go to Home',
      icon: <Home className="mr-2 h-4 w-4" />,
      group: 'Navigation',
      keywords: ['home', 'start', 'dashboard'],
      shortcut: 'G H',
      onSelect: () => navigate('/'),
    },
    {
      id: 'foundational',
      label: 'Foundational Terms',
      icon: <BookOpen className="mr-2 h-4 w-4" />,
      group: 'Navigation',
      keywords: ['terms', 'basics', 'fundamentals'],
      shortcut: 'G F',
      onSelect: () => navigate('/foundational-terms'),
    },
    {
      id: 'advanced',
      label: 'Advanced Concepts',
      icon: <BookOpen className="mr-2 h-4 w-4" />,
      group: 'Navigation',
      keywords: ['advanced', 'concepts', 'topics'],
      shortcut: 'G A',
      onSelect: () => navigate('/advanced-concepts'),
    },
    {
      id: 'faq',
      label: 'FAQ',
      icon: <HelpCircle className="mr-2 h-4 w-4" />,
      group: 'Navigation',
      keywords: ['help', 'questions', 'support'],
      shortcut: 'G Q',
      onSelect: () => navigate('/faq'),
    },
    {
      id: 'simulator',
      label: 'Simulator Studio',
      icon: <Mic className="mr-2 h-4 w-4" />,
      group: 'Navigation',
      keywords: ['simulator', 'studio', 'playground'],
      shortcut: 'G S',
      onSelect: () => navigate('/simulator-studio'),
    },
    
    // Theme
    {
      id: 'toggle-theme',
      label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      icon: theme === 'dark' ? 
        <Sun className="mr-2 h-4 w-4" /> : 
        <Moon className="mr-2 h-4 w-4" />,
      group: 'Preferences',
      keywords: ['theme', 'dark', 'light', 'mode', 'appearance'],
      shortcut: 'T',
      onSelect: () => {
        if (theme) {
          toggleTheme();
        } else {
          // Fallback if theme is not available
          const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
          document.documentElement.classList.toggle('dark', newTheme === 'dark');
          localStorage.setItem('theme', newTheme);
          toast({
            title: `Switched to ${newTheme} mode`,
            variant: 'default',
          });
        }
      },
    },
    
    // Actions
    {
      id: 'share',
      label: 'Share Current Page',
      icon: <Share2 className="mr-2 h-4 w-4" />,
      group: 'Actions',
      keywords: ['share', 'link', 'copy', 'url'],
      shortcut: 'S',
      onSelect: handleShare,
    },
    {
      id: 'bookmark',
      label: 'Bookmark This Page',
      icon: <Bookmark className="mr-2 h-4 w-4" />,
      group: 'Actions',
      keywords: ['bookmark', 'save', 'favorite'],
      shortcut: 'B',
      onSelect: () => {
        // Implement bookmark functionality
        toast({
          title: 'Page bookmarked',
          description: 'This page has been added to your bookmarks',
          variant: 'default',
        });
      },
    },
    
    // System
    {
      id: 'offline-mode',
      label: isOffline ? 'Go Online' : 'Go Offline',
      icon: <Download className="mr-2 h-4 w-4" />,
      group: 'System',
      keywords: ['offline', 'online', 'mode', 'cache'],
      shortcut: 'O',
      onSelect: () => {
        // Toggle offline mode
        toast({
          title: isOffline ? 'Going online...' : 'Going offline...',
          description: isOffline ? 'Syncing data...' : 'Using cached data',
          variant: 'default',
        });
      },
    },
    {
      id: 'clear-cache',
      label: 'Clear Cache',
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      group: 'System',
      keywords: ['clear', 'cache', 'storage', 'reset'],
      onSelect: async () => {
        try {
          // Clear cache logic here
          await caches.keys().then(cacheNames => {
            return Promise.all(
              cacheNames.map(cacheName => caches.delete(cacheName))
            );
          });
          
          // Clear local storage
          localStorage.clear();
          
          toast({
            title: 'Cache cleared',
            description: 'All cached data has been cleared',
            variant: 'default',
          });
          
          // Refresh the page to ensure clean state
          setTimeout(() => window.location.reload(), 1000);
        } catch (err) {
          console.error('Error clearing cache:', err);
          toast({
            title: 'Error',
            description: 'Failed to clear cache',
            variant: 'destructive',
          });
        }
      },
    },
  ];
  
  // Filter commands based on search
  const filteredCommands = useMemo(() => {
    if (!search) return commands;
    
    const searchLower = search.toLowerCase();
    return commands.filter(cmd => {
      const matchesSearch = 
        cmd.label.toLowerCase().includes(searchLower) ||
        (cmd.keywords && cmd.keywords.some(kw => kw.toLowerCase().includes(searchLower)));
      
      return matchesSearch;
    });
  }, [commands, search]);
  
  // Group commands by category
  const commandGroups = useMemo(() => {
    const groups: Record<string, Command[]> = {};
    
    filteredCommands.forEach(cmd => {
      if (!groups[cmd.group]) {
        groups[cmd.group] = [];
      }
      groups[cmd.group].push(cmd);
    });
    
    return Object.entries(groups);
  }, [filteredCommands]);

  // Don't render anything if not open
  if (!open) return null;

  return (
    <CommandDialog 
      open={open} 
      onOpenChange={onOpenChange} 
      modal={false}
    >
      <Command 
        className="rounded-lg border shadow-md"
        filter={() => 1} // Bypass default filtering
      >
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput
            placeholder="Type a command or search..."
            value={search}
            onValueChange={setSearch}
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <CommandList className="max-h-[400px] overflow-y-auto">
          <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
            No commands found. Try a different search.
          </CommandEmpty>
          
          {commandGroups.map(([group, cmds]) => (
            <CommandGroup 
              key={group}
              heading={group}
              className="capitalize [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
            >
              {cmds.map((command) => (
                <CommandItem
                  key={command.id}
                  value={command.id}
                  onSelect={() => {
                    command.onSelect();
                    // Small delay to allow navigation to complete before closing
                    setTimeout(() => onOpenChange(false), 100);
                  }}
                  className="flex items-center justify-between px-2 py-2 text-sm cursor-pointer rounded-md aria-selected:bg-accent aria-selected:text-accent-foreground"
                >
                  <div className="flex items-center">
                    <span className="mr-2 flex h-4 w-4 items-center justify-center">
                      {command.icon}
                    </span>
                    <span>{command.label}</span>
                  </div>
                  {command.shortcut && (
                    <CommandShortcut className="ml-4 text-xs text-muted-foreground">
                      {command.shortcut}
                    </CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
          
          <CommandSeparator className="my-2" />
          
          <div className="px-4 py-2 text-xs text-muted-foreground">
            <p>Press <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">Esc</kbd> to close</p>
            <p className="mt-1">
              {isOffline ? (
                <span className="flex items-center text-yellow-600 dark:text-yellow-400">
                  <WifiOff className="mr-1 h-3 w-3" /> Offline Mode
                </span>
              ) : (
                <span className="flex items-center text-green-600 dark:text-green-400">
                  <Wifi className="mr-1 h-3 w-3" /> Online
                </span>
              )}
            </p>
          </div>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
