import React, { createContext, useContext, useState, useEffect } from 'react';

const LeadContext = createContext();

export const useLeads = () => useContext(LeadContext);

export const LeadProvider = ({ children }) => {
  // Load saved leads from your browser's local memory, or start with an empty array
  const [leads, setLeads] = useState(() => {
    const savedLeads = localStorage.getItem('atlas_leads');
    return savedLeads ? JSON.parse(savedLeads) : [];
  });

  // Auto-save to memory whenever leads are added or updated
  useEffect(() => {
    localStorage.setItem('atlas_leads', JSON.stringify(leads));
  }, [leads]);

  // Function to add a new lead from the LeadManagement page
  const addLead = (newLead) => {
    setLeads((prev) => [
      ...prev, 
      // 🚨 FIX APPLIED: Base defaults go first, so your form data (...newLead) can safely override them!
      { id: Date.now(), status: 'New', ...newLead } 
    ]);
  };

  // Function to change a lead's status (e.g., New -> Qualified -> Confirmed)
  const updateLeadStatus = (id, newStatus) => {
    setLeads((prev) => 
      prev.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead)
    );
  };

  return (
    <LeadContext.Provider value={{ leads, addLead, updateLeadStatus }}>
      {children}
    </LeadContext.Provider>
  );
};