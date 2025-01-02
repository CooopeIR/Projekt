const apiUrl = 'https://jj365xn904.execute-api.us-east-1.amazonaws.com/prod';

// Function to show a message for 5 seconds
function showMessage(message, isSuccess) {
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

async function fetchCities(query) {
    console.log('Fetching cities...');
    let fetchUrl = apiUrl + '/locations';
    const cityList = document.getElementById('city-list');
    if (query) {
        fetchUrl += `?term=${encodeURIComponent(query)}`;
    }

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
            return response.json().then(data => ({ message: null, data }));
        })
        .then(result => {
            cityList.innerHTML = ''; // Clear the existing list items
            result.data.forEach(cityFromResponse => {
                // Create list item with delete and toggle complete buttons
                const li = document.createElement('div');
                li.classList.add('city-item');
    
                // Create and set up city name span
                const cityNameSpan = document.createElement('span');
                cityNameSpan.classList.add('city-name');
                cityNameSpan.textContent = cityFromResponse.cityname + ', ' + cityFromResponse.country;
    
                // Create the button group div
                const buttonGroup = document.createElement('div');
                buttonGroup.classList.add('button-group');
    
                // Create and set up the "view" button
                const viewButton = document.createElement('button');
                viewButton.classList.add('view');
                viewButton.textContent = 'View';
                viewButton.onclick = () => viewCity(cityFromResponse.cityname, cityFromResponse.id);
    
                // Append the view button to the button group
                buttonGroup.appendChild(viewButton);
    
                // Append the created elements to the list item
                li.appendChild(cityNameSpan);
                li.appendChild(buttonGroup);
    
                // Append the list item to the city list
                cityList.appendChild(li);
        })
    })
    .catch(error => {
        console.error('Error fetching cities:', error);
        showMessage(error.message, false); // Show the error message
    });
};

document.addEventListener('DOMContentLoaded', function () {
    const searchBtn = document.getElementById('search-btn');
    const searchTerm = document.getElementById('search-term');
    const clearBtn = document.getElementById("clear-btn");

    searchBtn.addEventListener('click', function () {
        let query = searchTerm.value;

        if (query.length === 0)
            showMessage("Search Term cannot be empty!", false);
        else {
            fetchCities(query);
            clearBtn.style.display = "block";
            setTimeout(() => {
                clearBtn.classList.add("show"); // Add the class to trigger sliding effect
            }, 40);
        }
    });

    clearBtn.addEventListener("click", () => {
        // Clear the input field
        searchTerm.value = "";
        fetchCities(''); // Reset to initial cities
        // Hide the clear button with sliding effect
        clearBtn.classList.remove("show");
        setTimeout(() => {
            clearBtn.style.display = "none"; // Hide after sliding closed
        }, 300); // Match this duration with CSS transition time
    });
});

// Initially fetch cities on page load
document.addEventListener('DOMContentLoaded', function () {
    fetchCities('');
});


function viewCity(city, id) {
    window.location.href = `/view.html?city=${encodeURIComponent(city)}&id=${encodeURIComponent(id)}`;
}
