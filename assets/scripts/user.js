$(document).ready(function () {
    var config = {
        apiKey: "AIzaSyA3dyltamfojStja-0yxqnNqmS4QA-6S3M",
        authDomain: "mapchat-17eba.firebaseapp.com",
        databaseURL: "https://mapchat-17eba.firebaseio.com",
        storageBucket: "mapchat-17eba.appspot.com",
        messagingSenderId: "484471510094"
    };
    firebase.initializeApp(config);

    var database = firebase.database();
    var users = database.ref("users");

    var user;
    var name, email, photoUrl, uid, emailVerified;

    // if user signed in get values of current user
    if (user != null) {
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                        // this value to authenticate with your backend server, if
                        // you have one. Use User.getToken() instead.
    }
    
    var txtUsername = $("#username");
    var txtEmail = $("#email");
    var txtPassword = $("#password");
    var loginBtn = $("#signin");
    var signUpBtn = $("#register");
    var logoutBtn = $("#signout");

    // Add login event
    $("#signin").on("click", function (e) {
        // Get email and pass
        console.log(e);
        var email = txtEmail.val();
        var password = txtPassword.val();
        var auth = firebase.auth();
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
        });
    });

    // Register new user.
    $("#register").on("click", function (e) {
         // Get email and pass
         var email = txtEmail.val();
         var password = txtPassword.val();
         var auth = firebase.auth();
        // Check for real email.
        if (validateEmail(email) == true) {
            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
            });
        }
    });

    // Sign out on button click
     $("#signout").on("click", function (e) {
         firebase.auth().signOut().then(function() {
            // Sign-out successful.
        }).catch(function(error) {
            // An error happened.
        });
     });

    // Add a realtime listener for user state
    firebase.auth().onAuthStateChanged(function(firebaseUser) {
        user = firebase.auth().currentUser;
        console.log(user);
        // Add display name to user profile. Probably should move this somewhere else
        firebaseUser.updateProfile({
            displayName: "Jane Q. User",
            photoURL: "https://example.com/jane-q-user/profile.jpg"
        }).then(function() {
            // Update successful.
        }, function(error) {
            // An error happened.
        });

        if (firebaseUser) {
            console.log(firebaseUser);
            if (window.location != 'index.html') {
                // window.location = 'index.html';
            }
        } else {
            console.log("not logged in");
        }
    });

    // Validate email   
    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    // initialize chat
    function initChat(user) {
        // Get a Firebase Database ref
        var chatRef = firebase.database().ref("chat");

        // Create a Firechat instance
        var chat = new FirechatUI(chatRef, document.getElementById("firechat-wrapper"));

        // Set the Firechat user
        chat.setUser(user.uid, user.displayName);
    }
    
    var firebaseRef = firebase.database().ref("firechat");
    var chat = new Firechat(firebaseRef);
        chat.setUser(userId, userName, function(user) {
        chat.resumeSession();
    });

    (function() {
    'use strict';
        var snackbarContainer = document.querySelector('#demo-snackbar-example');
        var showSnackbarButton = document.querySelector('#demo-show-snackbar');
        var handler = function(event) {
        showSnackbarButton.style.backgroundColor = '';
        };
        showSnackbarButton.addEventListener('click', function() {
        'use strict';
        showSnackbarButton.style.backgroundColor = '#' +
            Math.floor(Math.random() * 0xFFFFFF).toString(16);
        var data = {
            message: 'User not logged in.',
            timeout: 2000,
        //   actionHandler: handler,
        //   actionText: 'Undo'
        };
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
        });
    }()); 
});

