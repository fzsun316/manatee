(function() {
    'use strict';

    angular
        .module('manateeApp')
        .controller('MasterLogController', MasterLogController);

    MasterLogController.$inject = ['$scope', '$state', 'EntityAuditService', 'DTOptionsBuilder', 'DTColumnBuilder', "$q", '$timeout'];

    function generate_table_data(audits) {
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
                        if (patient['id'] in tmp_patient_team) {
                            teamBefore = tmp_patient_team[patient['id']];
                        }
                        var tmp_one_record = {'patientId': patient['id'], 'patientName': patient['name'], 'lastModifiedDate': entityValue['lastModifiedDate'], 'lastModifiedBy': entityValue['lastModifiedBy'], 'teamBefore': teamBefore, 'teamAfter': team['name']}
                        tmp_patient_team[patient['id']] = team['name'];
                        // console.log(tmp_one_record)
                        array_records.push(tmp_one_record);
                    }
                    // console.log(entityValue);
                    // if ('team' in entityValue) {
                    //     if (typeof entityValue['team'] === "object") {
                    //         var patient = entityValue['patient'];
                    //         array_records.push({
                    //             'patientId': patient['id'],
                    //             'patientName': patient['name'],
                    //             'lastModifiedDate': entityValue['lastModifiedDate'],
                    //             'lastModifiedBy': entityValue['lastModifiedBy'],
                    //             'action': audits[i]['action'],
                    //             'potentialDischarged': entityValue['status']
                    //         });
                    //     }
                    // }
                }
        }
        return array_records;
    }

    function MasterLogController($scope, $state, EntityAuditService, DTOptionsBuilder, DTColumnBuilder, $q, $timeout) {
        var vm = this;

        $scope.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
            return $q.when(EntityAuditService.findByEntity("com.fangzhou.manatee.domain.Queue", 9999).then(function(data) {
                var audits = data.map(function(it) {
                    it.entityValue = JSON.parse(it.entityValue);
                    return it;
                });
                return generate_table_data(audits);
            }));
        }).withPaginationType('full_numbers').withDisplayLength(20);;

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
