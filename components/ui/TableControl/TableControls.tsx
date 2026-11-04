// import React from 'react';
// import SearchControl from './SearchControl';
// import FilterControls from './FilterControls';
// import ActionControls from './ActionControl';
// import { TableControlConfig, TableControlState, TableControlActions } from '@/types';

// interface TableControlsProps<T> {
//   config: TableControlConfig<T>;
//   state: TableControlState<T>;
//   actions: TableControlActions;
// }

// const TableControls = <T extends Record<string, any>>({
//   config,
//   state,
//   actions
// }: TableControlsProps<T>) => {
//   const { search, sort, filters, actions: actionConfig, display } = config;

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <div>
//           {display?.title && (
//             <h1 className="text-xl font-medium">
//               {display.title}
//               {display.showResultsCount &&
//                 state.totalResults !== state.originalCount &&
//                 ` (${state.totalResults} of ${state.originalCount})`}
//             </h1>
//           )}
//         </div>

//         <div className="flex items-center space-x-2">
//           {/* Search */}
//           {search?.enabled && (
//             <SearchControl
//               value={state.searchTerm}
//               onChange={actions.setSearchTerm}
//               placeholder={search.placeholder}
//             />
//           )}

//           {/* Filter Toggle */}
//           {filters?.enabled && filters.options.length > 0 && (
//             <FilterControls.Toggle
//               showFilters={state.showFilters}
//               onToggle={actions.toggleFilters}
//               activeFiltersCount={Object.values(state.filters).filter(Boolean).length}
//             />
//           )}

//           {/* Sort */}
//           {sort?.enabled && sort.options.length > 0 && (
//             <select
//               value={state.sortBy}
//               onChange={(e) => actions.setSortBy(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               {sort.options.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           )}

//           {/* Actions */}
//           <ActionControls config={actionConfig} data={state.data} />
//         </div>
//       </div>

//       {/* Filter Panel */}
//       {filters?.enabled && state.showFilters && filters.options.length > 0 && (
//         <FilterControls.Panel
//           filterOptions={filters.options}
//           activeFilters={state.filters}
//           searchTerm={state.searchTerm}
//           onFilterChange={actions.setFilter}
//           onClearFilter={actions.clearFilter}
//           onClearAllFilters={actions.clearAllFilters}
//           onClearSearch={() => actions.setSearchTerm('')}
//         />
//       )}
//     </div>
//   );
// };

// export default TableControls;
