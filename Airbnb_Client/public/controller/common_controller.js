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


}

});

app.controller('account_user_management', function ($scope, $window, $location, $http) {

    //security code

    $scope.rockerSa = false;
    $scope.rockerSb = true;
    $scope.rockerSo = false;
    $scope.check = function () {
        if($scope.new_password != $scope.cpassword){
            $scope.rockerSa = true;
            $scope.rockerSb = false;
        }else {
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
            if(result == "valid"){
                $scope.rockerSo = false;
                $scope.alert1 = true;
                $window.location.assign('/Account_Security');
            }else if(result == "invalid"){
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
            params:{
                cvv: $scope.ccv,
                cno: $scope.cnum,
                expm: $scope.expMonth,
                expy: $scope.expYear

            }
        }).success(function (result) {
            if(result=="OK"){
                console.log("ok result");
                $scope.alert2 = true;
            }
        }).error(function (err) {
            console.log(err);
        })
    }

});