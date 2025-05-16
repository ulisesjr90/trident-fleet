'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CustomerCard } from '@/components/customers/CustomerCard';
import { Button } from '@/components/ui/Button';
import { Plus, Users, Share2, Trash2 } from 'lucide-react';
import { Toast, ToastType } from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';
import { AddCustomerModal } from '@/components/customers/AddCustomerModal';
import { ShareCustomerModal } from '@/components/customers/ShareCustomerModal';
import { MobileLayout } from '@/components/layout/MobileLayout';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  assignedVehicles?: number;
  primaryOwnerId: string;
}

export default function CustomersPage() {
  const { data: session, status } = useSession();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('error');
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const router = useRouter();

  // Debug logging
  useEffect(() => {
    console.log('Session:', session);
    console.log('Status:', status);
    console.log('Loading:', loading);
    console.log('Customers:', customers);
  }, [session, status, loading, customers]);

  // Fetch customers when session is ready
  useEffect(() => {
    const fetchCustomers = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const customersRef = collection(db, 'customers');
        const q = query(customersRef, where('primaryOwnerId', '==', session.user.id));
        const snapshot = await getDocs(q);
        const customersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Customer[];
        
        setCustomers(customersData);
        setError(null);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError('Failed to load customers');
        showErrorToast('Failed to load customers');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchCustomers();
    } else if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, session?.user?.id]);

  const handleAddCustomer = () => {
    if (!session?.user?.id) {
      showErrorToast('Please sign in to add customers');
      return;
    }
    setShowAddCustomerModal(true);
  };

  const handleCustomerClick = (customer: Customer) => {
    router.push(`/customers/${customer.id}`);
  };

  const handleShareCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowShareModal(true);
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    if (!session?.user?.id) {
      showErrorToast('Please sign in to delete customers');
      return;
    }

    if (customer.primaryOwnerId !== session.user.id) {
      showErrorToast('You can only delete customers you own');
      return;
    }

    if (customer.assignedVehicles && customer.assignedVehicles > 0) {
      showErrorToast('Cannot delete customer with assigned vehicles');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${customer.name}?`)) {
      return;
    }

    try {
      const customerRef = doc(db, 'customers', customer.id);
      await deleteDoc(customerRef);
      
      setCustomers(customers.filter(c => c.id !== customer.id));
      showSuccessToast('Customer deleted successfully');
    } catch (err) {
      console.error('Error deleting customer:', err);
      showErrorToast('Failed to delete customer');
    }
  };

  const showErrorToast = (message: string) => {
    setToastMessage(message);
    setToastType('error');
    setShowToast(true);
  };

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setToastType('success');
    setShowToast(true);
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <MobileLayout
      header={{ title: 'Customers', showBackButton: false }}
      userRole={session?.user?.role}
      currentPath="/customers"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Customers</h1>
          <Button onClick={handleAddCustomer}>
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="max-w-md mx-auto">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                  <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">No Customers Yet</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Start managing your customer relationships by adding your first customer. Here's how:
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                <ol className="text-left space-y-6">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mr-4">1</span>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">Add a New Customer</span>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Customer
                        </Button>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">Click the button in the top right corner to start</p>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mr-4">2</span>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">Enter Customer Details</span>
                        <div className="flex gap-2">
                          <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-600 dark:text-gray-300">Name</div>
                          <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-600 dark:text-gray-300">Email</div>
                          <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-600 dark:text-gray-300">Phone</div>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">Fill in the customer's basic information</p>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mr-4">3</span>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">Share with Team</span>
                        <Button variant="accent">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">Share customers with team members so they can check vehicles in and out</p>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mr-4">4</span>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">Manage Customers</span>
                        <Button variant="danger">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">Click the trash icon to delete a customer (only if they have no assigned vehicles)</p>
                    </div>
                  </li>
                </ol>
              </div>

              <Button onClick={handleAddCustomer}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Customer
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {customers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onClick={() => handleCustomerClick(customer)}
                onShare={() => handleShareCustomer(customer)}
                onDelete={() => handleDeleteCustomer(customer)}
                isOwner={customer.primaryOwnerId === session?.user?.id}
              />
            ))}
          </div>
        )}

        {showToast && (
          <Toast
            message={toastMessage}
            type={toastType}
            onClose={() => setShowToast(false)}
          />
        )}

        {showAddCustomerModal && (
          <AddCustomerModal
            onClose={() => setShowAddCustomerModal(false)}
            onSuccess={(customer) => {
              setCustomers([...customers, customer]);
              showSuccessToast('Customer added successfully');
              setShowAddCustomerModal(false);
            }}
          />
        )}

        {showShareModal && selectedCustomer && (
          <ShareCustomerModal
            customer={selectedCustomer}
            onClose={() => {
              setShowShareModal(false);
              setSelectedCustomer(null);
            }}
            onSuccess={() => {
              showSuccessToast('Customer shared successfully');
              setShowShareModal(false);
              setSelectedCustomer(null);
            }}
          />
        )}
      </div>
    </MobileLayout>
  );
} 