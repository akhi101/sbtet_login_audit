﻿define(['app'], function (app) {
    app.controller("DateSheetMonthYearController", function ($scope, $http, $localStorage, $state, $stateParams, AppSettings, MasterPageService, PreExaminationService) {

        //var authData = $localStorage.authorizationData;
        var authData = JSON.parse(sessionStorage.getItem('user'));
        $scope.userType = authData.SystemUserTypeId;
        if ($scope.userType == 2 || $scope.userType == 3) {
            alert("UnAuthorized Access")
            $state.go('Dashboard')
        }
        $scope.UserName = authData.UserName

        $scope.ReportFound = false;
        $scope.Noreports = false;
        $scope.Adddata = false;
        $scope.GetMasterSessions = [];
        $scope.Exams = [
            { id: 1, exam: "Mid 1" },
            { id: 2, exam: "Mid 2" },
            { id: 10, exam: "Semester" }
        ];
     
        const $ctrl = this;
        $ctrl.$onInit = () => {
            $scope.GetAcademicData();          
            $scope.GetExamYearMonth();
        }


        $scope.logOut = function () {
            sessionStorage.loggedIn = "no";
            var GetUserLogout = SystemUserService.getUserLogout();
            alert('Logout Successfully');
            $state.go('index.WebsiteLogin');

        }

        $scope.GetExamYearMonth = function () {
            var ApprovalLists = PreExaminationService.getExamYearMonths();
            ApprovalLists.then(function (response) {
                $scope.MonthAndYear = response.Table;

            }, function (error) {
                alert("error while loading Academic Year");

            });
        }

        $scope.sessioninfo = [{ session: "SESSION 1", val: 1 }, { session: "SESSION 2", val: 2 }]

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

            });



        $scope.GetAcademicData = function () {
            var GetMonthYear = PreExaminationService.GetMonthYear()
            GetMonthYear.then(function (response) {

                $scope.GetExamMonthYear = response.Table;


            },
                function (error) {
                    alert("data is not loaded");

                });
        }      




        $scope.addData = function(){

            $scope.Adddata = true;
        }


        $scope.GetDetails = function () {
            if ($scope.selAcademicYear == null || $scope.selAcademicYear == undefined || $scope.selAcademicYear == "") {
                alert("Select Academic Year.");
                return;
            }
            if ($scope.selSession == null || $scope.selSession == undefined || $scope.selSession == "") {
                alert("Select Session.");
                return;
            }
            $scope.GetMasterSessions = [];
            $scope.ReportFound = false;
            $scope.Noreports = false;

            var sessiodata = PreExaminationService.GetTimeTableMonthYearExamTypes($scope.selSession, $scope.selAcademicYear);
            sessiodata.then(function (data) {
                try { var data = JSON.parse(data) } catch (err) { }
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
                else if (data.length > 0) {
                    $scope.ReportFound = true;
                    $scope.Noreports = false;
                    $scope.GetMasterAcademic = data;
                    for (var j = 1; j < data.length + 1; j++) {
                        $scope['edit' + j] = true;
                    }
                } else {
                    $scope.ReportFound = false;
                    $scope.Noreports = true;
                }
            }, function (error) {
                $scope.GetMasterSessions = [];
                $scope.ReportFound = fale;
                $scope.Noreports = true;
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

        $scope.Editsemesterdat = function (data, ind) {

            var ele1 = document.getElementsByClassName("enabletable" + ind);
            for (var j = 0; j < ele1.length; j++) {
                ele1[j].style['pointer-events'] = "auto";
                ele1[j].style.border = "1px solid #ddd";
                ele1[j].style['-webkit-appearance'] = "auto";
                ele1[j].style['-moz-appearance'] = "auto";
            }
            $scope['edit' + ind] = false;

        }

        $scope.Updatesemesterdat = function (data, ind) {
            $scope['edit' + ind] = true;

            var ele2 = document.getElementsByClassName("enabletable" + ind);
            for (var j = 0; j < ele2.length; j++) {
                ele2[j].style['pointer-events'] = "none";
                ele2[j].style.border = "0";
                ele2[j].style['-webkit-appearance'] = "none";
                ele2[j].style['-moz-appearance'] = "none";
            }

            var datatypeid = 2;
            if (data.ExamMonthYearId == null || data.ExamMonthYearId == undefined || data.ExamMonthYearId == "") {
                alert("Select Month and Year.");
                return;
            }
            if (data.AcademicYearId == null || data.AcademicYearId == undefined || data.AcademicYearId == "") {
                alert("Select Academic Year.");
                return;
            }
            if (data.ExamTypeId == null || data.ExamTypeId == undefined || data.ExamTypeId == "") {
                alert("Enter Exam.");
                return;
            }
            if (data.SessionLabel == undefined || data.SessionLabel == null || data.SessionLabel == "") {
                alert("Select Session");
                return;
            }
           
            if (data.StudentTypeId == null || data.StudentTypeId == undefined || data.StudentTypeId == "") {
                alert("Select Student Type");
                return;
            }
          
            var json = {
                "Id": data.Id, "ExamMonthYearId": parseInt(data.ExamMonthYearId), "AcademicYearId": parseInt(data.AcademicYearId), "ExamTypeId": parseInt(data.ExamTypeId),
                "SessionId": parseInt(data.SessionId), "StudentTypeId": parseInt(data.StudentTypeId)
            }

            var SetTimeTableMonthYearExamTypesSessions = PreExaminationService.SetTimeTableMonthYearExamTypes(datatypeid, json)
            SetTimeTableMonthYearExamTypesSessions.then(function (response) {
                try { var response = JSON.parse(response) } catch (err) { }
                if (response[0].ResponceCode == '200') {
                    alert(response[0].ResponceDescription);

                } else {
                    alert('Something Went Wrong')

                }
            },
                function (error) {
                    alert("something Went Wrong")


                });
        }



        $scope.Submit = function () {

            var datatypeid = 1

            if ($scope.monthyear == null || $scope.monthyear == undefined || $scope.monthyear == "") {
                alert("Select Month and Year.");
                return;
            }
            if ($scope.selAcademicYear == null || $scope.selAcademicYear == undefined || $scope.selAcademicYear == "") {
                alert("Select Academic Year.");
                return;
            }
            if ($scope.examtype == null || $scope.examtype == undefined || $scope.examtype == "") {
                alert("Enter Exam.");
                return;
            }
            if ($scope.selSession == undefined || $scope.selSession == null || $scope.selSession == "") {
                alert("Select Session");
                return;
            }

           
            if ($scope.SelStudentType == null || $scope.SelStudentType == undefined || $scope.SelStudentType == "") {
                alert("Select Student Type");
                return;
            }
          

            var json = {
                "Id": 0, "ExamMonthYearId": parseInt($scope.monthyear), "AcademicYearId": parseInt($scope.selAcademicYear), "ExamTypeId": parseInt($scope.examtype),
                "SessionId": parseInt($scope.selSession), "StudentTypeId": parseInt($scope.SelStudentType)
            }

            var SetTimeTableMonthYearExamTypesSessions = PreExaminationService.SetTimeTableMonthYearExamTypes(datatypeid, json)
            SetTimeTableMonthYearExamTypesSessions.then(function (response) {
                try { var response = JSON.parse(response) } catch (err) { }
                if (response[0].ResponceCode == '200') {
                    alert(response[0].ResponceDescription);
                } else {
                    alert('Something Went Wrong');

                }
            },
                function (error) {
                    alert("something Went Wrong");


                });
        }


    })
})