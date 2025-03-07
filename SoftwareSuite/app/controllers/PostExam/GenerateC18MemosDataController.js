﻿define(['app'], function (app) {
    app.controller("GenerateC18MemosDataController", function ($scope, $http, $localStorage, $state, $location, $window, $stateParams, AppSettings, PreExaminationService) {
        var authData = JSON.parse(sessionStorage.getItem('user'));
        $scope.userType = authData.SystemUserTypeId;
        if ($scope.userType == 2 || $scope.userType == 3) {
            alert("UnAuthorized Access")
            $state.go('Dashboard')
        }
        $scope.GradePoints='130'

        var ExamYearMonths = PreExaminationService.getExamYearMonths();
        ExamYearMonths.then(function (response) {
            if (response.Table.length > 0) {
                $scope.getExamMonthYears = response.Table;

            } else {
                $scope.getExamMonthYears = [];
                alert("No Exam Month Years found.");
            }
        },
         function (error) {
             alert("error while loading Exam Month Years");
             console.log(error);
         });

        $scope.GetGradepoints = [
        { "Value": "100" },
        { "Value": "110" },
        { "Value": "120" },
        { "Value": "130" },
        { "Value": "140" },
        { "Value": "150" }]

        $scope.ChangeGrade = function () {
         
                if (confirm("Are you sure you want Change Grade Points?") == true) {
                 
                } else {
                    userPreference = "Save Canceled!";
                    $scope.GradePoints = '130'
                }
         

        }

        $scope.ClearData = function () {
            $scope.ExamMonthYear = "";
            $scope.GradePoints = "";
            $scope.Day = "";
            $scope.Month = "";
            $scope.Year = "";
            $scope.Pin = "";
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

        $scope.Submit = function () {
            $scope.loading = true;
            $scope.Data = false;
            $scope.Noresult = false;
            $scope.Error1 = false;

            var loadData2 = PreExaminationService.GenerateC18MemosData($scope.ExamMonthYear, $scope.GradePoints,$scope.Day,$scope.Month,$scope.Year)
            loadData2.then(function (res) {
                var res = JSON.parse(res);
                try {
                    var res = JSON.parse(res);
                }
                catch
                {

                }
                const keyToExclude = 'm4e/P4LndQ4QYQ8G+RzFmQ==';
                if (res.Status) {
                    // var keys = Object.keys(res);

                    //   $scope.statusKey = keys[0];
                    $scope.statusValue = res.Status;

                    // $scope.descriptionKey = keys[1];
                    $scope.descriptionValue = res.Description;

                    $scope.EncStatusDescription2 = $scope.descriptionValue;
                    if ($scope.statusValue == '6tEGN7Opkq9eFqVERJExVw==') {
                        $scope.decryptParameter2();
                        alert($scope.decryptedParameter2);

                    }
                }


                else if (res[0].ResponceCode == '200') {
                    $scope.loading = false;
                    var msg = res[0].ResponceDescription;
                    alert(msg)
                    var location = response[0].file;
                    window.location.href = location;
                    console.log(location)
                    $scope.Noresult = false;
                } else if (res[0].ResponceCode == '400') {
                    $scope.loading = false;
                    $scope.Data = false;
                    $scope.Noresult = false;
                    $scope.Error1 = true;
                    $scope.ErrMsg1 = res[0].ResponceDescription;
                    alert($scope.ErrMsg1)
                } else {
                    $scope.loading = false;
                    $scope.Data = false
                    alert("No Data Found");
                    $scope.Noresult = true;
                    $scope.Error1 = false;

                }
            },
                function (error) {
                    $scope.loading = false;
                    $scope.Data = false;
                    $scope.Noresult = true;
                    $scope.Error = false;
                    alert("error while loading data");
                    var err = JSON.parse(error);
                    console.log(err.Message);
                });
        }




        $scope.logOut = function () {
            sessionStorage.loggedIn = "no";
            var GetUserLogout = SystemUserService.getUserLogout();
            alert('Logout Successfully');
            $state.go('index.WebsiteLogin');

        }
        $scope.Submit1 = function () {
            $scope.loading = true;
            $scope.Data = false;
            $scope.Noresult = false;
            $scope.Error1 = false;

            var loadData2 = PreExaminationService.GenerateC18MemosDataByPin($scope.ExamMonthYear, $scope.GradePoints, $scope.Day, $scope.Month, $scope.Year, $scope.Pin)
            loadData2.then(function (res) {
                var res = JSON.parse(res);
            try {
                var res = JSON.parse(res);
            }
            catch
            {

            }
            const keyToExclude = 'm4e/P4LndQ4QYQ8G+RzFmQ==';
            if (res.Status) {
                // var keys = Object.keys(res);

                //   $scope.statusKey = keys[0];
                $scope.statusValue = res.Status;

                // $scope.descriptionKey = keys[1];
                $scope.descriptionValue = res.Description;

                $scope.EncStatusDescription2 = $scope.descriptionValue;
                if ($scope.statusValue == '6tEGN7Opkq9eFqVERJExVw==') {
                    $scope.decryptParameter2();
                    alert($scope.decryptedParameter2);

                }
            }

                else if (response[0].ResponceCode == '200') {
                    $scope.loading = false;
                    var msg = res[0].ResponceDescription;
                    alert(msg)
                    var location = res[0].file;
                    window.location.href = location;
                    console.log(location)
                    $scope.Noresult = false;
                } else if (res[0].ResponceCode == '400') {
                    $scope.loading = false;
                    $scope.Data = false;
                    $scope.Noresult = false;
                    $scope.Error1 = true;
                    $scope.ErrMsg1 = res[0].ResponceDescription;
                    alert($scope.ErrMsg1)
                } else {
                    $scope.loading = false;
                    $scope.Data = false
                    alert("No Data Found");
                    $scope.Noresult = true;
                    $scope.Error1 = false;

                }
            },
                function (error) {
                    $scope.loading = false;
                    $scope.Data = false;
                    $scope.Noresult = true;
                    $scope.Error = false;
                    alert("error while loading data");
                    var err = JSON.parse(error);
                    console.log(err.Message);
                });
        }


    })
})