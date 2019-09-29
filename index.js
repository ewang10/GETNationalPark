'user strict';

const apiKey = "WMEvTd475PZ5cOUyMgxfrCpIsGaHzSw4dYhVnekR";

const searchURL = "https://developer.nps.gov/api/v1/parks";

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function displayAddresses(address) {

    $(".address-list").append(
        `<li>
        <p>${address.type}</p>
        <p>${address.line1}</p>
        <p>${address.line2}</p>
        <p>${address.line3}</p>
        <p>${address.city}, ${address.stateCode} ${address.postalCode}</p>
      </li>`
    );
}

function displayResults(responseJson) {
    console.log(responseJson);
    $('#results-list').empty();
    for (let i = 0; i < responseJson.data.length; i++) {
        $('#results-list').append(
            `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <a href='${responseJson.data[i].url}'>${responseJson.data[i].url}</a>
      </li>`
        );
    }
    $('#results').removeClass('hidden');
}

function getParks(states, maxResults) {
    const params = {
        api_key: apiKey,
        stateCode: states.split(","),
        limit: maxResults,
    };

    console.log(params.stateCode);

    const queryString = formatQueryParams(params);
    const url = searchURL + '?' + queryString;
    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            displayResults(responseJson);
        })
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function watchForm() {
    $("form").on("submit", function (event) {
        event.preventDefault();
        const states = $("#js-search-state").val();
        const maxResults = $("#js-max-results").val();
        getParks(states, maxResults);
    });
}

$(watchForm);