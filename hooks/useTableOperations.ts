// hooks/useTableOperations.ts
import { useState, useMemo } from 'react';

export interface SortOption {
  label: string;
  value: string;
  sortFn: (a: any, b: any) => number;
}

export interface FilterOption {
  label: string;
  field: string;
  options: { label: string; value: string }[];
}

export interface TableOperationsConfig<T> {
  data: T[];
  searchFields: (keyof T)[];
  sortOptions: SortOption[];
  filterOptions?: FilterOption[];
  defaultSort?: string;
}

export const useTableOperations = <T extends Record<string, any>>({
  data,
  searchFields,
  sortOptions,
  filterOptions = [],
  defaultSort
}: TableOperationsConfig<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState(defaultSort || sortOptions[0]?.value || '');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((item) =>
        searchFields.some((field) => {
          const fieldValue = String(item[field]);
          return fieldValue.toLowerCase().includes(searchLower);
        })
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([field, value]) => {
      if (value && value !== '') {
        result = result.filter((item) => String(item[field]) === value);
      }
    });

    // Apply sorting
    const currentSort = sortOptions.find((option) => option.value === sortBy);
    if (currentSort) {
      result.sort(currentSort.sortFn);
    }

    return result;
  }, [data, searchTerm, sortBy, filters, searchFields, sortOptions]);

  const setFilter = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilter = (field: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[field];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const resetToDefaults = () => {
    setFilters({});
    setSearchTerm('');
    setSortBy(defaultSort || sortOptions[0]?.value || '');
    setShowFilters(false);
  };

  const activeFiltersCount = Object.values(filters).filter((value) => value && value !== '').length;

  return {
    // State
    searchTerm,
    sortBy,
    filters,
    showFilters,
    filteredAndSortedData,
    activeFiltersCount,

    // Actions
    setSearchTerm,
    setSortBy,
    setFilter,
    clearFilter,
    clearAllFilters,
    resetToDefaults,
    setShowFilters,

    // Computed
    hasActiveFilters: activeFiltersCount > 0 || searchTerm.trim() !== '',
    totalResults: filteredAndSortedData.length,
    originalCount: data.length
  };
};

// Utility functions for common sort operations
export const sortHelpers = {
  stringAsc: (field: string) => (a: any, b: any) =>
    String(a[field]).localeCompare(String(b[field])),
  stringDesc: (field: string) => (a: any, b: any) =>
    String(b[field]).localeCompare(String(a[field])),

  numberAsc: (field: string) => (a: any, b: any) => Number(a[field]) - Number(b[field]),
  numberDesc: (field: string) => (a: any, b: any) => Number(b[field]) - Number(a[field]),

  dateAsc: (field: string, dateParser?: (dateStr: string) => Date) => (a: any, b: any) => {
    const dateA = dateParser ? dateParser(a[field]) : new Date(a[field]);
    const dateB = dateParser ? dateParser(b[field]) : new Date(b[field]);
    return dateA.getTime() - dateB.getTime();
  },

  dateDesc: (field: string, dateParser?: (dateStr: string) => Date) => (a: any, b: any) => {
    const dateA = dateParser ? dateParser(a[field]) : new Date(a[field]);
    const dateB = dateParser ? dateParser(b[field]) : new Date(b[field]);
    return dateB.getTime() - dateA.getTime();
  }
};

// Helper to generate filter options from data
export const generateFilterOptions = <T>(
  data: T[],
  field: keyof T,
  label: string,
  includeAll: boolean = true
): FilterOption => {
  const uniqueValues = [...new Set(data.map((item) => String(item[field])))].sort();

  const options = uniqueValues.map((value) => ({
    label: value,
    value: value
  }));

  if (includeAll) {
    options.unshift({ label: `All ${label}`, value: '' });
  }

  return {
    label,
    field: String(field),
    options
  };
};

export default useTableOperations;
