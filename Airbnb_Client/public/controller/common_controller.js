/**
 * Created by vicky on 11/20/2016.
 */
/**
 * http://usejsdoc.org/
 */
var app = angular.module('App', []);
app.controller('authentication_controller', function ($scope, $window, $location, $http) {

    $scope.checkLogin = function () {

        var email_id = $scope.email_id;
        var pwd = $scope.password;
        var d = {email_id: email_id, password: pwd};
        $http.post('/signin', d)
            .success(function (data) {
                if (data.success) {
                    $window.location.href = "/";
                    $scope.isWrongCredential = false;
                } else {
                    // $window.location.href = "/login";
                    $scope.isWrongCredential = true;
                }
            })
            .error(function (data) {
                $scope.isWrongCredential = true;
            });
    };

    $scope.registerUser = function () {

        var email_id = $scope.email;
        var pwd = $scope.password;
        var first_name = $scope.first_name;
        var last_name = $scope.last_name;
        if (email_id && pwd && first_name) {
            var d = {email_id: email_id, password: pwd, first_name: first_name, last_name: last_name};
            $http.post('/registerUser', d)
                .success(function (data) {
                    if (data.success) {
                        $window.location.href = "/";
                        $scope.isUserExist = false;
                    } else {
                        $scope.isUserExist = true;
                    }
                })
                .error(function (data) {
                    $scope.isUserExist = true;
                });
        }

    };


});

app.controller('account_user_management', function ($scope, $window, $location, $http) {
    //security code
    $scope.rockerSa = false;
    $scope.rockerSb = true;
    $scope.rockerSo = false;
    $scope.check = function () {
        if ($scope.new_password != $scope.cpassword) {
            $scope.rockerSa = true;
            $scope.rockerSb = false;
        } else {
            $scope.rockerSa = false;
            $scope.rockerSb = true;
        }
    }
    $scope.updatePassword = function () {
        $http({
            method: "POST",
            url: '/updatePassword',
            params: {
                old_password: $scope.old_password,
                new_password: $scope.new_password
            }
        }).success(function (result) {
            if (result == "valid") {
                $scope.rockerSo = false;
                $scope.alert1 = true;
                $window.location.assign('/Account_Security');
            } else if (result == "invalid") {
                $scope.alert1 = false;
                $scope.rockerSo = true;
            }
            console.log("password update API working");
        }).error(function (err) {
            console.log(err);
        })
    }

    //payment code
    $scope.alert2 = false;
    $scope.creditCard = function () {
        console.log($scope.ccv, $scope.cnum, $scope.expMonth, $scope.expYear);
        $http({
            method: "POST",
            url: '/paymentMethodUpdate',
            params: {
                cvv: $scope.ccv,
                cno: $scope.cnum,
                expm: $scope.expMonth,
                expy: $scope.expYear

            }
        }).success(function (result) {
            if (result == "OK") {
                console.log("ok result");
                $scope.alert2 = true;
            }
        }).error(function (err) {
            console.log(err);
        })
    }

    //transaction code

    $http({
        method: "GET",
        url: '/payinTransaction',
        params: {}
    }).success(function (result) {
        $scope.payin = result;
        console.log(result);
    }).error(function (err) {
        console.log(err);
    });

    $http({
        method: "GET",
        url: '/payoutTransaction',
        params: {}
    }).success(function (result) {
        $scope.payout = result;
        console.log(result);
    }).error(function (err) {
        console.log(err);
    });

});

