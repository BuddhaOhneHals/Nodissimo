
angular.module('dashboard.directives', []).
    directive('graph', function () {
        return {
            restrict: 'E',
            transclude: true,
            template: '<div class="graph">' +
                '<h3>Aktuelle Visits: {{current_visits}}</h3>' +
                '</div>',
            replace: true,
            link: function(scope, element, attrs) {
                scope.$watch('current_visits', function(value) {

                });

            }
        };
});