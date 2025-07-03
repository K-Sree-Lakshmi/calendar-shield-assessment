import React, {useState, useEffect, useCallback} from "react";
import { useData } from "../../context/DataContext";
import "./Table.css";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { isEmpty } from "lodash";

const Table = () => {
  const { tableData, loading, error } = useData();
  const [searchTerm, setSearchTerm] = useState({name:"", date:"", amount:"", status:""});
  const [sortConfig, setSortConfig] = useState({key:null,type:null, direction:null});
  const [filteredData, setFilteredData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const columns = [{name:"Name", key:"name", type:"string"}, {name:"Date", key:"date", type:"date"}, {name:"TimeZone", key:"timezone", type:"string"}, {name:"Amount", key:"amount", type:"float"}, {name:"Status", key:"status", type:"string"}];
  
  // Store original data when tableData changes
  useEffect(() => {
    if (tableData.length > 0) {
      setOriginalData(tableData);
      setFilteredData(tableData);
    }
    // reset all states when tableData is empty
    else{
      setFilteredData([]);
      setOriginalData([]);
      setSearchTerm({name:"", date:"", amount:"", status:""});
      setSortConfig({key:null,type:null, direction:null});
    }
  }, [tableData]);

  // Debounced search function
        // This code filters the originalData array based on the current search terms for each column.
      // For each row in originalData:
      // - If the search term for a column is empty, that column is considered a match (no filtering).
      // - If the search term is not empty, it checks if the row's value for that column includes the search term (case-insensitive for strings).
      // - All columns (name, date, amount, status) must match their respective search terms for the row to be included.
      // The result is a filtered array containing only rows that match all active search terms.
  const debouncedSearch = useCallback(
    debounce((searchTerms) => {
      if (!originalData.length) return;
      const filtered = originalData.filter(row => {
        // Check if the name matches the search term (case-insensitive)
        const nameMatch = !searchTerms.name || 
          row.name.toLowerCase().includes(searchTerms.name.toLowerCase());
        
        // Check if the date matches the search term (case-insensitive)
        const dateMatch = !searchTerms.date || 
          row.date.toLowerCase().includes(searchTerms.date);

        // Check if the amount matches the search term (as a substring)
        const amountMatch = !searchTerms.amount || 
          row.amount.toString().includes(searchTerms.amount);
        
        // Check if the status matches the search term (case-insensitive)
        const statusMatch = !searchTerms.status || 
          row.status.toLowerCase().includes(searchTerms.status.toLowerCase());

        // Only include the row if all columns match their search terms
        return nameMatch && dateMatch && amountMatch && statusMatch;
      });

      setFilteredData(filtered);
    }, 300),
    [originalData]
  );

  // Trigger debounced search when searchTerm changes
  useEffect(() => {
    if(!isEmpty(searchTerm)){
      debouncedSearch(searchTerm);
    }
  }, [searchTerm]);

  // Debounce utility function
  function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  const handleSort = (key, type, direction) => {
    setSortConfig({key, type, direction});
  }

  const callSearch = (e, key) => {
    setSearchTerm(prev=>({...prev, [key]:e.target.value}))
  }

  useEffect(()=>{
    if(!isEmpty(sortConfig)){
        const {key, type, direction} = sortConfig;
        let sortedData = [...filteredData].sort((a,b)=>{
          if(type === "string"){
            return direction === "asc" ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
          }
          else if(type === "date"){
            return direction === "asc" ? new Date(a[key]) - new Date(b[key]) : new Date(b[key]) - new Date(a[key]);
          }
          else if(type === "float"){
            return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
          }
        });
        setFilteredData(sortedData);
    }
  },[sortConfig]);

    
  return (
    <div>
      {/* Loading State */}
      {loading && (
        <div className="loading-container container-box">
          <p>Loading data...</p>
          <div className="loading-spinner"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="container-box">
          <p className="error-message">Error: {error}</p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="table-container container-box">
        <h4 className="table-title">Filtered Table Data</h4>
        <table className="table">
          <thead>
            <tr>
              {columns.map(item=>{
                return(
                  <th key={item.key}>
                    <div className="table-header-container">
                      <div className="table-header-item">
                        <span>{item.name}</span>
                        {item.key === "timezone" ? null : <input id={item.key} type="search" placeholder="Search" value={searchTerm[item.key]} onChange={e=>callSearch(e, item.key)} />}
                      </div>
                      {item.key === "timezone" ? null : <div className="table-header-item sort-icon">
                        <FaSortUp onClick={()=>handleSort(item.key, item.type, "asc")} disabled={originalData.length === 0} />
                        <FaSortDown onClick={()=>handleSort(item.key, item.type, "desc")} disabled={originalData.length === 0}/>
                      </div>
                      }
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map(row => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.date}</td>
                  <td>{row.timezone}</td>
                  <td>${row.amount.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${row.status.toLowerCase()}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  {originalData.length > 0 ? "No matching results found" : "Please select a date range and click Apply to load data"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default Table;