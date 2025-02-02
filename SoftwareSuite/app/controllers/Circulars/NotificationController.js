define(['app'], function (app) {
    app.controller("NotificationController", function ($scope, $http, $localStorage, $state, $stateParams, $interval, AppSettings, AdminService) {
        var authData = JSON.parse(sessionStorage.getItem('user'));
        $scope.userType = authData.SystemUserTypeId;
        if ($scope.userType == 2 || $scope.userType == 3) {
            alert("UnAuthorized Access")
            $state.go('Dashboard')
        }
        var markslist = [];
        var GetNotifications = AdminService.getNotifications();
        GetNotifications.then(function (response) {
            if (response.Table.length > 0) {
                $scope.getNotifications = response.Table;
                $scope.result = true;
                $scope.NoResult = false;
            } else {
                $scope.StudentType = [];
                $scope.result = false;
                $scope.NoResult = true;
                alert("No Data Found");
            }
        },
                function (error) {
                    $scope.result = false;
                    $scope.NoResult = true;
                    alert("error while loading Data");
                    console.log(error);
                });

        var GetUserTypes = AdminService.GetUserTypes();
        GetUserTypes.then(function (response) {
            if (response.Table.length > 0) {
                $scope.userTypes = response.Table;            
             
            } else {
                $scope.StudentType = [];
                alert("No Data Found");
            }
        },
            function (error) {
                alert("error while loading Data");
                console.log(error);
            });


        $scope.getuserNotifications = function () {
            var GetNotifications = AdminService.getNotifications();
            GetNotifications.then(function (response) {
                if (response.Table.length > 0) {
                    $scope.getNotifications = response.Table;
                    $scope.result = true;
                    $scope.NoResult = false;
                } else {
                    $scope.StudentType = [];
                    $scope.result = false;
                    $scope.NoResult = true;
                    alert("No Data Found");
                }
            },
                function (error) {
                    $scope.result = false;
                    $scope.NoResult = true;
                    alert("error while loading Data");
                    console.log(error);
                });
        }

        var expanded = false;

        $scope.showCheckboxes = function() {
            var checkboxes = document.getElementById("checkboxes");
            if (!expanded) {
                checkboxes.style.display = "block";
                expanded = true;
            } else {
                checkboxes.style.display = "none";
                expanded = false;
            }
        }

        $scope.closeCheckbox = function () {
            var checkboxes = document.getElementById("checkboxes");
            if (!expanded) {
                checkboxes.style.display = "block";
                expanded = true;
            } else {
                checkboxes.style.display = "none";
                expanded = false;
            }
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


        $scope.toggleAll = function () {
            var toggleStatus = $scope.isAllSelected;
            angular.forEach($scope.userTypes, function (itm) { itm.selected = toggleStatus; });
            $scope.arr = [];
            angular.forEach($scope.userTypes, function (value, key) {
                if (value.selected === true) {
                    console.log(value);
                    $scope.arr.push({ "id": value.Id })
                }
                  
            });
            //console.log($scope.arr)
            //console.log($scope.userTypes)
        }

        $scope.optionToggled = function (mid1list) {
            $scope.isAllSelected = $scope.userTypes.every(function (itm) { return itm.selected; })
         $scope.arr = [];
            angular.forEach($scope.userTypes, function (value, key) {
                if (value.selected === true) {
                    console.log(value);
                    $scope.arr.push({ "id": value.Id })
                }
            });
            console.log($scope.arr)
            console.log($scope.userTypes)
      
        }

        var tempId = [];
        $scope.addData = function (UserTypeId) {
            return {
                UserTypeId: UserTypeId,
             
            };
        }
        
        $scope.setNotification = function () {
            var startDate = moment($scope.StartDate).format("YYYY-MM-DD HH:mm:ss.SSS");
            var date = new Date($scope.EndDate.toLocaleString());
            month = '' + (date.getMonth() + 1);
            day = '' + date.getDate();
            year = date.getFullYear();

            hrs = '23';
            min = '59';
            sec = '59';

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;
            var dates = [year, month, day].join('-');
            var time = [hrs, min, sec].join(':');
            $scope.EndDate = dates + ' ' + time;
            var EndDate = moment($scope.EndDate).format("YYYY-MM-DD HH:mm:ss.SSS");           
            $scope.array = []
            if ($scope.arr.length > 0) {
                for (var i = 0; i < $scope.arr.length;i++) {
                    $scope.array.push({ 'Notification': $scope.UserNotification, 'UserTypeId': $scope.arr[i].id, 'FromDate': startDate, 'ToDate': EndDate });
                }               
            }
            var SendNotifications = AdminService.PostNotification(JSON.stringify($scope.array));
         
            SendNotifications.then(function (response) {              
                alert("Notification Saved Successfully")
             
                $scope.getuserNotifications();
            },
                function (error) {
                    alert("error while loading Data");
                    console.log(error);
                });
        }


        $scope.notifcationInactive = function (Id) {
            var GetNotifications = AdminService.NotificationInactive(Id);
            GetNotifications.then(function (response) {
             
                alert("Notification inactivated Successfully")
                $scope.getuserNotifications();
            },
                function (error) {
                    alert("error while loading Data");
                    console.log(error);
                });
        }

    })
})