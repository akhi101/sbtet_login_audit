define(['app'], function (app) {
    app.controller("CcicAdmVerificationCoursesController", function ($scope, $localStorage, $state, CcicPreExaminationService) {

        var authData = $localStorage.authorizationData;
        $scope.UserName = authData.UserName;
        $scope.UserTypeID = authData.UserTypeID;
        var tmp = $localStorage.TempData;



        const $ctrl = this;
        $ctrl.$onInit = () => {


        }
        $scope.back = function () {
            var AcademicYearID = tmp.AcademicYearID;
            var Batch = tmp.Batch;
            sessionStorage.setItem("AcademicYearID", AcademicYearID);
            sessionStorage.setItem("Batch", Batch);
            $state.go("CcicDashboard.Academic.Verification");
        }

        if ($scope.UserTypeID == 4) { // madam
            $scope.RecommendedLink = true;
            $scope.RecommendedNoLink = false;
            $scope.PendingLink = false;
            $scope.PendingNoLink = true;
        }
        else if ($scope.UserTypeID == 10 || $scope.UserTypeID == 1 || $scope.UserTypeID == 5 || $scope.UserTypeID == 6 || $scope.UserTypeID == 7 ||
             $scope.UserTypeID == 8 || $scope.UserTypeID == 9) { //sir
            $scope.PendingLink = true;
            $scope.PendingNoLink = false;
            $scope.RecommendedNoLink = true;
            $scope.RecommendedLink = false;
        }

        var data = [];
        $scope.$emit('showLoading', data);


        $scope.loading = true;
        var InstitutionID = (authData.InstitutionID == undefined || authData.InstitutionID == '' || authData.InstitutionID == 0) ? tmp.InstitutionID : authData.InstitutionID

        var verreportCount = CcicPreExaminationService.GetInsVerificationReportCoursesCount(tmp.AcademicYearID,tmp.Batch,InstitutionID);
        verreportCount.then(function (response) {
            try {
                var Res = JSON.parse(response);
            }
            catch (err) { }
            var Intake = 0;
            var Enrolled = 0;
            var Submitted = 0;
            var Approved = 0;
            var Pending = 0;
            var Revised = 0;
            var Rejected = 0;
            var Recommended = 0;
            $scope.VerificationReportCoursesTable = [];
            if (Res.length >= 0) {
                $scope.loading = false;
                $scope.VerificationReportCoursesTable = Res;
                for (var i = 0; i < Res.length; i++) {
                    if (Res[i].Intake != null)
                        Intake = Intake + Res[i].Intake;
                    if (Res[i].Enrolled != null)
                        Enrolled = Enrolled + Res[i].Enrolled;
                    if (Res[i].Submitted != null)
                        Submitted = Submitted + Res[i].Submitted;
                    if (Res[i].Approved != null)
                        Approved = Approved + Res[i].Approved;
                    if (Res[i].Pending != null)
                        Pending = Pending + Res[i].Pending;
                    if (Res[i].Revised != null)
                        Revised = Revised + Res[i].Revised;
                    if (Res[i].Rejected != null)
                        Rejected = Rejected + Res[i].Rejected;
                    if (Res[i].Recommended != null)
                        Recommended = Recommended + Res[i].Recommended;
                }
                $scope.Intake = Enrolled;
                $scope.Enrolled = Enrolled;
                $scope.Submitted = Submitted;
                $scope.Approved = Approved;
                $scope.Pending = Pending;
                $scope.Revised = Revised;
                $scope.Rejected = Rejected;
                $scope.Recommended = Recommended;
                $scope.$emit('hideLoading', data);
            } else {
                $scope.loading = false;
                $scope.VerificationReportCoursesTable = [];
                $scope.$emit('hideLoading', data);
            }
        },
            function (error) {
                //   alert("error while loading Notification");
                var err = JSON.parse(error);
            });


        //$scope.showAdminEnrollmentCount = function (InstitutionID) {
        //    var enrollmentreportCount = CcicPreExaminationService.GetInstitutionEnrollmentReportCount(InstitutionID);
        //    enrollmentreportCount.then(function (response) {
        //        try {
        //            var res = JSON.parse(response);
        //        }
        //        catch (err) { }
        //        $scope.EnrollmentReportCountTable = [];
        //        if (res.length >= 0) {
        //            $scope.EnrollmentReportCountTable = res;
        //        } else {
        //            $scope.EnrollmentReportCountTable = [];
        //        }
        //    },
        //        function (error) {
        //            //   alert("error while loading Notification");
        //            var err = JSON.parse(error);
        //        });
        //    /*$state.go('CcicDashboard.Academic.EnrollmentReport');*/



        //}



        $scope.ShowDetails = function (AcademicYearID,Batch,InstitutionID, CourseID, ReportTypeID) {

            $localStorage.TempData2 = {
                AcademicYearID: AcademicYearID,
                Batch: Batch,
                InstitutionID: InstitutionID,
                CourseID: CourseID,
                ReportTypeID: ReportTypeID,

            };

            $state.go('CcicDashboard.Academic.CcicAdmVerificationData');


        }



    });
});

