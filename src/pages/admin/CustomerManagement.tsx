import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, updateUser, register, User, UpdateUserData, RegisterData } from '@/services/userService'; // Import register and RegisterData
// Assuming UI components exist, e.g., Table, Button
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input'; // Assuming Input component exists

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<User | null>(null);
  const [editFormState, setEditFormState] = useState<UpdateUserData>({}); // State for edit form
  const [isCreating, setIsCreating] = useState<boolean>(false); // State for create form visibility
  const [createFormState, setCreateFormState] = useState<RegisterData>({ // State for create form
    email: '',
    password: '',
    fullName: '',
    phone: '',
    role: 'client', // Default role
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        // Use the imported getAllUsers function
        const data = await getAllUsers(); 
        // Filter for customers if needed, or assume endpoint returns only customers
        // TODO: Add filtering if endpoint returns admins/staff too
        setCustomers(data); 
        setError(null);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
        setError("Failed to load customer data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleEdit = (customer: User) => {
    console.log(`Editing customer ${customer.id}`);
    setEditingCustomer(customer);
    // Initialize form state with current customer data
    setEditFormState({ 
      fullName: customer.fullName, 
      email: customer.email,
      // Initialize other fields as needed
    });
    setIsEditing(true);
    setError(null); // Clear errors when starting edit
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingCustomer(null);
    setEditFormState({}); // Clear edit form state on cancel
  };

  // Handle changes in the edit form inputs
  const handleEditFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setEditFormState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdateCustomer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingCustomer) return;

    console.log(`Submitting update for customer ${editingCustomer.id} with data:`, editFormState);
    
    try {
      // Only send fields that have actually changed? Or send all? API might handle this.
      // Sending all fields from editFormState for simplicity here.
      const updatedUser = await updateUser(editingCustomer.id, editFormState);
      // Update the customer list in the state
      setCustomers(customers.map(c => c.id === updatedUser.id ? updatedUser : c));
      handleCancelEdit(); // Close edit form on success
    } catch (err) {
      console.error("Failed to update customer:", err);
      setError(`Failed to update customer ${editingCustomer.fullName}. Please try again.`);
      // Optionally keep the form open on error? Or close it? Closing for now.
      // handleCancelEdit(); 
    }
  };

  const handleDelete = async (customerId: string) => {
    // Add a confirmation dialog before deleting
    if (window.confirm(`Are you sure you want to delete customer ${customerId}?`)) {
      console.log(`Attempting to delete customer ${customerId}`);
      try {
        await deleteUser(customerId); // Use imported deleteUser
        // Update the state to remove the deleted customer
        setCustomers(customers.filter(c => c.id !== customerId));
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Failed to delete customer:", err);
        setError(`Failed to delete customer ${customerId}. Please try again.`);
      }
    } else {
      console.log(`Deletion cancelled for customer ${customerId}`);
    }
  };

  const handleAddCustomer = () => {
    console.log("Add new customer clicked");
    setIsCreating(true); // Show the create form
    setError(null); // Clear errors
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setCreateFormState({ email: '', password: '', fullName: '', phone: '', role: 'client' }); // Reset create form
  };

  // Handle changes in the create form inputs
  const handleCreateFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setCreateFormState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle submission of the create form
  const handleCreateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Submitting new customer:", createFormState);
    try {
      // Assuming 'register' can be used by admin to create users
      // The response might contain user and token, we only need user here
      const { user: newUser } = await register(createFormState); 
      setCustomers([...customers, newUser]); // Add new customer to the list
      handleCancelCreate(); // Close the form on success
    } catch (err) {
      console.error("Failed to create customer:", err);
      setError("Failed to create customer. Please check the details and try again.");
      // Keep the form open on error
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading customers...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {isCreating ? (
        // Create Customer Form
        <div>
          <h2 className="text-2xl font-bold mb-4">Add New Customer</h2>
          <form onSubmit={handleCreateSubmit}>
            {/* TODO: Use actual Input/Select components */}
            <div className="mb-4">
              <label htmlFor="createFullName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" id="createFullName" name="fullName" value={createFormState.fullName} onChange={handleCreateFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" aria-label="Full Name"/>
            </div>
            <div className="mb-4">
              <label htmlFor="createEmail" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="createEmail" name="email" value={createFormState.email} onChange={handleCreateFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" aria-label="Email"/>
            </div>
            <div className="mb-4">
              <label htmlFor="createPassword" className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" id="createPassword" name="password" value={createFormState.password} onChange={handleCreateFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" aria-label="Password"/>
            </div>
             <div className="mb-4">
              <label htmlFor="createPhone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input type="tel" id="createPhone" name="phone" value={createFormState.phone} onChange={handleCreateFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" aria-label="Phone"/>
            </div>
             <div className="mb-4">
              <label htmlFor="createRole" className="block text-sm font-medium text-gray-700">Role</label>
              <select id="createRole" name="role" value={createFormState.role} onChange={handleCreateFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" aria-label="Role">
                <option value="client">Client</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button type="button" onClick={handleCancelCreate} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Create Customer</button>
            </div>
          </form>
        </div>
      ) : isEditing && editingCustomer ? (
        // Edit Customer Form
        <div>
          <h2 className="text-2xl font-bold mb-4">Edit Customer: {editingCustomer.fullName}</h2>
          <form onSubmit={handleUpdateCustomer}>
            {/* TODO: Add actual form fields using Input components */}
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input 
                type="text" 
                id="fullName"
                name="fullName" // Add name attribute
                value={editFormState.fullName || ''} // Use controlled value
                onChange={handleEditFormChange} // Handle change
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                aria-label="Full Name" 
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                id="email"
                name="email" // Add name attribute
                value={editFormState.email || ''} // Use controlled value
                onChange={handleEditFormChange} // Handle change
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                aria-label="Email" 
              />
            </div>
            {/* Add other fields as needed (phone, role, status) */}
            
            <div className="flex justify-end space-x-3">
              <button 
                type="button" 
                onClick={handleCancelEdit}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      ) : (
        // Customer List View
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Customer Management</h1>
            {/* Placeholder for actual Button component */}
            <button 
              onClick={handleAddCustomer}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Customer
            </button>
          </div>
          
          {/* Placeholder for actual Table component */}
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.length > 0 ? (
                  customers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.fullName}</td> {/* Use fullName */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {/* Placeholder for actual Button components */}
                        <button 
                          onClick={() => handleEdit(customer)} 
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(customer.id)} 
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No customers found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Create functionality placeholder added via button */}
        </>
      )}
    </div>
  );
}
