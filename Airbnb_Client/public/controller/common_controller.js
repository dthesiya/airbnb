/**
 * Created by vicky on 11/20/2016.
 */
/**
 * http://usejsdoc.org/
 */
var app = angular.module('App',[]);
app.controller('authentication_controller', function($scope,$window,$location,$http) {

    console.log("in controller");
    $scope.checkLogin = function () {

        var email_id = $scope.email_id;
        var pwd = $scope.password;
        var d= {email_id:email_id,password:pwd};

        $http.post('/signin',d)
            .success(function(data){
                if(data.success){

                    $window.location.href = "/";
                }
            })
            .error(function(data) {
                  $scope.isLoggedIn  = data.success;
            });


    };


   

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



app.controller('review_controller', function($scope,$window,$location,$http) {

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


});



