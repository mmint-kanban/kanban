services(['controllers/controllers-module'], function(module) {
    module.controller('DashboardCtrl', function($scope, $timeout, ProcessRsrc, TicketRsrc, FlashMessageSrv) {
        $scope.loading = true;

        /* New ticket */
        $scope.newTicket = function(process) {
            $scope.currentProcess = process;
            $scope.currentAction = 'new';
            $scope.currentTicket = {};
            $('#ticket_modal').modal('show');
        }

        /* Edit ticket */
        $scope.editTicket = function(ticket) {
            $scope.currentTicket = ticket;
            $scope.currentAction = 'edit';
            $('#ticket_modal').modal('show');
        };

        /* Delete ticket */
        $scope.deleteTicket = function(process, ticket) {
            TicketRsrc.delete({_id: ticket._id, processId: process._id}).$promise.then(
                function(resp) {
                    Utils.removeFromArray(process.tickets, ticket);
                    FlashMessageSrv.success('Ticket "' + ticket.title + '" is deleted.');
                },
                function(resp) {
                    FlashMessageSrv.danger(resp.data.errors);
                }
            );
        };

        /* Options for sortable ticket list */
        var sortableOptions = {
            connectWith: '.tickets-container',
            handle: ".handler",
            helper: "original",
            cursor: "move",
            dropOnEmpty: true,
            forcePlaceholderSize: true,
            forceHelperSize: true,
            distance: 5,
            opacity: 0.6,
            placeholder: "well well-sm",
            revert: true,
            /* Callback before ticket is dropped */
            beforeStop: function(event, ui) {
                // TODO: Stop event if unable to update in database
                /* Before stop try to update data base, if fail then back to previous state else update interface */
                var oldContainer = $(event.target).closest('.tickets-container');
                var oldProcessId = oldContainer.attr('data-process-id');

                var newContainer = $(ui.item).closest('.tickets-container');
                var newProcessId = newContainer.attr('data-process-id');
                var newProcessClass = newContainer.attr('data-process-class');

                /* Remove ticket from old process and add this ticket to new process
                * Because Angular keep alway reference to this element
                * so we need to remove it from angular reference and add to new element angular
                * */
                $scope.$apply(function() {
                    _updateTicketInProcess(oldProcessId, newProcessId, ui.item.scope().ticket);
                });
            },

            /* Callback when ticket is dropped well */
            receive: function(event, ui) {
                /* If ticket is well dropped then update color and angular elements */
                var oldContainer = $(ui.sender);
                var oldProcessId = oldContainer.attr('data-process-id');

                var newContainer = $(event.target).closest('.tickets-container');
                var newProcessId = newContainer.attr('data-process-id');
                var newProcessClass = newContainer.attr('data-process-class');

                /* Change class of this ticket => change corresponding color */
                $(ui.item).attr('class', 'ticket panel panel-' + newProcessClass);
            }
        }

        /* Load process list */
        ProcessRsrc.query().$promise.then(
            function(resp) {
                $scope.processes = resp.data.processes;

                $timeout(function() {
                    $('.tickets-container').sortable(sortableOptions);
                }, 50);

                $scope.loading = false;
            }
        );

        /* Remove a ticket from a process by passing processId and ticket */
        var _updateTicketInProcess = function(oldProcessId, newProcessId, ticket) {
            if (oldProcessId == newProcessId) {
                return;
            }

            /* Effect this change in database */
            var ticketToMove = angular.copy(ticket);
            // Remove angularJS's attribute
            if ('$$hashKey' in ticketToMove) {
                delete ticketToMove['$$hashKey'];
            }
            var promise = TicketRsrc.moveToProcess({
                _id: ticketToMove._id,
                oldProcessId: oldProcessId,
                newProcessId: newProcessId,
                ticket: ticketToMove
            }).$promise;

            promise.then(
                /* If database is updated successfully then update interface */
                function(resp) {
                    angular.forEach($scope.processes, function(process) {
                        /* Remove from old process */
                        if (process._id == oldProcessId) {
                            Utils.removeFromArray(process.tickets, ticket);
                        }

                        /* Add to new process */
                        if (process._id == newProcessId) {
                            if (typeof(process.tickets) == 'undefined') {
                                process.tickets = [];
                            }
                            process.tickets.push(ticket);
                            FlashMessageSrv.success('Ticket "' + ticket.title + '" is moved to ' + process.name);
                        }
                    });
                },
                /* Show error if failed */
                function(resp) {
                    FlashMessageSrv.danger(resp.data.errors);
                }
            );
        };
    });
})