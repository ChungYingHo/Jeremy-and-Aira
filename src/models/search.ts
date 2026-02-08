export interface SearchIndexItem {
  title: string;
  slug: string;
  content: string;
  description?: string;
  type: 'Page' | 'Article' | 'Note';
  tags?: string[];
}

export interface RawFileContent {
  path: string;
  content: string;
}
