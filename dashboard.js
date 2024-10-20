const apiKey = 'c7ea006285904b62c96b1297b7b6867d';

// Event listner for getWeather Button
document.getElementById('getWeatherBtn').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    if (city) {
        fetchWeatherData(city);
        fetchForecastData(city);
    }
});
// Function to fetch weather data
function fetchWeatherData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                console.log(data);
                displayWeather(data);

            } else {
                alert('City not found');
            }
        })
        .catch(error => {
            alert("error fetching weather data");
            console.error('Error fetching weather data:', error)
        });
}
// Function to display weather data
function displayWeather(data) {
    const weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.innerHTML = `
        <p class="text-lg">City: ${data.name}</p>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <p>Description: ${data.weather[0].description}</p>
    `;
    console.log(data.weather[0].main)
    const condition = data.weather[0].main;
    updateWeatherWidgetBackground(condition);

}
// Fetch data to create charts
function fetchForecastData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "200") {
                createCharts(data);
            } else {
                alert('Unable to fetch forecast data');
            }
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
}

// Update the weather background based on conditions (images to be updated)
function updateWeatherWidgetBackground(condition) {
    const widget = document.getElementById('weatherWidget');

    let background = '';
    let color = '';

    switch (condition.toLowerCase()) {
        case 'clear':
            background = 'url("https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800")'; // Clear sky
            color = '#FFD700';
            break;
        case 'clouds':
            background = 'url("https://images.unsplash.com/photo-1499346030926-9a72daac6c63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800")'; // Cloudy sky
            color = '#B0C4DE';
            break;
        case 'rain':
        case 'drizzle':
            background = 'url("https://images.unsplash.com/photo-1498575207499-d7e6fac40b4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800")'; // Rainy sky
            color = '#4A90E2';
            break;
        case 'thunderstorm':
            background = 'url("https://images.unsplash.com/photo-1551974589-7233d4c0e28b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800")'; // Thunderstorm
            color = '#1F1F1F';
            break;
        case 'snow':
            background = 'url("https://images.unsplash.com/photo-1547592180-5499d0a1b3c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800")'; // Snowy scene
            color = '#FFFFFF';
            break;
        case 'mist':
        case 'haze':
        case 'fog':
            background = 'url("https://images.unsplash.com/photo-1531983412531-c61671d8f881?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800")'; // Misty/foggy scene
            color = '#D3D3D3';
            break;
        default:
            background = 'url("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800")'; // Default weather image
            color = '#87CEEB';
    }


    widget.style.backgroundImage = background;
    widget.style.backgroundSize = 'cover';
    widget.style.backgroundPosition = 'center';
    widget.style.color = color;
}

// Create charts
function createCharts(data) {
    const labels = data.list.slice(0, 5).map(entry => {
        const date = new Date(entry.dt_txt);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });

    const temperatures = data.list.slice(0, 5).map(entry => entry.main.temp);
    const conditions = data.list.slice(0, 5).map(entry => entry.weather[0].main);

    new Chart(document.getElementById('tempBarChart'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                backgroundColor: 'rgba(54, 162, 235, 0.6)'
            }]
        }
    });

    const conditionCounts = conditions.reduce((acc, condition) => {
        acc[condition] = (acc[condition] || 0) + 1;
        return acc;
    }, {});

    new Chart(document.getElementById('weatherDoughnutChart'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(conditionCounts),
            datasets: [{
                label: 'Weather Conditions',
                data: Object.values(conditionCounts),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
            }]
        }
    });

    new Chart(document.getElementById('tempLineChart'), {
        type: 'line',
        data: {
            labels: labels, // Labels with only time
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false
            }]
        }
    });
}


