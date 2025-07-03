import { formatInTimeZone } from 'date-fns-tz';

// Extended mock data with more entries across different date ranges
const mockApiData = [
  // America/New_York
  {
    id: 1,
    name: "Alice Johnson",
    date: "2025-07-10",
    amount: 120.50,
    status: "Paid",
    timezone: "America/New_York"
  },
  {
    id: 2,
    name: "Michael Scott",
    date: "2025-08-25",
    amount: 250.00,
    status: "Pending",
    timezone: "America/New_York"
  },
  {
    id: 3,
    name: "Pam Beesly",
    date: "2025-09-05",
    amount: 80.75,
    status: "Overdue",
    timezone: "America/New_York" // timeZone is not being filtered properly
  },

  // America/Los_Angeles
  {
    id: 4,
    name: "Bob Smith",
    date: "2025-09-12",
    amount: 75.00,
    status: "Pending",
    timezone: "America/Los_Angeles"
  },
  {
    id: 5,
    name: "Dwight Schrute",
    date: "2025-08-18",
    amount: 180.00,
    status: "Paid",
    timezone: "America/Los_Angeles"
  },
  {
    id: 6,
    name: "Angela Martin",
    date: "2025-10-01",
    amount: 95.25,
    status: "Overdue",
    timezone: "America/Los_Angeles"
  },

  // Europe/London
  {
    id: 7,
    name: "Charlie Lee",
    date: "2025-09-15",
    amount: 200.00,
    status: "Overdue",
    timezone: "Europe/London"
  },
  {
    id: 8,
    name: "Oscar Martinez",
    date: "2025-10-10",
    amount: 150.00,
    status: "Paid",
    timezone: "Europe/London"
  },
  {
    id: 9,
    name: "Laura Martinez",
    date: "2025-08-15",
    amount: 310.60,
    status: "Paid",
    timezone: "Europe/London"
  },

  // Europe/Berlin
  {
    id: 10,
    name: "Diana Prince",
    date: "2025-08-18",
    amount: 50.25,
    status: "Paid",
    timezone: "Europe/Berlin"
  },
  {
    id: 11,
    name: "Hans Müller",
    date: "2025-09-25",
    amount: 210.00,
    status: "Pending",
    timezone: "Europe/Berlin"
  },
  {
    id: 12,
    name: "Greta Schmidt",
    date: "2025-10-05",
    amount: 99.99,
    status: "Overdue",
    timezone: "Europe/Berlin"
  },

  // Europe/Moscow
  {
    id: 13,
    name: "Hannah Davis",
    date: "2025-08-02",
    amount: 175.30,
    status: "Pending",
    timezone: "Europe/Moscow"
  },
  {
    id: 14,
    name: "Ivan Petrov",
    date: "2025-09-28",
    amount: 220.00,
    status: "Paid",
    timezone: "Europe/Moscow"
  },
  {
    id: 15,
    name: "Olga Ivanova",
    date: "2025-10-10",
    amount: 130.50,
    status: "Overdue",
    timezone: "Europe/Moscow"
  },

  // Asia/Dubai
  {
    id: 16,
    name: "Ian Foster",
    date: "2025-08-05",
    amount: 95.45,
    status: "Paid",
    timezone: "Asia/Dubai"
  },
  {
    id: 17,
    name: "Fatima Al-Farsi",
    date: "2025-09-22",
    amount: 185.00,
    status: "Pending",
    timezone: "Asia/Dubai"
  },
  {
    id: 18,
    name: "Omar Khalid",
    date: "2025-10-12",
    amount: 210.75,
    status: "Overdue",
    timezone: "Asia/Dubai"
  },

  // Asia/Kolkata
  {
    id: 19,
    name: "George Wilson",
    date: "2025-07-25",
    amount: 89.99,
    status: "Overdue",
    timezone: "Asia/Kolkata"
  },
  {
    id: 20,
    name: "Priya Sharma",
    date: "2025-08-30",
    amount: 120.00,
    status: "Paid",
    timezone: "Asia/Kolkata"
  },
  {
    id: 21,
    name: "Rahul Verma",
    date: "2025-09-08",
    amount: 140.50,
    status: "Pending",
    timezone: "Asia/Kolkata"
  },

  // Asia/Shanghai
  {
    id: 22,
    name: "Julia Roberts",
    date: "2025-07-08",
    amount: 220.80,
    status: "Pending",
    timezone: "Asia/Shanghai"
  },
  {
    id: 23,
    name: "Li Wei",
    date: "2025-08-18",
    amount: 175.00,
    status: "Paid",
    timezone: "Asia/Shanghai"
  },
  {
    id: 24,
    name: "Chen Yu",
    date: "2025-09-15",
    amount: 99.99,
    status: "Overdue",
    timezone: "Asia/Shanghai"
  },

  // Asia/Tokyo
  {
    id: 25,
    name: "Ethan Hunt",
    date: "2025-07-20",
    amount: 300.00,
    status: "Pending",
    timezone: "Asia/Tokyo"
  },
  {
    id: 26,
    name: "Sakura Tanaka",
    date: "2025-08-28",
    amount: 110.00,
    status: "Paid",
    timezone: "Asia/Tokyo"
  },
  {
    id: 27,
    name: "Kenji Sato",
    date: "2025-09-10",
    amount: 205.50,
    status: "Overdue",
    timezone: "Asia/Tokyo"
  },

  // Australia/Sydney
  {
    id: 28,
    name: "Fiona Green",
    date: "2025-07-22",
    amount: 150.75,
    status: "Paid",
    timezone: "Australia/Sydney"
  },
  {
    id: 29,
    name: "Jack Wilson",
    date: "2025-08-15",
    amount: 180.00,
    status: "Pending",
    timezone: "Australia/Sydney"
  },
  {
    id: 30,
    name: "Emily Brown",
    date: "2025-09-10",
    amount: 99.99,
    status: "Overdue",
    timezone: "Australia/Sydney"
  }
];

