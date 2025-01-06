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


document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const cityName = params.get('city');
    const cityId = params.get('id');
    const dateInput = document.getElementById('date');
    const hourSlider = document.getElementById('hour-slider');
    const selectedHourDisplay = document.getElementById('selected-hour');
    const searchBtn = document.getElementById('search-btn');
    let videoData = [];

    // Initialize the page
    if (cityName && cityId) {
        document.getElementById('city-name').textContent = decodeURIComponent(cityName);
        fetchAllVideoData(cityId);
    }

    // Set initial disabled state through CSS class
    hourSlider.classList.add('disabled');
    searchBtn.classList.add('disabled');

    // Event Listeners
    document.getElementById('back-btn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    dateInput.addEventListener('change', handleDateChange);
    hourSlider.addEventListener('input', handleHourChange);
    searchBtn.addEventListener('click', handleSearchClick);
    hourSlider.addEventListener('click', handleSliderClick);

    async function fetchAllVideoData(cityId) {
        try {
            const response = await fetch(`${apiUrl}/videos?city_id=${cityId}`);
            if (!response.ok) throw new Error('Failed to fetch video data');
            
            videoData = await response.json();
            
            // Initialize date picker with available dates
            const availableDates = [...new Set(videoData.map(v => v.video_date))].sort();
            initializeDatePicker(availableDates);
        } catch (error) {
            console.error('Error fetching video data:', error);
            showMessage("Failed to load video data", false);
        }
    }

    function initializeDatePicker(availableDates) {
        flatpickr(dateInput, {
            enable: availableDates,
            dateFormat: "Y-m-d"
        });
    }

    function highlightDatePicker() {
        dateInput.style.border = '2px solid red';
        setTimeout(() => {
            dateInput.style.border = '';
        }, 2000);
    }

    function handleSliderClick(event) {
        if (!dateInput.value) {
            event.preventDefault();
            highlightDatePicker();
            showMessage("Please select a date first", false);
        }
    }

    function handleSearchClick(event) {
        if (!dateInput.value) {
            event.preventDefault();
            highlightDatePicker();
            showMessage("Please select a date first", false);
            return;
        }
        handleSearch();
    }

    function handleDateChange(event) {
        const selectedDate = event.target.value;
        
        // Toggle disabled state through CSS class
        hourSlider.classList.toggle('disabled', !selectedDate);
        searchBtn.classList.toggle('disabled', !selectedDate);
        
        if (!selectedDate) {
            return;
        }

        // Always show all hours (0-23)
        hourSlider.min = 0;
        hourSlider.max = 23;
        hourSlider.value = 0;
        
        // Update display and check availability
        const selectedHour = parseInt(hourSlider.value);
        selectedHourDisplay.textContent = `${selectedHour}:00`;
        updateHourAvailability(selectedDate, selectedHour);
    }

    function isHourAvailable(date, hour) {
        return videoData.some(v => 
            v.video_date === date && 
            v.video_hour === hour
        );
    }

    function updateHourAvailability(date, hour) {
        const isAvailable = isHourAvailable(date, hour);
        
        // Update hour display styling
        selectedHourDisplay.classList.toggle('unavailable', !isAvailable);
        
        // Update search button
        searchBtn.disabled = !isAvailable;
        searchBtn.classList.toggle('disabled', !isAvailable);
    }

    // function handleDateChange(event) {
    //     const selectedDate = event.target.value;
        
    //     // Enable/disable hour slider based on date selection
    //     hourSlider.disabled = !selectedDate;
        
    //     if (!selectedDate) {
    //         searchBtn.disabled = true;
    //         searchBtn.classList.add('disabled');
    //         return;
    //     }

    //     // Always show all hours (0-23)
    //     hourSlider.min = 0;
    //     hourSlider.max = 23;
    //     hourSlider.value = 0;
        
    //     // Update display and check availability
    //     const selectedHour = parseInt(hourSlider.value);
    //     selectedHourDisplay.textContent = `${selectedHour}:00`;
    //     updateHourAvailability(selectedDate, selectedHour);
    // }

    function handleHourChange(event) {
        const selectedHour = parseInt(event.target.value);
        const selectedDate = dateInput.value;
        
        selectedHourDisplay.textContent = `${selectedHour}:00`;
        
        if (selectedDate) {
            updateHourAvailability(selectedDate, selectedHour);
        }
    }

    function handleSearch() {
        const selectedDate = dateInput.value;
        const selectedHour = parseInt(hourSlider.value);
        
        if (isHourAvailable(selectedDate, selectedHour)) {
            displayVideoData(selectedDate, selectedHour);
        }
    }

    function displayVideoData(date, hour) {
        const video = videoData.find(v => 
            v.video_date === date && 
            v.video_hour === hour
        );

        if (!video) return;

        // Update or create video player
        let videoContainer = document.getElementById('video-container');
        if (!videoContainer) {
            videoContainer = document.createElement('div');
            videoContainer.id = 'video-container';
            document.querySelector('.container').appendChild(videoContainer);
        }

        videoContainer.style.display = 'block';
        videoContainer.innerHTML = `
            <div class="weather-info">
                <div class="weather-stat">
                    <span>Temperature:</span>
                    <span>${video.average_temperature}°C</span>
                </div>
                <div class="weather-stat">
                    <span>Humidity:</span>
                    <span>${video.average_humidity}%</span>
                </div>
                <div class="weather-stat">
                    <span>Air Pressure:</span>
                    <span>${video.average_air_pressure} hPa</span>
                </div>
            </div>
            <video controls src="${video.s3_video_url}">
                Your browser does not support the video tag.
            </video>
        `;
    }
});