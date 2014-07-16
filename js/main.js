var reselfApp = angular.module('reselfApp', ['ngRoute']);
reselfApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'view/home.html',
        controller: 'HomeCtrl',
    })
    .when('/camera', {
        templateUrl: 'view/camera.html',
        controller: 'CameraCtrl',
    })
    .otherwise({
        redirectTo: '/'
    });
}]);

reselfApp.controller('HomeCtrl', function($scope) {

});

reselfApp.controller('CameraCtrl', function($scope) {

});

window.onload = function () {
    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
            tizen.application.getCurrentApplication().exit();
    });

    setTimeout(function() {
        $('.logo').fadeOut('slow');
    }, 1500);
};

