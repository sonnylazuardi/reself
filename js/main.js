var GALL_THM_RQST = 'gallery-thumbnail-req';
var GALL_THM_RESP = 'gallery-thumbnail-rsp';
var GALL_IMG_RQST = 'gallery-image-req';
var GALL_IMG_RESP = 'gallery-image-rsp';

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

reselfApp.factory('Photos', function() {
    var photos = {
        list: [],
    }
    return photos;
});

reselfApp.factory('Setting', function() {
    var setting = {
        delay : 0,
        burst : 1, 
        flash : 0,
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
        0, 5, 10
    ];
    $scope.burst = Setting.burst;
    $scope.bursts = [
        1, 2, 5
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
        if ($scope.flash == 0) {
            var reqData = {
                'msgId' : 'reself-flash-off',
            };
            sapRequest(reqData, function(respData) {
            }, function(err) {
                console.log('Failed to get list.');
            });
        } else {
            var reqData = {
                'msgId' : 'reself-flash-on',
            };
            sapRequest(reqData, function(respData) {
            }, function(err) {
                console.log('Failed to get list.');
            });
        }
        Setting.flash = $scope.flash;
    });
});


reselfApp.controller('CameraCtrl', function($scope, Setting) {
    $scope.time_num = 0;
    $scope.burstStack = Setting.burst;
    $scope.timer = function(cb) {
        if ($scope.time_num <= 0) {
            cb();
        } else {
            setTimeout(function() {
                $scope.time_num--;
                $scope.$apply();
                $scope.timer(cb);
            }, 1000);
        }
    }
    $scope.streaming = function() {
        console.log('streaming');
        var reqData = {
            'msgId' : 'reself-streaming'
        };
        var request = function() {
            sapRequest(reqData, function(respData) {
                angular.element('.camera').html('<img src="data:image/jpeg;base64,' + respData.image.image + '" alt=""/>');
            }, function(err) {
                console.log('Failed to get list.');
            });
        };
        setTimeout($scope.streaming, 2000);
    }
    $scope.streaming();
    $scope.requestCapture = function () {
        if (connectionStatus) {
            var reqData = {
                'msgId' : 'reself-capture'
            };
            var request = function() {
                angular.element('#timer').hide();
                sapRequest(reqData, function(respData) {
                    // console.log(respData);
                    angular.element('.camera').html('<img src="data:image/jpeg;base64,' + respData.image.image + '" alt=""/>');
                    if ($scope.burstStack > 0) {
                        $scope.requestCapture()
                    }
                }, function(err) {
                    console.log('Failed to get list.');
                });
            };
            $scope.burstStack--;
            if (Setting.delay == 0) {
                request();
            } else {
                angular.element('#timer').fadeIn('slow');
                $scope.time_num = Setting.delay;
                $scope.timer(request);
            }
        } else {
            toastAlert('Connection Failed');
        }
    }
});

reselfApp.controller('GalleryCtrl', function($scope, Photos) {
    var gLatestOffset = -1; //gallery offset
    // Photos.list = [];
    // $scope.photos = [];
    angular.element('.gallery').empty();
    $scope.requestGallery = function () {
        if (connectionStatus) {
           var reqData = {
                'msgId' : GALL_THM_RQST,
                'offset' : gLatestOffset
            };
            sapRequest(reqData, function(respData) {
                var count = respData.count;
                var list = respData.list;
                list.forEach(function (item) {
                    // Photos.list.push(item);
                    angular.element('.gallery').append('<div class="photo"><img src="data:image/jpeg;base64,'+item.image+'" alt=""></div>');
                    console.log(item.name);
                });
                // console.log(list);
                gLatestOffset = list[count - 1].id;
                // $scope.$apply(function() {
                //     $scope.photos = Photos.list;
                // });
            }, function(err) {
                console.log('Failed to get list.');
                toastAlert('Failed loading Gallery');
            });
        } else {
            toastAlert('Connection Failed');
        }
    }
    $scope.requestGallery();
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

