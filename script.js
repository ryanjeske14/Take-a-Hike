'use strict';

const APIKeys = {
    googleAPIKey: "AIzaSyBpGNCkuo-7-Tlsk3yemC4lOKKU0INK_G0",
    hikingProjectAPIKey: "200416494-34160fcf1c88684e66df571d7895a948"
};

const endPoints = {
    geocodeEndPoint: "https://maps.googleapis.com/maps/api/geocode/json",
    getTrailsEndPoint: "https://www.hikingproject.com/data/get-trails"
};

function handleDetailsButton() {
    $('#results').on('click', '#detailsButton', function(event) {
       console.log('details button clicked');
        $(this).closest('li').children('#details').toggleClass('hidden');
    });
}

function renderTrailImage(image) {
    let trailImage;
    if(image=="") {
        trailImage = "images/trail-image-default.jpg";
    }
    else {
        trailImage = image;
    }
    return trailImage;
}

function renderTrailDifficulty(difficulty) {
    let trailDifficulty;
    if (difficulty == "green") {
        trailDifficulty = `<i class="fas fa-circle"></i>`;
    }
    else if (difficulty == "greenBlue") {
        trailDifficulty = ` <i class="fas fa-circle"></i> <i class="fas fa-square"></i>`;
    }
    else if (difficulty == "blue") {
        trailDifficulty = `<i class="fas fa-square"></i>`;
    }
    else if (difficulty == "blueBlack") {
        trailDifficulty = `<i class="fas fa-square"></i> <i class="fas fa-square-full"></i>`;
    }
    else if (difficulty == "black") {
        trailDifficulty = `<i class="fas fa-square-full"></i>`;
    }
    else if (difficulty == "dblack") {
        trailDifficulty = `<i class="fas fa-square-full"></i> <i class="fas fa-square-full"></i>`;
    }
    else {
        trailDifficulty = `unknown`;
    }

    return trailDifficulty;
}

function renderTrailRating(rating) {
    let trailRating;
    if (rating >= 0 && rating < 1) {
        trailRating = `<i class="fas fa-star-half"></i>`;
    }
    else if (rating >= 1 && rating < 1.5) {
        trailRating = `<i class="fas fa-star"></i>`;
    } 
    else if (rating >= 1.5 && rating < 2) {
        trailRating = `<i class="fas fa-star"></i><i class="fas fa-star-half"></i>`;
    } 
    else if (rating >= 2 && rating < 2.5) {
        trailRating = `<i class="fas fa-star"></i><i class="fas fa-star"></i>`;
    } 
    else if (rating >= 2.5 && rating < 3) {
        trailRating = `<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half"></i>`;
    } 
    else if (rating >= 3 && rating < 3.5) {
        trailRating = `<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>`;
    } 
    else if (rating >= 3.5 && rating < 4) {
        trailRating = `<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half"></i>`;
    } 
    else if(rating >= 4 && rating < 4.5) {
        trailRating = `<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>`;
    } 
    else if (rating >= 4.5 && rating < 5) {
        trailRating = `<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half"></i>`;
    } 
    else if(rating == 5) {
        trailRating = `<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>`;
    } 
    else {
        trailRating = `Unknown`;
    }
    return trailRating;
}

function displayResults(responseJson, formattedAddress) {

    console.log(responseJson);
    $('#results').empty();
    $('#results').html(
        `<h2>Showing ${responseJson.trails.length} results for ${formattedAddress}</h2>
        <ul id="resultsList"></ul>
        <div id="attribution-section">
            <img src="images/powered_by_google.png" alt="powered by google" id="google-attribution" class="attribution">
            <img src="images/hiking-project-attribution.png" alt="hiking project" id="hiking-project-attribution" class="attribution">
        </div>`
    );

    for (let i = 0; i < responseJson.trails.length; i++){

      $('#resultsList').append(
        `<li><h3>${i+1}. <a href="${responseJson.trails[i].url}" target="_blank">${responseJson.trails[i].name}</a></h3>
        <p>${responseJson.trails[i].summary}</p>
        <div id="hikePic"><a href="${responseJson.trails[i].url}" target="_blank"><img src="${renderTrailImage(responseJson.trails[i].imgMedium)}"></a></div>
        <p>Trail Length: ${responseJson.trails[i].length} miles</p>
        <p>Rating: ${renderTrailRating(responseJson.trails[i].stars)}</p>
        <p class="hidden" id="details">Difficulty: <span class="star">${renderTrailDifficulty(responseJson.trails[i].difficulty)}</p>
        <p class="hidden" id="details">Ascent: <i class="fas fa-arrow-up"></i>  ${responseJson.trails[i].ascent} ft</p>
        <p class="hidden" id="details">Descent: ${responseJson.trails[i].descent} ft <i class="fas fa-arrow-down"></i></p>
        <p class="hidden" id="details">Trail Condition: ${responseJson.trails[i].conditionStatus}</p>
        <div class="buttonContainer"><button id="detailsButton">Show/Hide Details</button></div>
        <div class="buttonContainer"><a href="https://www.google.com/maps/dir/?api=1&destination=${responseJson.trails[i].latitude},${responseJson.trails[i].longitude}" target="_blank"><button id="directionsButton">Get Directions</button></a></div>
        </li>`
      )};
  };

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
};

function getHikeData(GPSData) {
    console.log(`Finding Hikes`);
    console.log($('#search-radius').val());
    const formattedAddress = GPSData.results[0].formatted_address;
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
    if ($('#max-results').val() != null) {
        params.maxResults = $('#max-results').val();
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
            else {displayResults(hikeData, formattedAddress);}
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
            else {
                getHikeData(GPSData);}
        })
        .catch(err => {
            $('#results').html(`<p id="js-error-message" class="error-message">Something went wrong: ${err.message}</p>`);
          });
};

function resultsScroll() {
    console.log("scrolling");
    $('html, body').animate({scrollTop: $("#results").offset().top},900)
}

function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      const searchTerm = $('#js-search-term').val();
      getGPSData(searchTerm);
      resultsScroll();
    });
  };

$(function() {
    console.log('App loaded! Waiting for submit!');
    watchForm();
    handleDetailsButton();
  });


  