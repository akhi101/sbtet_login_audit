﻿define(['app'], function (app) {
    app.controller("MemoTrSheetController", function ($scope, $q, $http, PreExaminationService, $localStorage, $state, $stateParams, AppSettings) {
        $scope.NrGenerating = false;
        $scope.LoadImg = false;
        var ApproveList = PreExaminationService.getSchemes();
        ApproveList.then(function (response) {

            $scope.Schemes = response.Table;

        },
        function (error) {
            //$scope.$emit('hideLoading', data);

            $scope.Data = false;
            $scope.Nodata = true;
            alert("error while loading data");
        });


        var getClgTypes = PreExaminationService.GetCollegelist();
        getClgTypes.then(function (res) {
            //var res = JSON.parse(res);
            $scope.GetCollegeTypes = res.Table;
            $scope.isAllSelectedCollegeTypes = true;
            var toggleStatus = $scope.isAllSelectedCollegeTypes
            angular.forEach($scope.GetCollegeTypes, function (itm) { itm.selected = toggleStatus; });
            $scope.CollegeTypesArray = [];
            angular.forEach($scope.GetCollegeTypes, function (value, key) {
                if (value.selected === true) {
                    $scope.CollegeTypesArray.push({ "collegecode": value.CollegeCode })
                }
            });
        }, function (err) {
            $scope.LoadImg = false;
            alert("Error while loading College Types");
        });


        //----------------------CollegeTypes Multi Select Start--------------------------------//
        var CollegeTypesExpand = false;
        $scope.showCollegeTypesCheckboxes = function () {
            var checkboxes = document.getElementById("checkboxesCollegeTypes");
            if (!CollegeTypesExpand) {
                checkboxes.style.display = "block";
                checkboxes.style.position = "absolute";
                checkboxes.style.width = "92%";
                checkboxes.style.backgroundColor = "white";
                checkboxes.style['z-index'] = 99;
                CollegeTypesExpand = true;
            } else {
                checkboxes.style.display = "none";
                CollegeTypesExpand = false;
            }
        }

        $scope.closeCollegeTypesCheckbox = function () {
            var checkboxes = document.getElementById("checkboxesCollegeTypes");
            if (!CollegeTypesExpand) {
                checkboxes.style.display = "block";
                checkboxes.style.position = "absolute";
                checkboxes.style.width = "92%";
                checkboxes.style.backgroundColor = "white";
                CollegeTypesExpand = true;
            } else {
                checkboxes.style.display = "none";
                CollegeTypesExpand = false;
            }
        }

        $scope.toggleAllCollegeTypes = function () {
            var toggleStatus = $scope.isAllSelectedCollegeTypes
            angular.forEach($scope.GetCollegeTypes, function (itm) { itm.selected = toggleStatus; });
            $scope.CollegeTypesArray = [];
            angular.f888$scope.CollegeTypesArray.push({ "collegecode": value.CollegeCode })
        }


        $scope.optionToggledCollegeTypes = function () {
            $scope.isAllSelectedCollegeTypes = $scope.GetCollegeTypes.every(function (itm) { return itm.selected; })
            $scope.CollegeTypesArray = [];
            angular.forEach($scope.GetCollegeTypes, function (value, key) {
                if (value.selected === true) {
                    $scope.CollegeTypesArray.push({ "collegecode": value.CollegeCode })
                }
            });

        }

        //----------------------CollegeTypes Multi Select End--------------------------------//

        var ApproveLists = PreExaminationService.getExamYearMonths();
        ApproveLists.then(function (response) {

            console.log(response);
            $scope.ExamMonthYear = response.Table

        },
        function (error) {
            //$scope.$emit('hideLoading', data);

            $scope.Data = false;
            $scope.Nodata = true;
            alert("error while loading data");
        });

        var LoadBacklogSemesters = PreExaminationService.getAllSemester();
        LoadBacklogSemesters.then(function (response) {
            $scope.ActiveSemesters = response.Table;
        },
            function (error) {
                var err = JSON.parse(error);
                console.log(err.Message);
            });


        $scope.DownloadMemoTrSheets = function () {
            $scope.NrGenerating = true;
            var CertificateFeePaymentReports = PreExaminationService.GetTrSheets($scope.Scheme, $scope.ExamMonth, $scope.date, JSON.stringify($scope.CollegeTypesArray), $scope.Semester);
            CertificateFeePaymentReports.then(function (res) {
                $scope.NrGenerating = false;
                if (res.length > 0) {                   
                        if (res.length > 10) {
                            window.location.href = "/Reports/" + res + '.pdf';
                        } else {
                            alert("Failed to generate Memo Tr Sheets");
                        }
                   
                } else {
                    alert("No Report Present")
                }
            }, function (err) {
                    $scope.NrGenerating = false;
                $scope.LoadImg = false;
                alert("Error while loading");
            });

        }
    })
})