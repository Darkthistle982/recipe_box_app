var config = {
    apiKey: "AIzaSyAggh_9HPrLN-IokUfsrCz2bCP_4ABUd4Y",
    authDomain: "salty-beards-recipe-box.firebaseio.com",
    databaseURL: "https://salty-beards-recipe-box.firebaseio.com/",
    projectId: "salty-beards-recipe-box",
    storageBucket: "salty-beards-recipe-box.appspot.com",
    messagingSenderId: "655365438357",
    appId: "1:655365438357:web:3b219292065eb7ad0e149c"
};
// Initialize Firebase
firebase.initializeApp(config);
var dataRef = firebase.database();

// ============ TEST push ==========
$('.test-save').on('click', function (event) {
    dataRef.ref().push({
        title: 'Bean bread',
        img: 'https://www.themealdb.com/images/media/meals/1529444830.jpg',
        instructions: 'First get the pan. cook. then serve.',
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
});

// =========== firebase child added in db ============
dataRef.ref().on("child_added", function (childSnapshot) {

    // // Log everything that's coming out of snapshot
    // console.log(childSnapshot.title);

    // console.log(childSnapshot.val().name);
    // console.log(childSnapshot.val().name);
    // console.log(childSnapshot.val().email);
    // console.log(childSnapshot.val().age);
    // console.log(childSnapshot.val().comment);
    // console.log(childSnapshot.val().joinDate);

    // // full list of items to the well
    // $("#full-member-list").append("<div class='well'><span class='member-name'> " +
    //   childSnapshot.val().name +
    //   " </span><span class='member-email'> " + childSnapshot.val().email +
    //   " </span><span class='member-age'> " + childSnapshot.val().age +
    //   " </span><span class='member-comment'> " + childSnapshot.val().comment +
    //   " </span></div>");

    // // Handle the errors
    // console.log('anything happen?');

}, function (errorObject) {
    // console.log("Errors handled: " + errorObject.code);
});






// ===================================================
// doc ready
// ===================================================
$(document).ready(function () {

    // ===================================================
    // GLOBAL variables
    // ===================================================
    const apiSearchUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    const apiLookupUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

    var resultsArray = [];
    var clickedCardKey = '12345';

    // ===================================================
    // EVENT - save recipe ( + ) button 
    // ===================================================
    $('#save-recipe-btn').on('click', function (event) {
        // console.log('here is event', event);
        var title = $('#recipe-input').val();
        // console.log('here is title: ' + title);
        addSuccessMessage('card-message');
    });

    // ===================================================
    // EVENT - Search buttons
    // ===================================================
    $("#searchBtn").on("click", function (event) {
        event.preventDefault();
        var trimSearchInputValue = $("#searchInput").val().trim();
        resultsArray = ajaxCallSearch(trimSearchInputValue);
        $('#searchInput').val("");
        console.log('results array');
        console.log(resultsArray);
    });
    
    $("#searchBtn-below").on("click", function (event) {
        event.preventDefault();
        var trimSearchInputValue = $("#searchInput-below").val().trim();
        ajaxCallSearch(trimSearchInputValue);
        $('#searchInput-below').val("");
    });

    // ===================================================
    // helper functions
    // ===================================================
    function goGetDataFromApi(qUrl, userInput) {
        var queryURL = qUrl + userInput;

        $.ajax({
            method: "GET",
            url: queryURL
        }).then(function(response) {
            console.log('here is my call');
            console.log(response);
            
            return response;
        });
    }


    function createCard(meal) {
        var mealTitle = meal.strMeal;
        var mealImg = meal.strMealThumb;
        var recipeKey = meal.idMeal;
        var areaTag = '';
        areaTag = meal.strArea;

        // TODO: are there some default tags we want if no tags found. do we?
        // safety feature
        var mealTagsArray = [];
        if (meal.strTags != null) {
            mealTagsArray = meal.strTags.split(',');
        }

        var parentCard = $('<div>').addClass('card mx-auto');
        var cardBody = $('<div>').addClass('card-body recipe-card').attr('recipeKey', recipeKey);
        var parentCardRow = $('<div>').addClass('row');
        parentCard.append(cardBody);
        cardBody.append(parentCardRow);

        // === left side ===
        var cardImgDiv = $('<div>').addClass('container img-box col-xs-12 col-md-3');
        var cardImg = $('<img>').attr('src', mealImg).addClass('card-img');
        cardImgDiv.append(cardImg);
        parentCardRow.append(cardImgDiv);

        // === right side ===
        var titleDiv = $('<div>').addClass('container col-xs-12 col-md-9');
        var titleH3 = $('<h3>').addClass('text-right').text(mealTitle);
        var titleP = $('<p>').addClass('text-right').text('This elegant dish can be made in under 30mins. Feeds 4. #dinner');
        titleDiv.append(titleH3);
        titleDiv.append(titleP);

        var divRow = $('<div>').addClass('row');
        titleDiv.append(divRow);
        var tagBox = $('<div>').addClass('container tag-box');
        divRow.append(tagBox);

        if (areaTag !== '') {
            var mealArea = $('<span>').addClass('badge badge-pill badge-warning').text(areaTag);
            tagBox.append(mealArea);
        }

        for (let i = 0; i < mealTagsArray.length; i++) {
            // const element = mealTagsArray[i];
            var spanTag = createPillTag(mealTagsArray[i]);

            tagBox.append(spanTag);
        }
        parentCardRow.append(titleDiv);
        return parentCard;
    }

    function createPillTag(element) {
        var lowerTag = element.toLowerCase();
        // var pillColor = 'badge-light';

        switch (lowerTag) {
            case 'meat':
                return $('<span>').addClass('badge badge-pill badge-danger').text(element);

            case 'dairy':
                return $('<span>').addClass('badge badge-pill badge-info').text(element);

            default:
                return $('<span>').addClass('badge badge-pill badge-light').text(element);
        }
    }

    function appendCardTo(targetClass, card) {
        targetClass = '.' + targetClass;
        $(targetClass).append(card);
    }

    function addSuccessMessage(elementClass) {
        elementClass = '.' + elementClass;
        var successMessage = $('<div>').addClass('alert alert-success')
            .attr('role', 'alert')
            .text('Yay! you saved something!');

        $(elementClass).prepend(successMessage);

        // removes message after time
        setTimeout(function () {
            $(elementClass).detach();
        }, 4 * 1000);
    }

    function ajaxCallSearch(inputString) {
        var searchInput = inputString;
        var queryURL = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + searchInput;
        var arrayOfMeals = [];

        //make the call
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                // console.log(response);
                arrayOfMeals = response.meals;

                // TODO: iterate over all of the results
                for (let i = 0; i < arrayOfMeals.length; i++) {
                    const meal = arrayOfMeals[i];
                    // console.log('meals thing: ' + i );
                    // console.log(meal.strMeal);
                    // console.log(meal.strMealThumb);

                    // create card and append
                    var mealCard = createCard(meal);
                    appendCardTo('recipe-box', mealCard);

                    //push to array
                    // arrayOfMeals.push(meal);
                }

                // ===================================================
                // ON CLICK - recipe card
                // ===================================================
                $('.recipe-card').on('click', function (event) {
                    var key = $(this).attr('recipekey');
                    var queryURL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + key;

                    $.ajax({
                        url: queryURL,
                        method: "GET"
                    })
                        .then(function (response) {
                            $('.recipe-box').detach();
                            mealName = response.meals[0].strMeal;
                            mealIMG = response.meals[0].strMealThumb;
                            category = response.meals[0].strCategory;
                            cuisineType = response.meals[0].strArea;
                            ing1 = response.meals[0].strIngredient1 + "  " + response.meals[0].strMeasure1;
                            ing2 = response.meals[0].strIngredient2 + "  " + response.meals[0].strMeasure2;
                            ing3 = response.meals[0].strIngredient3 + "  " + response.meals[0].strMeasure3;
                            ing4 = response.meals[0].strIngredient4 + "  " + response.meals[0].strMeasure4;
                            ing5 = response.meals[0].strIngredient5 + "  " + response.meals[0].strMeasure5;
                            ing6 = response.meals[0].strIngredient6 + "  " + response.meals[0].strMeasure6;
                            ing7 = response.meals[0].strIngredient7 + "  " + response.meals[0].strMeasure7;
                            ing8 = response.meals[0].strIngredient8 + "  " + response.meals[0].strMeasure8;
                            ing9 = response.meals[0].strIngredient9 + "  " + response.meals[0].strMeasure9;
                            ing10 = response.meals[0].strIngredient10 + "  " + response.meals[0].strMeasure10;
                            ing11 = response.meals[0].strIngredient11 + "  " + response.meals[0].strMeasure11;
                            ing12 = response.meals[0].strIngredient12 + "  " + response.meals[0].strMeasure12;
                            ing13 = response.meals[0].strIngredient13 + "  " + response.meals[0].strMeasure13;
                            ing14 = response.meals[0].strIngredient14 + "  " + response.meals[0].strMeasure14;
                            ing15 = response.meals[0].strIngredient15 + "  " + response.meals[0].strMeasure15;
                            ing16 = response.meals[0].strIngredient16 + "  " + response.meals[0].strMeasure16;
                            ing17 = response.meals[0].strIngredient17 + "  " + response.meals[0].strMeasure17;
                            ing18 = response.meals[0].strIngredient18 + "  " + response.meals[0].strMeasure18;
                            ing19 = response.meals[0].strIngredient19 + "  " + response.meals[0].strMeasure19;
                            ing20 = response.meals[0].strIngredient20 + "  " + response.meals[0].strMeasure20;
                            instructions = response.meals[0].strInstructions;
                            $('#mealName').html("<h3>" + mealName + "</h3>");
                            $('#exampleIMG').attr("src", mealIMG);
                            $('#exampleIMG').attr("style", "height: 100px; width: 100px;");
                            $('#categoryTag').html("Category: " + category);
                            $('#areaTag').html("Cuisine: " + cuisineType);
                            $('#ingredients-list').html("Ingredients: ");
                            $('#ing1').html(ing1);
                            $('#ing2').html(ing2);
                            $('#ing3').html(ing3);
                            $('#ing4').html(ing4);
                            $('#ing5').html(ing5);
                            $('#ing6').html(ing6);
                            $('#ing7').html(ing7);
                            $('#ing8').html(ing8);
                            $('#ing9').html(ing9);
                            $('#ing10').html(ing10);
                            $('#ing11').html(ing11);
                            $('#ing12').html(ing12);
                            $('#instructions').text(instructions);


                            //TODO: BUILD all of the html elements we need to show details.
                            // var parentDiv = $('<div>').addClass('container ');
                            // var h1Tag = $('<h1>').text(response.meals[0].strMeal);
                            // FIXME: how should we get the index   ^^^^^^ assume that it's always 1 result. 
                            // parentDiv.append(h1Tag);
                            // console.log(response.meals[0].strInstructions);
                            // parentDiv.append($('<pre>').text(response.meals[0].strInstructions));


                            // $('.main-box').append(parentDiv);


                            //come back
                            // setTimeout(function() {
                            //     $('.main-box').append(searchResultsCards);
                            // }, 5 * 1000);
                        });
                });
            });



        return arrayOfMeals;
    }



    // ***** maybe get rid of this one ******************
    function ajaxQuery(queryString, key) {
        // https://www.themealdb.com/api/json/v1/1/lookup.php?i=
        // var queryURL = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + searchInput;
        var queryURL = queryString + key;

        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                // console.log(response);

    //             //TODO: build details 'page' and fill with response data

                return response;

            });
    }



    // end of document ready
});