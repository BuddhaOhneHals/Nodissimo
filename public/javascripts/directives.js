
angular.module('dashboard.directives', []).
    directive('graph', function () {
        return {
            restrict: 'E',
            transclude: true,
            template:
                '<div class="graph">' +
                    '<h3>Aktuelle Visits: {{current_visits}}</h3>' +
                    '<div class="easel"><div class="bar"></div></div>' +
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

                var addBar = function() {
                    var new_bar = $('.bar', jElement).last().clone();
                    new_bar.css('borderTopWidth', (298 - barHeight) + 'px');
                    new_bar.css('borderBottomWidth', (2 + barHeight) + 'px');
                    $('.easel', jElement).append(new_bar);

                    if($('.bar', jElement).length > 60) {
                        $('.bar', jElement).first().remove();
                    }
                };

                var calculateBarHeight = function(curr_visits) {
                    barHeight = curr_visits*10;
                };

                setInterval(addBar, 100);

                scope.$watch('current_visits', function(value) {
                    calculateBarHeight(value);
                });

            }
        };
});