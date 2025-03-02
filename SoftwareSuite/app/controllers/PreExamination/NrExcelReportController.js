define(['app'], function (app) {
    app.controller("NrExcelReportController", function ($scope, $http, $localStorage, $state, $stateParams, AppSettings, PreExaminationService) {

        $scope.ArrayBarimg = [];
        $scope.ArrayBarcode = [];
        $scope.BarcodeElements = [];
        $scope.examTypeId = "0";
        $scope.Exams = [
            { id: 1, exam: "Mid 1" },
            { id: 2, exam: "Mid 2" },
            { id: 5, exam: "Semester" }
        ];
        //var authData = $localStorage.authorizationData;

        var authData = JSON.parse(sessionStorage.getItem('user'));

        $scope.DetailsFound = false;
        PreExaminationService.GetExamMonthYears().then(function (res) {
            $scope.ExamMonthYears = res.Table;
        },
            function (error) {
                alert("error while loading Exam Month Years");
                console.log(error);
            });

        var LoadExamTypeBysem = PreExaminationService.getStudentType();
        LoadExamTypeBysem.then(function (response) {
            if (response.Table.length > 0) {
                $scope.StudentType = response.Table;
            } else {
                $scope.StudentType = [];
                alert("No Student found on this Record");
            }
        },
            function (error) {
                alert("error while loading Student Types");
                console.log(error);
            });


        $scope.changedVal = function () {
            $scope.DetailsFound = false;
        }

        var authData = JSON.parse(sessionStorage.getItem('user'));
        $scope.userType = authData.SystemUserTypeId;
        if ($scope.userType == 1 || $scope.userType == 3) {
            alert("UnAuthorized Access")
            $state.go('Dashboard')
        }



        $scope.logOut = function () {
            sessionStorage.loggedIn = "no";
            var GetUserLogout = SystemUserService.getUserLogout();
            alert('Logout Successfully');
            $state.go('index.WebsiteLogin');

        }


        $scope.getNrExcel = function (StudentType, ExamTypeId) {
            $scope.LoadImg = true;
            var getNrReports = PreExaminationService.NrExcelReports(StudentType, authData.College_Code.toString(), ExamTypeId, $scope.selectedEmy);
            getNrReports.then(function (res) {
                $scope.LoadImg = false;
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
                else if (res.length > 0) {
                    if (res.length > 4) {
                        window.location.href = res;
                    } else {
                        alert("No NR Excel Report Present")
                    }
                } else {
                    alert("No NR Report Present")
                }
            }, function (err) {
                $scope.LoadImg = false;
                alert("Error while loading");
            });

        };


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

    })
})