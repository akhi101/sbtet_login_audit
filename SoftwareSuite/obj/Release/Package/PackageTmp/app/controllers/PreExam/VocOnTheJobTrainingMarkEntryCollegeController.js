﻿(function () {
    'use strict';
    angular.module('app')
        .controller('VocOnTheJobTrainingMarkEntryCollegeController',
        function ($rootScope, $state, $scope, basicCourseService, basicExamService, examTimeTableService, otherMarkEnrtyService, basicZoneService, basicBranchService, basicDistrictsService, basicCollegeService, AppSettings) {
            $scope.otherMarkEnrtyDetail = {};
            $scope.studentInfoList = [];
            $scope.postotherMarkEnrty = {};
            $scope.postotherMarkEnrty.studentInfoList = [];
            $scope.postotherMarkEnrty.otherMarkEnrtyDetails = {};
            $scope.updatedStudentInfoList = [];
            $scope.saveStudentInfoList = [];
            $scope.LoadImg = false;
            $scope.isCorrect = false;
            $scope.CollegeID = AppSettings.CollegeID;
            $scope.CollegeHide = false;
            $scope.HideMarks = true;
            $scope.ExamDisable = true;
            $scope.StudListLength = 0;
            $scope.PendingCount = 0;
            $scope.OldMarksFlag = true;

            var ProcRegex = /^[0-9\aAmMnN]+$/;
            var NumRegex = /^[0-9]+$/;
            var TextRegex = /^[a-zA-Z\ ]+$/;
            $scope.SetZeroTh = false;
            $scope.SetZeroPr = false;
            $scope.EntryChange = false;
            $scope.SaveDisable = true;
            $scope.AddNewDisable = false;
            $scope.SaveLoadImg = false;
            $scope.ExaminerSelected = false;
            $scope.ScheduleFlag = true;
            $scope.ExmSubCode = "";
            $scope.ShowMFInfo = false;
            $scope.ShowSchInfo = false;



            $scope.init = function () {
                $scope.CheckBrowser();
                getCollegeInfo();
                getExaminerDetails();
                getAllBasicCourse();
                getAllBasicDistrict();
                if ($scope.CollegeID != undefined && $scope.CollegeID != "" && $scope.CollegeID != "0") {
                    getDistrictByCollegeID();
                    $scope.ColClass = "";
                    $scope.CollegeHide = true;
                    $scope.otherMarkEnrtyDetail.CollegeID = $scope.CollegeID;
                }
                else {
                    $scope.ColClass = "col-md-offset-2";
                    $scope.CollegeHide = false;
                }
            };

            $scope.CheckBrowser = function () {
                var ua = navigator.userAgent;
                /* MSIE used to detect old browsers and Trident used to newer ones*/
                var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
                if (is_ie) {
                    Number.isInteger = Number.isInteger || function (value) {
                        return typeof value === 'number' &&
                            isFinite(value) &&
                            Math.floor(value) === value;
                    };
                } else {
                }
            }

            $scope.EnableSaveButton = function () {
                if ($scope.otherMarkEnrtyDetail.UnderTaking == true) {
                    $scope.SaveDisable = false;
                }
                else {
                    $scope.SaveDisable = true;
                }
            }

            var getScheduleDetails = function () {
                otherMarkEnrtyService.getScheduleDetails($scope.CollegeID, $scope.otherMarkEnrtyDetail.ExmSubID).then(function (results) {
                    if (results.length > 0) {
                        if (results[0].ErrMsg != "" && results[0].ErrMsg != null) {
                            //alert(results[0].ErrMsg);
                            if (results[0].StartDateTime == '0001-01-01T00:00:00' || results[0].EndDateTime == '0001-01-01T00:00:00') {
                                results[0].StartDateTime = "";
                                results[0].EndDateTime = "";
                            }
                            $scope.ScheduleDetails = results;
                            $scope.ScheduleFlag = false;
                            if (results[0].StartDateTime != "" && results[0].StartDateTime != undefined && results[0].EndDateTime != "" && results[0].EndDateTime != undefined) {
                                $scope.ShowSchInfo = true;
                            }
                        }
                        else {
                            $scope.ScheduleDetails = results;
                            $scope.ScheduleFlag = true;
                            $scope.ShowSchInfo = true;
                        }
                    }
                    else {

                        alert("Mark Entry Schedule is Not Available.");
                  }
                });
            };
            var getCollegeInfo = function () {
                otherMarkEnrtyService.getCollegeInfo(AppSettings.CollegeID).then(function (results) {
                    $scope.collegeInfo = results;
                    $scope.CurrYear = new Date().getFullYear();
                });
            };
            var getAllBasicCourse = function () {
                basicCourseService.getAllBasicCourseByCourseID(2).then(function (results) {
                    $scope.basicCourses = results;
                    $scope.otherMarkEnrtyDetail.CourseID = results[0].CourseID;
                });
            };
            var getAllBasicDistrict = function () {
                basicDistrictsService.getBasicDistrictsList().then(function (results) {
                    $scope.basicDistricts = results;
                });
            };
            var getDistrictByCollegeID = function () {
                otherMarkEnrtyService.getDistrictDetails($scope.CollegeID).then(function (results) {
                    $scope.otherMarkEnrtyDetail.DistrictID = results[0].DistrictID;
                });
            };

            //if ($scope.otherMarkEnrtyDetail.MainGrpID == undefined || $scope.otherMarkEnrtyDetail.MainGrpID == "") {
            //    $scope.otherMarkEnrtyDetail.MainGrpID = 0;
            //    $scope.MainGroupName = "";
            //}
            //else {
            //    $scope.MainGroupName = $scope.otherMarkEnrtyDetail.MainGrpName;
            //}

            var getExaminerDetails = function () {
                otherMarkEnrtyService.getExaminerDetails($scope.CollegeID).then(function (results) {
                    if (results.length > 0) {
                        if (results[0].ErrMsg != "" && results[0].ErrMsg != null) {
                            alert(results[0].ErrMsg);
                        }
                        else {
                            $scope.ExaminerDetails = results;
                        }
                    }
                    else {
                        alert("Examiner details not found.");
                    }
                });
            };
            var getHTNoDetails = function (HTNO, index) {
                otherMarkEnrtyService.getPostHTNoDetailsForOntheJobTraining(HTNO, $scope.otherMarkEnrtyDetail.ExmSubID, AppSettings.ExamInstID).then(function (results) {
                    if (results.length > 0) {
                        if (results[0].HTNO != 0) {
                            alert("Roll No Already Exist In Other College.");
                            $scope.studentDetailList[index].HTNO = "";
                            document.getElementById("HTNO_" + index).focus();
                        }
                        else {
                        }
                    }
                    else {
                        alert("HT details not found.");
                    }
                });
            }; 
            $scope.$watch('otherMarkEnrtyDetail.CourseID', function () {
                $scope.studentDetailList = [];
                $scope.otherMarkEnrtyDetail.ExmSubID = undefined;
                $scope.otherMarkEnrtyDetail.ExaminerID = undefined;
                if ($scope.otherMarkEnrtyDetail.CourseID !== undefined) {
                    basicExamService.getBasicExamListByCourseID($scope.otherMarkEnrtyDetail.CourseID).then(function (results) {
                        $scope.basicExams = results;
                        //$scope.otherMarkEnrtyDetail.ExamID = results[0].ExamID;
                        $scope.otherMarkEnrtyDetail.ExamInstID = AppSettings.ExamInstID; // Current ExamInstID
                        otherMarkEnrtyService.GetOnTheJobTrngExamSubListForMarkEntry($scope.otherMarkEnrtyDetail.ExamID).then(function (results) {
                            $scope.examTimeTableSubjects = results;
                        });
                    });
                }
            });

            $scope.$watch('otherMarkEnrtyDetail.ExamID', function () {
                $scope.studentDetailList = [];
                if ($scope.otherMarkEnrtyDetail.ExamID !== undefined) {
                    $scope.otherMarkEnrtyDetail.ExamInstID = AppSettings.ExamInstID;
                    otherMarkEnrtyService.GetOnTheJobTrngExamSubListForMarkEntry($scope.otherMarkEnrtyDetail.ExamID).then(function (results) {
                        $scope.examTimeTableSubjects = results;
                        otherMarkEnrtyService.GetMainGroupListForOJTMarkEntry($scope.otherMarkEnrtyDetail.ExamID, AppSettings.CollegeID, AppSettings.ExamInstID).then(function (results) {
                            $scope.mainGropList = results;
                        });
                    });
                }
            });


            $scope.$watch('otherMarkEnrtyDetail.DistrictID', function () {
                if ($scope.otherMarkEnrtyDetail.DistrictID !== undefined) {
                    basicCollegeService.getCollegeListByDistrict($scope.otherMarkEnrtyDetail.DistrictID).then(function (results) {
                        $scope.basiccolleges = results;
                    });
                }
                });

            $scope.$watch('otherMarkEnrtyDetail.ExmSubID', function () {
                $scope.ShowMFInfo = false;
                $scope.ShowSchInfo = false;
                $scope.studentDetailList = [];
                $scope.otherMarkEnrtyDetail.ExaminerID = undefined;
                if ($scope.otherMarkEnrtyDetail.ExmSubID !== undefined) {
                    for (var i = 0; i < $scope.examTimeTableSubjects.length; i++) {
                        if ($scope.otherMarkEnrtyDetail.ExmSubID == $scope.examTimeTableSubjects[i].ExmSubID) {
                            $scope.ExmSubCode = $scope.examTimeTableSubjects[i].ExmSubCode;
                            $scope.ExmSubName = $scope.examTimeTableSubjects[i].ExmSubName;
                            break;
                        }
                    }
                    otherMarkEnrtyService.getMFNumberforOJT($scope.CollegeID, $scope.otherMarkEnrtyDetail.ExmSubID, $scope.otherMarkEnrtyDetail.CourseID, $scope.ExmSubCode, $scope.otherMarkEnrtyDetail.ExamID).then(function (results) {
                        $scope.MFNoDetails = results;
                        getScheduleDetails();
                        if ($scope.MFNoDetails.length > 0) {
                            $scope.ShowMFInfo = true;
                        }
                        if ($scope.studentDetailList[0].ExmSubID != $scope.otherMarkEnrtyDetail.ExmSubID) {
                            $scope.otherMarkEnrtyDetail.ExaminerID = undefined;
                            $scope.studentDetailList = [];
                            $scope.myDisable = {
                            }
                        }
                        else {
                        }
                    });
                }
            });


            $scope.$watch('otherMarkEnrtyDetail.MainGrpID', function () {
                if ($scope.otherMarkEnrtyDetail.MainGrpID !== undefined) {
                    for (var i = 0; i < $scope.mainGropList.length; i++) {
                        if ($scope.otherMarkEnrtyDetail.MainGrpID == $scope.mainGropList[i].MainGrpID) {
                            //$scope.MainGrpID = $scope.mainGropList[i].MainGrpID;
                            $scope.MainGroupNameForHead = $scope.mainGropList[i].MainGrpName;
                            break;
                        }
                    }
                }
            });

            $scope.HTNOChange = function (Index) {
                if (!NumRegex.test($scope.studentDetailList[Index].HTNO) || $scope.studentDetailList[Index].HTNO.length > 10) {
                    $scope.studentDetailList[Index].HTNO = $scope.studentDetailList[Index].HTNO.slice(0, -1);
                }
            }
            $scope.StudNameChange = function (Index) {
                if (!TextRegex.test($scope.studentDetailList[Index].StudName) || $scope.studentDetailList[Index].HTNO.length > 100) {
                    $scope.studentDetailList[Index].StudName = $scope.studentDetailList[Index].StudName.slice(0, -1);
                }
            }
            $scope.MarksChange = function (Index, MarksType) {
                if ($scope.otherMarkEnrtyDetail.ExaminerID == "" || $scope.otherMarkEnrtyDetail.ExaminerID == undefined) {
                    alert("Please select Examiner.");
                    window.scrollTo(0, 0);
                    if (MarksType == "Th") {
                        $scope.studentDetailList[Index].MarksTh = "";
                        $scope.studentDetailList[Index].TotalMarks = "";
                    }
                    else {
                        $scope.studentDetailList[Index].MarksPr = "";
                        $scope.studentDetailList[Index].TotalMarks = "";
                    }
                    document.getElementById("ExaminerDropdown").focus();
                    $scope.LoadImg = false;
                    $scope.isCorrect = false;
                    return;
                }
                if (MarksType == "Th") {
                    if (isNaN($scope.studentDetailList[Index].MarksTh)) {
                        $scope.studentDetailList[Index].MarksTh = $scope.studentDetailList[Index].MarksTh.toUpperCase();
                        if ($scope.OldMarksFlag == true) {
                            $scope.studentDetailList[Index].MarksTh = $scope.studentDetailList[Index].MarksTh.replace(/\d+/g, '');
                        }
                        else {
                            var numbers = $scope.studentDetailList[Index].MarksTh.match(/\d+/g);
                            if (numbers != null) {
                                $scope.studentDetailList[Index].MarksTh = $scope.studentDetailList[Index].MarksTh.match(/\d+/g).map(Number)[0];
                            }
                            if ($scope.studentDetailList[Index].MarksTh.toString().length > 1) {
                                $scope.studentDetailList[Index].MarksTh = $scope.studentDetailList[Index].MarksTh.slice(0, -1);
                            }
                        }
                    }
                    if (Number.isInteger(parseInt($scope.studentDetailList[Index].MarksTh)) && $scope.studentDetailList[Index].MarksTh.toString().length >= 3 && $scope.studentDetailList[Index].MarksTh.charAt(0) == "0") {
                        $scope.studentDetailList[Index].MarksTh = $scope.studentDetailList[Index].MarksTh.slice(1);
                    }
                    if (!ProcRegex.test($scope.studentDetailList[Index].MarksTh) || $scope.studentDetailList[Index].MarksTh.length > 3) {
                        $scope.studentDetailList[Index].MarksTh = $scope.studentDetailList[Index].MarksTh.slice(0, -1);
                    }
                    if ($scope.studentDetailList[Index].MarksTh == "0") {
                         $scope.studentDetailList[Index].SetZeroTh = true;
                        // Added For Display Zero in Total Marks
                       // $scope.studentDetailList[Index].TotalMarks = toWords($scope.studentDetailList[Index].MarksTh);
                        $scope.studentDetailList[Index].TotalMarks = "Zero";
                    }
                    if ($scope.studentDetailList[Index].SetZeroTh == true && $scope.studentDetailList[Index].MarksTh == "") {
                        $scope.studentDetailList[Index].SetZeroTh = false;
                    } 
                    if ($scope.studentDetailList[Index].MarksTh == "" || $scope.studentDetailList[Index].MarksTh == null) {
                        $scope.studentDetailList[Index].MarksTh = 0;
                    } 
                    if (parseInt($scope.studentDetailList[Index].MarksTh) > parseInt($scope.studentDetailList[Index].MaxMarksTh)) {
                        alert("Please enter Theory Marks between 0 and " + $scope.studentDetailList[Index].MaxMarksTh + " for HT No " + $scope.studentDetailList[Index].HTNO + ".");
                        $scope.studentDetailList[Index].MarksTh = 0;
                    }
                } 
                if (Number.isInteger(parseInt($scope.studentDetailList[Index].MarksTh))) {
                    $scope.OldMarksFlag = true;
                    //Commented for Display Marks in Word
                    //$scope.studentDetailList[Index].TotalMarks = parseInt($scope.studentDetailList[Index].MarksTh);
                    $scope.studentDetailList[Index].TotalMarks = toWords($scope.studentDetailList[Index].MarksTh);
                    if ($scope.studentDetailList[Index].MarksTh == 0) {
                        $scope.studentDetailList[Index].TotalMarks = "Zero";
                    }
                    $scope.studentDetailList[Index].StatusSubFlag = "P";
                } 
                else if (isNaN($scope.studentDetailList[Index].MarksTh)) { 
                        $scope.OldMarksFlag = false;
                        $scope.studentDetailList[Index].TotalMarks = $scope.studentDetailList[Index].MarksTh == "A" ? "Absent" : $scope.studentDetailList[Index].MarksTh == "M" ? "Malpractice" : $scope.studentDetailList[Index].MarksTh == "N" ? "Not Applicable" : "";
                        $scope.studentDetailList[Index].StatusSubFlag = $scope.studentDetailList[Index].MarksTh;
                } 
                if ($scope.studentDetailList[Index].MarksTh == 0 && ($scope.studentDetailList[Index].SetZeroTh == false || $scope.studentDetailList[Index].SetZeroTh == undefined)) {
                    $scope.studentDetailList[Index].MarksTh = "";
                }
                $scope.EntryChange = true;
                if ($scope.studentDetailList[Index].Checked == false) {
                    if ($scope.studentDetailList[Index].MarksTh.length > 0) {
                        $scope.PendingCount -= 1;
                        $scope.studentDetailList[Index].Checked = true;
                    }
                }
                else {
                    if ($scope.studentDetailList[Index].MarksTh == "") {
                        $scope.PendingCount += 1;
                        $scope.studentDetailList[Index].Checked = false;
                    }
                } 
                if (MarksType == "Th") {
                    if (Number.isInteger(parseInt($scope.studentDetailList[Index].MarksTh)) && $scope.studentDetailList[Index].MarksTh.toString().length == 1) {
                        $scope.studentDetailList[Index].MarksTh = "00" + $scope.studentDetailList[Index].MarksTh;
                    }
                    if (Number.isInteger(parseInt($scope.studentDetailList[Index].MarksTh)) && $scope.studentDetailList[Index].MarksTh.toString().length == 2) {
                        $scope.studentDetailList[Index].MarksTh = "0" + $scope.studentDetailList[Index].MarksTh;
                    }
                }
                if (Number.isInteger(parseInt($scope.studentDetailList[Index].TotalMarks)) && $scope.studentDetailList[Index].TotalMarks.toString().length == 1) {
                    if ($scope.studentDetailList[Index].MarksTh != "" && $scope.studentDetailList[Index].MarksTh != "") {
                        //Commented for Convert To words
                       // $scope.studentDetailList[Index].TotalMarks = "00" + $scope.studentDetailList[Index].TotalMarks;
                    }
                    else {
                        $scope.studentDetailList[Index].TotalMarks = "";
                    }
                }
                if (Number.isInteger(parseInt($scope.studentDetailList[Index].TotalMarks)) && $scope.studentDetailList[Index].TotalMarks.toString().length == 2) {
                    if ($scope.studentDetailList[Index].MarksTh != "" && $scope.studentDetailList[Index].MarksTh != "") {
                        //Commented for Convert To words
                       // $scope.studentDetailList[Index].TotalMarks = "0" + $scope.studentDetailList[Index].TotalMarks;
                    }
                    else {
                        //Commented for Convert To words
                        //$scope.studentDetailList[Index].TotalMarks = "";
                    }
                }
            };

            $scope.showStudentDetail = function () {
                if ($scope.otherMarkEnrtyDetail.CourseID == "" || $scope.otherMarkEnrtyDetail.CourseID == undefined || $scope.otherMarkEnrtyDetail.CourseID == "0") {
                    alert("Please Select Stream.");
                    return;
                }
                if ($scope.otherMarkEnrtyDetail.ExmSubID == "" || $scope.otherMarkEnrtyDetail.ExmSubID == undefined || $scope.otherMarkEnrtyDetail.ExmSubID == "0") {
                    alert("Please Select Subject.");
                    return;
                }
                if ($scope.otherMarkEnrtyDetail.MainGrpID == "" || $scope.otherMarkEnrtyDetail.MainGrpID == undefined || $scope.otherMarkEnrtyDetail.MainGrpID == "0") {
                    alert("Please Select Course.");
                    return;
                }
                if ($scope.otherMarkEnrtyStudentDetailForm.$valid && $scope.otherMarkEnrtyDetail.ExmSubID !== undefined && $scope.otherMarkEnrtyDetail.ExamID !== undefined && $scope.otherMarkEnrtyDetail.CollegeID != undefined && $scope.otherMarkEnrtyDetail.CourseID != undefined) {
                    $scope.PendingCount = 0;
                    $scope.LoadImg = true;
                    $scope.studentDetailList = [];
                    $scope.otherMarkEnrtyDetail.ExamInstID = AppSettings.ExamInstID;
                    $scope.otherMarkEnrtyDetail.CreLoginID = AppSettings.LoggedUserId;
                    $scope.otherMarkEnrtyDetail.CommnMainGrpID = $scope.otherMarkEnrtyDetail.CommnMainGrpID;

                    otherMarkEnrtyService.getStudentDetailsByExamSubjectForOntheJobTraining($scope.otherMarkEnrtyDetail).then(function (results) {
                        if (results.length > 0) {
                            if (results[0].ErrMsg != "" && results[0].ErrMsg != null) {
                                alert(results[0].ErrMsg);
                                $scope.LoadImg = false;
                                return;
                            }
                            else {
                                $scope.studentDetailList = results;
                                $scope.StudListLength = results.length;
                                $scope.LoadImg = false;
                                if ($scope.studentDetailList[0].ExaminerID == "" || $scope.studentDetailList[0].ExaminerID == undefined || $scope.studentDetailList[0].ExaminerID == "0") {
                                    for (var i = 0; i < $scope.studentDetailList.length; i++) {
                                        if ($scope.studentDetailList[i].ExaminerID != "" || $scope.studentDetailList[i].ExaminerID != 0) {
                                            $scope.studentDetailList[0].ExaminerID = $scope.studentDetailList[i].ExaminerID;
                                        }
                                    }
                                }
                                if ($scope.studentDetailList[0].ExaminerID != "" && $scope.studentDetailList[0].ExaminerID != undefined && $scope.studentDetailList[0].ExaminerID != "0") {
                                    $scope.otherMarkEnrtyDetail.ExaminerID = $scope.studentDetailList[0].ExaminerID;
                                    $scope.myDisable = {
                                        "pointer-events": "none",
                                        "cursor": "not - allowed"
                                    }
                                }
                                else {
                                    $scope.myDisable = {
                                    }
                                }
                                if ($scope.ScheduleFlag == false) {
                                    $scope.studentDetailList[0].ChkListFlag = 'V';
                                    $scope.myDisable = {
                                        "pointer-events": "none",
                                        "cursor": "not - allowed"
                                    }
                                }
                                $scope.HideDetails = (($scope.studentDetailList[0].ChkListFlag == 'V') ? true : false);
                                $scope.HideUndertaking = (($scope.studentDetailList[0].ChkListFlag == 'V') ? true : false);
                            }
                        } else {
                            alert("Record not found");
                            $scope.studentDetailList = [];
                            $scope.LoadImg = false;
                        }
                    });
                }
            }
            $scope.submitOtherMarkEnrtyDetail = function () {
                $scope.SaveLoadImg = true;
                if ($scope.otherMarkEnrtyDetail.ExaminerID == "" || $scope.otherMarkEnrtyDetail.ExaminerID == undefined) {
                    alert("Please select Examiner.");
                    window.scrollTo(0, 0);
                    $scope.LoadImg = false;
                    $scope.SaveLoadImg = false;
                    $scope.isCorrect = false;
                    return;
                }
                for (var i = 0; i < $scope.studentDetailList.length; i++) {
                    if ($scope.studentDetailList[i].HTNO.toString().replace(" ", "") == "" || $scope.studentDetailList[i].HTNO == undefined) {
                        alert("Please enter HT No for Sl No. " + (i + 1) + ".");
                        document.getElementById("HTNO_" + i).focus();
                        $scope.LoadImg = false;
                        $scope.SaveLoadImg = false;
                        return;
                    }
                    if ($scope.studentDetailList[i].StudName.toString().replace(" ", "") == "" || $scope.studentDetailList[i].StudName == undefined) {
                        alert("Please enter Student Name for HTNo " + $scope.studentDetailList[i].HTNO + ".");
                        document.getElementById("StudName_" + i).focus();
                        $scope.LoadImg = false;
                        $scope.SaveLoadImg = false;
                        return;
                    }
                    if ($scope.studentDetailList[i].MarksTh.toString().replace(" ", "") == "") {
                        alert("Please enter Theory marks for HTNo " + $scope.studentDetailList[i].HTNO + ".");
                        document.getElementById("MarksTh_" + i).focus();
                        $scope.LoadImg = false;
                        $scope.SaveLoadImg = false;
                        return;
                    }
                    //if ($scope.studentDetailList[i].MarksPr.toString().replace(" ", "") == "") {
                    //    alert("Please enter Practical marks for HTNo " + $scope.studentDetailList[i].HTNO + ".");
                    //    document.getElementById("MarksPr_" + i).focus();
                    //    $scope.LoadImg = false;
                    //    $scope.SaveLoadImg = false;
                    //    return;
                    //}
                }
                var _confirm = confirm("Once Submit you cannot edit. Are you confirm?");
                if (_confirm == true) {
                    $scope.postotherMarkEnrty = {};
                    $scope.postotherMarkEnrty.UpdateLoginID = AppSettings.LoggedUserId;
                    $scope.postotherMarkEnrty.RecordIDs = "";
                    for (var i = 0; i < $scope.studentDetailList.length; i++) {
                        $scope.postotherMarkEnrty.RecordIDs += $scope.studentDetailList[i].RecordID + ',';
                    }
                    $scope.postotherMarkEnrty.RecordIDs = $scope.postotherMarkEnrty.RecordIDs.slice(0, -1);

                    otherMarkEnrtyService.postOtherMarkVerificationOJT($scope.postotherMarkEnrty).then(function (results) {
                        if (results.IsSuccess) {
                            $scope.otherMarkEnrtyDetail = {};
                            //$scope.otherMarkEnrtyDetail.CourseID = "2";
                            $scope.studentDetailList = [];
                            $scope.updatedStudentInfoList = [];
                            $scope.saveStudentInfoList = [];
                            $scope.postotherMarkEnrty = {};
                            $scope.postotherMarkEnrty.studentInfoList = [];
                            $scope.postotherMarkEnrty.otherMarkEnrtyDetails = {};
                            alert(results.Message);
                            $scope.LoadImg = false;
                            $scope.SaveLoadImg = false;
                            if ($scope.CollegeID != undefined && $scope.CollegeID != "" && $scope.CollegeID != "0") {
                                $scope.otherMarkEnrtyDetail.CollegeID = $scope.CollegeID;
                            }
                        } else {
                            $scope.otherMarkEnrtyDetail = {};
                            //$scope.otherMarkEnrtyDetail.CourseID = "2";
                            $scope.studentDetailList = [];
                            $scope.updatedStudentInfoList = [];
                            $scope.saveStudentInfoList = [];
                            $scope.postotherMarkEnrty = {};
                            $scope.postotherMarkEnrty.studentInfoList = [];
                            $scope.postotherMarkEnrty.otherMarkEnrtyDetails = {};
                            alert(results.Message);
                            $scope.LoadImg = false;
                            $scope.SaveLoadImg = false;
                        }
                    }, function (error) {
                        $scope.otherMarkEnrtyDetail = {};
                        $scope.updatedStudentInfoList = [];
                        $scope.studentDetailList = [];
                        $scope.postotherMarkEnrty = {};
                        $scope.postotherMarkEnrty.studentInfoList = [];
                        $scope.postotherMarkEnrty.otherMarkEnrtyDetails = {};
                        alert(error.statusText);
                        $scope.LoadImg = false;
                        $scope.SaveLoadImg = false;
                    });
                } else {
                    $scope.SaveLoadImg = false;
                }
            };
            $scope.postOtherMarkEnrtyDetail = function () {
                if ($scope.otherMarkEnrtyStudentDetailForm.$valid && $scope.otherMarkEnrtyDetailForm.$valid && $scope.studentDetailList.length > 0) {
                    $scope.SaveDisable = true;
                    $scope.LoadImg = true;
                    $scope.SaveLoadImg = true;
                    $scope.updatedStudentInfoList = [];
                    $scope.saveStudentInfoList = [];
                    if ($scope.otherMarkEnrtyDetail.ExaminerID == "" || $scope.otherMarkEnrtyDetail.ExaminerID == undefined) {
                        alert("Please select Examiner.");
                        window.scrollTo(0, 0);
                        $scope.LoadImg = false;
                        $scope.SaveLoadImg = false;
                        $scope.isCorrect = false;
                        $scope.SaveDisable = false;
                        return;
                    }
                    for (var i = 0; i < $scope.studentDetailList.length; i++) {
                        if ($scope.studentDetailList[i].HTNO.toString().replace(" ", "") == "" || $scope.studentDetailList[i].HTNO == undefined) {
                            alert("Please enter HT No for Sl No. " + (i + 1) + ".");
                            document.getElementById("HTNO_" + i).focus();
                            $scope.LoadImg = false;
                            $scope.SaveLoadImg = false;
                            $scope.isCorrect = false;
                            $scope.SaveDisable = false;
                            return;
                        }
                        if ($scope.studentDetailList[i].StudName.toString().replace(" ", "") == "" || $scope.studentDetailList[i].StudName == undefined) {
                            alert("Please enter Student Name for HTNo " + $scope.studentDetailList[i].HTNO + ".");
                            document.getElementById("StudName_" + i).focus();
                            $scope.LoadImg = false;
                            $scope.SaveLoadImg = false;
                            $scope.isCorrect = false;
                            $scope.SaveDisable = false;
                            return;
                        }
                        //if ($scope.studentDetailList[i].MarksTh.toString().replace(" ", "") == "") {
                        //    alert("Please enter Theory marks for HTNo " + $scope.studentDetailList[i].HTNO + ".");
                        //    document.getElementById("MarksTh_" + i).focus();
                        //    $scope.LoadImg = false;
                        //    $scope.SaveLoadImg = false;
                        //    $scope.isCorrect = false;
                        //    $scope.SaveDisable = false;
                        //    return;
                        //}
                        //if ($scope.studentDetailList[i].MarksPr.toString().replace(" ", "") == "") {
                        //    alert("Please enter Practical marks for HTNo " + $scope.studentDetailList[i].HTNO + ".");
                        //    document.getElementById("MarksPr_" + i).focus();
                        //    $scope.LoadImg = false;
                        //    $scope.SaveLoadImg = false;
                        //    $scope.isCorrect = false;
                        //    $scope.SaveDisable = false;
                        //    return;
                        //}
                        //if ($scope.studentDetailList[i].RecordID > 0) {
                        //    if (($scope.studentDetailList[i].OldMarksTh !== $scope.studentDetailList[i].MarksTh) || ($scope.studentDetailList[i].OldMarksPr !== $scope.studentDetailList[i].MarksPr)) {
                        //        $scope.studentDetailList[i].StatusSubFlag
                        //        var temp = {};
                        //        angular.copy($scope.studentDetailList[i], temp);
                        //        $scope.updatedStudentInfoList.push(temp);
                        //    }
                        //} else {
                        //    var temp = {};
                        //    angular.copy($scope.studentDetailList[i], temp);
                        //    $scope.updatedStudentInfoList.push(temp);
                        //}
                        if ($scope.studentDetailList[i].RecordID != 0) {
                            if ($scope.studentDetailList[i].StatusSubFlagOld != $scope.studentDetailList[i].StatusSubFlag) {
                                var temp = {};
                                angular.copy($scope.studentDetailList[i], temp);
                                $scope.updatedStudentInfoList.push(temp);
                            }
                            else if ($scope.studentDetailList[i].OldMarksTh.toString() != $scope.studentDetailList[i].MarksTh) {
                                var temp = {};
                                angular.copy($scope.studentDetailList[i], temp);
                                $scope.updatedStudentInfoList.push(temp);
                            }
                        }
                        else {
                            var temp = {};
                            angular.copy($scope.studentDetailList[i], temp);
                            $scope.saveStudentInfoList.push(temp);
                        }
                    }
                    //if ($scope.updatedStudentInfoList.length == 0) {
                    //    alert("No modifications done to Save.");
                    //}
                    $scope.isCorrect = true;
                    if ($scope.isCorrect) {
                        if ($scope.updatedStudentInfoList.length > 0 || $scope.saveStudentInfoList.length > 0) {
                            $scope.postotherMarkEnrty = {};
                            $scope.postotherMarkEnrty.studentInformationList = $scope.updatedStudentInfoList;
                            $scope.postotherMarkEnrty.NewStudentInformationList = $scope.saveStudentInfoList;
                            $scope.otherMarkEnrtyDetail.ExamInstID = AppSettings.ExamInstID;
                            $scope.otherMarkEnrtyDetail.CreLoginID = AppSettings.LoggedUserId;
                            $scope.otherMarkEnrtyDetail.UpdLoginID = AppSettings.LoggedUserId;
                            $scope.postotherMarkEnrty.otherMarkEnrtyDetails = $scope.otherMarkEnrtyDetail;
                            otherMarkEnrtyService.PostOtherMarkEnrtyOntheJobTraining($scope.postotherMarkEnrty).then(function (results) {
                                if (results.IsSuccess) {
                                    $scope.LoadImg = false;
                                    $scope.SaveLoadImg = false;
                                    $scope.SaveDisable = false;
                                    alert(results.Message);
                                    $scope.updatedStudentInfoList = [];
                                    $scope.postotherMarkEnrty = {};
                                    $scope.postotherMarkEnrty.studentInfoList = [];
                                    $scope.postotherMarkEnrty.otherMarkEnrtyDetails = {};
                                    $scope.showStudentDetail();
                                } else {
                                    $scope.LoadImg = false;
                                    $scope.SaveLoadImg = false;
                                    $scope.SaveDisable = false;
                                    alert(results.Message);
                                    $scope.updatedStudentInfoList = [];
                                    $scope.postotherMarkEnrty = {};
                                    $scope.postotherMarkEnrty.studentInfoList = [];
                                    $scope.postotherMarkEnrty.otherMarkEnrtyDetails = {};
                                    $scope.showStudentDetail();
                                }
                            }, function (error) {
                                $scope.LoadImg = false;
                                $scope.SaveLoadImg = false;
                                $scope.SaveDisable = false;
                                alert(error.statusText);
                                $scope.updatedStudentInfoList = [];
                                $scope.postotherMarkEnrty = {};
                                $scope.postotherMarkEnrty.studentInfoList = [];
                                $scope.postotherMarkEnrty.otherMarkEnrtyDetails = {};
                                $scope.showStudentDetail();
                            });
                        } else {
                            $scope.LoadImg = false;
                            $scope.SaveLoadImg = false;
                            $scope.SaveDisable = false;
                            alert("Other Mark Entry Completed.");
                            $scope.updatedStudentInfoList = [];
                            $scope.postotherMarkEnrty = {};
                            $scope.postotherMarkEnrty.studentInfoList = [];
                            $scope.postotherMarkEnrty.otherMarkEnrtyDetails = {};
                            $scope.showStudentDetail();
                        }
                        $scope.ThChanged = false;
                    }
                }
            };
            $scope.CheckHTNo = function (index) {
                for (var i = 0; i < $scope.studentDetailList.length; i++) {
                    if (i != index) {
                        if (($scope.studentDetailList[i].HTNO.toString() == $scope.studentDetailList[index].HTNO.toString()) && $scope.studentDetailList[i].HTNO.toString() != "") {
                            $scope.studentDetailList[index].HTNO = "";
                            document.getElementById("HTNO_" + index).focus();
                            alert("Roll No Already Exist Above/Below.");
                            return;
                        }
                    }
                }
                getHTNoDetails($scope.studentDetailList[index].HTNO, index);
            };
            //$scope.postOtherMarkSingleEnrty = function (index, MarksType) {
            //    if ($scope.otherMarkEnrtyStudentDetailForm.$valid && $scope.otherMarkEnrtyDetailForm.$valid && $scope.studentDetailList.length > 0) {
            //        $scope.updatedStudentInfoList = [];
            //        if ($scope.otherMarkEnrtyDetail.ExaminerID == "" || $scope.otherMarkEnrtyDetail.ExaminerID == undefined) {
            //            alert("Please select Examiner.");
            //            window.scrollTo(0, 0);
            //            if (MarksType == "Th") {
            //                $scope.studentDetailList[index].MarksTh = "";
            //                $scope.studentDetailList[index].TotalMarks = "";
            //            }
            //            else {
            //                $scope.studentDetailList[index].MarksPr = "";
            //                $scope.studentDetailList[index].TotalMarks = "";
            //            }
            //            $scope.LoadImg = false;
            //            $scope.isCorrect = false;
            //            return;
            //        }
            //        if ($scope.studentDetailList[index].HTNO == null || $scope.studentDetailList[index].HTNO.toString().replace(" ", "") == "" || $scope.studentDetailList[index].HTNO == undefined) {
            //            alert("Please enter HT No for Sl No. " + (index + 1) + ".");
            //            $scope.studentDetailList[index].MarksTh = "";
            //            $scope.studentDetailList[index].MarksPr = "";
            //            $scope.studentDetailList[index].TotalMarks = "";
            //            document.getElementById("HTNO_" + index).focus();
            //            $scope.LoadImg = false;
            //            $scope.isCorrect = false;
            //            return;
            //        }
            //        if ($scope.studentDetailList[index].StudName == null || $scope.studentDetailList[index].StudName.toString().replace(" ", "") == "" || $scope.studentDetailList[index].StudName == undefined) {
            //            alert("Please enter Student Name for HTNo " + $scope.studentDetailList[index].HTNO + ".");
            //            $scope.studentDetailList[index].MarksTh = "";
            //            $scope.studentDetailList[index].MarksPr = "";
            //            $scope.studentDetailList[index].TotalMarks = "";
            //            document.getElementById("StudName_" + index).focus();
            //            $scope.LoadImg = false;
            //            $scope.isCorrect = false;
            //            return;
            //        }
            //        if ($scope.EntryChange == false) {
            //            if ($scope.studentDetailList[index].MarksTh.toString().replace(" ", "") == "") {
            //                alert("Please enter Theory marks for HTNo " + $scope.studentDetailList[index].HTNO + ".");
            //                document.getElementById("MarksTh_" + index).focus();
            //                $scope.isCorrect = false;
            //                return;
            //            }
            //            if ($scope.studentDetailList[index].MarksPr.toString().replace(" ", "") == "") {
            //                alert("Please enter Practical marks for HTNo " + $scope.studentDetailList[index].HTNO + ".");
            //                document.getElementById("MarksPr_" + index).focus();
            //                $scope.isCorrect = false;
            //                return;
            //            }
            //        }
            //        $scope.isCorrect = true;
            //        if ($scope.studentDetailList[index].RecordID > 0) {
            //            if (($scope.studentDetailList[index].OldMarksTh !== $scope.studentDetailList[index].MarksTh) || ($scope.studentDetailList[index].OldMarksPr !== $scope.studentDetailList[index].MarksPr)) {
            //                var temp = {};
            //                angular.copy($scope.studentDetailList[index], temp);
            //                $scope.updatedStudentInfoList.push(temp);
            //            }
            //        } else {
            //            var temp = {};
            //            angular.copy($scope.studentDetailList[index], temp);
            //            $scope.updatedStudentInfoList.push(temp);
            //        }
            //        if ($scope.isCorrect) {
            //            if ($scope.updatedStudentInfoList.length > 0) {
            //                $scope.postotherMarkEnrty = {};
            //                $scope.postotherMarkEnrty.studentInformationList = $scope.updatedStudentInfoList;
            //                $scope.otherMarkEnrtyDetail.ExamInstID = AppSettings.ExamInstID;
            //                $scope.otherMarkEnrtyDetail.CreLoginID = AppSettings.LoggedUserId;
            //                $scope.otherMarkEnrtyDetail.UpdLoginID = AppSettings.LoggedUserId;
            //                $scope.postotherMarkEnrty.otherMarkEnrtyDetails = $scope.otherMarkEnrtyDetail;
            //                otherMarkEnrtyService.postOtherMarkEnrty($scope.postotherMarkEnrty).then(function (results) {
            //                    if (results.IsSuccess) {
            //                    if ($scope.studentDetailList[index].RecordID == 0) {
            //                        otherMarkEnrtyService.getPostHTNoDetails($scope.studentDetailList[index].HTNO, $scope.otherMarkEnrtyDetail.ExmSubID).then(function (results) {
            //                                if (results.length > 0) {
            //                                    if (results[0].RecordID != 0) {
            //                                        $scope.studentDetailList[index].RecordID = results[0].RecordID;
            //                                    }
            //                                }
            //                            });
            //                        }
            //                        $scope.updatedStudentInfoList = [];
            //                    } else {
            //                        $scope.updatedStudentInfoList = [];
            //                    }
            //                }, function (error) {
            //                    $scope.updatedStudentInfoList = [];
            //                    alert(error.statusText);
            //                });
            //            } else {
            //                $scope.updatedStudentInfoList = [];
            //            }
            //            $scope.EntryChange = false;
            //        }
            //    }
            //};
            $scope.ValidateMarks = function () {
                for (var i = 0; i < $scope.studentDetailList.length; i++) {
                    $scope.studentDetailList[i].StatusSubFlagOld = $scope.studentDetailList[i].StatusSubFlag;
                    if ($scope.studentDetailList[i].RecordID != undefined && $scope.studentDetailList[i].RecordID != null && $scope.studentDetailList[i].RecordID !== "0") {
                        $scope.studentDetailList[i].HideDetailsHTNO = true;
                        $scope.studentDetailList[i].HideDetailsStudName = true;
                    }
                    if ($scope.studentDetailList[i].AddFlag != "Y") {
                        $scope.studentDetailList[i].HideDetailsDelete = true;
                    }
                    if ($scope.studentDetailList[i].ChkListFlag == 'V') {
                        $scope.studentDetailList[i].HideDetailsDelete = true;
                    }
                    if ($scope.studentDetailList[i].StatusFlagTh == "P" && $scope.studentDetailList[i].StatusFlagPr == "P") {
                        if ($scope.studentDetailList[i].MarksTh == 0) {
                            if ($scope.studentDetailList[i].StatusSubFlag != "" && $scope.studentDetailList[i].StatusSubFlag != null) {
                                $scope.studentDetailList[i].TotalMarks = "Zero";
                            }
                        }
                        else {

                            // Commented For Display Marks In Words
                            //$scope.studentDetailList[i].TotalMarks = parseInt($scope.studentDetailList[i].MarksTh);
                            $scope.studentDetailList[i].TotalMarks = toWords($scope.studentDetailList[i].MarksTh); 

                        }
                    }
                    //if ($scope.studentDetailList[i].StatusFlagTh == "P" && $scope.studentDetailList[i].StatusFlagPr != "P") {
                    //    $scope.studentDetailList[i].MarksPr = $scope.studentDetailList[i].StatusFlagPr;
                    //    $scope.studentDetailList[i].TotalMarks = $scope.studentDetailList[i].StatusFlagPr == "A" ? "Absent" : $scope.studentDetailList[i].StatusFlagPr == "M" ? "Malpractice" : $scope.studentDetailList[i].StatusFlagPr == "N" ? "Not Applicable" : "";
                    //}
                    if ($scope.studentDetailList[i].StatusFlagTh != "P") {
                        $scope.studentDetailList[i].MarksTh = $scope.studentDetailList[i].StatusFlagTh;
                        $scope.studentDetailList[i].TotalMarks = $scope.studentDetailList[i].StatusFlagTh == "A" ? "Absent" : $scope.studentDetailList[i].StatusFlagTh == "M" ? "Malpractice" : $scope.studentDetailList[i].StatusFlagTh == "N" ? "Not Applicable" : "";
                    }
                    //if ($scope.studentDetailList[i].StatusFlagTh != "P" && $scope.studentDetailList[i].StatusFlagPr != "P") {
                    //    if ($scope.studentDetailList[i].StatusFlagTh == "A" && $scope.studentDetailList[i].StatusFlagPr == "A") {
                    //        $scope.studentDetailList[i].MarksTh = $scope.studentDetailList[i].StatusFlagTh;
                    //        $scope.studentDetailList[i].MarksPr = $scope.studentDetailList[i].StatusFlagPr;
                    //        $scope.studentDetailList[i].TotalMarks = "Absent";
                    //    }
                    //    if ($scope.studentDetailList[i].StatusFlagTh == "M" && $scope.studentDetailList[i].StatusFlagPr == "M") {
                    //        $scope.studentDetailList[i].MarksTh = $scope.studentDetailList[i].StatusFlagTh;
                    //        $scope.studentDetailList[i].MarksPr = $scope.studentDetailList[i].StatusFlagPr;
                    //        $scope.studentDetailList[i].TotalMarks = "Malpractice";
                    //    }
                    //    else if ($scope.studentDetailList[i].StatusFlagTh == "N" || $scope.studentDetailList[i].StatusFlagPr == "N") {
                    //        $scope.studentDetailList[i].MarksTh = $scope.studentDetailList[i].StatusFlagTh;
                    //        $scope.studentDetailList[i].MarksPr = $scope.studentDetailList[i].StatusFlagPr;
                    //        $scope.studentDetailList[i].TotalMarks = "Not Applicable";
                    //        document.getElementById("MarksPr_" + i).disabled = true;
                    //    }
                    //    if (($scope.studentDetailList[i].StatusFlagTh == "A" && $scope.studentDetailList[i].StatusFlagPr == "M") || ($scope.studentDetailList[i].StatusFlagTh == "M" && $scope.studentDetailList[i].StatusFlagPr == "A")) {
                    //        $scope.studentDetailList[i].MarksTh = $scope.studentDetailList[i].StatusFlagTh;
                    //        $scope.studentDetailList[i].MarksPr = $scope.studentDetailList[i].StatusFlagPr;
                    //        $scope.studentDetailList[i].TotalMarks = "Malpractice";
                    //    }
                    //}
                    if ($scope.studentDetailList[i].StatusSubFlag == "" || $scope.studentDetailList[i].StatusSubFlag == null) {
                        if ($scope.studentDetailList[i].MarksTh == 0) {
                            $scope.studentDetailList[i].MarksTh = "";
                        }
                        //if ($scope.studentDetailList[i].MarksPr == 0) {
                        //    $scope.studentDetailList[i].MarksPr = "";
                        //}
                        $scope.studentDetailList[i].Checked = false;
                        $scope.PendingCount += 1;
                    }
                    else {
                        $scope.studentDetailList[i].Checked = true;
                    }
                    if (Number.isInteger(parseInt($scope.studentDetailList[i].MarksTh))) {
                        $scope.studentDetailList[i].MarksTh = "0" + $scope.studentDetailList[i].MarksTh;
                    }
                    if (Number.isInteger(parseInt($scope.studentDetailList[i].MarksTh)) && $scope.studentDetailList[i].MarksTh.toString().length == 1) {
                        $scope.studentDetailList[i].MarksTh = "00" + $scope.studentDetailList[i].MarksTh;
                    }
                    if (Number.isInteger(parseInt($scope.studentDetailList[i].MarksTh)) && $scope.studentDetailList[i].MarksTh.toString().length == 2) {
                        $scope.studentDetailList[i].MarksTh = "0" + $scope.studentDetailList[i].MarksTh;
                    }
                    if (Number.isInteger(parseInt($scope.studentDetailList[i].TotalMarks)) && $scope.studentDetailList[i].TotalMarks.toString().length == 1) {
                        $scope.studentDetailList[i].TotalMarks = "00" + $scope.studentDetailList[i].TotalMarks;
                    }
                    if (Number.isInteger(parseInt($scope.studentDetailList[i].TotalMarks)) && $scope.studentDetailList[i].TotalMarks.toString().length == 2) {
                        $scope.studentDetailList[i].TotalMarks = "0" + $scope.studentDetailList[i].TotalMarks;
                    }
                    $scope.studentDetailList[i].OldMarksTh = $scope.studentDetailList[i].MarksTh;
                    //$scope.studentDetailList[i].OldMarksPr = $scope.studentDetailList[i].MarksPr;
                }
                if ($scope.PendingCount == 0) {
                    $scope.SubmitDisable = false;
                }
                else {
                    $scope.SubmitDisable = true;
                }
            };
            $scope.AddNewRow = function () {
                var obj = {};
                obj.SrNo = $scope.studentDetailList.length + 1;
                obj.RecordID = "0";
                obj.HTNO = "";
                obj.CollegeID = $scope.otherMarkEnrtyDetail.CollegeID;
                obj.ExamID = $scope.otherMarkEnrtyDetail.ExamID;
                obj.ExamInstID = $scope.otherMarkEnrtyDetail.ExamInstID;
                obj.ExmSubID = $scope.otherMarkEnrtyDetail.ExmSubID;
                obj.EvalTypeIDTh = $scope.studentDetailList[$scope.studentDetailList.length - 1].EvalTypeIDTh;
                obj.EvalTypeIDPr = $scope.studentDetailList[$scope.studentDetailList.length - 1].EvalTypeIDPr;
                obj.MarksTh = "";
                //obj.MarksPr = "";
                obj.OldMarksTh = "";
                //obj.OldMarksPr = "";
                obj.MaxMarksTh = $scope.studentDetailList[0].MaxMarksTh;
                //obj.MaxMarksPr = $scope.studentDetailList[0].MaxMarksPr;
                obj.TotalMarks = "";
                obj.StatusFlagTh = "P";
                obj.StatusFlagPr = "P";
                obj.AddFlag = "Y";
                obj.HideDetailsHTNO = false;
                obj.HideDetailsStudName = false;
                obj.HideDetailsDelete = false;
                obj.Checked = false;
                $scope.studentDetailList.push(obj);
                $scope.PendingCount += 1;
                if ($scope.PendingCount == 0) {
                    $scope.SubmitDisable = false;
                }
                else {
                    $scope.SubmitDisable = true;
                }
            }
            $scope.DeleteRow = function (index) {
                if ($scope.studentDetailList[index].RecordID == "0" || $scope.studentDetailList[index].RecordID == undefined || $scope.studentDetailList[index].RecordID == "") {
                    //$scope.PendingCount -= 1;
                    $scope.studentDetailList.splice(index, 1);
                    if ($scope.PendingCount == 0) {
                        $scope.SubmitDisable = false;
                    }
                    else {
                        $scope.SubmitDisable = true;
                    }
                    //if ($scope.studentDetailList[index].MarksTh != "" && $scope.studentDetailList[index].MarksPr != "") {
                    //    if ($scope.studentDetailList[index].RecordID == 0) {
                    //        otherMarkEnrtyService.getPostHTNoDetails($scope.studentDetailList[index].HTNO, $scope.otherMarkEnrtyDetail.ExmSubID).then(function (results) {
                    //            if (results.length > 0) {
                    //                if (results[0].RecordID != 0) {
                    //                    $scope.studentDetailList[index].RecordID = results[0].RecordID;
                    //                    otherMarkEnrtyService.deleteHTNO($scope.studentDetailList[index].RecordID).then(function (results) {
                    //                        if (results == "0") {
                    //                            alert("Record Deletion Failed.");
                    //                        }
                    //                        else if (results == "1") {
                    //                            $scope.studentDetailList[index].MarksTh = "";
                    //                            $scope.MarksChange(index, 'Th');
                    //                            $scope.PendingCount -= 1;
                    //                            $scope.studentDetailList.splice(index, 1);
                    //                        }
                    //                        else {
                    //                            alert("Error: Record Deletion Failed.");
                    //                        }
                    //                    });
                    //                }
                    //            }
                    //        });
                    //    }
                    //    else {
                    //        $scope.studentDetailList[index].MarksTh = "";
                    //        $scope.MarksChange(index, 'Th');
                    //        $scope.PendingCount -= 1;
                    //        $scope.studentDetailList.splice(index, 1);
                    //    }
                    //}
                    //else {
                    //    $scope.PendingCount -= 1;
                    //    $scope.studentDetailList.splice(index, 1);
                    //}
                }
                else {
                    otherMarkEnrtyService.deleteHTNO($scope.studentDetailList[index].RecordID).then(function (results) {
                        if (results == "0") {
                            alert("Record Deletion Failed.");
                        }
                        else if (results == "1") {
                            $scope.studentDetailList[index].MarksTh = "";
                            $scope.MarksChange(index, 'Th');
                            $scope.PendingCount -= 1;
                            $scope.studentDetailList.splice(index, 1);
                        }
                        else {
                            alert("Error: Record Deletion Failed.");
                        }
                    });
                }
            }

            var th = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];
            var dg = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
            var tn = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
            var tw = ['Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
            function toWords(s) {
                s = s.toString();
                s = s.replace(/[\, ]/g, '');
                if (s != parseFloat(s)) return 'not a number';
                var x = s.indexOf('.');
                if (x == -1) x = s.length;
                if (x > 15) return 'too big';
                var n = s.split('');
                var str = '';
                var sk = 0;
                for (var i = 0; i < x; i++) {
                    if ((x - i) % 3 == 2) {
                        if (n[i] == '1') {
                            str += tn[Number(n[i + 1])] + ' ';
                            i++;
                            sk = 1;
                        }
                        else if (n[i] != 0) {
                            str += tw[n[i] - 2] + ' ';
                            sk = 1;
                        }
                    }
                    else if (n[i] != 0) {
                        str += dg[n[i]] + ' ';
                        if ((x - i) % 3 == 0) str += 'Hundred ';
                        sk = 1;
                    }


                    if ((x - i) % 3 == 1) {
                        if (sk) str += th[(x - i - 1) / 3] + ' ';
                        sk = 0;
                    }
                }
                if (x != s.length) {
                    var y = s.length;
                    str += 'point ';
                    for (var i = x + 1; i < y; i++) str += dg[n[i]] + ' ';
                }
                return str.replace(/\s+/g, ' ');
            }
        });
}());