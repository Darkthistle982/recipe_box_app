// project 1 - Recipe app
// Derrek, Brian, Matt, and Jacob.

$(document).ready(function() {
  // ===================================================
  // GLOBAL letIABLES
  // ===================================================
  const apiSearchUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  const apiLookupUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  const apiDadJokeUrl = "https://icanhazdadjoke.com/";
  let masterCardsList = $("<div>");

  let config = {
    apiKey: "AIzaSyAggh_9HPrLN-IokUfsrCz2bCP_4ABUd4Y",
    authDomain: "salty-beards-recipe-box.firebaseio.com",
    databaseURL: "https://salty-beards-recipe-box.firebaseio.com/",
    projectId: "salty-beards-recipe-box",
    storageBucket: "salty-beards-recipe-box.appspot.com",
    messagingSenderId: "655365438357",
    appId: "1:655365438357:web:3b219292065eb7ad0e149c"
  };

  firebase.initializeApp(config);
  let dataRef = firebase.database();

  // making sure details hide when back button is pressed
  $(".details-box").hide();
  let myTastyRecipes = [];

  // ===================================================
  // go get a dad joke
  // ===================================================
  goGetDadJoke(apiDadJokeUrl);

  // ===================================================
  // EVENTS - ALL
  // ===================================================
  const goGetThemInputs = () => {
    let userInputs = {
      title: $("#recipe-input")
        .val()
        .trim(),
      instructions: $("#instructions-input")
        .val()
        .trim(),
      // FIXME: ing1 looks off
      ing1: ing1,
      ing2: $("#ingredient-input2").val(),
      ing3: $("#ingredient-input3").val(),
      ing5: $("#ingredient-input5").val(),
      ing4: $("#ingredient-input4").val(),
      ing6: $("#ingredient-input6").val(),
      ing7: $("#ingredient-input7").val(),
      ing8: $("#ingredient-input8").val(),
      ing9: $("#ingredient-input9").val(),
      ing10: $("#ingredient-input10").val(),
      ing11: $("#ingredient-input11").val(),
      ing12: $("#ingredient-input12").val(),
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    };

    return userInputs;
  };

  // Send the new recipe input from the modal to the database
  $("#save-recipe-btn").on("click", function(event) {
    event.preventDefault();
    let myRecipe = goGetThemInputs();

    dataRef.ref("user-added-recipes/").push(
      {
        myRecipe
      },
      function(errorObject) {
        if (errorObject) {
          addMessage("card-message", "error");
        } else {
          //hooray!
          addMessage("card-message", "success");
          loadRecipeCards(myTastyRecipes);
        }
      }
    );
  });

  dataRef.ref("user-added-recipes/").on("child_added", function(childSnapshot) {
    pushChildSnapshot(childSnapshot);
  });

  function pushChildSnapshot(childSnapshot) {
    myTastyRecipes.push(childSnapshot);
  }

  // display saved recipes from firebase
  $("#my-meals").on("click", function(event) {
    event.preventDefault();

    for (let i = 0; i < myTastyRecipes.length; i++) {
      let mealCard = createMyCard(myTastyRecipes[i].val());
      appendCardTo("recipe-box", mealCard);
    }
  });

  $(".go-back-btn").on("click", function(event) {
    $(".details-box").hide();
    $(".main-box").append(masterCardsList);
    $(".jumbotron").show();
  });

  $("#searchBtn-below").on("click", function(event) {
    event.preventDefault();
    let trimSearchInputValue = $("#searchInput-below")
      .val()
      .trim();

    // go get recipe data!
    ajaxCallSearch(trimSearchInputValue);

    $("#searchInput-below").val("");
  });

  // ===================================================
  // helper functions
  // ===================================================
  function loadRecipeCards(arr) {
    for (let i = 0; i < arr.length; i++) {
      let mealCard = createMyCard(arr[i].val());
      appendCardTo("recipe-box", mealCard);
    }
  }

  function createMyCard(meal) {
    meal = meal.myRecipe;

    let mealImg = "https://www.themealdb.com/images/media/meals/1529444830.jpg";
    let datePutInDB = moment(meal.dateAdded).format("YYYY-MM-DD h:mm");

    let parentCard = $("<div>").addClass("card mx-auto");
    let cardBody = $("<div>")
      .addClass("card-body recipe-card")
      .attr("recipeKey", meal.key);
    let parentCardRow = $("<div>").addClass("row");
    parentCard.append(cardBody);
    cardBody.append(parentCardRow);

    // === left side ===
    let cardImgDiv = $("<div>").addClass(
      "container img-box col-xs-12 col-md-3"
    );
    let cardImg = $("<img>")
      .attr("src", mealImg)
      .addClass("card-img");
    cardImgDiv.append(cardImg);
    parentCardRow.append(cardImgDiv);

    // === right side ===
    let titleDiv = $("<div>").addClass("container col-xs-12 col-md-9");
    let titleH3 = $("<h3>")
      .addClass("text-right text-break")
      .text(meal.title);
    let titleP = $("<p>")
      .addClass("text-right")
      .text("this dish will elevate stuff and do things....so ya.");
    let titleP2 = $("<p>")
      .addClass("text-right")
      .text(datePutInDB);
    titleDiv.append(titleH3);
    titleDiv.append(titleP);
    titleDiv.append(titleP2);

    let divRow = $("<div>").addClass("row");
    titleDiv.append(divRow);
    let tagBox = $("<div>").addClass("container tag-box");
    divRow.append(tagBox);
    parentCardRow.append(titleDiv);

    return parentCard;
  }

  function createCard(meal) {
    let mealTitle = meal.strMeal;
    let mealImg = meal.strMealThumb;
    let recipeKey = meal.idMeal;
    let areaTag = "";
    areaTag = meal.strArea;

    let truncatedDirections =
      "This elegant dish can be made in under 30mins. Feeds 4. #dinner";
    truncatedDirections = meal.strInstructions;

    // safety feature
    let mealTagsArray = [];
    if (meal.strTags !== null) {
      mealTagsArray = meal.strTags.split(",");
    }

    let parentCard = $("<div>").addClass("card mx-auto");
    let cardBody = $("<div>")
      .addClass("card-body recipe-card")
      .attr("recipeKey", recipeKey);
    let parentCardRow = $("<div>").addClass("row");
    parentCard.append(cardBody);
    cardBody.append(parentCardRow);

    // === left side ===
    let cardImgDiv = $("<div>").addClass(
      "container img-box col-xs-12 col-md-3"
    );
    let cardImg = $("<img>")
      .attr("src", mealImg)
      .addClass("card-img");
    cardImgDiv.append(cardImg);
    parentCardRow.append(cardImgDiv);

    // === right side ===
    let titleDiv = $("<div>").addClass("container col-xs-12 col-md-9");
    let titleH3 = $("<h3>")
      .addClass("text-right text-break")
      .text(mealTitle);
    let titleP = $("<p>")
      .addClass("text-right")
      .text("This elegant dish can be made in under 30mins. Feeds 4. #dinner");
    titleP = $("<p>")
      .addClass("text-right")
      .text(truncatedDirections.substr(0, 65));
    titleDiv.append(titleH3);
    titleDiv.append(titleP);

    let divRow = $("<div>").addClass("row");
    titleDiv.append(divRow);
    let tagBox = $("<div>").addClass("container tag-box");
    divRow.append(tagBox);

    if (areaTag !== "") {
      let mealArea = $("<span>")
        .addClass("badge badge-pill badge-warning")
        .text(areaTag);
      tagBox.append(mealArea);
    }

    for (let i = 0; i < mealTagsArray.length; i++) {
      let spanTag = createPillTag(mealTagsArray[i]);

      tagBox.append(spanTag);
    }

    parentCardRow.append(titleDiv);

    return parentCard;
  }

  function createPillTag(element) {
    let lowerTag = element.toLowerCase();
    let newTag = $("<span>")
      .addClass("badge badge-pill")
      .text(element);

    switch (lowerTag) {
      case "meat":
        newTag.addClass("badge-danger");
        return newTag;

      case "dairy":
        newTag.addClass("badge-light");
        return newTag;

      default:
        newTag.addClass("badge-dark");
        return newTag;
    }
  }

  function appendCardTo(targetClass, card) {
    // targetClass = '.' + targetClass;
    targetClass = `.${targetClass}`;
    $(targetClass).prepend(card);
  }

  function addMessage(elementClass, type) {
    // elementClass = '.' + elementClass;
    // elementClass = '.' `${elementClass}`;
    elementClass = `. ${elementClass}`;
    let theMessage = "";

    if (type === "success") {
      theMessage = $("<div>")
        .addClass("alert alert-success")
        .attr("role", "alert")
        .text("Yay! you saved something!");
    } else {
      theMessage = $("<div>")
        .addClass("alert alert-danger")
        .attr("role", "alert")
        .text("o no!! bad things!!!! or... data didnt save");
    }

    $(elementClass).prepend(theMessage);
  }

  function goGetDadJoke(queryUrl) {
    $.ajax({
      url: queryUrl,
      method: "GET",
      dataType: "json"
    }).then(function(response) {
      $(".dad-joke-box").append(response.joke);
    });

    // fetch(apiSearchUrl).then((response) => {
    //     return response.json();
    // }).then((myJson) => {
    //     console.log(myJson);

    // });

    // let myHeaders = new Headers({
    //     'Accept': 'application/json'
    // });

    // fetch(apiSearchUrl,{
    //     method: 'GET'
    // }, myHeaders).then( function(response) {
    //     console.log(response);
    //     // console.log(response.text());
    //     // console.log( response.json() );

    // }, function(error) {
    //     console.error(error.message);
    //     // error.message;
    // });

    // let myHeaders = new Headers({
    //     'Content-Type': 'application/json'
    //   });

    // fetch(url, {
    //     method: "GET",
    //     headers: myHeaders
    //   }).then(function(response) {
    //     response.status     //=> number 100–599
    //     response.statusText //=> String
    //     response.headers    //=> Headers
    //     response.url        //=> String

    //     return response.text()
    //   }, function(error) {
    //     error.message //=> String
    //   });

    // $.ajax({
    //     url: queryU,
    //     method: 'GET',
    //     dataType: 'json'
    // }).then(function (response) {
    //     $('.dad-joke-box').append(response.joke);

    // });

    // fetch(apiString, {
    //     method: "GET",
    //     dataType: 'json',
    //     ContentType: 'application/json'
    //   })
    //   .then((resp) => {
    //     return resp.json();
    //   })
    //   .then((user) => {
    //     console.log(user);
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //   });

    // fetch(apiString).then((response) => {
    //     return response.json();
    // }).then((myJson) => {
    //     console.log(myJson);
    // });

    // fetch(apiString).then((resp) => resp.json())
    //     .then(function(data){
    //         console.log(data);
    //     });
  }

  function ajaxCallSearch(inputString) {
    let searchInput = inputString;
    let queryURL = apiSearchUrl + searchInput;
    let arrayOfMeals = [];

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      arrayOfMeals = response.meals;

      for (let i = 0; i < arrayOfMeals.length; i++) {
        appendCardTo("recipe-box", createCard(arrayOfMeals[i]) );
      }

      setRecipeCardListener();

    });
  }

  function setRecipeCardListener() {
    $(".recipe-card").on("click", function() {
      $(".details-box").show();
      let key = $(this).attr("recipekey");
      let queryURL = apiLookupUrl + key;
  
      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        masterCardsList = $(".recipe-box").detach();
  
        //get variables from response
        mealName = response.meals[0].strMeal;
        mealIMG = response.meals[0].strMealThumb;
        category = response.meals[0].strCategory;
        cuisineType = response.meals[0].strArea;
        ing20 = response.meals[0].strMeasure20 + "  " + response.meals[0].strIngredient20;
        instructions = response.meals[0].strInstructions;
  
        // ===================================================
        // Chris Stead magic juice
        // ===================================================
        let recipeOutput =
          "<p>" +
          instructions
            .replace(/(\r?\n){2}/g, "</p><p>")
            .replace(/(\r?\n)+/g, "<br/>") +
          "</p>";
  
        let i = 1;
        let ingredient = "";
        let measure = "";
        do {
          ingredient = response.meals[0]["strIngredient" + i.toString()];
          measure = response.meals[0]["strMeasure" + i.toString()];
  
          if (ingredient === null || measure === null) {
            ingredient = "";
            measure = "";
            $("#ing" + i.toString()).text(" ");
          } else {
            $("#ing" + i.toString()).text(measure + "  " + ingredient);
          }
  
          i++;
        } while (i <= 20);
  
        $("#mealName").html("<h2 class='float-right'>" + mealName + "</h2>");
        $("#exampleIMG").attr("src", mealIMG);
        $("#exampleIMG").attr("style", "height: 200px; width: 200px;");
        $("#categoryTag").html(category);
        $("#areaTag").html(cuisineType);
        $("#instructions").html(recipeOutput);
      });
  
      $(".jumbotron").hide();
      $(".details-box").css("margin-top", "+15px");
      $(".details-box").css("margin-bottom", "+15px");
      $(".main-box").css("border", "0px");
    });

  // end of etRecipeCardListener
  }






  //end of doc ready
});
