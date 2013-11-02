services(['resources/resources-module'], function(module) {
    module.factory('UserRsrc', function($resource, SETTINGS) {
        return $resource(SETTINGS.apiUrl + '/users/:_id', {_id: '@_id'}, {
            register: {method: 'POST'},
            search: {method: 'GET'}
        })
    });
});