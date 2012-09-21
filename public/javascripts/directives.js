
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
                var tags = attrs.tags;
                var paused = false;
                var delimeterCount = 0;

                var easelWidth = $('div.easel', jElement).innerWidth();
                var easelHeight = $('div.easel', jElement).height();
                var barWidth = $('div.bar', jElement).outerWidth(true);

                scope.listen_value = 0;
                scope.title = attrs.title;
                scope.togglePause = function() {
                    paused = (!paused);
                }

                var fillEmptyGraph = function() {
                    var count = Math.floor(easelWidth / barWidth) - 1;
                    for(var i=0;i<count;i++) {
                        addBar(true);
                    }
                }

                var addBar = function(initial) {
                    if(paused)
                        return false;
                    var new_bar = $('.bar', jElement).last().clone();

                    delimeterCount++;
                    if(delimeterCount>15) {
                        new_bar.addClass('delimeter');
                        delimeterCount = 0;
                    } else
                        new_bar.removeClass('delimeter');

                    var value = 0;
                    if(!initial)
                        value = barHeight;

                    new_bar.css('borderTopWidth', (easelHeight - 2 - value) + 'px');
                    new_bar.css('borderBottomWidth', (2 + value) + 'px');
                    $('.easel', jElement).append(new_bar);

                    if(!initial)
                        $('.bar', jElement).first().remove();
                };

                var calculateBarHeight = function(value) {
                    barHeight = value * 10;
                };

                var addBarActiv = setInterval(addBar, 75);

                fillEmptyGraph();

                console.log(tags);
                scope.addGraphListener(tags);

                scope.$watch('liveData["' + tags + '"]', function(value) {
                    calculateBarHeight(value);
                    scope.listen_value = value;
                });

            }
        };
});