import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Trash, Plus, Info, Filter as FilterIcon, ChevronDown } from "lucide-react";

export type FilterLogic = 'AND' | 'OR';
export type FilterOperator = 'is' | 'is_not' | 'contains' | 'does_not_contain' | 'starts_with' | 'ends_with' | 'is_empty' | 'is_not_empty' | 'gt' | 'lt';

export interface Filter {
  id: string;
  field: string;
  operator: FilterOperator;
  value: any;
  logic?: FilterLogic;
}

interface FilterBuilderProps {
  columns: { id: string; label: string; type?: string }[];
  filters: Filter[];
  onFiltersChange: (filters: Filter[]) => void;
}

export function FilterBuilder({ columns, filters, onFiltersChange }: FilterBuilderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const addFilter = () => {
    const newFilter: Filter = {
      id: Math.random().toString(36).substr(2, 9),
      field: columns[0]?.id || 'name',
      operator: 'contains',
      value: '',
      logic: filters.length > 0 ? 'AND' : undefined
    };
    onFiltersChange([...filters, newFilter]);
  };

  const updateFilter = (id: string, updates: Partial<Filter>) => {
    onFiltersChange(filters.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeFilter = (id: string) => {
    const newFilters = filters.filter(f => f.id !== id);
    // If we removed the first item, the new first item shouldn't have logic
    if (newFilters.length > 0 && newFilters[0].logic) {
      delete newFilters[0].logic;
    }
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    onFiltersChange([]);
  };

  const getOperators = (fieldType?: string) => {
    // Simplified operators based on type
    const common = [
        { value: 'is', label: 'Is' },
        { value: 'is_not', label: 'Is not' },
        { value: 'is_empty', label: 'Is empty' },
        { value: 'is_not_empty', label: 'Is not empty' },
    ];
    
    if (fieldType === 'number' || fieldType === 'date') {
        return [
            ...common,
            { value: 'gt', label: 'Greater than' },
            { value: 'lt', label: 'Less than' },
        ];
    }
    
    return [
        ...common,
        { value: 'contains', label: 'Contains' },
        { value: 'does_not_contain', label: 'Does not contain' },
        { value: 'starts_with', label: 'Starts with' },
        { value: 'ends_with', label: 'Ends with' },
    ];
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={`h-8 gap-2 bg-white text-xs border-slate-200 dark:border-slate-800 ${filters.length > 0 ? 'text-indigo-600 border-indigo-200 bg-indigo-50 dark:bg-indigo-900/20' : ''}`}>
          <FilterIcon className="h-3.5 w-3.5" />
          {filters.length > 0 ? `${filters.length} Filter${filters.length > 1 ? 's' : ''}` : 'Filter'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600px] p-0" align="start">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <h4 className="font-medium text-sm">Filters</h4>
                <Info className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                Saved filters <ChevronDown className="h-3 w-3" />
            </Button>
        </div>
        
        <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 min-h-[100px] max-h-[400px] overflow-y-auto space-y-3">
            {filters.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                    No filters applied. Add a filter to narrow down your results.
                </div>
            ) : (
                filters.map((filter, index) => (
                    <div key={filter.id} className="flex items-center gap-2">
                        <div className="w-[80px] flex-shrink-0">
                            {index === 0 ? (
                                <span className="text-sm text-slate-500 font-medium px-2">Where</span>
                            ) : (
                                <Select 
                                    value={filter.logic} 
                                    onValueChange={(val: FilterLogic) => updateFilter(filter.id, { logic: val })}
                                >
                                    <SelectTrigger className="h-8 text-xs bg-white dark:bg-slate-950">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="AND">AND</SelectItem>
                                        <SelectItem value="OR">OR</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                        
                        <Select 
                            value={filter.field} 
                            onValueChange={(val) => updateFilter(filter.id, { field: val })}
                        >
                            <SelectTrigger className="h-8 text-xs w-[160px] bg-white dark:bg-slate-950">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {columns.map(col => (
                                    <SelectItem key={col.id} value={col.id}>{col.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select 
                            value={filter.operator} 
                            onValueChange={(val: FilterOperator) => updateFilter(filter.id, { operator: val })}
                        >
                            <SelectTrigger className="h-8 text-xs w-[140px] bg-white dark:bg-slate-950">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {getOperators(columns.find(c => c.id === filter.field)?.type).map(op => (
                                    <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex-1">
                            {['is_empty', 'is_not_empty'].includes(filter.operator) ? (
                                <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700" />
                            ) : (
                                <Input 
                                    className="h-8 text-xs bg-white dark:bg-slate-950" 
                                    placeholder="Value..." 
                                    value={filter.value}
                                    onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                                />
                            )}
                        </div>

                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-red-500"
                            onClick={() => removeFilter(filter.id)}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                ))
            )}
            
            {filters.length > 0 && (
                 <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-500 hover:text-indigo-600 pl-0 ml-[80px]">
                    Add nested filter
                 </Button>
            )}
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
            <Button variant="outline" size="sm" className="h-8 gap-1" onClick={addFilter}>
                <Plus className="h-3.5 w-3.5" /> Add filter
            </Button>
            
            {filters.length > 0 && (
                <Button variant="ghost" size="sm" className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={clearFilters}>
                    Clear all
                </Button>
            )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
