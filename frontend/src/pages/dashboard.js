import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const BASE_URL = 'http://localhost:5000/api'; // Backend endpoint

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [empNo, setEmpNo] = useState('');
  const [empName, setEmpName] = useState('');
  const [departmentCode, setDepartmentCode] = useState('');
  const [basicSalary, setBasicSalary] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [employeeToUpdate, setEmployeeToUpdate] = useState(null);
 
  const [empAddressLine1, setEmpAddressLine1] = useState('');
  const [empAddressLine2, setEmpAddressLine2] = useState('');
  const [empAddressLine3, setEmpAddressLine3] = useState('');
  const [dateOfJoin, setDateOfJoin] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isActive, setIsActive] = useState(true); // Default is true (Active)
  
  // Fetch all departments
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/departments`, {
          headers: {
            'apiToken': '?D(G+KbPeSgVkYp3s6v9y$B&E)H@McQf',
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch departments: ${response.statusText}`);
        }
        const data = await response.json();
        setDepartments(data); // Set department data
      } catch (error) {
        setError(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  // Fetch all employees
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/employees`, {
          headers: {
            'apiToken': '?D(G+KbPeSgVkYp3s6v9y$B&E)H@McQf',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch employees');
        const data = await response.json();
        setEmployees(data); // Set employee data
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Handle add employee
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    const newEmployee = {
      empNo,
      empName,
      departmentCode,  // Ensure departmentCode matches the backend
      basicSalary,
      empAddressLine1,
      empAddressLine2,
      empAddressLine3,
      dateOfJoin,
      dateOfBirth,
      isActive,
    };
  
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/employee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apiToken': '?D(G+KbPeSgVkYp3s6v9y$B&E)H@McQf', // Make sure the token is valid
        },
        body: JSON.stringify(newEmployee),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add employee');
      }
  
      const data = await response.json();
      setEmployees((prevEmployees) => [...prevEmployees, data]);
      clearForm();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  
  // Handle update employee
  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
  
    const updatedEmployee = {
      empName, 
      departmentCode, 
      basicSalary
    };
  
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/employee/${empNo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'apiToken': '?D(G+KbPeSgVkYp3s6v9y$B&E)H@McQf',
        },
        body: JSON.stringify(updatedEmployee),
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // This might provide more details on the error
        throw new Error(errorData.message || 'Failed to update employee');
      }
      const data = await response.json();
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee.empNo === empNo ? { ...employee, ...data } : employee
        )
      );
      clearForm();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  // Handle delete employee
  const handleDelete = async (empNo) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/employee/${empNo}`, {
        method: 'DELETE',
        headers: {
          'apiToken': '?D(G+KbPeSgVkYp3s6v9y$B&E)H@McQf',
        },
      });

      if (!response.ok) throw new Error('Failed to delete employee');
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee.empNo !== empNo)
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear form
  const clearForm = () => {
    setEmpNo('');
    setEmpName('');
    setDepartmentCode('');
    setBasicSalary('');
    setEmpAddressLine1('');
    setEmpAddressLine2('');
    setEmpAddressLine3('');
    setDateOfJoin('');
    setDateOfBirth('');
    setIsActive(true);
  };

  return (
    <div>
      <h2>Employee Dashboard</h2>

      <form onSubmit={employeeToUpdate ? handleUpdateEmployee : handleAddEmployee}>
  <input
    type="text"
    placeholder="Employee No"
    value={empNo}
    onChange={(e) => setEmpNo(e.target.value)}
    required
  />
  <input
    type="text"
    placeholder="Employee Name"
    value={empName}
    onChange={(e) => setEmpName(e.target.value)}
    required
  />
  <select
    value={departmentCode}
    onChange={(e) => setDepartmentCode(e.target.value)}
    required
  >
    <option value="">Select Department</option>
    {departments.map((dept) => (
      <option key={dept.departmentCode} value={dept.departmentCode}>
        {dept.departmentName}
      </option>
    ))}
  </select>
  <input
    type="number"
    placeholder="Basic Salary"
    value={basicSalary}
    onChange={(e) => setBasicSalary(e.target.value)}
    required
  />
  <input
    type="text"
    placeholder="Address Line 1"
    value={empAddressLine1}
    onChange={(e) => setEmpAddressLine1(e.target.value)}
    required
  />
  <input
    type="text"
    placeholder="Address Line 2"
    value={empAddressLine2}
    onChange={(e) => setEmpAddressLine2(e.target.value)}
    required
  />
  <input
    type="text"
    placeholder="Address Line 3"
    value={empAddressLine3}
    onChange={(e) => setEmpAddressLine3(e.target.value)}
  />
  <input
    type="date"
    placeholder="Date of Joining"
    value={dateOfJoin}
    onChange={(e) => setDateOfJoin(e.target.value)}
    required
  />
  <input
    type="date"
    placeholder="Date of Birth"
    value={dateOfBirth}
    onChange={(e) => setDateOfBirth(e.target.value)}
    required
  />
  <select
    value={isActive}
    onChange={(e) => setIsActive(e.target.value)}
    required
  >
    <option value={true}>Active</option>
    <option value={false}>Inactive</option>
  </select>
  <button type="submit">{employeeToUpdate ? 'Update' : 'Add'} Employee</button>
  <button type="button" onClick={clearForm}>Clear</button>
</form>


      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearch}
      />

      <table>
        <thead>
          <tr>
            <th>Employee No</th>
            <th>Name</th>
            <th>Department</th>
            <th>Basic Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  {employees
    .filter((employee) => employee.empName.toLowerCase().includes(searchTerm.toLowerCase()))
    .map((employee) => (
      <tr key={employee.empNo}>
        <td>{employee.empNo}</td>
        <td>{employee.empName}</td>
        <td>{departments.find((dept) => dept.departmentCode === employee.departmentCode)?.departmentName}</td>
        <td>{employee.basicSalary}</td>
        <td>{employee.empAddressLine1}</td> {/* Address Line 1 */}
        <td>{employee.empAddressLine2}</td> {/* Address Line 2 */}
        <td>{employee.empAddressLine3}</td> {/* Address Line 3 */}
        <td>{new Date(employee.dateOfJoin).toLocaleDateString()}</td> {/* Date of Joining */}
        <td>{new Date(employee.dateOfBirth).toLocaleDateString()}</td> {/* Date of Birth */}
        <td>{employee.isActive ? "Active" : "Inactive"}</td> {/* Active Status */}
        <td>
          <button onClick={() => {
            setEmployeeToUpdate(employee);
            setEmpNo(employee.empNo);
            setEmpName(employee.empName);
            setDepartmentCode(employee.departmentCode);
            setBasicSalary(employee.basicSalary);
            setEmpAddressLine1(employee.empAddressLine1);
            setEmpAddressLine2(employee.empAddressLine2);
            setEmpAddressLine3(employee.empAddressLine3);
            setDateOfJoin(employee.dateOfJoin);
            setDateOfBirth(employee.dateOfBirth);
            setIsActive(employee.isActive);
          }}>
            Edit
          </button>
          <button onClick={() => handleDelete(employee.empNo)}>Delete</button>
        </td>
      </tr>
    ))}
</tbody>

      </table>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Dashboard;
