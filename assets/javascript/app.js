// ======================================================================================
// doc ready
// ======================================================================================
$(document).ready(function () {

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

    $('.details-box').hide();
    $('.main-box').css('background-color', '#333333');
    $('.main-box').css('border', '0px');
    $('.main-box').css('margin-top', '+15px');

    // ===================================================
    // EVENT - save recipe ( + ) button 
    // ===================================================
    // Send the new recipe input from the modal to the database
    $('#save-recipe-btn').on('click', function (event) {
        event.preventDefault();
        recipeTitle = $('#recipe-input').val().trim();
        ing1 = $('#ing1').val();
        ing2 = $('#ing2').val();
        ing3 = $('#ing3').val();
        ing4 = $('#ing4').val();
        ing5 = $('#ing5').val();
        ing6 = $('#ing6').val();
        ing7 = $('#ing7').val();
        ing8 = $('#ing8').val();
        ing9 = $('#ing9').val();
        ing10 = $('#ing10').val();
        ing11 = $('#ing11').val();
        ing12 = $('#ing12').val();
        instructions = $('#instructions-input').val().trim();

        dataRef.ref('user-added-recipes/').push({
            title: recipeTitle,
            ing1: ing1,
            ing2: ing2,
            ing3: ing3,
            ing4: ing4,
            ing5: ing5,
            ing6: ing6,
            ing7: ing7,
            ing8: ing8,
            ing9: ing9,
            ing10: ing10,
            ing11: ing11,
            ing12: ing12,
            instructions: instructions
        }, function (errorObject) {
            if (errorObject) {
                addErrorMessage('card-message');
            } else {
                //hooray!
                addSuccessMessage('card-message');
                loadRecipeCards(myTastyRecipes);
            }
        });
    });

    $('.details-box').hide();
    // ===================================================
    // child added to firebase
    // ===================================================
    dataRef.ref().on("child_added", function (childSnapshot) {
        // push snapshot to local array
        myTastyRecipes.push(childSnapshot);


    }, function (errorObject) {
        // console.log("Errors handled: " + errorObject.code);
        if (errorObject) {

        } else {
            //hooray!
            addSuccessMessage('card-message');
        }
    });


    // ===================================================
    // GLOBAL variables
    // ===================================================
    const apiSearchUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    const apiLookupUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    const apiDadJokeUrl = "https://icanhazdadjoke.com/";
    var masterCardsList = $('<div>');

    var myTastyRecipes = [];

    // ===================================================
    // go get a dad joke
    // ===================================================
    goGetDadJoke(apiDadJokeUrl);

    // ===================================================
    // EVENT - show saved recipes
    // ===================================================
    $('#my-meals').on('click', function (event) {

        console.log('my recipes inside button: ', myTastyRecipes[0].key);
        console.log('my recipes inside button: ', myTastyRecipes[0].val().instructions);
        console.log('my recipes inside button: ', myTastyRecipes[0].val().title);
        console.log('my recipes inside button: ', myTastyRecipes[0].val().ingredients);
        console.log('my recipes inside button: ', myTastyRecipes[0].val().dateAdded);

        for (let i = 0; i < myTastyRecipes.length; i++) {
            console.log('stuff', myTastyRecipes[i].val());

            var mealCard = createMyCard(myTastyRecipes[i].val());
            console.log('mealCard: ', mealCard);

            appendCardTo('recipe-box', mealCard);
        }
    });

    function loadRecipeCards(arr) {
        for (let i = 0; i < arr.length; i++) {
            console.log('stuff', arr[i].val());

            var mealCard = createMyCard(arr[i].val());
            console.log('mealCard: ', mealCard);

            appendCardTo('recipe-box', mealCard);
        }
    }

    // ===================================================
    // EVENT - go back button
    // ===================================================
    $('.go-back-btn').on('click', function (event) {
        // TODO: handle the go back button
        $('.details-box').hide();
        $('.main-box').append(masterCardsList);
        $('.jumbotron').show();
    });

    // ===================================================
    // EVENT - Search button
    // ===================================================
    $("#searchBtn-below").on("click", function (event) {
        event.preventDefault();
        var trimSearchInputValue = $("#searchInput-below").val().trim();

        // go get recipe data!
        ajaxCallSearch(trimSearchInputValue);

        $('#searchInput-below').val("");
    });

    // ===================================================
    // helper functions
    // ===================================================
    function createMyCard(meal) {

        var mealTitle = meal.title;
        var mealImg = 'https://www.themealdb.com/images/media/meals/1529444830.jpg';
        var recipeKey = meal.key;
        var datePutInDB = meal.dateAdded;

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
        titleDiv.append(titleH3);
        titleDiv.append(titleP);

        var divRow = $('<div>').addClass('row');
        titleDiv.append(divRow);
        var tagBox = $('<div>').addClass('container tag-box');
        divRow.append(tagBox);

        parentCardRow.append(titleDiv);

        return parentCard;
    }

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
        var titleP = $('<p>').addClass('text-right').text(truncatedDirections.substr(0, 65));
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
                newTag.addClass('badge-dark')
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

    function addErrorMessage(elementClass) {
        elementClass = '.' + elementClass;
        var successMessage = $('<div>').addClass('alert alert-danger')
            .attr('role', 'alert')
            .text('o no!! bad things!!!! or... data didnt save');

        $(elementClass).prepend(successMessage);

        // removes message after time
        setTimeout(function () {
            $(elementClass).detach();
        }, 4 * 1000);
    }

    function goGetDadJoke(queryUrl) {
        //dataType: 'json',
        $.ajax({
            url: queryUrl,
            method: 'GET',
            dataType: 'json'
        }).then(function (response) {

            $('.dad-joke-box').append(response.joke);

        });
    }

    function ajaxCallSearch(inputString) {
        var searchInput = inputString;
        var queryURL = apiSearchUrl + searchInput;
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
                    var queryURL = apiLookupUrl + key;

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

                            instructions = response.meals[0].strInstructions;

                            // ===================================================
                            // Chris Stead magic juice 
                            // ===================================================
                            var recipeOutput = '<p>' + instructions.replace(/(\r?\n){2}/g, '</p><p>').replace(/(\r?\n)+/g, '<br/>') + '</p>';

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
                                    $('#ing' + i.toString()).text(" ");

                                } else {
                                    $('#ing' + i.toString()).text(measure + "  " + ingredient);
                                }

                                i++;
                            } while (i <= 20);


                            $('#mealName').html("<h2 class='float-right'>" + mealName + "</h2>");
                            $('#exampleIMG').attr("src", mealIMG);
                            $('#exampleIMG').attr("style", "height: 200px; width: 200px;");
                            $('#categoryTag').html(category);
                            $('#areaTag').html(cuisineType);
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