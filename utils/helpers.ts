// utils/helpers.ts — Shared utility functions

export function toggleSelectedItem<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((value) => value !== item) : [...list, item];
}
