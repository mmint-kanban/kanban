services(['resources/resources-module'], function(module) {
    module.factory('AuthRsrc', function($resource, SETTINGS) {
        return $resource(SETTINGS.apiUrl + '/auth', {}, {
            login: {method: 'POST'},
            getCurrentUser: {method: 'GET'},
            logout: {method: 'DELETE'}
        })
    });
});