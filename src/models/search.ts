export interface SearchIndexItem {
  title: string;
  slug: string;
  content: string;
  description?: string;
  type: string; 
  tags?: string[];

  [key: string]: any;
}

export interface RawFileContent {
  path: string;
  content: string;
}
