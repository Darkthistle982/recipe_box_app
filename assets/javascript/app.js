// master branch

var config = {
    apiKey: "AIzaSyAggh_9HPrLN-IokUfsrCz2bCP_4ABUd4Y",
    authDomain: "salty-beards-recipe-box.firebaseio.com",
    databaseURL: "https://salty-beards-recipe-box.firebaseio.com/",
    projectId: "salty-beards-recipe-box",
    storageBucket: "salty-beards-recipe-box.appspot.com",
    messagingSenderId: "655365438357",
    appId: "1:655365438357:web:3b219292065eb7ad0e149c"
};

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


// ===================================================
// child added to firebase
// ===================================================
dataRef.ref().on("child_added", function (childSnapshot) {


}, function (errorObject) {
    // console.log("Errors handled: " + errorObject.code);
});


// ===================================================
// doc ready
// ===================================================
$(document).ready(function () {

    $('.details-box').hide();
    $('.main-box').css('background-color', '#333333');
    $('.main-box').css('border', '0px');
    $('.main-box').css('margin-top', '+15px');

    // ===================================================
    // GLOBAL variables
    // ===================================================
    const apiSearchUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    const apiLookupUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

    var resultsArray = [];
    var clickedCardKey = '12345';

    var masterCardsList = $('<div>');
    // var ing1 = 'blahblahblahb';

    // ===================================================
    // EVENT - save recipe ( + ) button 
    // ===================================================
    $('#save-recipe-btn').on('click', function (event) {
        var title = $('#recipe-input').val();
        addSuccessMessage('card-message');
    });

    // ===================================================
    // EVENT - go back button
    // ===================================================
    $('.go-back-btn').on('click', function (event) {
        // TODO: handle the go back button
        $('.details-box').hide();
        $('.main-box').append(masterCardsList);
        $('.jumbotron').show();
        // $('.main-box').css('background-color', '#ffffff');
        // $('.main-box').css('border', '1px');
    });

    // ===================================================
    // EVENT - Search button
    // ===================================================
    $("#searchBtn-below").on("click", function (event) {
        event.preventDefault();
        var trimSearchInputValue = $("#searchInput-below").val().trim();
        ajaxCallSearch(trimSearchInputValue);
        $('#searchInput-below').val("");
    });


    // dev branch
    // ===================================================
    // helper functions
    // ===================================================
    function createCard(meal) {
        var mealTitle = meal.strMeal;
        var mealImg = meal.strMealThumb;
        var recipeKey = meal.idMeal;
        var areaTag = '';
        areaTag = meal.strArea;

        var truncatedDirections = 'This elegant dish can be made in under 30mins. Feeds 4. #dinner';
        truncatedDirections = meal.strInstructions;

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
        var titleH3 = $('<h3>').addClass('text-right text-break').text(mealTitle);
        // var titleP = $('<p>').addClass('text-right').text('This elegant dish can be made in under 30mins. Feeds 4. #dinner');
        var titleP = $('<p>').addClass('text-right').text( truncatedDirections.substr(0, 65) );
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
            var spanTag = createPillTag(mealTagsArray[i]);

            tagBox.append(spanTag);
        }

        parentCardRow.append(titleDiv);

        return parentCard;
    }

    function createPillTag(element) {
        var lowerTag = element.toLowerCase();
        var newTag = $('<span>').addClass('badge badge-pill').text(element);

        switch (lowerTag) {
            case 'meat':
                newTag.addClass('badge-danger');
                return newTag;

            case 'dairy':
                newTag.addClass('badge-light');
                return newTag;

            default:
                return newTag;
        }
    }

    function appendCardTo(targetClass, card) {
        targetClass = '.' + targetClass;
        $(targetClass).prepend(card);
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

        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                arrayOfMeals = response.meals;

                for (let i = 0; i < arrayOfMeals.length; i++) {
                    const meal = arrayOfMeals[i];

                    // create card and append
                    var mealCard = createCard(meal);
                    appendCardTo('recipe-box', mealCard);

                }

                // ===================================================
                // ON CLICK - recipe card
                // ===================================================
                $('.recipe-card').on('click', function () {
                    // FIXME: details box doesn't come back second time
                    $('.details-box').show();
                    var key = $(this).attr('recipekey');
                    var queryURL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + key;


                    $.ajax({
                        url: queryURL,
                        method: "GET"
                    })


                        .then(function (response) {
                            masterCardsList = $('.recipe-box').detach();
                            mealName = response.meals[0].strMeal;
                            mealIMG = response.meals[0].strMealThumb;
                            category = response.meals[0].strCategory;
                            cuisineType = response.meals[0].strArea;
                            ing20 = response.meals[0].strMeasure20 + "  " + response.meals[0].strIngredient20;


                            // maybe one day
                            // for (let i = 1; i <= 20; i++) {
                            //     var ing = ing + i;
                            //     ing = response.meals[0].strMeasure + i + "\t " + response.meals[0].strIngredient + i;
                            //     console.log('i have looped: ', i);
                            //     $('#ing' + i).text(ing + i);
                            // }

                            instructions = response.meals[0].strInstructions;
                            var recipeOutput = '<p>' + instructions.replace(/(\r?\n){2}/g, '</p><p>').replace(/(\r?\n)+/g, '<br/>') + '</p>';
                            //logic to eliminate the null status from JSON object results applied to some recipe data



                            // now need to add the logic to the do while loop
                            // var meals = response.meals[0];
                            var i = 1;
                            var ingredient = '';
                            var measure = '';
                            do {
                                // ingredient = [meals.strIngredient + i.toString()];
                                ingredient = response.meals[0]["strIngredient" + i.toString()];

                                // measure = [meals.strMeasure + i.toString()];
                                measure = response.meals[0]["strMeasure" + i.toString()];

                                if ((ingredient === null || measure === null)) {
                                    ingredient = '';
                                    measure = '';
                                    $( '#ing' + i.toString() ).text( " " );

                                } else {
                                    // console.log('ingredient: ', ingredient);
                                    // console.log('measure: ', measure);
                                    $('#ing' + i.toString() ).text( measure + "  " + ingredient );
                                }

                                i++;
                            } while (i <= 20);


                            //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                            //pretty sure this is the issue with the null. as the display is still just pulling from the initial json. 
                            // Need to figure out how to shift this to pull from our loop data instead
                            //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                            // ing1 = response.meals[0].strMeasure1 + "  " + response.meals[0].strIngredient1;
                            // ing2 = response.meals[0].strMeasure2 + "  " + response.meals[0].strIngredient2;
                            // ing3 = response.meals[0].strMeasure3 + "  " + response.meals[0].strIngredient3;
                            // ing4 = response.meals[0].strMeasure4 + "  " + response.meals[0].strIngredient4;
                            // ing5 = response.meals[0].strMeasure5 + "  " + response.meals[0].strIngredient5;
                            // ing6 = response.meals[0].strMeasure6 + "  " + response.meals[0].strIngredient6;
                            // ing7 = response.meals[0].strMeasure7 + "  " + response.meals[0].strIngredient7;
                            // ing8 = response.meals[0].strMeasure8 + "  " + response.meals[0].strIngredient8;
                            // ing9 = response.meals[0].strMeasure9 + "  " + response.meals[0].strIngredient9;
                            // ing10 = response.meals[0].strMeasure10 + "  " + response.meals[0].strIngredient10;
                            // ing11 = response.meals[0].strMeasure11 + "  " + response.meals[0].strIngredient11;
                            // ing12 = response.meals[0].strMeasure12 + "  " + response.meals[0].strIngredient12;
                            // ing13 = response.meals[0].strMeasure13 + "  " + response.meals[0].strIngredient13;
                            // ing14 = response.meals[0].strMeasure14 + "  " + response.meals[0].strIngredient14;
                            // ing15 = response.meals[0].strMeasure15 + "  " + response.meals[0].strIngredient15;
                            // ing16 = response.meals[0].strMeasure16 + "  " + response.meals[0].strIngredient16;
                            // ing17 = response.meals[0].strMeasure17 + "  " + response.meals[0].strIngredient17;
                            // ing18 = response.meals[0].strMeasure18 + "  " + response.meals[0].strIngredient18;
                            // ing19 = response.meals[0].strMeasure19 + "  " + response.meals[0].strIngredient19;




                            $('#mealName').html("<h3>" + mealName + "</h3>");
                            $('#exampleIMG').attr("src", mealIMG);
                            $('#exampleIMG').attr("style", "height: 200px; width: 200px;");
                            $('#categoryTag').html(category);
                            $('#areaTag').html(cuisineType);
                            // $('#ingredients-list').html("Ingredients: ");
                            // $('#ing1').text(ing1);
                            // $('#ing2').html(ing2);
                            // $('#ing3').html(ing3);
                            // $('#ing4').html(ing4);
                            // $('#ing5').html(ing5);
                            // $('#ing6').html(ing6);
                            // $('#ing7').html(ing7);
                            // $('#ing8').html(ing8);
                            // $('#ing9').html(ing9);
                            // $('#ing10').html(ing10);
                            // $('#ing11').html(ing11);
                            // $('#ing12').html(ing12);
                            // $('#ing13').html(ing13);
                            // $('#ing14').html(ing14);
                            // $('#ing15').html(ing15);
                            // $('#ing16').html(ing16);
                            // $('#ing17').html(ing17);
                            // $('#ing18').html(ing18);
                            // $('#ing19').html(ing19);
                            // $('#ing20').html(ing20);
                            $('#instructions').html(recipeOutput);






                        });


                    //CSS onclick functions
                    $('.jumbotron').hide();
                    $('.details-box').css('margin-top', '+15px');
                    $('.details-box').css('margin-bottom', '+15px');
                    $('.main-box').css('background-color', '#333333');
                    $('.main-box').css('border', '0px');

                });
            });
    };
});