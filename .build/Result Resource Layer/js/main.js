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
    .when('/gallery', {
        templateUrl: 'view/gallery.html',
        controller: 'GalleryCtrl',
    })
    .when('/setting', {
        templateUrl: 'view/setting.html',
        controller: 'SettingCtrl',
    })
    .otherwise({
        redirectTo: '/'
    });
}]);

reselfApp.controller('HomeCtrl', function($scope) {
    $scope.exit = function() {
        tizen.application.getCurrentApplication().exit();
    }
});

reselfApp.controller('SettingCtrl', function($scope) {
    $scope.delay = 10;
    $scope.burst = 0;
    $scope.flash = true;
});

reselfApp.controller('CameraCtrl', function($scope) {

});

reselfApp.controller('GalleryCtrl', function($scope) {
    $scope.photos = [
        {
            title: 'dota 2',
            url: 'img/watch.png'
        },
        {
            title: 'dota 3',
            url: 'img/watch.png'
        },
        {
            title: 'dota 4',
            url: 'img/watch.png'
        }
    ];
    angular.element('.gallery-wrapper').niceScroll();
});

window.onload = function () {
    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
            tizen.application.getCurrentApplication().exit();
    });

    setTimeout(function() {
        $('.logo').fadeOut('slow');
    }, 2000);
};

