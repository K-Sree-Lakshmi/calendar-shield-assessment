import React, { createContext, useContext, useState } from 'react';

// Create the context
const DataContext = createContext();

// Custom hook to use the context
export const useData = () => {
  const context = useContext(DataContext);
  if (context) {
    return context;
  } else {
    throw new Error('useData must be used within a DataProvider');
  }
};

// Provider component
export const DataProvider = ({ children }) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateTableData = (data) => {
    setTableData(data);
  };

  const setLoadingState = (isLoading) => {
    setLoading(isLoading);
  };

  const setErrorState = (errorMessage) => {
    setError(errorMessage);
  };

  const clearData = () => {
    setTableData([]);
    setError(null);
  };

  const value = {
    tableData,
    loading,
    error,
    updateTableData,
    setLoadingState,
    setErrorState,
    clearData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}; 