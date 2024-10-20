// Fetch weather data (forecast) from the same API
const apiKey = 'c7ea006285904b62c96b1297b7b6867d';
const forecastTableBody = document.getElementById('forecastTableBody');
const pageNumberEl = document.getElementById('pageNumber');
let currentPage = 1;
const rowsPerPage = 10;
let forecastData = [];
let currentCity = '';

document.getElementById('getWeatherBtn').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    if (city) {
        currentCity = city; // Set current city
        document.getElementById('chatArea').innerHTML = ''; // Clear chat on new city search
        fetchForecastData(city);
    }
});
// Fetch and display forecast data
function fetchForecastData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            forecastData = data.list; // Get the forecast data list
            displayPage(currentPage);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error)
            alert("Error fetching forecast data")
        });
}

// Display current page of forecast data
function displayPage(page) {
    // Calculate start and end indices for the current page
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    // Clear the existing rows
    forecastTableBody.innerHTML = '';

    // Add new rows for the current page
    forecastData.slice(start, end).forEach(entry => {
        const date = new Date(entry.dt_txt);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="border px-4 py-2">${date.toLocaleDateString()}</td>
            <td class="border px-4 py-2">${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td> <!-- New Time Column -->
            <td class="border px-4 py-2">${entry.main.temp} °C</td>
        `;
        forecastTableBody.appendChild(row);
    });

    // Update page number display
    pageNumberEl.textContent = `Page ${page}`;

    // Enable or disable Previous and Next buttons based on the current page
    document.getElementById('prevBtn').disabled = page === 1;
    document.getElementById('nextBtn').disabled = (page * rowsPerPage) >= forecastData.length;
}



// Pagination button event listeners
document.getElementById('nextBtn').addEventListener('click', () => {
    if ((currentPage * rowsPerPage) < forecastData.length) {
        currentPage++;
        displayPage(currentPage);
    }
});

document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayPage(currentPage);
    }
});
document.getElementById('clearBtn').addEventListener('click', () => {
    document.getElementById('chatArea').innerHTML = ''; // Clear chat
    currentCity = ''; // Reset the current city
});


const geminiApiKey = 'AIzaSyATFiDbciZ-yZFVJ-PYnlvFy5g0O3YQIIo'; // Google Gemini API key

document.getElementById('sendBtn').addEventListener('click', () => {
    const userMessage = document.getElementById('chatInput').value.trim().toLowerCase();

    // Check if the user input includes 'weather' and process accordingly
    if (userMessage.includes('weather')) {
        // Reset chatbot for new city-based query
        fetchGeminiForCity(userMessage)
            .then(cityName => {
                if (cityName.toLowerCase() !== 'no') {
                    // Update current city if a new city is detected
                    currentCity = cityName;
                    fetchWeatherData(currentCity)
                        .then(apiResponse => {
                            analyzeApiResponseWithGemini(apiResponse, userMessage)
                                .then(geminiResponse => displayChatbotResponse(geminiResponse, userMessage))
                                .catch(() => displayChatbotResponse("There was an error", userMessage));
                        })
                        .catch(() => displayChatbotResponse("There was an error", userMessage));
                } else {
                    displayChatbotResponse("Please enter a valid city name.", userMessage);
                }
            })
            .catch(() => displayChatbotResponse("There was an error", userMessage));
    } else if (currentCity) {
        // If a city is already set, treat as follow-up query
        fetchWeatherData(currentCity)
            .then(apiResponse => {
                analyzeApiResponseWithGemini(apiResponse, userMessage)
                    .then(geminiResponse => displayChatbotResponse(geminiResponse, userMessage))
                    .catch(() => displayChatbotResponse("There was an error", userMessage));
            })
            .catch(() => displayChatbotResponse("There was an error", userMessage));
    } else {
        // If there's no current city and no 'weather' keyword, treat as a general Gemini query
        fetchGeminiResponse(userMessage)
            .then(geminiResponse => displayChatbotResponse(geminiResponse, userMessage))
            .catch(() => displayChatbotResponse("There was an error", userMessage));
    }

    // Clear the chat input after sending
    document.getElementById('chatInput').value = '';
});


// Function to fetch city name using Gemini
function fetchGeminiForCity(userMessage) {
    const prompt = `check this message and identify the city name in it give a one-word response only containing the city name if you think this city is not correct and a city closely matches this give its name in the response, not another word. If there is no city in the message just say No\n\nHere is the message:\n${userMessage}`;

    return fetchGeminiResponse(prompt).then(response => response.trim());
}

// Function to fetch weather data for the extracted city name
function fetchWeatherData(cityName) {
    return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .catch(error => {
            alert("There was an error")
            console.error('There was an error', error);
            throw new Error('Weather API fetch error');
        });
}

// Function to analyze the OpenWeather API response using Gemini
function analyzeApiResponseWithGemini(apiResponse, userMessage) {
    const prompt = `${JSON.stringify(apiResponse)}\n\nAnalyze this api response and answer this question:\n${userMessage}`;
    return fetchGeminiResponse(prompt);
}

// Function to send prompts to the Gemini API and extract response
function fetchGeminiResponse(prompt) {
    return fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: `${prompt}\nMake sure to keep the response to the point if you're given an API response and given questions about it don't tell in your response that you are anazlyzing an API response just give to the point answers from that response` }]
            }]
        }),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Check if the API response contains candidates and parts
            if (data && data.candidates && data.candidates.length > 0) {
                const geminiContent = data.candidates[0].content;
                if (geminiContent && geminiContent.parts && geminiContent.parts.length > 0) {
                    return geminiContent.parts[0].text.trim(); // Extract the text and trim it
                } else {
                    alert("There was an error with gemini")
                    throw new Error('Gemini response structure error');
                }
            } else {
                alert("There was an error with gemini")

                throw new Error('Gemini response error');
            }
        })
        .catch(error => {
            alert("There was an error with gemini")

            console.error('Error with Gemini request:', error);
            throw new Error('Gemini fetch error');
        });
}


function displayChatbotResponse(response, userMessage) {
    const chatArea = document.getElementById('chatArea');

    // Display user message on the right
    const userMessageDiv = document.createElement('div');
    userMessageDiv.classList.add('bg-blue-500', 'text-white', 'p-2', 'rounded', 'my-2', 'ml-auto', 'w-fit');
    userMessageDiv.textContent = userMessage;
    chatArea.appendChild(userMessageDiv);

    // Display bot response on the left
    const botResponseDiv = document.createElement('div');
    botResponseDiv.classList.add('bg-blue-100', 'p-2', 'rounded', 'my-2', 'mr-auto', 'w-fit');
    botResponseDiv.textContent = response;
    chatArea.appendChild(botResponseDiv);

    // Scroll to the bottom of the chat area
    chatArea.scrollTop = chatArea.scrollHeight;
}