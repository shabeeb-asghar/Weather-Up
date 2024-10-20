# Weather App with Chatbot

## Overview

This project is a weather application that allows users to search for the weather forecast in various cities. It features a chatbot integrated with the Google Gemini API, which helps users by answering queries related to weather conditions and more. The app fetches weather data from the OpenWeather API and displays it in a paginated table format.

## Features

- Search for weather forecasts by city name.
- Display temperature forecasts for the next few days.
- Chatbot integration for handling user queries.
- Follow-up queries until a new city is specified or the chatbot is cleared.
- Clear button to reset the chatbot conversation.

## Technologies Used

- **HTML**: For the structure of the web application.
- **CSS**: For styling the application (using Tailwind CSS for utility-first styling).
- **JavaScript**: For interactivity and API calls.
- **OpenWeather API**: To fetch weather data.
- **Google Gemini API**: To process user queries and provide intelligent responses.

## Getting Started

### Prerequisites

- An OpenWeather API key. You can sign up at [OpenWeather](https://openweathermap.org/) to get your API key.
- A Google Gemini API key. You can access the Google Cloud Platform to enable the Gemini API and obtain your key.

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd weather-app
Open index.html in your preferred web browser.

Make sure to replace the API keys in the JavaScript file (tables.js) with your own keys:

javascript
Copy code
const apiKey = 'YOUR_OPENWEATHER_API_KEY';
const geminiApiKey = 'YOUR_GEMINI_API_KEY';
Usage
Enter a city name in the search bar and click the "Get Weather" button to fetch the weather forecast.
Use the chatbot to ask questions about the weather. Queries containing "weather" will trigger the chatbot to analyze the city.
Follow-up queries can be made without specifying the city again until a new city is searched or the chatbot is cleared.
The "Clear" button resets the chatbot conversation.
File Structure
graphql
Copy code
weather-app/
│
├── index.html         # Main HTML file
├── style.css          # Custom CSS file (if applicable)
├── tables.js          # JavaScript file containing logic for weather data and chatbot
└── Me.png             # User avatar/image for the chatbot
License
This project is open-source and available under the MIT License.

Acknowledgements
OpenWeather API for weather data.
Google Gemini API for natural language processing.
Tailwind CSS for styling the application.
vbnet
Copy code

### Notes:
- Replace `<repository-url>` with the actual URL of your repository.
- Adjust the file structure section as necessary if your actual structure differs.
- Make sure to include any other relevant information or acknowledgments as needed.
