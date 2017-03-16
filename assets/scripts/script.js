$(document).ready(function () {

    var fourSquareAPI = "https://api.foursquare.com/v2/venues/search?v=20161016&ll=33.74%2C%20-84.398&query=music&intent=checkin&client_id=SUS4V4KN3LDW2BEU5G4TJIRA2R3VK5GG4TA3A15VOOSYEMAE&client_secret=5NOZCH3QOPXR3VNYHJJH4SOMJRHVIIQV5BHWOLXX3WDHAY4J";
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2JyYW5ub24iLCJhIjoiY2owYTl2cDh4MGdqeDJxcGZhYjR3NzY1MyJ9.6nT2tLHDeMTpYnwMV7iV9w';

    // var bounds = [
    //     [-74.04728500751165, 40.68392799015035], // Southwest coordinates
    //     [-73.91058699000139, 40.87764500765852]  // Northeast coordinates
    // ];

    var currentPosition = [-84.39, 33.74];

    if (navigator.geolocation) {
    // do fancy stuff
        var timeoutVal = 10 * 1000 * 1000;
        navigator.geolocation.getCurrentPosition(
            displayPosition, 
            displayError,
            { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
        );
        console.log("true");
    }

    function displayPosition(position) {
        alert("Latitude: " + position.coords.latitude + ", Longitude: " + position.coords.longitude);
        currentPosition = [position.coords.latitiude, position.coords.longitutde];
    }

    function displayError(error) {
        var errors = { 
            1: 'Permission denied',
            2: 'Position unavailable',
            3: 'Request timeout'
        };
        alert("Error: " + errors[error.code]);
    }

    var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/light-v9', //stylesheet location
        center: currentPosition, // starting position
        zoom: 17, // starting zoom
        // maxBounds: bounds, // Sets bounds as max
        pitch: 45, // pitch in degrees
        bearing: -60, // bearing in degrees
        minZoom: 15,
        maxZoom: 17,
        className: 'mapbox-marker animate'
    });

    map.scrollZoom.disable();
    map.scrollZoom.enable({ around: 'center' });
    map.dragPan.disable();

    map.on('load', function () {
        // Add a layer showing the places.
        map.addLayer({
            "id": "places",
            "type": "symbol",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "properties": {
                            "description": "<strong>Make it Mount Pleasant</strong><p><a href=\"http://www.mtpleasantdc.com/makeitmtpleasant\" target=\"_blank\" title=\"Opens in a new window\">Make it Mount Pleasant</a> is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>",
                            "icon": "theatre"
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": currentPosition
                        }
                    }, {
                        "type": "Feature",
                        "properties": {
                            "description": "<strong>Mad Men Season Five Finale Watch Party</strong><p>Head to Lounge 201 (201 Massachusetts Avenue NE) Sunday for a <a href=\"http://madmens5finale.eventbrite.com/\" target=\"_blank\" title=\"Opens in a new window\">Mad Men Season Five Finale Watch Party</a>, complete with 60s costume contest, Mad Men trivia, and retro food and drink. 8:00-11:00 p.m. $10 general admission, $20 admission and two hour open bar.</p>",
                            "icon": "theatre"
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": currentPosition
                        }
                    }]
                }
            },
            "layout": {
                "icon-image": "{icon}-15",
                "icon-allow-overlap": true
            }
        });
    });


    // When a click event occurs near a place, open a popup at the location of
    // the feature, with description HTML from its properties.
    map.on('click', function (e) {
        // $.ajax({
        //     url: fourSquareAPI,
        //     method: "GET"
        // }).done(function(response) {
        //     console.log(JSON.stringify(response));
        // }).fail(function(response) {
        //     console.log(JSON.stringify(response));
        // });

        var features = map.queryRenderedFeatures(e.point, { layers: ['places'] });

        if (!features.length) {
            return;
        }

        var feature = features[0];

        if (features.length) {
            // Get coordinates from the symbol and center the map on those coordinates
            map.flyTo({center: features[0].geometry.coordinates});
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        var popup = new mapboxgl.Popup()
            .setLngLat(feature.geometry.coordinates)
            .setHTML(feature.properties.description)
            .addTo(map);
    });

    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    // Use the same approach as above to indicate that the symbols are clickable
    // by changing the cursor style to 'pointer'.
   map.on('mousemove', function(e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['places'] });
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

        if (!features.length) {
            popup.remove();
            return;
        }

        var feature = features[0];

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(feature.geometry.coordinates)
            .setHTML(feature.properties.description)
            .addTo(map);
    });
});

