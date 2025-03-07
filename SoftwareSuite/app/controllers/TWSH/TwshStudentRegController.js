﻿define(['app'], function (app) {
    app.controller("TwshStudentRegController", function ($scope, $crypto, SystemUserService, $state, $localStorage, AppSettings, $uibModal, TwshStudentRegService) {

        $scope.DetailsDisabled = false;

        $scope.isChecked = true;
        $scope.instructions = false;
        $scope.courseDetails = true;
        $scope.ExamAppearDetails = false;
        $scope.oldUser = false;
        $scope.oldUser2 = false;
        $scope.sscForm = false;
        $scope.applicationForm = false;
        $scope.usertype = -1;
        $scope.btndisable = false;
        $scope.otpbtndisable = false;
        $scope.certUpload = false;
        $scope.isqualified1 = false;
        $scope.isqualified2 = false;
        $scope.isqualified3 = false;
        $scope.applicationsuccess = false;
        $scope.ApplicationNo = "";
        $scope.otpsent = false;
        $scope.ShowAadhaarDetail = false;
        $scope.verifybtndisable = false;
        $scope.OnlineExamDates = [];
        $scope.QualifiedExam = false;
        $scope.PreviousExam = false;
        $scope.CheckBox = false;

        //$scope.exammode = [                                      // ----------exam modes-----
        //    { "name": "Online", "Id": 1 },
        //    { "name": "Offline", "Id": 2 }
        //]

        $scope.UserId = $localStorage.Twsh == undefined || $localStorage.Twsh == "" ? -1 : $localStorage.Twsh.UserId; //---- for private candidate  UserId = -1


        //if ($scope.UserId == -1) {
        //    $scope.modalInstance = $uibModal.open({
        //        templateUrl: "app/views/TWSH/TwshPrivatestudentPopup.html",
        //        size: 'xlg',
        //        scope: $scope,
        //        windowClass: 'modal-fit-att',
        //    });


        //    $scope.closeModal = function () {
        //        $scope.modalInstance.close();
        //    };
        //    $scope.goHome = function () {
        //        $state.go("TWSH.Home");
        //        $scope.modalInstance.close();
        //    }

        //};

        const $ctrl = this;
        $ctrl.$onInit = () => {
            $scope.SelectedCourseId = { Id: 1 };
            $scope.LoadLanguage($scope.SelectedCourseId);
            $scope.sellanguage = { Id: 1 };
            $scope.LoadGrades($scope.SelectedCourseId, $scope.sellanguage);
            $scope.Selgrade = { Id: 23 };
            $scope.LoadOnlineDist();

        }


        var eKey = SystemUserService.GetEKey();
        eKey.then(function (res) {
            $scope.EKey = res;
            console.log($scope.EKey)
            sessionStorage.Ekey = res;


        });


        $scope.inputType = 'password';
        $scope.eyeIcon = '👁️';


        $scope.toggleAadharVisibility = function () {
            $scope.inputType = ($scope.inputType === 'password') ? 'text' : 'password';
            $scope.eyeIcon = ($scope.inputType === 'password') ? '👁️' : '👀';
        };

        $scope.LoadOnlineDist = function () {
            //--------Online Districts -----------
            var GetOnlineExamDist = TwshStudentRegService.GetOnlineExamDist();
            GetOnlineExamDist.then(function (res) {
                $scope.onlineDistricts = res;
                //  $scope.Districts = $scope.onlineDistricts;
            }, function (err) {
                $scope.onlineDistricts = [];
            });
        }

        if ($localStorage.Twsh != "" && $localStorage.Twsh != undefined && $localStorage.Twsh != null) {

            $scope.usertype = $localStorage.Twsh.UserTypeId;
        }
        var GetExamMonthYear = TwshStudentRegService.GetExamMonthYear();
        GetExamMonthYear.then(function (res) {
            if (res.length > 0) {
                $scope.MonthYearId = res[0].Id;
            } else {
                $scope.MonthYearId = "";
            }

        }, function (err) {

        });

        //$scope.fillApplication = function () {
        //    $scope.instructions = false;
        //    $scope.courseDetails = true;
        //},
        //    $scope.backtoInstructions = function () {
        //        $scope.courseDetails = false;
        //        $scope.instructions = true;
        //    },

        $scope.getbatchtimings = function (BatchNumber) {
            var gettimings = TwshStudentRegService.GetGradeWiseBatchTimings($scope.Selgrade.Id, $scope.exambatch);
            gettimings.then(function (res) {
                try {
                    var Res = JSON.parse(res)
                }
                catch { error }
                $scope.GradeBatchTimings = Res.Table;
                $scope.Paper1Time = $scope.GradeBatchTimings[0].Paper1Time
                $scope.Paper2Time = $scope.GradeBatchTimings[0].Paper2Time
            }, function (err) {
                $scope.GradeBatchTimings = [];
            });
        }

        $scope.Blind = function (IsBlind) {
            if (IsBlind == 0) {
                $('#stdMedicalCertFile').val(null);

                $scope.stdMedicalCert = '';
                $scope.stdMedicalCert = null;
                $scope.IsBlind = IsBlind;
                $scope.CheckBox = false;
            }
            else if (IsBlind == 1) {
                $scope.IsBlind = IsBlind;
                $scope.CheckBox = true;
            }
            else {
                $scope.CheckBox = false;
            }
        }
        $scope.submitCourse = function (courseId, languageId, gradeId) {
            $scope.tmpmode = '';
            $scope.course_id = courseId.Id;
            //if ($scope.course_id == 2) {
            //    alert(" Application Dates are not found ");
            //    return;
            //}

            if ($scope.courseinfo && $scope.languageinfo && $scope.LoadGradeinfo && courseId.Id && languageId.Id && gradeId.Id) {
                let coursestatus = $scope.courseinfo.find(s => s.Id == courseId.Id);
                let langstatus = $scope.languageinfo.find(s => s.Id == languageId.Id);
                let Gradestatus = $scope.LoadGradeinfo.find(s => s.Id == gradeId.Id);
                if (coursestatus && langstatus && Gradestatus) {

                    $scope.selectedcourse = coursestatus;
                    $scope.selectedlanguage = langstatus;
                    $scope.selectedgrade = Gradestatus;
                    $scope.TwshCourse = $scope.selectedcourse.CourseName;
                    $scope.TwshLanguage = $scope.selectedlanguage.LanguageName;
                    $scope.TwshGrade = $scope.selectedgrade.GradeName;

                } else {
                    $scope.selectedcourse = "";
                    $scope.selectedlanguage = "";
                    $scope.selectedgrade = "";
                    $scope.TwshCourse = "";
                    $scope.TwshLanguage = "";
                    $scope.TwshGrade = "";
                }
            }

            $scope.loader1 = true
            $scope.submitbutton1 = true


            // $scope.ExamAppearDetails = true;
            //--------------offline districts------
            $scope.Districts = [];
            //var ExamDistricts = TwshStudentRegService.getExaminationDistricts($scope.course_id, parseInt($scope.UserId), $scope.selectedgrade.Id);
            var ExamDistricts = TwshStudentRegService.getExaminationDistricts($scope.course_id, -1, $scope.selectedgrade.Id);
            ExamDistricts.then(function (res) {
                $scope.offlineDistricts = res;

                $scope.loader1 = false
                $scope.submitbutton1 = false
            }, function (err) {
                $scope.offlineDistricts = [];
            });
            // ----------------- Dates-------------

            $scope.offlineExamDates = [];
            var getexamdates = TwshStudentRegService.getExamDates($scope.selectedcourse.Id, $scope.selectedgrade.Id)
            getexamdates.then(function (resp) {
                $scope.ExamDates = resp;
                $scope.loader1 = false
                $scope.submitbutton1 = false
            }, function (err) {
                $scope.ExamDates = []
            });


            if ($scope.selectedlanguage.Id == 1 && $scope.selectedcourse.Id == 1) {
                $scope.tmpmode = 1;
                $scope.showmodeofexam = true;
                $scope.ExamAppearDetails = false;
                $scope.mode = 1;  // by default online mode is selected for english
                $scope.ExamModeName = 'Computer Based Test (CBT)';
            }
            else if ($scope.selectedlanguage.Id != 1 && $scope.selectedcourse.Id == 1) {
                $scope.tmpmode = 2;
                $scope.showmodeofexam = true;
                $scope.ExamAppearDetails = false;
                $scope.mode = 2;

            } else {
                $scope.mode = 2;
                $scope.showmodeofexam = false;
                var date = TwshStudentRegService.VerifyApplicationDates($scope.mode);
                date.then(function (response) {

                    try {
                        var res = JSON.parse(response)

                    }
                    catch (err) { }
                    if (res.Table[0].ResponseCode == '200') {
                        $scope.ExamAppearDetails = true;
                    }
                    else if (res.Table[0].ResponseCode == '400') {
                        alert(res.Table[0].ResponseDescription);
                        $scope.courseDetails = true;
                        return;
                    }

                },
                    function (error) {
                        alert("error while Verifying Dates")
                        //var err = JSON.parse(error);

                    });
                $scope.Grade = $scope.selectedgrade.GradeName;
                $scope.tmpmode = 2;
                $scope.ExamModeName = 'Type Machine Based Test (TMBT)';
                //var ExamDistricts = TwshStudentRegService.getExaminationDistricts($scope.course_id, parseInt($scope.UserId), $scope.selectedgrade.Id);
                var ExamDistricts = TwshStudentRegService.getExaminationDistricts($scope.course_id, -1, $scope.selectedgrade.Id);
                ExamDistricts.then(function (res) {
                    $scope.offlineDistricts = res;
                    $scope.Districts = $scope.offlineDistricts;
                    $scope.loader1 = false
                    $scope.submitbutton1 = false

                }, function (err) {
                    $scope.offlineDistricts = [];
                });

            }

            if ($scope.selectedgrade.CriteriaTypeId == '2' || $scope.selectedgrade.CriteriaTypeId == '3') {
                $scope.certUpload = true;
            } else {
                $scope.certUpload = false;
            }
            $scope.courseDetails = false;

        }

        $scope.backAtMode = function () {
            $scope.courseDetails = true;
            $scope.showmodeofexam = false;
            $scope.ExamAppearDetails = false;
            $scope.oldUser = false;
            $scope.oldUser2 = false;
            $scope.sscForm = false;
            $scope.applicationForm = false;
        }

        $scope.backAtMode1 = function () {
            $scope.courseDetails = false;
            $scope.showmodeofexam = true;
            $scope.ExamAppearDetails = false;
            $scope.oldUser = false;
            $scope.oldUser2 = false;
            $scope.sscForm = false;
            $scope.applicationForm = false;
            $scope.yesBtn = null;
            $scope.noBtn = null;
        }

        $scope.submitmode = function () {

            $scope.Districts = [];
            if ($scope.mode == 1) {
                $scope.ExamAppearDetails = true;
                $scope.courseDetails = false;
                $scope.showmodeofexam = false;
                //$scope.ExamAppearDetails = true;
                $scope.oldUser = false;
                $scope.oldUser2 = false;
                $scope.sscForm = false;
                $scope.applicationForm = false;

                $scope.tmpmode = 1;
                $scope.ExamModeName = 'Computer Based Test (CBT)';
                var GetOnlineExamDist = TwshStudentRegService.GetOnlineExamDist();
                GetOnlineExamDist.then(function (res) {
                    $scope.onlineDistricts = res;
                    //  $scope.Districts = $scope.onlineDistricts;
                }, function (err) {
                    $scope.onlineDistricts = [];
                });

                $scope.Districts = $scope.onlineDistricts;

            } else if ($scope.mode == 2) {
                //$scope.tmpmode = 2;

                var date = TwshStudentRegService.VerifyApplicationDates($scope.mode);
                date.then(function (response) {

                    try {
                        var res = JSON.parse(response)

                    }
                    catch (err) { }
                    if (res.Table[0].ResponseCode == '200') {
                        $scope.ExamAppearDetails = true;
                        $scope.courseDetails = false;
                        $scope.showmodeofexam = false;
                        //$scope.ExamAppearDetails = true;
                        $scope.oldUser = false;
                        $scope.oldUser2 = false;
                        $scope.sscForm = false;
                        $scope.applicationForm = false;

                    }
                    else if (res.Table[0].ResponseCode == '400') {
                        alert(res.Table[0].ResponseDescription);
                        return;
                        //$scope.ExamAppearDetails = false;
                    }

                },
                    function (error) {
                        alert("error while Verifying Dates")
                        //var err = JSON.parse(error);

                    });

                $scope.ExamModeName = 'Type Machine Based Test (TMBT)';
                $scope.Districts = $scope.offlineDistricts;
            }

        }


        $scope.clickmodeRadio = function (exammode) {
            $scope.Districts = [];
            if (exammode == 1) {
                $scope.tmpmode = 1;
                $scope.ExamModeName = 'Computer Based Test (CBT)';
                var GetOnlineExamDist = TwshStudentRegService.GetOnlineExamDist();
                GetOnlineExamDist.then(function (res) {
                    $scope.onlineDistricts = res;
                    //  $scope.Districts = $scope.onlineDistricts;
                }, function (err) {
                    $scope.onlineDistricts = [];
                });

                $scope.Districts = $scope.onlineDistricts;

            } else if (exammode == 2) {
                $scope.tmpmode = 2;
                $scope.ExamModeName = 'Type Machine Based Test (TMBT)';
                $scope.Districts = $scope.offlineDistricts;
            }
        }


        $scope.clickRadio = function (twsh) {
            //  $scope.selectedgrade = JSON.parse(grade);
            if (twsh === 'Yes') {
                $scope.oldUser = true;
                $scope.sscForm = false;
                $scope.oldUser2 = false;
                $scope.applicationForm = false;
            }
            //else if (twsh === 'No') {
            //    $scope.oldUser = false;
            //    $scope.sscForm = false;
            //    $scope.oldUser2 = false;
            //    $scope.applicationForm = true;
            //    $scope.ExamAppearDetails = false;
            //}
            else {
                if ($scope.selectedgrade.CriteriaTypeId == 1) {
                    $scope.ExamAppearDetails = false;
                    $scope.oldUser = false;
                    $scope.oldUser2 = false;
                    $scope.ShowAadhaarDetail = true;
                    // $scope.sscForm = true;
                    $scope.applicationForm = false;
                } else if ($scope.selectedgrade.CriteriaTypeId == 4 && ($scope.selectedgrade.QualificationGradeId == undefined || $scope.selectedgrade.QualificationGradeId == null)) {
                    $scope.ShowAadhaarDetail = true;
                    $scope.ExamAppearDetails = false;
                    $scope.oldUser = false;
                    $scope.oldUser2 = false;
                    $scope.sscForm = false;
                    $scope.applicationForm = false;
                    $scope.isqualified1 = false;
                    $scope.isqualified2 = false;
                    $scope.isqualified3 = false;
                } else {
                    $scope.ShowAadhaarDetail = true;
                    $scope.ExamAppearDetails = false;
                    $scope.oldUser = false;
                    $scope.oldUser2 = false;
                    $scope.sscForm = false;
                    $scope.applicationForm = false;
                }

            }


        }

        $scope.SendOtp = function (aadhaar) {
            $scope.otpsent = true;
            if ($scope.adhaarno == '' || $scope.adhaarno == null) {
                alert("Aadhaar number Can't be Empty");
                return;
            }

            if ($scope.adhaarno.length != 12) {
                alert("Invalid Aadhaar number");
                return;
            }
            $scope.otpbtndisable = true;
            var aadhaarenc = btoa(aadhaar);
            var sendotp = TwshStudentRegService.SendAadhaarOtp(aadhaarenc);
            sendotp.then(function (res) {
                try { var res = JSON.parse(res) } catch (err) { }

                if (res.ret == "y" || res.ret == "Y") {
                    $scope.otpbtndisable = false;
                    var resp = atob(res.responseXML);
                    $scope.otpsent = true;
                    $scope.Txnid = res.txn;
                    //    alert("OTP sent to Aadhaar registered mobile number")

                } else {
                    $scope.otpbtndisable = false;
                    // $scope.otpsent = true;
                    alert(res.errdesc)
                }
            }, function (err) {
                $scope.otpbtndisable = false;
                console.log(res);
            })
        }

        $scope.VerifyOtp = function (aadhaar, aadharotp) {
            //--------------------
            //$scope.ExamAppearDetails = false;
            //$scope.oldUser = false;
            //$scope.oldUser2 = false;
            //$scope.sscForm = true;
            //$scope.ShowAadhaarDetail = false;
            //$scope.applicationForm = false;
            //---------------------
            if (aadharotp == '' || aadharotp == null) {
                alert("OTP Can't be Empty");
                return;
            }
            $scope.verifybtndisable = true;
            if ($scope.Txnid != "" && $scope.Txnid != undefined && $scope.Txnid != null) {
                var aadhaarenc = btoa(aadhaar);
                var VerifyOtp = TwshStudentRegService.VerifyAadhaarOtp(aadhaarenc, aadharotp, $scope.Txnid);
                VerifyOtp.then(function (res) {
                    if (res == true) {
                        $scope.adhaarOtp = '';

                        alert("Verfication success.");
                        $scope.verifybtndisable = false;
                        if ($scope.selectedgrade.CriteriaTypeId == 1) {
                            $scope.ExamAppearDetails = false;
                            $scope.oldUser = false;
                            $scope.oldUser2 = false;
                            $scope.sscForm = true;
                            $scope.ShowAadhaarDetail = false;
                            $scope.applicationForm = false;
                        } else if ($scope.selectedgrade.CriteriaTypeId == 4 && ($scope.selectedgrade.QualificationGradeId == undefined || $scope.selectedgrade.QualificationGradeId == null)) {
                            $scope.ExamAppearDetails = false;
                            $scope.oldUser = false;
                            $scope.oldUser2 = false;
                            $scope.sscForm = false;
                            $scope.ShowAadhaarDetail = false;
                            $scope.applicationForm = true;
                            $scope.isqualified1 = false;
                            $scope.isqualified2 = false;
                            $scope.isqualified3 = false;
                        } else {
                            $scope.ShowAadhaarDetail = false;
                            $scope.ExamAppearDetails = false;
                            $scope.oldUser = false;
                            $scope.oldUser2 = false;
                            $scope.sscForm = false;
                            $scope.applicationForm = true;
                            if ($scope.PreviousExam == true || $scope.QualifiedExam == true) {
                                $scope.isqualified1 = false;

                            } else {
                                $scope.isqualified1 = true;

                            }
                            $scope.isqualified2 = false;
                            if ($scope.QualifiedExam == true) {
                                $scope.isqualified3 = false;

                            } else {
                                $scope.isqualified3 = true;

                            }
                        }
                    } else {
                        $scope.adhaarOtp = '';
                        $scope.ShowAadhaarDetail = false;
                        $scope.verifybtndisable = false;
                        alert("Verfication fail, try again after sometime.");
                        $scope.ExamAppearDetails = false;
                        $scope.oldUser = false;
                        $scope.oldUser2 = true;
                        $scope.sscForm = false;
                        $scope.applicationForm = false;
                    }


                }, function (err) {
                    $scope.verifybtndisable = false;
                    console.log(res);
                });
            }
        }

        $scope.Continue = function () {

            if ($scope.adhaarno == '' || $scope.adhaarno == null) {
                alert("Aadhaar number Can't be Empty");
                return;
            }

            if ($scope.adhaarno.length != 12) {
                alert("Invalid Aadhaar number");
                return;
            }


            if ($scope.selectedgrade.CriteriaTypeId == 1) {
                $scope.ExamAppearDetails = false;
                $scope.oldUser = false;
                $scope.oldUser2 = false;
                $scope.sscForm = true;
                $scope.ShowAadhaarDetail = false;
                $scope.applicationForm = false;
            } else if ($scope.selectedgrade.CriteriaTypeId == 4 && ($scope.selectedgrade.QualificationGradeId == undefined || $scope.selectedgrade.QualificationGradeId == null)) {
                $scope.ExamAppearDetails = false;
                $scope.oldUser = false;
                $scope.oldUser2 = false;
                $scope.sscForm = false;
                $scope.ShowAadhaarDetail = false;
                $scope.applicationForm = true;
                $scope.isqualified1 = false;
                $scope.isqualified2 = false;
                $scope.isqualified3 = false;
            } else {
                $scope.ShowAadhaarDetail = false;
                $scope.ExamAppearDetails = false;
                $scope.oldUser = false;
                $scope.oldUser2 = false;
                $scope.sscForm = false;
                $scope.applicationForm = true;
                if ($scope.PreviousExam == true || $scope.QualifiedExam == true) {
                    $scope.isqualified1 = false;

                } else {
                    $scope.isqualified1 = true;

                }
                $scope.isqualified2 = false;
                if ($scope.QualifiedExam == true) {
                    $scope.isqualified3 = false;

                } else {
                    $scope.isqualified3 = true;

                }

            }

        }



        //------- load districts based on mode of exam-----------
        //$scope.loaddists = function (exammode) {
        //    $scope.Districts = [];       

        //    if (exammode == 1) {
        //        $scope.tmpmode = 1;
        //        $scope.Districts = $scope.onlineDistricts;
        //    } else if (exammode == 2) {
        //        $scope.tmpmode = 2;
        //        $scope.Districts = $scope.offlineDistricts;
        //    }

        //}

        $scope.Aadhaarback = function () {
            $scope.ShowAadhaarDetail = false;
            $scope.ExamAppearDetails = true;
            $scope.oldUser = false;
            $scope.oldUser2 = false;
            $scope.sscForm = false;
            $scope.applicationForm = false;
            $scope.isqualified1 = false;
            $scope.isqualified2 = false;
            $scope.isqualified3 = false;
        }


        $scope.ShowApplication = function () {
            $scope.sscForm = false;
            $scope.applicationForm = true;
            $scope.isqualified1 = true;
            $scope.isqualified2 = false;
            $scope.isqualified3 = false;

        }
        $scope.ShowLowerApplication = function () {
            $scope.oldUser2 = false;
            $scope.ShowAadhaarDetail = true;
            $scope.applicationForm = false;
            $scope.isqualified1 = true;
            // $scope.isqualified2 = true;
            $scope.isqualified3 = true;

        }

        $scope.getBatches = function (ExamDateselect) {
            $scope.exambatchList = [];
            $scope.ExamDateselected = JSON.parse(ExamDateselect);
            var getBatches = TwshStudentRegService.getBatches($scope.ExamDateselected.Id, $scope.selectedcourse.Id, $scope.selectedgrade.Id);
            getBatches.then(function (res) {
                $scope.exambatchList = res;
            }, function (err) {
                $scope.exambatchList = [];
            })
        }

        $scope.checkDate = function (CandidateNameDOB) {
            var currentDate = new Date();
            var birthdate = new Date(CandidateNameDOB);
            if (birthdate > currentDate) {
                alert('Selected Date Should not be Future!')
                $scope.CandidateNameDOB = '';
                return;
            } else {
                $scope.CandidateNameDOB = CandidateNameDOB;
            }
        }
        $scope.submitData = function (adhaarno) {

            $scope.maskedAadhaar = $scope.adhaarno.slice(0, 8).replace(/[0-9]/g, "X") + $scope.adhaarno.slice(-4);

            if (($scope.CandidateName == undefined || $scope.CandidateName == "" || $scope.CandidateName == null)) {
                alert("Please Enter Student Name .");
                return;
            }
            if (($scope.FatherName == undefined || $scope.FatherName == "" || $scope.FatherName == null)) {
                alert("Please Enter Father Name .");
                return;
            }
            if (($scope.MotherName == undefined || $scope.MotherName == "" || $scope.MotherName == null)) {
                alert("Please Enter Mother Name .");
                return;
            }
            if (($scope.CandidateNameDOB == undefined || $scope.CandidateNameDOB == "" || $scope.CandidateNameDOB == null)) {
                alert("Please Select Date Of Birth .");
                return;
            }
            if (($scope.Gender == undefined || $scope.Gender == "" || $scope.Gender == null)) {
                alert("Please Choose Gender.");
                return;
            }

            if (($scope.userPhoto == undefined || $scope.userPhoto == "" || $scope.userPhoto == null)) {
                alert("Please Upload Photo.");
                return;
            }

            if (($scope.TwshCourse == undefined || $scope.TwshCourse == "" || $scope.TwshCourse == null)) {
                alert("Please Enter Examination Appearing .");
                return;
            }


            if (($scope.TwshLanguage == undefined || $scope.TwshLanguage == "" || $scope.TwshLanguage == null)) {
                alert("Please Enter Language .");
                return;
            }

            if (($scope.TwshGrade == undefined || $scope.TwshGrade == "" || $scope.TwshGrade == null)) {
                alert("Please Enter Grade .");
                return;
            }

            if (($scope.District == undefined || $scope.District == "" || $scope.District == null)) {
                alert("Please Enter District .");
                return;
            }

            if (($scope.examCenter == undefined || $scope.examCenter == "" || $scope.examCenter == null)) {
                alert("Please Enter Center .");
                return;
            }


            //if (($scope.ExamDateselected.ExamDate == undefined || $scope.ExamDateselected.ExamDate == "" || $scope.ExamDateselected.ExamDate == null)) {
            //    alert("Please Enter ExamDateselect .");
            //    return;
            //}

            //if (($scope.date1 == undefined || $scope.date1 == "" || $scope.date1 == null)) {
            //    alert("Please Enter date1 .");
            //    return;
            //}

            //if (($scope.date2 == undefined || $scope.date2 == "" || $scope.date2 == null)) {
            //    alert("Please Enter date2 .");
            //    return;
            //}

            //if (($scope.date3 == undefined || $scope.date3 == "" || $scope.date3 == null)) {
            //    alert("Please Enter date3 .");
            //    return;
            //}

            //if (($scope.date4 == undefined || $scope.date4 == "" || $scope.date4 == null)) {
            //    alert("Please Enter date4 .");
            //    return;
            //}


            //if (($scope.date5 == undefined || $scope.date5 == "" || $scope.date5 == null)) {
            //    alert("Please Enter date5 .");
            //    return;
            //}


            if (($scope.houseNo == undefined || $scope.houseNo == "" || $scope.houseNo == null)) {
                alert("Please Enter houseNo .");
                return;
            }


            if (($scope.street == undefined || $scope.street == "" || $scope.street == null)) {
                alert("Please Enter street .");
                return;
            }

            if (($scope.village == undefined || $scope.village == "" || $scope.village == null)) {
                alert("Please Enter village .");
                return;
            }

            //if (($scope.mandal == undefined || $scope.mandal == "" || $scope.mandal == null)) {
            //    alert("Please Enter mandal .");
            //    return;
            //}

            if (($scope.district == undefined || $scope.district == "" || $scope.district == null)) {
                alert("Please Enter district .");
                return;
            }


            if (($scope.pincode == undefined || $scope.pincode == "" || $scope.pincode == null)) {
                alert("Please Enter pincode .");
                return;
            }

            if (($scope.mobileNO == undefined || $scope.mobileNO == "" || $scope.mobileNO == null)) {
                alert("Please Enter mobileNO .");
                return;
            }




            if ((angular.isUndefined($scope.exambatch) || $scope.exambatch == "") && $scope.tmpmode == 2) {
                alert('Please choose examination batch');
                return;
            }
            if ((angular.isUndefined($scope.IsBlind) || $scope.IsBlind == "") && $scope.tmpmode == 2) {
                alert("Please choose Isblind field.");
                return;
            }

            if (($scope.stdMedicalCert == undefined || $scope.stdMedicalCert == "" || $scope.stdMedicalCert == null) && $scope.IsBlind == 1) {
                alert("Please Upload Medical Certificate");
                return;
            }

            if ($scope.IsBlind == 1) {
                $scope.CheckBox = true;
            }
            else {
                $scope.CheckBox = false;
            }

            if ($scope.IsBlind == 1 && ($scope.Checkbox == undefined || $scope.Checkbox == "" || $scope.Checkbox == null)) {
                alert("Please agree terms and conditions .");
                return;
            }




            var reg = "[0-9]{1,2}[/][0-9]{1,2}[/][0-9]{4}";
            if ($scope.CandidateNameDOB.length == undefined) {
                if ($scope.CandidateNameDOB != null && $scope.CandidateNameDOB !== undefined) {
                    var datechange = moment($scope.CandidateNameDOB).format("DD/MM/YYYY HH:mm:ss");
                    var d = datechange.slice(0, 10).split('/');
                    if (d[2].length === 4) {
                        $scope.CandidateNameDOBchange = d[0] + "/" + d[1] + "/" + d[2];
                    }
                }
            } else {
                $scope.CandidateNameDOBchange = $scope.CandidateNameDOB
            }
            try {
                $scope.selectedCommunity = JSON.parse($scope.community);
                $scope.selectedCommunityname = $scope.selectedCommunity.CategoryCode;
            } catch (err) { };
            var selectedDist = JSON.parse($scope.District);
            $scope.examCenterDistrict = selectedDist.DistrictName;
            $scope.selectedexamCenter = JSON.parse($scope.examCenter);
            $scope.examCenterSel = $scope.selectedexamCenter.ExaminationCenterName;
            // $scope.ExamDateselected = JSON.parse($scope.ExamDateselect);
            if ($scope.tmpmode == 1) {
                //if (arr.length < 5) {
                //    alert("choose all exam dates");
                //    return;
                //}


                $scope.finalArray = arr.map(function (obj) {
                    return obj.date;
                });
                $scope.finalArray.forEach(function (dat) {
                    if (!$scope.availableDates.includes(dat)) {
                        alert("Examimation dates chosen was not valied,Please choose available dates displayed in the calender.");
                        return;
                    }
                });
                $scope.ExamDateSel = JSON.stringify($scope.finalArray).replace("/", "-");;
            } else if ($scope.tmpmode == 2) {
                $scope.ExamDateSel = $scope.ExamDateselected.ExamDate;
            }

            $scope.applicationForm = false;
            $scope.previewData = true;
            $scope.CheckBox = false;
            $scope.sscForm = false;
            $scope.ExamAppearDetails = false;
        }
        $scope.editData = function () {
            $scope.previewData = false;
            $scope.applicationForm = true;
            $scope.sscForm = false;
            $scope.ExamAppearDetails = false;
            if ($scope.IsBlind == 1) {
                $scope.CheckBox = true;
            }
            else {
                $scope.CheckBox = false;
            }


        }


        $scope.loadCourse = function () {
            $scope.courseinfo = [];
            $scope.languageinfo = [];
            var coursedetail = TwshStudentRegService.getCourses();
            coursedetail.then(function (req) {
                $scope.courseinfo = req
            }, function (err) {
                $scope.courseinfo = [];
                alert("no data found");
            });
        }

        $scope.LoadLanguage = function (courseId) {
            $scope.languageinfo = [];
            // course = JSON.parse(course);
            $scope.course_id = courseId.Id;
            var coursedetail = TwshStudentRegService.getlanguages(courseId.Id);
            coursedetail.then(function (req) {
                $scope.languageinfo = req
            }, function (err) {
                $scope.languageinfo = [];
                alert("no data found");
            });


        }

        $scope.LoadGrades = function (courseId, languageId) {
            $scope.LoadGradeinfo = [];
            // course = JSON.parse(course);
            // language = JSON.parse(language);
            if (languageId.Id != 1) {
                mode = 2
            }

            if (!angular.isUndefined(courseId) && !angular.isUndefined(languageId)) {
                var coursedetail = TwshStudentRegService.getGrades(courseId.Id, languageId.Id);
                coursedetail.then(function (req) {
                    $scope.LoadGradeinfo = req
                }, function (err) {
                    $scope.LoadGradeinfo = [];
                    alert("no data found");
                });
            }



        }
        $scope.GetPreviousExamDetails = function (preHallTicket, grade) {
            if (preHallTicket == '' || preHallTicket == null) {
                alert("HallTicket number can't be Empty");
                return;
            }
            // $scope.selectedgrade = JSON.parse(grade);
            var previousDetails = TwshStudentRegService.GetPreviousExamData(preHallTicket, grade.Id);
            previousDetails.then(function (res) {
                var gradeinfo = $scope.selectedgrade;
                if (res.length > 0) {
                    if (res[0].Result == "Fail" || res[0].Result == "FAIL") {
                        $scope.PreviousExam = true;
                        $scope.DetailsDisabled = true;
                        $scope.CandidateName = res[0].StudentName;
                        $scope.CandidateNamefound = $scope.CandidateName != "" ? true : false;
                        $scope.FatherName = res[0].FatherName;
                        $scope.FatherNamefound = $scope.FatherName != "" ? true : false;
                        $scope.MotherName = res[0].MotherName;
                        $scope.MotherNamefound = $scope.MotherName != "" ? true : false;
                        $scope.PreviousGradeNme = res[0].Gradename;
                        $scope.PreviousGradeCode = res[0].Gradecode;
                        $scope.qualifiedexamhall = res[0].HallTicketNumber;
                        $scope.CandidateNameDOB = res[0].DateOfBirth;
                        $scope.SscRollNo = res[0].SscHallTicket;
                        $scope.SscRollNofound = $scope.SscRollNo != "" ? true : false;
                        // $scope.CandidateNamefound = $scope.CandidateName != "" ? true : false;
                        // $scope.ShowAadhaarDetail = false;
                        $scope.ShowAadhaarDetail = true;
                        $scope.applicationForm = false;
                        $scope.ExamAppearDetails = false;
                        $scope.oldUser2 = false;
                        $scope.sscForm = false;
                        $scope.isqualified1 = false;
                        $scope.isqualified2 = false;
                        $scope.isqualified3 = false;
                    } else if (res[0].Result == "Pass" || res[0].Result == "PASS") {
                        $scope.PreviousExam = true;
                        $scope.DetailsDisabled = true;
                        $scope.CandidateName = res[0].StudentName;
                        $scope.CandidateNamefound = $scope.CandidateName != "" ? true : false;
                        $scope.FatherName = res[0].FatherName;
                        $scope.FatherNamefound = $scope.FatherName != "" ? true : false;
                        $scope.MotherName = res[0].MotherName;
                        $scope.MotherNamefound = $scope.MotherName != "" ? true : false;
                        $scope.PreviousGradeNme = res[0].Gradename;
                        $scope.PreviousGradeCode = res[0].Gradecode;
                        $scope.MotherName = res[0].MotherName;
                        $scope.qualifiedexamhall = res[0].HallTicketNumber;
                        $scope.CandidateNameDOB = res[0].DateOfBirth;
                        $scope.SscRollNo = res[0].SscHallTicket;
                        $scope.SscRollNofound = $scope.SscRollNo != "" ? true : false;
                        $scope.PreviousResult = res[0].Result;
                        $scope.ShowAadhaarDetail = true;
                        $scope.applicationForm = false;
                        $scope.ExamAppearDetails = false;
                        $scope.oldUser2 = false;
                        $scope.sscForm = false;
                        $scope.isqualified1 = false;
                        $scope.isqualified2 = false;
                        $scope.isqualified3 = false;
                        //alert("Please Check your Hallticket No.");
                        //$state.go("TWSH.OnlineApplication");
                    }

                } else {
                    if (gradeinfo.CriteriaTypeId == '1') {
                        alert("Details Not found, Continue with filling the Application");
                        $scope.ShowAadhaarDetail = true;
                        $scope.sscForm = false;
                        $scope.ExamAppearDetails = false;
                    } else if (gradeinfo.CriteriaTypeId == 4 && (gradeinfo.QualificationGradeId == undefined || gradeinfo.QualificationGradeId == null)) {
                        $scope.ShowAadhaarDetail = true;
                        $scope.ExamAppearDetails = false;
                        $scope.oldUser = false;
                        $scope.oldUser2 = false;
                        $scope.sscForm = false;
                        $scope.applicationForm = true;
                        $scope.isqualified1 = false;
                        $scope.isqualified2 = false;
                        $scope.isqualified3 = false;

                    } else {
                        alert("Details Not found, Try to get details using Lower Exam HallTicket No");
                        $scope.oldUser2 = true;
                        $scope.sscForm = false;
                        $scope.isqualified1 = false;
                        $scope.isqualified2 = true;
                        $scope.isqualified3 = false;
                        $scope.applicationForm = false;
                        $scope.ShowAadhaarDetail = false;
                        $scope.ExamAppearDetails = false;
                    }
                }
            }, function (err) {

            });
        }

        $scope.GetQualificationExamDetails = function (preHallTicket, grade) {
            if (preHallTicket == '' || preHallTicket == null) {
                alert("HallTicket number can't be Empty");
                return;
            }
            // $scope.selectedgrade = JSON.parse(grade);
            var previousDetails = TwshStudentRegService.GetQualifiedExamData(preHallTicket, $scope.selectedgrade.QualificationGradeId);
            previousDetails.then(function (res) {
                if (res.length > 0) {
                    if (res[0].Result == "Pass" || res[0].Result == "PASS") {
                        $scope.QualifiedExam = true;
                        $scope.CandidateName = res[0].StudentName;
                        $scope.CandidateNamefound = $scope.CandidateName != "" ? true : false;
                        $scope.ShowAadhaarDetail = true;
                        $scope.applicationForm = false;
                        $scope.ExamAppearDetails = false;
                        $scope.oldUser2 = false;
                        $scope.sscForm = false;
                        $scope.isqualified1 = false;
                        $scope.isqualified2 = false;
                        $scope.isqualified3 = false;
                    } else {
                        if (res[0].Result == "Fail" || res[0].Result == "FAIL") {

                            alert("Eligibility Criteria not fullfilled.");
                            $state.go("TWSH.OnlineApplication");
                        }
                    }
                } else {
                    alert("Details Not found, Continue with filling the Application");
                    $scope.ShowAadhaarDetail = true;
                    $scope.applicationForm = false;
                    $scope.oldUser2 = false;
                    $scope.ExamAppearDetails = false;
                    $scope.isqualified1 = false;
                    $scope.isqualified2 = false;
                    $scope.isqualified3 = true;

                }
            }, function (err) {

            });
        }

        //var ExamCenters = TwshStudentRegService.getonlineExaminationCenters(1, 3);
        //ExamCenters.then(function (res) {
        //    $scope.availableDates = [];
        //    $scope.examCenterList = res.Table;
        //    $scope.OnlineExamDates = res.Table1;
        //    for (var i = 0; i < res.Table1.length; i++) {
        //        $scope.availableDates.push(res.Table1[i].Date);
        //    }
        //    $scope.showpicker = true;
        //}, function (err) {
        //    $scope.examCenterList = [];
        //    $scope.OnlineExamDates = [];
        //    alert("no data found");
        //    });





        $scope.LoadExamCenters = function (DistrictId) {

            $scope.examCenterList = [];
            try {
                $scope.SelectedDistrictId = JSON.parse(DistrictId);
                // var course = JSON.parse($scope.course); 
            } catch (er) { }


            if ($scope.mode == 1) {
                //-------------------Load online exam Centers-----------------------
                var ExamCenters = TwshStudentRegService.getonlineExaminationCenters($scope.selectedcourse.Id, $scope.SelectedDistrictId.Id);
                ExamCenters.then(function (res) {
                    $scope.availableDates = [];
                    $scope.examCenterList = res.Table;
                    $scope.OnlineExamDates = res.Table1;
                    for (var i = 0; i < res.Table1.length; i++) {
                        $scope.availableDates.push(res.Table1[i].Date);
                    }

                }, function (err) {
                    $scope.examCenterList = [];
                    $scope.OnlineExamDates = [];
                    alert("no data found");
                });

            } else if ($scope.mode == 2) {
                //-----------------load offline Exam Centers----------------------
                //var ExamCenters = TwshStudentRegService.getExaminationCenters(parseInt($scope.UserId), $scope.SelectedDistrictId.Id, $scope.selectedcourse.Id, $scope.selectedgrade.Id);
                var ExamCenters = TwshStudentRegService.getExaminationCenters(-1, $scope.SelectedDistrictId.Id, $scope.selectedcourse.Id, $scope.selectedgrade.Id);
                ExamCenters.then(function (req) {
                    $scope.examCenterList = req
                }, function (err) {
                    $scope.examCenterList = [];
                    alert("no data found");
                });
            }

        }




        $scope.getssc = function (sscHallticket, passedoutYear, sscType) {
            if (sscHallticket == '' || sscHallticket == null) {
                alert("SSC HallTicket number can't be Empty");
                return;
            }
            if (passedoutYear == '' || passedoutYear == null) {
                alert("SSC passedout year can't be Empty");
                return;
            }


            var reqData = {
                RollNo: sscHallticket,
                Year: passedoutYear,
                Stream: sscType
            };
            
                var sscdetails = TwshStudentRegService.getSSCDetails(reqData);
                sscdetails.then(function (res) {
                    if (res) {

                        let resdata = JSON.parse(res)
                        if (resdata.Status == 200) {
                            $scope.applicationForm = true;
                            $scope.CandidateName = resdata.Name;
                            $scope.CandidateNamefound = $scope.CandidateName != "" ? true : false;
                            $scope.FatherName = resdata.FatherName;
                            $scope.FatherNamefound = $scope.FatherName != "" ? true : false;
                            $scope.MotherName = resdata.MotherName;
                            $scope.MotherNamefound = $scope.MotherName != "" ? true : false;
                            $scope.SscRollNo = resdata.RollNo;
                            $scope.SscRollNofound = $scope.SscRollNo != "" ? true : false;
                            $scope.Gender = resdata.Sex == "B" || resdata.Sex == "M" ? "M" : resdata.Sex == "G" || resdata.Sex == "F" ? "F" : "";
                            $scope.Genderfound = $scope.Gender != "" ? true : false;
                            let date1 = resdata.DateOfBirth;
                            let ch = date1.split('');
                            var datelength = ch.length;
                            //    var tempdate = "";                             
                            //    var regex = "^[0-9]{1,6}$";
                            //    if (datelength<=6) {                      
                            //        if (parseInt(ch[4] + ch[5]) <= 99 && parseInt(ch[4] + ch[5]) > 80) {
                            //            tempdate = ch[0] + ch[1] + "/" + ch[2] + ch[3] + "/19" + ch[4] + ch[5];
                            //        } else {
                            //            tempdate = ch[0] + ch[1] + "/" + ch[2] + ch[3] + "/20" + ch[4] + ch[5];
                            //        }
                            //    }
                            //    else if (datelength <= 8 && datelength >= 6){                               
                            //        tempdate = ch[0] + ch[1] + "/" + ch[2] + ch[3] + "/" + ch[4] + ch[5] + ch[6] + ch[7];                               
                            //}          

                            //    else {
                            //        tempdate = resdata.DateOfBirth;                        

                            //    }                           
                            //    $scope.CandidateNameDOB = tempdate;
                            //    $scope.CandidateNameDOBchange = tempdate;
                            //    $scope.CandidateNameDOBfound = $scope.CandidateNameDOB != "" ? true : false;

                            $scope.sscForm = false;

                        } else {
                            alert("Details not found, Continue to fillApplication");
                            $scope.applicationForm = true;
                            $scope.sscForm = false;
                            $scope.isqualified1 = true;
                        }
                    } else {
                        alert("Details not found, Continue to fillApplication");
                        $scope.applicationForm = true;
                        $scope.sscForm = false;
                        $scope.isqualified1 = true;
                    }

                }, function (err) {
                    alert("Details not found, Continue to fillApplication");
                    $scope.applicationForm = true;
                    $scope.sscForm = false;
                    $scope.isqualified1 = true;
                })
            }

        
        var communitylist = TwshStudentRegService.getCategory()
        communitylist.then(function (res) {
            $scope.communities = res;
        }, function (err) {

        });


        //$scope.uploadPhoto = function () {
        //    var input = document.getElementById("stdPhotoFile");
        //    var fileSize = input.files[0].size;
        //    console.log(fileSize);
        //    if (fileSize <= 50000) {
        //        if (input.files && input.files[0]) {
        //            var reader = new FileReader();
        //            reader.readAsDataURL(input.files[0]);
        //            reader.onload = function (e) {
        //                $('#stdPhotoImg').attr('src', e.target.result);

        //                var canvas = document.createElement("canvas");
        //                var imageElement = document.createElement("img");

        //                imageElement.setAttribute = $('<img>', { src: e.target.result });
        //                var context = canvas.getContext("2d");
        //                imageElement.setAttribute.one("load", function () {
        //                    canvas.width = this.width;
        //                    canvas.height = this.height;
        //                    context.drawImage(this, 0, 0);
        //                    var base64Image = canvas.toDataURL("image/png");
        //                    $scope.userPhoto = base64Image;
        //                });


        //            }
        //            reader.onerror = function (e) {
        //                console.error("File could not be read! Code " + e.target.error.code);
        //            };

        //        }
        //    }
        //    else {
        //        alert("file size should be less then 50kb ");
        //        return;
        //    }
        //}



        $scope.uploadPhoto = function () {
            var input = document.getElementById("stdPhotoFile");
            var fileSize = input.files[0].size;

            if (fileSize <= 50000 && fileSize >= 25000) {
                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    reader.readAsDataURL(input.files[0]);
                    reader.onload = function (e) {
                        $('#stdPhotoImg').attr('src', e.target.result);

                        var canvas = document.createElement("canvas");
                        var imageElement = document.createElement("img");

                        imageElement.setAttribute = $('<img>', {
                            src: e.target.result
                        });
                        var context = canvas.getContext("2d");
                        imageElement.setAttribute.one("load", function () {
                            canvas.width = this.width;
                            canvas.height = this.height;
                            context.drawImage(this, 0, 0);
                            var base64Image = canvas.toDataURL("image/png");
                            $scope.userPhoto = base64Image;

                        });


                    }
                    reader.onerror = function (e) {
                        console.error("File could not be read! Code " + e.target.error.code);
                    };

                }
            } else if (fileSize <= 25000) {
                alert("Photo size should be greater than 25KB");
                $('#stdPhotoFile').val('');
                return;
            } else if (fileSize >= 50000) {
                alert("Photo size should be less than 50KB");
                $('#stdPhotoFile').val('');
                return;
            } else {
                alert("file size should be between 25KB and 50KB");
                $('#stdPhotoFile').val('');
                return;
            }
        }


        $scope.toDataURL = function (url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                var reader = new FileReader();
                reader.onloadend = function () {
                    callback(reader.result);
                }
                reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.send();
        }

        var tempId = [];
        var arr = [];
        var finalarr = [];
        var finalarr1 = [];
        $scope.dates = function (date, option) {
            if (date != null && finalarr.includes(date) && !angular.isUndefined(date)) {
                alert("This day is already taken, Please choose another day");
                $("#datepicker" + option).datepicker('setDate', null);

            }


            if (arr.length > 0 && !angular.isUndefined(date)) {
                arr.map((obj) => {
                    if (obj.opt == option) {
                        obj.date = date;
                        tempId.push(option);
                    }
                    if (obj.opt != option && !tempId.includes(option)) {
                        arr.push({ "opt": option, "date": date });
                        tempId.push(option);
                    }
                });
            } else if (arr.length == 0 && !angular.isUndefined(date)) {
                arr.push({ "opt": option, "date": date });
            }

            if (!angular.isUndefined(date) && arr.length > 0) {
                finalarr = [];
                finalarr = arr.map(value => value.date);
            }

        }



        $scope.uploadSscCert = function () {
            var input = document.getElementById("stdSscCertFile");
            var fileSize = input.files[0].size;
            console.log(fileSize);
            if (fileSize <= 200000) {
                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    reader.readAsDataURL(input.files[0]);
                    reader.onload = function (e) {
                        $('#stdSscCert').attr('src', e.target.result);

                        var canvas = document.createElement("canvas");
                        var imageElement = document.createElement("img");

                        imageElement.setAttribute = $('<img>', { src: e.target.result });
                        var context = canvas.getContext("2d");
                        imageElement.setAttribute.one("load", function () {
                            canvas.width = this.width;
                            canvas.height = this.height;
                            context.drawImage(this, 0, 0);
                            var base64Image = canvas.toDataURL("image/png");
                            $scope.stdSscCert = base64Image;
                        });

                    }
                    reader.onerror = function (e) {
                        console.error("File could not be read! Code " + e.target.error.code);
                    };

                }
            }
            else if (fileSize <= 200000) {
                alert("file size should be less than 200KB");
                $('#stdSscCertFile').val('');
                return;
            }
            //else if (fileSize >= 100000) {
            //    alert("file size should greater than 100KB");
            //    $('#stdSscCertFile').val('');
            //    return;
            //}
            else {
                alert("file size should be between 100KB and 200KB");
                $('#stdSscCertFile').val('');
                return;
            }
        }



        $scope.uploadInterCert = function () {
            var input = document.getElementById("StdinterCertoFile");
            var fileSize = input.files[0].size;
            console.log(fileSize);
            if (fileSize <= 200000 && fileSize >= 100000) {
                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    reader.readAsDataURL(input.files[0]);
                    reader.onload = function (e) {
                        $('#StdinterCert').attr('src', e.target.result);

                        var canvas = document.createElement("canvas");
                        var imageElement = document.createElement("img");

                        imageElement.setAttribute = $('<img>', { src: e.target.result });
                        var context = canvas.getContext("2d");
                        imageElement.setAttribute.one("load", function () {
                            canvas.width = this.width;
                            canvas.height = this.height;
                            context.drawImage(this, 0, 0);
                            var base64Image = canvas.toDataURL("image/png");
                            $scope.StdinterCert = base64Image;
                        });

                    }
                    reader.onerror = function (e) {
                        console.error("File could not be read! Code " + e.target.error.code);
                    };

                }
            }
            else if (fileSize <= 200000) {
                alert("file size should be less than 200KB");
                $('#StdinterCertoFile').val('');
                return;
            } else if (fileSize >= 100000) {
                alert("file size should be greater than 100KB");
                $('#StdinterCertoFile').val('');
                return;
            } else {
                alert("file size should be between 100KB and 200KB");
                $('#StdinterCertoFile').val('');
                return;
            }
        }

        $scope.uploadQualCert = function () {
            var input = document.getElementById("QualifiedCertoFile");
            var fileSize = input.files[0].size;
            console.log(fileSize);
            if (fileSize <= 200000 && fileSize >= 100000) {
                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    reader.readAsDataURL(input.files[0]);
                    reader.onload = function (e) {
                        $('#QualifiedCert').attr('src', e.target.result);

                        var canvas = document.createElement("canvas");
                        var imageElement = document.createElement("img");

                        imageElement.setAttribute = $('<img>', { src: e.target.result });
                        var context = canvas.getContext("2d");
                        imageElement.setAttribute.one("load", function () {
                            canvas.width = this.width;
                            canvas.height = this.height;
                            context.drawImage(this, 0, 0);
                            var base64Image = canvas.toDataURL("image/png");
                            $scope.qualifiedexamCert = base64Image;
                        });

                    }
                    reader.onerror = function (e) {
                        console.error("File could not be read! Code " + e.target.error.code);
                    };

                }
            }
            else if (fileSize <= 200000) {
                alert("file size should be less than 200KB");
                $('#QualifiedCertoFile').val('');
                return;
            } else if (fileSize >= 100000) {
                alert("file size should be greater than 100KB");
                $('#QualifiedCertoFile').val('');
                return;
            } else {
                alert("file size should be between 100KB and 200KB");
                $('#QualifiedCertoFile').val('');
                return;
            }
        }

        $scope.uploadMedicalCert = function () {
            var input = document.getElementById("stdMedicalCertFile");
            var fileSize = input.files[0].size;
            console.log(fileSize);
            if (fileSize <= 200000 && fileSize >= 100000) {
                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    reader.readAsDataURL(input.files[0]);
                    reader.onload = function (e) {
                        $('#stdMedicalCert').attr('src', e.target.result);

                        var canvas = document.createElement("canvas");
                        var imageElement = document.createElement("img");

                        imageElement.setAttribute = $('<img>', { src: e.target.result });
                        var context = canvas.getContext("2d");
                        imageElement.setAttribute.one("load", function () {
                            canvas.width = this.width;
                            canvas.height = this.height;
                            context.drawImage(this, 0, 0);
                            var base64Image = canvas.toDataURL("image/png");
                            $scope.stdMedicalCert = base64Image;
                        });

                    }
                    reader.onerror = function (e) {
                        console.error("File could not be read! Code " + e.target.error.code);
                    };

                }
            }
            else if (fileSize <= 200000) {
                alert("file size should not be less than 200KB");
                $('#stdMedicalCertFile').val('');
                return;
            } else if (fileSize >= 100000) {
                alert("file size should not be greater than 100KB");
                $('#stdMedicalCertFile').val('');
                return;
            } else {
                alert("file size should be between 100KB and 200KB");
                $('#stdMedicalCertFile').val('');
                return;
            }
        }


        $scope.submitApplication = function () {

            var EncriptedAadhar = $crypto.encrypt($crypto.encrypt($scope.adhaarno, 'HBSBP9214EDU00TS'), $scope.EKey) + '$$@@$$' + $scope.EKey;
            var req = {
                "UserId": $scope.UserId == null || $scope.UserId == undefined ? "" : $scope.UserId,
                "StudentName": $scope.CandidateName == null || $scope.CandidateName == undefined ? "" : $scope.CandidateName,
                "FatherName": $scope.FatherName == null || $scope.FatherName == undefined ? "" : $scope.FatherName,
                "MotherName": $scope.MotherName == null || $scope.MotherName == undefined ? "" : $scope.MotherName,
                "Aadhaar": $scope.adhaarno == null || $scope.adhaarno == undefined ? "" : EncriptedAadhar,
                "Gender": $scope.Gender == null || $scope.Gender == undefined ? "" : $scope.Gender,
                "StudentPhoneNumber": $scope.mobileNO == null || $scope.mobileNO == undefined ? "" : $scope.mobileNO,
                "CourseId": $scope.selectedcourse.Id == null || $scope.selectedcourse.Id == undefined ? "" : $scope.selectedcourse.Id,
                "LanguageId": $scope.selectedlanguage.Id == null || $scope.selectedlanguage.Id == undefined ? "" : $scope.selectedlanguage.Id,
                "GradeId": $scope.selectedgrade.Id == null || $scope.selectedgrade.Id == undefined ? "" : $scope.selectedgrade.Id,
                "MonthYearId": $scope.MonthYearId == null || $scope.MonthYearId == undefined ? "" : $scope.MonthYearId,
                "ExamDistrictId": $scope.SelectedDistrictId.Id == null || $scope.SelectedDistrictId.Id == undefined ? "" : $scope.SelectedDistrictId.Id,
                "ExamCenterId": $scope.selectedexamCenter.Id == null || $scope.selectedexamCenter.Id == undefined ? "" : $scope.selectedexamCenter.Id,
                "ExamDate": $scope.ExamDateSel == null || $scope.ExamDateSel == undefined ? "" : $scope.ExamDateSel,
                "ExamBatch": $scope.exambatch == null || $scope.exambatch == undefined ? "" : $scope.exambatch,
                "DistrictId": $scope.SelectedDistrictId.Id == null || $scope.SelectedDistrictId.Id == undefined ? "" : $scope.SelectedDistrictId.Id,
                "IsBlind": $scope.IsBlind == null || $scope.IsBlind == undefined ? "" : $scope.IsBlind,
                "DateOfBirth": $scope.CandidateNameDOBchange == null || $scope.CandidateNameDOBchange == undefined ? "" : $scope.CandidateNameDOBchange,
                "CategoryId": "",
                "HnoStreet": $scope.houseNo + "," + $scope.street == null || $scope.houseNo + "," + $scope.street == undefined ? "" : $scope.houseNo + "," + $scope.street,
                "VillageTown": $scope.village == null || $scope.village == undefined ? "" : $scope.village + ',' + $scope.mandal + ',' + $scope.district + ',' + $scope.pincode,
                "EmailId": $scope.email == null || $scope.email == undefined ? "" : $scope.email,
                "SscHallTicket": $scope.SscRollNo == null || $scope.SscRollNo == undefined ? "" : $scope.SscRollNo,
                "InterHallTicket": $scope.InterRollNo == null || $scope.InterRollNo == undefined ? "" : $scope.InterRollNo,
                "LowerGradeHallTicket": $scope.qualifiedexamhall == null || $scope.qualifiedexamhall == undefined ? "" : $scope.qualifiedexamhall,
                "File1": $scope.stdSscCert == null || $scope.stdSscCert == undefined ? "" : $scope.stdSscCert,
                "File2": $scope.qualifiedexamCert == null || $scope.qualifiedexamCert == undefined ? "" : $scope.qualifiedexamCert,
                "File3": $scope.stdMedicalCert == null || $scope.stdMedicalCert == undefined ? "" : $scope.stdMedicalCert,
                "Photo": $scope.userPhoto == null || $scope.userPhoto == undefined ? "" : $scope.userPhoto,
                "mode": $scope.mode == null || $scope.mode == undefined ? "" : $scope.mode,
            }
            $scope.btndisable = true;
            $scope.selectedcourse.CourseName;
            $scope.TwshLanguage = $scope.selectedlanguage.LanguageName;
            $scope.TwshGrade = $scope.selectedgrade.GradeName;
            var regstudent = TwshStudentRegService.SubmitApplication(req);
            regstudent.then(function (res) {
                res = JSON.parse(res);
                if (res.Status == "200") {
                    alert(res.respdesc);
                    $scope.applicationsuccess = true;
                    $scope.previewData = false;
                    $scope.btndisable = false;
                    $scope.ApplicationNo = res.ApplicationNo;
                } else if (res.Status == "406") {
                    alert(res.respdesc);
                    $scope.applicationsuccess = false;
                    $scope.previewData = true;
                    $scope.btndisable = false;
                }
                else {
                    alert("submit failed, some input fields are missing try again.");
                }
            }, function (err) {
                $scope.btndisable = false;
            });

        }
        $scope.cancel = function () {
            $state.go("TWSH.Home");
        }
        $scope.payfee = function () {
            // $localStorage.Twsh = "";
            // var twsh = {
            //     ApplicationNo: $scope.ApplicationNo,
            // }
            AppSettings.applicationno = $scope.ApplicationNo;
            if ($localStorage.Twsh != undefined && $localStorage.Twsh != "") {
                $localStorage.Twsh.ApplicationNo = "";
                $localStorage.Twsh.ApplicationNo = $scope.ApplicationNo
            }

            // $localStorage.Twsh = twsh;
            $state.go("TWSH.FeePayment");
        }

    });

});