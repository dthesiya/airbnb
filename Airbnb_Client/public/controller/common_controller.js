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