// Simulating API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms)); // example - to resolve promise

// Format date with timezone for API payload
const formatDateForApi = (date, timezone) => {
  try {
    // Format as YYYY-MM-DD HH:mm:ss +ZZZZ
    const formattedDate = formatInTimeZone(date, timezone, 'yyyy-MM-dd HH:mm:ss xxx');
    return formattedDate;
  } catch (error) {
    console.error('Error formatting date for API:', error);
    return null;
  }
};

// Dummy API function to fetch data based on date range and timezone
export const fetchDataByDateRange = async (startDate, endDate, timezone) => {
  try {
    // Simulate API delay
    await delay(500);

    // Format dates for API payload
    const formattedStartDate = formatDateForApi(startDate, timezone);
    const formattedEndDate = formatDateForApi(endDate, timezone);

    if (!formattedStartDate || !formattedEndDate) {
      throw new Error('Invalid date format');
    }

    // Create API payload (this would be sent to a real API)
    const apiPayload = {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      timezone: timezone,
      requestId: Date.now()
    };

    console.log('API Payload:', apiPayload);

    // Filter mock data based on date range AND timezone
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    
    const filteredData = mockApiData.filter(item => {
      const itemDate = new Date(item.date);
      const dateInRange = itemDate >= startDateObj && itemDate <= endDateObj;
      const timezoneMatch = item.timezone === timezone;
      // Only return items that match both date range AND timezone
      return dateInRange && timezoneMatch;
    });

    // Simulate API response
    const apiResponse = {
      success: true,
      data: filteredData,
      meta: {
        total: filteredData.length,
        dateRange: {
          start: formattedStartDate,
          end: formattedEndDate
        },
        timezone: timezone,
        requestTimestamp: new Date().toISOString()
      }
    };

    console.log('API Response:', apiResponse);
    return apiResponse;

  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

// Get all available data (for testing purposes)
export const getAllMockData = () => {
  return mockApiData;
};