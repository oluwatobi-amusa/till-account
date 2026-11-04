import { store } from '@/store';
import { SortOption, FilterOption } from '@/hooks/useTableOperations';

export type User = {
  id: number;
  uuid: string;
  name: string;
  email: string;
  created_at: string;
  token: string;
  ttl: number;
  isAuthenticated: boolean;
};

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export interface TableControlConfig<T> {
  search?: {
    enabled: boolean;
    placeholder?: string;
    fields?: (keyof T)[];
  };

  sort?: {
    enabled: boolean;
    options: SortOption[];
    defaultSort?: string;
  };

  filters?: {
    enabled: boolean;
    options: FilterOption[];
  };

  // Actions configuration
  actions?: {
    export?: {
      enabled: boolean;
      filename?: string;
      customHandler?: (data: T[]) => void;
      headers?: string[];
      fieldMapping?: Record<string, keyof T>;
    };
    refresh?: {
      enabled: boolean;
      handler: () => void;
    };
  };

  // Display configuration
  display?: {
    title?: string;
    showResultsCount?: boolean;
  };
}

export interface TableControlState<T> {
  searchTerm: string;
  sortBy: string;
  filters: Record<string, string>;
  showFilters: boolean;
  data: T[];
  totalResults: number;
  originalCount: number;
}

export interface TableControlActions {
  setSearchTerm: (value: string) => void;
  setSortBy: (value: string) => void;
  setFilter: (field: string, value: string) => void;
  clearFilter: (field: string) => void;
  clearAllFilters: () => void;
  toggleFilters: () => void;
}
