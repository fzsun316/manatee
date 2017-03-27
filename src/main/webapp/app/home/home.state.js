(function() {
    'use strict';

    angular
        .module('manateeApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('home', {
            parent: 'app',
            url: '/',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Queues'
            },
            views: {
                // 'content@': {
                //     templateUrl: 'app/home/home.html',
                //     controller: 'HomeController',
                //     controllerAs: 'vm'
                // }
                'content@': {
                    templateUrl: 'app/entities/queue/queues.html',
                    controller: 'QueueController',
                    controllerAs: 'vm'
                }
            }
        });
    }
})();
