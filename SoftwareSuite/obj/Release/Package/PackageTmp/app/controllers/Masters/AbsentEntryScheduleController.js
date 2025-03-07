﻿define(['app'], function (app) {
    app.controller("AbsentEntryScheduleController", function ($scope, $state, $stateParams, AppSettings, BasicMarksEntrScheduleService, BasicCourseService, BasicExamService, BasicDistrictsService, BasicCollegeService) {
        $scope.BasicMarksEntrSchedule = { MarkEntrSchID: $stateParams.MarkEntrSchID };
        var PageNm = $state.current.name.split(".")[1] + "List";
        var BasicMarksEntrScheduleRightsdata = [];
        $scope.DisableServiceFlag = false;
        $scope.isdeleteDisable = true;
        $scope.todayDate = "";
        $scope.isCouseDisable = false;
        $scope.isExamDisable = false;

        BasicMarksEntrScheduleRightsdata = AppSettings.UserRights;
        for (var i = 0; i < BasicMarksEntrScheduleRightsdata.length; i++) {
            if (BasicMarksEntrScheduleRightsdata[i].GridFormToOpen == PageNm) {
                if ($scope.BasicMarksEntrSchedule.MarkEntrSchID == 0) {
                    if (BasicMarksEntrScheduleRightsdata[i].isaddable == 'Y') {
                        $scope.isupdatableDisable = false;
                    } else {
                        $scope.isupdatableDisable = true;
                    }
                    $scope.isdeletableDisable = true;
                } else {
                    if (BasicMarksEntrScheduleRightsdata[i].isupdatable == 'Y') {
                        $scope.isupdatableDisable = false;
                    }
                    else {
                        $scope.isupdatableDisable = true;
                    }
                    if (BasicMarksEntrScheduleRightsdata[i].isdeletable == 'Y') {
                        $scope.isdeletableDisable = false;
                    } else {
                        $scope.isdeletableDisable = true;
                    }
                }
            }
        }

        $("#StartDate").ejDatePicker({ allowEdit: false, dateFormat: "dd/MMM/yyyy" });
        $("#EndDate").ejDatePicker({ allowEdit: false, dateFormat: "dd/MMM/yyyy" });

        $("#StartDate").ejDatePicker({ value: new Date() });
        $("#EndDate").ejDatePicker({ value: new Date() });

        var BasicCourseList = BasicCourseService.GetBasicCourseList();
        BasicCourseList.then(function (CourseData, status, headers, config, error) {
            $scope.BasicCourseList = CourseData;
        }, function (CourseData, status, headers, config) {
            alert(error);
        })

        $scope.GetExamList = function (CourseID) {
            if (CourseID != "" || CourseID != undefined) {
                var BasicExamList = BasicExamService.GetExamListByCourseID(CourseID);
                BasicExamList.then(function (ExamData, status, headers, config, error) {
                    $scope.BasicExamList = ExamData;
                }, function (ExamData, status, headers, config) {
                    alert(error);
                })
            }
        }

        //var BasicDistrictList = BasicDistrictsService.GetBasicDistrictList();
        //BasicDistrictList.then(function (Districtdata, status, headers, config, error) {
        //    $scope.BasicDistrictList = Districtdata;
        //}, function (error) {
        //    alert(error);
        //    });

        //$scope.GetCollegeList = function (DistrictID) {
        //    if (DistrictID != "" || DistrictID != undefined) {
        //        var BasicCollegeList = BasicCollegeService.GetCollegeListByDistrict(DistrictID);
        //        BasicCollegeList.then(function (CollegeData, status, headers, config, error) {
        //            $scope.BasicCollegeList = CollegeData;
        //        }, function (CollegeData, status, headers, config) {
        //            alert(error);
        //        })
        //    }
        //}
        var BasicCourseList = BasicCourseService.GetBasicCourseList();
        BasicCourseList.then(function (CourseData, status, headers, config, error) {
            $scope.BasicCourseList = CourseData;
            var BasicExamList = BasicExamService.GetExamListByCourseID(0);
            BasicExamList.then(function (ExamData, status, headers, config, error) {
                $scope.BasicExamList = ExamData;
                if ($scope.BasicMarksEntrSchedule.MarkEntrSchID > 0) {
                    var BasicMarksEntrScheduledata = BasicMarksEntrScheduleService.GetMarkEntryScheduleListByID($scope.BasicMarksEntrSchedule.MarkEntrSchID);
                    BasicMarksEntrScheduledata.then(function (data) {

                        $scope.BasicMarksEntrSchedule = data[0];
                        ///$scope.PreReqSchedule.ServiceID = data[0].ServiceID;

                        $("#StartDate").ejDatePicker({ value: data[0].StartDate, dateFormat: "dd/MMM/yyyy" });
                        $("#EndDate").ejDatePicker({ value: data[0].EndDate, dateFormat: "dd/MMM/yyyy" });
                        var StartTime = data[0].StartTime;
                        var EndTime = data[0].EndTime;

                        $scope.isCouseDisable = true;
                        $scope.isExamDisable = true;

                        $scope.isdeleteDisable = false;
                        // $scope.DisableServiceFlag = true;

                    }, function (error) {
                        alert(error);
                    });
                }
            }, function (ExamData, status, headers, config) {
                alert(error);
            });
        }, function (CourseData, status, headers, config) {
            alert(error);
        });

        $scope.SaveBasicMarksEntrSchedule = function () {
            if (CheckValidation() == true) {
                if ($scope.BasicMarksEntrSchedule.MarkEntrSchID == 0) {
                    if ($scope.BasicMarksEntrSchedule.MarkEntrSchID == undefined) { $scope.BasicMarksEntrSchedule.MarkEntrSchID = 0; }
                    $scope.isupdatableDisable = true;

                    $scope.BasicMarksEntrSchedule.CreLoginID = AppSettings.LoggedUserId;
                    $scope.BasicMarksEntrSchedule.UpdLoginID = AppSettings.LoggedUserId;
                    $scope.BasicMarksEntrSchedule.ExamInstID = 103;
                    $scope.BasicMarksEntrSchedule.ExmSubID = 0;

                    $scope.BasicMarksEntrSchedule.ExmSchType = "3";

                    $scope.BasicMarksEntrSchedule.StartDate = $("#StartDate").val();
                    $scope.BasicMarksEntrSchedule.EndDate = $("#EndDate").val();

                    $scope.BasicMarksEntrSchedule.StartTime = window.moment($scope.BasicMarksEntrSchedule.StartTime).format('hh:mm a');
                    $scope.BasicMarksEntrSchedule.EndTime = window.moment($scope.BasicMarksEntrSchedule.EndTime).format('hh:mm a');

                    var getCheckDate = BasicMarksEntrScheduleService.PostCheckDatesValidations($scope.BasicMarksEntrSchedule); /*$("#StartDate").val(), $("#EndDate").val(), $("#FromLateDate1").val(), $("#FromLateDate2").val(), $("#FromLateDate3").val()*/
                    getCheckDate.then(function (data) {
                        if (data != "") {
                            alert(data);
                            $scope.isupdatableDisable = false;
                            return;
                        }
                        else {
                            var BasicMarksEntrScheduledata = BasicMarksEntrScheduleService.GetCheckDuplicateEntryOfSchedule($scope.BasicMarksEntrSchedule.ExamID, $scope.BasicMarksEntrSchedule.ExamInstID, "1");
                            BasicMarksEntrScheduledata.then(function (data) {
                                var data1 = data.length;
                                if (data.length == 0) {
                                    var getPromise = BasicMarksEntrScheduleService.PostMarkEntryScheduleInsert($scope.BasicMarksEntrSchedule);
                                    getPromise.then(function (msg) {
                                        alert("Added successfully!!");

                                        RedirectToListPage();
                                    }, function (error) {
                                        alert(error);
                                    });
                                }
                                else {
                                    alert("Schedule is Already Filled up For this Exam Year");
                                }
                            }, function (error) {
                                alert(error);
                            });
                        }
                    }, function (error) {
                        alert(error);
                    });
                }
                else {

                    //$scope.isdeleteDisable = true;

                    $scope.BasicMarksEntrSchedule.CreLoginID = AppSettings.LoggedUserId;
                    $scope.BasicMarksEntrSchedule.UpdLoginID = AppSettings.LoggedUserId;
                    $scope.BasicMarksEntrSchedule.ExamInstID = 103;
                    $scope.BasicMarksEntrSchedule.ExmSubID = 0;

                    $scope.BasicMarksEntrSchedule.ExmSchType = "3";

                    $scope.BasicMarksEntrSchedule.StartDate = $("#StartDate").val();
                    $scope.BasicMarksEntrSchedule.EndDate = $("#EndDate").val();

                    $scope.BasicMarksEntrSchedule.StartTime = window.moment($scope.BasicMarksEntrSchedule.StartTime).format('hh:mm a');
                    $scope.BasicMarksEntrSchedule.EndTime = window.moment($scope.BasicMarksEntrSchedule.EndTime).format('hh:mm a');

                    var getCheckDate = BasicMarksEntrScheduleService.PostCheckDatesValidations($scope.BasicMarksEntrSchedule); /*$("#StartDate").val(), $("#EndDate").val(), $("#FromLateDate1").val(), $("#FromLateDate2").val(), $("#FromLateDate3").val()*/
                    getCheckDate.then(function (data) {
                        if (data != "") {
                            alert(data);
                            $scope.isupdatableDisable = false;
                            return;
                        }
                        else {
                            var getPromise = BasicMarksEntrScheduleService.UpdateMarkEntrySchedule($scope.BasicMarksEntrSchedule);
                            getPromise.then(function (msg) {
                                alert("Update successfully!!");

                                RedirectToListPage();
                            }, function (error) {
                                alert(error);
                            });
                        }
                    }, function (error) {
                        alert(error);
                    });
                }
            }
        }


        $scope.DeleteBasicMarksEntrSchedule = function () {
            if ($scope.BasicMarksEntrSchedule.MarkEntrSchID > 0) {
                var getData = BasicMarksEntrScheduleService.DeleteMarkEntrySchedule($scope.BasicMarksEntrSchedule.MarkEntrSchID, AppSettings.LoggedUserId);
                getData.then(function (msg) {
                    alert('Record Deleted');
                    RedirectToListPage();
                }, function (error) {
                    alert(error);
                });
            }
        }
        function CheckValidation() {
            if (($scope.BasicMarksEntrSchedule.CourseID == undefined) || ($scope.BasicMarksEntrSchedule.CourseID == "")) {
                alert("Please Select Course");
                return false;
            }
            if (($scope.BasicMarksEntrSchedule.ExamID == undefined) || ($scope.BasicMarksEntrSchedule.ExamID == "")) {
                alert("Please Select Exam");
                return false;
            }

            // $scope.todayDate = new Date();

            //var StartDate = $scope.BasicMarksEntrSchedule.StartDate;

            //var EndDate = new Date($scope.BasicMarksEntrSchedule.EndDate);

            //if (($scope.BasicMarksEntrSchedule.DistrictID == undefined) || ($scope.BasicMarksEntrSchedule.DistrictID == "")) {
            //    alert("Please Select District");
            //    return false;
            //}
            //if (($scope.BasicMarksEntrSchedule.CollegeID == undefined) || ($scope.BasicMarksEntrSchedule.CollegeID == "")) {
            //    alert("Please Select College");
            //    return false;
            //}
            if (($scope.BasicMarksEntrSchedule.StartTime == undefined) || ($scope.BasicMarksEntrSchedule.StartTime == "")) {
                alert("Please Enter Start Time");
                return false;
            }
            if (($scope.BasicMarksEntrSchedule.EndTime == undefined) || ($scope.BasicMarksEntrSchedule.EndTime == "")) {
                alert("Please Enter End Time");
                return false;
            }

            //if (Date.parse($scope.BasicMarksEntrSchedule.StartTime) < Date.parse($scope.BasicMarksEntrSchedule.EndTime)) {
            //    alert("End Time Should be greater than Start Time");
            //    return false;
            //}
            else {
                return true;
            }
        }
        $scope.Exit = function () {
            RedirectToListPage();
        }
        function RedirectToListPage() {
            $state.go('Masters.AbsentEntryScheduleList');
        }
        //$scope.openCalendarFromDate = function () {
        //    $scope.PreReqSchedule.FromDateIsOpen = true;
        //}
    });
});
