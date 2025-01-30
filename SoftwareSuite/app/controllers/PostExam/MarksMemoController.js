define(['app'], function (app) {
    app.controller("MarksMemoController", function ($scope, $http, $window, $localStorage, $state, $stateParams, AppSettings, $uibModal, $timeout, PreExaminationService) {

        

        
        var ApproveList = PreExaminationService.GetScheme();
        ApproveList.then(function (response) {
            
          
            $scope.Schemes = response.Table;
            
        },
        function (error) {
            //$scope.$emit('hideLoading', data);

            $scope.Data = false;
            $scope.Nodata = true;
            alert("error while loading data");
        });

        

        var ApproveLists = PreExaminationService.getExamYearMonths();
        ApproveLists.then(function (response) {
           
           
            $scope.ExamMonthYear = response.Table

        },
        function (error) {
            //$scope.$emit('hideLoading', data);

            $scope.Data = false;
            $scope.Nodata = true;
            alert("error while loading data");
        });


        var authData = JSON.parse(sessionStorage.getItem('user'));
        $scope.userType = authData.SystemUserTypeId;
        if ($scope.userType != 1) {
            alert("UnAuthorized Access")
            $state.go('Dashboard')
        }

        $scope.logOut = function () {
            sessionStorage.loggedIn = "no";
            var GetUserLogout = SystemUserService.postUserLogout($scope.userName);
            GetUserLogout.then(function (response) {
                if (response.Table[0].ResponceCode == '200') {
                    alert(response.Table[0].ResponceDescription);
                } else {
                    alert('Unsuccess')
                }
            },
                function (error) {
                    //   alert("error while loading Notification");
                    var err = JSON.parse(error);
                });
            sessionStorage.removeItem('user')
            sessionStorage.removeItem('authToken')
            sessionStorage.removeItem('SessionID')
            sessionStorage.clear();

            $localStorage.authorizationData = ""
            $localStorage.authToken = ""
            delete $localStorage.authorizationData;
            delete $localStorage.authToken;
            delete $scope.SessionID;
            $scope.authentication = {
                isAuth: false,
                UserId: 0,
                userName: ""
            };
            $state.go('index.WebsiteLogin')

        }


        $scope.DownloadtoExcel = function () {
        
            var CertificateFeePaymentReports = PreExaminationService.Memos($scope.Scheme, $scope.ExamMonth, $scope.date);
            CertificateFeePaymentReports.then(function (res) {

                if (res.length > 0) {
                    if (res.length > 4) {
                        window.location.href = res;
                    } else {
                        alert("No Excel Report Present")
                    }
                } else {
                    alert("No Report Present")
                }
            }, function (err) {
                $scope.LoadImg = false;
                alert("Error while loading");
            });

        }
    })
})