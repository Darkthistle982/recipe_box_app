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

// ===================================================
// child added to firebase
// ===================================================
dataRef.ref().on("child_added", function (childSnapshot) {
  //TODO: I will be back!
  console.log('child added');
  console.log(childSnapshot);
  

}, function (errorObject) {
  // console.log("Errors handled: " + errorObject.code);
  if (errorObject) {
      
  } else {
      //hooray!
      addSuccessMessage('card-message');

  }
});