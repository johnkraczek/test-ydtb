import React, { useState } from 'react';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Trash, Plus, Info, Filter as FilterIcon, ChevronDown, CornerDownRight } from "lucide-react";

export type FilterLogic = 'AND' | 'OR';
export type FilterOperator = 'is' | 'is_not' | 'contains' | 'does_not_contain' | 'starts_with' | 'ends_with' | 'is_empty' | 'is_not_empty' | 'gt' | 'lt';

export interface FilterCondition {
    id: string;
    type: 'condition';
    field: string;
    operator: FilterOperator;
    value: any;
    logic?: FilterLogic;
}

export interface FilterGroup {
    id: string;
    type: 'group';
    logic?: FilterLogic;
    items: (FilterCondition | FilterGroup)[];
}

export type Filter = FilterCondition | FilterGroup;

interface FilterBuilderProps {
    columns: { id: string; label: string; type?: string }[];
    filters: Filter[];
    onFiltersChange: (filters: Filter[]) => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function FilterBuilderContent({
    columns,
    filters,
    onFiltersChange,
    onSave,
    onCancel,
    isSaving,
    setIsSaving,
    filterName,
    setFilterName,
    addFilter,
    addNestedFilter,
    clearFilters,
    getOperators,
    renderFilterItem
}: {
    columns: { id: string; label: string; type?: string }[];
    filters: Filter[];
    onFiltersChange: (filters: Filter[]) => void;
    onSave?: () => void;
    onCancel?: () => void;
    isSaving: boolean;
    setIsSaving: (saving: boolean) => void;
    filterName: string;
    setFilterName: (name: string) => void;
    addFilter: () => void;
    addNestedFilter: (groupId: string | null) => void;
    clearFilters: () => void;
    getOperators: (fieldType?: string) => any[];
    renderFilterItem: (filter: Filter, index: number, depth?: number) => React.ReactNode;
}) {
    return (
        <>
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">Filters</h4>
                    <Info className="h-3.5 w-3.5 text-slate-400" />
                </div>

                {isSaving ? (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-200">
                        <Input
                            className="h-7 text-xs w-[160px] bg-slate-50 dark:bg-slate-900"
                            placeholder="Filter name..."
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                            autoFocus
                        />
                        <Button
                            size="sm"
                            className="h-7 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                            onClick={() => {
                                if (onSave) onSave();
                                else {
                                    setIsSaving(false);
                                    setFilterName("");
                                }
                            }}
                        >
                            Save
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-slate-500"
                            onClick={() => {
                                if (onCancel) onCancel();
                                else setIsSaving(false);
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={() => setIsSaving(true)}
                    >
                        Save Filter
                    </Button>
                )}
            </div>

            <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 min-h-[100px] max-h-[500px] overflow-y-auto space-y-3">
                {filters.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm">
                        No filters applied. Add a filter to narrow down your results.
                    </div>
                ) : (
                    filters.map((filter, index) => renderFilterItem(filter, index))
                )}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 gap-1" onClick={addFilter}>
                        <Plus className="h-3.5 w-3.5" /> Add filter
                    </Button>

                    <Button variant="outline" size="sm" className="h-8 gap-1" onClick={() => addNestedFilter(null)}>
                        <CornerDownRight className="h-3.5 w-3.5" /> Add grouped filter
                    </Button>
                </div>

                {filters.length > 0 && (
                    <Button variant="ghost" size="sm" className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={clearFilters}>
                        Clear all
                    </Button>
                )}
            </div>
        </>
    );
}

