services(['controllers/controllers-module'], function(module) {
    module.controller('TicketModalCtrl', function($scope, $timeout, TicketRsrc, FlashMessageSrv) {
        $scope.save = function() {
            var payload = {
                processId: $scope.currentProcess._id,
                ticket: $scope.currentTicket
            }
            /* Create new ticket */
            if ($scope.currentAction == 'new') {
                TicketRsrc.create(payload).$promise.then(
                    function(resp) {
                        if (typeof($scope.$parent.currentProcess.tickets) == 'undefined') {
                            $scope.$parent.currentProcess.tickets = [];
                        }
                        $scope.$parent.currentProcess.tickets.push(resp.data.ticket);
                    },
                    function(resp) {
                        FlashMessageSrv.danger(resp.data.errors);
                    }
                ).finally(function() {
                    $('#ticket_modal').modal('hide');
                });
            /* Edit new ticket */
            } else if ($scope.currentAction == 'edit') {
                TicketRsrc.modify(payload).$promise.then(
                    function(resp) {
                        $scope.currentTicket = resp.data.data.ticket;
                    },
                    function(resp) {
                        FlashMessageSrv.danger(resp.data.errors);
                    }
                );
            }
        }
    });
})