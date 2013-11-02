services(['controllers/controllers-module'], function(module) {
    module.controller('HeaderCtrl', function($scope, $timeout, $state, $rootScope, AuthRsrc, UserRsrc, FlashMessageSrv) {
        var is_searching = false;
        $scope.search = function(keyword) {
            if (is_searching) {
                return;
            }
            is_searching = true;

            $timeout(function() {
                UserRsrc.search({keyword: keyword}).$promise.then(
                    /* Success */
                    function(resp) {
                        $scope.users = resp.data.users;
                        is_searching = false;
                    },
                    /* Error */
                    function(resp){

                    }
                );
            }, 500
            );
        }
    });
})