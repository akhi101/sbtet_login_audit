define(['app'], function (app) {
    app.controller("TransactionReportController", function ($scope, $http, $localStorage, $state, AppSettings, PreExaminationService, MarksEntryService) {
        var authData = JSON.parse(sessionStorage.getItem('user'));
        $scope.userType = authData.SystemUserTypeId;
        if ($scope.userType == 2 || $scope.userType == 3) {
            alert("UnAuthorized Access");
            $state.go('Dashboard');
            return;
        }
        $scope.StudentType = [];
        $scope.ExcelView = false;
        $scope.isShowResults = false;
        $scope.RegularDisable = false;

        var LoadExamTypeBysem = MarksEntryService.getStudentType();
        LoadExamTypeBysem.then(function (response) {

            if (response.Table.length > 0) {

                $scope.StudentType = response.Table;

            } else {
                $scope.StudentType = [];

            }
        },


            function (error) {
                alert("error while Data");
                console.log(error);
            });


        var LoadExamTypeBysem = MarksEntryService.getExamtype();
        LoadExamTypeBysem.then(function (response) {

            if (response.Table.length > 0) {

                $scope.ExamType = response.Table;

            } else {
                $scope.ExamType = [];

            }
        },

            function (error) {
                alert("error while Data");
                console.log(error);
            });

        $scope.logOut = function () {
            sessionStorage.loggedIn = "no";
            var GetUserLogout = SystemUserService.getUserLogout();
            alert('Logout Successfully');
            $state.go('index.WebsiteLogin');

        }
        $scope.GetTransaction = function () {

            $scope.isShowResults = true;

            var studenttType = $scope.Student.id;
            var ExamType = $scope.Examtype;

            var fromdate = moment($scope.setFromDate).format("DD-MM-YYYY");
            var todate = moment($scope.setToDate).format("DD-MM-YYYY");
            fromdate = fromdate.toString() + " 00:00:00";
            todate = todate.toString() + " 23:59:59";
            if (ExamType === undefined || ExamType == '') {
                ExamType = 1;
            }
            var GetTransaction = PreExaminationService.GetFeePaymentReports(studenttType, fromdate.toString(), todate.toString(), ExamType);
            GetTransaction.then(function (response) {
                const keyToExclude = 'm4e/P4LndQ4QYQ8G+RzFmQ==';
                if (response.Status) {
                    // var keys = Object.keys(res);

                    //   $scope.statusKey = keys[0];
                    $scope.statusValue = response.Status;

                    // $scope.descriptionKey = keys[1];
                    $scope.descriptionValue = response.Description;

                    $scope.EncStatusDescription2 = $scope.descriptionValue;
                    if ($scope.statusValue == '6tEGN7Opkq9eFqVERJExVw==') {
                        $scope.decryptParameter2();
                        alert($scope.decryptedParameter2);

                    }
                    $scope.ExamMonthYear = "";
                }
                else if (response != null && response.length > 1) {
                    var location = window.location.origin
                    window.location.href = '/Reports' + response;
                    $scope. NoResult = false;

                } else {
                    alert("Error Generating The Report");
                    $scope. NoResult = true;

                }
            },
                function (error) {
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
        $scope.Setdate = function () {
            if (Date.parse($scope.setFromDate) > Date.parse($scope.setToDate)) {
                alert("To Date Should Not Less Then From Date");
                $scope.setToDate = '';

                return false;
            }
        };
        $scope.Todate = function () {
            if (Date.parse($scope.setFromDate) > Date.parse($scope.setToDate)) {
                alert("To Date Should Not Less Then From Date");
                $scope.setFromDate = '';

                return false;
            }
        };
        $scope.changeStuentType = function (studentType) {
            if (studentType == '1') {

                $scope.RegularDisable = false;
                $scope.Examtype = '';

            } else if (studentType == '2') {
                $scope.RegularDisable = true;
                $scope.Examtype = '';

            }

        };


    });
});