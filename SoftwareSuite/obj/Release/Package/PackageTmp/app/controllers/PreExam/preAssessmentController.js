﻿define(['app'], function (app) {
    
    app.controller("PreAssessmentController", function ($scope, $http, $localStorage, $state, $stateParams, AppSettings, PreAssessmentService) {
       
       
        $scope.hallTicketGeneration = function () {
            $state.go("hallTicketGeneration");
        }
        $scope.college = null;
        $scope.AcademicId = 0;
        $scope.Admission = {};
        var authData = $localStorage.authorizationData;
        $scope.userName = authData.userName;
        AppSettings.userName = authData.userName;
        AppSettings.LoggedUserId = authData.SysUserID;
        AppSettings.CollegeID = authData.CollegeID;
        $scope.CollegeID = authData.CollegeID;
        AppSettings.AcdYrID = authData.AcdYrID;
        AppSettings.PrevAdmNo = authData.PrevAdmNo;
        AppSettings.TypeFlag = authData.TypeFlag;
        AppSettings.MngtTypID = authData.MngtTypID;
        AppSettings.SysUsrGrpID = authData.SysUsrGrpID;
        AppSettings.SeqNo = authData.SeqNo;
        AppSettings.DistrictIDs = authData.DistrictIDs;
        $scope.College_Code = authData.College_Code;
        $scope.College_Name = authData.College_Name;
        $scope.SystemUserTypeId = authData.SystemUserTypeId;
        $scope.BranchId = authData.BranchId;
        $scope.IsPrinciple = false;
        $scope.LoadImg = true;
        $scope.LoadImgShowCondonation = true;
        $scope.LoadImgshowReAdmissionList = true;
        if ((AppSettings.TypeFlag != 'B') && (AppSettings.TypeFlag != 'D')) {
            $scope.college_name1 = AppSettings.college_name1;
        }

        //var AcademicYears = PreAssessmentService.GetAcademicYearsActive(AppSettings.CollegeID);
        //AcademicYears.then(function (data, status, headers, config, error) {
        //    $scope.AcademicYears = data.Table;
        //    //console.log($scope.AcademicYears);
        //    $scope.AcademicId = $scope.AcademicYears[0].AcademicId;
        //    AppSettings.AcademicId = $scope.AcademicYears[0].AcademicId;
        //    authData.AcademicId = $scope.AcademicYears[0].AcademicId;


        //}, function (error) {
        //    alert(error);
        //});

        var AcademicYear = authData.AcdYrID;
        var hodData = PreAssessmentService.GetDataForAdmissionDashboard(AppSettings.LoggedUserId, $scope.College_Code, AcademicYear);
        hodData.then(function (hodData, status, headers, config, error) {
            $scope.hodData = hodData;
            $scope.LoadImg = false;
            $scope.StudentDetailsFound = true;
            $scope.CollegeDetailsFound = true;
            // alert(hodData.Table2[0].AcademicId);
            $scope.Academic = hodData.Table1[0].AcademicId;
            //  $scope.$digest();
            $scope.LoadImg = false;
        }, function (error) {
            $scope.LoadImg = false;
            alert("data not found");
        });


        var ReAdmissionlistByCollege = PreAssessmentService.GetReAdmissionListByCollegeCode($scope.College_Code);
        ReAdmissionlistByCollege.then(function (response) {
            if (response.length > 0) {
                var SrNo = 1
                for (var i = 0; i < response.length; i++) {
                    response[i].ReAdmitStudSrNo = SrNo;
                    SrNo = SrNo + 1;
                }
                $scope.responsedata = response;
                $scope.filteredData = $scope.responsedata;
                $scope.LoadImgshowReAdmissionList = false;
                $scope.showReAdmissionList = true;
            }
            else {
                $scope.LoadImgshowReAdmissionList = false;
                $scope.showReAdmissionList = true;
                alert("Data Not Found");
                $scope.responsedata = [];
                return;
            }

        }, function (error) {
            alert("error");

        });




        var CondonationlistByCollege = PreAssessmentService.GetCondonationListByCollegeCode($scope.College_Code);
        CondonationlistByCollege.then(function (response) {
            if (response.length > 0) {
                var SrNo = 1
                for (var i = 0; i < response.length; i++) {
                    response[i].ReAdmitStudSrNo = SrNo;
                    SrNo = SrNo + 1;
                }
                $scope.responsedata = response;
                $scope.condonationListData = $scope.responsedata;
                $scope.LoadImgShowCondonation = false;
                $scope.showCondonationList = true;
            }
            else {
                $scope.LoadImgShowCondonation = false;
                $scope.showCondonationList = true;
                alert("Data Not Found");
                $scope.responsedata = [];
                return;
            }

        }, function (error) {
            alert("error");

        });




        $scope.showStudetDetails = function (Schemeid, Semesterid, Branchid) {
            //alert("scheme : "+Schemeid+" Semester : "+Semesterid+"Branch : "+Branchid +"Academic Year : "+AcademicYearid);
            var AcademicYearId = 0;
           
            //alert(document.getElementById("AcademicYear").value);
            if (document.getElementById("AcademicYear") == null || document.getElementById("AcademicYear").value == "? undefined:undefined ?")
                AcademicYearId = 0;
            else
                AcademicYearId = document.getElementById("AcademicYear").value;
            // alert("Academic Year : " + AcademicYearId);
            // alert("scheme : " + Schemeid + " Semester : " + Semesterid + "Branch : " + Branchid + "Academic Year : " + AcademicYearId);
            var collegecode = document.getElementById("CollegeName").value;
            //authData.College_Code = collegecode;
            authData.SchemeId = Schemeid;
            authData.SemesterId = Semesterid;
            authData.BranchId = Branchid;
            authData.AcdYrID = AcademicYearId;
            $state.go('Admission.StudentRegList');
            //$state.go('Admission.StudentRegList');
        }



        $scope.showDetainedDetails = function () {
            alert("No data found");
        }

        $scope.showCondonationDetails = function () {
            alert("No data found");
        }


    });
});