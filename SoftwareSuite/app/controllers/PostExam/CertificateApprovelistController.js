﻿define(['app'], function (app) {
    app.controller("CertificateApproveListController", function ($scope, $http, $localStorage, $state, AppSettings, PreExaminationService) {

        //$scope.ApprovalData = [
        //    { "Id": "1", "Scheme": "C18", "ApprovalPending": "20", "Approved": "10", "SendtoCollege": "10" },
        //      { "Id": "2", "Scheme": "C16", "ApprovalPending": "20", "Approved": "10", "SendtoCollege": "10" },
        //        { "Id": "3", "Scheme": "C16S", "ApprovalPending": "20", "Approved": "10", "SendtoCollege": "10" }

        //]
        var authData = JSON.parse(sessionStorage.getItem('user'));
        $scope.userType = authData.SystemUserTypeId;
        if ($scope.userType == 2 || $scope.userType == 3) {
            alert("UnAuthorized Access")
            $state.go('Dashboard');
            return;
        }
        var data = {};
        $scope.$emit('showLoading', data);
        $scope.Data = false;
        $scope.Nodata = false;
       
        var ApproveList = PreExaminationService.GetCertificateApprovalList();
        ApproveList.then(function (response) {
            
            console.log(response);
            if (response.Table.length > 0) {
                $scope.$emit('hideLoading', data);
              
                $scope.Data = true;
                $scope.Nodata = false;
                $scope.ApprovalData = response.Table;
                var ApprovalPending = 0
                var Approved = 0;
                var SentToCollege = 0;
                var Rejected = 0;

                for (var i = 0; i < response.Table.length; i++) {
                    if (response.Table[i].ApprovalPending != null)
                        ApprovalPending = ApprovalPending + response.Table[i].ApprovalPending;
                    if (response.Table[i].Approved != null)
                        Approved = Approved + response.Table[i].Approved;
                    if (response.Table[i].SentToCollege != null)
                        SentToCollege = SentToCollege + response.Table[i].SentToCollege;
                    if (response.Table[i].Rejected != null)
                        Rejected = Rejected + response.Table[i].Rejected;

                }

                $scope.ApprovalPending = ApprovalPending;
                $scope.Approved = Approved;
                $scope.SentToCollege = SentToCollege;
                $scope.Rejected = Rejected;
            } else {
                $scope.$emit('hideLoading', data);
              
                $scope.Data = false;
                $scope.Nodata = true;
            }

            //$scope.DownloadtoExcel = function () {
            //    var CertificateFeePaymentReports = PreExaminationService.CertificateFeePaymentReports($scope.Scheme);
            //    CertificateFeePaymentReports.then(function (res) {

            //        if (res.length > 0) {
            //            if (res.length > 4) {
            //                window.location.href = res;
            //            } else {
            //                alert("No Excel Report Present")
            //            }
            //        } else {
            //            alert("No Report Present")
            //        }
            //    }, function (err) {
            //        $scope.LoadImg = false;
            //        alert("Error while loading");
            //    });

            //}


        },
        function (error) {
            $scope.$emit('hideLoading', data);
          
            $scope.Data = false;
            $scope.Nodata = true;
            alert("error while loading data");
        });

        $scope.ApprovePending = function (Scheme) {
            $scope.ApproveType = 0;
            //localStorage.setItem('ApproveType', $scope.ApproveType)
            $localStorage.CertificateData = {
                ApproveType: $scope.ApproveType,
                Scheme: Scheme
            }

            $state.go('Dashboard.PostExam.CertificateApproveListDetails');
        }
        $scope.ApprovedList = function (Scheme) {
            $scope.ApproveType = 1;
            $localStorage.CertificateData = {
                ApproveType: $scope.ApproveType,
                Scheme: Scheme
            }
            $state.go('Dashboard.PostExam.CertificateApproveListDetails');
        }

        $scope.SendToCollege = function (Scheme) {
            $scope.ApproveType = 2;
            $localStorage.CertificateData = {
                ApproveType: $scope.ApproveType,
                Scheme: Scheme
            }
            $state.go('Dashboard.PostExam.CertificateApproveListDetails');
        }
        $scope.RejectedList = function (Scheme) {
            $scope.ApproveType = 3;
            $localStorage.CertificateData = {
                ApproveType: $scope.ApproveType,
                Scheme: Scheme
            }
            $state.go('Dashboard.PostExam.CertificateApproveListDetails');
        }

        $scope.logOut = function () {
            sessionStorage.loggedIn = "no";
            var GetUserLogout = SystemUserService.getUserLogout();
            alert('Logout Successfully');
            $state.go('index.WebsiteLogin');

        }

    })
})