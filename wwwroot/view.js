const apiUrl = 'https://kd5ale9jnb.execute-api.us-east-1.amazonaws.com/prod';

document.addEventListener('DOMContentLoaded', () => {
    // Extract cityId from query parameters
    const params = new URLSearchParams(window.location.search);
    const cityName = params.get('city');
    const cityId = params.get('id');
    const searchBtn = document.getElementById('search-btn');
    const backBtn = document.getElementById('back-btn');
    const hourSlider = document.getElementById('hour-slider');
    const selectedHourDisplay = document.getElementById('selected-hour');


    // Update the displayed hour as the slider changes
    hourSlider.addEventListener('input', () => {
        selectedHourDisplay.textContent = hourSlider.value + ':00';
    });

    if (cityName) {
        document.getElementById('city-name').textContent = decodeURIComponent(cityName);
        fetchCityDetails(decodeURIComponent(cityName));
    } else {
        // Handle missing city name (optional)
        document.getElementById('city-title').textContent = 'City Not Found';
    }

    backBtn.addEventListener('click', function () {
        window.location.href = 'index.html' // Navigate to index.html
    });

    searchBtn.addEventListener('click', function () {
        fetchVideo(cityName);
    });
});

// Example of fetching data
function fetchCityDetails(cityName) {
    fetch(`${apiUrl}/cities/${cityName}`)
        .then(response => response.json())
        .then(data => {
            console.log('City Details:', data);
            // Render city data on the page
        })
        .catch(error => console.error('Error fetching city details:', error));
}


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

async function fetchVideo(city) {
    console.log('Fetching video...');
    fetchUrl = apiUrl + '/video' + `?city=${encodeURIComponent(city)}`;

    const date = document.getElementById("date").value;
    const time = document.getElementById("hour-slider").value;

    console.log(date);
    console.log(time);

    if (date === null || date == 0)
        showMessage("Date must be selected", false);

    const fetchOption = {
        method: "POST",
        body: JSON.stringify(dateTime)
    };

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
                        <button class="view" onclick="viewCity(${cityFromResponse.id})">view</button>    
                        <button class="delete" onclick="deleteTask(${cityFromResponse.id})">
                                <span class="material-icons">delete</span>
                        </button>
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
