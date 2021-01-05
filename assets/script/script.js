$(document).ready(function () {

  var resultsObj = JSON.parse(localStorage.getItem("Results"));


  for (var i = 0; i < resultsObj.length; i++) {

    $("#result" + i).text(resultsObj[i].address)
    var imgTag = $("<img>");
    imgTag.attr("src", resultsObj[i].img)
    $("#map" + i).append(imgTag);


  }// closes for loop

  var nameEst_list = "";
  var estString = "";
  var phoneList = "";
  var ratingList = "";
  var addressList = "";


  //Gets type of location from local storage
  estString = JSON.parse(localStorage.getItem("last_establishment_array"));

  //Gets phone numbers
  phoneList = JSON.parse(localStorage.getItem("lastphonenumber"));


  //Gets ratings
  ratingList = JSON.parse(localStorage.getItem("lastratingsarray"));

  //Get addresses from local storage
  addressList = JSON.parse(localStorage.getItem("Results"));

  //NEED TO REPLACE WITH resultInfo once I get html from Hever
  var resultEl = $(".result");

  for (var i = 0; i < resultEl.length; i++) {
    //Gets the element to display to
    var displayEl = resultEl[i];

    //Getting addresses
    var addressToDisplay = addressList[i].address;


    //Displaying the type of establishment
    var estDisplay = estString[i];

    var estDisplayFinal = "Type of establishment: " + estDisplay;
    if (estDisplay == "convenience storedrugstore") {
      estDisplay = "convenience store, drug store";
      estDisplayFinal = "Type of establishment: " + estDisplay;
    }
    if (estDisplay == "convenience storedrugstorehealth care") {
      estDisplay = "convenience store, drug store, health care";
      estDisplayFinal = "Type of establishment: " + estDisplay;
    }
    if (estDisplay == "doctor's officehealth care") {
      estDisplay = "doctor's office, health care";
      estDisplayFinal = "Type of establishment: " + estDisplay;
    }
    if (estDisplay == "hospitalhealth care") {
      estDisplay = "hospital, health care";
      estDisplayFinal = "Type of establishment: " + estDisplay;
    }
    if (!estDisplay) {
      estDisplay = "not available";
      estDisplayFinal = "Type: unknown";
    }


    //Displaying the phone number
    var phoneDisplay = phoneList[i];
    phoneDisplay = phoneDisplay.replace(/\"/g, "");
    var phoneDisplayFinal = "Phone number: " + phoneDisplay;
    if (phoneDisplay == "none available") {
      phoneDisplayFinal = "No phone number available";
    }

    //Displaying the google rating 
    var ratingDisplay = ratingList[i];
    var ratingDisplayFinal = "Google rating: " + ratingDisplay + "/5 stars";
    if (ratingDisplay == "none available") {
      ratingDisplayFinal = "Not rated on Google";
    }
    var textToDisplay = addressToDisplay + "<br>" + estDisplayFinal + "<br>" + phoneDisplayFinal + "<br>" + ratingDisplayFinal;
    displayEl.innerHTML = textToDisplay;

  }


});//closes document.ready function

