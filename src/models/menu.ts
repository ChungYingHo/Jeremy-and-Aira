// src/models/menu.ts

export type MenuItem = MenuPage | MenuGroup;

export type MenuPage = {
  type: 'page';
  title: string;
  href: string;
}

export type MenuGroup = {
  type: 'group';
  title: string;
  children: MenuItem[];
}
