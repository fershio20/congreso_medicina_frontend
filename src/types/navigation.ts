/**
 * Types for Strapi Navigation Plugin API (render with type=TREE).
 * @see https://github.com/VirtusLab-Open-Source/strapi-plugin-navigation
 */

export interface NavigationTreeItem {
  title: string;
  menuAttached: boolean;
  path: string;
  type: 'INTERNAL' | 'EXTERNAL' | 'WRAPPER';
  uiRouterKey: string;
  slug?: string;
  external: boolean;
  related?: Record<string, unknown>;
  items?: NavigationTreeItem[];
}

export type NavigationTree = NavigationTreeItem[];
