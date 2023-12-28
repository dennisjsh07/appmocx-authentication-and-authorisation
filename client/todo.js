const form = document.querySelector('form');

form.addEventListener('submit', onSubmit);

async function onSubmit(e){
    console.log(e.target);
    e.preventDefault();

    const myObj = {
        addTask: document.getElementById('addTask').value
    }

    try{
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/task/add-task',myObj,{headers: {'Authorization': token}});
        console.log(response);
        showInUi(response.data.newTaskDetails);
    } catch(err){
        console.log(err)
    }

    form.reset();
}

// pagination...
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pageNumbers = document.getElementById('pageNumbers');
let currentPage = 1;
let totalPages = 1; // Initialize with 1, will be updated when fetching expenses...

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        getRequest(currentPage);
    }
});

nextPageBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        getRequest(currentPage);
    }
});

async function getRequest(page){
    try{
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/task/get-task', {
            headers: {'Authorization': token},
            params: { page }
        });
        console.log(response);
        // console.log(response.data.allTasks);

        // grab all the tasks...
        const {allTasks, totalPages: total} = response.data;
        totalPages = total; // Update totalPages

        // clear previous items in the table...
        var tableBody = document.getElementById('item-table');
        tableBody.innerHTML = '';

        // run through all the expenses and display them on the screen...
        for(var i = 0; i<allTasks.length; i++){
            showInUi(allTasks[i]);
        }

        // Update page numbers
        updatePageNumbers();

    } catch(err){
        console.log(err)
    }
}

function updatePageNumbers() {
    const numbers = [];
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            numbers.push(`<strong>${i}</strong>`);
        } else {
            numbers.push(`<button class="page-btn">${i}</button>`);
        }
    }
    pageNumbers.innerHTML = numbers.join(' ');

    const pageButtons = pageNumbers.querySelectorAll('.page-btn');
    pageButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentPage = parseInt(button.textContent);
            getRequest(currentPage);
        });
    });
}

function showInUi(data){
    // grab the table...
    var table = document.getElementById('item-table');

    // create table rows...
    var newRow = table.insertRow();

    // create table cells for each item property...
    var taskCell = newRow.insertCell(0);
    var statusCell = newRow.insertCell(1); // insert delete-btn...

    // populate the cells with item data...
    taskCell.textContent = data.addTask;

    // create a row & for delete button...
    var buttonRow = document.createElement("div");
    buttonRow.className = "row";

    var deleteColumn = document.createElement("div");
    deleteColumn.className = "col";

    // Create delete button...
    var deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger delete-btn btn-sm";
    deleteBtn.appendChild(document.createTextNode("Delete"));
    deleteColumn.appendChild(deleteBtn);

    // add col to row and col to actionCell...
    buttonRow.appendChild(deleteColumn);
    statusCell.appendChild(buttonRow);

    // Adding functionality to deleteBtn
    deleteBtn.addEventListener("click", onDeleteClick);

    async function onDeleteClick(e){
        try{
            const userId = data._id;
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:3000/task/delete-task/${userId}`, {headers: {'Authorization': token}});
            console.log(response);
            // console.log(response.data.deletedExpense);
            getRequest();
        } catch(err){
            console.log(err);
        }
    }
}

document.addEventListener('DOMContentLoaded',()=>{
    getRequest();
});