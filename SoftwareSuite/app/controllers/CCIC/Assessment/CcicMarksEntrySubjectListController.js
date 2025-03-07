define(['app'], function (app) {

    app.controller("CcicMarksEntrySubjectListController", function ($scope, $window, $http, $state, $localStorage, CcicAssessmentService) {

        var authData = $localStorage.authorizationData;
        $scope.UserName = authData.UserName;
        $scope.UserTypeID = authData.UserTypeID;
        var InstitutionID = authData.InstitutionID;
        var tmpdata = $localStorage.TempData;
        $scope.SessionID = $localStorage.SessionID;


        $scope.ExamType = tmpdata.ExamType;

        var getsubject = CcicAssessmentService.getInternalorExternalSubjects(tmpdata.AcademicYearID, tmpdata.ExamMonthYearID, tmpdata.InstitutionID, tmpdata.CourseID, tmpdata.ExamTypeID);
        getsubject.then(function (response) {
            try {
                var res = JSON.parse(response)
            }
            catch { }
            if (res !== undefined && res.length > 0) {
                $scope.getSubjectsResponse = res;
                $scope.AcademicYearID = res[0].AcademicYearID;
                $scope.ExamMonthYearID = res[0].ExamMonthYearID;
                $scope.DataSubmitted = 1
                for (var i = 0; $scope.getSubjectsResponse.length; i++) {
                    if ($scope.getSubjectsResponse[i].Submitted == 0) {
                        $scope.DataSubmitted = 0
                    }
                }
            }
            else {
                //alert("no subjects");
                //$state.go("Dashboard.AssessmentDashboard.practicals");
            }
        }, function (error) {
            alert("some thing went wrong");
        });


        $scope.back = function () {

            var AcademicYearID = $scope.AcademicYearID
            var ExamMonthYearID = $scope.ExamMonthYearID
            var CourseID = tmpdata.CourseID
            sessionStorage.setItem("AcademicYearID", AcademicYearID);
            sessionStorage.setItem("ExamMonthYearID", ExamMonthYearID);
            sessionStorage.setItem("CourseID", CourseID);
            $state.go("CcicDashboard.Assessment.MarksEntry");
        }

        $scope.GetReport = function () {
            if ($scope.DataSubmitted == 0) {
                alert("Please Submit All Subjects Marks to get Report")
                return;
            }
            $scope.loading = true;
            $scope.Noresult = false
            var loadData1 = CcicAssessmentService.GetSubjectsReport(tmpdata.AcademicYearID, tmpdata.ExamMonthYearID, tmpdata.InstitutionID, tmpdata.CourseID, tmpdata.ExamTypeID)
            loadData1.then(function (response) {
                try {
                    var res = JSON.parse(response)
                }
                catch {

                }
                var data = res;
                if (data.Table.length > 0) {
                    $scope.Noresult = false
                    $scope.loading = false;
                    $scope.SubjectsList = [];
                    $scope.InstitutionCode = data.Table[0].InstitutionCode;
                    $scope.InstitutionName = data.Table[0].InstitutionName;
                    $scope.SubjectCode = data.Table1[0].SubjectCode
                    $scope.ExamType = data.Table[0].ExamType
                    data.Table1.forEach(function (student) {
                        if (!$scope.SubjectsList.includes(student.SubjectCode))
                            $scope.SubjectsList.push(student.SubjectCode);
                    });
                    $scope.StudentDetails = data.Table1;
                    $scope.AllStudentDetails = data.Table2;

                } else if (data[0].ResponceCode == '404') {
                    $scope.Noresult = true
                    $scope.loading = false;
                    alert(data[0].ResponceDescription);
                }
                else if (data[0].ResponceCode == '400') {
                    $scope.Noresult = true
                    $scope.loading = false;
                    alert(data[0].ResponceDescription);
                } else {
                    $scope.Noresult = true
                    $scope.loading = false;
                    alert('Something Went Wrong')
                }

            }, function (error) {
                $scope.Noresult = true
                $scope.loading = false;
            });
        }
        $scope.PrintStudentResult = function (divName) {

            //var printContents = document.getElementById(divName).innerHTML;
            var originalContents = document.body.innerHTML;

            //document.body.innerHTML = printContents;

            window.print();

            document.body.innerHTML = originalContents;
            print.close();

        };

        $scope.getOldChildren = function (student) {
            var Report = [];
            var arr = $scope.StudentDetails;
            var rem = [];
            var temparr = [];
            var temparr2 = [];
            var tempsub = [];
            //var subjectcodes = $scope.SubjectsList;
            for (let i = 0; i < arr.length; i++) {
                // if (arr[i].PIN == student.PIN && arr[i].SubjectCode == $scope.SubjectsList[0]) {
                if (arr[i].PIN == student.PIN) {
                    Report.push(arr[i]);
                    temparr.push(arr[i]);
                    //  tempsub.push(arr[i].code);
                }
            }
            console.log(Report)
            return Report;
        }
        $scope.selectSubjectDetails = function (subject) {
            $localStorage.TempData1 = {
                AcademicYearID: tmpdata.AcademicYearID,
                ExamMonthYearID: tmpdata.ExamMonthYearID,
                InstitutionID: tmpdata.InstitutionID,
                CourseID: tmpdata.CourseID,
                ExamTypeID: tmpdata.ExamTypeID,
                ExamTypeName: tmpdata.ExamType
            };
            $localStorage.SubjectDetails = subject;
            $state.go('CcicDashboard.Assessment.MarksEntryPage')
        }

        $scope.logOut = function () {
            //$scope.$emit("logout", authData.UserName);
            sessionStorage.loggedIn = "no";
            var GetCcicUserLogout = CcicSystemUserService.PostCcicUserLogout($scope.UserName, $scope.SessionID);

            delete $localStorage.authorizationData;
            delete $localStorage.authToken;
            delete $scope.SessionID;

            $scope.authentication = {
                isAuth: false,
                UserID: 0,
                UserName: ""
            };
            $state.go('CcicLogin');
        }
    });
});
