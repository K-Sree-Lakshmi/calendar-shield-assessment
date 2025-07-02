import React from 'react';
import './App.css';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Calendar from './components/Calendar/Calendar';
import Table from './components/Table/Table';
import { DataProvider } from './context/DataContext';

function App() {
  return (
    <DataProvider>
      <div className="main-container">
        <Calendar />
        <Table />
      </div>
    </DataProvider>
  );
}

export default App;
