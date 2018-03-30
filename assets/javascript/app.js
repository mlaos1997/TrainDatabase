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
  //Create variable to hold firebase data
  //========================================
  var trainData = firebase.database();

  //This function will create content for our table
  //===================================================
  trainData.ref().on("value", function(snapshot) {
	//store everything into a variable
	//=================================================
	var tName 		 = snapshot.val().name;
	var tDestination = snapshot.val().destination;
	var tFrequency   = snapshot.val().frequency;
	var tFirstTrain  = snapshot.val().firstTrain;


	// Calculate the minutes until arrival using hardcore math
	// To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
	// and find the modulus between the difference and the frequency.
	var differenceTimes = moment().diff(moment.unix(tFirstTrain), "minutes");
	var tRemainder		= moment().diff(moment.unix(tFirstTrain), "minutes") % tFrequency;
	var tMinutes		= tFrequency - tRemainder;

	// To calculate the arrival time, add the tMinutes to the current time
	var tArrival = moment().add(tMinutes, "m").format("hh:mm A");

	// Add each train's data into the table
  $("#trainTable > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>"
  + tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");
  	});
  

  $("#submitBtn").on("click", function () {
  //Gather user input and store value in variable
  //==================================================
  var trainName      = $("#train-name-input").val().trim();
  var destination    = $("#destination-input").val().trim();
  var frequency      = $("#frequency-input").val().trim();
  var firstTrainUnix = moment($("#first-train-input").val().trim(), "HH:mm").subtract(10, "years").format("X");
  
  //Save the new price in Firebase. This will cause our "value" callback above to fire and update UI
  //====================================================
  database.ref().set({
  	name: trainName,
  	destination: destination,
  	firstTrain: firstTrainUnix,
  	frequency: frequency
  });

  // Uploads train data to the database
  //====================================================
  trainData.ref().push(newTrain);

  // Clears all of the text-boxes
  //====================================================
  $('#train-name-input').val('');
  $('#destination-input').val('');
  $('#first-train-input').val('');
  $('#frequency-input').val('');

  // Determine when the next train arrives
  //====================================================
  return flase;
  	});

