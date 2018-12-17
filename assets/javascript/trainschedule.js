// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase
// var config = {
//   apiKey: "AIzaSyA_QypGPkcjPtylRDscf7-HQl8ribnFeIs",
//   authDomain: "time-sheet-55009.firebaseapp.com",
//   databaseURL: "https://time-sheet-55009.firebaseio.com",
//   storageBucket: "time-sheet-55009.appspot.com"
// };

var config = {
  apiKey: "AIzaSyAg25HuFswwl8bq-eRW8T4xCa3k57BIHzA",
  authDomain: "test1-9e405.firebaseapp.com",
  databaseURL: "https://test1-9e405.firebaseio.com",
  projectId: "test1-9e405",
  storageBucket: "test1-9e405.appspot.com",
  messagingSenderId: "533951222090"
};

firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainStartTime =  $('#start-time-input').val().trim();  //  moment($('#start-time-input').val().trim(),"HH mm").format("LT");
  var trainFrequency = $("#frequency-input").val().trim();
  

  // Creates local "temporary" object for holding employee data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    start_time: trainStartTime,
    frequency: trainFrequency
  };

  // Uploads employee data to the database
  database.ref('/trains').push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.start_time);
  console.log(newTrain.frequency);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#name-input").val("");
  $("#destination-input").val("");
  $("#start-time-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding Trains in the html when a user adds an entry to the Database
database.ref('/trains').on("child_added", function(childSnapshot) {
  console.clear();
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainStartTime = childSnapshot.val().start_time;
  var trainFrequency = childSnapshot.val().frequency;

  var results = timeCalculation(trainStartTime, trainFrequency)
  var nextArrival = results[0];
  var minutesAway = results[1];
  
  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text( moment(trainStartTime,"HH mm").format("LT")),
    $("<td>").text(trainFrequency),
    $("<td>").text(nextArrival.format('LT')), //.format('LT')
    $("<td>").text(minutesAway)
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});

function timeCalculation(trainStartTime, trainFrequency){

  // Calculate Next Arrival
  // First Time (pushed back 1 year to make sure it comes before current time)
  var trainStartTimeConverted = moment(trainStartTime, "HH:mm").subtract(1, "years");
  console.log('Train Start Time: '+ trainStartTimeConverted);

  // timeDifference = currentTime - trainStartTimeConverted
  var timeDifference = moment().diff(moment(trainStartTimeConverted),'minutes');
  console.log('The time dif in mins is: '+ timeDifference + ' minutes');

  // Time apart (remainder)
  var tRemainder = timeDifference % trainFrequency;
  console.log('The reminder is : ' + tRemainder);
  
  // Minute Until Train
  var minutesAway = trainFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + minutesAway);

  // Next Train
  var nextArrival = moment().add(minutesAway, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm"));

  return [nextArrival ,  minutesAway];

}


// Example Time Math
// -----------------------------------------------------------------------------
// Assume Employee start date of January 1, 2015
// Assume current date is March 1, 2016

// We know that this is 15 months.
// Now we will create code in moment.js to confirm that any attempt we use meets this test case
