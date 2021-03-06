(function() {
    'use strict';

    angular
        .module('manateeApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('queue', {
            parent: 'entity',
            url: '/queue',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Queues'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/queue/queues.html',
                    controller: 'QueueController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('queue.history', {
            parent: 'queue',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/queue/queue-history-dialog.html',
                    controller: 'QueueHistoryDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Queue', function(Queue) {
                            return Queue.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('queue', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('queue-detail', {
            parent: 'entity',
            url: '/queue/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Queue'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/queue/queue-detail.html',
                    controller: 'QueueDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Queue', function($stateParams, Queue) {
                    return Queue.get({id : $stateParams.id});
                }]
            }
        })
        .state('queue.new', {
            parent: 'queue',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/queue/queue-dialog.html',
                    controller: 'QueueDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                status: null,
                                timestampInitial: null,
                                timestampFinal: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('queue', null, { reload: true });
                }, function() {
                    $state.go('queue');
                });
            }]
        })
        .state('queue.edit', {
            parent: 'queue',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/queue/queue-dialog.html',
                    controller: 'QueueDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Queue', function(Queue) {
                            return Queue.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('queue', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('queue.myedit', {
            parent: 'queue',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/queue/queue-dialog.html',
                    controller: 'QueueDialogController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Queue', function(Queue) {
                            return Queue.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('queue', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('queue.delete', {
            parent: 'queue',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/queue/queue-delete-dialog.html',
                    controller: 'QueueDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Queue', function(Queue) {
                            return Queue.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('queue', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('queue.newpatient', {
            parent: 'queue',
            url: '/newpatient',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/queue/queue-patient-dialog.html',
                    controller: 'QueuePatientDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                medicalReferralId: null,
                                age: null,
                                conditionDesciption: null,
                                priority: null,
                                deadline: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    // $state.go('queue', null, { reload: true });
                    $state.go('queue', null, { reload: true });
                }, function() {
                    $state.go('queue');
                });
            }]
        })
        .state('queue.patientedit', {
            parent: 'queue',
            url: '/{id}/editpatient',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/patient/patient-dialog.html',
                    controller: 'PatientDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Patient', function(Patient) {
                            return Patient.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('patient', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
