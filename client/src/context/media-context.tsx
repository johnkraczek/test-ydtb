
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type FileType = 'folder' | 'image' | 'document';

export interface FileSystemItem {
  id: string;
  name: string;
  type: FileType;
  parentId: string | null;
  size?: string;
  modified: string;
  url?: string;
  items?: string[];
}

interface MediaContextType {
  items: FileSystemItem[];
  setItems: React.Dispatch<React.SetStateAction<FileSystemItem[]>>;
  currentPath: FileSystemItem[];
  setCurrentPath: React.Dispatch<React.SetStateAction<FileSystemItem[]>>;
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  viewMode: 'grid' | 'list' | 'columns';
  setViewMode: React.Dispatch<React.SetStateAction<'grid' | 'list' | 'columns'>>;
  navigateToFolder: (folder: FileSystemItem) => void;
  navigateUp: () => void;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

const initialFiles: FileSystemItem[] = [
  // Root Folders
  { id: '1', name: 'Marketing Assets', type: 'folder', parentId: null, modified: '2023-10-15', items: ['11', '12', '13'] },
  { id: '2', name: 'Product Images', type: 'folder', parentId: null, modified: '2023-11-02', items: ['21', '22', '23', '24'] },
  { id: '3', name: 'Documents', type: 'folder', parentId: null, modified: '2023-09-20', items: ['31', '32'] },
  
  // Marketing Assets
  { id: '11', name: 'Social Media', type: 'folder', parentId: '1', modified: '2023-10-15', items: ['111', '112'] },
  { id: '12', name: 'Campaign Q4', type: 'folder', parentId: '1', modified: '2023-10-18', items: ['121', '122', '123'] },
  { id: '13', name: 'Banner_Main.jpg', type: 'image', parentId: '1', size: '2.4 MB', modified: '2023-10-20', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=500&auto=format&fit=crop&q=60' },

  // Product Images
  { id: '21', name: 'Summer Collection', type: 'folder', parentId: '2', modified: '2023-11-02', items: ['211', '212', '213'] },
  { id: '22', name: 'Winter Collection', type: 'folder', parentId: '2', modified: '2023-11-05', items: [] },
  { id: '23', name: 'Shoes_Sport_v1.png', type: 'image', parentId: '2', size: '1.8 MB', modified: '2023-11-10', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60' },
  { id: '24', name: 'TShirt_White.png', type: 'image', parentId: '2', size: '1.2 MB', modified: '2023-11-12', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60' },

  // Documents
  { id: '31', name: 'Brand_Guidelines.pdf', type: 'document', parentId: '3', size: '4.5 MB', modified: '2023-09-20' },
  { id: '32', name: 'Contracts', type: 'folder', parentId: '3', modified: '2023-09-22', items: [] },

  // Deep Nested Items (Social Media)
  { id: '111', name: 'Instagram_Post.jpg', type: 'image', parentId: '11', size: '3.2 MB', modified: '2023-10-16', url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&auto=format&fit=crop&q=60' },
  { id: '112', name: 'Stories_Template.psd', type: 'document', parentId: '11', size: '15 MB', modified: '2023-10-16' },

  // Deep Nested Items (Campaign Q4)
  { id: '121', name: 'Email_Header.png', type: 'image', parentId: '12', size: '0.8 MB', modified: '2023-10-18', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=60' },
  { id: '122', name: 'Ad_Copy.docx', type: 'document', parentId: '12', size: '0.1 MB', modified: '2023-10-19' },
  { id: '123', name: 'Budget.xlsx', type: 'document', parentId: '12', size: '0.2 MB', modified: '2023-10-19' },
  
  // Deep Nested Items (Summer Collection)
  { id: '211', name: 'Beach_Shoot_01.jpg', type: 'image', parentId: '21', size: '5.6 MB', modified: '2023-11-03', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60' },
  { id: '212', name: 'Beach_Shoot_02.jpg', type: 'image', parentId: '21', size: '5.1 MB', modified: '2023-11-03', url: 'https://images.unsplash.com/photo-1520942702018-0862200e6873?w=500&auto=format&fit=crop&q=60' },
  { id: '213', name: 'Model_Release.pdf', type: 'document', parentId: '21', size: '0.5 MB', modified: '2023-11-03' },
];

export function MediaProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FileSystemItem[]>(initialFiles);
  const [currentPath, setCurrentPath] = useState<FileSystemItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'columns'>('grid');

  const navigateToFolder = (folder: FileSystemItem) => {
    const path: FileSystemItem[] = [];
    let current: FileSystemItem | undefined = folder;
    
    while (current) {
      path.unshift(current);
      if (current.parentId) {
        const parentId = current.parentId;
        current = items.find(i => i.id === parentId);
      } else {
        current = undefined;
      }
    }
    
    setCurrentPath(path);
    setSelectedItems([]);
  };

  const navigateUp = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  return (
    <MediaContext.Provider value={{
      items,
      setItems,
      currentPath,
      setCurrentPath,
      selectedItems,
      setSelectedItems,
      viewMode,
      setViewMode,
      navigateToFolder,
      navigateUp
    }}>
      {children}
    </MediaContext.Provider>
  );
}

export function useMedia() {
  const context = useContext(MediaContext);
  if (context === undefined) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
}
