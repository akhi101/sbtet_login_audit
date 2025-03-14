﻿define(['app'], function (app) {
    app.controller("ExaminationHallDetailsController", function ($scope, $http, $localStorage, $state,  AppSettings, PreExaminationService) {
        //var authData = $localStorage.authorizationData;
        var authData = JSON.parse(sessionStorage.getItem('user'));

        $scope.CollegeCode = authData.College_Code
        $scope.ReportFound = false;
        $scope.Noreports = false;
        $scope.Adddata = false;
        $scope.GetMasterHallData = [];
        $scope.maxcolumns = [{ "Id": 1 }, { "Id": 2 }, { "Id": 3 }, { "Id": 4 }, { "Id": 5 }, { "Id": 6 }, { "Id": 7 }, { "Id": 8 }]
        $scope.maxrows = [{ "Id": 1 }, { "Id": 2 }, { "Id": 3 }, { "Id": 4 }, { "Id": 5 }, { "Id": 6 }, { "Id": 7 }, { "Id": 8 }, { "Id": 9 }, { "Id": 10 }, { "Id": 11 }, { "Id": 12 }, { "Id": 13 }, { "Id": 14 }, { "Id": 15 }, { "Id": 16 }]

        const $ctrl = this;
        $ctrl.$onInit = () => {         
            $scope.GetDetails();
        }       


        $scope.addData = function () {
            $scope.Adddata = true;
        }

        $scope.genseating = function () {
            $state.go("Dashboard.PreExamination.GenerateSeatingPlan");
        }


        $scope.logOut = function () {
            sessionStorage.loggedIn = "no";
            var GetUserLogout = SystemUserService.getUserLogout();
            alert('Logout Successfully');
            $state.go('index.WebsiteLogin');

        }


        $scope.GetDetails = function () {          
            $scope.GetMasterHallData = [];
            $scope.ReportFound = false;
            $scope.Noreports = false;

            var GetExaminationHallData = PreExaminationService.GetExaminationHallData($scope.CollegeCode);
            GetExaminationHallData.then(function (data) {
                try { var data = JSON.parse(data) } catch (err) { }
                if (data.Table.length > 0) {
                    $scope.ReportFound = true;
                    $scope.Noreports = false;
                    $scope.GetMasterHallData = data.Table;
                    for (var j = 1; j < data.Table.length + 1; j++) {
                        $scope['edit' + j] = true;
                    }
                } else {
                    $scope.ReportFound = false;
                    $scope.Noreports = true;
                }
            }, function (error) {
                    $scope.GetMasterHallData = [];
                $scope.ReportFound = false;
                $scope.Noreports = true;
            });


        }

        var authData = JSON.parse(sessionStorage.getItem('user'));
        $scope.userType = authData.SystemUserTypeId;
        if ($scope.userType == 1 || $scope.userType == 3) {
            alert("UnAuthorized Access")
            $state.go('Dashboard')
        }


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
            $scope.Jsonarr = [];
            $scope['edit' + ind] = true;

            var ele2 = document.getElementsByClassName("enabletable" + ind);
            for (var j = 0; j < ele2.length; j++) {
                ele2[j].style['pointer-events'] = "none";
                ele2[j].style.border = "0";
                ele2[j].style['-webkit-appearance'] = "none";
                ele2[j].style['-moz-appearance'] = "none";
            }

            var datatypeid = 2;

            if (data.ExamHall == null || data.ExamHall == undefined || data.ExamHall == "") {
                alert("Enter Examinationn Hall Name.");
                return;
            }
            if (data.Rows == null || data.Rows == undefined || data.Rows == "" || data.Rows == '0') {
                alert("Enter number of rows in Examination Hall.");
                return;
            }
            if (isNaN(data.Rows)) {
                alert("number of rows in Examination Hall Entered is not valid.");
                return;
            }
            if (data.Columns == null || data.Columns == undefined || data.Columns == "" || data.Columns == '0') {
                alert("Enter number of rows in Examination Hall.");
                return;
            }
            if (isNaN(data.Columns)) {
                alert("number of Columns in Examination Hall Entered is not valid.");
                return;
            }

            //var json = {
            //    "Id": data.Id.toString(), "ExamHall": data.ExamHall.toString(), "Rows": parseInt(data.Rows).toString(), "Columns": parseInt(data.Columns).toString(), "NoOfStudentsPerBeanch": "0", "IsActive": "1"
            //}
            $scope.Jsonarr.push({ "Id": data.Id.toString(), "ExamHall": data.ExamHall.toString(), "Rows": parseInt(data.Rows).toString(), "Columns": parseInt(data.Columns).toString(), "NoOfStudentsPerBeanch": "0", "IsActive": "1" })

            //var parmobj = { "datatypeid": datatypeid, "CollegeCode": $scope.CollegeCode, "Json": json }          

            var SetExaminationHallData = PreExaminationService.SetExaminationHallData(datatypeid.toString(), $scope.CollegeCode.toString(), JSON.stringify($scope.Jsonarr))
            SetExaminationHallData.then(function (response) {
                // Check if the response is a JSON string
                if (typeof response !== "string") {
                    response = String(response);  // Convert to string
                }

                response = response.trim();  // Now trim() will work


                if (!response.startsWith("{")) {
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
                            $scope.LoadImg = false;
                        }
                    }
                }
                else {

                    var response = JSON.parse(response);
                    try {
                        var response = JSON.parse(response);
                    }
                    catch
                    {

                    }

                    if (response.Table[0].ResponceCode == '200') {
                        alert(response.Table[0].ResponceDescription);

                    } else {
                        alert('Something Went Wrong')

                    }

                }

            },
                function (error) {
                    alert("something Went Wrong")


                });
        }



        $scope.Submit = function () {
            $scope.Jsonarr = [];
            var datatypeid = 1

            if ($scope.ExaminationHall == null || $scope.ExaminationHall == undefined || $scope.ExaminationHall == "") {
                alert("Enter Examinationn Hall Name.");
                return;
            }
            if ($scope.HallRows == null || $scope.HallRows == undefined || $scope.HallRows == "" || $scope.HallRows =='0') {
                alert("Enter number of rows in Examination Hall.");
                return;
            }
            if (isNaN($scope.HallRows)) {
                alert("number of rows in Examination Hall Entered is not valid.");
                return;
            }
            if ($scope.HallColumns == null || $scope.HallColumns == undefined || $scope.HallColumns == "" || $scope.HallColumns == '0') {
                alert("Enter number of rows in Examination Hall.");
                return;
            }
            if (isNaN($scope.HallColumns)) {
                alert("number of Columns in Examination Hall Entered is not valid.");
                return;
            }

            $scope.Jsonarr.push({ "Id": "0", "ExamHall": $scope.ExaminationHall.toString(), "Rows": parseInt($scope.HallRows).toString(), "Columns": parseInt($scope.HallColumns).toString(), "NoOfStudentsPerBeanch": "0", "IsActive": "1" })

            //var Json = {
            //    "Id": "0", "ExamHall": $scope.ExaminationHall.toString(), "Rows": parseInt($scope.HallRows).toString(), "Columns": parseInt($scope.HallColumns).toString(), "NoOfStudentsPerBeanch": "0", "IsActive": "1"               
            //}

            //var parmobj = {
            //    "datatypeid": datatypeid.toString(),
            //    "CollegeCode": $scope.CollegeCode.toString(),
            //    "Json": json
            //}
            var SetExaminationHallData = PreExaminationService.SetExaminationHallData(datatypeid.toString(), $scope.CollegeCode.toString(), JSON.stringify($scope.Jsonarr))
            SetExaminationHallData.then(function (response) {
                // Check if the response is a JSON string
                if (typeof response !== "string") {
                    response = String(response);  // Convert to string
                }

                response = response.trim();  // Now trim() will work


                if (!response.startsWith("{")) {
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
                            $scope.LoadImg = false;
                        }
                    }
                }
                else {

                    var response = JSON.parse(response);
                    try {
                        var response = JSON.parse(response);
                    }
                    catch
                    {

                    }

                    if (response.Table[0].ResponceCode == '200') {
                        alert(response.Table[0].ResponceDescription);
                        $scope.GetDetails();
                    } else {
                        alert('Something Went Wrong');

                    }

                }

            },
                function (error) {
                    alert("something Went Wrong");


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