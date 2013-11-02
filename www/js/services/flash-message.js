services(['services/services-module'], function(module) {
    module.factory('FlashMessageSrv', function($rootScope, $sce) {
        var _send = function(type, content) {
            $rootScope.flashMessage = {
                type: type,
                content: content
            }
        }

        return {
            danger:  function(content) {_send('danger',  'Errors: ' + content)},
            info:    function(content) {_send('info',    'Info: ' + content)},
            warning: function(content) {_send('warning', 'Warning: ' + content)},
            success: function(content) {_send('success', 'Success: ' + content)},
            remove:  function()        {$rootScope.flashMessage = {}}
        }
    });
})