export function FilterBuilder({ columns, filters, onFiltersChange, open: controlledOpen, onOpenChange: controlledOnOpenChange }: FilterBuilderProps) {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [filterName, setFilterName] = useState("");

    const isOpen = controlledOpen !== undefined ? controlledOpen : internalIsOpen;
    const setIsOpen = controlledOnOpenChange || setInternalIsOpen;

    const createFilter = (logic?: FilterLogic): FilterCondition => ({
        id: Math.random().toString(36).substr(2, 9),
        type: 'condition',
        field: columns[0]?.id || 'name',
        operator: 'contains',
        value: '',
        logic
    });

    const createGroup = (logic?: FilterLogic): FilterGroup => ({
        id: Math.random().toString(36).substr(2, 9),
        type: 'group',
        logic,
        items: [createFilter()]
    });

    const addFilter = () => {
        onFiltersChange([...filters, createFilter(filters.length > 0 ? 'AND' : undefined)]);
    };

    const updateFilter = (id: string, updates: Partial<FilterCondition> | Partial<FilterGroup>, items: Filter[] = filters): Filter[] => {
        return items.map(item => {
            if (item.id === id) {
                return { ...item, ...updates } as Filter;
            }
            if (item.type === 'group') {
                return { ...item, items: updateFilter(id, updates, item.items) } as FilterGroup;
            }
            return item;
        });
    };

    const removeFilter = (id: string, items: Filter[] = filters): Filter[] => {
        const newItems = items.filter(f => f.id !== id).map(item => {
            if (item.type === 'group') {
                return { ...item, items: removeFilter(id, item.items) };
            }
            return item;
        });

        // Clean up empty groups or fix logic for first items
        if (newItems.length > 0) {
            const firstItem = newItems[0];
            if (firstItem.logic) {
                // Can't directly delete optional readonly prop, so create new object
                if (firstItem.type === 'group') {
                    newItems[0] = { ...firstItem, logic: undefined };
                } else {
                    newItems[0] = { ...firstItem, logic: undefined };
                }
            }
        }

        return newItems.filter(item => item.type !== 'condition' || true) // Keep all for now
            .filter(item => item.type !== 'group' || item.items.length > 0); // Remove empty groups
    };

    const handleRemove = (id: string) => {
        onFiltersChange(removeFilter(id));
    };

    const handleUpdate = (id: string, updates: any) => {
        onFiltersChange(updateFilter(id, updates));
    };

    const addNestedFilter = (groupId: string | null = null) => {
        if (!groupId) {
            // Add a group at the root level
            // If we have existing filters, we need to wrap the new group in logic
            const logic = filters.length > 0 ? 'AND' : undefined;
            onFiltersChange([...filters, createGroup(logic)]);
        } else {
            const addToGroup = (items: Filter[]): Filter[] => {
                return items.map(item => {
                    if (item.id === groupId && item.type === 'group') {
                        const logic = item.items.length > 0 ? 'AND' : undefined;
                        return { ...item, items: [...item.items, createFilter(logic)] };
                    }
                    if (item.type === 'group') {
                        return { ...item, items: addToGroup(item.items) };
                    }
                    return item;
                });
            };
            onFiltersChange(addToGroup(filters));
        }
    };

    const clearFilters = () => {
        onFiltersChange([]);
    };

    const getOperators = (fieldType?: string) => {
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

    const renderFilterItem = (filter: Filter, index: number, depth: number = 0) => {
        const isGroup = filter.type === 'group';

        if (isGroup) {
            return (
                <div key={filter.id} className={`flex flex-col ${depth > 0 ? 'ml-8' : ''}`}>
                    {index > 0 ? (
                        <div className="flex items-center gap-2 py-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-slate-500 hover:text-indigo-600 gap-1 px-2"
                                onClick={() => addNestedFilter(filter.id)}
                            >
                                <Plus className="h-3 w-3" /> Add condition
                            </Button>
                            <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800"></div>
                            <Select
                                value={filter.logic}
                                onValueChange={(val: FilterLogic) => handleUpdate(filter.id, { logic: val })}
                            >
                                <SelectTrigger className="h-7 text-xs bg-white dark:bg-slate-950 w-auto min-w-[60px] max-w-[80px] justify-center">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="AND">AND</SelectItem>
                                    <SelectItem value="OR">OR</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800"></div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-slate-400 hover:text-red-500 flex-shrink-0"
                                onClick={() => handleRemove(filter.id)}
                            >
                                <Trash className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between pb-2 px-1">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs text-slate-500 hover:text-indigo-600 gap-1 px-2"
                                    onClick={() => addNestedFilter(filter.id)}
                                >
                                    <Plus className="h-3 w-3" /> Add condition
                                </Button>
                                <div className="text-sm text-slate-500 font-medium">
                                    {depth === 0 ? 'Where' : 'Matches'}
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-slate-400 hover:text-red-500 flex-shrink-0"
                                onClick={() => handleRemove(filter.id)}
                            >
                                <Trash className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    )}

                    <div className="flex items-start gap-2">
                        <div className="flex-1 p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 relative shadow-sm">
                            {/* Connecting line for nested groups */}
                            {depth > 0 && (
                                <div className="absolute left-[-24px] top-[20px] w-[24px] h-[1px] bg-slate-200 dark:bg-slate-800"></div>
                            )}

                            <div className="flex flex-col gap-3">
                                {(filter as FilterGroup).items.map((item, i) => renderFilterItem(item, i, depth + 1))}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div key={filter.id} className={`flex flex-col gap-2 ${depth > 0 ? 'ml-0' : ''}`}>
                <div className="flex items-center gap-2">
                    <div className="w-[80px] flex-shrink-0">
                        {index === 0 ? (
                            <span className="text-sm text-slate-500 font-medium px-2">
                                {depth === 0 ? 'Where' : (filter.logic || 'Where')}
                            </span>
                        ) : (
                            <Select
                                value={filter.logic}
                                onValueChange={(val: FilterLogic) => handleUpdate(filter.id, { logic: val })}
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
                        value={(filter as FilterCondition).field}
                        onValueChange={(val) => handleUpdate(filter.id, { field: val })}
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
                        value={(filter as FilterCondition).operator}
                        onValueChange={(val: FilterOperator) => handleUpdate(filter.id, { operator: val })}
                    >
                        <SelectTrigger className="h-8 text-xs w-[140px] bg-white dark:bg-slate-950">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {getOperators(columns.find(c => c.id === (filter as FilterCondition).field)?.type).map(op => (
                                <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="flex-1">
                        {['is_empty', 'is_not_empty'].includes((filter as FilterCondition).operator) ? (
                            <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700" />
                        ) : (
                            <Input
                                className="h-8 text-xs bg-white dark:bg-slate-950"
                                placeholder="Value..."
                                value={(filter as FilterCondition).value}
                                onChange={(e) => handleUpdate(filter.id, { value: e.target.value })}
                            />
                        )}
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-500 flex-shrink-0"
                        onClick={() => handleRemove(filter.id)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        );
    };

    const countFilters = (items: Filter[]): number => {
        return items.reduce((acc, item) => {
            if (item.type === 'group') {
                return acc + countFilters(item.items);
            }
            return acc + 1;
        }, 0);
    };

    const totalFilters = countFilters(filters);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className={`h-8 w-8 p-0 bg-white border-slate-200 dark:border-slate-800 ${totalFilters > 0 ? 'text-indigo-600 border-indigo-200 bg-indigo-50 dark:bg-indigo-900/20' : ''}`}>
                    <FilterIcon className="h-3.5 w-3.5" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[800px] p-0" align="start">
                <FilterBuilderContent
                    columns={columns}
                    filters={filters}
                    onFiltersChange={onFiltersChange}
                    onSave={() => {
                        setIsSaving(false);
                        setFilterName("");
                    }}
                    onCancel={() => setIsSaving(false)}
                    isSaving={isSaving}
                    setIsSaving={setIsSaving}
                    filterName={filterName}
                    setFilterName={setFilterName}
                    addFilter={addFilter}
                    addNestedFilter={addNestedFilter}
                    clearFilters={clearFilters}
                    getOperators={getOperators}
                    renderFilterItem={renderFilterItem}
                />
            </PopoverContent>
        </Popover>
    );
}
