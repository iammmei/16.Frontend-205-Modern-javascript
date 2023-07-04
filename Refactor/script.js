import Data from "./config.js";

const searchBar = document.querySelector('#searchBar');
const container = document.querySelector(".container");
const cityNameContainer = document.querySelector('.city-name');

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
console.log("hello world");

// Event will start on a keyup action
searchBar.addEventListener('keyup', handleSearch);

function handleSearch(event) {
  if (event.key === "Enter") {
    const thisCity = event.target.value.toLowerCase();
    const apiUrl = "https://api.openweathermap.org/data/2.5/forecast/?q=" + thisCity + "&appid=" + Data.key;
    event.currentTarget.value = '';

    fetchCityCoordinates(apiUrl);
  }
}

function fetchCityCoordinates(apiUrl) {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const lon = data.city.coord.lon;
      const lat = data.city.coord.lat;

      cityNameContainer.innerHTML = data.city.name;

      fetchWeatherData(lon, lat);
    })
    .catch(error => {
      console.error('Error:', "not a place!");
      clearContainer();
      alert("Are you sure you aren't holding your map upside down?");
    });
}

function fetchWeatherData(lon, lat) {
  const apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&cnt=5&units=metric&exclude=minutely,hourly,alerts&appid=" + Data.key;
  
  fetch(apiUrl)
    .then(response => response.json())
    .then(result => {
      console.log('Welcome to this basic weather app. this is not a product but the product of an academic exercise.')
      clearContainer();
      displayWeatherData(result);
    });
}

function displayWeatherData(result) {
  for (let i = 0; i < 5; i++) {
    const date = new Date();
    let dayOfTheWeek = weekdays[(date.getDay() + i) % 7];
    const weatherData = result.daily[i];

    const card = createCardElement();
    const cardImg = createCardImage(weatherData);
    const cardHeader = createCardHeader(dayOfTheWeek);
    const tempDescription = createTemperatureDescription(weatherData);
    const currentTempBox = createCurrentTemperatureBox();
    const currentTemp = createCurrentTemperature(weatherData);
    const minMaxTemperatures = createMinMaxTemperatures();
    const minTemp = createMinTemperature(weatherData);
    const maxTemp = createMaxTemperature(weatherData);

    currentTempBox.appendChild(currentTemp);
    minMaxTemperatures.appendChild(minTemp);
    minMaxTemperatures.appendChild(maxTemp);
    card.appendChild(cardImg);
    card.appendChild(cardHeader);
    card.appendChild(tempDescription);
    card.appendChild(currentTempBox);
    card.appendChild(minMaxTemperatures);
    container.appendChild(card);
  }
}

function createCardElement() {
  const card = document.createElement('div');
  card.classList.add("card");
  return card;
}

function createCardImage(weatherData) {
  const imageBox = document.createElement('div');
  imageBox.classList.add("imgBx");
  const cardImg = document.createElement('img');
  cardImg.src = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";
  imageBox.appendChild(cardImg);
  return imageBox;
}

function createCardHeader(dayOfTheWeek) {
  const cardHeader = document.createElement("h2");
  cardHeader.innerHTML = dayOfTheWeek;
  return cardHeader;
}

function createTemperatureDescription(weatherData) {
  const tempDescription = document.createElement("h4");
  tempDescription.innerHTML = weatherData.weather[0].description;
  return tempDescription;
}

function createCurrentTemperatureBox() {
  const currentTempBox = document.createElement("div");
  currentTempBox.classList.add("color");
  return currentTempBox;
}

function createCurrentTemperature(weatherData) {
  const currentTempHeader = document.createElement("h3");
  currentTempHeader.innerHTML = "Temp:";
  const currentTemp = document.createElement("span");
  currentTemp.classList.add("current-temp");
  currentTemp.innerHTML = weatherData.temp.day + "°C";
  currentTempBox.appendChild(currentTempHeader);
  return currentTemp;
}

function createMinMaxTemperatures() {
  const minMaxTemperatures = document.createElement("div");
  minMaxTemperatures.classList.add("details");
  return minMaxTemperatures;
}

function createMinTemperature(weatherData) {
  const minTemp = document.createElement("span");
  minTemp.classList.add("min-temp");
  minTemp.innerHTML = weatherData.temp.min + "°C";
  return minTemp;
}

function createMaxTemperature(weatherData) {
  const maxTemp = document.createElement("span");
  maxTemp.classList.add("max-temp");
  maxTemp.innerHTML = weatherData.temp.max + "°C";
  return maxTemp;
}

function clearContainer() {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}
