/**
 * Created by vicky on 11/20/2016.
 */
/**
 * http://usejsdoc.org/
 */
var app = angular.module('App',[]);
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

app.controller('editUser_controller', function($scope,$window,$location,$http) {

    console.log("in editUser_controller");

    $scope.loadEditProfilePage = function () {

        $scope.success_model = false;

        $http.post('/loadEditUserPage')
            .success(function(data){
                if(data.statusCode==200){

                    $scope.user=data.data;
                    console.log("Data is :")
                    console.log($scope.user);

                }
                else{

                    console.log("Error in loading edit profile page");
                }
            })
            .error(function(data) {

            });


    };



    $scope.uploadProfileImage = function () {

        console.log("upload profile image ::");
        var file = $scope.profileImage;
        console.log(file);
        var uploadUrl = "/uploadProfileImage";

        //fileUpload.uploadFileToUrl(file, uploadUrl);




        $http.post('/uploadProfileImage',file,{'enctype':"multipart/form-data"})
            .success(function(data){

                console.log("Uploaded");
            })
            .error(function(data) {

                console.log("Not upoaded");

            });


    };




    $scope.saveUserData = function () {

        init();
        console.log("After update");
        console.log($scope.user);
        var validate = true;

        if($scope.user.firstName==undefined || $scope.user.firstName==""){
            validate = false;
            $scope.first_invalid = true;
        }

        if($scope.user.lastName==undefined || $scope.user.lastName==""){
            validate = false;
            $scope.last_invalid = true;
        }

        if($scope.user.address==undefined || $scope.user.address==""){
            validate = false;
            $scope.address_invalid = true;
        }

        if($scope.user.city==undefined || $scope.user.city==""){
            validate = false;
            $scope.city_invalid = true;
        }

        if($scope.user.state==undefined || $scope.user.state==""){
            validate = false;
            $scope.state_invalid = true;
        }

        if($scope.user.zip==undefined || $scope.user.zip==""){
            validate = false;
            $scope.pin_invalid = true;
        }

        if($scope.user.email==undefined || $scope.user.email==""){
            validate = false;
            $scope.email_invalid = true;
        }

        if(validate==false){
            return;
        }

        var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test($scope.user.zip);

        if(isValidZip)
        {}
        else
        {
            $scope.pin_wrong = true;
            validate = false;
        }


        if(validate){

            $http({
                method : "POST",
                url : '/editUser',
                data : {
                    "firstName" : $scope.user.firstName,
                    "lastName" : $scope.user.lastName,
                    "address" : $scope.user.address,
                    "city" : $scope.user.city,
                    "state" : $scope.user.state,
                    "zip": $scope.user.zip,
                    "email":$scope.user.email
                }
            }).success(function(data) {

                if (data.statusCode == 401) {
                    console.log("status code 401");
                    $scope.fail_model = true;
                }
                else
                {
                    console.log("statuscode 200");
                    $scope.success_model = true;

                }
            }).error(function(error) {
                console.log(error);
            });

        }
        else {
            console.log("Non Valdate");
        }

    };


    $scope.loadProfilePhotoPage = function () {


        $http.post('/loadProfilePhotoPage')
            .success(function(data){
                if(data.statusCode==200){

                    $scope.user=data.data;
                    console.log("Data is :")
                    console.log($scope.user);

                }
                else{

                    console.log("Error in loading profile photo page");
                }
            })
            .error(function(data) {

            });




    };



    function init(){

        $scope.ccv_invalid = false;
        $scope.ccv_wrong = false;
        $scope.expdate_invalid = false;
        $scope.expdate_wrong = false;
        $scope.ccnumber_invalid= false;
        $scope.ccnumber_wrong = false;
        $scope.phone_invalid =false;
        $scope.phone_wrong = false;
        $scope.pin_invalid =false;
        $scope.pin_wrong = false;
        $scope.city_invalid = false;
        $scope.state_invalid = false;
        $scope.address_invalid =false;
        $scope.last_invalid= false;
        $scope.first_invalid = false;
        $scope.bdate_invalid = false;
        $scope.fail_model=false;
        $scope.success_model =false;

    }


});



