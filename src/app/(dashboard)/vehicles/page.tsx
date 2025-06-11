'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, MoreHorizontal, ChevronUp, ChevronDown, Filter, X, Trash2, Archive, RefreshCw, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AddVehicleModal } from '@/components/vehicles/AddVehicleModal';
import { useVehicles } from '@/hooks/useVehicles';
import { useVehicleOperations } from '@/hooks/useVehicleOperations';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PageHeader } from '@/components/layout/PageHeader';
import { getTypographyClass } from '@/lib/typography';
import { DataTable, DataTableHeader, DataTableBody, DataTableRow, DataTableCell, DataTableHeaderCell } from '@/components/ui/DataTable';
import { Vehicle, VehicleStatus } from '@/types/vehicle';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Textarea } from "@/components/ui/Textarea";
import { doc, updateDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Timestamp } from "firebase/firestore";
import { MaintenanceRecord } from "@/types/vehicle";
import { PageLayout } from '@/components/layout/PageLayout';
import { DropdownMenu } from "@/components/ui/DropdownMenu";

type SortField = 'vehicleDescriptor' | 'status' | 'assignedTo' | 'color' | 'licensePlate' | 'currentMileage' | 'milesUntilOilChange' | 'registrationExpiration' | 'source' | 'mvaNumber';
type SortDirection = 'asc' | 'desc';
type FilterField = 'status' | 'source' | 'maintenance';

