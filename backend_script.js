  
$(document).ready(function () {
    var apiKEY = "AIzaSyBNh5KfG7ZYFdl2CMuBiP47FmjmFQvs-aE";
    var covidTestAddress = "";
    var testSiteArray = [];
    var sampleURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + covidTestAddress + "&key=" + apiKEY;
    var typeEstablishmentArray = [];

    var oldSearchArray = [];
    var rating = "";
    var ratingArray = [];
    var phoneNumber = "";
    var phoneNumberArray = [];


    var mapImgApiKey = "Z7n3t2fnai6LHriDt0pVcxWyZec1O8JJROrBAgjJlZM";


    //API key for hereAPI
    var hereApiKey = 'SWTXu3KMyXT1DwXvXayGN6j8dP4H9ZlmmqPfFWe89kQ'
    var zipLat;
    var zipLong;



    var zipCode;



    ////////////Modal initialization (I'm not sure but it seems this needs to be done before all modals are actually called)
    $('.modal').modal();

    // on click event to search by zip code and return covid test sites
    $("#errorMessage").on("click", function (event) {

        event.preventDefault();

        zipCode = $("#search-box").val().trim();

        var zipString = zipCode.toString();

        console.warn("length of zipcode entered is " + zipString.length)

        if (!zipCode || zipCode === NaN || zipString.length != 5) {
            console.log("test1");

            //Open the modal for the error message
            //$('#modal1').modal('open');

            //alert("THIS IS AN ERROR MESSAGE")
            
                $("#modal1").modal("open")
                
            return

        } //closes input validation check



        else {

            $("#modal2").modal("open")

            oldSearchArray.push(zipCode);

            localStorage.setItem("past_zipcodes", oldSearchArray);

            geoPosition_and_TestingSites();

            //change location to results page

             setTimeout(function () {
                
                 window.location.href = "./result.html";
             }, 5000

             ); // closes set timeout

        
        }  //closes closes else condition

    })//closes zip code search on click event


    //Creates an array of the type of establishment
    function getInfoFromGoogle(testSiteArray) {
        ratingArray = [];
        phoneNumberArray = [];
        for (var i = 0; i < testSiteArray.length; i++) {
            //Getting the address and using it to update sampleURL
            covidTestAddress = testSiteArray[i].address;
            sampleURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + covidTestAddress + "&key=" + apiKEY;

            //Making ajax call for each one
            $.ajax({
                url: sampleURL,
                method: "GET"
            }).then(function (response) {

                //Getting Google rankings and phone numbers
                var placeId = response.results[0].place_id;
                placeDetailsURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=" + placeId + "&fields=name,rating,formatted_phone_number&key=" + apiKEY;

                $.ajax({
                    url: placeDetailsURL,
                    method: "GET"
                }).then(function (response) {
                    rating = JSON.stringify(response.result.rating);
                    phoneNumber = JSON.stringify(response.result.formatted_phone_number);

                    if (rating == undefined) {
                        rating = "none available";
                    }
                    if (phoneNumber == undefined) {
                        phoneNumber = "none available";
                    }
                    ratingArray.push(rating);
                    phoneNumberArray.push(phoneNumber);


                    //In local storage we now have ratings and rakings for the last thing that was searched
                    localStorage.setItem("lastratingsarray", JSON.stringify(ratingArray));
                    localStorage.setItem("lastphonenumber", JSON.stringify(phoneNumberArray));


                });//Closing fxn after ajax call for google places


                //Getting the type of establishment
                var typeEstablishment = response.results[0].types;
                typeEstablishment = JSON.stringify(typeEstablishment);
                var newEstablishmentString = "";

                //We only want to display for certain types of establishment
                var convenienceStore = typeEstablishment.includes("convenience_store");
                var drugStore = typeEstablishment.includes("drugstore");
                var doctor = typeEstablishment.includes("doctor");
                var hospital = typeEstablishment.includes("hospital");
                var healthCare = typeEstablishment.includes("health");

                if (convenienceStore) {
                    newEstablishmentString = newEstablishmentString + "convenience store";
                }
                if (drugStore) {
                    newEstablishmentString = newEstablishmentString + "drugstore";
                }
                if (doctor) {
                    newEstablishmentString = newEstablishmentString + "doctor's office";
                }
                if (hospital) {
                    newEstablishmentString = newEstablishmentString + "hospital";
                }
                if(healthCare){
                    newEstablishmentString = newEstablishmentString + "health care";
                }

                //Creates an indexed array of info on the locations, so we will only alert for convenience stores, drugstores, doctor's offices, and hospitals
                typeEstablishmentArray.push(newEstablishmentString);

                //The zip code as well as the type of establishments for the ten sites within range are stored in local storage
                localStorage.setItem("last_establishment_array", JSON.stringify(typeEstablishmentArray));

            });
        }// End of for loop

    }

    function geoPosition_and_TestingSites() {
        //build out query for zip code 
        var geoCodeQuery = 'https://geocode.search.hereapi.com/v1/geocode?apikey=' + hereApiKey + '&q=' + zipCode + ';country=USA'

        $.ajax({
            url: geoCodeQuery,
            method: "GET"

        }).then(function (response) {


            zipLat = response.items[0].position.lat
            zipLong = response.items[0].position.lng
            // console.log(response)



            // build out query for test site locations
            var discoverQueryURL = 'https://discover.search.hereapi.com/v1/discover?apikey=' + hereApiKey + '&q=Covid&at=' + zipLat + ',' + zipLong + '&limit=10'

            $.ajax({
                url: discoverQueryURL,
                method: "GET"

            }).then(function (response) {
              

               
                console.log(response)

                for (i = 0; i < response.items.length; i++) {
                    
                
            
                    testSiteObject = {
                        address: response.items[i].address.label.slice(23),
                        phone: response.items[i].contacts[0].phone[0].value,
                        website: response.items[i].contacts[0].www[0].value,
                        lat: response.items[i].access[0].lat,
                        long: response.items[i].access[0].lng,
                        img: "https://image.maps.ls.hereapi.com/mia/1.6/mapview?poi=" + response.items[i].access[0].lat + "," + response.items[i].access[0].lng + "&poitxs=16&poitxc=black&poifc=yellow&z=15&apiKey=" + mapImgApiKey
                        
                    }

                    testSiteArray.push(testSiteObject);
                    console.log(testSiteArray)




                    // console.log(response)
                    // console.log(testSiteObject.img);


                    // console.log(testSiteArray);

                    localStorage.setItem("Results", JSON.stringify(testSiteArray));
                    


                }
                //Feeding this information into a function to get more information
                // console.log("test site array is " + testSiteArray)

                getInfoFromGoogle(testSiteArray);

                var testOb = JSON.parse(localStorage.getItem("Results", testSiteArray))
                    console.log(testOb);




            });// closes nested Ajax


        });// closes Ajax

    }



})// closes doc.ready function

