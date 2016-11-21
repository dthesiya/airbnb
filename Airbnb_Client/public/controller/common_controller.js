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
                }
            })
            .error(function (data) {

            });


    };

    $scope.registerUser = function () {

        var email_id = $scope.email;
        var pwd = $scope.password;
        var first_name = $scope.first_name;
        var last_name = $scope.last_name;
        var d = {email_id: email_id, password: pwd, first_name: first_name, last_name: last_name};
        $http.post('/registerUser', d)
            .success(function (data) {

                if (data.success) {
                    $window.location.href = "/";
                }
            })
            .error(function (data) {
                alert("there" + data);
            });


    };


});

