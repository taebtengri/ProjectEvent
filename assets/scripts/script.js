$(document).ready(function () {

    var APIKeyFoursquare = "client_id=SUS4V4KN3LDW2BEU5G4TJIRA2R3VK5GG4TA3A15VOOSYEMAE&client_secret=5NOZCH3QOPXR3VNYHJJH4SOMJRHVIIQV5BHWOLXX3WDHAY4J";
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2JyYW5ub24iLCJhIjoiY2owYTl2cDh4MGdqeDJxcGZhYjR3NzY1MyJ9.6nT2tLHDeMTpYnwMV7iV9w';

    var currentPosition = [-84.39, 33.74];
    var localEvents = [];

    function getDate() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd<10) {
            dd='0'+dd
        } 

        if (mm<10) {
            mm='0'+mm
        }

        return yyyy + "" + mm + "" + dd;
    }
    
    console.log(getDate());

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
            };  

        currentPosition = [pos.lng, pos.lat];
        map.setCenter(currentPosition);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }

    function displayPosition(position) {
        alert("Latitude: " + position.coords.latitude + ", Longitude: " + position.coords.longitude);
        currentPosition = [position.coords.latitiude, position.coords.longitutde];
        console.log(currentPosition);
    }

    function displayError(error) {
        var errors = { 
            1: 'Permission denied',
            2: 'Position unavailable',
            3: 'Request timeout'
        };
        alert("Error: " + errors[error.code]);
    }

    function getLocalData(category) {
        var queryUR = "https://api.foursquare.com/v2/venues/search?v=" + getDate() + "&ll=" +  currentPosition[1] + "%2C%20" + currentPosition[0]+ "&query=" + category + "&intent=checkin&radius=5000&limit=50&" + APIKeyFoursquare;
        console.log(queryUR);

        $.ajax({
            url: queryUR,
            method: "GET"
        }).done(function (response) {
            // Log the queryURL
            // console.log(queryUR);
            // Log the resulting object
            // console.log("API RESPONSE:");
            // console.log(response);
            // var pos = [];
            getEvent(response.response.venues);
        }); 
    }

    function getEvent(events) {
        for (var i = 0; i < events.length; i++) {
           var event = events[i];
           var coordinates = [events[i].location.lng, events[i].location.lat];
           var eventId = events[i].id;
           var eventPhoto = "";
           console.log("Event:");
           console.log(event);

           $.ajax({
                url: "https://api.foursquare.com/v2/venues/" +  eventId + "/photos?oauth_token=HFK1JZ2HF1EGBUMAIK3Z05YYYP4XPEY1F0HGXFPCPLJ4BRIG&v=20170317",
                method: "GET"
            }).done(function (response) {
                // Log the queryURL
                // console.log(queryUR);
                // Log the resulting object
                // console.log("API RESPONSE:");
                if (response.response.photos.items[0] != undefined) {
                    eventPhoto = response.response.photos.items[0].prefix + response.response.photos.items[0].suffix;
                    console.log(eventPhoto);
                }
            }); 

           var newFeature = {
                "type": "Feature",
                "properties": {
                    "message": events[i].name,
                    "phone": events[i].contact.formattedPhone,
                    "name": events[i].name,
                    "description": events[i],
                    "website": events[i].url,
                    "address": events[i].location.address,
                    "photo": eventPhoto,
                    "icon": "theatre",
                    "iconSize": [40, 40]
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": coordinates
                }
           };
           localEvents.push(newFeature);
        //    console.log(localEvents);
       }
    }

    getLocalData("food");

    var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/light-v9', //stylesheet location
        zoom: 17, // starting zoom
        // maxBounds: bounds, // Sets bounds as max
        pitch: 45, // pitch in degrees
        bearing: -60, // bearing in degrees
        minZoom: 15,
        maxZoom: 20,
        className: 'mapbox-marker animate'
    });

    map.scrollZoom.disable();
    map.scrollZoom.enable({ around: 'center' });
    map.dragPan.disable();

    map.on('load', function () {
        // Add a layer showing the places.
        console.log("Current position to set center:" + currentPosition);

        var currentEvents = localEvents;
        var eventsObject = {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": []
            }
        }

        for (var i = 0; i < currentEvents.length; i++) {
            eventsObject.data.features.push(currentEvents[i]);
            var el = document.createElement('div');
            el.className = 'marker';
            // el.style.backgroundImage = 'url(https://images.unsplash.com/photo-1473220464492-452fb02e6221?dpr=1&auto=compress,format&fit=crop&w=1199&h=800&q=80&cs=tinysrgb&crop=)';
                    
            new mapboxgl.Marker(el)
                .setLngLat(currentPosition)
                .addTo(map);

                console.log(el);
        }

        console.log(eventsObject);

        // add markers to map
        eventsObject.data.features.forEach(function(marker) {
            // create a DOM element for the marker
            var el = document.createElement('div');
            el.className = 'marker';
            el.style.backgroundImage = 'url(https://placekitten.com/g/' + marker.properties.iconSize.join('/') + '/)';
            el.style.width = marker.properties.iconSize[0] + 'px';
            el.style.height = marker.properties.iconSize[1] + 'px';

            el.addEventListener('click', function() {
                window.alert(marker.properties.name);
            });

            // add marker to map
            new mapboxgl.Marker(el, {offset: [-marker.properties.iconSize[0] / 2, -marker.properties.iconSize[1] / 2]})
                .setLngLat(marker.geometry.coordinates)
                .addTo(map);
        });
    });


    // When a click event occurs near a place, open a popup at the location of
    // the feature, with description HTML from its properties.
    // map.on('click', function (e) {
    //     var features = map.queryRenderedFeatures(e.point, { layers: ['places'] });

    //     if (!features.length) {
    //         return;
    //     }

    //     var feature = features[0];

    //     if (features.length) {
    //         // Get coordinates from the symbol and center the map on those coordinates
    //         map.flyTo({center: features[0].geometry.coordinates});
    //     }

    //     // Populate the popup and set its coordinates
    //     // based on the feature found.
    //     var popup = new mapboxgl.Popup()
    //         .setLngLat(feature.geometry.coordinates)
    //         .setHTML(feature.properties.description)
    //         .addTo(map);
    // });

    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    // Use the same approach as above to indicate that the symbols are clickable
    // by changing the cursor style to 'pointer'.
   map.on('mousemove', function(e) {
        // var features = map.queryRenderedFeatures(e.point, { layers: ['places'] });
        // Change the cursor style as a UI indicator.
        // map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

        // if (!features.length) {
        //     popup.remove();
        //     return;
        // }

        // var feature = features[0];

        // Populate the popup and set its coordinates
        // based on the feature found.
        // popup.setLngLat(feature.geometry.coordinates)
        //     .setHTML(feature.properties.description)
        //     .addTo(map);
    });

    $(".category").on("click", function(event) {
        event.preventDefault();
        var category = $(this).attr("data-attribute");
        console.log(category);
        getLocalData(category);
    })
});

