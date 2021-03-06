(function() {
    'use strict';

    angular
        .module('manateeApp')
        .controller('TeamDetailController', TeamDetailController);

    TeamDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'Team', 'EntityAuditService', 'DTOptionsBuilder', 'DTColumnBuilder', "$q"];

    function generate_table_data(audits, entity) {
        var array_records = [];
        var tmp_patient_team = {};
        for (var i in audits) {
            if (typeof audits[i] === "object")
                if ('id' in audits[i]) {
                    var entityValue = audits[i]['entityValue'];
                    var entityType = audits[i]['entityType'];
                    var action = audits[i]['action'];
                    if (entityType=="com.fangzhou.manatee.domain.Queue") {
                        var patient = entityValue['patient'];
                        var team = entityValue['team'];
                        var teamBefore = "";
                        var teamBeforeId = -1;
                        var utcDate = entityValue['lastModifiedDate'];  // ISO-8601 formatted date returned from server
                        var localDate = new Date(utcDate);
                        if (patient['id'] in tmp_patient_team) {
                            teamBefore = tmp_patient_team[patient['id']]['name'];
                            teamBeforeId = tmp_patient_team[patient['id']]['id'];
                        }
                        var tmp_one_record = {'patientId': patient['id'], 'patientName': patient['name'], 'lastModifiedDate': localDate.toString(), 'lastModifiedBy': entityValue['lastModifiedBy'], 'teamBefore': teamBefore, 'teamAfter': team['name']}
                        tmp_patient_team[patient['id']] = team;
                        // console.log(tmp_one_record)
                        if (team['id']===entity['id'] || teamBeforeId===entity['id']) {
                            array_records.push(tmp_one_record);
                        }
                    }
                }
        }
        return array_records;
    }

    function TeamDetailController($scope, $rootScope, $stateParams, previousState, entity, Team, EntityAuditService, DTOptionsBuilder, DTColumnBuilder, $q) {
        var vm = this;

        vm.team = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('manateeApp:teamUpdate', function(event, result) {
            vm.team = result;
        });
        $scope.$on('$destroy', unsubscribe);

        vm.buttons = [{
            extend: "excelHtml5",
            filename: "master_log",
            title: "Master Log Report",
            exportOptions: {
                columns: ':visible'
            },
            //CharSet: "utf8",
            exportData: {
                decodeEntities: true
            }
        }, {
            extend: "csvHtml5",
            fileName: "master_log",
            exportOptions: {
                columns: ':visible'
            },
            exportData: {
                decodeEntities: true
            }
        }, {
            extend: "pdfHtml5",
            fileName: "master_log",
            title: "Master Log Report",
            exportOptions: {
                columns: ':visible'
            },
            exportData: {
                decodeEntities: true
            }
        }, {
            extend: 'print',
            //text: 'Print current page',
            autoPrint: false,
            exportOptions: {
                columns: ':visible'
            }
        }];

        $scope.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
            return $q.when(EntityAuditService.findByEntity("com.fangzhou.manatee.domain.Queue", 9999).then(function(data) {
                var audits = data.map(function(it) {
                    it.entityValue = JSON.parse(it.entityValue);
                    return it;
                });
                return generate_table_data(audits, vm.team);
            }));
        }).withPaginationType('full_numbers').withDisplayLength(20).withButtons(vm.buttons);

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('patientId').withTitle('MRN'),
            DTColumnBuilder.newColumn('patientName').withTitle('Patient Name'),
            DTColumnBuilder.newColumn('teamBefore').withTitle('Before'),
            DTColumnBuilder.newColumn('teamAfter').withTitle('After'),
            DTColumnBuilder.newColumn('lastModifiedDate').withTitle('Timestamp'),
            DTColumnBuilder.newColumn('lastModifiedBy').withTitle('User')
            // .notVisible()
        ];

        

    }
})();
