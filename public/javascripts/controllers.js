
function Dashboard($scope, $http, socket) {
    $scope.current_visits = 0;

    socket._on('update', function (data) {
        $scope.current_visits = data.current_visits;
    });

    $scope.generateLoad = function() {
        $http.get('http://localhost:8080/');
    };
}
