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

    const txtEmail = $("#email");
    const txtPassword = $("#password");
    const loginBtn = $("#signin");
    const signUpBtn = $("#register");
    const logoutBtn = $("#signout");

    // Add login event
    $("#signin").on("click", function (e) {
        // Get email and pass
        console.log(e);
        const email = txtEmail.val();
        const password = txtPassword.val();
        const auth = firebase.auth();
        // Sign in
        const promise = auth.signInWithEmailAndPassword(email, password);
        promise.catch(e => console.log(e.message));
    });
        

    // Register new user.
    $("#register").on("click", function (e) {
         // Get email and pass
        // Check for real email.
        if (validateEmail(txtEmail.val()) == true) {
            console.log(e);
            const email = txtEmail.val();
            const password = txtPassword.val();
            const auth = firebase.auth();
            // Sign in
            const promise = auth.createUserWithEmailAndPassword(email, password);
            promise.catch(e => console.log(e.message));
        }
    });

    // Add a realtime listener for user state
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            if (window.location != 'index.html') {
                window.location = '/index.html'
            }
            console.log(firebaseUser);
            $("#signin").click();
        } else {
            console.log("not logged in");
            // open snackbar
            (function () {
                var snackbarContainer = document.querySelector('#demo-snackbar-example');
                var showSnackbarButton = document.querySelector('#demo-show-snackbar');
                var handler = function (event) {
                    showSnackbarButton.style.backgroundColor = '';
                };
                showSnackbarButton.style.backgroundColor = '#' +
                    Math.floor(Math.random() * 0xFFFFFF).toString(16);
                var data = {
                    message: 'User not logged in.',
                    timeout: 2000
                };
                snackbarContainer.MaterialSnackbar.showSnackbar(data);
            });
        }
    });

    // (function() {
    //     'use strict';
    //         var snackbarContainer = document.querySelector('#demo-snackbar-example');
    //         var showSnackbarButton = document.querySelector('#demo-show-snackbar');
    //         var handler = function(event) {
    //         showSnackbarButton.style.backgroundColor = '';
    //         };
    //         showSnackbarButton.addEventListener('click', function() {
    //         'use strict';
    //         showSnackbarButton.style.backgroundColor = '#' +
    //             Math.floor(Math.random() * 0xFFFFFF).toString(16);
    //         var data = {
    //             message: 'User not logged in.',
    //             timeout: 2000,
    //         //   actionHandler: handler,
    //         //   actionText: 'Undo'
    //         };
    //         snackbarContainer.MaterialSnackbar.showSnackbar(data);
    //         });
    // }());

    // Validate email   
    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
});

