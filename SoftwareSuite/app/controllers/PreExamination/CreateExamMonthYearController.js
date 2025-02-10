define(['app'], function (app) {
    app.controller("CreateExamMonthYearController", function ($scope, $http, $localStorage, $state, AppSettings, PreExaminationService, $timeout) {


        const $ctrl = this;
        $ctrl.$onInit = () => {
            $scope.GetExamYearMonth();  
            $scope.ExamMonthYear = "";
        }
        
        var authData = JSON.parse(sessionStorage.getItem('user'));
        $scope.userType = authData.SystemUserTypeId;
        if ($scope.userType == 2 || $scope.userType == 3) {
            alert("UnAuthorized Access");
            $state.go('Dashboard');
            return;
        }
        $scope.Submit = function () {
            var datatypeid = 1
          
            if ($scope.ExamMonthYear == null || $scope.ExamMonthYear == undefined || $scope.ExamMonthYear == "") {
                alert("Enter exam month and year.");
                return;
            }
            var ApprovalList = PreExaminationService.SetExamMonthYear(datatypeid,$scope.ExamMonthYear,0,0);
            ApprovalList.then(function (res) {
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
                    $scope.ExamMonthYear = "";
                } else
               
                    if (res[0].ResponceCode == '200') {
                        alert(res[0].ResponceDescription);
                    $scope.GetExamYearMonth();
                }else
                        if (res[0].ResponceCode == '400') {
                            alert(res[0].ResponceDescription);
                        $scope.GetExamYearMonth();
                } else {
                    alert('Something Went Wrong')
                }
            },
        function (error) {
            alert("error while loading Exam Month Year");
            $scope.$emit('hideLoading', data);
        });
        }
        $scope.logOut = function () {
            sessionStorage.loggedIn = "no";
            var GetUserLogout = SystemUserService.getUserLogout();
            alert('Logout Successfully');
            $state.go('index.WebsiteLogin');

        }
        $scope.Editsemesterdat = function (data, ind) {

            var ele1 = document.getElementsByClassName("enabletable" + ind);
            for (var j = 0; j < ele1.length; j++) {
                ele1[j].style['pointer-events'] = "auto";
                ele1[j].style.border = "1px solid #ddd";             
            }
            $scope['edit' + ind] = false;

        }

        $scope.Updatesemesterdat = function (data, ind) {
            $scope['edit' + ind] = true;

            var ele2 = document.getElementsByClassName("enabletable" + ind);
            for (var j = 0; j < ele2.length; j++) {
                ele2[j].style['pointer-events'] = "none";
                ele2[j].style.border = "0";              
            }
                      

            var datatypeid = 2;

            if (data.ExamYearMonth == null || data.ExamYearMonth == undefined || data.ExamYearMonth == "") {
                alert("Enter exam month and year.");
                return;
            }
            if (data.SequenceId == null || data.SequenceId == undefined || data.SequenceId == "") {
                alert("Enter SequenceId.");
                return;
            }
            var SetSemester = PreExaminationService.SetExamMonthYear(datatypeid, data.ExamYearMonth, parseInt(data.Id), parseInt(data.SequenceId))
            SetSemester.then(function (response) {
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
                } else
               // var response = JSON.parse(response)
                    if (res[0].ResponceCode == '200') {
                        alert(res[0].ResponceDescription)
                    $scope.GetExamYearMonth();
                    } else if (res[0].ResponceCode == '400') {
                        alert(res[0].ResponceDescription);
                        $scope.GetExamYearMonth();
                } else {
                    alert('Something Went Wrong')
                }
            },
                function (error) {
                    alert("something Went Wrong")


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

        $scope.GetExamYearMonth = function () {
            var ApprovalLists = PreExaminationService.getExamYearMonths();
            ApprovalLists.then(function (response) {             
                $scope.getData = response.Table;
                for (var j = 1; j < response.Table.length + 1; j++) {
                    $scope['edit' + j] = true;
                }

            },function (error) {
                    alert("error while loading Academic Year");

                });
        }
    })
})