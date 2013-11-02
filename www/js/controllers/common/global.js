services(['controllers/controllers-module'], function(module) {
    module.controller('GlobalCtrl', function($scope, $rootScope, $stateParams, $state, AuthRsrc, FlashMessageSrv) {
        $scope.loaded = true;

        /* Global function logout */
        $scope.logout = function() {
            AuthRsrc.logout().$promise.then(
                function() {
                    $rootScope.user = {}
                },
                function() {
                    FlashMessageSrv.danger('Cannot logout.')
                }
            );

            $state.go('login');
        };
        /* Remove flashMessage when changing state */
        $rootScope.$on('$stateChangeStart', function() {
            $rootScope.flashMessage = {}
        });

        /* Look for current user in function of token_id, if exists then assign to $rootScope */
        AuthRsrc.getCurrentUser().$promise.then(
            function(resp) {
                if (!$.isEmptyObject(resp.data)) {
                    $rootScope.user = resp.data.user;
                }
            },
            function (resp) {
                resp = resp.data;
                FlashMessageSrv.danger(resp.errors);
            }
        );

        /* Auto login/logout in function of $rootScope.user value */
        $rootScope.$watch('user', function(newValue, oldValue) {
            /* Auto logout if user is unset */
            if (typeof(newValue) == "undefined"
                || newValue == null
                || typeof(newValue.isAuthenticated) == 'undefined'
                || newValue == {}
                || newValue.isAuthenticated == false
            ) {
                $state.go('login');
            }

            /* Auto redirect to logged page if logged user is on login page */
            if ((typeof(oldValue) == "undefined" || oldValue == {} || oldValue.isAuthenticated == false)
                && (typeof(newValue) != "undefined" && newValue.isAuthenticated == true)) {
                if ($state.current.name == 'login') {
                    $state.go('dashboard');
                }
            }

        });
/**
 * Do not need because we will be redirected by login explicitement to dashboard
 *
 */
//            /* Auto login if user is set */
//            if ((typeof(oldValue) == "undefined" || oldValue == {} || oldValue.isAuthenticated == false)
//                && (typeof(newValue) != "undefined" && newValue.isAuthenticated == true)) {
//                $state.go('dashboard');
//            }
//        });
    });
})