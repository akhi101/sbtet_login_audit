﻿define(['app'], function (app) {
    app.controller("AttendanceExemptionAppController", function ($http, $scope, $state, $stateParams, AppSettings, AttendanceExemptionAppService) {
        $scope.AttendanceExemptionApp = { AttendExID: $stateParams.AttendExID };
        var ProcRegex = /^[0-9a-zA-Z\-.," '!]+$/;
        $scope.NewStudDetailsHide = true;
        $scope.SecondYearStudDetailsHide = true;
        $scope.Status1Hide = true;
        $scope.Status2Hide = true;
        $scope.Status3Hide = true;
        $scope.SecondCompletYearStudDetailsHide = true;
        $scope.SSCMarksAndTCPrivateCertHide = true;
        $scope.ForeignCertHide = true;
        $scope.InterTCandMarksMemoCertHide = true;
        $scope.DigitalSignHide = true;
        $scope.SubmitHide = true;
        $scope.Approver1RemarkRO = true;
        $scope.Star1Hide = true;
        $scope.Approver2RemarkRO = true;
        $scope.Star2Hide = true;
        $scope.Approver3RemarkRO = true;
        $scope.Star3Hide = true;

        $scope.AdditionalLanguageHide1 = true;
        $scope.AdditionalLanguageHide2 = true;
        $scope.AdditionalSubjectMaths1AB = true;
        $scope.AdditionalSubjectMaths2AB = true;
        $scope.BridgeCourseMaths1and2 = true;


        var UserGrp = "";
        if (AppSettings.SysUsrGrpID == 9) { //Sup 4
            UserGrp = "O";
            //$scope.Approver2 = false;
            //$scope.Approver1 = false;
        } else if (AppSettings.SysUsrGrpID == 2) {  //DS
            UserGrp = "A";
            //$scope.Approver2 = false;
            //$scope.Approver1 = true;
            //$scope.FirstLoginStatus = true;
        }
        else if (AppSettings.SysUsrGrpID == 11) {   //JS
            UserGrp = "J";
            //$scope.FirstLoginStatus = true;
            //$scope.SecondLoginStatus = true;
            //$scope.Approver2 = true;
            //$scope.Approver1 = true;

        }
        $scope.CheckProcess = function () {
            if (AppSettings.SysUsrGrpID == 2) {
                if (!ProcRegex.test($scope.MediumChangeApp.ProcessRemark1)) {
                    $scope.MediumChangeApp.ProcessRemark1 = $scope.MediumChangeApp.ProcessRemark1.slice(0, -1);
                }
            }
            else {
                if (!ProcRegex.test($scope.MediumChangeApp.ProcessRemark)) {
                    $scope.MediumChangeApp.ProcessRemark = $scope.MediumChangeApp.ProcessRemark.slice(0, -1);
                }
            }
        }

        //$scope.PrintDisable = true;
        var AttendanceExemptionAppdata = AttendanceExemptionAppService.GetReqAttendanceExemptionByID($scope.AttendanceExemptionApp.AttendExID);
        AttendanceExemptionAppdata.then(function (data) {
            $scope.AttendanceExemptionApp = data[0];
            if (AppSettings.SysUsrGrpID == 9) {//4
                if ($scope.AttendanceExemptionApp.IntermedieteType == '1') {
                    if (data[0].ReqStatus == 'P') { $scope.AttendanceExemptionApp.ReqStatus = "0"; }
                    if (data[0].ReqStatus == 'A' || data[0].ReqStatus == 'R') {
                        if ($scope.AttendanceExemptionApp.StudYear == 'Ist Year') {
                            $scope.NewStudDetailsHide = false;              // After Show data SUP Approved/Rejected status (Ist Year Study Student)
                            $scope.SecondYearStudDetailsHide = true;
                            $scope.SecondCompletYearStudDetailsHide = true;
                            $scope.SubmitHide = true;

                            $scope.Status1Hide = false;
                            $scope.Approver1RemarkRO = true;
                            $scope.Star1Hide = true;

                            $scope.Status2Hide = true;
                            $scope.Approver2RemarkRO = true;
                            $scope.Star2Hide = true;

                            $scope.Status3Hide = true;
                            $scope.Approver3RemarkRO = true;
                            $scope.Star3Hide = true;
                        }
                        else if ($scope.AttendanceExemptionApp.StudYear == 'I&IInd Year') {
                            $scope.NewStudDetailsHide = true;               // After Show data SUP Approved/Rejected status (I&IInd Year Study Student)
                            $scope.SecondYearStudDetailsHide = false;
                            $scope.SecondCompletYearStudDetailsHide = true;
                            $scope.SubmitHide = true;

                            $scope.Status1Hide = false;
                            $scope.Approver1RemarkRO = true;
                            $scope.Star1Hide = true;

                            $scope.Status2Hide = true;
                            $scope.Approver2RemarkRO = true;
                            $scope.Star2Hide = true;

                            $scope.Status3Hide = true;
                            $scope.Approver3RemarkRO = true;
                            $scope.Star3Hide = true;

                        }
                    }
                    else {
                        if ($scope.AttendanceExemptionApp.StudYear == 'Ist Year') {
                            $scope.NewStudDetailsHide = false;                  //First time Approved/Rejectd SUP (Ist year Study Student)
                            $scope.SecondYearStudDetailsHide = true;
                            $scope.SecondCompletYearStudDetailsHide = true;
                            $scope.SubmitHide = false;
                            $scope.Status1Hide = false;
                            $scope.Star1Hide = false;
                            $scope.Approver1RemarkRO = false;
                            $scope.Status2Hide = true;
                            $scope.Status3Hide = true;
                            $scope.SSCMarksAndTCPrivateCertHide = false;
                            $scope.ForeignCertHide = true;
                            $scope.InterTCandMarksMemoCertHide = true;
                        }
                        else if ($scope.AttendanceExemptionApp.StudYear == 'I&IInd Year') {
                            $scope.NewStudDetailsHide = false;                   //First time Approved/Rejectd SUP (I&IInd year Study Student)
                            $scope.SecondYearStudDetailsHide = true;
                            $scope.SecondCompletYearStudDetailsHide = true;
                            $scope.SubmitHide = false;
                            $scope.Status1Hide = false;
                            $scope.Star1Hide = false;
                            $scope.Approver1RemarkRO = false;
                            $scope.Status2Hide = true;
                            $scope.Status3Hide = true;
                            $scope.SSCMarksAndTCPrivateCertHide = false;
                            $scope.ForeignCertHide = true;
                            $scope.InterTCandMarksMemoCertHide = true;
                        }
                    }
                }
                else { //IntermedieteType=2
                    if (data[0].ReqStatus == 'P') { $scope.AttendanceExemptionApp.ReqStatus = "0"; }
                    if (data[0].ReqStatus == 'A' || data[0].ReqStatus == 'R') {
                        if ($scope.AttendanceExemptionApp.StudYear == 'Ist Year') {
                            $scope.NewStudDetailsHide = false;              // After Show data SUP Approved/Rejected status (1st Year Study Student)
                            $scope.SecondYearStudDetailsHide = true;
                            $scope.SecondCompletYearStudDetailsHide = true;
                            $scope.SubmitHide = true;

                            $scope.Status1Hide = false;
                            $scope.Approver1RemarkRO = true;
                            $scope.Star1Hide = true;

                            $scope.Status2Hide = true;
                            $scope.Approver2RemarkRO = true;
                            $scope.Star2Hide = true;

                            $scope.Status3Hide = true;
                            $scope.Approver3RemarkRO = true;
                            $scope.Star3Hide = true;
                        }
                        else if ($scope.AttendanceExemptionApp.StudYear == 'I&IInd Year') {
                            $scope.NewStudDetailsHide = true;               // After Show data SUP Approved/Rejected status (2nd Year Study Student)
                            $scope.SecondYearStudDetailsHide = false;
                            $scope.SecondCompletYearStudDetailsHide = true;
                            $scope.SubmitHide = true;

                            $scope.Status1Hide = false;
                            $scope.Approver1RemarkRO = true;
                            $scope.Star1Hide = true;

                            $scope.Status2Hide = true;
                            $scope.Approver2RemarkRO = true;
                            $scope.Star2Hide = true;

                            $scope.Status3Hide = true;
                            $scope.Approver3RemarkRO = true;
                            $scope.Star3Hide = true;

                        }
                        else {
                            $scope.NewStudDetailsHide = true;        // After Show data SUP Approved/Rejected status (2nd year Complet Student)
                            $scope.SecondYearStudDetailsHide = true;
                            $scope.SecondCompletYearStudDetailsHide = false;
                            $scope.SubmitHide = true;

                            $scope.Status1Hide = false;
                            $scope.Approver1RemarkRO = true;
                            $scope.Star1Hide = true;

                            $scope.Status2Hide = true;
                            $scope.Approver2RemarkRO = true;
                            $scope.Star2Hide = true;

                            $scope.Status3Hide = true;
                            $scope.Approver3RemarkRO = true;
                            $scope.Star3Hide = true;
                        }

                    }
                    else {
                        if ($scope.AttendanceExemptionApp.StudYear == 'Ist Year') {
                            $scope.NewStudDetailsHide = false;                  //First time Approved/Rejectd SUP (1st year Study Student)
                            $scope.SecondYearStudDetailsHide = true;
                            $scope.SecondCompletYearStudDetailsHide = true;

                            $scope.SubmitHide = false;

                            $scope.Status1Hide = false;
                            $scope.Star1Hide = false;
                            $scope.Approver1RemarkRO = false;

                            $scope.Status2Hide = true;
                            $scope.Status3Hide = true;

                            $scope.SSCMarksAndTCPrivateCertHide = false;
                            $scope.ForeignCertHide = true;
                            $scope.InterTCandMarksMemoCertHide = true;


                        }
                        else if ($scope.AttendanceExemptionApp.StudYear == 'I&IInd Year') {
                            $scope.NewStudDetailsHide = true;                   //First time Approved/Rejectd SUP (2nd year Study Student)
                            $scope.SecondYearStudDetailsHide = false;
                            $scope.SecondCompletYearStudDetailsHide = true;

                            $scope.SubmitHide = false;

                            $scope.Status1Hide = false;
                            $scope.Star1Hide = false;
                            $scope.Approver1RemarkRO = false;

                            $scope.Status2Hide = true;
                            $scope.Status3Hide = true;

                            $scope.SSCMarksAndTCPrivateCertHide = true;
                            $scope.ForeignCertHide = true;
                            $scope.InterTCandMarksMemoCertHide = false;
                        }
                        else {                                          //First time Approved/Rejectd SUP (2nd year Complet Student)
                            $scope.NewStudDetailsHide = false;
                            $scope.SecondYearStudDetailsHide = true;
                            $scope.SecondCompletYearStudDetailsHide = false;

                            $scope.SubmitHide = false;

                            $scope.Status1Hide = false;
                            $scope.Star1Hide = false;
                            $scope.Approver1RemarkRO = false;

                            $scope.Status2Hide = true;
                            $scope.Status3Hide = true;

                            $scope.SSCMarksAndTCPrivateCertHide = true;
                            $scope.ForeignCertHide = true;
                            $scope.InterTCandMarksMemoCertHide = false;
                        }
                    }
                }

            }








            else if (AppSettings.SysUsrGrpID == 2) {
                if (data[0].ReqStatus1 == 'P') { $scope.AttendanceExemptionApp.ReqStatus1 = "0"; }
                if (data[0].ReqStatus1 == 'A' || data[0].ReqStatus1 == 'R') {
                    
                    if ($scope.AttendanceExemptionApp.StudYear == 'Ist Year') {
                        $scope.NewStudDetailsHide = false;                      //After Show data Approved/Rejected DS (1st Year Study Student)
                        $scope.SecondYearStudDetailsHide = true;
                        $scope.SecondCompletYearStudDetailsHide = true;
                        $scope.SubmitHide = true;

                        $scope.Status1Hide = false;
                        $scope.Approver1RemarkRO = true;
                        $scope.Star1Hide = true;

                        $scope.Status2Hide = false;
                        $scope.Approver2RemarkRO = true;
                        $scope.Star2Hide = true;

                        $scope.Status3Hide = true;
                        $scope.Approver3RemarkRO = true;
                        $scope.Star3Hide = true;
                    }
                    else if ($scope.AttendanceExemptionApp.StudYear == 'I&IInd Year') {
                        $scope.NewStudDetailsHide = true;               //After Show data Approved/Rejected DS (2nd Year Study Student)
                        $scope.SecondYearStudDetailsHide = false;
                        $scope.SecondCompletYearStudDetailsHide = true;

                        $scope.Status2Hide = false;
                        $scope.Status3Hide = true;

                        $scope.Status1Hide = false;
                        $scope.Approver1RemarkRO = true;
                        $scope.Star1Hide = true;

                        $scope.Status2Hide = false;
                        $scope.Approver2RemarkRO = true;
                        $scope.Star2Hide = true;

                        $scope.Status3Hide = true;
                        $scope.Approver3RemarkRO = true;
                        $scope.Star3Hide = true;

                    }
                    else {                                              //After Show data Approved/Rejected DS (2nd Year Complet Student)
                        $scope.NewStudDetailsHide = true;
                        $scope.SecondYearStudDetailsHide = true;
                        $scope.SecondCompletYearStudDetailsHide = false;
                        $scope.SubmitHide = true;

                        $scope.Status1Hide = false;
                        $scope.Approver1RemarkRO = true;
                        $scope.Star1Hide = true;

                        $scope.Status2Hide = false;
                        $scope.Approver2RemarkRO = true;
                        $scope.Star2Hide = true;

                        $scope.Status3Hide = true;
                        $scope.Approver3RemarkRO = true;
                        $scope.Star3Hide = true;
                    }

                }
                else {
                    if ($scope.AttendanceExemptionApp.StudYear == 'Ist Year') {
                        $scope.NewStudDetailsHide = false;                  //First Time Approved/Rejected DS (1st Year Study Student)
                        $scope.SecondYearStudDetailsHide = true;
                        $scope.SecondCompletYearStudDetailsHide = true;

                        $scope.SubmitHide = false;
                        $scope.Status3Hide = true;

                        $scope.SSCMarksAndTCPrivateCertHide = false;
                        $scope.ForeignCertHide = true;
                        $scope.InterTCandMarksMemoCertHide = true;

                        $scope.Status1Hide = false;
                        $scope.Star1Hide = true;
                        $scope.Approver1RemarkRO = true;

                        $scope.Status2Hide = false;
                        $scope.Star2Hide = false;
                        $scope.Approver2RemarkRO = false;
                    }
                    else if ($scope.AttendanceExemptionApp.StudYear == 'I&IInd Year') {
                        $scope.NewStudDetailsHide = true;               //First Time Approved/Rejected DS (2nd Year Study Student)
                        $scope.SecondYearStudDetailsHide = false;
                        $scope.SecondCompletYearStudDetailsHide = true;

                        $scope.SubmitHide = false;
                        $scope.Status3Hide = true;

                        $scope.SSCMarksAndTCPrivateCertHide = true;
                        $scope.ForeignCertHide = true;
                        $scope.InterTCandMarksMemoCertHide = false;

                        $scope.Status1Hide = false;
                        $scope.Star1Hide = true;
                        $scope.Approver1RemarkRO = true;

                        $scope.Status2Hide = false;
                        $scope.Star2Hide = false;
                        $scope.Approver2RemarkRO = false;

                    }
                    else {                                              //First Time Approved/Rejected DS (2nd Year Complet Student)
                        $scope.NewStudDetailsHide = true;
                        $scope.SecondYearStudDetailsHide = true;
                        $scope.SecondCompletYearStudDetailsHide = false;

                        $scope.SubmitHide = false;
                        $scope.Status3Hide = true;

                        $scope.SSCMarksAndTCPrivateCertHide = true;
                        $scope.ForeignCertHide = true;
                        $scope.InterTCandMarksMemoCertHide = false;

                        $scope.Status1Hide = false;
                        $scope.Star1Hide = true;
                        $scope.Approver1RemarkRO = true;

                        $scope.Status2Hide = false;
                        $scope.Star2Hide = false;
                        $scope.Approver2RemarkRO = false;
                    }
                }
            }
            else if (AppSettings.SysUsrGrpID == 11) {
                if (data[0].ReqStatus2 == 'P') { $scope.AttendanceExemptionApp.ReqStatus2 = "0"; }
                if (data[0].ReqStatus2 == 'A' || data[0].ReqStatus2 == 'R') {
                    
                    if ($scope.AttendanceExemptionApp.StudYear == 'Ist Year') {
                        $scope.NewStudDetailsHide = false;                  //After Show data Approved/Rejected JS (1st Year Study Student)
                        $scope.SecondYearStudDetailsHide = true;
                        $scope.SecondCompletYearStudDetailsHide = true;
                        $scope.SubmitHide = true;
                        $scope.DigitalSignHide = false;
                        $scope.Status1Hide = false;
                        $scope.Approver1RemarkRO = true;
                        $scope.Star1Hide = true;

                        $scope.Status2Hide = false;
                        $scope.Approver2RemarkRO = true;
                        $scope.Star2Hide = true;

                        $scope.Status3Hide = false;
                        $scope.Approver3RemarkRO = true;
                        $scope.Star3Hide = true;
                        if ($scope.AttendanceExemptionApp.DigiSignBy == null) {     //Digital Sign check yes or no
                            $scope.DigitalSignHide = false;
                        }
                        else {
                            $scope.DigitalSignHide = true;
                        }
                    }
                    else if ($scope.AttendanceExemptionApp.StudYear == 'I&IInd Year') {
                        $scope.NewStudDetailsHide = true;               //After Show data Approved/Rejected JS (2nd Year Study Student)
                        $scope.SecondYearStudDetailsHide = false;
                        $scope.SecondCompletYearStudDetailsHide = true;

                        $scope.Status2Hide = false;
                        $scope.Status3Hide = true;

                        $scope.Status1Hide = false;
                        $scope.Approver1RemarkRO = true;
                        $scope.Star1Hide = true;

                        $scope.Status2Hide = false;
                        $scope.Approver2RemarkRO = true;
                        $scope.Star2Hide = true;

                        $scope.Status3Hide = true;
                        $scope.Approver3RemarkRO = true;
                        $scope.Star3Hide = true;
                        if ($scope.AttendanceExemptionApp.DigiSignBy == null) {     //Digital Sign check yes or no
                            $scope.DigitalSignHide = false;
                        }
                        else {
                            $scope.DigitalSignHide = true;
                        }

                    }
                    else {                                      //2nd complet digital sign check condition JS
                        $scope.NewStudDetailsHide = true;       //After Show data Approved/Rejected JS (2nd Year Complet Student)
                        $scope.SecondYearStudDetailsHide = true;
                        $scope.SecondCompletYearStudDetailsHide = false;

                        $scope.Status1Hide = false;
                        $scope.Status2Hide = false;
                        $scope.Status3Hide = false;

                        $scope.Approver1RemarkRO = true;
                        $scope.Star1Hide = true;
                        if ($scope.AttendanceExemptionApp.DigiSignBy == null) {     //Digital Sign check yes or no
                            $scope.DigitalSignHide = false;
                        }
                        else {
                            $scope.DigitalSignHide = true;
                        }

                    }

                }
                else {
                    if ($scope.AttendanceExemptionApp.StudYear == 'Ist Year') {
                        $scope.NewStudDetailsHide = false;              //First Time Approved/Rejected JS (1st Year Study Student)
                        $scope.SecondYearStudDetailsHide = true;
                        $scope.SecondCompletYearStudDetailsHide = true;

                        $scope.SubmitHide = false;

                        $scope.SSCMarksAndTCPrivateCertHide = false;
                        $scope.ForeignCertHide = true;
                        $scope.InterTCandMarksMemoCertHide = true;

                        $scope.Status1Hide = false;
                        $scope.Star1Hide = true;
                        $scope.Approver1RemarkRO = true;

                        $scope.Status2Hide = false;
                        $scope.Star2Hide = true;
                        $scope.Approver2RemarkRO = true;

                        $scope.Status3Hide = false;
                        $scope.Star3Hide = false;
                        $scope.Approver3RemarkRO = false;
                    }
                    else if ($scope.AttendanceExemptionApp.StudYear == 'I&IInd Year') {
                        $scope.NewStudDetailsHide = true;                   //First Time Approved/Rejected JS (2nd Year Study Student)
                        $scope.SecondYearStudDetailsHide = false;
                        $scope.SecondCompletYearStudDetailsHide = true;

                        $scope.SubmitHide = false;

                        $scope.SSCMarksAndTCPrivateCertHide = true;
                        $scope.ForeignCertHide = true;
                        $scope.InterTCandMarksMemoCertHide = false;

                        $scope.Status1Hide = false;
                        $scope.Star1Hide = true;
                        $scope.Approver1RemarkRO = true;

                        $scope.Status2Hide = false;
                        $scope.Star2Hide = true;
                        $scope.Approver2RemarkRO = true;

                        $scope.Status3Hide = false;
                        $scope.Star3Hide = false;
                        $scope.Approver3RemarkRO = false;
                    }
                    else {
                        $scope.NewStudDetailsHide = true;                       //First Time Approved/Rejected JS (2nd Year Complet Student)
                        $scope.SecondYearStudDetailsHide = true;
                        $scope.SecondCompletYearStudDetailsHide = false;

                        $scope.SubmitHide = false;

                        $scope.SSCMarksAndTCPrivateCertHide = true;
                        $scope.ForeignCertHide = true;
                        $scope.InterTCandMarksMemoCertHide = false;

                        $scope.Status1Hide = false;
                        $scope.Star1Hide = true;
                        $scope.Approver1RemarkRO = true;

                        $scope.Status2Hide = false;
                        $scope.Star2Hide = true;
                        $scope.Approver2RemarkRO = true;

                        $scope.Status3Hide = false;
                        $scope.Star3Hide = false;
                        $scope.Approver3RemarkRO = false;

                    }
                }
            }
            if (AppSettings.SysUsrGrpID == 2) {
                if ((data[0].ReqStatus1 == '0')) {
                    //$scope.ShowPrint = false;
                }
                else {
                    //$scope.ShowPrint = true;
                }
            }
            else { $scope.ShowPrint = false;}
            
            if ((data[0].ReqStatus1 == 'R') || (data[0].ReqStatus1 == '0')) {
               // $scope.ShowPrint = false;
            }
            else
            {
                //$scope.ShowPrint = true;
            }
            //Check Get Document for(Photo,SSCMarksMemo,TC,Eligbility Cet,Migration Cert,Inter TC,Inter Marks Memo)
            if ($scope.AttendanceExemptionApp.IntermedieteType == '1') {
                if ($scope.AttendanceExemptionApp.StudYear == 'Ist Year') {
                    $scope.SSCMarksAndTCPrivateCertHide = false;
                    if (($scope.AttendanceExemptionApp.UploadDoc4EligibilityCertif == null) && ($scope.AttendanceExemptionApp.UploadDoc5MigrationCert == null)) {
                        $scope.ForeignCertHide = true;
                    }
                    else {
                        $scope.ForeignCertHide = false;
                    }
                    $scope.InterTCandMarksMemoCertHide = true;
                }
            }
            else if ($scope.AttendanceExemptionApp.IntermedieteType == '2') {
             if ($scope.AttendanceExemptionApp.StudYear == 'I&IInd Year') {
                    $scope.SSCMarksAndTCPrivateCertHide = true;
                    $scope.ForeignCertHide = true;
                    $scope.InterTCandMarksMemoCertHide = false;
                }
                else {
                    $scope.SSCMarksAndTCPrivateCertHide = true;
                    $scope.ForeignCertHide = true;
                    $scope.InterTCandMarksMemoCertHide = false;
                }
            }

            if ($scope.AttendanceExemptionApp.StudYear == '2nd Year Completed') {
                if ($scope.AttendanceExemptionApp.AdditionalLang1 == null) {
                    $scope.AdditionalLanguageHide1 = true;
                }
                else {
                    $scope.AdditionalLanguageHide1 = false;
                }
                if ($scope.AttendanceExemptionApp.AdditionalLang2 == null) {
                    $scope.AdditionalLanguageHide2 = true;
                }
                else {
                    $scope.AdditionalLanguageHide2 = false;
                }
                if (($scope.AttendanceExemptionApp.Maths1A == null) && ($scope.AttendanceExemptionApp.Maths1B == null)) {
                    $scope.AdditionalSubjectMaths1AB = true;
                }
                else {
                    $scope.AdditionalSubjectMaths1AB = false;
                }
                if (($scope.AttendanceExemptionApp.Maths2A == null) && ($scope.AttendanceExemptionApp.Maths2B == null)) {
                    $scope.AdditionalSubjectMaths2AB = true;
                }
                else {
                    $scope.AdditionalSubjectMaths2AB = false;
                }
                if (($scope.AttendanceExemptionApp.BridgeMaths1 == null) && ($scope.AttendanceExemptionApp.BridgeMaths2 == null)) {
                    $scope.BridgeCourseMaths1and2 = true;
                }
                else {
                    $scope.BridgeCourseMaths1and2 = false;
                }
            }
            else {
            }


        }, function (error) {
            alert(error);
        });
        $scope.ChangeTextArea = function (str, type) {
            if (type == "ReqStatus") {
                if (str == 'A') { $scope.AttendanceExemptionApp.ProcessRemark = "May be Approved"; }
                else if (str == 'R') { $scope.AttendanceExemptionApp.ProcessRemark = "May be Rejected"; }
            }
            else if (type == "ReqStatus1") {
                if (str == 'A') { $scope.AttendanceExemptionApp.ProcessRemark1 = "May be Approved"; }
                else if (str == 'R') { $scope.AttendanceExemptionApp.ProcessRemark1 = "May be Rejected"; }
            }
            else if (type == "ReqStatus2") {
                if (str == 'A') { $scope.AttendanceExemptionApp.ProcessRemark2 = "Approved"; }
                else if (str == 'R') { $scope.AttendanceExemptionApp.ProcessRemark2 = "Rejected"; }
            }
        };

        $scope.SaveAttendanceExemptionApp = function () {
            $scope.RollEditDisable = true;
            $scope.AttendanceExemptionApp.ProcessbyID = AppSettings.LoggedUserId;
            if (AppSettings.SysUsrGrpID == 9) { // SUP 4
                if (($scope.AttendanceExemptionApp.ReqStatus == undefined) || ($scope.AttendanceExemptionApp.ReqStatus == "0")) {
                    alert("Select Accept / Reject at Level 1");
                    $scope.RollEditDisable = false;
                    //$scope.UploadFiles = true;
                    return;
                }
                if (($scope.AttendanceExemptionApp.ProcessRemark == undefined) || ($scope.AttendanceExemptionApp.ProcessRemark == "")) {
                    alert("Enter Process Remark at Level 1.");
                    $scope.RollEditDisable = false;
                    //$scope.UploadFiles = true;
                    return;
                }
                if (!ProcRegex.test($scope.AttendanceExemptionApp.ProcessRemark)) {
                    alert("Invalid data in Process Remark at Level 1.");
                    $scope.RollEditDisable = false;
                    $scope.UploadFiles = true;
                    return;
                }
            }
            else if (AppSettings.SysUsrGrpID == 2) {  //DS
                if (($scope.AttendanceExemptionApp.ReqStatus1 == undefined) || ($scope.AttendanceExemptionApp.ReqStatus1 == "0")) {
                    alert("Select Accept / Reject at Level 2");
                    $scope.RollEditDisable = false;
                    $scope.UploadFiles = true;
                    return;
                }
                if (($scope.AttendanceExemptionApp.ProcessRemark1 == undefined) || ($scope.AttendanceExemptionApp.ProcessRemark1 == "")) {
                    alert("Enter Process Remark at Level 2.");
                    $scope.RollEditDisable = false;
                    $scope.UploadFiles = true;
                    return;
                }
                if (!ProcRegex.test($scope.AttendanceExemptionApp.ProcessRemark1)) {
                    alert("Invalid data in Process Remark at Level 2.");
                    $scope.RollEditDisable = false;
                    $scope.UploadFiles = true;
                    return;
                }

            }
            else if (AppSettings.SysUsrGrpID == 11) {  //JS
                if (($scope.AttendanceExemptionApp.ReqStatus2 == undefined) || ($scope.AttendanceExemptionApp.ReqStatus2 == "0")) {
                    alert("Select Accept / Reject at Level 3");
                    $scope.RollEditDisable = false;
                    $scope.UploadFiles = true;
                    return;
                }
                if (($scope.AttendanceExemptionApp.ProcessRemark2 == undefined) || ($scope.AttendanceExemptionApp.ProcessRemark2 == "")) {
                    alert("Enter Process Remark at Level 3.");
                    $scope.RollEditDisable = false;
                    $scope.UploadFiles = true;
                    return;
                }
                if (!ProcRegex.test($scope.AttendanceExemptionApp.ProcessRemark2)) {
                    alert("Invalid data in Process Remark at Level 3.");
                    $scope.RollEditDisable = false;
                    $scope.UploadFiles = true;
                    return;
                }
            }

            var UserGrp = "";
            if (AppSettings.SysUsrGrpID == 4) { //Sup
                UserGrp = "O";
                //$scope.Approver2 = false;
                //$scope.Approver1 = false;
            } else if (AppSettings.SysUsrGrpID == 2) {  //DS
                UserGrp = "A";
                //$scope.Approver2 = false;
                //$scope.Approver1 = true;
                //$scope.FirstLoginStatus = true;
            }
            else if (AppSettings.SysUsrGrpID == 11) {   //JS
                UserGrp = "J";
                //$scope.FirstLoginStatus = true;
                //$scope.SecondLoginStatus = true;
                //$scope.Approver2 = true;
                //$scope.Approver1 = true;

            }

            $scope.AttendanceExemptionApp.UserGrp = UserGrp;
            var getPromise = AttendanceExemptionAppService.UpdateAttendanceExemptionApp($scope.AttendanceExemptionApp);
            getPromise.then(function (data) {
                if (AppSettings.SysUsrGrpID == 9) { //SUP
                    alert("Submitted Successfully");
                    RedirectToListPage();
                }
                else if (AppSettings.SysUsrGrpID == 2) {    //DS
                    $scope.ShowPrint = true;
                    $scope.ShowSubmit = true;
                    alert("Saved Successfully");
                    RedirectToListPage();
                }
                else if (AppSettings.SysUsrGrpID == 11) {   //JS
                    alert("Saved Successfully");
                    $scope.SubmitHide = true;
                    if ($scope.AttendanceExemptionApp.ReqStatus2 == 'A') {
                        $scope.DigitalSignHide = false;
                    }
                    else {
                        $scope.DigitalSignHide = true;
                    }
                    //RedirectToListPage();
                }
                
            }, function (error) {
                $scope.RollEditDisable = false;
                alert(error);
            });
        }
       
        $scope.Exit = function () {
            RedirectToListPage();
        }
        function RedirectToListPage() {
            $state.go('StudentRequestBoard.ServiceRequestDrillDownReport');
        }
        $scope.PrintAttendanceExemptionApp = function () {
            var getPromise = AttendanceExemptionAppService.GetCertPdf($scope.AttendanceExemptionApp.FormNo);
            getPromise.then(function (data) {
                $state.go('StudentRequestBoard.AddSign', { PdfPath: data[0].DigiSignPDFURL, PdfPhysicalPath: data[0].DigiSignPDFPhyPath, FormNo: $scope.MediumChangeApp.FormNo, ReqType: 'Attendance_Exemption' });
            }, function (error) {
                alert(error);
            });
        }
        
    });
});

