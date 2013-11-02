services(['controllers/controllers-module'], function(module) {
    module.controller('ProcessModalCtrl', function($scope, ProcessRsrc, FlashMessageSrv) {
        $scope.allowed_classes = ['default', 'primary', 'danger', 'warning', 'success'];

        $scope.save = function() {
            /* Create process */
            if ($scope.currentAction == 'new') {
                ProcessRsrc.create($scope.currentProcess).$promise.then(
                    function(resp) {
                        $scope.currentProcess._id = resp.data.process._id;
                        $scope.$parent.processes.push($scope.currentProcess);
                        FlashMessageSrv.success('Process "' + $scope.currentProcess.name + '" is created successfully.')
                    },
                    function() {
                        FlashMessageSrv.danger('Unable to create process "' + $scope.currentProcess.name + '".')
                    }
                ).finally(function() {
                    $('#process_modal').modal('hide');
                });
            /* Edit process */
            } else if ($scope.currentAction == 'edit') {
                ProcessRsrc.modify($scope.currentProcess).$promise.then(
                    function(resp) {
                        $scope.currentProcess = resp.data.process;
                        FlashMessageSrv.success('Process "' + $scope.currentProcess.name + '" is updated successfully.')
                    },
                    function() {
                        FlashMessageSrv.danger('Unable to modify process "' + $scope.currentProcess.name + '".')
                    }
                ).finally(function() {
                    $('#process_modal').modal('hide');
                });
            }
        };
    });
})