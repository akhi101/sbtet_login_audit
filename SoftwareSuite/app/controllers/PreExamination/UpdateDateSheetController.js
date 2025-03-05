define(['app'], function (app) {
    app.controller("UpdateDateSheetController", function ($scope, $http, $localStorage, $state, $stateParams, AppSettings,  StudentResultService, PreExaminationService) {

        //var authData = $localStorage.authorizationData;
        var authData = JSON.parse(sessionStorage.getItem('user'));

        $scope.UserName = authData.UserName
        $scope.ReportFound = false;
        $scope.Noreports = false;
        $scope.GetMasterschemeSem = [];
        $scope.PincodeMasterschemeSem = [];
        $scope.seminfo = [];
        $scope.schemeinfo = [];
        $scope.Branchinfo = [];
        $scope.Exams = [
            { id: 1, exam: "Mid 1" },
            { id: 2, exam: "Mid 2" },
            { id: 10, exam: "Semester" }
        ]; 
        const $ctrl = this;
        $ctrl.$onInit = () => {
            $scope.format = 'dd-MMMM-yyyy'
            $scope.GetAcademicData();
            //$scope.GetExamYearMonth();
        }

      
        $scope.open = function ($event, dt) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };
        $scope.GetExamYearMonth = function (selAcademicYear) {
            var ApprovalLists = PreExaminationService.GetExamMonthYearAcademicYear(selAcademicYear);
            ApprovalLists.then(function (response) {
                $scope.MonthAndYear = response.Table;

            }, function (error) {
                alert("error while loading Academic Year");

            });
        }

      

        var SCHEMESEMINFO = StudentResultService.GetSchemeDataForResults();
        SCHEMESEMINFO.then(function (data) {
            if (data.length > 0) {
                $scope.schemeinfo = data;
            }
        }, function (error) {
            alert("unable to load Schemes");
        });
        $scope.GetDates= function(){
        var SessionDate = PreExaminationService.GetExamSessionDates($scope.monthyear,$scope.selAcademicYear, $scope.SelStudentType, $scope.examtype,$scope.selscheme );
        SessionDate.then(function (data) {
            var data = JSON.parse(data)
            console.log(data)
            $scope.ExamDates = data.Table
            $scope.ExamSessions = data.Table1
        }, function (error) {
            alert("unable to load Session Dates");
        });
        }

        var BranchInfo = PreExaminationService.getAllBranches();
        BranchInfo.then(function (data) {
            if (data.Table.length > 0) {
                $scope.Branchinfo = data.Table;
            }
        }, function (error) {
            alert("unable to load Branches");
        });
      

        $scope.loadSemExamTypes = function (schemeid) {
            if ((schemeid == null)) {
                return false;
            }           
            var SemExamInfo = StudentResultService.GetExamTypeForResults(schemeid);
            SemExamInfo.then(function (data) {

                if (data.Table.length > 0) {
                    $scope.seminfo = data.Table;
                  
                }

            }, function (error) {
                alert("unable to load semester");
            });
        }

        $scope.logOut = function () {
            sessionStorage.loggedIn = "no";
            var GetUserLogout = SystemUserService.getUserLogout();
            alert('Logout Successfully');
            $state.go('index.WebsiteLogin');

        }
        $scope.GetAcademicData = function () {
            var GetMonthYear = PreExaminationService.GetMonthYear()
            GetMonthYear.then(function (response) {

                $scope.GetExamMonthYear = response.Table;


            },
                function (error) {
                    alert("data is not loaded");

                });
        }
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

        $scope.PublishTimetable = function () {
            if ($scope.monthyear1 == null || $scope.monthyear1 == undefined || $scope.monthyear1 == "") {
                alert("Select Month and Year.");
                return;
            }
            if ($scope.SelStudentType1 == null || $scope.SelStudentType1 == undefined || $scope.SelStudentType1 == "") {
                alert("Select student type.");
                return;
            }
          

            var PublishTimetabledata = PreExaminationService.PublishTimetable(parseInt($scope.monthyear1).toString(), parseInt($scope.SelStudentType1).toString());
            PublishTimetabledata.then(function (response) {

                // Check if the response is a JSON string
                if (typeof response !== "string") {
                    var data = String(response);  // Convert to string
                }

                data = data.trim();  // Now trim() will work


                if (!data.startsWith("[")) {
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
                    if (response[0].ResponseCode == '200') {
                        alert(response[0].ResponseDescription);

                    } else {
                        alert('Something Went Wrong')

                    }
                }

            }, function (error) {
              
            });
        }

        $scope.GetTimeTableDetails = function () {
            if ($scope.selAcademicYear == null || $scope.selAcademicYear == undefined || $scope.selAcademicYear == "") {
                alert("Select Academic Year.");
                return;
            }
           
            if ($scope.monthyear == null || $scope.monthyear == undefined || $scope.monthyear == "") {
                alert("Select Exam/Month Year.");
                return;
            }
            if ($scope.SelStudentType == null || $scope.SelStudentType == undefined || $scope.SelStudentType == "") {
                alert("Select Student Type.");
                return;
            }
            if ($scope.selscheme == null || $scope.selscheme == undefined || $scope.selscheme == "") {
                alert("Select Scheme.");
                return;
            }
            if ($scope.selsem == null || $scope.selsem == undefined || $scope.selsem == "") {
                alert("Select Semester.");
                return;
            }
            if ($scope.examtype == null || $scope.examtype == undefined || $scope.examtype == "") {
                alert("Select Exam.");
                return;
            }
            if ($scope.selbranch == null || $scope.selbranch == undefined || $scope.selbranch == "") {
                alert("Select Branch.");
                return;
            }
            $scope.GetMasterSessions = [];
            $scope.ReportFound = false;
            $scope.Noreports = false;

            var SchemeSem = PreExaminationService.GetTimeTableUpdateData($scope.selAcademicYear.toString(), $scope.monthyear.toString(), $scope.SelStudentType.toString(), $scope.selscheme.toString(), $scope.selsem.toString(), $scope.examtype.toString(), $scope.selbranch.toString());
            SchemeSem.then(function (data) {
                // Check if the response is a JSON string
                if (typeof data !== "string") {
                    data = String(data);  // Convert to string
                }

                data = data.trim();  // Now trim() will work


                if (!data.startsWith("[")) {
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
                    var data = JSON.parse(data);

                    if (data.length > 0) {
                        $scope.ReportFound = true;
                        $scope.Noreports = false;
                        $scope.GetMasterschemeSem = data;
                        for (var j = 1; j < data.length + 1; j++) {
                            $scope['edit' + j] = true;
                        }
                    } else {
                        $scope.ReportFound = false;
                        $scope.Noreports = true;
                    }



                }
               
                
            }, function (error) {
                $scope.GetMasterschemeSem = [];
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
       

        $scope.GetTimeTableDetailsByPCode = function () {
            if ($scope.selAcademicYear == null || $scope.selAcademicYear == undefined || $scope.selAcademicYear == "") {
                alert("Select Academic Year.");
                return;
            }

            if ($scope.monthyear == null || $scope.monthyear == undefined || $scope.monthyear == "") {
                alert("Select Exam/Month Year.");
                return;
            }
            if ($scope.SelStudentType == null || $scope.SelStudentType == undefined || $scope.SelStudentType == "") {
                alert("Select Student Type.");
                return;
            }
           
            if ($scope.examtype == null || $scope.examtype == undefined || $scope.examtype == "") {
                alert("Select Exam.");
                return;
            }
            if ($scope.PCode == null || $scope.PCode == undefined || $scope.PCode == "") {
                alert("Select PCode.");
                return;
            }
            $scope.GetMasterSessions = [];
            $scope.ReportFound1 = false;
            $scope.Noreports1 = false;

            var SchemeSem = PreExaminationService.GetTimeTableUpdateDataByPcode($scope.selAcademicYear.toString(), $scope.monthyear.toString(), $scope.SelStudentType.toString(), $scope.examtype.toString(), $scope.PCode.toString());
            SchemeSem.then(function (data) {
                // Check if the response is a JSON string
                if (typeof data !== "string") {
                    data = String(data);  // Convert to string
                }

                data = data.trim();  // Now trim() will work


                if (!data.startsWith("[")) {
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
                    var data = JSON.parse(data);
                    if (data.length > 0) {
                        $scope.ReportFound1 = true;
                        $scope.Noreports1 = false;
                        $scope.PincodeMasterschemeSem = data;
                        for (var j = 1; j < data.length + 1; j++) {
                            $scope['edit' + j] = true;
                        }
                    } else {
                        $scope.ReportFound1 = false;
                        $scope.Noreports1 = true;
                    }



                }
                
            }, function (error) {
                $scope.GetMasterschemeSem = [];
                $scope.ReportFound1 = false;
                $scope.Noreports1 = true;
            });


        }

        $scope.ClearData = function () {
            $scope.selAcademicYear = null;
            $scope.monthyear = null;
            $scope.SelStudentType = null;
            $scope.examtype = null;
            $scope.ExamDate = null;
            $scope.ExamSession = null;
            $scope.selscheme = null;
            $scope.PCode = "";
            $scope.selsem = null;
            $scope.selbranch = null;
            $scope.ReportFound = false;
            $scope.Noreports = false;
            $scope.ReportFound1 = false;
            $scope.Noreports1 = false;
            $scope.ReportFound2 = false;
            $scope.Noreports2 = false;
        }
        $scope.format='dd-MM-yyyy'
        $scope.GetTimeTableDetailsByDate = function () {
            if ($scope.selAcademicYear == null || $scope.selAcademicYear == undefined || $scope.selAcademicYear == "") {
                alert("Select Academic Year.");
                return;
            }

            if ($scope.monthyear == null || $scope.monthyear == undefined || $scope.monthyear == "") {
                alert("Select Exam/Month Year.");
                return;
            }
            if ($scope.SelStudentType == null || $scope.SelStudentType == undefined || $scope.SelStudentType == "") {
                alert("Select Student Type.");
                return;
            }

            if ($scope.examtype == null || $scope.examtype == undefined || $scope.examtype == "") {
                alert("Select Exam.");
                return;
            }
            if ($scope.ExamDate == null || $scope.ExamDate == undefined || $scope.ExamDate == "") {
                alert("Select Exam date.");
                return;
            }
            if ($scope.ExamSession == null || $scope.ExamSession == undefined || $scope.ExamSession == "") {
                alert("Select Exam Session.");
                return;
            }
            if ($scope.selscheme == null || $scope.selscheme == undefined || $scope.selscheme == "") {
                alert("Select Scheme.");
                return;
            }
            $scope.GetMasterSessions = [];
            $scope.ReportFound2 = false;
            $scope.Noreports2 = false;
            var SchemeSem = PreExaminationService.GetTimeTableUpdateDataByDate($scope.selAcademicYear.toString(), $scope.monthyear.toString(), $scope.SelStudentType.toString(), $scope.examtype.toString(), $scope.ExamDate.toString(), $scope.ExamSession.toString(), $scope.selscheme.toString());
            SchemeSem.then(function (data) {
                // Check if the response is a JSON string
                if (typeof data !== "string") {
                    data = String(data);  // Convert to string
                }

                data = data.trim();  // Now trim() will work


                if (!data.startsWith("[")) {
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
                    var data = JSON.parse(data);
                    if (data.length > 0) {
                        $scope.ReportFound2 = true;
                        $scope.Noreports2 = false;
                        $scope.GetMasterschemeSem = data;
                        for (var j = 1; j < data.length + 1; j++) {
                            $scope['edit' + j] = true;
                        }
                    } else {
                        $scope.ReportFound2 = false;
                        $scope.Noreports2 = true;
                    }
                }
                
            }, function (error) {
                $scope.GetMasterschemeSem = [];
                $scope.ReportFound2 = false;
                $scope.Noreports2 = true;
            });


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
            $scope['edit' + ind] = true;

            var ele2 = document.getElementsByClassName("enabletable" + ind);
            for (var j = 0; j < ele2.length; j++) {
                ele2[j].style['pointer-events'] = "none";
                ele2[j].style.border = "0";
                ele2[j].style['-webkit-appearance'] = "none";
                ele2[j].style['-moz-appearance'] = "none";
            }

            var datatypeid = 2;

            if (data.SubjectCode == null || data.SubjectCode == undefined || data.SubjectCode == "") {
                alert("Select Subject Code.");
                return;
            }
            if (data.ExamDate == undefined || data.ExamDate == null || data.ExamDate == "") {
                alert("Select ExamDate");
                return;
            }
            if (data.ExamTime == null || data.ExamTime == undefined || data.ExamTime == "") {
                alert("Enter ExamTime.");
                return;
            }
            if (data.ExamSession == null || data.ExamSession == undefined || data.ExamSession == "") {
                alert("Enter Time slot.");
                return;
            }
   
            var Remarks = data.Remarks == null || data.Remarks == undefined || data.Remarks == "" ?"": data.Remarks
            var ExamDate = data.ExamDate == undefined || data.ExamDate == null || data.ExamDate == "" ? "" : moment(data.ExamDate).format("YYYY-MM-DD");

            var json = {
                "Id": data.id, "SubjectCode": data.SubjectCode, "ExamDate": ExamDate, "ExamTime": data.ExamTime,
                "ExamSession": data.ExamSession, "Remarks": Remarks
            }         

            var SetTimeTableSessionSchemeSemesters = PreExaminationService.SetTimeTableUpdateData(datatypeid.toString(), json)
            SetTimeTableSessionSchemeSemesters.then(function (response) {
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



        //$scope.Submit = function () {

        //    var datatypeid = 1


        //    if ($scope.selAcademicYear == null || $scope.selAcademicYear == undefined || $scope.selAcademicYear == "") {
        //        alert("Select Academic Year.");
        //        return;
        //    }
        //    if ($scope.selSession == undefined || $scope.selSession == null || $scope.selSession == "") {
        //        alert("Select Session");
        //        return;
        //    }
        //    if ($scope.selscheme == null || $scope.selscheme == undefined || $scope.selscheme == "") {
        //        alert("select Scheme.");
        //        return;
        //    }
        //    if ($scope.WorkingDay == null || $scope.WorkingDay == undefined || $scope.WorkingDay == "") {
        //        alert("Enter Working Days.");
        //        return;
        //    }

        //    if ($scope.semarr.length <= 0) {
        //        alert('Select Semester.')
        //        return;
        //    }
        //    if ($scope.StartDate == null || $scope.StartDate == undefined || $scope.StartDate == "") {
        //        alert("Select Start Date");
        //        return;
        //    }
        //    if ($scope.EndDate == null || $scope.EndDate == undefined || $scope.EndDate == "") {
        //        alert("Select End Date");
        //        return;
        //    }


        //    var temparr = [];
        //    if ($scope.semarr.length > 0) {
        //        for (var i = 0; i < $scope.semarr.length; i++) {
        //            var obj = {
        //                "Id": 0, "AcademicYearId": parseInt($scope.selAcademicYear), "SessionId": parseInt($scope.selSession), "SchemeId": parseInt($scope.selscheme), "SemId": $scope.semarr[i].semid,
        //                "StartDate": moment($scope.StartDate).format("YYYY-MM-DD"), "EndDate": moment($scope.EndDate).format("YYYY-MM-DD"), "NofDays": parseInt($scope.WorkingDay)
        //            }
        //            temparr.push(obj);
        //        }
        //    }
        //    var SetTimeTableSessionSchemeSemesters = PreExaminationService.SetTimeTableSessionSchemeSemesters(datatypeid, temparr)
        //    SetTimeTableSessionSchemeSemesters.then(function (response) {
        //        try { var response = JSON.parse(response) } catch (err) { }
        //        if (response[0].ResponceCode == '200') {
        //            alert(response[0].ResponceDescription);

        //        } else {
        //            alert('Something Went Wrong')

        //        }
        //    },
        //        function (error) {
        //            alert("something Went Wrong")


        //        });
        //}

        $scope.GetDates = function () {
            var SessionDate = PreExaminationService.GetExamSessionDates($scope.monthyear, $scope.selAcademicYear, $scope.SelStudentType, $scope.examtype, $scope.selscheme);
            SessionDate.then(function (data) {
                var data = JSON.parse(data)
                console.log(data)
                $scope.ExamDates = data.Table
                $scope.ExamSessions = data.Table1
            }, function (error) {
                alert("unable to load Session Dates");
            });
        }


        $scope.getpdfTimeTableData = function () {
            if ($scope.selAcademicYear1 == null || $scope.selAcademicYear1 == undefined || $scope.selAcademicYear1 == "") {
                alert("Select Academic Year.");
                return;
            }

            if ($scope.monthyear1 == null || $scope.monthyear1 == undefined || $scope.monthyear1 == "") {
                alert("Select Month and Year.");
                return;
            }
            if ($scope.SelStudentType1 == null || $scope.SelStudentType1 == undefined || $scope.SelStudentType1 == "") {
                alert("Select student type.");
                return;
            }
            if ($scope.selscheme1 == null || $scope.selscheme1 == undefined || $scope.selscheme1 == "") {
                alert("select Scheme.");
                return;
            }
            if ($scope.examtype1 == null || $scope.examtype1 == undefined || $scope.examtype1 == "") {
                alert("Select exam type");
                return;
            }
            var DataTypeId = 1;
            $scope.LoadImg = true;
            $scope.gentmetbl = true;
            var getpdfTimeTableData = PreExaminationService.TimeTablePdfAdmin(parseInt($scope.selAcademicYear1).toString(), parseInt($scope.monthyear1).toString(), parseInt($scope.SelStudentType1).toString(), parseInt($scope.examtype1).toString(), parseInt($scope.selscheme1).toString(), DataTypeId.toString());
            getpdfTimeTableData.then(function (data) {
                // Check if the response is a JSON string
                if (typeof data !== "string") {
                    data = String(data);  // Convert to string
                }

                data = data.trim();  // Now trim() will work


                if (!data.startsWith("[")) {
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
                } else {
                    $scope.gentmetbl = false;

                    if (data.length > 0) {
                        if (data.length > 4) {

                            $scope.LoadImg = false;
                            $scope.Result = true;
                            var location = '/Reports/' + data + '.pdf';

                            var url = window.location.origin + location;

                            window.open(url);

                        } else {
                            $scope.LoadImg = false;
                            alert("Timetable not Present");
                        }
                    } else {
                        $scope.LoadImg = false;
                        alert("Timetable not Present");
                    }
                    //$scope.ResultNotFound = false;
                    //$scope.ResultFound = false;
                    $scope.LoadImg = false;

                }
                

            }, function (error) {
                $scope.gentmetbl = false;
                $scope.ResultNotFound = true;
                $scope.Result = false;
                $scope.LoadImg = false;
            });

        }

       
        $scope.exportTimetableToExcel = function (tableid) {
            if ($scope.selAcademicYear1 == null || $scope.selAcademicYear1 == undefined || $scope.selAcademicYear1 == "") {
                alert("Select Academic Year.");
                return;
            }
          
            if ($scope.monthyear1 == null || $scope.monthyear1 == undefined || $scope.monthyear1 == "") {
                alert("Select Month and Year.");
                return;
            }
            if ($scope.SelStudentType1 == null || $scope.SelStudentType1 == undefined || $scope.SelStudentType1 == "") {
                alert("Select student type.");
                return;
            }
            if ($scope.selscheme1 == null || $scope.selscheme1== undefined || $scope.selscheme1 == "") {
                alert("select Scheme.");
                return;
            }
            if ($scope.examtype1 == null || $scope.examtype1 == undefined || $scope.examtype1 == "") {
                alert("Select exam type");
                return;
            }
            var DataTypeId = 2
           
            $scope.gentmetbl = true;
            var getpdfTimeTableData = PreExaminationService.TimeTableXlsxAdmin(parseInt($scope.selAcademicYear1).toString(), parseInt($scope.monthyear1).toString(), parseInt($scope.SelStudentType1).toString(), parseInt($scope.examtype1).toString(), parseInt($scope.selscheme1).toString(), DataTypeId.toString());
            getpdfTimeTableData.then(function (data) {
                // Ensure data is a string
                if (typeof data !== "string") {
                    data = String(data);
                }

                data = data.trim(); // Remove spaces
                if (data.startsWith("/")) {
                    $scope.gentmetbl = false;

                    if (data.length > 0) {
                        if (data.length > 4) {
                            $scope.Result = true;
                            var location = data;
                            window.location.href = location;

                        } else {
                            alert("Timetable not Present");
                        }
                    } else {
                        alert("Timetable not Present");
                    }
                    //$scope.ResultNotFound = false;
                    //$scope.ResultFound = false;
                    $scope.LoadImg = false;
                    
                }




                
                else {
                    // Check if the response is a JSON string

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
               


            }, function (error) {
                $scope.gentmetbl = false;
                $scope.ResultNotFound = true;
                $scope.Result = false;
                $scope.LoadImg = false;
            });
            //var exportHref = Excel.tableToExcel(tableid, 'TimeTable');
            //$timeout(function () {
            //    var a = document.createElement('a');
            //    a.href = exportHref;
            //    a.download = "TimeTable.xls";
            //    document.body.appendChild(a);
            //    a.click();
            //    a.remove();
            //}, 100);
        }

        $scope.exportTimetableEdepToExcel = function (tableid) {
            if ($scope.selAcademicYear1 == null || $scope.selAcademicYear1 == undefined || $scope.selAcademicYear1 == "") {
                alert("Select Academic Year.");
                return;
            }

            if ($scope.monthyear1 == null || $scope.monthyear1 == undefined || $scope.monthyear1 == "") {
                alert("Select Month and Year.");
                return;
            }
            if ($scope.SelStudentType1 == null || $scope.SelStudentType1 == undefined || $scope.SelStudentType1 == "") {
                alert("Select student type.");
                return;
            }
            if ($scope.selscheme1 == null || $scope.selscheme1 == undefined || $scope.selscheme1 == "") {
                alert("select Scheme.");
                return;
            }
            if ($scope.examtype1 == null || $scope.examtype1 == undefined || $scope.examtype1 == "") {
                alert("Select exam type");
                return;
            }

            var DataTypeId = 3
            $scope.gentmetbl = true;
            var getpdfTimeTableData = PreExaminationService.TimeTableEdepXlsx(parseInt($scope.selAcademicYear1).toString(), parseInt($scope.monthyear1).toString(), parseInt($scope.SelStudentType1).toString(), parseInt($scope.examtype1).toString(), parseInt($scope.selscheme1).toString(), DataTypeId.toString());
            getpdfTimeTableData.then(function (data) {
                // Ensure data is a string
                if (typeof data !== "string") {
                    data = String(data);
                }

                data = data.trim(); // Remove spaces
                if (data.startsWith("/")) {
                    $scope.gentmetbl = false;
                    if (data.length > 0) {
                        if (data.length > 4) {

                            var location = data;
                            window.location.href = location;

                        } else {
                            alert("Timetable not Present");
                        }
                    } else {
                        alert("Timetable not Present");
                    }
                    //$scope.ResultNotFound = false;
                    //$scope.ResultFound = false;
                    $scope.LoadImg = false;

                }

                else {
                    // Check if the response is a JSON string

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

            }, function (error) {
                $scope.gentmetbl = false;
                $scope.ResultNotFound = true;
                $scope.ResultFound = false;
                $scope.LoadImg = false;
            });
            //var exportHref = Excel.tableToExcel(tableid, 'TimeTable');
            //$timeout(function () {
            //    var a = document.createElement('a');
            //    a.href = exportHref;
            //    a.download = "TimeTable.xls";
            //    document.body.appendChild(a);
            //    a.click();
            //    a.remove();
            //}, 100);
        }
    })
})