app.controller('editUser_controller', function ($scope, $window, $location, $http) {

    console.log("in editUser_controller");

    $scope.loadEditProfilePage = function () {

        $scope.success_model = false;

        $http.post('/loadEditUserPage')
            .success(function (data) {
                if (data.statusCode == 200) {

                    $scope.user = data.data;
                    console.log("Data is :")
                    console.log($scope.user);

                }
                else {

                    console.log("Error in loading edit profile page");
                }
            })
            .error(function (data) {

            });


    };


    $scope.uploadProfileImage = function () {

        console.log("upload profile image ::");
        var file = $scope.profileImage;
        console.log(file);
        var uploadUrl = "/uploadProfileImage";

        //fileUpload.uploadFileToUrl(file, uploadUrl);


        $http.post('/uploadProfileImage', file, {'enctype': "multipart/form-data"})
            .success(function (data) {

                console.log("Uploaded");
            })
            .error(function (data) {

                console.log("Not upoaded");

            });


    };


    $scope.saveUserData = function () {

        init();
        console.log("After update");
        console.log($scope.user);
        var validate = true;

        if ($scope.user.firstName == undefined || $scope.user.firstName == "") {
            validate = false;
            $scope.first_invalid = true;
        }

        if ($scope.user.lastName == undefined || $scope.user.lastName == "") {
            validate = false;
            $scope.last_invalid = true;
        }

        if ($scope.user.address == undefined || $scope.user.address == "") {
            validate = false;
            $scope.address_invalid = true;
        }

        if ($scope.user.city == undefined || $scope.user.city == "") {
            validate = false;
            $scope.city_invalid = true;
        }

        if ($scope.user.state == undefined || $scope.user.state == "") {
            validate = false;
            $scope.state_invalid = true;
        }

        if ($scope.user.zip == undefined || $scope.user.zip == "") {
            validate = false;
            $scope.pin_invalid = true;
        }

        if ($scope.user.email == undefined || $scope.user.email == "") {
            validate = false;
            $scope.email_invalid = true;
        }

        if (validate == false) {
            return;
        }

        var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test($scope.user.zip);

        if (isValidZip) {
        }
        else {
            $scope.pin_wrong = true;
            validate = false;
        }


        if (validate) {

            $http({
                method: "POST",
                url: '/editUser',
                data: {
                    "firstName": $scope.user.firstName,
                    "lastName": $scope.user.lastName,
                    "address": $scope.user.address,
                    "city": $scope.user.city,
                    "state": $scope.user.state,
                    "zip": $scope.user.zip,
                    "email": $scope.user.email
                }
            }).success(function (data) {

                if (data.statusCode == 401) {
                    console.log("status code 401");
                    $scope.fail_model = true;
                }
                else {
                    console.log("statuscode 200");
                    $scope.success_model = true;

                }
            }).error(function (error) {
                console.log(error);
            });

        }
        else {
            console.log("Non Valdate");
        }

    };


    $scope.loadProfilePhotoPage = function () {


        $http.post('/loadProfilePhotoPage')
            .success(function (data) {
                if (data.statusCode == 200) {

                    $scope.user = data.data;
                    console.log("Data is :")
                    console.log($scope.user);

                }
                else {

                    console.log("Error in loading profile photo page");
                }
            })
            .error(function (data) {

            });


    };


    function init() {

        $scope.ccv_invalid = false;
        $scope.ccv_wrong = false;
        $scope.expdate_invalid = false;
        $scope.expdate_wrong = false;
        $scope.ccnumber_invalid = false;
        $scope.ccnumber_wrong = false;
        $scope.phone_invalid = false;
        $scope.phone_wrong = false;
        $scope.pin_invalid = false;
        $scope.pin_wrong = false;
        $scope.city_invalid = false;
        $scope.state_invalid = false;
        $scope.address_invalid = false;
        $scope.last_invalid = false;
        $scope.first_invalid = false;
        $scope.bdate_invalid = false;
        $scope.fail_model = false;
        $scope.success_model = false;

    }


});


app.controller('review_controller', function ($scope, $window, $location, $http) {

    console.log("in review controller");

    $scope.loadReviewAboutPage = function () {

        $http.post('/loadReviewAboutPage')
            .success(function (data) {

                if (data.statusCode = 200) {


                    console.log("REVIEWS");
                    console.log(data.data);
                    $scope.fromHostReview = data.data.fromHostReview;
                    $scope.fromUserReview = data.data.fromUserReview;
                    console.log($scope.fromHostReview);
                    console.log($scope.fromUserReview);
                }
                else {
                    console.log("Error in getting review");
                }

            })
            .error(function (data) {

                console.log(data);

            });


    };


    $scope.loadReviewByPage = function () {

        $http.post('/loadReviewByPage')
            .success(function (data) {

                if (data.statusCode = 200) {


                    console.log("REVIEWS");
                    console.log(data.data);
                    $scope.toUserReview = data.data.toUserReview;
                    $scope.toHostReview = data.data.toHostReview;

                }
                else {
                    console.log("Error in getting review");
                }

            })
            .error(function (data) {

                console.log(data);
            });


    };


});

