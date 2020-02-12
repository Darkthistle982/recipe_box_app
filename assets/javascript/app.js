var firebaseConfig = {
    apiKey: "AIzaSyAggh_9HPrLN-IokUfsrCz2bCP_4ABUd4Y",
    authDomain: "salty-beards-recipe-box.firebaseapp.com",
    databaseURL: "https://salty-beards-recipe-box.firebaseio.com",
    projectId: "salty-beards-recipe-box",
    storageBucket: "salty-beards-recipe-box.appspot.com",
    messagingSenderId: "655365438357",
    appId: "1:655365438357:web:3b219292065eb7ad0e149c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

$(document).ready(function() {

    // ===================================================
    // EVENT - save recipe
    // ===================================================
    $('#save-recipe-btn').on('click', function(event) {
        console.log('here is event', event);
        var title = $('#recipe-input').val();
        console.log('here is title: ' + title);

        // TODO: save form entry to database


        // TODO: when the data is saved to database, add success message
        var successMessage = $('<div>').addClass('alert alert-success')
            .attr('role', 'alert')
            .text('Yay! you saved something!');

        $('.card-message').prepend(successMessage);

        // removes message after 5 seconds  
        setTimeout(function() {
            $('.card-message').detach();

        }, 4 * 1000);


    });
    ///test for ajax/api call
    $("#searchBtn").on("click", function(event) {
        event.preventDefault();
        var searchInput = $("#searchInput").val().trim();
        var queryURL = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + searchInput;
        $.ajax({
                url: queryURL,
                method: "GET"
            })
            .then(function(response) {
                console.log(response);
            });
        $("#searchInput").val("");
    });

});



// $('#addNewRecipe').on('shown.bs.modal', function () {
//     $('#plusAdd').trigger('focus')
//   })$(document).ready(function() {

// ===================================================
// EVENT - save recipe
// ===================================================
$('#save-recipe-btn').on('click', function(event) {
    console.log('here is event', event);
    var title = $('#recipe-input').val();
    console.log('here is title: ' + title);

    // TODO: save form entry to database


    // TODO: when the data is saved to database, add success message
    var successMessage = $('<div>').addClass('alert alert-success')
        .attr('role', 'alert')
        .text('Yay! you saved something!');

    $('.card-message').prepend(successMessage);

    // removes message after 5 seconds  
    setTimeout(function() {
        $('.card-message').detach();

    }, 4 * 1000);


});