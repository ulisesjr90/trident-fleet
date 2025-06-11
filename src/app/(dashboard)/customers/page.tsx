'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, MoreHorizontal, ChevronUp, ChevronDown, Filter, X, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AddCustomerModal } from '@/components/customers/AddCustomerModal';
import { useCustomers } from '@/hooks/useCustomers';
import { useCustomerOperations } from '@/hooks/useCustomerOperations';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PageHeader } from '@/components/layout/PageHeader';
import { getTypographyClass } from '@/lib/typography';
import { DataTable, DataTableHeader, DataTableBody, DataTableRow, DataTableCell, DataTableHeaderCell } from '@/components/ui/DataTable';
import { Customer } from '@/types/customer';
import { Badge } from '@/components/ui/Badge';
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { DropdownMenuItem } from "@/components/ui/DropdownMenuItem";
import { PageLayout } from '@/components/layout/PageLayout';
import { toast } from 'sonner';

type SortField = 'name' | 'email' | 'createdAt';
type SortDirection = 'asc' | 'desc';
type FilterField = 'vehicleCount';

export default function CustomersPage() {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const { customers, loading: isLoading, error } = useCustomers();
  const { deleteCustomer } = useCustomerOperations();
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [activeFilters, setActiveFilters] = useState(0);
  const [filters, setFilters] = useState<{
    vehicleCount?: 'with' | 'without';
  }>({});
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleAddSuccess = () => {
    setShowAddModal(false);
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedCustomers = customers
    .filter(customer => {
      if (filters.vehicleCount) {
        const hasVehicles = typeof customer.assignedVehicles === 'number' && customer.assignedVehicles > 0;
        if (filters.vehicleCount === 'with' && !hasVehicles) return false;
        if (filters.vehicleCount === 'without' && hasVehicles) return false;
      }
      return true;
    })
    .sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    switch (sortField) {
      case 'name':
        return direction * a.name.localeCompare(b.name);
      case 'email':
        return direction * a.email.localeCompare(b.email);
      case 'createdAt':
        return direction * (a.createdAt.getTime() - b.createdAt.getTime());
      default:
        return 0;
    }
  });

  const handleFilterChange = (field: FilterField, value: 'with' | 'without' | undefined) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (value === undefined) {
        delete newFilters[field];
      } else if (field === 'vehicleCount') {
        newFilters.vehicleCount = value;
      }
      return newFilters;
    });
  };

  useEffect(() => {
    setActiveFilters(Object.keys(filters).length);
  }, [filters]);

  const handleEdit = (customer: Customer) => {
    router.push(`/customers/${customer.id}/edit`);
  };

  const handleDelete = async (customer: Customer) => {
    if (window.confirm(`Are you sure you want to delete ${customer.name}?`)) {
      setIsDeleting(true);
      try {
        await deleteCustomer(customer.id);
        toast.success('Customer deleted successfully');
      } catch (error) {
        console.error('Error deleting customer:', error);
        toast.error('Failed to delete customer');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <PageLayout title="Customers">
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Customers">
      <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
        <p className={getTypographyClass('body')}>
          Error loading customers: {error instanceof Error ? error.message : String(error)}
        </p>
      </div>
      </PageLayout>
    );
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };

  return (
    <PageLayout 
      title="Customers"
      headerContent={
        <PageHeader>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className={getTypographyClass('body')}>Add Customer</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilterModal(true)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              <span className={getTypographyClass('body')}>Filter</span>
              {activeFilters > 0 && (
                <Badge variant="default" className="ml-1">
                  {activeFilters}
                </Badge>
              )}
            </Button>
          </div>
        </PageHeader>
      }
    >
      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className={getTypographyClass('header')}>Filter Customers</h2>
              <Button
                variant="ghost"
                onClick={() => setShowFilterModal(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Filter Section */}
            <div className="mb-6">
              <h3 className={getTypographyClass('body')}>Filter By</h3>
              <div className="space-y-4 mt-2">
                {/* Vehicle Count Filter */}
                <div>
                  <label className={getTypographyClass('body')}>Vehicles</label>
                  <div className="flex gap-2 mt-1">
                    <Button
                      variant={filters.vehicleCount === 'with' ? 'default' : 'outline'}
                      onClick={() => handleFilterChange('vehicleCount', filters.vehicleCount === 'with' ? undefined : 'with')}
                      className="flex-1"
                    >
                      <span className={getTypographyClass('body')}>With Vehicles</span>
                    </Button>
                    <Button
                      variant={filters.vehicleCount === 'without' ? 'default' : 'outline'}
                      onClick={() => handleFilterChange('vehicleCount', filters.vehicleCount === 'without' ? undefined : 'without')}
                      className="flex-1"
                    >
                      <span className={getTypographyClass('body')}>Without Vehicles</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sort Section */}
            <div className="mb-6">
              <h3 className={getTypographyClass('body')}>Sort By</h3>
              <div className="space-y-2 mt-2">
                {(['name', 'email', 'createdAt'] as const).map((field) => (
                  <Button
                    key={field}
                    variant={sortField === field ? 'default' : 'outline'}
                    onClick={() => handleSort(field)}
                    className="w-full justify-between"
                  >
                    <span className={getTypographyClass('body')}>
                      {field === 'createdAt' ? 'Created' :
                       field.charAt(0).toUpperCase() + field.slice(1)}
                    </span>
                    <SortIcon field={field} />
                  </Button>
                ))}
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setSortField('name');
                  setSortDirection('asc');
                  setFilters({});
                  setActiveFilters(0);
                }}
              >
                <span className={getTypographyClass('body')}>Reset</span>
              </Button>
              <Button
                onClick={() => setShowFilterModal(false)}
              >
                <span className={getTypographyClass('body')}>Apply</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop View - Data Table */}
      <div className="hidden md:block">
        <DataTable>
            <DataTableHeader>
              <tr>
                <DataTableHeaderCell>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('name')}
                    className="flex items-center"
                  >
                    <span className={getTypographyClass('body')}>Name</span>
                    <SortIcon field="name" />
                  </Button>
                </DataTableHeaderCell>
                <DataTableHeaderCell>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('email')}
                    className="flex items-center"
                  >
                    <span className={getTypographyClass('body')}>Email</span>
                    <SortIcon field="email" />
                  </Button>
                </DataTableHeaderCell>
                <DataTableHeaderCell>
                  <span className={getTypographyClass('body')}>Phone</span>
                </DataTableHeaderCell>
                <DataTableHeaderCell>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('createdAt')}
                    className="flex items-center"
                  >
                    <span className={getTypographyClass('body')}>Created</span>
                    <SortIcon field="createdAt" />
                  </Button>
                </DataTableHeaderCell>
                <DataTableHeaderCell className="text-right">
                  <span className={getTypographyClass('body')}>Actions</span>
                </DataTableHeaderCell>
              </tr>
            </DataTableHeader>
            <DataTableBody>
            {filteredAndSortedCustomers.map((customer) => (
                <DataTableRow 
                  key={customer.id}
                  onClick={() => router.push(`/customers/${customer.id}`)}
                  className="cursor-pointer"
                >
                  <DataTableCell>
                    <div className="flex flex-col">
                      <span className={getTypographyClass('body')}>
                        {customer.name}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        {customer.assignedVehicles > 0 && (
                          <Badge variant="default" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            {customer.assignedVehicles} vehicle{customer.assignedVehicles !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </DataTableCell>
                  <DataTableCell>
                    <span className={getTypographyClass('body')}>{customer.email}</span>
                  </DataTableCell>
                  <DataTableCell>
                    <span className={getTypographyClass('body')}>{customer.phone}</span>
                  </DataTableCell>
                  <DataTableCell>
                    <span className={getTypographyClass('body')}>
                      {customer.createdAt.toLocaleDateString()}
                    </span>
                  </DataTableCell>
                  <DataTableCell className="text-right">
                    <Button 
                      variant="ghost" 
                    className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                      onClick={(e) => {
                        e.stopPropagation();
                      handleDelete(customer);
                      }}
                    >
                    <span className="sr-only">Delete customer</span>
                    <Trash2 className="h-4 w-4" />
                    </Button>
                  </DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>
        </DataTable>
      </div>

      {/* Mobile View - List Report */}
      <div className="md:hidden">
        {filteredAndSortedCustomers.map((customer) => (
          <div
            key={customer.id}
            onClick={() => router.push(`/customers/${customer.id}`)}
            className="bg-transparent border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="px-4 py-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>
                    {customer.name}
                  </h3>
                  <p className={getTypographyClass('body')} style={{ margin: 0 }}>
                    {customer.email}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{customer.phone}</span>
                    {customer.assignedVehicles > 0 && (
                      <>
                    <span>•</span>
                        <Badge variant="default" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          {customer.assignedVehicles} vehicle{customer.assignedVehicles !== 1 ? 's' : ''}
                        </Badge>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                    Created {customer.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(customer);
                  }}
                >
                  <span className="sr-only">Delete customer</span>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddCustomerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />
    </PageLayout>
  );
} 