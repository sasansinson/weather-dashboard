var cityFormEl=document.querySelector("#city-search-form");
var cityInputEl=document.querySelector("#city");
var weatherContainer=document.querySelector("#current-weather-container");
var searchedCity=document.querySelector("#searched-city");
var forcastTitle=document.querySelector("#forcast");
var forcastContainer=document.querySelector("#fiveday-container");
var pastSearchBtn=document.querySelector("#past-search-buttons");
var allCities=[];
var apiKey="d0a347b8942b45951fbf0be9fbc98306";


var submitHandler = function(event){
  event.preventDefault();
  var cityEl = cityInputEl.value.trim();
  var city = cityEl.toUpperCase();
  if (city){
    getCityWeather(city);
    getForcastWeather(city);
    allCities.unshift({city});
    cityInputEl.value = "";
  } else {
    alert ("Please enter a city name");
  }
  saveSearch();
  searchHistory(city);
};


var getCityWeather = function(city){
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
  fetch(apiUrl)
  .then(function(response){
    response.json().then(function(data){
      displayWeather(data, city);
    });
  });
};


var getForcastWeather = function(city){
  var apiUrlSec =  `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`
  fetch(apiUrlSec)
  .then(function(response){
    response.json().then(function(data){
      displayForcast(data);
    });
  });
};


var saveSearch = function(){
  localStorage.setItem("allCities" , JSON.stringify(allCities));
};


var searchHistory = function(searchHistory){
  searchHistoryEl = document.createElement("button");
  searchHistoryEl.textContent = searchHistory;
  searchHistoryEl.classList = "d-flex w-100 btn-light border border";
  searchHistoryEl.setAttribute("data-city", searchHistory);
  searchHistoryEl.setAttribute("type", "submit");

  pastSearchBtn.prepend(searchHistoryEl);
};


var displayWeather = function(weather, searchCity){
  weatherContainer.textContent = "";
  searchedCity.textContent = searchCity;

     var currentDate = document.createElement("span");
     currentDate.textContent = " (" + moment(weather.dt.value).format("MMM D, YYYY") + ")";
     searchedCity.appendChild(currentDate);

     var weatherIcon = document.createElement("img");
     weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
     searchedCity.appendChild(weatherIcon);

     var temperature = document.createElement("span");
     temperature.textContent = "Temperature: " + weather.main.temp + "°F";
     temperature.classList = "List-group-item py-1"

     var humidity = document.createElement("span");
     humidity.textContent = "Humidity: " + weather.main.humidity + "%";
     humidity.classList = "List-group-item py-1";

     var windSpeed = document.createElement("span");
     windSpeed.textContent = "Wind Speed: " + weather.wind.speed + "MPH";
     windSpeed.classList = "List-group-item py-1";

     weatherContainer.appendChild(temperature);
     weatherContainer.appendChild(humidity);
     weatherContainer.appendChild(windSpeed);

     var lat = weather.coord.lat;
     var lon = weather.coord.lon;
     getUvIndex(lat,lon);
};


var getUvIndex = function(lat,lon){
  var apiUrlthrd = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
  fetch(apiUrlthrd)
  .then(function(response){
    response.json().then(function(data){
      displayUvIndex(data);
    });
  });
};


var displayUvIndex = function(index){
  var uvIndexEl = document.createElement("div");
  uvIndexEl.textContent = "UV Index: "
  uvIndexEl.classList = "List-group-item py-1";

  uvIndexValue = document.createElement("span");
  uvIndexValue.textContent = index.value;

  if (index.value <=2){
    uvIndexValue.classList = "favorable";
  } else if (index.value >2 && index.value<=8){
    uvIndexValue.classList = "moderate";
  } else 
  uvIndexValue.classList = "severe";

  uvIndexEl.appendChild(uvIndexValue);
  weatherContainer.appendChild(uvIndexEl);
};


var displayForcast = function(weather){
  forcastContainer.textContent = "";

  var forcast = weather.list;
     for (i=5; i<forcast.length;i=i+8){
       var dailyForecast = forcast[i];
       var forcastCard = document.createElement("div");
       forcastCard.classList = "card bg-success text-light m-2";

       var forcastDate = document.createElement("h5");
       forcastDate.textContent = moment.unix(dailyForecast.dt).format("MMM D, YYYY");
       forcastDate.classList = "card-header text-center";
       forcastCard.appendChild(forcastDate);

       var weatherIcon = document.createElement("img");
       weatherIcon.classList = "card-body text-center";
       weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);
       forcastCard.appendChild(weatherIcon);

       var forcastTemp = document.createElement("span");
       forcastTemp.classList = "card-body text-center";
       forcastTemp.textContent = "Temp: " + dailyForecast.main.temp + "°F";
       forcastCard.appendChild(forcastTemp);

       var forcastWindSpeed = document.createElement("span");
       forcastWindSpeed.classList = "card-body text-center";
       forcastWindSpeed.textContent = "Wind: " + dailyForecast.wind.speed + "MPH";
       forcastCard.appendChild(forcastWindSpeed);

       var forcastHum = document.createElement("span");
       forcastHum.classList = "card-body text-center";
       forcastHum.textContent = "Humidity: " + dailyForecast.main.humidity + "%";
       forcastCard.appendChild(forcastHum);

       forcastContainer.appendChild(forcastCard);

     };
};


var searchHistoryHandler = function(event){
  var city = event.target.getAttribute("data-city");
  if (city){
    getCityWeather(city);
    getForcastWeather(city);
  };
};


cityFormEl.addEventListener("submit", submitHandler);
pastSearchBtn.addEventListener("click", searchHistoryHandler);