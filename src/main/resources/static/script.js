const API_URL = '/api/employees';

// DOM Elements
const employeeTableBody = document.getElementById('employeeTableBody');
const emptyState = document.getElementById('emptyState');
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const employeeModal = document.getElementById('employeeModal');
const closeModalBtn = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const employeeForm = document.getElementById('employeeForm');
const modalTitle = document.getElementById('modalTitle');
const saveBtn = document.getElementById('saveBtn');

// Form Inputs
const employeeIdInput = document.getElementById('employeeId');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');

// State
let isEditing = false;

// Event Listeners
document.addEventListener('DOMContentLoaded', fetchEmployees);
addEmployeeBtn.addEventListener('click', openAddModal);
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
employeeModal.addEventListener('click', (e) => {
    if (e.target === employeeModal) closeModal();
});
employeeForm.addEventListener('submit', handleFormSubmit);

// Functions

async function fetchEmployees() {
    try {
        const response = await fetch(API_URL);
        const employees = await response.json();
        renderEmployees(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        alert('Failed to load employees. Please check if the backend is running.');
    }
}

function renderEmployees(employees) {
    employeeTableBody.innerHTML = '';
    
    if (employees.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    employees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${employee.id}</td>
            <td>${employee.firstName}</td>
            <td>${employee.lastName}</td>
            <td>${employee.email}</td>
            <td class="actions">
                <button class="btn btn-secondary" onclick="openEditModal(${employee.id})">
                    <i class="fa-solid fa-pen"></i> Edit
                </button>
                <button class="btn btn-danger" onclick="deleteEmployee(${employee.id})">
                    <i class="fa-solid fa-trash"></i> Delete
                </button>
            </td>
        `;
        employeeTableBody.appendChild(row);
    });
}

function openAddModal() {
    isEditing = false;
    modalTitle.textContent = 'Add Employee';
    saveBtn.textContent = 'Save Employee';
    employeeForm.reset();
    employeeIdInput.value = '';
    employeeModal.classList.add('open');
}

async function openEditModal(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Employee not found');
        
        const employee = await response.json();
        
        isEditing = true;
        modalTitle.textContent = 'Edit Employee';
        saveBtn.textContent = 'Update Employee';
        
        employeeIdInput.value = employee.id;
        firstNameInput.value = employee.firstName;
        lastNameInput.value = employee.lastName;
        emailInput.value = employee.email;
        
        employeeModal.classList.add('open');
    } catch (error) {
        console.error('Error fetching employee details:', error);
        alert('Failed to fetch employee details');
    }
}

function closeModal() {
    employeeModal.classList.remove('open');
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const employeeData = {
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        email: emailInput.value
    };
    
    try {
        let response;
        if (isEditing) {
            const id = employeeIdInput.value;
            response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employeeData)
            });
        } else {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employeeData)
            });
        }
        
        if (response.ok) {
            closeModal();
            fetchEmployees();
        } else {
            alert('Failed to save employee');
        }
    } catch (error) {
        console.error('Error saving employee:', error);
        alert('An error occurred while saving');
    }
}

async function deleteEmployee(id) {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            fetchEmployees();
        } else {
            alert('Failed to delete employee');
        }
    } catch (error) {
        console.error('Error deleting employee:', error);
        alert('An error occurred while deleting');
    }
}

// Expose functions to global scope for onclick handlers
window.openEditModal = openEditModal;
window.deleteEmployee = deleteEmployee;
