const apiUrl = 'https://6rlt9htd51.execute-api.us-east-1.amazonaws.com';

// Function to show a message for 5 seconds
function showMessage(message, isSuccess) {
    // Expand/collapse form logic remains the same
    const errorMessageDiv = document.getElementById('error-message');
    const successMessageDiv = document.getElementById('success-message');
    const messageDiv = isSuccess ? successMessageDiv : errorMessageDiv;
    
    messageDiv.style.display = 'flex'; // Show the message div
    messageDiv.querySelector('span').textContent = message; // Set the message content

    // Hide the message after 5 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none'; // Hide the message div
    }, 5000);
}

async function fetchVideo(query) {
        console.log('Fetching documents...');
        fetchUrl = apiUrl + '/autocomplete';
        if (query) {
            fetchUrl += `?term=${encodeURIComponent(query)}`;
        }

        // Endpunkt mit dem Parameter "term" anstatt "query"
        fetch(fetchUrl)
            .then(response => {
                if (response.status === 204) {
                    // Handle 204 No Content: Return a default object or empty array
                    return { message: 'No matching cities found', data: [] };
                }

                if (!response.ok) {
                    // Throw an error for other non-2xx status codes
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                return response.json().then(data => ({ message: null, data })); // Wrap the data
            })
            .then(result => {
                const cityList = document.getElementById('city-list');
                cityList.innerHTML = ''; // Clear the list before appending new items

                if (result.data.length === 0) {
                    // Display a message if no items are found
                    showMessage(result.message || 'No cities found.', false);
                } else {
                    result.data.forEach(cityFromResponse => {
                        // Create list item with delete and toggle complete buttons
                        const li = document.createElement('div');
                        li.classList.add('city-item');
                        li.innerHTML = `
                    <span class="city-name">${cityFromResponse.city}</span>
                    <div class="button-group">
                        <button class="view" onclick="viewCity('${cityFromResponse.city}', ${cityFromResponse.id})">view</button>    
                    </div>
                `;
                        cityList.appendChild(li);
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching cities:', error);
                showMessage(error.message, false); // Show the error message
            });
    }


document.addEventListener('DOMContentLoaded', function () {
    const searchBtn = document.getElementById('search-btn');
    const searchTerm = document.getElementById('search-term');
    const clearBtn = document.getElementById("clear-btn");

    searchBtn.addEventListener('click', function () {
        let query = searchTerm.value;

        if (query.length === 0)
            showMessage("Search Term cannot be empty!", false);
        else {
            fetchVideo(query);
            clearBtn.style.display = "block";
            setTimeout(() => {
                clearBtn.classList.add("show"); // Add the class to trigger sliding effect
            }, 40);
        }
    });

    clearBtn.addEventListener("click", () => {
        // Clear the input field
        searchTerm.value = "";
        fetchVideo('');
        // Hide the clear button with sliding effect
        clearBtn.classList.remove("show");
        setTimeout(() => {
            clearBtn.style.display = "none"; // Hide after sliding closed
        }, 300); // Match this duration with CSS transition time
    });
});

document.addEventListener('DOMContentLoaded', fetchVideo(''));

function deleteTask(id) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                fetchDocuments(); // Refresh the list after deletion
            } else {
                console.error('Fehler beim Löschen der Aufgabe.');
            }
        })
        .catch(error => console.error('Fehler:', error));
}

function viewCity(city, id) {
    window.location.href = `/view.html?city=${encodeURIComponent(city)}&id=${encodeURIComponent(id)}`;
}