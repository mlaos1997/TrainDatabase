//Initialize Firebase
//==========================================
  var config = {
    apiKey: "AIzaSyAMoBP4TFLy0l9khfw4wSNai28d3G0FYkA",
    authDomain: "traintimedatabase.firebaseapp.com",
    databaseURL: "https://traintimedatabase.firebaseio.com",
    projectId: "traintimedatabase",
    storageBucket: "",
    messagingSenderId: "149561548866"
  };
  firebase.initializeApp(config);
  //Create variable to store database
  //========================================
  var trainData = firebase.database();
 //Create content for Firebase data
 //Button function that adds new trains to our datbase
 //=================================================
    $("#submitBtn").on("click", function () {
//Take user input, trim values, and store in variable
//===================================================
  var trainName      = $("#train-name-input").val().trim();
  var destination    = $("#destination-input").val().trim();
  var frequency      = $("#frequency-input").val().trim();
  var firstTrainUnix = moment($("#first-train-input").val().trim(), "HH:mm").subtract(10, "years").format("X");
  
//Here we are storing our train data in an object
//==================================================
  var newTrain = {
    name: trainName,
    destination: destination,
    firstTrain: firstTrainUnix,
    frequency: frequency
  };

//Here we are pushing our new train to our Firebase Database
//==================================================
  trainData.ref().push(newTrain);

//Reset our values
//==================================================
  $('#train-name-input').val('');
  $('#destination-input').val('');
  $('#first-train-input').val('');
  $('#frequency-input').val('');

  // Determine when the next train arrives
  //====================================================
  return false;
    });

// This function will add our trains to our Firebase Database
// This function will also update our table HTML
//==================================================
  trainData.ref().on("child_added", function(childSnapshot, prevChildKey) {
//Here we are taking our snapshot on value, and storing it in a variable
//==================================================
    var tName        = childSnapshot.val().name;
    var tDestination = childSnapshot.val().destination;
    var tFrequency   = childSnapshot.val().frequency;
    var tFirstTrain  = childSnapshot.val().firstTrain;


// Minutes until next train arrives
// Using modulus to find calculate time between difference and frequency
//==================================================
    var differenceTimes = moment().diff(moment.unix(tFirstTrain), "minutes");
    var tRemainder      = moment().diff(moment.unix(tFirstTrain), "minutes") % tFrequency;
    var tMinutes        = tFrequency - tRemainder;

//Formula to calculate arrival time
//==================================================
    var tArrival = moment().add(tMinutes, "m").format("hh:mm A");

// Add each train's data into the table
//==================================================
  $("#trainTable > tbody").append("<tr><th>" + tName + "</th><th>" + tDestination + "</th><th>"
  + tFrequency + "</th><th>" + tArrival + "</th><th>" + tMinutes + "</th></tr>");
    });
  