app.controller('search-page', ['$scope', '$http', '$compile', '$filter', function ($scope, $http, $compile, $filter) {

    $scope.current_date = new Date();
    $scope.totalPages = 0;
    $scope.currentPage = 1;
    $scope.range = [];

    function no_results() {
        if($('.search-results').hasClass('loading'))
            $('#no_results').hide();
        else
            $('#no_results').show();
    }

    var location1 = getParameterByName('location');


    var current_url = (window.location.href).replace('/search', '/searchResult');


    $(document).ready(function(){
        localStorage.removeItem("map_lat_long");
        var room_type = [];
        $('.room-type:checked').each(function(i){
            room_type[i] = $(this).val();
        });


        $('.search-results').addClass('loading');
        no_results();
        $http.get(current_url).then(function(response) {
            // $scope.room_result = response;
            $('.search-results').removeClass('loading');
            no_results();
            $scope.room_result = response.data;
            $scope.totalPages   = response.data.last_page;
            $scope.currentPage  = response.data.current_page;
            $scope.checkin = getParameterByName("checkin");
            $scope.checkout = getParameterByName("checkout");
            $scope.guests = getParameterByName("guests");
            $scope.room_type=getParameterByName("room_type");
            var room_type = getParameterByName("room_type").split(',');

            for(var i = 0; i < room_type.length; i++){
                switch(room_type[i]) {
                    case "Entire home/apt":
                        $scope.room_type_1 = true;
                        break;
                    case "Private room":
                        $scope.room_type_2 = true;
                        break;
                    case "Shared room":
                        $scope.room_type_3 = true;
                        break;
                    default:
                        $scope.room_type_1 = false;
                        $scope.room_type_2 = false;
                        $scope.room_type_3 = false;

                }
            }
            initialize(response.data);

//            marker(response.data);
        });
        var location_val = $("#location").val();
        $("#header-search-form").val(location_val);

    });



    function initialize(response) {

        var latitude = $("#lat").val();
        var longitude = $("#long").val();

        var myOptions = {
            center: new google.maps.LatLng(latitude,longitude),
            zoom: 9,
            mapTypeId: google.maps.MapTypeId.ROADMAP

        };
        var map = new google.maps.Map(document.getElementById("map_canvas"),
            myOptions);

        setMarkers(map, response)
        // marker(map,response);

    }

    function setMarkers(map,response){

        var marker;
        var data = response.data;
        var guests = 1;
        for (var i = 0; i < data.length; i++)
        {

            var name = data[i].name;
            var lat = Number(data[i].rooms_address.latitude);
            var lon = Number(data[i].rooms_address.longitude);
            var labelTxt = "$"+data[i].rooms_price.night;
            latlngset = new google.maps.LatLng(lat, lon);

            /*
             var image = {
             url: 'images/locate-pin.png',
             size: new google.maps.Size(32, 32),
             origin: new google.maps.Point(0, 0),
             anchor: new google.maps.Point(0, 32)
             };
             var shape = {
             coords: [1, 1, 1, 20, 18, 20, 18, 1],
             type: 'poly'
             };
             */

            var marker = new MarkerWithLabel({
                position: latlngset,
                map: map,
                labelContent: labelTxt,
                labelAnchor: new google.maps.Point(18, 65),
                labelClass: "labels", // the CSS class for the label
                labelInBackground: false,
                icon: pinSymbol("red")
            });

            map.setCenter(marker.getPosition());

            var html = '<div id="info_window_'+data[i].id+'" class="listing listing-map-popover" data-price="'+data[i].rooms_price.currency.symbol+'" data-id="'+data[i].id+'" data-user="'+data[i].user_id+'"  data-name="'+data[i].name+'" data-lng="'+data[i].rooms_address.longitude+'" data-lat="'+data[i].rooms_address.latitude+'"><div class="panel-image listing-img">';
            html += '<a class="media-photo media-cover" target="listing_'+data[i].id+'" ><div class="listing-img-container media-cover text-center"><img id="marker_image_'+data[i].id+'" rooms_image = "" alt="'+data[i].name+'" class="img-responsive-height" data-current="0" src="'+APP_URL+'/images/'+data[i].photo_name+'"></div></a>';
            html += '<a class="link-reset panel-overlay-bottom-left panel-overlay-label panel-overlay-listing-label" target="listing_'+data[i].id+'" ><div>';

            var instant_book = '';

            if(data[i].booking_type == 'instant_book')
                instant_book = '<span aria-label="Book Instantly" data-behavior="tooltip" class="h3 icon-beach"><i class="icon icon-instant-book icon-flush-sides"></i></span>';

            html += '<sup class="h6 text-contrast">'+data[i].rooms_price.currency.symbol+'</sup><span class="h3 text-contrast price-amount">'+data[i].rooms_price.night+'</span><sup class="h6 text-contrast"></sup>'+instant_book+'</div></a></div>';
            html += '<div class="panel-body panel-card-section"><div class="media"><h3 class="h5 listing-name text-truncate row-space-top-1" itemprop="name" title="'+data[i].name+'">'+name+'</a></h3>';

            var star_rating = '';

            if(data[i].overall_star_rating != '')
                star_rating = ' · '+data[i].overall_star_rating;

            var reviews_count = '';
            var review_plural = (data[i].reviews_count > 1) ? 's' : '';

            if(data[i].reviews_count != 0)
                reviews_count = ' · '+data[i].reviews_count+' review'+review_plural;

            html += '<div class="text-muted listing-location text-truncate" itemprop="description"><a class="text-normal link-reset" >'+data[i].room_type_name+star_rating+reviews_count+'</a></div></div></div></div>';

            createInfoWindow(marker, html,map);

        }
    }

    function pinSymbol(color) {
        return {
            path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#000',
            strokeWeight: 2,
            scale: 2
        };
    }

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    function setGetParameter(paramName, paramValue)
    {
        var url = window.location.href;

        if (url.indexOf(paramName + "=") >= 0)
        {
            var prefix = url.substring(0, url.indexOf(paramName));
            var suffix = url.substring(url.indexOf(paramName));
            suffix = suffix.substring(suffix.indexOf("=") + 1);
            suffix = (suffix.indexOf("&") >= 0) ? suffix.substring(suffix.indexOf("&")) : "";
            url = prefix + paramName + "=" + paramValue + suffix;
        }
        else
        {
            if (url.indexOf("?") < 0)
                url += "?" + paramName + "=" + paramValue;
            else
                url += "&" + paramName + "=" + paramValue;
        }
        history.pushState(null, null, url);
    }
    function createInfoWindow(marker, popupContent,map) {
        infoBubble = new InfoBubble({
            maxWidth: 3000
        });

        var contentString = $compile(popupContent)($scope);
        google.maps.event.addListener(marker, 'click', function() {

            if (infoBubble.isOpen()) {
                infoBubble.close();
                infoBubble = new InfoBubble({
                    maxWidth: 3000
                });
            }

            infoBubble.addTab('', contentString[0]);

            var borderRadius = 0;
            infoBubble.setBorderRadius(borderRadius);
            var maxWidth = 300;
            infoBubble.setMaxWidth(maxWidth);

            var maxHeight = 300;
            infoBubble.setMaxHeight(maxHeight);
            var minWidth = 282;
            infoBubble.setMinWidth(minWidth);

            var minHeight = 245;
            infoBubble.setMinHeight(minHeight);

            infoBubble.open(map,marker);
        });
    }

    $scope.apply_filter = function()
    {
        $scope.search_result();
    };


    $scope.search_result = function () {

        var room_type = [];
        $('.room-type:checked').each(function(i){
            room_type[i] = $(this).val();
        });
        //alert(room_type);
        if(room_type==''){
            $('.room-type_tag').addClass('hide');
        }

        var checkin = $('#checkin').val();
        var checkout = $('#checkout').val();
        var guest_select = $("#guest-select").val();

        setGetParameter('room_type', room_type);
        setGetParameter('checkin', checkin);
        setGetParameter('checkout', checkout);
        setGetParameter('guests', guest_select);


        var location1 = getParameterByName('location');

        $('.search-results').addClass('loading');
        no_results();
        var change_url = "/search?";
        change_url += "location=" +location1+"&";
        change_url += "room_type=" +room_type+"&";
        change_url += "checkin=" +checkin+"&";
        change_url += "checkout=" +checkout+"&";
        change_url += "guests=" +guest_select;
        var encoded_url = encodeURI(change_url);
        window.location.href = encoded_url;

    };

    $(document).on('click', '.rooms-slider', function() {
        var rooms_id = $(this).attr("data-room_id");
        var img_url =$("#rooms_image_"+rooms_id).attr("src").substr(29);
        var room;
        for(var i = 0; i < $scope.room_result.data.length; i++){
            var temp = $scope.room_result.data[i];
            if(temp.id === rooms_id){
                room = temp;
                break;
            }
        }
        var images = room.images;
        if($(this).is(".target-prev") == true){
            var set_img_url = (images) ? ((images.indexOf(img_url) === images.length - 1) ? images[0] : images[images.indexOf(img_url) + 1]) : "";
            set_img_url = APP_URL + "/images/" + set_img_url;
            $("#rooms_image_"+rooms_id).attr("src",set_img_url);
        }else{
            var set_img_url = (images) ? ((images.indexOf(img_url) === 0) ? images[images.length - 1] : images[images.indexOf(img_url) - 1]) : "";
            set_img_url = APP_URL + "/images/" + set_img_url;
            $("#rooms_image_"+rooms_id).attr("src",set_img_url);
        }
    });

}]);

