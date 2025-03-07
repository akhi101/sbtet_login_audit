﻿define(['app'], function (app) {
    app.controller("StatisticsReportsController", function ($scope, $http, $localStorage, $state, $stateParams, AppSettings, $uibModal, $timeout, PreExaminationService, StudentResultService) {
        //var authData = $localStorage.authorizationData;
        var authData = JSON.parse(sessionStorage.getItem('user'));
        $scope.UserName = authData.UserName
        $scope.UserTypeID = authData.SystemUserTypeId
        var SCHEMESEMINFO = StudentResultService.GetSchemeDataForResults();
        $scope.seminfo = [];
        $scope.examtypeinfo = [];
        $scope.pin = "";
        $scope.showData = 0;
        SCHEMESEMINFO.then(function (data) {
            if (data.length > 0) {

                $scope.schemeinfo = data;

            }
        }, function (error) {
            alert("unable to load Schemes");
        });

       
        var ApprovalLists = PreExaminationService.GetMonthYear();
            ApprovalLists.then(function (response) {
                $scope.GetAcademicYears = response.Table;

            }, function (error) {
                alert("error while loading Academic Year");

            });

        $scope.ChangeAcademicYearId = function () {
            var ApprovalLists = PreExaminationService.GetExamMonthYearsByAcademicYearId($scope.AcademicYearId);
            ApprovalLists.then(function (response) {
                var res = JSON.parse(response)
                $scope.GetExamMonthYears = res;

        }, function (error) {
            alert("error while loading Exam Month Years");

        });

        }

        $scope.Submit = function (scheme) {
            $scope.loading = true;
            $scope.Noresult = false
            var loadData1 = PreExaminationService.GatStatisticsReports($scope.AcademicYearId, $scope.monthyear, $scope.UserTypeID, $scope.UserName)
            loadData1.then(function (res) {
                var data = JSON.parse(res)
                if (data[0].ResponceCode == '200') {
                    $scope.Noresult = false
                    $scope.loading = false;
                    var location = data[0].file;
                    window.location.href = location;

                } else
                    if (data[0].ResponceCode == '400') {
                        $scope.Noresult = true
                        $scope.loading = false;
                        alert(data[0].ResponceDescription);
                    }
                    else {
                        $scope.Noresult = true
                        $scope.loading = false;
                        alert('Something Went Wrong')
                    }

            }, function (error) {
                $scope.Noresult = true
                $scope.loading = false;
            });
        }
    })
})