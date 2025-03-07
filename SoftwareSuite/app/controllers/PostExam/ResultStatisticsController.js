﻿define(['app'], function (app) {
    app.controller("ResultStatisticsController", function ($scope, $state, PreExaminationService, $localStorage) {

        var authData = JSON.parse(sessionStorage.getItem('user'));
        $scope.userType = authData.SystemUserTypeId;
        if ($scope.userType == 2 || $scope.userType == 3) {
            alert("UnAuthorized Access")
            $state.go('Dashboard');
            return;
        }
        var getAcademicYears = PreExaminationService.GetMonthYear();
        getAcademicYears.then(function (response) {
            $scope.AcademicYears = response.Table;

        }, function (error) {
            alert("error while loading Academic Year");

        });

        var getcolleges = PreExaminationService.GetCollegelist();
        getcolleges.then(function (response) {
            $scope.CollegeData = response.Table;

        }, function (error) {
            alert("error while loading Academic Year");

        });

        var getbranches = PreExaminationService.GetBranchs();
        getbranches.then(function (response) {
            $scope.BranchData = response.Table;

        }, function (error) {
            alert("error while loading Academic Year");

        });



        $scope.Tab1 = function () {


            $scope.academicYearID = null;
            $scope.examMonthYearID = null;
            $scope.College = null;
            $scope.CollegeWiseData = [];

            $scope.academicyearID = null;
            $scope.exammonthYearID = null;
            $scope.Branch = null;
            $scope.BranchWiseData = [];

            $scope.Noresult = false;

        }

        $scope.Tab2 = function () {
            $scope.AcademicYearID = null;
            $scope.ExamMonthYearID = null;
            $scope.SemesterWiseData = [];

            $scope.academicyearID = null;
            $scope.exammonthYearID = null;
            $scope.Branch = null;
            $scope.BranchWiseData = [];

            $scope.Noresult = false;



        }

        $scope.Tab3 = function () {
            $scope.AcademicYearID = null;
            $scope.ExamMonthYearID = null;
            $scope.SemesterWiseData = [];

            $scope.academicYearID = null;
            $scope.examMonthYearID = null;
            $scope.College = null;
            $scope.CollegeWiseData = [];

            $scope.Noresult = false;

        }


        $scope.logOut = function () {
            sessionStorage.loggedIn = "no";
            var GetUserLogout = SystemUserService.getUserLogout();
            alert('Logout Successfully');
            $state.go('index.WebsiteLogin');

        }
        $scope.AcademicYearChange1 = function () {
            var emmothyr = PreExaminationService.GetExamMonthYearsByAcademicYearId($scope.AcademicYearID);
            emmothyr.then(function (response) {
                var res = JSON.parse(response)
                $scope.GetExamMonthYears1 = res;

            }, function (error) {
                alert("error while loading Exam Month Years");

            });

        }


        $scope.AcademicYearChange2 = function () {
            var emmothyr = PreExaminationService.GetExamMonthYearsByAcademicYearId($scope.academicYearID);
            emmothyr.then(function (response) {
                var res = JSON.parse(response)
                $scope.GetExamMonthYears2 = res;

            }, function (error) {
                alert("error while loading Exam Month Years");

            });

        }

        $scope.AcademicYearChange3 = function () {
            var emmothyr = PreExaminationService.GetExamMonthYearsByAcademicYearId($scope.academicyearID);
            emmothyr.then(function (response) {
                var res = JSON.parse(response)
                $scope.GetExamMonthYears3 = res;

            }, function (error) {
                alert("error while loading Exam Month Years");

            });

        }

        $scope.GetReport1 = function () {
            var DataType = 1;
            if ($scope.AcademicYearID == '' || $scope.AcademicYearID == null || $scope.AcademicYearID == undefined) {
                alert('Please select Academic Year');
                return;
            }
            if ($scope.ExamMonthYearID == '' || $scope.ExamMonthYearID == null || $scope.ExamMonthYearID == undefined) {
                alert('Please select Exam Month Year');
                return;
            }
            $scope.LoadImg = true;
            $scope.isShowResults = true;
            PreExaminationService.GetSemesterWiseStatistics(DataType, $scope.AcademicYearID, $scope.ExamMonthYearID, 0, 0)
                .then(function (response) {

                    // Check if the response is a JSON string
                    if (typeof data === "string") {
                        var res1 = JSON.parse(response);
                        try {
                            var res2 = JSON.parse(res1);
                        }
                        catch
                        {

                        }
                        const keyToExclude = 'm4e/P4LndQ4QYQ8G+RzFmQ==';
                        if (res2.Status) {
                            // var keys = Object.keys(res);

                            //   $scope.statusKey = keys[0];
                            $scope.statusValue = res2.Status;

                            // $scope.descriptionKey = keys[1];
                            $scope.descriptionValue = res2.Description;

                            $scope.EncStatusDescription2 = $scope.descriptionValue;
                            if ($scope.statusValue == '6tEGN7Opkq9eFqVERJExVw==') {
                                $scope.decryptParameter2();
                                alert($scope.decryptedParameter2);

                            }
                        }
                    }
                    else {

                        var Res = JSON.parse(response)

                        var OnRoll = 0;
                        var FeePaid = 0;
                        var Pass = 0;
                        var Per = 0;
                        if (Res.length > 0) {
                            $scope.SemesterWiseData = Res;
                            for (var i = 0; i < Res.length; i++) {
                                if (Res[i].OnRoll != null)
                                    OnRoll = OnRoll + Res[i].OnRoll;
                                if (Res[i].FeePaid != null)
                                    FeePaid = FeePaid + Res[i].FeePaid;
                                if (Res[i].Pass != null)
                                    Pass = Pass + Res[i].Pass;
                                //if (Res[i].Per != null)
                                //    Per = Per + Res[i].Per;
                                $scope.LoadImg = false;
                                $scope.Noresult = false;
                            }
                            $scope.OnRoll = OnRoll;
                            $scope.FeePaid = FeePaid;
                            $scope.Pass = Pass;
                            $scope.Per = ($scope.Pass / $scope.FeePaid) * 100;

                        }
                        else {
                            $scope.SemesterWiseData = [];
                            $scope.LoadImg = false;
                            $scope.Noresult = true;
                        }

                    }

                },
                    function (error) {
                        $scope.LoadImg = false;
                        alert("error data is not getting");
                        var err = JSON.parse(error);
                        console.log(err.Message);
                    });
        }
        $scope.decryptParameter2 = function () {
            var base64Key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 Key
            var base64IV = "u4I0j3AQrwJnYHkgQFwVNw=="; // AES IV
            var ciphertext = $scope.EncStatusDescription2; // Encrypted text (Base64)

            var key = CryptoJS.enc.Base64.parse(base64Key);
            var iv = CryptoJS.enc.Base64.parse(base64IV);

            // Decrypt the ciphertext
            var decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC, // Ensure CBC mode
                padding: CryptoJS.pad.Pkcs7, // Ensure PKCS7 padding
            });

            // Convert decrypted data to a UTF-8 string
            $scope.decryptedText2 = decrypted.toString(CryptoJS.enc.Utf8);
            $scope.decryptedParameter2 = $scope.decryptedText2;
        };
        $scope.GetReport2 = function () {
            var DataType = 2;
            if ($scope.academicYearID == '' || $scope.academicYearID == null || $scope.academicYearID == undefined) {
                alert('Please select Academic Year');
                return;
            }
            if ($scope.examMonthYearID == '' || $scope.examMonthYearID == null || $scope.examMonthYearID == undefined) {
                alert('Please select Exam Month Year');
                return;
            }

            if ($scope.College == '' || $scope.College == null || $scope.College == undefined) {
                alert('Please select College');
                return;
            }
            $scope.LoadImg = true;
            $scope.isShowResults = true;
            PreExaminationService.GetCollegeWiseStatistics(DataType, $scope.academicYearID, $scope.examMonthYearID, $scope.College, 0)
                .then(function (response) {
                    

                    // Check if the response is a JSON string
                    if (typeof data === "string") {
                        var res1 = JSON.parse(Res);
                        try {
                            var res2 = JSON.parse(res1);
                        }
                        catch
                        {

                        }
                        const keyToExclude = 'm4e/P4LndQ4QYQ8G+RzFmQ==';
                        if (res2.Status) {
                            // var keys = Object.keys(res);

                            //   $scope.statusKey = keys[0];
                            $scope.statusValue = res2.Status;

                            // $scope.descriptionKey = keys[1];
                            $scope.descriptionValue = res2.Description;

                            $scope.EncStatusDescription2 = $scope.descriptionValue;
                            if ($scope.statusValue == '6tEGN7Opkq9eFqVERJExVw==') {
                                $scope.decryptParameter2();
                                alert($scope.decryptedParameter2);

                            }
                        }




                    }

                    else {
                        var Res = JSON.parse(response);

                        var OnRoll = 0;
                        var FeePaid = 0;
                        var Pass = 0;
                        var Per = 0;
                        if (Res.length > 0) {
                            $scope.CollegeWiseData = Res;
                            for (var i = 0; i < Res.length; i++) {
                                if (Res[i].OnRoll != null)
                                    OnRoll = OnRoll + Res[i].OnRoll;
                                if (Res[i].FeePaid != null)
                                    FeePaid = FeePaid + Res[i].FeePaid;
                                if (Res[i].Pass != null)
                                    Pass = Pass + Res[i].Pass;
                                if (Res[i].Per != null)
                                    Per = Per + Res[i].Per;
                                $scope.LoadImg = false;
                                $scope.Noresult = false;
                            }
                            $scope.OnRoll = OnRoll;
                            $scope.FeePaid = FeePaid;
                            $scope.Pass = Pass;
                            $scope.Per = ($scope.Pass / $scope.FeePaid) * 100;
                        }
                        else {
                            $scope.CollegeWiseData = [];
                            $scope.LoadImg = false;
                            $scope.Noresult = true;


                        }


                    }

                    
                },
                    function (error) {
                        $scope.LoadImg = false;
                        alert("error data is not getting");
                        var err = JSON.parse(error);
                        console.log(err.Message);
                    });
        }

        $scope.GetReport3 = function () {
            var DataType = 3;
            if ($scope.academicyearID == '' || $scope.academicyearID == null || $scope.academicyearID == undefined) {
                alert('Please select Academic Year');
                return;
            }
            if ($scope.exammonthYearID == '' || $scope.exammonthYearID == null || $scope.exammonthYearID == undefined) {
                alert('Please select Exam Month Year');
                return;
            }

            if ($scope.Branch == '' || $scope.Branch == null || $scope.Branch == undefined) {
                alert('Please select Branch');
                return;
            }
            $scope.LoadImg = true;
            $scope.isShowResults = true;
            PreExaminationService.GetBranchWiseStatistics(DataType, $scope.academicyearID, $scope.exammonthYearID, 0, $scope.Branch)
                .then(function (response) {
                    let keys = Object.keys(response[0]);
                    // Check if the response is a JSON string
                    if (typeof response === "string") {
                        var res1 = JSON.parse(response);
                        try {
                            var res2 = JSON.parse(res1);
                        }
                        catch
                        {

                        }
                        const keyToExclude = 'm4e/P4LndQ4QYQ8G+RzFmQ==';
                        if (res2.Status) {
                            // var keys = Object.keys(res);

                            //   $scope.statusKey = keys[0];
                            $scope.statusValue = res2.Status;

                            // $scope.descriptionKey = keys[1];
                            $scope.descriptionValue = res2.Description;

                            $scope.EncStatusDescription2 = $scope.descriptionValue;
                            if ($scope.statusValue == '6tEGN7Opkq9eFqVERJExVw==') {
                                $scope.decryptParameter2();
                                alert($scope.decryptedParameter2);

                            }
                        }
                    }
                    else {

                        var Res = JSON.parse(response)

                        var OnRoll = 0;
                        var FeePaid = 0;
                        var Pass = 0;
                        var Per = 0;
                        if (Res.length > 0) {
                            $scope.BranchWiseData = Res;
                            for (var i = 0; i < Res.length; i++) {
                                if (Res[i].OnRoll != null)
                                    OnRoll = OnRoll + Res[i].OnRoll;
                                if (Res[i].FeePaid != null)
                                    FeePaid = FeePaid + Res[i].FeePaid;
                                if (Res[i].Pass != null)
                                    Pass = Pass + Res[i].Pass;
                                if (Res[i].Per != null)
                                    Per = Per + Res[i].Per;
                                $scope.LoadImg = false;
                                $scope.Noresult = false;
                            }
                            $scope.OnRoll = OnRoll;
                            $scope.FeePaid = FeePaid;
                            $scope.Pass = Pass;
                            $scope.Per = ($scope.Pass / $scope.FeePaid) * 100;
                        }
                        else {
                            $scope.BranchWiseData = [];
                            $scope.LoadImg = false;
                            $scope.Noresult = true;

                        }

                    }

                    
                },
                    function (error) {
                        $scope.LoadImg = false;
                        alert("error data is not getting");
                        var err = JSON.parse(error);
                        console.log(err.Message);
                    });
        }



        $scope.DownloadtoExcel1 = function () {
            var DataType = 1;
            if ($scope.AcademicYearID == '' || $scope.AcademicYearID == null || $scope.AcademicYearID == undefined) {
                alert('Please select Academic Year');
                return;
            }
            if ($scope.ExamMonthYearID == '' || $scope.ExamMonthYearID == null || $scope.ExamMonthYearID == undefined) {
                alert('Please select Exam Month Year');
                return;
            }
            $scope.LoadImg = true;
            $scope.isShowResults = true;
            PreExaminationService.GetSemesterWiseStatisticsExcel(DataType, $scope.AcademicYearID, $scope.ExamMonthYearID, 0, 0)
                .then(function (response) {
                    if (response != null && response.length > 1) {
                        var location = window.location.origin;
                        $scope.LoadImg = false;
                        window.location.href = response;
                        $scope.NoResult = false;
                    } else {
                        $scope.LoadImg = false;
                        alert("Error Generating The Report");
                        $scope.NoResult = true;
                    }
                },
                    function (error) {
                        $scope.LoadImg = false;
                        alert("error data is not getting");
                        var err = JSON.parse(error);
                        console.log(err.Message);
                    });

        }

        $scope.DownloadtoExcel2 = function () {
            var DataType = 2;
            if ($scope.academicYearID == '' || $scope.academicYearID == null || $scope.academicYearID == undefined) {
                alert('Please select Academic Year');
                return;
            }
            if ($scope.examMonthYearID == '' || $scope.examMonthYearID == null || $scope.examMonthYearID == undefined) {
                alert('Please select Exam Month Year');
                return;
            }

            if ($scope.College == '' || $scope.College == null || $scope.College == undefined) {
                alert('Please select College');
                return;
            }
            $scope.LoadImg = true;
            $scope.isShowResults = true;
            PreExaminationService.GetCollegeWiseStatisticsExcel(DataType, $scope.academicYearID, $scope.examMonthYearID, $scope.College, 0)
                .then(function (response) {
                    if (response != null && response.length > 1) {
                        var location = window.location.origin;
                        $scope.LoadImg = false;
                        window.location.href = response;
                        $scope.NoResult = false;
                    } else {
                        $scope.LoadImg = false;
                        alert("Error Generating The Report");
                        $scope.NoResult = true;
                    }
                },
                    function (error) {
                        $scope.LoadImg = false;
                        alert("error data is not getting");
                        var err = JSON.parse(error);
                        console.log(err.Message);
                    });

        }

        $scope.DownloadtoExcel3 = function () {
            var DataType = 3;
            if ($scope.academicyearID == '' || $scope.academicyearID == null || $scope.academicyearID == undefined) {
                alert('Please select Academic Year');
                return;
            }
            if ($scope.exammonthYearID == '' || $scope.exammonthYearID == null || $scope.exammonthYearID == undefined) {
                alert('Please select Exam Month Year');
                return;
            }

            if ($scope.Branch == '' || $scope.Branch == null || $scope.Branch == undefined) {
                alert('Please select Branch');
                return;
            }
            $scope.LoadImg = true;
            $scope.isShowResults = true;
            PreExaminationService.GetBranchWiseStatisticsExcel(DataType, $scope.academicyearID, $scope.exammonthYearID, 0, $scope.Branch)
                .then(function (response) {
                    if (response != null && response.length > 1) {
                        var location = window.location.origin;
                        $scope.LoadImg = false;
                        window.location.href = response;
                        $scope.NoResult = false;
                    } else {
                        $scope.LoadImg = false;
                        alert("Error Generating The Report");
                        $scope.NoResult = true;
                    }
                },
                    function (error) {
                        $scope.LoadImg = false;
                        alert("error data is not getting");
                        var err = JSON.parse(error);
                        console.log(err.Message);
                    });

        }





    });
});