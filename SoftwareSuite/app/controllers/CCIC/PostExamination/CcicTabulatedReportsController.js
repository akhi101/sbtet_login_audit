﻿define(['app'], function (app) {
    app.controller("CcicTabulatedReportsController", function ($scope, CcicPreExaminationService) {


        const $ctrl = this;
        $ctrl.$onInit = () => {

        }


        var getCcicCurrentAcademicYear = CcicPreExaminationService.GetCcicCurrentAcademicYear();
        getCcicCurrentAcademicYear.then(function (response) {

            $scope.GetCcicCurrentAcademicYear = response;

        },
            function (error) {
                alert("error while loading CurrentAcademicYear");
                var err = JSON.parse(error);

            });



        $scope.getAYBatchExamMonthYear = function (AcademicYearID, BaTch) {
            if (AcademicYearID == null || AcademicYearID == undefined || AcademicYearID == "") {
                return;

            }

            if (BaTch == null || BaTch == undefined || BaTch == "") {
                return;

            }
            $scope.AcademicYearID = AcademicYearID;



            var getAYbatchexammonthyear = CcicPreExaminationService.GetAYBatchExamMonthYear(AcademicYearID, BaTch)
            getAYbatchexammonthyear.then(function (res) {
                try {
                    var res = JSON.parse(res);
                }
                catch (err) { }

                if (res.Table.length > 0) {
                    $scope.GetAYBatchExamMonthYearData = res.Table;
                }
                else {
                    $scope.GetAYBatchExamMonthYearData = [];
                }

            },
                function (error) {
                    alert("data is not loaded");
                    var err = JSON.parse(error);
                });


        }


    })
})


