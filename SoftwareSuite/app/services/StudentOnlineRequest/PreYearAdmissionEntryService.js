﻿define(['app'], function (app) {
    app.service("PreYearAdmissionEntryService", function (DataAccessService) {
        this.UpdatePreYearAdmissionNumber = function (CollegeID,AdmNo, UpdLoginID) {
            var paramObject = { "CollegeID": CollegeID, "AdmNo": AdmNo, "UpdLoginID": UpdLoginID};
            var promise = DataAccessService.getDataWithPara('api/BasicCollege/GetUpdatePreYearAdmissionNumber', paramObject);
            return promise;
        }
        this.GetAdmissionMaxNoFromCollege = function (CollegeID) {
            var paramObject = { "CollegeID": CollegeID };
            var promise = DataAccessService.getDataWithPara('api/BasicCollege/GetAdmissionMaxNoFromCollege', paramObject);
            return promise;
        }
    });
});