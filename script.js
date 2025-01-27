// Select DOM elements
const addExpenseForm = document.getElementById('add-expense');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const expenseList = document.getElementById('expenses');
const totalExpensesDisplay = document.getElementById('total-expenses');

const setBudgetForm = document.getElementById('set-budget-form');
const monthlyBudgetInput = document.getElementById('monthly-budget');
const currentBudgetDisplay = document.getElementById('current-budget');
const remainingBudgetDisplay = document.getElementById('remaining-budget');

const spendingChartCanvas = document.getElementById('spending-chart');
const darkModeToggle = document.getElementById('toggle-dark-mode');

let expenses = [];
let monthlyBudget = 0;
let spendingChart;

// Function to update the total expenses
function updateTotalExpenses() {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  totalExpensesDisplay.textContent = total.toFixed(2);
}

// Function to update the remaining budget
function updateRemainingBudget() {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = monthlyBudget - totalExpenses;
  remainingBudgetDisplay.textContent = remainingBudget.toFixed(2);
}

// Function to display expenses
function displayExpenses() {
  expenseList.innerHTML = '';
  expenses.forEach((expense, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${expense.description} - $${expense.amount.toFixed(2)} (${expense.category})
      <button onclick="deleteExpense(${index})">Delete</button>
    `;
    expenseList.appendChild(li);
  });
}

// Function to calculate category spending
function calculateCategorySpending() {
  const categorySpending = {};
  expenses.forEach((expense) => {
    categorySpending[expense.category] = (categorySpending[expense.category] || 0) + expense.amount;
  });
  return categorySpending;
}

// Function to update the chart
function updateChart() {
  const categorySpending = calculateCategorySpending();
  const labels = Object.keys(categorySpending);
  const data = Object.values(categorySpending);

  if (spendingChart) spendingChart.destroy();
  spendingChart = new Chart(spendingChartCanvas, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: ['#4caf50', '#ff9800', '#f44336', '#2196f3'],
        },
      ],
    },
  });
}

// Add an expense
function addExpense(event) {
  event.preventDefault();
  const description = descriptionInput.value;
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;

  expenses.push({ description, amount, category });
  updateUI();

  descriptionInput.value = '';
  amountInput.value = '';
  categoryInput.value = 'Food';
}

// Delete an expense
function deleteExpense(index) {
  expenses.splice(index, 1);
  updateUI();
}

// Set the monthly budget
function setMonthlyBudget(event) {
  event.preventDefault();
  monthlyBudget = parseFloat(monthlyBudgetInput.value);
  currentBudgetDisplay.textContent = monthlyBudget.toFixed(2);
  updateRemainingBudget();
  monthlyBudgetInput.value = '';
}

// Update the UI
function updateUI() {
  updateTotalExpenses();
  updateRemainingBudget();
  displayExpenses();
  updateChart();
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  document.querySelector('header').classList.toggle('dark-mode');
  document.querySelector('main').classList.toggle('dark-mode');
}

// Event listeners
addExpenseForm.addEventListener('submit', addExpense);
setBudgetForm.addEventListener('submit', setMonthlyBudget);
darkModeToggle.addEventListener('click', toggleDarkMode);
