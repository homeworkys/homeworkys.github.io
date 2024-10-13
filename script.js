// Utility functions
function getLocalStorageItem(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function setLocalStorageItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Function to clear input fields
function clearInputs(inputIds) {
    inputIds.forEach(id => document.getElementById(id).value = '');
}

// Function to add new homework
function addHomework() {
    // Get the values from input fields
    const taskInput = document.getElementById('homework_name').value;
    const dateInput = document.getElementById('homework_date').value;
    const subjectInput = document.getElementById('homework_subject').value;

    // Create a new homework object
    const newHomework = { name: taskInput, date: dateInput, subject: subjectInput };

    // Get the existing homeworks from localStorage and add the new homework
    let homeworks = getLocalStorageItem('homeworks');
    homeworks.push(newHomework);
    setLocalStorageItem('homeworks', homeworks);

    // Clear the input fields and update the homework table
    clearInputs(['homework_name', 'homework_date', 'homework_subject']);
    loadHomeworkTable();
}

// Function to add a new class
function addClass() {
    // Get the class name from the input field
    const classInput = document.getElementById('class').value;

    // Create a new class object
    const newClass = { name: classInput };

    // Get the existing classes from localStorage and add the new class
    let classes = getLocalStorageItem('classes');
    classes.push(newClass);
    setLocalStorageItem('classes', classes);

    // Clear the input field and update the dropdown options
    clearInputs(['class']);
    refreshClassSelectors();
}

// Function to update the dropdown list of classes
function refreshClassSelectors() {
    // Get the classes from localStorage
    const classes = getLocalStorageItem('classes');

    // Get the dropdown element for homework subjects
    const selectElement = document.getElementById('homework_subject');

    // Clear the current options
    selectElement.innerHTML = '';

    // Add each class as an option in the dropdown
    classes.forEach(classItem => {
        const option = document.createElement('option');
        option.value = classItem.name;
        option.textContent = classItem.name;
        selectElement.appendChild(option);
    });
}

// Function to delete a class
function deleteClass() {
    // Get the class name to delete
    const classInput = document.getElementById('class').value;

    // Get existing classes from localStorage and filter out the class to delete
    let classes = getLocalStorageItem('classes');
    classes = classes.filter(classObj => classObj.name !== classInput);

    // Save the updated class list to localStorage and update the dropdown
    setLocalStorageItem('classes', classes);
    refreshClassSelectors();

    // Clear the input field
    clearInputs(['class']);
}

function deleteClasses() {
    if (confirm("This will delete all your homeworks and classes, continue?") == true) {
        window.localStorage.clear();
        alert("Done, deleted everything");
    }
    
}

// Function to load the homework table
function loadHomeworkTable() {
    // Get the table element
    const table = document.getElementById('homeworktable');

    // Clear existing rows (except the header row)
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    // Get homeworks from localStorage
    const homeworks = getLocalStorageItem('homeworks');

    // Add each homework to the table
    homeworks.forEach((homeworkData, index) => {
        const row = table.insertRow(1);
        row.insertCell(0).innerText = homeworkData.name;
        row.insertCell(1).innerText = homeworkData.date;
        row.insertCell(2).innerText = homeworkData.subject;

        if (homeworkData.date === formatDate(new Date(new Date().setDate(new Date().getDate() + 1)))) {
            row.style.background = "#F95454";
        }

        // Add a "Done" button for each homework
        const buttonsCell = row.insertCell(3);
        const doneButton = document.createElement('button');
        doneButton.innerText = "Done";
        doneButton.onclick = () => {
            // Remove the homework from localStorage
            homeworks.splice(index, 1);
            setLocalStorageItem('homeworks', homeworks);

            // Update the table
            loadHomeworkTable();
        };
        buttonsCell.appendChild(doneButton);
    });
}

// Function to show a notification
function notify(message) {
    if (Notification.permission === "granted") {
        new Notification(message);
    } else {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(message);
            }
        });
    }
}

// Function to check if there's homework due tomorrow
function getHomeworkForTomorrow() {
    const homeworks = getLocalStorageItem('homeworks');
    const tomorrow = formatDate(new Date(new Date().setDate(new Date().getDate() + 1)));

    const homeworkSubjects = homeworks
        .filter(hw => hw.date === tomorrow)
        .map(hw => hw.subject);

    if (homeworkSubjects.length > 0) {
        notify("You still have homework for tomorrow: " + homeworkSubjects.join(', '));
    } else {
        notify("No homework left for tomorrow!");
    }
}

// Utility function to format a date in yyyy-mm-dd
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
