import Data from "./config.js";

const searchBar = document.querySelector("#searchBar");
const container = document.querySelector(".container");
const cityNameContainer = document.querySelector(".city-name");

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

console.log("hello world");

// Event listener for the search bar
searchBar.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const thisCity = event.target.value.toLowerCase();
    const apiUrl =
      "https://api.openweathermap.org/data/2.5/forecast/?q=" +
      thisCity +
      "&appid=" +
      Data.key;
    event.currentTarget.value = "";

    // Fetching the first API to get the city coordinates
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const lon = data.city.coord.lon;
        const lat = data.city.coord.lat;
        cityNameContainer.innerHTML = data.city.name;

        // Fetching final data according to the coordinates
        fetch(
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
            lat +
            "&lon=" +
            lon +
            "&cnt=5&units=metric&exclude=minutely,hourly,alerts&appid=" +
            Data.key
        )
          .then((response) => response.json())
          .then((result) => {
            console.log(
              "Welcome to this basic weather app. This is not a product but the product of an academic exercise."
            );

            // Removing all child elements from the container before creating a new set of elements
            while (container.firstChild) {
              container.removeChild(container.firstChild);
            }

            // Looping through 5 days of weather data
            for (let i = 0; i < 5; i++) {
              const date = new Date();
              let dayOfTheWeek = weekdays[(date.getDay() + i) % 7];
              const weatherData = result.daily[i];

              // Create the elements with data
              const card = document.createElement("div");
              card.classList.add("card");
              container.appendChild(card);

              const imageBox = document.createElement("div");
              imageBox.classList.add("imgBx");
              card.appendChild(imageBox);

              const cardImg = document.createElement("img");
              cardImg.src =
                "http://openweathermap.org/img/wn/" +
                weatherData.weather[0].icon +
                "@2x.png";
              imageBox.appendChild(cardImg);

              const contentBox = document.createElement("div");
              contentBox.classList.add("contentBx");
              card.appendChild(contentBox);

              const cardHeader = document.createElement("h2");
              cardHeader.innerHTML = dayOfTheWeek;
              contentBox.appendChild(cardHeader);

              const tempDescription = document.createElement("h4");
              tempDescription.innerHTML = weatherData.weather[0].description;
              contentBox.appendChild(tempDescription);

              const currentTempBox = document.createElement("div");
              currentTempBox.classList.add("color");
              contentBox.appendChild(currentTempBox);

              const currentTempHeader = document.createElement("h3");
              currentTempHeader.innerHTML = "Temp:";
              currentTempBox.appendChild(currentTempHeader);

              const currentTemp = document.createElement("span");
              currentTemp.classList.add("current-temp");
              currentTemp.innerHTML = weatherData.temp.day + "°C";
              currentTempBox.appendChild(currentTemp);

              const minMaxTemperatures = document.createElement("div");
              minMaxTemperatures.classList.add("details");
              contentBox.appendChild(minMaxTemperatures);

              const minMaxTempHeader = document.createElement("h3");
              minMaxTempHeader.innerHTML = "More:";
              minMaxTemperatures.appendChild(minMaxTempHeader);

              const minTemp = document.createElement("span");
              minTemp.classList.add("min-temp");
              minTemp.innerHTML = weatherData.temp.min + "°C";
              minMaxTemperatures.appendChild(minTemp);

              const maxTemp = document.createElement("span");
              maxTemp.classList.add("max-temp");
              maxTemp.innerHTML = weatherData.temp.max + "°C";
              minMaxTemperatures.appendChild(maxTemp);
            }
          });
      })
      .catch((error) => {
        console.error("Error:", "not a place!");

        // If there are errors, send out an error message
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
        return alert("Are you sure you aren't holding your map upside down?");
      });
  }
});
