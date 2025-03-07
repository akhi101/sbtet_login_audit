﻿define(['app'], function (app) {
    app.controller("CondonationController", function ($scope, $http, $localStorage, $state, AppSettings, PreExaminationService, AssessmentService, MarksEntryService) {
       // document.getElementById("overlayCss").style.display = "block";
        //var authData = $localStorage.authorizationData;

        var authData = JSON.parse(sessionStorage.getItem('user'));

        $scope.Student = {};
        $scope.Student.id = '';
        $scope.isShowResults = false;
        $scope.isShowTags = false;
        $scope.isPrincipalTable = false;
        $scope.isHodTable = false;
        $scope.isAllchecked = false;
        var PaymentStudent = [];
        $scope.approve = function () {
            console.log(PaymentStudent);
            if (PaymentStudent.length > 0) {
                var UserTypeId = authData.SystemUserTypeId;
                debugger;
                var ApprovalList = PreExaminationService.setApprovalSingleList(JSON.stringify(PaymentStudent), UserTypeId);
                ApprovalList.then(function (response) {
                    var listResponse = response;
                    if (listResponse.length > 0) {
                        if (listResponse[0].ResponceCode == 200) {
                            alert(listResponse[0].ResponceDescription);
                            $state.go("Dashboard.PreExamination");
                        }
                    }

                },
                    function (error) {
                        alert("error while loading Academic Year");
                    });
            }
            else {
                alert("select any value");
            }
        }

        Array.prototype.remByVal = function (val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] === val) {
                    this.splice(i, 1);
                    break;
                }
            }
            return this;
        }

        Array.prototype.remElementByVal = function (val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i].Pin === val) {
                    this.splice(i, 1);
                    break;
                }
            }
            return this;
        }


        $scope.selectEntity = function (data) {
            $scope.allItemsSelectedthing = false;
            if (data != null) {
                if (!PaymentStudent.includes(data.Pin)) {
                    dataPay = {};
                    dataPay.Pin = data.Pin;

                    PaymentStudent.push(dataPay);
                }
                else if (PaymentStudent.includes(data.Pin)) {
                    //PaymentStudentList.remByVal(data.Pin);
                    PaymentStudent.remElementByVal(data.Pin);
                }

            }

        };

        var authData = JSON.parse(sessionStorage.getItem('user'));
        $scope.userType = authData.SystemUserTypeId;
        if ($scope.userType == 1) {
            alert("UnAuthorized Access")
            $state.go('Dashboard')
        }


        $scope.logOut = function () {
            sessionStorage.loggedIn = "no";
            var GetUserLogout = SystemUserService.getUserLogout();
            alert('Logout Successfully');
            $state.go('index.WebsiteLogin');

        }


        $scope.selectAll = function () {
            $scope.allItemsSelectedthing = true;
            if ($scope.isAllchecked == true) {

                $scope.isAllchecked = false;
                for (var i = 0; i < $scope.SubExamPayment.length; i++) {
                    $scope.SubExamPayment[i].isChecked = false;
                }
                PaymentStudent = [];
                PaymentStudentList = [];
            }
            else if ($scope.isAllchecked == false) {
                $scope.isAllchecked = true;
                for (var i = 0; i < $scope.SubExamPayment.length; i++) {
                    $scope.SubExamPayment[i].isChecked = true;
                }
                PaymentStudentList = [];
                PaymentStudent = [];
                for (var i = 0; i < $scope.SubExamPayment.length; i++) {
                    dataPay = {};

                    dataPay.Pin = $scope.SubExamPayment[i].Pin;
                    PaymentStudent.push(dataPay);
                    PaymentStudentList.push($scope.SubExamPayment[i].Pin);
                }
            }
        }

            $scope.GetOnrole = function (data) {
                data.type = 1;
                $localStorage.authorizationData.onRoleDetails = data;
                $state.go("Dashboard.PreExamination.CheckOnRole");
            };

            $scope.GetFeeEligibleList = function (data) {
                data.type = 2;
                $localStorage.authorizationData.onRoleDetails = data;
                $state.go("Dashboard.PreExamination.CheckOnRole");
            };

            $scope.GetFeePayedList = function (data) {
                data.type = 3;
                $localStorage.authorizationData.onRoleDetails = data;
                $state.go("Dashboard.PreExamination.CheckOnRole");
            }
            $scope.GetFeeNotPayedList = function (data) {
                data.type = 4;
                $localStorage.authorizationData.onRoleDetails = data;
                $state.go("Dashboard.PreExamination.CheckOnRole");
            }

            $scope.CondonationList = function (data) {
                data.StudentType = $scope.Student.id;
                $localStorage.authorizationData.onRoleDetails = data;
                $state.go("Dashboard.PreExamination.RecomendApproval");
            }



            if (authData.SystemUserTypeId == 3 || authData.SystemUserTypeId == 2) {
                $scope.isShowTags = true;
                if (authData.SystemUserTypeId == 2) {
                    $scope.isPrincipalTable = true;
                }
                else if (authData.SystemUserTypeId == 3) {
                    $scope.isHodTable = true;
                }

                var LoadExamTypeBysem = MarksEntryService.GetPresentStudentType();
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


                var AcademicYearsActive = AssessmentService.GetAcademicYearsActive();
                AcademicYearsActive.then(function (response) {
                    $scope.years = response.Table[0];

                },
                    function (error) {
                        alert("error while loading Academic Year");
                    });
                $scope.showPaymentDetails = function () {

                    if ($scope.Student.id !== undefined && $scope.Student.id != '') {

                        if (authData.SystemUserTypeId == 2) {
                            
                            $scope.isPrincipalTable = true;
                            var ApprovalList = PreExaminationService.getApprovalSingleList(authData.SystemUserTypeId.toString(), authData.College_Code.toString(), "", "", $scope.Student.id.toString());
                            ApprovalList.then(function (response) {
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
                                    for (var i = 0; i < response.length; i++) {
                                        response[i].isChecked = false;
                                    }

                                    $scope.SubExamPayment = response;
                                }

                                else if (response.length > 0) {
                                    if (response[0].Responsecode == '400') {
                                        alert(response[0].Responsedescription)
                                        $scope.isShowResults = false;
                                        document.getElementById("overlayCss").style.display = "none";
                                    } else {
                                        $scope.isShowResults = true;
                                        document.getElementById("overlayCss").style.display = "none";
                                    }
                                   
                                }
                                else {
                                    alert("No Data Found")
                                    document.getElementById("overlayCss").style.display = "none";
                                }

                            },
                                function (error) {
                                    alert("error while loading Academic Year");
                                });
                            document.getElementById("overlayCss").style.display = "none";
                        }
                        else {
                            var getAdmissionsubmod = PreExaminationService.getApproveExamFeeCondonation(authData.SysUserID, $scope.Student.id);
                            getAdmissionsubmod.then(function (Usersdata) {


                                if (Usersdata.length > 0) {
                                    if (Usersdata[0].Responsecode == '400') {
                                        alert(Usersdata[0].Responsedescription)
                                        $scope.isShowResults = false;
                                        document.getElementById("overlayCss").style.display = "none";
                                    } else {
                                        $scope.isShowResults = true;
                                        $scope.ExamPayment = Usersdata;
                                        document.getElementById("overlayCss").style.display = "none";
                                    }
                                   
                                }
                                else {
                                    $scope.isShowResults = false;
                                    $scope.AcademicModules = [];
                                    alert("No Data Found");
                                    document.getElementById("overlayCss").style.display = "none";
                                }

                            }, function (err) {
                                $scope.isShowResults = false;
                                console.log(err);
                                document.getElementById("overlayCss").style.display = "none";
                            });
                        }
                    }
                    else {
                        alert("please select required fields");
                        document.getElementById("overlayCss").style.display = "none";
                    }

                }
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

        });
});