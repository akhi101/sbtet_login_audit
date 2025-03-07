﻿define(['app'], function (app) {
    app.service("AdmissionSummaryReportService", function (DataAccessService) {       

        this.GetDrillDownAdmissionReport = function (AcdYrID, CollegeID, Branch) {
            var paramObject = { "AcdYrID": AcdYrID, "CollegeID": CollegeID, "Branch": Branch };
            var promise = DataAccessService.getDataWithPara('api/DrillDownAdmission/GetGroupWiseAdmissionSummary', paramObject);
            return promise;
        }
        

        this.GetDrillDownAdmissionReportByCollege = function (AcdYrID, DistrictID, CollegeID, MngtTypIDs) {
            var paramObject = { "AcdYrID": AcdYrID, "CollegeDistrictID": DistrictID, "CollegeID": CollegeID, "MngtTypIDs": MngtTypIDs };
            var promise = DataAccessService.getDataWithPara('api/DrillDownAdmission/GetDrillDownAdmissionReportByCollege', paramObject);
            return promise;
        }

        this.GetCandidateByCollege = function (AcdYrID, DistrictID, CollegeID, MngtTypIDs) {
            var paramObject = { "AcdYrID": AcdYrID, "CollegeDistrictID": DistrictID, "CollegeID": CollegeID, "MngtTypIDs": MngtTypIDs };
            var promise = DataAccessService.getDataWithPara('api/DrillDownAdmission/GetCandidateByCollege', paramObject);
            return promise;
        }
        this.GetBasicCourseList = function () {
            var data = DataAccessService.getDataAll('api/BasicCourse/GetBasicCourseList');
            return data;
        }
        this.GetCourseListForRegStud = function (CollegeID) {
            var paramObject = { "CollegeID": CollegeID };
            var promise = DataAccessService.getDataWithPara('api/BasicMainGroup/GetCourseListForRegStud', paramObject);
            return promise;
        }
        this.GetBasicManagementTypeList = function () {
            var data = DataAccessService.getDataAll('api/BasicManagementType/GetBasicManagementTypeList');
            return data;
        }
        this.GetDistrictListByStateID = function (StateID) {
            var paramObject = { "StateID": StateID };
            var promise = DataAccessService.getDataWithPara('api/BasicDistricts/GetDistrictListByStateID', paramObject);
            return promise;
        }
        this.GetCurrentAcademicYearForDrillDown = function () {
            var data = DataAccessService.getDataAll('api/BasicAcademicYear/GetCurrentAcademicYearForDrillDown');
            return data;
        }
    });
});