export default function VehiclesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const { vehicles, loading: isLoading, error } = useVehicles();
  const { deleteVehicle } = useVehicleOperations();
  const [sortField, setSortField] = useState<SortField>('vehicleDescriptor');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [activeFilters, setActiveFilters] = useState(0);
  const [filters, setFilters] = useState<{
    status?: VehicleStatus;
    source?: 'Jay' | 'Avis';
    maintenance?: 'needsOilChange' | 'registrationExpired';
  }>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<VehicleStatus | null>(null);
  const [newMileage, setNewMileage] = useState<number | null>(null);
  const [isOilChange, setIsOilChange] = useState(false);
  const [maintenanceNote, setMaintenanceNote] = useState('');
  const [isSortExpanded, setIsSortExpanded] = useState(false);

  const getOilChangeStatus = (currentMileage: number | null, milesUntilOilChange: number | null) => {
    if (!currentMileage || !milesUntilOilChange) return null;
    
    // Show status if due soon (within 500 miles) or due/overdue
    if (milesUntilOilChange <= 500) {
      if (milesUntilOilChange <= 0) {
        return {
          variant: 'error' as const,
          message: `Oil change overdue by ${Math.abs(milesUntilOilChange).toLocaleString()} miles`
        };
      }
      return {
        variant: 'warning' as const,
        message: `Oil change due in ${milesUntilOilChange.toLocaleString()} miles`
      };
    }
    return null;
  };

  const handleAddSuccess = () => {
    setShowAddModal(false);
  };

  const handleStatusChange = async () => {
    if (!selectedVehicle || !newStatus || newMileage === null) return;
    
    try {
      await updateDoc(doc(db, 'vehicles', selectedVehicle.id), {
        status: newStatus,
        currentMileage: newMileage,
        updatedAt: serverTimestamp()
      });
      
      // If oil change is checked, add it to maintenance history
      if (isOilChange) {
        const maintenanceRecord: MaintenanceRecord = {
          type: 'oil_change',
          date: Timestamp.now(),
          mileage: newMileage,
          note: maintenanceNote || undefined,
          userId: user?.uid || '',
          userName: user?.displayName || 'Unknown User'
        };
        
        await updateDoc(doc(db, 'vehicles', selectedVehicle.id), {
          maintenanceHistory: arrayUnion(maintenanceRecord),
          milesUntilOilChange: 5000, // Reset miles until next oil change
          updatedAt: serverTimestamp()
        });
      }
      
      toast.success('Status updated successfully');
      setShowStatusModal(false);
      setNewStatus(null);
      setNewMileage(null);
      setIsOilChange(false);
      setMaintenanceNote('');
      setSelectedVehicle(null);
      } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleCloseModal = () => {
    setShowStatusModal(false);
    setNewStatus(null);
    setNewMileage(null);
    setIsOilChange(false);
    setMaintenanceNote('');
    setSelectedVehicle(null);
  };

  const handleDelete = async (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDeleteConfirm(true);
  };

  const handleStatusClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowStatusModal(true);
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Debug: Log vehicles and filters before filtering
  console.log('vehicles:', vehicles, 'filters:', filters);
  const filteredAndSortedVehicles = vehicles
    .filter(vehicle => {
      if (filters.status && vehicle.status !== filters.status) return false;
      if (filters.source && vehicle.source !== filters.source) return false;
      if (filters.maintenance) {
        if (filters.maintenance === 'needsOilChange') {
          // More comprehensive check for oil change status
          const oilChangeStatus = getOilChangeStatus(
            vehicle.currentMileage || null, 
            vehicle.milesUntilOilChange || null
          );
          return oilChangeStatus !== null;
        }
        if (filters.maintenance === 'registrationExpired' && 
            (!vehicle.registrationExpiration || 
             vehicle.registrationExpiration.toDate() > new Date())) return false;
      }
      return true;
    })
    .sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    switch (sortField) {
      case 'vehicleDescriptor':
        return direction * a.vehicleDescriptor.localeCompare(b.vehicleDescriptor);
      case 'status':
        return direction * a.status.localeCompare(b.status);
      case 'color':
        return direction * ((a.color || '').localeCompare(b.color || ''));
      case 'licensePlate':
        return direction * ((a.licensePlate || '').localeCompare(b.licensePlate || ''));
      case 'currentMileage':
        return direction * ((a.currentMileage || 0) - (b.currentMileage || 0));
      case 'milesUntilOilChange':
        return direction * ((a.milesUntilOilChange || 0) - (b.milesUntilOilChange || 0));
      case 'registrationExpiration':
        return direction * ((a.registrationExpiration?.toDate().getTime() || 0) - (b.registrationExpiration?.toDate().getTime() || 0));
      case 'source':
        return direction * ((a.source || '').localeCompare(b.source || ''));
      case 'mvaNumber':
        return direction * ((a.mvaNumber || '').localeCompare(b.mvaNumber || ''));
      default:
        return 0;
    }
  });

  const handleFilterChange = (field: FilterField, value: VehicleStatus | 'Jay' | 'Avis' | 'needsOilChange' | 'registrationExpired' | undefined) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (value === undefined) {
        delete newFilters[field];
      } else if (field === 'status') {
        newFilters.status = value as VehicleStatus;
      } else if (field === 'source') {
        newFilters.source = value as 'Jay' | 'Avis';
      } else if (field === 'maintenance') {
        newFilters.maintenance = value as 'needsOilChange' | 'registrationExpired';
      }
      return newFilters;
    });
  };

  useEffect(() => {
    setActiveFilters(Object.keys(filters).length);
  }, [filters]);

  useEffect(() => {
    // Read filter and value from query params on initial load
    const filter = searchParams.get('filter');
    const value = searchParams.get('value');
    if (filter && value) {
      handleFilterChange(filter as FilterField, value as any);
      setShowFilterModal(true); // Optionally open the filter modal
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <PageLayout title="Vehicles">
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Vehicles">
      <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
        <p className={getTypographyClass('body')}>
          Error loading vehicles: {error instanceof Error ? error.message : String(error)}
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

  const getStatusVariant = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.Available:
        return 'success';
      case VehicleStatus.Maintenance:
      case VehicleStatus.Prospecting:
        return 'warning';
      case VehicleStatus.WithCustomer:
      case VehicleStatus.Unavailable:
      case VehicleStatus.Archived:
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <PageLayout 
      title="Vehicles"
      headerContent={
        <PageHeader>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className={getTypographyClass('body')}>Add Vehicle</span>
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
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] flex flex-col shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className={getTypographyClass('header')}>Filter Vehicles</h2>
              <Button
                variant="ghost"
                onClick={() => setShowFilterModal(false)}
                className="h-8 w-8 p-0 flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-grow space-y-6 pr-2">
              {/* Filter Section */}
              <div>
                <h3 className={getTypographyClass('body')}>Filter By</h3>
                <div className="space-y-4 mt-2">
                  {/* Status Filter */}
                  <div>
                    <label className={getTypographyClass('body')}>Status</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {Object.values(VehicleStatus).map((status) => (
                        <Button
                          key={status}
                          variant={filters.status === status ? 'default' : 'outline'}
                          onClick={() => handleFilterChange('status', filters.status === status ? undefined : status)}
                          className="flex-1 flex items-center justify-center"
                        >
                          <span className={getTypographyClass('body')}>{status}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Source Filter */}
                  <div>
                    <label className={getTypographyClass('body')}>Source</label>
                    <div className="flex gap-2 mt-1">
                      <Button
                        variant={filters.source === 'Jay' ? 'default' : 'outline'}
                        onClick={() => handleFilterChange('source', filters.source === 'Jay' ? undefined : 'Jay')}
                        className="flex-1 flex items-center justify-center"
                      >
                        <span className={getTypographyClass('body')}>Jay</span>
                      </Button>
                      <Button
                        variant={filters.source === 'Avis' ? 'default' : 'outline'}
                        onClick={() => handleFilterChange('source', filters.source === 'Avis' ? undefined : 'Avis')}
                        className="flex-1 flex items-center justify-center"
                      >
                        <span className={getTypographyClass('body')}>Avis</span>
                      </Button>
                    </div>
                  </div>

                  {/* Maintenance Filter */}
                  <div>
                    <label className={getTypographyClass('body')}>Maintenance</label>
                    <div className="flex gap-2 mt-1">
                      <Button
                        variant={filters.maintenance === 'needsOilChange' ? 'default' : 'outline'}
                        onClick={() => handleFilterChange('maintenance', filters.maintenance === 'needsOilChange' ? undefined : 'needsOilChange')}
                        className="flex-1 flex items-center justify-center"
                      >
                        <span className={getTypographyClass('body')}>Needs Oil Change</span>
                      </Button>
                      <Button
                        variant={filters.maintenance === 'registrationExpired' ? 'default' : 'outline'}
                        onClick={() => handleFilterChange('maintenance', filters.maintenance === 'registrationExpired' ? undefined : 'registrationExpired')}
                        className="flex-1 flex items-center justify-center"
                      >
                        <span className={getTypographyClass('body')}>Registration Expired</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sort Section with Collapse */}
              <div>
                <button 
                  onClick={() => setIsSortExpanded(!isSortExpanded)}
                  className="w-full flex items-center justify-between py-2 border-t border-b border-gray-200 dark:border-gray-700"
                >
                  <h3 className={getTypographyClass('body')}>Sort By</h3>
                  {isSortExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                
                {isSortExpanded && (
                  <div className="space-y-2 mt-2">
                    {([
                      'vehicleDescriptor',
                      'color',
                      'licensePlate',
                      'currentMileage',
                      'milesUntilOilChange',
                      'registrationExpiration',
                      'source',
                      'status',
                      'mvaNumber'
                    ] as SortField[]).map((field) => (
                      <Button
                        key={field}
                        variant={sortField === field ? 'default' : 'outline'}
                        onClick={() => handleSort(field)}
                        className="w-full flex items-center justify-between"
                      >
                        <span className={getTypographyClass('body')}>
                          {field === 'vehicleDescriptor' ? 'Vehicle' :
                           field === 'licensePlate' ? 'License Plate' :
                           field === 'currentMileage' ? 'Mileage' :
                           field === 'milesUntilOilChange' ? 'Oil Change' :
                           field === 'registrationExpiration' ? 'Registration' :
                           field === 'mvaNumber' ? 'MVA #' :
                           field.charAt(0).toUpperCase() + field.slice(1)}
                        </span>
                        <SortIcon field={field} />
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex justify-end gap-2 mt-6 border-t pt-4 border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => {
                  setSortField('vehicleDescriptor');
                  setSortDirection('asc');
                  setFilters({});
                  setActiveFilters(0);
                  setIsSortExpanded(false);
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
                    onClick={() => handleSort('vehicleDescriptor')}
                    className="flex items-center"
                  >
                    <span className={getTypographyClass('body')}>Vehicle</span>
                    <SortIcon field="vehicleDescriptor" />
                  </Button>
                </DataTableHeaderCell>
                <DataTableHeaderCell>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('color')}
                    className="flex items-center"
                  >
                    <span className={getTypographyClass('body')}>Color</span>
                    <SortIcon field="color" />
                  </Button>
                </DataTableHeaderCell>
                <DataTableHeaderCell>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('licensePlate')}
                    className="flex items-center"
                  >
                    <span className={getTypographyClass('body')}>License Plate</span>
                    <SortIcon field="licensePlate" />
                  </Button>
                </DataTableHeaderCell>
                <DataTableHeaderCell>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('currentMileage')}
                    className="flex items-center"
                  >
                    <span className={getTypographyClass('body')}>Mileage</span>
                    <SortIcon field="currentMileage" />
                  </Button>
                </DataTableHeaderCell>
                <DataTableHeaderCell>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('milesUntilOilChange')}
                    className="flex items-center"
                  >
                    <span className={getTypographyClass('body')}>Oil Change</span>
                    <SortIcon field="milesUntilOilChange" />
                  </Button>
                </DataTableHeaderCell>
                <DataTableHeaderCell>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('registrationExpiration')}
                    className="flex items-center"
                  >
                    <span className={getTypographyClass('body')}>Registration</span>
                    <SortIcon field="registrationExpiration" />
                  </Button>
                </DataTableHeaderCell>
                <DataTableHeaderCell>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('source')}
                    className="flex items-center"
                  >
                    <span className={getTypographyClass('body')}>Source</span>
                    <SortIcon field="source" />
                  </Button>
                </DataTableHeaderCell>
                <DataTableHeaderCell>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('mvaNumber')}
                    className="flex items-center"
                  >
                    <span className={getTypographyClass('body')}>MVA #</span>
                    <SortIcon field="mvaNumber" />
                  </Button>
                </DataTableHeaderCell>
                <DataTableHeaderCell sticky className="w-[200px]">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('status')}
                      className="flex items-center"
                    >
                      <span className={getTypographyClass('body')}>Status</span>
                      <SortIcon field="status" />
                    </Button>
                  <span className={getTypographyClass('body')}>Actions</span>
                  </div>
                </DataTableHeaderCell>
              </tr>
            </DataTableHeader>
            <DataTableBody>
            {filteredAndSortedVehicles.map((vehicle) => (
              <DataTableRow 
                key={vehicle.id}
                onClick={() => router.push(`/vehicles/${vehicle.id}`)}
                className="cursor-pointer"
              >
                <DataTableCell>
                    <span className={getTypographyClass('body')}>{vehicle.vehicleDescriptor}</span>
                  </DataTableCell>
                  <DataTableCell>
                  <span className={getTypographyClass('body')}>{vehicle.color || '-'}</span>
                  </DataTableCell>
                  <DataTableCell>
                  <span className={getTypographyClass('body')}>{vehicle.licensePlate || '-'}</span>
                  </DataTableCell>
                  <DataTableCell>
                  <span className={getTypographyClass('body')}>{vehicle.currentMileage?.toLocaleString() || '-'}</span>
                  </DataTableCell>
                  <DataTableCell>
                    <span className={getTypographyClass('body')}>
                      {vehicle.milesUntilOilChange !== undefined ? (
                        <Badge
                          variant={
                            vehicle.milesUntilOilChange <= 0
                              ? 'error'
                              : vehicle.milesUntilOilChange <= 500
                              ? 'warning'
                              : 'success'
                          }
                        >
                          {vehicle.milesUntilOilChange <= 0
                            ? 'Overdue'
                            : `${vehicle.milesUntilOilChange.toLocaleString()} miles`}
                        </Badge>
                      ) : (
                        '-'
                      )}
                    </span>
                  </DataTableCell>
                  <DataTableCell>
                    <span className={getTypographyClass('body')}>
                      {vehicle.registrationExpiration ? vehicle.registrationExpiration.toDate().toLocaleDateString() : '-'}
                    </span>
                  </DataTableCell>
                <DataTableCell>
                  <span className={getTypographyClass('body')}>{vehicle.source || '-'}</span>
                </DataTableCell>
                <DataTableCell>
                  <span className={getTypographyClass('body')}>
                    {vehicle.source === 'Avis' ? (vehicle.mvaNumber || '-') : '-'}
                  </span>
                </DataTableCell>
                <DataTableCell sticky className="w-[200px]">
                  <div className="flex items-center justify-between gap-4">
                    <Badge variant={getStatusVariant(vehicle.status)}>
                      {vehicle.status === VehicleStatus.Prospecting && vehicle.statusHistory && vehicle.statusHistory.length > 0 ? (
                        <div className="flex items-center gap-1">
                          <span>Prospecting</span>
                          <span className="text-xs opacity-75">by {vehicle.statusHistory[vehicle.statusHistory.length - 1].userName}</span>
                        </div>
                      ) : (
                        vehicle.status
                      )}
                    </Badge>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu
                        trigger={
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        }
                      >
                        <div 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => handleStatusClick(vehicle)}
                        >
                          <Settings2 className="h-4 w-4 mr-2" />
                          Change Status
                        </div>
                        {isAdmin && (
                          <div 
                            className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer"
                            onClick={() => handleDelete(vehicle)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Vehicle
                          </div>
                        )}
                      </DropdownMenu>
                    </div>
                  </div>
                </DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>
        </DataTable>
      </div>

      {/* Mobile View - List Report */}
      <div className="md:hidden">
        {filteredAndSortedVehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            onClick={() => router.push(`/vehicles/${vehicle.id}`)}
            className="bg-transparent border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="px-4 py-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>
                    {vehicle.vehicleDescriptor}
                  </h3>
                  <p className={getTypographyClass('body')} style={{ margin: 0 }}>
                    {vehicle.licensePlate || 'No License Plate'}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{vehicle.color || 'No Color'}</span>
                    {vehicle.currentMileage && (
                      <>
                        <span>•</span>
                        <span>{vehicle.currentMileage.toLocaleString()} mi</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                  <Badge variant={getStatusVariant(vehicle.status)}>
                    {vehicle.status === VehicleStatus.Prospecting && vehicle.statusHistory && vehicle.statusHistory.length > 0 ? (
                      <div className="flex items-center gap-1">
                        <span>Prospecting</span>
                        <span className="text-xs opacity-75">by {vehicle.statusHistory[vehicle.statusHistory.length - 1].userName}</span>
                      </div>
                    ) : (
                      vehicle.status
                    )}
                  </Badge>
                    {vehicle.milesUntilOilChange !== undefined && vehicle.milesUntilOilChange <= 500 && (
                        <Badge
                          variant={
                            vehicle.milesUntilOilChange <= 0
                              ? 'error'
                            : 'warning'
                          }
                        >
                          {vehicle.milesUntilOilChange <= 0
                          ? 'Oil Change Overdue'
                          : `${vehicle.milesUntilOilChange.toLocaleString()} miles until oil change`}
                        </Badge>
                      )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusClick(vehicle);
                      }}
                    >
                      <span className="sr-only">Change status</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  {isAdmin && (
                    <Button 
                      variant="ghost" 
                      className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(vehicle);
                      }}
                    >
                      <span className="sr-only">Delete vehicle</span>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddVehicleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Vehicle</DialogTitle>
          </DialogHeader>
          <div className="p-3">
            <p className={getTypographyClass('body')}>
              Are you sure you want to delete {selectedVehicle?.vehicleDescriptor}? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (!selectedVehicle) return;
                setIsDeleting(true);
                try {
                  await deleteVehicle(selectedVehicle.id);
                  toast.success('Vehicle deleted successfully');
                  setShowDeleteConfirm(false);
                } catch (error) {
                  console.error('Error deleting vehicle:', error);
                  toast.error('Failed to delete vehicle');
                } finally {
                  setIsDeleting(false);
                }
              }}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showStatusModal} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Vehicle Status</DialogTitle>
          </DialogHeader>
          
          <form className="p-3 space-y-6">
            <div className="space-y-4">
              <div>
                <Label>New Status</Label>
                <Select value={newStatus || ''} onValueChange={(value) => setNewStatus(value as VehicleStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(VehicleStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Current Mileage: {selectedVehicle?.currentMileage?.toLocaleString() || 'Not set'}
                </div>
                <Input
                  type="number"
                  value={newMileage || ''}
                  onChange={(e) => setNewMileage(Number(e.target.value))}
                  placeholder="Enter new mileage"
                  min={0}
                />
              </div>

              {newStatus === VehicleStatus.Maintenance && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="oilChange"
                      checked={isOilChange}
                      onCheckedChange={(checked) => setIsOilChange(checked as boolean)}
                    />
                    <Label htmlFor="oilChange">Oil Change Performed</Label>
                  </div>
                  <div>
                    <Label>Maintenance Note</Label>
                    <Textarea
                      value={maintenanceNote}
                      onChange={(e) => setMaintenanceNote(e.target.value)}
                      placeholder="Add any notes about the maintenance..."
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button 
                variant="primary"
                onClick={handleStatusChange}
                disabled={!newStatus || newMileage === null}
              >
                Update Status
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
} 