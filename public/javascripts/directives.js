
angular.module('dashboard.directives', []).
    directive('graph', function () {
        return {
            restrict: 'E',
            transclude: true,

            template:
                '<div class="graph">' +
                    '<h3>{{title}} {{listen_value}}</h3>' +
                    '<div class="easel"><div class="bar"></div></div>' +
                    '<a ng-click="togglePause()">Pause</a>'+
                '</div>',
            replace: true,
            /**
             * Watch the current_visits change!
             *
             * @param scope
             * @param element
             * @param attrs
             */
            link: function(scope, element, attrs) {
                var self = this;
                var barHeight = 0;
                var jElement = $(element[0]);
                var listenTo = attrs.listen;
                var paused = false;
                var delimeter = false;

                scope.listen_value = 0;
                scope.title = attrs.title;
                scope.togglePause = function() {
                    if(paused)
                        paused = false;
                    else
                        paused = true;
                }

                var addBar = function() {
                    if(paused)
                        return false;
                    var new_bar = $('.bar', jElement).last().clone();

                    if(delimeter) {
                        new_bar.addClass('delimeter');
                        delimeter = false;
                    } else
                        new_bar.removeClass('delimeter');

                    new_bar.css('borderTopWidth', (298 - barHeight) + 'px');
                    new_bar.css('borderBottomWidth', (2 + barHeight) + 'px');
                    $('.easel', jElement).append(new_bar);

                    if($('.bar', jElement).length > 60) {
                        $('.bar', jElement).first().remove();
                    }
                };

                var calculateBarHeight = function(value) {
                    barHeight = value * 10;
                };

                setInterval(addBar, 100);
                setInterval(function() {delimeter=true;}, 2000);

                scope.$watch(listenTo, function(value) {
                    calculateBarHeight(value);
                    scope.listen_value = value;
                });

            }
        };
});