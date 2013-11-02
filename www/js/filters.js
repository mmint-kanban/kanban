services(['angular'], function() {
    var module = angular.module('curriculove.filters', []);

    module.filter('formatDateTime', function() {
        return function(dateTimeStr) {
            var dt = new Date(dateTimeStr);
            return dt.getDate() + '/' + (dt.getMonth() + 1) + '/' + dt.getFullYear()
        };
    });
});