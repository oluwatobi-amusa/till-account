// components/TableControls.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Filter, Search, X, RefreshCw } from 'lucide-react';
import { SortOption, FilterOption } from '@/hooks/useTableOperations';

interface TableControlsProps<T> {
  // Search props
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;

  // Sort props
  sortBy: string;
  onSortChange: (value: string) => void;
  sortOptions: SortOption[];

  // Filter props
  filters: Record<string, string>;
  onFilterChange: (field: string, value: string) => void;
  onClearFilter: (field: string) => void;
  onClearAllFilters: () => void;
  filterOptions: FilterOption[];
  showFilters: boolean;
  onToggleFilters: () => void;
  activeFiltersCount: number;

  // Action props
  onExport?: (data: T[]) => void;
  onRefresh?: () => void;
  exportFileName?: string;

  // Display props
  totalResults: number;
  originalCount: number;
  title?: string;

  // Data for export
  exportData?: T[];
  exportHeaders?: string[];
  exportFieldMapping?: Record<string, keyof T>;
}

const TableControls = <T extends Record<string, any>>({
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Search...',
  sortBy,
  onSortChange,
  sortOptions,
  filters,
  onFilterChange,
  onClearFilter,
  onClearAllFilters,
  filterOptions,
  showFilters,
  onToggleFilters,
  activeFiltersCount,
  onExport,
  onRefresh,
  exportFileName = 'export',
  totalResults,
  originalCount,
  title,
  exportData = [],
  exportHeaders = [],
  exportFieldMapping = {}
}: TableControlsProps<T>) => {
  const handleExport = () => {
    if (onExport) {
      onExport(exportData);
    } else {
      // Default CSV export
      const headers = exportHeaders.length > 0 ? exportHeaders : Object.keys(exportData[0] || {});
      const csvContent = [
        headers.join(','),
        ...exportData.map((item) =>
          headers
            .map((header) => {
              const field = exportFieldMapping[header] || header;
              const value = String(item[field] || '');
              return value.includes(',') ? `"${value}"` : value;
            })
            .join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${exportFileName}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">
          {title} {totalResults !== originalCount && `(${totalResults} of ${originalCount})`}
        </h1>
        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          {filterOptions.length > 0 && (
            <Button variant="outline" size="sm" onClick={onToggleFilters} className="relative">
              <Filter className="h-4 w-4 mr-2" />
              Filter
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          )}

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Export */}
          {exportData.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}

          {/* Refresh */}
          {onRefresh && (
            <Button onClick={onRefresh} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && filterOptions.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Filters</h3>
            {(activeFiltersCount > 0 || searchTerm) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAllFilters}
                className="text-red-600 hover:text-red-700"
              >
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterOptions.map((filterOption) => (
              <div key={filterOption.field} className="space-y-1">
                <label className="text-sm font-medium text-gray-700">{filterOption.label}</label>
                <div className="relative">
                  <select
                    value={filters[filterOption.field] || ''}
                    onChange={(e) => onFilterChange(filterOption.field, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {filterOption.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {filters[filterOption.field] && filters[filterOption.field] !== '' && (
                    <button
                      onClick={() => onClearFilter(filterOption.field)}
                      className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Active Filters Display */}
          {(activeFiltersCount > 0 || searchTerm) && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => onSearchChange('')}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {Object.entries(filters).map(([field, value]) => {
                  if (!value || value === '') return null;
                  const filterOption = filterOptions.find((f) => f.field === field);
                  const option = filterOption?.options.find((o) => o.value === value);
                  return (
                    <span
                      key={field}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                    >
                      {filterOption?.label}: {option?.label}
                      <button
                        onClick={() => onClearFilter(field)}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TableControls;