app.controller('room_details_controller', function ($scope, $window, $location, $http) {
    var room_id = getParameterByName('propertyId');
    var url = "/detail?propertyId=" + room_id;
    $http.get(url).then(function (response) {
        $scope.room_result = response.data;
        url = "/hostReviewsCount?hostId=" + $scope.room_result.users.id;
        $http.get(url).then(function (response) {
            $scope.hostReviews = response.data;
        });
    });

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
});


app.controller('payment_controller', function ($scope, $window, $location, $http) {

    var propertyId = "583737ae83cd51786c7539d6";
    var guest = 4;
    var checkin = 432423434;
    var checkout = 3234324343;
    var totalperday = 4343;
    var days = 2;




    $scope.loadPaymentPage = function () {
        $http.post('/loadPaymentPage')
            .success(function (data) {
                if (data.statusCode == 200) {
                    console.log("USER");
                    console.log(data.data);
                    var user = data.data;
                    $scope.cardNumber = user.cardNumber;
                    $scope.cvv = user.cvv;
                    $scope.firstName = user.firstName;
                    $scope.lastName = user.lastName;
                    $scope.zip = user.zip;
                } else {
                    console.log("Error occured to get data");
                }
            })
            .error(function (data) {
                console.log("Error to get data");
                console.log(data);
            });



        $http({
            method: "POST",
            url: '/getPropertyDetails',
            data: {
                "propertyId": propertyId
            }
        }).success(function (data) {
            if (data.statusCode == 200) {

                console.log("PROPPERTY");
                console.log(data.data);
                var property = data.data;
                $scope.hostId = property.hostId._id;
                $scope.propertName = property.name;
                $scope.location = property.city + ", " + property.state + ", " + property.country;
                $scope.guest = guest;
                $scope.checkin = checkin;
                $scope.checkout = checkout;
                $scope.totalperday = totalperday;
                $scope.days = days;
            } else {
                console.log("Error occured to get property data");
            }
        }).error(function (error) {
            console.log(error);
        });


    };


    $scope.confirmBooking = function () {



        var cardnumber = $scope.cardNumber;
        var expMonth = $scope.expMonth;
        var expYear = $scope.expYear;
        var cvv = $scope.cvv;
        var guest1 = guest;
        var checkin1 = checkin;
        var checkout1 = checkout;
        var properyId1 = propertyId;
        var price = totalperday;
        var days1 = days;
        var hostId = $scope.hostId;



        $http({
            method: "POST",
            url: '/confirmBooking',
            data: {
                "propertyId": properyId1,
                "cardNumber" : cardnumber,
                "expMonth" : expMonth,
                "expYear" :expYear,
                "cvv" : cvv,
                "guest" : guest1,
                "checkin" : checkin1,
                "checkout" : checkout1,
                "price" : price,
                "days": days1,
                "hostId":hostId

            }
        }).success(function (data) {
            if (data.statusCode == 200) {

                console.log("SAVED TRIP");
                console.log(data.data);



            } else {
                console.log("Error occured to booking");
            }
        }).error(function (error) {
            console.log(error);
        });


    };


});
