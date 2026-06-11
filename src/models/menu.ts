export type CollectionType = 'codex' | 'blog' | 'release-notes';

export type MenuItem = MenuPage | MenuGroup;

export type MenuPage = {
  type: 'page';
  title: string;
  href: string;
  date?: string | Date;
  sameDateSort?: number;
}

export type MenuGroup = {
  type: 'group';
  title: string;
  children: MenuItem[];
}

export type MenuCollectionConfig = {
  collectionName: CollectionType;
  title: string;
  baseUrl: string;
}

export const MENU_COLLECTIONS: MenuCollectionConfig[] = [
  { collectionName: 'blog', title: 'Blog', baseUrl: '/blog' },
  { collectionName: 'codex', title: 'Codex', baseUrl: '/codex' },
  { collectionName: 'release-notes', title: 'Aira', baseUrl: '/release-notes' },
]
