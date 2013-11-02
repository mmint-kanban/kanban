services(['resources/resources-module'], function(module) {
    module.factory('ProcessRsrc', function($resource, SETTINGS) {
        return $resource(SETTINGS.apiUrl + '/processes/:_id', {_id: '@_id'}, {
            create: {method: 'POST'},
            query: {method: 'GET'},
            delete: {method: 'DELETE'},
            modify: {method: 'PATCH'}
        })
    });
});