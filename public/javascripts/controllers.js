
function Dashboard($scope, $http, socket) {
    $scope.liveData = {};

    socket._on('liveUpdate', function (data) {
        console.log(data);
        $scope.liveData[data.value] = data.count;
    });

    $scope.addGraphListener = function(tags) {
        $scope.liveData[tags] = 0;
        socket._emit('addLiveListener', tags);
    };

    $scope.generateLoad = function() {
        $http.get('http://localhost:8080/?tags=video:visits:test');
    };
}


