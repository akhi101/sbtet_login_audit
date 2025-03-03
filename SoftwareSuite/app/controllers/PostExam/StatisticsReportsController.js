define(['app'], function (app) {
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

        $scope.logOut = function () {
            sessionStorage.loggedIn = "no";
            var GetUserLogout = SystemUserService.getUserLogout();
            alert('Logout Successfully');
            $state.go('index.WebsiteLogin');

        }


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
                const keyToExclude = 'm4e/P4LndQ4QYQ8G+RzFmQ==';
                if (response.Status) {
                    // var keys = Object.keys(response);

                    //   $scope.statusKey = keys[0];
                    $scope.statusValue = response.Status;

                    // $scope.descriptionKey = keys[1];
                    $scope.descriptionValue = response.Description;

                    $scope.EncStatusDescription2 = $scope.descriptionValue;
                    if ($scope.statusValue == '6tEGN7Opkq9eFqVERJExVw==') {
                        $scope.decryptParameter2();
                        alert($scope.decryptedParameter2);

                    }
                } 
                else if (data[0].ResponceCode == '200') {
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

        var authData = JSON.parse(sessionStorage.getItem('user'));
        $scope.userType = authData.SystemUserTypeId;
        if ($scope.userType == 3) {
            alert("UnAuthorized Access")
            $state.go('Dashboard')
        }
    })
})