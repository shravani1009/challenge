import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Layout, User, Settings, Bell, Pencil, Trash2, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePersons } from '../hooks/usePersons';
import { Modal } from '../components/Modal';
import { PersonForm } from '../components/PersonForm';
import { Person, PersonInput } from '../types/Person';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export function DashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { persons, loading, fetchPersons, addPerson, updatePerson, deletePerson } = usePersons();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  useEffect(() => {
    fetchPersons();
  }, [fetchPersons]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAdd = async (data: PersonInput) => {
    try {
      await addPerson(data);
      toast.success('Person added successfully');
      setModalOpen(false);
    } catch (error) {
      toast.error('Failed to add person');
    }
  };

  const handleEdit = async (data: PersonInput) => {
    if (!selectedPerson) return;
    try {
      await updatePerson(selectedPerson.id, data);
      toast.success('Person updated successfully');
      setModalOpen(false);
      setSelectedPerson(null);
    } catch (error) {
      toast.error('Failed to update person');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      try {
        await deletePerson(id);
        toast.success('Person deleted successfully');
      } catch (error) {
        toast.error('Failed to delete person');
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <nav className="bg-white shadow-sm border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Layout className="h-6 w-6 text-black" />
              <h1 className="ml-3 text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded-lg">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded-lg">
                <Settings className="h-5 w-5" />
              </button>
              <div className="h-8 w-px bg-zinc-200" />
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h2 className="text-xl font-semibold text-gray-900">People</h2>
              <p className="mt-2 text-sm text-gray-700">
                A list of all people including their name, age, and date of birth.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                onClick={() => {
                  setSelectedPerson(null);
                  setModalOpen(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Person
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle">
                <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Name
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Age
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Date of Birth
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {loading ? (
                        <tr>
                          <td colSpan={4} className="px-3 py-4 text-sm text-gray-500">
                            <div className="flex justify-center">
                              <Loader2 className="h-6 w-6 animate-spin text-black" />
                            </div>
                          </td>
                        </tr>
                      ) : (
                        persons.map((person) => (
                          <tr key={person.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {person.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {person.age}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {format(new Date(person.dateOfBirth), 'PP')}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button
                                onClick={() => {
                                  setSelectedPerson(person);
                                  setModalOpen(true);
                                }}
                                className="text-gray-400 hover:text-gray-900 mr-4"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(person.id)}
                                className="text-gray-400 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedPerson(null);
        }}
        title={selectedPerson ? 'Edit Person' : 'Add Person'}
      >
        <PersonForm
          onSubmit={selectedPerson ? handleEdit : handleAdd}
          initialData={selectedPerson ? {
            name: selectedPerson.name,
            dateOfBirth: selectedPerson.dateOfBirth,
          } : undefined}
          onCancel={() => {
            setModalOpen(false);
            setSelectedPerson(null);
          }}
        />
      </Modal>
    </div>
  );
}