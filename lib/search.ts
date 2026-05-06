import Fuse from 'fuse.js';

// Generic search setup — pass your items array and the keys you want to search
export function createSearch<T>(items: T[], keys: string[]): Fuse<T> {
  return new Fuse(items, {
    keys,
    threshold: 0.35,
    ignoreLocation: true,
    minMatchCharLength: 1,
  });
}

export function search<T>(fuse: Fuse<T>, query: string): T[] {
  if (!query.trim()) return [];
  return fuse.search(query).map((r) => r.item);
}
