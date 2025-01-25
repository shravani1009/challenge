import { useState, useCallback } from 'react';
import { differenceInYears, parseISO } from 'date-fns';
import { Person, PersonInput } from '../types/Person';

// Simulated backend delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate initial data
const generateInitialData = (): Person[] => {
  return Array.from({ length: 20 }, (_, i) => {
    const year = 1970 + Math.floor(Math.random() * 30);
    const month = 1 + Math.floor(Math.random() * 12);
    const day = 1 + Math.floor(Math.random() * 28);
    const dateOfBirth = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    return {
      id: `person-${i + 1}`,
      name: `Person ${i + 1}`,
      dateOfBirth,
      age: differenceInYears(new Date(), parseISO(dateOfBirth))
    };
  });
};

export function usePersons() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPersons = useCallback(async () => {
    setLoading(true);
    try {
      await delay(1000); // Simulate API call
      const data = generateInitialData();
      setPersons(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const addPerson = useCallback(async (input: PersonInput) => {
    setLoading(true);
    try {
      await delay(500); // Simulate API call
      const newPerson: Person = {
        id: `person-${Date.now()}`,
        ...input,
        age: differenceInYears(new Date(), parseISO(input.dateOfBirth))
      };
      setPersons(prev => [...prev, newPerson]);
      return newPerson;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePerson = useCallback(async (id: string, input: PersonInput) => {
    setLoading(true);
    try {
      await delay(500); // Simulate API call
      const updatedPerson: Person = {
        id,
        ...input,
        age: differenceInYears(new Date(), parseISO(input.dateOfBirth))
      };
      setPersons(prev => prev.map(p => p.id === id ? updatedPerson : p));
      return updatedPerson;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePerson = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await delay(500); // Simulate API call
      setPersons(prev => prev.filter(p => p.id !== id));
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    persons,
    loading,
    fetchPersons,
    addPerson,
    updatePerson,
    deletePerson
  };
}