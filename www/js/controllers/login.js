services(['controllers/controllers-module'], function(module) {
    module.controller('LoginCtrl', function($scope, $state, $rootScope, FlashMessageSrv, AuthRsrc) {
        $scope.login = function() {
            if (typeof($scope.auth) == 'undefined') {
                FlashMessageSrv.danger('Unable to login user. Please verify your information.')
                return;
            };

            AuthRsrc.login($scope.auth).$promise.then(
                function(resp){
                    /* When success response, response data is directly in resp */
                    $rootScope.user = resp.data.user;
                    $state.go('dashboard');
                },
                function(resp) {
                    /* When error response, response data is in response.data */
                    resp = resp.data;
                    FlashMessageSrv.danger(resp.errors);
                }
            );
        }
    });
})