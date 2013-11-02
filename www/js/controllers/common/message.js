services(['angular'], function(angular) {
    function CoreDefaultMessageCtrl($scope, $rootScope, $stateParams) {
        var scope = $scope;

        scope.messageContent = $stateParams.messageContent;
        scope.messageType = $stateParams.messageType;
    }

    return CoreDefaultMessageCtrl;
})