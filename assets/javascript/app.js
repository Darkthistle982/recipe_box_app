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

//some comment



$(document).ready(function () {

    var resultsArray = [];
    var clickedCardKey = '12345';

    // ===================================================
    // EVENT - save recipe ( + ) button 
    // ===================================================
    $('#save-recipe-btn').on('click', function (event) {
        console.log('here is event', event);
        var title = $('#recipe-input').val();
        console.log('here is title: ' + title);

        addSuccessMessage('card-message');

    });


    // ===================================================
    // EVENT - Search buttons
    // ===================================================
    $("#searchBtn").on("click", function (event) {
        event.preventDefault();
        var trimSearchInputValue = $("#searchInput").val().trim();

        resultsArray = ajaxCallSearch(trimSearchInputValue);
        console.log('results array');
        console.log(resultsArray);

    });

    $("#searchBtn-below").on("click", function (event) {
        event.preventDefault();
        var trimSearchInputValue = $("#searchInput-below").val().trim();

        var someResultArray = ajaxCallSearch(trimSearchInputValue);
        console.log('someResultArray');
        console.log(someResultArray);

    });






    // ===================================================
    // helper functions
    // ===================================================
    function createCard(meal) {
        var mealTitle = meal.strMeal;
        var mealImg = meal.strMealThumb;
        var recipeKey = meal.idMeal;

        // TODO: are there some default tags we want if no tags found.
        // safety feature
        var mealTagsArray;
        if (meal.strTags != null) {
            mealTagsArray = meal.strTags.split(',');
        } else {
            mealTagsArray = ['tag1', 'tag2'];
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

        // might see problems here if there are no meal tags.
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
                break;

            case 'dairy':
                return $('<span>').addClass('badge badge-pill badge-info').text(element);
                break;

            case 'mainmeal':
                return $('<span>').addClass('badge badge-pill badge-primary').text(element);
                break;

            default:
                return $('<span>').addClass('badge badge-pill badge-light').text(element);
                break;
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
                    // console.log(this);
                    // console.log(event);

                    // console.log(event.currentTarget.textContent);

                    //TODO: GET the fridge method to get recipeKey
                    //fridgeMagnet.text($(this).attr("data-letter"));
                    var key = $(this).attr('recipekey');
                    console.log('key thang: ', key);

                    var queryURL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + key;
                    $.ajax({
                        url: queryURL,
                        method: "GET"
                    })
                        .then(function (response) {
                            console.log(response);

                            //TODO: build details 'page' and fill with response data

                            

                        });



                });


            });

        // console.log('array of meals: ', arrayOfMeals);
        // console.log(arrayOfMeals);
        // console.log(resultsArray);


        return arrayOfMeals;
    }

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

                //TODO: build details 'page' and fill with response data

                return response;

            });
    }



    // end of document ready
});