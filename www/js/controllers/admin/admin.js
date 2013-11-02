services(['controllers/controllers-module'], function(module) {
    module.controller('AdminCtrl', function($scope, $timeout, FlashMessageSrv, ProcessRsrc) {
        /* Get processes */
        ProcessRsrc.query().$promise.then(
            function(resp) {
                var data = resp.data;
                $scope.processes = data.processes;

                $timeout(function() {
                    $('#processes').sortable({
                        handle: ".handler",
                        helper: "original",
                        containment: 'parent',
                        cursor: "move",
                        dropOnEmpty: true,
                        forcePlaceholderSize: true,
                        forceHelperSize: true,
                        distance: 5,
                        opacity: 0.6,
                        placeholder: "well well-sm",
                        revert: true
                    }); //.disableSelection();
                }, 100);
            },
            function() {

            }
        );

        /* Delete given process */
        $scope.deleteProcess = function(process) {
            ProcessRsrc.delete(process).$promise.then(
                function(resp) {
                    Utils.removeFromArray($scope.processes, process);
                    FlashMessageSrv.success('Process "' + process.name + '" is deleted successfully.');
                },
                function() {
                    FlashMessageSrv.danger('Unable to delete process "' + process.name + '".');
                }
            );
        };

        /* Edit given process */
        $scope.editProcess = function(process) {
            $scope.currentProcess = process;
            $scope.currentAction = 'edit';

            $('#process_modal').modal({show: true});
        }

        /* Open add process modal */
        $scope.newProcess = function() {
            $scope.currentProcess = {class: 'default', order: 1};
            $scope.currentAction = 'new';

            $('#process_modal').modal({show: true});
        }
    });
})