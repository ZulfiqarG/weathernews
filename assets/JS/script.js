var APIkey = 'cdf99d234b178c14e018047fd5452bd0';
var wIcon = 'https://openweathermap.org/img/w/';

var searchInput = $('.weather-search');
var searchForm = $('#search-form');
var searchBtn = $('.search-button');

var todaySec = $('#today');
var forecastSec = $('#forecast');

var duplicateCheck = new Set(); ////////////////////////////////////////////////Use of "SET" means no duplcates
var clearBtn = $('.clear');

function LOAD() {
    for (key in localStorage) {
        $('#history').prepend(localStorage.getItem(key));
        duplicateCheck.add(localStorage.getItem(key))
    }

}
function CLEAR() {
    $('.historyItem').remove();
    localStorage.clear();
    duplicateCheck.clear();
}
LOAD();
$(clearBtn).click(CLEAR);


searchBtn.click(function (event) {
    event.preventDefault();
    var searchText = searchInput.val().trim();
    if (!searchText) {
        alert('please type a city name');
    } else {

        $.get(`https://api.openweathermap.org/data/2.5/weather?q=${searchText},IN&appid=${APIkey}&units=metric`)
            .catch(function () {
                alert('city not found, please check spelling')
            })

            .then(function (data) {
                //////////HISTORY\\\\\\\\\\//////////HISTORY\\\\\\\\\\//////////HISTORY\\\\\\\\\\//////////HISTORY\\\\\\\\\\//////////HISTORY\\\\\\\\\\
                var button = `<button class="btn-secondary mb-1 historyItem">${data.name}</button>`;

                /////////////////////////////////////////////////////////////////////////////////////Time Elements
                var currentTime = moment.unix(data.dt + data.timezone).format('hh:mm a');
                var sunrise = moment.unix(data.sys.sunrise + data.timezone).format('hh:mm a');
                var sunset = moment.unix(data.sys.sunset + data.timezone).format('hh:mm a')
                //////////////////////////////////////////////////////////////////////////////Add History Item (Button)
                duplicateCheck.add(button);
                $('.historyItem').remove();
                for (var item of duplicateCheck) {
                    $('#history').prepend(item)
                }
                localStorage.setItem($(button).text(), button);
                ////////////////////////////////////////////////////////////////////////////End of History Button Function
                //////////END_OF_HISTORY\\\\\\\\\\//////////END_OF_HISTORY\\\\\\\\\\//////////END_OF_HISTORY\\\\\\\\\\//////////END_OF_HISTORY\\\\\\\\\\//////////END_OF_HISTORY\\\\\\\\\\//////////END_OF_HISTORY\\\\\\\\\\

                //////////////////////////////////////////////////////////////////////////////Clear Previously Displayed Data
                todaySec.empty();
                forecastSec.empty();
                ///////////////////////////////////////////////////////////////////////////////Append New Data
                todaySec.append(`
                <div class="card p-4 w-100" id="todaysWeather">
                    <h2 class="cityName">${data.name} 
                        <img class="icon" src= ${wIcon + data.weather[0].icon + '.png'}></img>
                        ${currentTime}
                    </h2>
                    <h4 id="todayTemp">Temperature: ${data.main.temp}°C</h4>
                    <h4 id="todayWind">Wind Speed: ${data.wind.speed}KPH</h4>
                    <h4 id="todayTempumidity">Humidity: ${data.main.humidity}%</h4>
                    <h4 id="sunTimes">Sunrise: ${sunrise}, Sunset: ${sunset}</h4>
                </div>`
                )
                $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${APIkey}&units=metric`)
                    .then(function (FCData) {
                        ///////////////////////////////////////////////////////////////////////////////Add Cards from API Data (Forecast)
                        for (var i = 0; i <= 40; i += 3) {
                            forecastSec.append(`
                            <div class="card-body w-20">
                            <div class="card">
                                    <h5 class="date">${moment.unix(FCData.list[i].dt).format('Do MMM')}
                                        <img class="icon" src= ${wIcon + FCData.list[i].weather[0].icon + '.png'}></img>
                                    </h5>
                                    <h5 class="time">${moment.unix(FCData.list[i].dt).format('hh:mm a')}</h5>
                                    <p class="temp">Temp: ${FCData.list[i].main.temp}°C</p>
                                    <p class="wind">Wind Speed: ${FCData.list[i].wind.speed} KPH</p>
                                    <p class="humidity">Humidity: ${FCData.list[i].main.humidity}% </p>
                                </div>         
                                </div>
                                            `)
                        }
                    }
                    )
            })
    }
})
//////////////////////////////////////////////////////////////////////////////History Button Listener

$(document).on('click', '.historyItem', function () {
    var historyCityName = $(this)[0].innerHTML   ///////////////////////////////////////Button's text (cityName)
    $.get(`https://api.openweathermap.org/data/2.5/weather?q=${historyCityName},IN&appid=${APIkey}&units=metric`)
        .then(function (histSrchData) {
            ////////////////////////////////////////////////////////////////////////////////////Clear Previously Displayed Data
            var histCurrentTime = moment.unix(histSrchData.dt + histSrchData.timezone).format('hh:mm a');
            var historySunrise = moment.unix(histSrchData.sys.sunrise + histSrchData.timezone).format('hh:mm a');
            var historySunset = moment.unix(histSrchData.sys.sunset + histSrchData.timezone).format('hh:mm a');
            todaySec.empty();
            forecastSec.empty();
            ///////////////////////////////////////////////////////////////////////////////////Add New Today Data From API (History)
            todaySec.append(`
<div class="card p-4 w-100" id="todaysWeather">
<h2 class="cityName">${histSrchData.name} 
    <img class="icon" src= ${wIcon + histSrchData.weather[0].icon + '.png'}></img>
    ${histCurrentTime}
</h2>
<h4 id="todayTemp">Temperature: ${histSrchData.main.temp}°C</h4>
<h4 id="todayWind">Wind Speed: ${histSrchData.wind.speed}KPH</h4>
<h4 id="todayTempumidity">Humidity: ${histSrchData.main.humidity}%</h4>
<h4 id="sunTimes">Sunrise: ${historySunrise}, Sunset: ${historySunset}</h4>
</div>`)
            ////////////////////////////////////////////////////////////////////////////////////End of Append Today (History)

            $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${histSrchData.coord.lat}&lon=${histSrchData.coord.lon}&appid=${APIkey}&units=metric`)
                .then(function (HistForecast) {
                    ////////////////////////////////////////////////////////////////////////////////////Add Cards from API Data (Forecast)
                    for (var i = 0; i <= 40; i += 2) {
                        forecastSec.append(`
            <div class="card-body w-20">
            <div class="card">
                    <h5 class="date">${moment.unix(HistForecast.list[i].dt).format('Do MMM')}
                        <img class="icon" src= ${wIcon + HistForecast.list[i].weather[0].icon + '.png'}></img>
                    </h5>
                    <h5 class="time">${moment.unix(HistForecast.list[i].dt).format('hh:mm a')}</h5>
                    <p class="temp">Temp: ${HistForecast.list[i].main.temp}°C</p>
                    <p class="wind">Wind Speed: ${HistForecast.list[i].wind.speed} KPH</p>
                    <p class="humidity">Humidity: ${HistForecast.list[i].main.humidity}% </p>
                </div>         
                </div>
                            `)
                    }

                })
        }) //////////////////////////////////////////////////////////////////////////////////End of THEN Function
})


