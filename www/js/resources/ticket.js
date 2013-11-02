services(['resources/resources-module'], function(module) {
    module.factory('TicketRsrc', function($resource, SETTINGS) {
        return $resource(SETTINGS.apiUrl + '/tickets/:_id', {_id: '@_id'}, {
            create: {method: 'POST'},
            query: {method: 'GET'},
            delete: {method: 'DELETE'},
            modify: {method: 'PATCH'},
            moveToProcess: {method: 'PATCH'}
        })
    });
});