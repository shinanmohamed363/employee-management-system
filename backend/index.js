const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Enable CORS for frontend requests
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Define the base URL of the external API
const BASE_URL = 'http://examination.24x7retail.com/api/v1.0';

const API_TOKEN = '?D(G+KbPeSgVkYp3s6v9y$B&E)H@McQf';

// Proxy endpoint for /Employees
app.get('/api/employees', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/Employees`, {
      headers: { 'apiToken': API_TOKEN },
    });
    res.json(response.data); // Send response back to the client
  } catch (error) {
    console.error('Error fetching employees:', error.message);
    res.status(500).json({ message: 'Failed to fetch employees' });
  }
});

// Proxy endpoint for /Departments
app.get('/api/departments', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/Departments`, {
      headers: { 'apiToken': API_TOKEN },
    });
    res.json(response.data); // Return departments data
  } catch (error) {
    console.error('Error fetching departments:', error.message);
    res.status(500).json({ message: 'Failed to fetch departments' });
  }
});

app.post('/api/employee', async (req, res) => {
    try {
      console.log(req.body);  // Log the request body to inspect it
      
      const {
        empNo,
        empName,
        departmentCode,  // Now it expects departmentCode
        basicSalary,
        empAddressLine1,
        empAddressLine2,
        empAddressLine3,
        dateOfJoin,
        dateOfBirth,
        isActive,
      } = req.body;
  
      // Validate required fields
      if (!empNo || !empName || !departmentCode || !basicSalary) {
        return res.status(400).json({ message: 'All required fields are not provided' });
      }
  
      const response = await axios.post(`${BASE_URL}/Employee`, {
        empNo,
        empName,
        departmentCode,
        basicSalary,
        empAddressLine1,
        empAddressLine2,
        empAddressLine3,
        dateOfJoin,
        dateOfBirth,
        isActive
      }, {
        headers: { 'apiToken': API_TOKEN },
      });
  
      res.json(response.data);  // Return the added employee data
    } catch (error) {
      console.error('Error adding employee:', error.message);
      res.status(500).json({ message: 'Failed to add employee' });
    }
  });
  
  

// Update employee
app.put('/api/employee/:empNo', (req, res) => {
    const empNo = req.params.empNo;
    const { empName, departmentCode, basicSalary } = req.body;
  
    // Example validation
    if (!empName || !departmentCode || !basicSalary) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    // Perform the update operation here
    // Example: employee update logic
  
    // Simulate successful response
    res.json({ empNo, empName, departmentCode, basicSalary });
  });
  

// Delete employee
app.delete('/api/employee/:empNo', async (req, res) => {
  const { empNo } = req.params;
  try {
    const response = await axios.delete(`${BASE_URL}/Employee/${empNo}`, {
      headers: { 'apiToken': API_TOKEN },
    });

    res.json(response.data); // Return success message or deleted employee data
  } catch (error) {
    console.error('Error deleting employee:', error.message);
    res.status(500).json({ message: 'Failed to delete employee' });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
