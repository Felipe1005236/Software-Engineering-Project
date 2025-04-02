// Weather widget functionality
console.log("Hello, this is the weather");
document.addEventListener('DOMContentLoaded', function() {
  const weatherWidget = document.querySelector('.weather-widget');
  const refreshBtn = weatherWidget.querySelector('.refresh-btn');
  const weatherIcon = weatherWidget.querySelector('.weather-icon i');
  const temperatureEl = weatherWidget.querySelector('.temperature');
  const conditionsEl = weatherWidget.querySelector('.conditions');
  const locationEl = weatherWidget.querySelector('.location');

  // Default location (you can change this or make it dynamic)
  const defaultLocation = "Bremen";
  console.log(defaultLocation);

  // Weather icon mapping
  const weatherIcons = {
    'clear': 'fa-sun',
    'clouds': 'fa-cloud',
    'rain': 'fa-cloud-rain',
    'snow': 'fa-snowflake',
    'thunderstorm': 'fa-bolt',
    'drizzle': 'fa-cloud-rain',
    'mist': 'fa-smog'
  };

  // Fetch weather data
  function fetchWeather(location = defaultLocation) {
    // For demo purposes - in production, use a real weather API
    fetchRealWeather(location)
      .then(data => {
        updateWeatherUI(data);
      })
      .catch(error => {
        console.error("Error fetching weather:", error);
        conditionsEl.textContent = "Weather unavailable";
      });
  }

  // Mock API function (replace with real API call)
  function fetchRealWeather(location = defaultLocation) {
    const apiKey = 'dce981767f2d8c4a158fcccd9f8789eb'; // Get from https://openweathermap.org
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        updateWeatherUI({
          temp: Math.round(data.main.temp),
          conditions: data.weather[0].main.toLowerCase(),
          location: data.name
        });
      })
      .catch(error => {
        console.error("Error fetching weather:", error);
        conditionsEl.textContent = "Weather unavailable";
      });
  }

  // Update UI with weather data
  function updateWeatherUI(data) {
    temperatureEl.textContent = `${data.temp}°C`;
    conditionsEl.textContent = data.conditions.charAt(0).toUpperCase() + data.conditions.slice(1);
    locationEl.textContent = data.location;
    
    // Set appropriate icon
    const iconClass = weatherIcons[data.conditions.toLowerCase()] || 'fa-cloud';
    weatherIcon.className = `fas ${iconClass}`;
    
    // Change color based on temperature
    if (data.temp > 25) {
      weatherIcon.style.color = '#e74c3c';
    } else if (data.temp < 5) {
      weatherIcon.style.color = '#3498db';
    } else {
      weatherIcon.style.color = '#f39c12';
    }
  }

  // Event listeners
  refreshBtn.addEventListener('click', () => {
    fetchWeather();
  });

  // Initial load
  fetchWeather();
});