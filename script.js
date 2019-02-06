'use strict';

const APIKeys = {
    googleAPIKey: "AIzaSyBpGNCkuo-7-Tlsk3yemC4lOKKU0INK_G0",
    hikingProjectAPIKey: "200416494-34160fcf1c88684e66df571d7895a948"
};

const endPoints = {
    geocodeEndPoint: "https://maps.googleapis.com/maps/api/geocode/json",
    getTrailsEndPoint: "https://www.hikingproject.com/data/get-trails"
};

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
};

function displayResults(responseJson) {

    console.log(responseJson);
    $('#results').empty();
    $('#results').html(
        `<h2>Search results</h2>
        <ul id="resultsList"></ul>`
    );

    for (let i = 0; i < responseJson.trails.length; i++){
  
      $('#resultsList').append(
        `<li><h3>${responseJson.trails[i].name}</h3>
        <p>${responseJson.trails[i].summary}</p>
        <p>Trail Length: ${responseJson.trails[i].length}</p>
        <p>Rating: ${responseJson.trails[i].stars}</p>
        <img src="${responseJson.trails[i].imgMedium}" id="hikePic">
        <div class="buttonContainer"><button type="submit" id="detailsButton">More Details</button></div>
        </li>`
      )};
  };


function getHikeData(GPSData) {
    console.log(`Finding Hikes`);
    console.log($('#search-radius').val());
    const params = {
        lat: GPSData.results[0].geometry.location.lat,
        lon: GPSData.results[0].geometry.location.lng,
        sort: "distance",
        key: APIKeys.hikingProjectAPIKey
    }

    if ($('#search-radius').val() != null) {
        params.maxDistance = $('#search-radius').val();
    }

    if ($('#trail-length').val() != null) {
        params.minLength = $('#trail-length').val();
    }
    if ($('#rating').val() != null) {
        params.minStars = $('#rating').val();
    }

    const querySting = formatQueryParams(params);
    const url = endPoints.getTrailsEndPoint + '?' + querySting;

    fetch(url)
        // if response.ok...
            // if hikes found matching search parameters, then pass response data to displayResults function
            // if no hikes found matching search parameters, render no hikes message
        // else (!response.ok), render error message
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(hikeData => {
            if (!hikeData.trails.length) {
                $('#results').html(`<p id="noHikeMatchErr" class="error-message">Could not find any hikes matching that search criteria. Please enter an alternate search and try again.`);
            }
            else {displayResults(hikeData);}
        })
        .catch(err => {
            $('#results').html(`<p id="js-error-message" class="error-message">Something went wrong: ${err.message}</p>`);
          });

};

function getGPSData(searchTerm) {
    console.log(`Getting GPS Coordinates`);
    const params = {
        address: searchTerm,
        key: APIKeys.googleAPIKey,
    };

    const queryString = formatQueryParams(params);
    const url = endPoints.geocodeEndPoint + '?' + queryString;

    fetch(url)
        // if response.ok...
            // if geocoding finds a place match, then pass response data to getHikeData function
            // if there is no place match (status === ZERO_RESULTS), render no place match message
        // else (!response.ok), render error message
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(GPSData => {
            if (GPSData.status === "ZERO_RESULTS") {
                $('#results').html(`<p id="noPlaceMatchErr" class="error-message">Could not find a place matching '${searchTerm}'. Please enter an alternate search and try again.`);
            }
            else {getHikeData(GPSData);}
        })
        .catch(err => {
            $('#results').html(`<p id="js-error-message" class="error-message">Something went wrong: ${err.message}</p>`);
          });
};

function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      const searchTerm = $('#js-search-term').val();
      getGPSData(searchTerm);
      $('#js-search-term').val("");
    });
  };

$(function() {
    console.log('App loaded! Waiting for submit!');
    watchForm();
  });


  