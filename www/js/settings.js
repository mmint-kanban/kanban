services(['angular'], function() {
    var SETTINGS = {
        apiUrl: 'http://kanban.hthieu.com/api'
    }

    angular.module('curriculove.settings', [])
        .constant('SETTINGS', (function() {
            return SETTINGS;
        })());
});