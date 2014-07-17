var GALL_THM_RQST = 'gallery-thumbnail-req';
var GALL_THM_RESP = 'gallery-thumbnail-rsp';
var GALL_IMG_RQST = 'gallery-image-req';
var GALL_IMG_RESP = 'gallery-image-rsp';
var gLatestOffset = -1; //gallery offset

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
    $scope.requestCapture = function () {
        if (connectionStatus) {
            var reqData = {
                'msgId' : 'reself-capture'
            };
            sapRequest(reqData, function(respData) {
                console.log(respData);
            }, function(err) {
                console.log('Failed to get list.');
            });
        } else {
            toastAlert('Connection Failed');
        }
    }
});

reselfApp.controller('GalleryCtrl', function($scope) {
    $scope.photos = [
        {
            name: 'dota 2',
            image: 'img/watch.png'
        },
        {
            name: 'dota 3',
            image: 'img/watch.png'
        },
        {
            name: 'dota 4',
            image: 'img/watch.png'
        }
    ];
    $scope.requestGallery = function () {
        if (connectionStatus) {
           var reqData = {
                'msgId' : GALL_THM_RQST,
                'offset' : gLatestOffset
            };
            sapRequest(reqData, function(respData) {
                var count = respData.count;
                var list = respData.list;ze
                $scope.photos = list;
                console.log(list);

                gLatestOffset = list[count - 1].id;
            }, function(err) {
                console.log('Failed to get list.');
                toastAlert('Failed loading Gallery');
            });
        } else {
            toastAlert('Connection Failed');
        }
    }
    angular.element('.gallery-wrapper').niceScroll();
});

var connectionStatus = false;
var toastStack = 0;

function toastAlert(msg) {
    $('#popupToastMsg').empty();
    $('#popupToastMsg').append(msg);
    $('#popupToast').fadeIn('slow');
    toastStack++;
    setTimeout(function() {
        toastStack--;
        if (toastStack == 0) {
            $('#popupToast').fadeOut('slow');
        }
    }, 2000);
    console.log(msg);
}

var sapinitsuccesscb = {
    onsuccess : function() {
        console.log('Succeed to connect');
        toastAlert('Connection established');
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
            // toastAlert("Hello World");
        }, 2000);
    // });
};

