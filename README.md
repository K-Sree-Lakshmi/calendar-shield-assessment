# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint warnings in the console.

### Features
This project provides a robust data display and manipulation interface with the following key functionalities:

### Date and Time Selection
Flexible Date Range: Easily select a date range with a default of 7 days from today's date.

Date Restrictions: Prevent selection of dates older than 90 days as a start date.

Maximum Duration: Limit date range selections to a maximum of N number days, with an alert if exceeded. Min day - 1, Max days - 365.

Global Timezone Support: View and adjust dates and times across 10 different timezones, ensuring accurate data representation worldwide.

Date Specific Messaging: Hover over certain dates to see predefined messages. Some dates are highlighted and disabled based on a legend. Added this sample message for 4 months.

### Data Table
Comprehensive Data View: Displays data in a table with essential columns like Name, Date, Amount, and Status.

Interactive Sorting: Sort table data in ascending or descending order by various columns.

Column-Specific Search: Efficiently search and filter data within specific table columns.

Customizable Design: Enjoy a clean and intuitive table design with custom styling, sorting icons, cell focus and highlight on copying a cell.

### Data Handling
Dynamic Data Fetching: Data is fetched from a dummy API based on your selected date range and timezone, ensuring relevant results.

