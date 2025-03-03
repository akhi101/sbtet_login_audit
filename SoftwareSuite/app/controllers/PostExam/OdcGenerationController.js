﻿define(['app'], function (app) {
    app.controller("OdcGenerationController", function ($scope, $http, $localStorage, $state, $location, $window, $stateParams, AppSettings, PreExaminationService) {

        //var authData = $localStorage.authorizationData;
        var authData = JSON.parse(sessionStorage.getItem('user'));
        $scope.userType = authData.SystemUserTypeId;
        if ($scope.userType == 2 || $scope.userType == 3) {
            alert("UnAuthorized Access")
            $state.go('Dashboard')
        }

        //console.log(authData)
        $scope.userName = authData.UserName
        //var Schemes = PreExaminationService.GetScheme();
        //Schemes.then(function (response) {
        //    if (response.Table.length > 0) {
        //        $scope.getSchemes = response.Table;

        //    } else {
        //        $scope.getSchemes = [];
        //        alert("No Schemes found.");
        //    }
        //},
        // function (error) {
        //     alert("error while loading Schemes");
        //     console.log(error);
        // });
        
        var ExamYearMonths = PreExaminationService.getExamYearMonths();
        ExamYearMonths.then(function (response) {
            if (response.Table.length > 0) {
                $scope.getExamMonthYears = response.Table;
                
            } else {
                $scope.getExamMonthYears = [];
                alert("No Exam Months Years found.");
            }
        },
         function (error) {
             alert("error while loading Exam Month Years");
             console.log(error);
            });

        

        var Branches = PreExaminationService.getAllBranches();
        Branches.then(function (response) {
            if (response.Table.length > 0) {
                $scope.getAllBranches = response.Table;

            } else {
                $scope.getAllBranches = [];
                alert("No Branchs found.");
            }
        },
            function (error) {
                alert("error while loading Exam Month Years");
                console.log(error);
            });

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


        var authData = JSON.parse(sessionStorage.getItem('user'));
        $scope.userType = authData.SystemUserTypeId;
        if ($scope.userType != 1) {
            alert("UnAuthorized Access")
            $state.go('Dashboard')
        }

        $scope.logOut = function () {
            sessionStorage.loggedIn = "no";
            var GetUserLogout = SystemUserService.getUserLogout();
            alert('Logout Successfully');
            $state.go('index.WebsiteLogin');

        }
        $scope.GetOdcDetailsByPin = function () {
            $scope.loading = true;
            $scope.DataFound = false;
            $scope.NoData = false;
            var OdcDetails = PreExaminationService.GetOdcDataByPin($scope.ODCPin);
            OdcDetails.then(function (resp) {
                // Check if the response is a JSON string
                if (typeof resp === "string") {
                    var res1 = JSON.parse(resp);
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

                    if (resp.Table[0].ResponceCode == '200') {
                        $scope.OdcData = resp.Table1[0];
                        //$scope.NAME = $scope.OdcData[0].NAME
                        //console.log($scope.OdcData[0].NAME)
                        $scope.loading = false;
                        $scope.DataFound = true;
                        $scope.NoData = false;
                        for (var j = 1; j < resp.Table1.length + 1; j++) {
                            $scope['edit' + j] = true;
                        }
                    } else {
                        $scope.OdcData = [];
                        alert("No Details Found.");
                        $scope.loading = false;
                        $scope.DataFound = false;
                        $scope.NoData = true;
                    }



                }

            },
             function (error) {
                 alert("error while loading Data");
                 console.log(error);
                 $scope.loading = false;
                 $scope.DataFound = false;
                 $scope.NoData = true;
             });



        }



        $scope.Updatesemesterdat = function (data, ind) {
            //alert($scope.NAME)
            $scope['edit' + ind] = true;

            var ele2 = document.getElementsByClassName("enabletable" + ind);
            for (var j = 0; j < ele2.length; j++) {
                ele2[j].style['pointer-events'] = "none";
                ele2[j].style.border = "0";
                ele2[j].style['-webkit-appearance'] = "none";
                ele2[j].style['-moz-appearance'] = "none";
            }
            //console.log(data, $scope.OdcData[0].NAME)
            var OdcDetails = PreExaminationService.UpdateOdcDataByPin($scope.OdcData.SNO, $scope.userName, $scope.OdcData.NAME, $scope.OdcData.SEX, $scope.OdcData.FNAME, $scope.OdcData.CEN, $scope.OdcData.CEN_NAME, $scope.OdcData.CEN_ADDRESS, $scope.OdcData.PIN, $scope.OdcData.COURSE, $scope.OdcData.BR, $scope.OdcData.MAX_MARKS_1YR, $scope.OdcData.TOTAL1, $scope.OdcData.TOTAL1_25, $scope.OdcData.MAX_MARKS_3SEM, $scope.OdcData.TOTAL3S, $scope.OdcData.MAX_MARKS_4SEM, $scope.OdcData.TOTAL4S,
                $scope.OdcData.MAX_MARKS_5SEM, $scope.OdcData.TOTAL5S, $scope.OdcData.MAX_MARKS_6SEM, $scope.OdcData.TOTAL6S, $scope.OdcData.MAX_MARKS_7SEM, $scope.OdcData.TOTAL7S, $scope.OdcData.GRAND_TOTAL, $scope.OdcData.PER, $scope.OdcData.scheme, $scope.OdcData.MAX_MARKS_1SEM, $scope.OdcData.TOTAL1S, $scope.OdcData.TOTAL1S_25, $scope.OdcData.MAX_MARKS_2SEM, $scope.OdcData.TOTAL2S, $scope.OdcData.TOTAL2S_25, $scope.OdcData.MONTH_YEAR== null?null: $scope.OdcData.MONTH_YEAR.toUpperCase())
            OdcDetails.then(function (response) {
                try { var response = JSON.parse(response) } catch (err) { }
                if (response.Table[0].ResponceCode == '200') {
                    alert(response.Table[0].ResponceDescription);

                } else {
                    alert('Something Went Wrong')

                }
            },
                function (error) {
                    alert("something Went Wrong")


                });
        }
        //SNO, NAME, SEX, FNAME, CEN, CEN_NAME, PIN, MAX_MARKS_1YR, TOTAL1, TOTAL1_25, MAX_MARKS_3SEM, TOTAL3S, MAX_MARKS_4SEM, TOTAL4S,
        //   MAX_MARKS_5SEM, TOTAL5S, MAX_MARKS_6SEM, TOTAL6S, MAX_MARKS_7SEM, TOTAL7S, GRAND_TOTAL, PER, scheme, MAX_MARKS_1SEM, TOTAL1S, TOTAL1S_25, MAX_MARKS_2SEM, TOTAL2S, TOTAL2S_25

        //var ExamYearMonths = PreExaminationService.getExamYearMonths();
        //ExamYearMonths.then(function (response) {
        //    if (response.Table.length > 0) {
        //        $scope.getExamMonthYears = response.Table;

        //    } else {
        //        $scope.getExamMonthYears = [];
        //        alert("No Exam Month Years found.");
        //    }
        //},
        // function (error) {
        //     alert("error while loading Exam Month Years");
        //     console.log(error);
        // });

        $scope.GenerateOdcByPin = function () {
            $scope.loading = true;
            $scope.Data = false;
            $scope.Noresult = false;
            $scope.Error1 = false;
            //if ($scope.ExamMonthYear == null || $scope.ExamMonthYear == '' || $scope.ExamMonthYear == undefined) {
            //    alert('Please Select Exam Month Year')
            //    return
            //}           
            var loadData2 = PreExaminationService.GenerateOdcDataByPin($scope.Pin)
            loadData2.then(function (response) {
                // Check if the response is a JSON string
                if (typeof response === "string" && response !="Cannot find table 0.") {
                    var res1 = JSON.parse(res);
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

                    if (response[0].ResponceCode == '200') {
                        $scope.loading = false;
                        var msg = response[0].ResponceDescription;
                        var Pin = response[0].Pin;
                        var value = msg + ' ' + 'for' + ' ' + 'Pin : ' + $scope.Pin
                        alert(value)
                        var location = response[0].file;
                        window.location.href = location;
                        $scope.Error1 = false;
                        $scope.Noresult = false;
                    } else if (response[0].ResponceCode == '400') {
                        $scope.loading = false;
                        $scope.Data = false;
                        $scope.Noresult = false;
                        $scope.Error1 = true;
                        $scope.ErrMsg1 = response[0].ResponceDescription;
                        alert($scope.ErrMsg1)
                    } else {
                        $scope.loading = false;
                        $scope.Data = false
                        alert("No Data Found");
                        $scope.Noresult = true;
                        $scope.Error1 = false;

                    }



                }



                
                
            },
                function (error) {
                    $scope.loading = false;
                    $scope.Data = false;
                    $scope.Noresult = true;
                    $scope.Error = false;
                    alert("error while loading Semesters");
                    var err = JSON.parse(error);
                    console.log(err.Message);
                });
        }



        $scope.Submit = function () {
            $scope.loading = true;
            $scope.Data = true;
            $scope.NoOutput = false;
            $scope.Error = false;
            if ($scope.ExamMonthYear == null || $scope.ExamMonthYear == '' || $scope.ExamMonthYear == undefined) {
                alert('Please Select Exam Month Year')
                return
            }
            if ($scope.Day == null || $scope.Day == '' || $scope.Day == undefined) {
                alert('Please Enter Day')
                return
            }
            if ($scope.Month == null || $scope.Month == '' || $scope.Month == undefined) {
                alert('Please Enter Month')
                return
            }
            if ($scope.Year == null || $scope.Year == '' || $scope.Year == undefined) {
                alert('Please Enter Year')
                return
            }
            var loadData2 = PreExaminationService.GenerateOdcData($scope.ExamMonthYear, $scope.Day, $scope.Month, $scope.Year)
            loadData2.then(function (data) {
                // Check if the response is a JSON string
                if (typeof res === "string") {
                    var res1 = JSON.parse(data);
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

                    if (data.length > 4) {
                        console.log(window.location.href);
                        $scope.loading = false;
                        $scope.Data = true;
                        $scope.NoOutput = false;
                        $scope.Error = false;
                        var location = data;
                        window.location.href = location;

                    } else {
                        $scope.loading = false;
                        $scope.Data = false
                        $scope.ErrMsg = "No ODC Data Generated for the Selected Input."
                        $scope.NoOutput = true;
                        $scope.Error = false;
                        alert("No ODC Data Generated for the Selected Input.");
                    }



                }




                
                //if (response.Table[0].ResponceCode == '200') {                
                //    $scope.loading = false;
                //    $scope.Data = true;
                //    $scope.Noresult = false;
                //    $scope.Error = false;
                //} else if (response.Table[0].ResponceCode == '400') {
                //    $scope.loading = false;
                //    $scope.Data = false;
                //    $scope.Noresult = false;
                //    $scope.Error = true;
                //    $scope.ErrMsg = response.Table[0].ResponceDescription;
                //} else{               
                //    $scope.loading = false;
                //    $scope.Data = false
                //    alert("No Data Found");
                //    $scope.Noresult = true;
                //    $scope.Error = false;
                   
                //}
            },
                function (error) {
                    $scope.loading = false;
                    $scope.Data = false;
                    $scope.Noresult = true;
                    $scope.Error = false;
                    alert("error while loading Semesters");
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

    })
})
