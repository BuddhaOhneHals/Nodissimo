/* Services */


angular.module('dashboard', []).
    factory('socket', ['$rootScope', function($rootScope) {
    var socket = io.connect();
    // do not overwrite $emit, its used by socket.io internally
    socket._emit = function() {
        var args = Array.prototype.slice.call(arguments);
        if(args.length<=0)
            return;
        var responseHandler = args[args.length-1];
        if(angular.isFunction(responseHandler)) {
            args[args.length-1] = function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    responseHandler.apply(null, args);
                });
            }
        }
        socket.emit.apply(socket, args);
    }

    socket._on = function(e, handler) {
        socket.on(e, function() {
            var args = arguments;
            $rootScope.$apply(function() {
                handler.apply(null, args);
            });
        });
    }

    return socket;
}])