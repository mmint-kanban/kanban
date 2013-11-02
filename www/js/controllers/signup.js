services(['controllers/controllers-module'], function(module) {
    module.controller('SignupCtrl', function($scope, $state, $rootScope, FlashMessageSrv, UserRsrc) {
        $scope.register = function() {
            if (typeof($scope.inscription) == 'undefined') {
                FlashMessageSrv.danger('Unable to register user. Please verify your information.')
                return;
            };

            UserRsrc.register($scope.inscription).$promise.then(
                /* Success */
                function(data) {
                    $state.go('home');
                    FlashMessageSrv.success('Your inscription has been registered successfully. Please verify your email for finish your inscription.')
                },
                /* Fail */
                function(data) {
                    FlashMessageSrv.danger(data.data)
                }
            );
        }
    });
})