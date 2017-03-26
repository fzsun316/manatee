(function() {
    'use strict';

    angular
        .module('manateeApp')
        .controller('MasterLogController', MasterLogController);

    MasterLogController.$inject = ['$scope', '$state', 'Team'];

    function MasterLogController ($scope, $state, Team) {
        var vm = this;

        vm.teams = [];

        loadAll();

        function loadAll() {
            Team.query(function(result) {
                vm.teams = result;
                vm.searchQuery = null;
            });
        }
    }
})();
