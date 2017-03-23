$(document).ready(function () {
    var config = {
        apiKey: "AIzaSyA3dyltamfojStja-0yxqnNqmS4QA-6S3M",
        authDomain: "mapchat-17eba.firebaseapp.com",
        databaseURL: "https://mapchat-17eba.firebaseio.com",
        storageBucket: "mapchat-17eba.appspot.com",
        messagingSenderId: "484471510094"
    };
    firebase.initializeApp(config);
    var currentChatroom;
    var user = firebase.auth().currentUser;
    var database = firebase.database();
    var chat = database.ref("chat");
    var chatlist = [];
    var currentUser;

    const txtEmail = $("#email");
    const txtPassword = $("#password");
    const loginBtn = $("#signin");
    const signUpBtn = $("#register");
    const logoutBtn = $("#signout");

    firebase.auth().onAuthStateChanged(function(user) {
        // Add display name to user profile. Probably should move this somewhere else
        user = firebase.auth().currentUser;
        if (user) {
            console.log("CURRENT USER");
            currentUser = user;
            console.log(currentUser);
        } else {
            console.log("not logged in");
        }
    });

    chat.on("value", getChatData, errChatData);

    // call this if there is an update to chat data.
    function getChatData(data) {
        var log = data.val();
        if (log != null && currentChatroom != undefined) {
            var currentChatKeys = Object.keys(log[currentChatroom]);
            console.log("KEYS");
            console.log(log[currentChatroom]);
            setChatData(log[currentChatroom], currentChatKeys);
        }
    }

    // if there is an update to chat data call this to place in DOM.
    function setChatData(log, chatKeys) {
        $("#log").empty();
        console.log("Connected to chat");
        for (var i = 0; i < chatKeys.length; i++) {
            let key = chatKeys[i];
            let message = log[key].message;
            let name = log[key].user;

            console.log(name);
            console.log(message);
            $("#log").append("<p class='messages'><span>" + name + "</span>: " + message + "</p><br>");
        }
        
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

    
    function getLocalData(category) {
        $(".marker").remove();
        var queryUR = "https://api.foursquare.com/v2/venues/search?v=" + getDate() + "&ll=" +  currentPosition[1] + "%2C%20" + currentPosition[0]+ "&query=" + category + "&intent=checkin&radius=5000&limit=50&" + APIKeyFoursquare;
        console.log(queryUR);

        // Call to foursquare for nearby location data
        $.ajax({
            url: queryUR,
            method: "GET"
        }).done(function (response) {
            var locations = response.response.venues;
            // pass response venue data to get locations
            getLocations(locations, category);
        }); 
    }

    // Loop through locations  
    function getLocations(locations, category) {
        console.log(category);
        localEvents = [];
        for (var i = 0; i < locations.length; i++) {
           var location = locations[i];
           var coordinates = [locations[i].location.lng, locations[i].location.lat];
           var locationId = locations[i].id;
           var markerImages = {
                "Coffee": "https://images.unsplash.com/photo-1413745094207-a01b234cc32f?dpr=1&auto=compress,format&fit=crop&w=991&h=557&q=80&cs=tinysrgb&crop=",
                "Food": "https://images.unsplash.com/photo-1485962398705-ef6a13c41e8f?dpr=1&auto=compress,format&fit=crop&w=376&h=564&q=80&cs=tinysrgb&crop=",
                "Bar": "https://images.unsplash.com/photo-1474314005122-3c07c4df1224?dpr=1&auto=compress,format&fit=crop&w=376&h=251&q=80&cs=tinysrgb&crop=",
                "music": "https://images.unsplash.com/photo-1468164016595-6108e4c60c8b?dpr=1&auto=compress,format&fit=crop&w=1199&h=799&q=80&cs=tinysrgb&crop="
            }

           var newFeature = {
                "type": "Feature",
                "properties": {
                    "id": locationId,
                    "message": locations[i].name,
                    "phone": locations[i].contact.formattedPhone,
                    "name": locations[i].name,
                    "description": locations[i],
                    "distance": locations[i].location.distance,
                    "website": locations[i].url,
                    "address": locations[i].location.address,
                    "photo": markerImages[category],
                    "icon": "theatre",
                    "iconSize": [40, 40]
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": coordinates
                }
           };
            
           // Call to foursquare using location ID to get photo of location 
            // $.ajax({
            //     url: "https://api.foursquare.com/v2/venues/" +  locationId + "/photos?oauth_token=HFK1JZ2HF1EGBUMAIK3Z05YYYP4XPEY1F0HGXFPCPLJ4BRIG&v=20170317",
            //     method: "GET"
            // }).done(function (response) {
            //     // Log the queryURL
            //     console.log(response);
            //     // Log the resulting object
            //     // console.log("API RESPONSE:");
            //     if (response.response.photos.items[0] != undefined) {
            //         locationPhoto = response.response.photos.items[0].prefix + "200x200" + response.response.photos.items[0].suffix;
            //         console.log(locationPhoto);
            //     }
            // });  
           localEvents.push(newFeature);
       }
    }

    // Get data of nearby locations 
    
    
    // Creates our map and adds it to div with ID: map
    var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/light-v9', //stylesheet location
        zoom: 17, // starting zoom
        pitch: 45, // pitch in degrees
        bearing: -60, // bearing in degrees
        minZoom: 13,
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
        $(el).css("transition", "all 0.75s ease");

        el.addEventListener('mouseover', function() {
            $(el).css("background-color", "blue");
            $(el).css("width", "40px");
            $(el).css("height", "40px");
        });

        el.addEventListener('mouseout', function() {
            $(el).css("background-color", "black");
            $(el).css("width", "20px");
            $(el).css("height", "20px");
        });

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
    map.touchZoomRotate.enable();

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

        // add markers to map
        eventsObject.data.features.forEach(function(marker) {
            // create a DOM element for the marker
            var el = document.createElement('div');
            el.className = 'marker ' + category;
            el.setId = marker.properties.id;
            el.style.backgroundImage = 'url(' + marker.properties.photo;
            el.style.width = marker.properties.iconSize[0] + 'px';
            el.style.height = marker.properties.iconSize[1] + 'px';

            el.addEventListener('hover', function() {
                window.alert(marker.properties.name);
            });
            // console.log("IMAGE PROPERTY:");
            // console.log("Image: " + marker.properties.photo);
            // create the popup
            var popup = new mapboxgl.Popup({offset: 25})
                .setHTML('<p>' + marker.properties.name + '</p><button class="mdl-button mdl-js-button mdl-button--raised chat" id="' + el.setId + '">Chat</button>');

            // add marker to map
            new mapboxgl.Marker(el, {offset: [-marker.properties.iconSize[0] / 2, -marker.properties.iconSize[1] / 2]})
                .setLngLat(marker.geometry.coordinates)
                .setPopup(popup)
                .addTo(map);
            
            // console.log(marker.geometry.coordinates);
        });
    }

    // Load map
    map.on('load', function () {
        // Add a layer showing the places.
        getLocation();
            console.log("test");
        // Update location every 2 seconds
        // window.setInterval(function() {
        //     getLocation();
        //     console.log("test");
        // }, 2000);

        // Try HTML5 geolocation.
        function getLocation() {
            if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };  
                console.log(pos.lat);
                console.log(pos.lng);
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
            // console.log("Current position to set center:" + currentPosition);
            getLocalData(category);
            buildCategoryMarkers();
        }
        
    });

    // 
    $(".category").on("click", function(event) {
        event.preventDefault();
        $(".marker").remove();
        category = $(this).attr("data-attribute");
        // console.log(category);
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

    $("#map").on("click", ".chat", function () {
        $(".mapboxgl-popup-content").remove();
        $(".mapboxgl-popup-tip").remove();
        var chatId = $(this).attr("id");
        currentChatroom = chatId;
        console.log(currentChatroom);
         $("#chatbox").addClass("active");
        chat.once("value", getChatData); 
    });

    $("#close-chat").on("click", function() {
        $("#chatbox").removeClass("active");
    });

    $("#chatbox").on("click", "#message-submit", function() {
        var message = $("#message").val();
        $("#message").val('');
        if (currentUser.displayName != null) {
            chat.child(currentChatroom).push({
                message: message,
                user: currentUser.displayName   
            });

        }
    //     var dataRef = firebase.database();
    //   dataRef.ref().on("child_added", function(childSnapshot) {
    //     $("#log").append('<p>' + childSnapshot.val().user + ":" + childSnapshot.val().message + "</p>")
    //     }, function(errorObject) {
    //   console.log("Errors handled: " + errorObject.code);
    // });
    });

    // Sign out on button click
    $("#signout").on("click", function (e) {
        console.log("test");
         firebase.auth().signOut().then(function() {
            // Sign-out successful.
            window.location = 'signin.html'; 
        }).catch(function(error) {
            // An error happened.
        });
         return false;
    });

     // Sign out on button click
    $("#username-submit").on("click", function (e) {
        e.preventDefault();
        var name = $("#username").val();
        if (name.trim() != "") {
            currentUser.updateProfile({
                displayName: name
            }).then(function() {
                // Update successful.
            }, function(error) {
                // An error happened.
            });
        }
        console.log(name);
        console.log(currentUser);
        return false;
    });
});

