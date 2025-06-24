# Car Data Table

This is a full-stack web application that allows users to view, search, filter, and delete electric car data. It uses AG Grid for the data table, MUI for UI components, React for the frontend, and MongoDB for the backend storage.

## Features

- **Search**: A search bar that allows users to search through the car data by keywords.
- **Filter**: Filter the data based on selected fields, operators, and values.
- **Pagination**: The table supports pagination to show 20 records per page.
- **Actions**: Users can view detailed information of a specific car and delete records.
- **Responsive Design**: Supports both desktop and mobile views with dynamic layouts.

## Technologies Used

- **Frontend**: React, AG Grid, Material-UI (MUI), React Router
- **Backend**: Express.js, MongoDB (via API calls for CRUD operations)
- **Styling**: Material-UI for components and styling
- **State Management**: React useState and useEffect for handling data and UI state

## Installation

To run the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/behnooshmarvi/BMW.git

2. **Navigate into the project directory**:
   ```bash
   cd client

3. **Install dependencies**:
   ```bash
   npm install

4. **Run the development server**:
   ```bash
   npm start

Visit http://localhost:3000 to view the application in the browser.

To run the backend:

1. **Navigate into the project directory**:
   ```bash
   cd server

2. **Install backend dependencies:**:
   ```bash
   npm install

3. **Install backend dependencies:**:
   ```bash
   node server.js

The server will be running on http://localhost:4000, and it will handle requests made from the frontend.




