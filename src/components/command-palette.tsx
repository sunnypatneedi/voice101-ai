import { useState, useEffect, useCallback } from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { Search, Command as CommandIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  group?: string;
  onSelect?: () => void;
}

interface CommandGroup {
  heading: string;
  items: CommandItem[];
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commands: (CommandItem | CommandGroup)[];
  placeholder?: string;
  emptyText?: string;
}

export function CommandPalette({
  open,
  onOpenChange,
  commands,
  placeholder = 'Type a command or search...',
  emptyText = 'No results found.',
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Close on escape key
  useEffect(() => {
    if (!isMounted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMounted, onOpenChange, open]);

  // Filter commands based on query
  const filteredCommands = useCallback(() => {
    if (!query) return commands;

    const filtered: (CommandItem | CommandGroup)[] = [];
    const queryLower = query.toLowerCase();

    commands.forEach((groupOrItem) => {
      if ('items' in groupOrItem) {
        // It's a CommandGroup
        const filteredItems = groupOrItem.items.filter(
          (item) =>
            item.title.toLowerCase().includes(queryLower) ||
            item.description?.toLowerCase().includes(queryLower)
        );

        if (filteredItems.length > 0) {
          filtered.push({
            ...groupOrItem,
            items: filteredItems,
          });
        }
      } else {
        // It's a CommandItem
        if (
          groupOrItem.title.toLowerCase().includes(queryLower) ||
          groupOrItem.description?.toLowerCase().includes(queryLower)
        ) {
          filtered.push(groupOrItem);
        }
      }
    });

    return filtered;
  }, [commands, query]);

  if (!isMounted) return null;

  return (
    <CommandPrimitive
      className={cn(
        'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        'w-[calc(100%-2rem)] max-w-2xl max-h-[80vh]',
        'bg-background border rounded-lg shadow-lg',
        'overflow-hidden flex flex-col',
        'transition-opacity duration-200',
        open ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onOpenChange(false);
        }
      }}
    >
      <div className="flex items-center px-3 border-b">
        <Search className="w-4 h-4 mr-2 opacity-50" />
        <CommandPrimitive.Input
          className={cn(
            'w-full py-3 px-1 bg-transparent outline-none',
            'text-sm placeholder:text-muted-foreground',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
          value={query}
          onValueChange={setQuery}
          placeholder={placeholder}
          autoFocus
        />
        <kbd className="ml-auto px-2 py-1 text-xs rounded bg-muted text-muted-foreground">
          Esc
        </kbd>
      </div>

      <CommandPrimitive.List className="flex-1 overflow-y-auto p-2">
        {filteredCommands().length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            {emptyText}
          </div>
        ) : (
          filteredCommands().map((groupOrItem, groupIndex) => {
            if ('items' in groupOrItem) {
              // It's a CommandGroup
              return (
                <CommandPrimitive.Group
                  key={groupOrItem.heading}
                  heading={groupOrItem.heading}
                  className="[&>[cmdk-group-heading]]:px-2 [&>[cmdk-group-heading]]:py-1.5 [&>[cmdk-group-heading]]:text-xs [&>[cmdk-group-heading]]:font-medium [&>[cmdk-group-heading]]:text-muted-foreground"
                >
                  {groupOrItem.items.map((item) => (
                    <CommandItem key={item.id} item={item} onSelect={onOpenChange} />
                  ))}
                </CommandPrimitive.Group>
              );
            }
            // It's a CommandItem
            return (
              <CommandItem
                key={groupOrItem.id}
                item={groupOrItem}
                onSelect={onOpenChange}
              />
            );
          })
        )}
      </CommandPrimitive.List>

      <div className="border-t px-3 py-2 text-xs text-muted-foreground flex items-center justify-between">
        <div className="flex items-center">
          <CommandIcon className="w-3 h-3 mr-1.5" />
          <span>Command Palette</span>
        </div>
        <div className="flex items-center space-x-2">
          <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
            ↑↓
          </kbd>
          <span>to navigate</span>
          <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
            ↵
          </kbd>
          <span>to select</span>
        </div>
      </div>
    </CommandPrimitive>
  );
}

interface CommandItemProps {
  item: CommandItem;
  onSelect: (open: boolean) => void;
}

function CommandItem({ item, onSelect }: CommandItemProps) {
  const handleSelect = useCallback(() => {
    if (item.onSelect) {
      item.onSelect();
    }
    onSelect(false);
  }, [item, onSelect]);

  return (
    <CommandPrimitive.Item
      onSelect={handleSelect}
      className={cn(
        'flex items-center px-2 py-2 rounded-md text-sm',
        'cursor-default select-none',
        'aria-selected:bg-accent aria-selected:text-accent-foreground',
        'outline-none',
        'transition-colors'
      )}
    >
      {item.icon && (
        <div className="mr-2 flex-shrink-0 text-muted-foreground">
          {item.icon}
        </div>
      )}
      <div className="flex-1">
        <div className="font-medium">{item.title}</div>
        {item.description && (
          <div className="text-xs text-muted-foreground">{item.description}</div>
        )}
      </div>
      {item.shortcut && (
        <kbd className="ml-2 px-1.5 py-0.5 text-xs rounded bg-muted text-muted-foreground">
          {item.shortcut}
        </kbd>
      )}
    </CommandPrimitive.Item>
  );
}

// Hook to use command palette
export function useCommandPalette(commands: (CommandItem | CommandGroup)[]) {
  const [isOpen, setIsOpen] = useState(false);

  // Register global keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const CommandPaletteComponent = useCallback(
    () => (
      <CommandPalette
        open={isOpen}
        onOpenChange={setIsOpen}
        commands={commands}
      />
    ),
    [isOpen, commands]
  );

  return {
    CommandPalette: CommandPaletteComponent,
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };
}
