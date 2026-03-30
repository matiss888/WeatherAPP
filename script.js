// Get elements by id
const inputText = document.getElementById("input-text");
const inputBtn = document.getElementById("input-button");
const weatherContainer = document.getElementById("weather-container");
const cardBody = document.querySelector(".card-body");

//Event listeners

inputBtn.addEventListener("click", getWeather);

// constants

const weatherImages = {
    0: "sunny.jpg",
    1: "cloudy.jpg",
    2: "cloudy.jpg",
    3: "cloudy.jpg",
    61: "rainy.jpg",
    63: "rainy.jpg",
    65: "rainy.jpg",
    71: "snow.jpg",
    95: "lightning.jpg"
}

// Functions

async function getWeather() {
    try {
        if(inputText.value === "") {
            return;
        }
            // Getting location coordinates
            const locationData = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${inputText.value}&count=1`);    
            if(locationData.ok) {
                const locationDataJson = await locationData.json();
                if(!locationDataJson.results || locationDataJson.results.length === 0) {
                    weatherContainer.innerHTML = "";
                    const notFound = document.createElement("h2");
                    notFound.textContent = "Not found";
                    notFound.classList.add("danger");
                    weatherContainer.appendChild(notFound);
                    
                    return;
                }
                const locationLatitude = locationDataJson.results[0].latitude
                const locationLongitude = locationDataJson.results[0].longitude

                // Getting temperature from fetch from different API

                const weatherData = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${locationLatitude}&longitude=${locationLongitude}&current=temperature_2m,weathercode,windspeed_10m,relativehumidity_2m,precipitation`);
                
                
                if(weatherData.ok) {
                    const weatherDataJson = await weatherData.json();

                    // Getting temperature
                    const currentTemp = weatherDataJson.current.temperature_2m
                    const currentTempUnits = weatherDataJson.current_units.temperature_2m

                    // Getting windspeed

                    const currentWind = weatherDataJson.current.windspeed_10m;
                    const currentWindUnits = weatherDataJson.current_units.windspeed_10m;

                    // Getting relative humidity

                    const currentHumidity = weatherDataJson.current.relativehumidity_2m;
                    const currentHumidityUnits = weatherDataJson.current_units.relativehumidity_2m;

                    // Getting precipitation

                    const currentPrecipitation = weatherDataJson.current.precipitation;
                    const currentPrecipitationUnits = weatherDataJson.current_units.precipitation;
                    
                    // Clear previous or just clear space
                    weatherContainer.innerHTML = "";

                    // Set the background according to the weather

                    const weatherCode = weatherDataJson.current.weathercode;
                    cardBody.style.backgroundImage = `url('images/${weatherImages[weatherCode]}')`;

                    // Get the city name
                    const cityName = document.createElement("h2");
                    cityName.textContent = locationDataJson.results[0].name;
                    weatherContainer.appendChild(cityName);

                    // Create container for all data
                    const dataContainer = document.createElement("section");
                    weatherContainer.appendChild(dataContainer);
                    dataContainer.classList.add("data-container");

                    // Create four cards for data
                    function createDataCard(title,data,units) {
                        const oneCard = document.createElement("div");
                        oneCard.classList.add("one-card");
                        const oneCardTitle = document.createElement("h3");
                        const oneCardData = document.createElement("p");
                        oneCard.appendChild(oneCardTitle);
                        oneCard.appendChild(oneCardData);
                        oneCardTitle.textContent = title;
                        oneCardData.textContent = data + " " + units;
                        return oneCard;
                    };
                    dataContainer.appendChild(createDataCard("Temperature",currentTemp, currentTempUnits));
                    dataContainer.appendChild(createDataCard("Windspeed",currentWind, currentWindUnits));
                    dataContainer.appendChild(createDataCard("Humidity",currentHumidity, currentHumidityUnits));
                    dataContainer.appendChild(createDataCard("Precipitation",currentPrecipitation, currentPrecipitationUnits));


                }
        }
        inputText.textContent = "";
    } catch (error) {
        console.log("Error", error.message);
    }
}