app.controller('review_controller', [ '$scope', 'fileUpload',function($scope,$window,$location,$http) {

    console.log("in review controller");
   
    $scope.loadReviewAboutPage = function () {
        
        $http.post('/loadReviewAboutPage')
            .success(function(data){
                
            })
            .error(function(data) {
               
            });


    };


    $scope.loadReviewAboutPage = function () {

        $http.post('/loadReviewByPage')
            .success(function(data){

            })
            .error(function(data) {

            });


    };



}]);




/*
app.controller('search-page', ['$scope', '$http', '$compile', '$filter', function ($scope, $http, $compile, $filter) {


    var current_url = (window.location.href).replace('/search', '/searchResult');
    $http.get(current_url).then(function(response) {
        // $scope.room_result = response;
        $('.search-results').removeClass('loading');
        no_results();
        $scope.room_result = response.data;
        $scope.totalPages   = response.data.last_page;
        $scope.currentPage  = response.data.current_page;

        // marker(response.data);
    });

    function no_results() {
        if($('.search-results').hasClass('loading'))
            $('#no_results').hide();
        else
            $('#no_results').show();
    }
}]);
*/


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
                    case "1":
                        $scope.room_type_1 = true;
                        break;
                    case "2":
                        $scope.room_type_2 = true;
                        break;
                    case "3":
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

           /* var marker = new google.maps.Marker({
                map: map,
                title: name,
                position: latlngset,
                // label: labelTxt,
                icon: image,
                // shape: shape,
                // zIndex: 1,
                label: "Ancb",
                labelAnchor: new google.maps.Point(15, 65),
                labelClass: "labels", // the CSS class for the label
                labelInBackground: false
               // icon: pinSymbol('red')


            });*/
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


        /*if($.trim(dataurl) ==''){
            $(this).parent().addClass("loading");
            $http.post('rooms_photos', {rooms_id: rooms_id})
                .then(function(response) {
                    angular.forEach(response.data, function(obj){
                        if($.trim(dataurl) ==''){
                            dataurl = obj['name'];
                        }
                        else
                            dataurl = dataurl +','+ obj['name'];
                    });

                    $("#rooms_image_"+rooms_id).attr("rooms_image", dataurl);
                    var img_explode = img_url.split('rooms/'+rooms_id+'/');

                    var all_image = dataurl.split(',');
                    var rooms_img_count = all_image.length;
                    var i = 0;
                    var set_img_no = '';
                    angular.forEach(all_image, function(img){
                        if($.trim(img) == $.trim(img_explode[1]) ){
                            set_img_no = i;
                        }
                        i++;
                    });
                    if($(this).is(".target-prev") == true){
                        var cur_img = set_img_no-1;
                        var count = rooms_img_count-1;
                    }
                    else{
                        var cur_img = set_img_no+1;
                        var count = 0;
                    }

                    if(typeof (all_image[cur_img]) != 'undefined' && $.trim(all_image[cur_img]) !="null" ){
                        var img = all_image[cur_img];
                    }
                    else
                    {

                        var img = all_image[count];
                    }

                    var set_img_url = img_explode[0]+'rooms/'+rooms_id+'/'+img;

                    $(".panel-image").removeClass("loading");
                    $("#rooms_image_"+rooms_id).attr("src",set_img_url);
                });
        }
        else
        {
            $(this).parent().addClass("loading");
            var img_explode = img_url.split('rooms/'+rooms_id+'/');

            var all_image = dataurl.split(',');
            var rooms_img_count = all_image.length;
            var i = 0;
            var set_img_no = '';
            angular.forEach(all_image, function(img){
                if($.trim(img) == $.trim(img_explode[1]) ){
                    set_img_no = i;
                }
                i++;
            });
            if($(this).is(".target-prev") == true){
                var cur_img = set_img_no-1;
                var count = rooms_img_count-1;
            }
            else{
                var cur_img = set_img_no+1;
                var count = 0;
            }

            if(typeof (all_image[cur_img]) != 'undefined' && $.trim(all_image[cur_img]) !="null" ){
                var img = all_image[cur_img];
            }
            else
            {
                var img = all_image[count];
            }
            var set_img_url = img_explode[0]+'rooms/'+rooms_id+'/'+img;

            $(".panel-image").removeClass("loading");
            $("#rooms_image_"+rooms_id).attr("src",set_img_url);

        }*/

    });
    /*function getMarkerImage(type) {
        var image = 'locate-pin.png';

        if(type == 'hover')
            image = 'locate-pin-hover.png';

        var gicons = new google.maps.MarkerImage("images/"+image,
            new google.maps.Size(50, 50),
            new google.maps.Point(0,0),
            new google.maps.Point(9, 20));

        return gicons;

    }
    function setAllMap(map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }



  $scope.on_mouse = function (index) {
        markers[index].setIcon(getMarkerImage('hover'));
    };
    $scope.out_mouse = function (index) {
        markers[index].setIcon(getMarkerImage('normal'));
    };*/
    /*
    $scope.search_result = function (pageNumber) {

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

       /!* var min_beds = $("#map-search-min-beds").val();
        var min_bathrooms = $("#map-search-min-bathrooms").val();
        var min_bedrooms = $("#map-search-min-bedrooms").val();*!/
        var guest_select = $("#guest-select").val();

        if( $.trim(localStorage.getItem("map_lat_long")) != 'null'){
            var map_details = localStorage.getItem("map_lat_long");
        }
        else
        {
            var map_details	= "";
        }


        setGetParameter('room_type', room_type);
        setGetParameter('checkin', checkin);
        setGetParameter('checkout', checkout);
        setGetParameter('guests', guest_select);


        $('.search_tag').addClass('hide');

        if(room_type !=''){
            $('.room-type_tag').removeClass('hide');
        }

        var location1 = getParameterByName('location');

        $('.search-results').addClass('loading');
        no_results();
        var change_url = "/search?";
        change_url += "location=" +location1+"&";
        change_url += "room_type=" +room_type+"&";
        change_url += "checkin=" +checkin+"&";
        change_url += "checkout=" +checkout+"&";
        change_url += "guests=" +1;
        var encoded_url = encodeURI(change_url);
        window.location.href = encoded_url;

    };

    $scope.apply_filter = function()
    {
        $(".toggle-hide").css("display", "block");
        $(".toggle-group").css("display", "none");

        $scope.search_result();
    };

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
    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    var viewport = JSON.parse($('#viewport').val());
    var lat0 = '';
    var long0 = '';
    var lat1 = '';
    var long1 = '';
    var infoBubble;
    var bounds;

    angular.forEach(viewport, function(key, value) {
        lat0 = viewport['southwest']['lat'];
        long0 = viewport['southwest']['lng'];
        lat1 = viewport['northeast']['lat'];
        long1 = viewport['northeast']['lng'];
    });

    var bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(lat0, long0),
        new google.maps.LatLng(lat1, long1)
    );

    $scope.viewport = bounds;

    setTimeout(function() {
        initialize();
        initializeMap();
    }, 1000);


    function initializeMap() {
        // Create the autocomplete object, restricting the search
        // to geographical location types.
        autocomplete = new google.maps.places.Autocomplete(
            /!** @type {HTMLInputElement} *!/(document.getElementById('header-search-form')),
            { types: ['geocode'] });
        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            var location  = $('#header-search-form').val();
            var locations = location.replace(" ", "+");
            setGetParameter('location', locations);
            var place = autocomplete.getPlace();
            var latitude  = place.geometry.location.lat();
            var longitude = place.geometry.location.lng();

            if (place && place.geometry && place.geometry.viewport)
                $scope.viewport = place.geometry.viewport;

            $scope.cLat = latitude;
            $scope.cLong = longitude;
            initialize();

        });
    }

    $scope.zoom = '';
    $scope.cLat = '';
    $scope.cLong= '';
    var html = '';
    var markers = [];
    var map;
    var infowindow = new google.maps.InfoWindow(
        {
            content: html
        });

    initialize();

    function initialize()
    {

        if($scope.zoom == ''){
            var zoom_set = 10;
        }
        else
        {
            var zoom_set = $scope.zoom;
        }
        if($("#lat").val() == 0)
        {
            var zoom_set = 1;
        }
        if($scope.cLat == '' && $scope.cLong == '' ){
            var latitude = $("#lat").val();
            var longitude = $("#long").val();
        }
        else
        {
            var latitude = $scope.cLat;
            var longitude = $scope.cLong;
        }

        var myCenter=new google.maps.LatLng(latitude,longitude);

        var mapProp = {
            scrollwheel: false,
            center:myCenter,
            zoom:zoom_set,
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP,
                style:google.maps.ZoomControlStyle.SMALL
            },
            mapTypeControl: false,
            streetViewControl: false,
            navigationControl: false,
        }
        map = new google.maps.Map(document.getElementById("map_canvas"),mapProp);

        map.fitBounds($scope.viewport);

        google.maps.event.addListener(map, 'click', function() {
            if (infoBubble.isOpen()) {
                infoBubble.close();
                infoBubble = new InfoBubble({
                    maxWidth: 3000
                });
            }
        });
        var homeControlDiv = document.createElement('div');
        var homeControl = new HomeControl(homeControlDiv, map);
        map.controls[google.maps.ControlPosition.LEFT_TOP].push(homeControlDiv);

        google.maps.event.addListener(map, 'dragend', function() {
            //alert('dsfd');
            if (infoBubble.isOpen()) {
                infoBubble.close();
                infoBubble = new InfoBubble({
                    maxWidth: 3000
                });
            }
            $scope.zoom = map.getZoom();

            var zoom = map.getZoom();
            var bounds = map.getBounds();
            var minLat = bounds.getSouthWest().lat();
            var minLong = bounds.getSouthWest().lng();
            var maxLat = bounds.getNorthEast().lat();
            var maxLong = bounds.getNorthEast().lng();
            var cLat = bounds.getCenter().lat();
            var cLong = bounds.getCenter().lng();

            $scope.cLat = bounds.getCenter().lat();
            $scope.cLong = bounds.getCenter().lng();

            var map_lat_long = zoom+'~'+bounds+'~'+minLat+'~'+minLong+'~'+maxLat+'~'+maxLong+'~'+cLat+'~'+cLong;
            //alert(map_lat_long);
            localStorage.setItem("map_lat_long", map_lat_long);
            var redo_search = '';
            $('.map-auto-refresh-checkbox:checked').each(function(i){
                redo_search = $(this).val();
            });
            //alert(redo_search);
            if(redo_search == 'true'){
               // $scope.search_result();
            }else{
                $(".map-auto-refresh").addClass('hide');
                $(".map-manual-refresh").removeClass('hide');
            }
        } );

        google.maps.event.addListener(map, 'click', function() {
            if (infoBubble.isOpen()) {
                infoBubble.close();
                infoBubble = new InfoBubble({
                    maxWidth: 3000
                });
            }
        });
        google.maps.event.addListener(map, 'zoom_changed', function() {
            if (infoBubble.isOpen()) {
                infoBubble.close();
                infoBubble = new InfoBubble({
                    maxWidth: 3000
                });
            }
            $scope.zoom = map.getZoom();

            var zoom = map.getZoom();
            var bounds = map.getBounds();
            var minLat = bounds.getSouthWest().lat();
            var minLong = bounds.getSouthWest().lng();
            var maxLat = bounds.getNorthEast().lat();
            var maxLong = bounds.getNorthEast().lng();
            var cLat = bounds.getCenter().lat();
            var cLong = bounds.getCenter().lng();
            $scope.cLat = bounds.getCenter().lat();
            $scope.cLong = bounds.getCenter().lng();
            var map_lat_long = zoom+'~'+bounds+'~'+minLat+'~'+minLong+'~'+maxLat+'~'+maxLong+'~'+cLat+'~'+cLong;
            localStorage.setItem("map_lat_long", map_lat_long);
            var redo_search = '';
            $('.map-auto-refresh-checkbox:checked').each(function(i){
                redo_search = $(this).val();
            });
            //  alert(redo_search);
            if(redo_search == 'true'){
               // $scope.search_result();
            }else{
                $(".map-auto-refresh").addClass('hide');
                $(".map-manual-refresh").removeClass('hide');
            }
        });


//marker(response);
    }
    function HomeControl(controlDiv, map) {
        var controlText = document.createElement('div');
        controlText.style.position = 'relative';
        controlText.style.padding = '5px';
        controlText.style.margin = '-65px 0px 0px 50px';
        controlText.style.fontSize='14px';
        // controlText.innerHTML = '<div class="map-refresh-controls google"><a   class="map-manual-refresh btn btn-primary  hide" style="background-color:#ff5a5f;color: #ffffff;">Redo Search Here<i class="icon icon-refresh icon-space-left"></i></a></div>'
        controlDiv.appendChild(controlText);

        // Setup click-event listener: simply set the map to London
        google.maps.event.addDomListener(controlText, 'click', function() {
        });
    }
    function marker(response){

        var checkout = $scope.checkout;
        var checkin = $scope.checkin;
        var guests = $scope.guests;
        setAllMap(null);
        markers = [];
        response.data.forEach(function(obj){

           /!* var html = '<div id="info_window_'+obj["id"]+'" class="listing listing-map-popover" data-price="'+obj["rooms_price"]["currency"]["symbol"]+'" data-id="'+obj["id"]+'" data-user="'+obj["user_id"]+'" data-url="/rooms/'+obj["id"]+'" data-name="'+obj["name"]+'" data-lng="'+obj['rooms_address']["longitude"]+'" data-lat="'+obj['rooms_address']["latitude"]+'"><div class="panel-image listing-img">';
            html += '<a class="media-photo media-cover" target="listing_'+obj["id"]+'" href="'+APP_URL+'/rooms/'+obj["id"]+'?checkin='+checkin+'&checkout='+checkout+'&guests='+guests+'"><div class="listing-img-container media-cover text-center"><img id="marker_image_'+obj["id"]+'" rooms_image = "" alt="'+obj["name"]+'" class="img-responsive-height" data-current="0" src="'+APP_URL+'/images/'+obj["photo_name"]+'"></div></a>';
            html += '<div class="target-prev target-control block-link marker_slider" ng-click="marker_slider($event)"  data-room_id="'+obj["id"]+'"><i class="icon icon-chevron-left icon-size-2 icon-white"></i></div><a class="link-reset panel-overlay-bottom-left panel-overlay-label panel-overlay-listing-label" target="listing_'+obj["id"]+'" href="'+APP_URL+'/rooms/'+obj["id"]+'?checkin='+checkin+'&checkout='+checkout+'&guests='+guests+'"><div>';

            var instant_book = '';

            if(obj["booking_type"] == 'instant_book')
                instant_book = '<span aria-label="Book Instantly" data-behavior="tooltip" class="h3 icon-beach"><i class="icon icon-instant-book icon-flush-sides"></i></span>';

            html += '<sup class="h6 text-contrast">'+obj["rooms_price"]["currency"]["symbol"]+'</sup><span class="h3 text-contrast price-amount">'+obj["rooms_price"]["night"]+'</span><sup class="h6 text-contrast"></sup>'+instant_book+'</div></a><div class="target-next target-control marker_slider block-link" ng-click="marker_slider($event)" data-room_id="'+obj["id"]+'"><i class="icon icon-chevron-right icon-size-2 icon-white"></i></div></div>';
            html += '<div class="panel-body panel-card-section"><div class="media"><h3 class="h5 listing-name text-truncate row-space-top-1" itemprop="name" title="'+obj["name"]+'">'+obj["name"]+'</a></h3>';

            var star_rating = '';

            if(obj['overall_star_rating'] != '')
                star_rating = ' · '+obj['overall_star_rating'];

            var reviews_count = '';
            var review_plural = (obj['reviews_count'] > 1) ? 's' : '';

            if(obj['reviews_count'] != 0)
                reviews_count = ' · '+obj['reviews_count']+' review'+review_plural;

            html += '<div class="text-muted listing-location text-truncate" itemprop="description"><a class="text-normal link-reset" href="'+APP_URL+'/rooms/'+obj["id"]+'?checkin='+checkin+'&checkout='+checkout+'&guests='+guests+'">'+obj["room_type_name"]+star_rating+reviews_count+'</a></div></div></div></div>';
          *!/  var lat = Number(obj["rooms_address"]["latitude"]);
            var lng = Number(obj["rooms_address"]["longitude"]);
            var point = new google.maps.LatLng(lat,lng);
            var name = obj["name"];
            // var currency_symbol = obj["rooms_price"]["currency"]["symbol"] ;
            // var currency_value = obj["rooms_price"]["night"];
            console.log("lat"+lat+": lang"+lng);
            var marker = new google.maps.Marker({
                position: point,
                map: map,
                title: name
            });

            // markers.push(marker);
            // google.maps.event.addListener(marker, "mouseover", function() {
            //     marker.setIcon(getMarkerImage('hover'));
            // });
            // google.maps.event.addListener(marker, "mouseout", function() {
            //     marker.setIcon(getMarkerImage('normal'));
            // });
            // createInfoWindow(marker, html);

        });
    }
    function createInfoWindow(marker, popupContent) {
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

    function getMarkerImage(type) {
        var image = 'locate-pin.png';

        if(type == 'hover')
            image = 'locate-pin-hover.png';

        var gicons = new google.maps.MarkerImage("images/"+image,
            new google.maps.Size(50, 50),
            new google.maps.Point(0,0),
            new google.maps.Point(9, 20));

        return gicons;

    }
    function setAllMap(map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }

    $('.footer-toggle').click(function()
    {
        $( ".footer-container" ).slideToggle( "fast", function() {
            if($(".footer-container").is(":visible"))
            {
                $('.open-content').hide();
                $('.close-content').show();
            }
            else
            {
                $('.open-content').show();
                $('.close-content').hide();
            }
        });
    });


   /!* $(document).on('click', '.map-manual-refresh', function() {
        $(".map-manual-refresh").addClass('hide');
        $(".map-auto-refresh").removeClass('hide');
        $scope.search_result();
    });*!/
    $(document).on('click', '.rooms-slider', function() {

        var rooms_id = $(this).attr("data-room_id");
        var dataurl = $("#rooms_image_"+rooms_id).attr("rooms_image");
        var img_url =$("#rooms_image_"+rooms_id).attr("src");
        if($.trim(dataurl) ==''){
            $(this).parent().addClass("loading");
            $http.post('rooms_photos', {rooms_id: rooms_id})
                .then(function(response) {
                    angular.forEach(response.data, function(obj){
                        if($.trim(dataurl) ==''){
                            dataurl = obj['name'];
                        }
                        else
                            dataurl = dataurl +','+ obj['name'];
                    });

                    $("#rooms_image_"+rooms_id).attr("rooms_image", dataurl);
                    var img_explode = img_url.split('rooms/'+rooms_id+'/');

                    var all_image = dataurl.split(',');
                    var rooms_img_count = all_image.length;
                    var i = 0;
                    var set_img_no = '';
                    angular.forEach(all_image, function(img){
                        if($.trim(img) == $.trim(img_explode[1]) ){
                            set_img_no = i;
                        }
                        i++;
                    });
                    if($(this).is(".target-prev") == true){
                        var cur_img = set_img_no-1;
                        var count = rooms_img_count-1;
                    }
                    else{
                        var cur_img = set_img_no+1;
                        var count = 0;
                    }

                    if(typeof (all_image[cur_img]) != 'undefined' && $.trim(all_image[cur_img]) !="null" ){
                        var img = all_image[cur_img];
                    }
                    else
                    {

                        var img = all_image[count];
                    }

                    var set_img_url = img_explode[0]+'rooms/'+rooms_id+'/'+img;

                    $(".panel-image").removeClass("loading");
                    $("#rooms_image_"+rooms_id).attr("src",set_img_url);
                });
        }
        else
        {
            $(this).parent().addClass("loading");
            var img_explode = img_url.split('rooms/'+rooms_id+'/');

            var all_image = dataurl.split(',');
            var rooms_img_count = all_image.length;
            var i = 0;
            var set_img_no = '';
            angular.forEach(all_image, function(img){
                if($.trim(img) == $.trim(img_explode[1]) ){
                    set_img_no = i;
                }
                i++;
            });
            if($(this).is(".target-prev") == true){
                var cur_img = set_img_no-1;
                var count = rooms_img_count-1;
            }
            else{
                var cur_img = set_img_no+1;
                var count = 0;
            }

            if(typeof (all_image[cur_img]) != 'undefined' && $.trim(all_image[cur_img]) !="null" ){
                var img = all_image[cur_img];
            }
            else
            {
                var img = all_image[count];
            }
            var set_img_url = img_explode[0]+'rooms/'+rooms_id+'/'+img;

            $(".panel-image").removeClass("loading");
            $("#rooms_image_"+rooms_id).attr("src",set_img_url);

        }

    });


    /!*$scope.marker_slider = function($event){

        $event.stopPropagation();
        var this_elm = angular.element($event.currentTarget);

        var rooms_id = $($event.currentTarget).attr("data-room_id");
        var dataurl = $("#marker_image_"+rooms_id).attr("rooms_image");
        var img_url =$("#marker_image_"+rooms_id).attr("src");
        if($.trim(dataurl) ==''){
            $($event.currentTarget).parent().addClass("loading");
            $http.post('rooms_photos', {rooms_id: rooms_id})
                .then(function(response) {
                    angular.forEach(response.data, function(obj){
                        if($.trim(dataurl) ==''){
                            dataurl = obj['name'];
                        }
                        else
                            dataurl = dataurl +','+ obj['name'];
                    });

                    $("#marker_image_"+rooms_id).attr("rooms_image", dataurl);
                    var img_explode = img_url.split('rooms/'+rooms_id+'/');

                    var all_image = dataurl.split(',');
                    var rooms_img_count = all_image.length;
                    var i = 0;
                    var set_img_no = '';
                    angular.forEach(all_image, function(img){
                        if($.trim(img) == $.trim(img_explode[1]) ){
                            set_img_no = i;
                        }
                        i++;
                    });
                    if($($event.currentTarget).is(".target-prev") == true){
                        var cur_img = set_img_no-1;
                        var count = rooms_img_count-1;
                    }
                    else{
                        var cur_img = set_img_no+1;
                        var count = 0;
                    }

                    if(typeof (all_image[cur_img]) != 'undefined' && $.trim(all_image[cur_img]) !="null" ){
                        var img = all_image[cur_img];
                    }
                    else
                    {

                        var img = all_image[count];
                    }

                    var set_img_url = img_explode[0]+'rooms/'+rooms_id+'/'+img;

                    $(".panel-image").removeClass("loading");
                    $("#marker_image_"+rooms_id).attr("src",set_img_url);
                });
        }
        else
        {
            $($event.currentTarget).parent().addClass("loading");
            var img_explode = img_url.split('rooms/'+rooms_id+'/');

            var all_image = dataurl.split(',');
            var rooms_img_count = all_image.length;
            var i = 0;
            var set_img_no = '';
            angular.forEach(all_image, function(img){
                if($.trim(img) == $.trim(img_explode[1]) ){
                    set_img_no = i;
                }
                i++;
            });
            if($($event.currentTarget).is(".target-prev") == true){
                var cur_img = set_img_no-1;
                var count = rooms_img_count-1;
            }
            else{
                var cur_img = set_img_no+1;
                var count = 0;
            }

            if(typeof (all_image[cur_img]) != 'undefined' && $.trim(all_image[cur_img]) !="null" ){
                var img = all_image[cur_img];
            }
            else
            {
                var img = all_image[count];
            }
            var set_img_url = img_explode[0]+'rooms/'+rooms_id+'/'+img;

            $(".panel-image").removeClass("loading");
            $("#marker_image_"+rooms_id).attr("src",set_img_url);

        }

    }*!/

   /!* $(document).on('click', '.marker_slider', function(e) {
        var rooms_id = $(this).attr("data-room_id");
        var dataurl = $("#marker_image_"+rooms_id).attr("rooms_image");
        var img_url =$("#marker_image_"+rooms_id).attr("src");
        if($.trim(dataurl) ==''){
            $(this).parent().addClass("loading");
            $http.post('rooms_photos', {rooms_id: rooms_id})
                .then(function(response) {
                    angular.forEach(response.data, function(obj){
                        if($.trim(dataurl) ==''){
                            dataurl = obj['name'];
                        }
                        else
                            dataurl = dataurl +','+ obj['name'];
                    });

                    $("#marker_image_"+rooms_id).attr("rooms_image", dataurl);
                    var img_explode = img_url.split('rooms/'+rooms_id+'/');

                    var all_image = dataurl.split(',');
                    var rooms_img_count = all_image.length;
                    var i = 0;
                    var set_img_no = '';
                    angular.forEach(all_image, function(img){
                        if($.trim(img) == $.trim(img_explode[1]) ){
                            set_img_no = i;
                        }
                        i++;
                    });
                    if($(this).is(".target-prev") == true){
                        var cur_img = set_img_no-1;
                        var count = rooms_img_count-1;
                    }
                    else{
                        var cur_img = set_img_no+1;
                        var count = 0;
                    }

                    if(typeof (all_image[cur_img]) != 'undefined' && $.trim(all_image[cur_img]) !="null" ){
                        var img = all_image[cur_img];
                    }
                    else
                    {

                        var img = all_image[count];
                    }

                    var set_img_url = img_explode[0]+'rooms/'+rooms_id+'/'+img;

                    $(".panel-image").removeClass("loading");
                    $("#marker_image_"+rooms_id).attr("src",set_img_url);
                });
        }
        else
        {
            $(this).parent().addClass("loading");
            var img_explode = img_url.split('rooms/'+rooms_id+'/');

            var all_image = dataurl.split(',');
            var rooms_img_count = all_image.length;
            var i = 0;
            var set_img_no = '';
            angular.forEach(all_image, function(img){
                if($.trim(img) == $.trim(img_explode[1]) ){
                    set_img_no = i;
                }
                i++;
            });
            if($(this).is(".target-prev") == true){
                var cur_img = set_img_no-1;
                var count = rooms_img_count-1;
            }
            else{
                var cur_img = set_img_no+1;
                var count = 0;
            }

            if(typeof (all_image[cur_img]) != 'undefined' && $.trim(all_image[cur_img]) !="null" ){
                var img = all_image[cur_img];
            }
            else
            {
                var img = all_image[count];
            }
            var set_img_url = img_explode[0]+'rooms/'+rooms_id+'/'+img;

            $(".panel-image").removeClass("loading");
            $("#marker_image_"+rooms_id).attr("src",set_img_url);

        }

    });*!/
    /!*$(document).on('change', '[id^="map-search"]', function() {
        var i = 0;
        $('[id^="map-search"]').each(function() {
            if($(this).is(':checkbox'))
            {
                if($(this).is(':checked'))
                {
                    i++;
                }
            }
            else if($(this).val() != '') {
                i++
            }
        });

        if (i == 0) {
            $('#more_filter_submit').attr('disabled', 'disabled');
        } else {
            $('#more_filter_submit').removeAttr('disabled');
        }
    });*!/

    /!*$(document).on('click', '#cancel-filter', function() {
        $('[id^="map-search"]').each(function() {
            if($(this).is(':checkbox'))
            {
                $(this).attr('checked', false);
            }
            else
            {
                $(this).val('');
            }
        });

        $('#more_filter_submit').attr('disabled', 'disabled');

        $(".toggle-hide").css("display", "block");
        $(".toggle-group").css("display", "none");

        $scope.search_result();
    });*!/*/

}]);



