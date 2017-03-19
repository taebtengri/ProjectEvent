$(document).ready(function () {
    var config = {
        apiKey: "AIzaSyA3dyltamfojStja-0yxqnNqmS4QA-6S3M",
        authDomain: "mapchat-17eba.firebaseapp.com",
        databaseURL: "https://mapchat-17eba.firebaseio.com",
        storageBucket: "mapchat-17eba.appspot.com",
        messagingSenderId: "484471510094"
    };
    firebase.initializeApp(config);

    var database = firebase.database(),
        users = database.ref("users"),    
        chat = database.ref("chat");
    
    

    users.on("value", getUserData, errUserData);
    chat.on("value", getChatData, errChatData);

    // call this if there is an update to chat data.
    function getChatData(data) {
        var log = data.val();
        // var chatKeys = Object.keys(log);
        // setChatData(log, chatKeys);
    }

    // if there is an update to chat data call this to place in DOM.
    function setChatData(chat, chatKeys) {
        // $("#chat-card").empty();
        // for (var i = 0; i < chatKeys.length; i++) {
        //     let key = chatKeys[i];
        //     let name = chat[key].name;
        //     let message = chat[key].message;
        //     let messageStatus = chat[key].messageStatus;
        //     let playerNumber = chat[key].player_number;

        //     if (messageStatus == "leave") {
        //         $("#chat-card").append("<p><span class='player-left'>" + name + " " + message  +"</span></p>");
        //     } else {
        //         $("#chat-card").append("<p><span class='player" + playerNumber + "-chat'>" + name + "</span>: " + message + "</p>");
        //     }
        // }
    }

      // if user data changes call this
    function getUserData(data) {
        console.log("User Data Update");
    }

     // log if error received from chat data value.
    function errUserData(err) {
        console.log(err);
    }

    // log if error received from chat data value.
    function errChatData(err) {
        console.log(err);
    }

    var APIKeyFoursquare = "client_id=SUS4V4KN3LDW2BEU5G4TJIRA2R3VK5GG4TA3A15VOOSYEMAE&client_secret=5NOZCH3QOPXR3VNYHJJH4SOMJRHVIIQV5BHWOLXX3WDHAY4J";
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2JyYW5ub24iLCJhIjoiY2owYTl2cDh4MGdqeDJxcGZhYjR3NzY1MyJ9.6nT2tLHDeMTpYnwMV7iV9w';

    var currentPosition = [-84.39, 33.74],
        localEvents = [],
        category = "music";

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

    

    function getLocalData(category) {
        var queryUR = "https://api.foursquare.com/v2/venues/search?v=" + getDate() + "&ll=" +  currentPosition[1] + "%2C%20" + currentPosition[0]+ "&query=" + category + "&intent=checkin&radius=5000&limit=50&" + APIKeyFoursquare;
        console.log(queryUR);

        // Call to foursquare for nearby location data
        $.ajax({
            url: queryUR,
            method: "GET"
        }).done(function (response) {
            var locations = response.response.venues;

            for (var i = 0; i < locations.length; i++) {

            }

            // pass response venue data to get locations
            getLocations(response.response.venues);
        }); 
    }

    // Loop through locations  
    function getLocations(locations) {
        localEvents = [];
        for (var i = 0; i < locations.length; i++) {
           var location = locations[i];
           var coordinates = [locations[i].location.lng, locations[i].location.lat];
           var locationId = locations[i].id;
           var locationPhoto = "";

           var newFeature = {
                "type": "Feature",
                "properties": {
                    "message": locations[i].name,
                    "phone": locations[i].contact.formattedPhone,
                    "name": locations[i].name,
                    "description": locations[i],
                    "distance": locations[i].location.distance,
                    "website": locations[i].url,
                    "address": locations[i].location.address,
                    "photo": locationPhoto,
                    "icon": "theatre",
                    "iconSize": [40, 40]
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": coordinates
                }
           }; 
            
           // Call to foursquare using location ID to get photo of location 
            $.ajax({
                url: "https://api.foursquare.com/v2/venues/" +  locationId + "/photos?oauth_token=HFK1JZ2HF1EGBUMAIK3Z05YYYP4XPEY1F0HGXFPCPLJ4BRIG&v=20170317",
                method: "GET"
            }).done(function (response) {
                // Log the queryURL
                console.log(response);
                // Log the resulting object
                // console.log("API RESPONSE:");
                if (response.response.photos.items[0] != undefined) {
                    locationPhoto = response.response.photos.items[0].prefix + "200x200" + response.response.photos.items[0].suffix;
                    console.log(locationPhoto);
                }
            });  

           
           localEvents.push(newFeature);
       }
    }

    // Get data of nearby locations 
    getLocalData(category);
    
    // Creates our map and adds it to div with ID: map
    var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/light-v9', //stylesheet location
        zoom: 17, // starting zoom
        pitch: 45, // pitch in degrees
        bearing: -60, // bearing in degrees
        minZoom: 15,
        maxZoom: 17,
        className: 'mapbox-marker animate'
    });
    
    function setUserMarker() {
        // create a DOM element for the marker
        var el = document.createElement('div');
        el.className = 'userMarker';
        el.style.backgroundColor = 'black';
        el.style.width = '20px';
        el.style.height = '20px';

        console.log("USER MARKER");

        // create the popup
        var userPopup = new mapboxgl.Popup({offset: 25})
            .setText("You Are Here");

        // add marker to map to show current location
        new mapboxgl.Marker(el, {offset: [-20/ 2, -20 / 2]})
            .setLngLat(currentPosition)
            .setPopup(userPopup)
            .addTo(map);
    }

    // Lock zoom to center and disable dragging of map.
    map.doubleClickZoom.disable();
    map.scrollZoom.disable();
    map.scrollZoom.enable({ around: 'center' });
    map.dragPan.disable();

    // Creates markers and popups from our JSON response and populates the map with them
    function buildCategoryMarkers() {
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
        }

        console.log(localEvents);

        // add markers to map
        eventsObject.data.features.forEach(function(marker) {
            // create a DOM element for the marker
            var el = document.createElement('div');
            el.className = 'marker ' + category;
            el.style.backgroundImage = 'url(https://placekitten.com/g/' + marker.properties.iconSize.join('/') + '/)';
            el.style.width = marker.properties.iconSize[0] + 'px';
            el.style.height = marker.properties.iconSize[1] + 'px';

            el.addEventListener('click', function() {
                // window.alert(marker.properties.name);
            });
            console.log("IMAGE PROPERTY:");
            console.log("Image: " + marker.properties.photo);
            // create the popup
            var popup = new mapboxgl.Popup({offset: 25})
                .setText(marker.properties.name);

            // add marker to map
            new mapboxgl.Marker(el, {offset: [-marker.properties.iconSize[0] / 2, -marker.properties.iconSize[1] / 2]})
                .setLngLat(marker.geometry.coordinates)
                .setPopup(popup)
                .addTo(map);
            
            console.log(marker.geometry.coordinates);
        });
    }

    // Load map
    map.on('load', function () {
        // Add a layer showing the places.
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };  

            // set center of map to our position.            
            currentPosition = [pos.lng, pos.lat];
            map.setCenter(currentPosition);
            $(".userMarker").remove();
            setUserMarker();    

            }, function () {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
        console.log("Current position to set center:" + currentPosition);
        buildCategoryMarkers();
    });

    // 
    $(".category").on("click", function(event) {
        event.preventDefault();
        $(".marker").remove();
        var category = $(this).attr("data-attribute");
        console.log(category);
        getLocalData(category);
        buildCategoryMarkers();
    });

    // Close drawer if you choose a category from the list in the drawer
    $(".drawer-category").on("click", function() {
        $(".mdl-layout__obfuscator").trigger("click");
    });
    
    // Close drawer if you click the close button for when you don't want to choose new category
    $("#close-drawer").on("click", function() {
        $(".mdl-layout__obfuscator").trigger("click");
    });
});

