define(['app'], function (app) {
    app.controller("EnableFeepaymentController", function ($scope, $http, $localStorage, $state, $stateParams, AppSettings, $uibModal, PreExaminationService) {
        //var authdata = $localStorage.authorizationData;
        var authData = JSON.parse(sessionStorage.getItem('user'));
        $scope.userType = authData.SystemUserTypeId;
        if ($scope.userType == 2 || $scope.userType == 3) {
            alert("UnAuthorized Access");
            $state.go('Dashboard');
            return;
        }
        $scope.UserId = authdata.SysUserID;
        $scope.Fee = 0;
        $scope.LateFee = 0;
        $scope.TatkalFee = 0;
        $scope.PremiumTatkalFee = 0;
       
        var StudentTypes = PreExaminationService.getStudentType();
        StudentTypes.then(function (response) {
            if (response.Table.length > 0) {
                $scope.StudentType = response.Table;
                // $scope.StudentType.push(response.Table[0]);
            } else {
                $scope.StudentType = [];
                alert("No Student found on this Record");
            }
        },
         function (error) {
             alert("error while loading Student Types");
             console.log(error);
         });

        var getSemesters = PreExaminationService.GetSemesters();
        getSemesters.then(function (res) {
            //var res = JSON.parse(res);
            $scope.GetSemesters = res.Table;
          
        }, function (err) {
            $scope.LoadImg = false;
            alert("Error while loading");
        });


        var LoadExamMonthyears = PreExaminationService.getExamYearMonths();
        LoadExamMonthyears.then(function (response) {
            if (response.Table.length > 0) {
                $scope.getExamMonthYears = response.Table;
                // $scope.StudentType.push(response.Table[0]);
            } else {
                $scope.getExamMonthYears = [];
                alert("No Student found on this Record");
            }
        },
         function (error) {
             alert("error while loading Student Types");
             console.log(error);
         });


        
        
        //var LoadExamTypeBysem = PreExaminationService.getFeeTypes();
        //LoadExamTypeBysem.then(function (response) {
        //    if (response.Table.l0ength > 0) {
        //        $scope.GetFeeTypes = response.Table;
                
        //    } else {
        //        $scope.StudentType = [];
        //        alert("No Student found on this Record");
        //    }
        //},
        // function (error) {
        //     alert("error while loading Student Types");
        //     console.log(error);
        // });


        
        $scope.ChangeExamMonthYear = function () {

            
            var getFees = PreExaminationService.getFeeTypes($scope.ExamMonthYear, $scope.StudentTypeId);
            getFees.then(function (response) {
                var response = JSON.parse(response);
                if (response.Table.length > 0) {
                    $scope.FeeTypes = response.Table;
                    // $scope.StudentType.push(response.Table[0]);
                } else {
                    $scope.FeeTypes = [];
                    alert("No Fees found on this Exam Month Year");
                }
            },
              function (error) {
                  alert("error while loading Data");
                  console.log(error);
              });
        }

        $scope.ChangeFee = function (data) {
            var data = JSON.parse(data)
            $scope.Amount = data.FeeAmount;
            $scope.FeeType = data.FeeType
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

            //$scope.Fee = 0;
            //$scope.LateFee = 0;
            //$scope.TatkalFee = 0;
            //$scope.PremiumTatkalFee = 0;
            if ($scope.Fee == 0 && $scope.LateFee == 0 && $scope.TatkalFee == 0 && $scope.PremiumTatkalFee == 0) {
                alert('Please Enter Fee or Late Fee or Tatkal Fee or Premium Tatkal Fee ')
                return
            }
            //if ($scope.FeeType == 'Fee') {
            //    var dataType = 1
            //} else if ($scope.FeeType == 'LateFee') {
            //    var dataType = 2
            //} else if ($scope.FeeType == 'TatkalFee') {
            //    var dataType = 3
            //}
            //ExamMonthYear, studenttypeid, ExamFee, LateFe, TatkalFee, PremiumTatkalFee
            if ($scope.StudentTypeId == 2) {
                var Semester = $scope.Semester
            } else {
                var Semester = 0
            }
            var SetFeePayment = PreExaminationService.EnableFeePayment($scope.ExamMonthYear, $scope.Pin, $scope.StudentTypeId, $scope.Fee, $scope.LateFee, $scope.TatkalFee, $scope.PremiumTatkalFee, Semester);
            SetFeePayment.then(function (res) {
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
                } else if (res.Table[0].ResponseCode =='200') {
                    alert(res.Table[0].ResponseDescription)
                } else if (res.Table[0].ResponseCode == '400') {
                    alert(res.Table[0].ResponseDescription)
                }else {
                    //$scope.getExamMonthYears = [];
                    alert("Something Went Wrong");
                }
            },
             function (error) {
                 alert("error while loading Data");
                 console.log(error);
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
    })
})