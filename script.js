
// OpenWeatherMap API key
const API_KEY = "836da583202bf73f5e07ead27f3e2497";

// HTML elements
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");

const mainTemperature = document.getElementById("temperature");
const tempDetails = document.getElementById("tempDetails");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const rain = document.getElementById("rain");

// Original weather logo - do not change it
const weatherIcon = document.querySelector(".display .icon");

// Status message
const statusMessage = {
    set textContent(value) {
        // Keep messages hidden
    }
};


// Get weather information
async function getWeather(city) {

    city = city.trim();

    if (city === "") {
        statusMessage.textContent = "Please enter a city or state name!";
        return;
    }

    try {
        searchButton.disabled = true;
        statusMessage.textContent = "Checking location...";

        // Validate location
        const geoURL =
            `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=5&appid=${API_KEY}`;

        const geoResponse = await fetch(geoURL);
        const locations = await geoResponse.json();

        if (!geoResponse.ok) {
            throw new Error("Unable to verify location.");
        }

        const searchName = city.toLowerCase();

        const location = locations.find(place =>
            place.name?.toLowerCase() === searchName ||
            place.state?.toLowerCase() === searchName
        );

        if (!location) {
            throw new Error("Invalid city or state name!");
        }

        statusMessage.textContent = "Loading weather...";

        // Get weather using location coordinates
        const weatherURL =
            `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric`;

        const response = await fetch(weatherURL);
        const data = await response.json();

        if (!response.ok) {
            throw new Error("Weather data unavailable.");
        }

        // Temperature
        const temperature = Math.round(data.main.temp);

        mainTemperature.textContent = `${temperature}°C`;
        tempDetails.textContent = `${temperature}°C`;

        // Humidity
        humidity.textContent = `${data.main.humidity}%`;

        // Wind speed in km/h
        wind.textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;

        // Rainfall
        const rainfall = data.rain
            ? (data.rain["1h"] || data.rain["3h"] || 0)
            : 0;

        rain.textContent = `${rainfall} mm`;

        // Keep original logo unchanged
        // No weatherIcon.src changes here

        statusMessage.textContent = "";

    } catch (error) {

        statusMessage.textContent = error.message;

    } finally {
        searchButton.disabled = false;
    }
}


// Search button
searchButton.addEventListener("click", () => {
    getWeather(cityInput.value);
});


// Enter key
cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        getWeather(cityInput.value);
    }
});
