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

reselfApp.factory('Setting', function() {
    var setting = {
        delay : 10,
        burst : 5, 
        flash : 0
    }
    return setting;
});


reselfApp.controller('HomeCtrl', function($scope) {
    $scope.exit = function() {
        tizen.application.getCurrentApplication().exit();
    }
});

reselfApp.controller('SettingCtrl', function($scope, Setting) {
    $scope.delay = Setting.delay;
    $scope.delays = [
        10, 5, 2
    ];
    $scope.burst = Setting.burst;
    $scope.bursts = [
        0, 2, 5
    ];
    $scope.flash = Setting.flash;
    $scope.flashes = [
        {
            id: 0,
            name: 'Off'
        },
        {
            id: 1,
            name: 'On'
        }
    ];
    $scope.$watch('delay', function() {
        Setting.delay = $scope.delay;
    });
    $scope.$watch('burst', function() {
        Setting.burst = $scope.burst;
    });
    $scope.$watch('flash', function() {
        Setting.flash = $scope.flash;
    });
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
    if (connectionStatus) {
        //todo here
    }
    angular.element('.gallery-wrapper').niceScroll();
});

var connectionStatus = false;

var sapinitsuccesscb = {
    onsuccess : function() {
        console.log('Succeed to connect');
        connectionStatus = true;
        // requestList();
    },
    ondevicestatus : function(status) {
        if (status == "DETACHED") {
            toastAlert('Detached remote peer device');
        } else if (status == "ATTACHED") {
            reconnect();
        }
    }
};

function initialize() {
    sapInit(sapinitsuccesscb, function(err) {
        console.log(err.name);
        if (err.name == "PEER_DISCONNECTED") {
            toastAlert(err.message);
        } else {
            toastAlert('Failed to connect to service');
        }
    });
}

window.onload = function () {
    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
            tizen.application.getCurrentApplication().exit();
    });

    // window.addEventListener('load', function(ev) {
        initialize();
        setTimeout(function() {
            $('.logo').fadeOut('slow');
        }, 2000);
    // });
};

