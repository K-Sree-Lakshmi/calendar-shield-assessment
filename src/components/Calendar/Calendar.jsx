import React,{useState} from "react";
import { addDays, format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { DateRangePicker } from 'react-date-range';
import { fetchDataByDateRange } from '../../services/apiService';
import { useData } from '../../context/DataContext';
import './Calendar.css';

const timeZones = [
  { label: "Eastern Time (UTC-5/-4) - New York", value: "America/New_York" },
  { label: "Pacific Time (UTC-8/-7) - Los Angeles", value: "America/Los_Angeles" },
  { label: "Greenwich Mean Time (UTC+0/+1) - London", value: "Europe/London" },
  { label: "Central European Time (UTC+1/+2) - Berlin", value: "Europe/Berlin" },
  { label: "Moscow Standard Time (UTC+3) - Moscow", value: "Europe/Moscow" },
  { label: "Gulf Standard Time (UTC+4) - Dubai", value: "Asia/Dubai" },
  { label: "India Standard Time (UTC+5:30) - Mumbai", value: "Asia/Kolkata" },
  { label: "China Standard Time (UTC+8) - Beijing", value: "Asia/Shanghai" },
  { label: "Japan Standard Time (UTC+9) - Tokyo", value: "Asia/Tokyo" },
  { label: "Australian Eastern Time (UTC+10/+11) - Sydney", value: "Australia/Sydney" }
];

// Predefined messages and status for specific dates
const dateMessages = {
  '2025-08-01': { message: 'State Holiday', disabled: true, type: 'holiday' },
  '2025-08-15': { message: 'Independence Day', disabled: true, type: 'holiday' },
  '2025-09-10': { message: 'Quarterly Team Meeting', disabled: false, type: 'meeting' },
  '2025-09-15': { message: 'System Maintenance Window', disabled: true, type: 'maintenance' },
  '2025-07-20': { message: 'Project Alpha Deadline', disabled: false, type: 'deadline' },
  '2025-10-25': { message: 'Company Picnic', disabled: false, type: 'event' },
  '2025-07-31': { message: 'Monthly Review Meeting', disabled: false, type: 'meeting' },
};

const Calendar = () => {
    const [dateRange, setDateRange] = useState([
        {
          startDate: new Date(),
          endDate: addDays(new Date(), 7),
          key: 'selection'
        }
      ]);
    const [selectedTimeZone, setSelectedTimeZone] = useState('');
    const [formattedDateRange, setFormattedDateRange] = useState('');
    const [maxDays, setMaxDays] = useState('');

    // Use data context
    const { 
      updateTableData, 
      setLoadingState, 
      setErrorState, 
      clearData,
      loading 
    } = useData();

  const formatDateRange = (startDate, endDate, timeZone) => {
    try {
      // Check if dates are valid
      if (!startDate || !endDate) {
        return 'Please select both start and end dates';
      }
      
      // Format dates in the selected timezone
      const startFormatted = formatInTimeZone(startDate, timeZone, 'dd MMM yyyy');
      const endFormatted = formatInTimeZone(endDate, timeZone, 'dd MMM yyyy');
      
      // Get timezone abbreviation
      const timeZoneAbbr = formatInTimeZone(startDate, timeZone, 'OOOO');
      
      return `${startFormatted} - ${endFormatted} ${timeZoneAbbr}`;
    } catch (error) {
      console.error('Error formatting date:', error);
    }
  };

  // Custom day renderer with tooltips and disabled dates
  const customDayContent = (day) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const dateInfo = dateMessages[dateKey];
    
    if (dateInfo) {
      return (
        <div 
          className={`custom-day ${dateInfo.type} ${dateInfo.disabled ? 'disabled' : ''}`}
          title={dateInfo.message}
          data-tooltip={dateInfo.message}
        >
          <span className="day-number">{format(day, 'd')}</span>
          <span className="day-indicator">●</span>
        </div>
      );
    }
    
    return <span className="day-number">{format(day, 'd')}</span>
  };

  // Function to disable specific dates
  const disabledDay = (day) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const dateInfo = dateMessages[dateKey];
    return dateInfo?.disabled || false;
  };

  const applyDateFormatting = async () => {    
    const { startDate, endDate } = dateRange[0];
    
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }

    if (!selectedTimeZone) {
      alert('Please select a time zone before applying formatting.');
      return;
    }
    
    // Format the date range for display
    const formatted = formatDateRange(startDate, endDate, selectedTimeZone);
    setFormattedDateRange(formatted);

    // Fetch data from API
    try {
      setLoadingState(true);
      setErrorState(null);
      
      const apiResponse = await fetchDataByDateRange(startDate, endDate, selectedTimeZone);
      
      if (apiResponse.success) {
        updateTableData(apiResponse.data);
      } else {
        setErrorState(apiResponse.error || 'Failed to fetch data');
        updateTableData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorState('Network error occurred while fetching data');
      updateTableData([]);
    } finally {
      setLoadingState(false);
    }
  };

  const resetAll = () => {
    setDateRange([
      {
        startDate: new Date(),
        endDate: addDays(new Date(), 7),
        key: 'selection'
      }
    ]);
    setMaxDays('');
    setSelectedTimeZone('');
    setFormattedDateRange('');
    clearData();
  };

  const handleDateChange = (item) => {
    if(maxDays){
      const startDate = item.selection.startDate;
      const endDate = item.selection.endDate;
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if(diffDays > maxDays){
        alert(`Selected date range is too long. Maximum allowed days is ${maxDays}.`);
        resetAll();
        return;
      }
    }
    setDateRange([item.selection])
  }

  const handleMaxDaysChange = (e) => {
    const value = parseInt(e.target.value);
    if(value < 1){
      setMaxDays('')
      alert('Maximum number of days must be at least 1.');
      return;
    }
    if (value >365){
      setMaxDays('')
      alert('Maximum number of days must be less than 365.');
      return;
    }
    setMaxDays(value);
  }
  return (
    <>
      <h1>Select Date Range</h1>
      
      <div className="legend-container container-box">
        <h4>Date Legend:</h4>
        <div className="legend-items">
          <span className="legend-item holiday">● Holiday (Disabled)</span>
          <span className="legend-item meeting">● Meeting Day</span>
          <span className="legend-item maintenance">● Maintenance (Disabled)</span>
          <span className="legend-item deadline">● Deadline</span>
          <span className="legend-item event">● Special Event</span>
        </div>
      </div>

      <div className="max-days-container container-box">
      <span className="time-zone-label">Enter Max Number of Days :</span>
      <input type="number" min={1} id="max-value" name="max-value" value={maxDays} onChange={e => handleMaxDaysChange(e)} required/>
      </div>

      <div className="calendar container-box">
      <div className="calendar-container">
        <DateRangePicker
          onChange={item => handleDateChange(item)}
          showSelectionPreview={false}
          moveRangeOnFirstSelection={false}
          months={1}
          ranges={dateRange}
          direction="horizontal"
          minDate={addDays(new Date(), -90)}
          dayContentRenderer={customDayContent}
          disabledDay={disabledDay}
        />
      </div>
      <div className="time-zone-container">
        <div>
        <span className="time-zone-label">Select Time Zone * :</span>
        <select value={selectedTimeZone} onChange={e => setSelectedTimeZone(e.target.value)}>
          <option value="">-- Select Time Zone --</option>
          {timeZones.map(tz => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
        </div>
      </div>
      </div>
      <div className="button-group">
          <button 
            className="primary-button margin-left-1rem" 
            onClick={applyDateFormatting}
            disabled={loading}
          >
            {loading ? 'Fetching Data...' : 'Apply'}
          </button>
          <button className="secondary-button margin-left-1rem" onClick={()=>resetAll()}>Reset</button>
      </div>
      <div className="formatted-date-container container-box">
      <span>Formatted Date :  </span>
      <span>{formattedDateRange || "Select time zone and click Apply"}</span>
      </div>
    </>
  )

};

export default Calendar;