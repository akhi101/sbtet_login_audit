﻿define(['app'], function (app) {
    app.controller("WantingsReportController", function ($scope, $http, $localStorage, $rootScope, $state, $stateParams, $document, StudentResultService, AppSettings, $timeout, PreExaminationService, AssessmentService, StudentWiseService) {

        //var serializedData = { "Name": ["Akhil"] }
        //request = $.ajax({
        //    url: "https://docs.google.com/spreadsheets/d/1FNnXNCX-KF0eaqk9-z0FKZoenocmakvJQLZI1uo1W3Y/edit#gid=0",
        //    type: "post",
        //    data: serializedData
        //});
        var reload = true;
        var authData = $localStorage.authorizationData;
        $scope.ExamCategory = [];
        $scope.userName = authData.userName;
        $scope.College_Code = authData.College_Code;
        AppSettings.College_Name = authData.College_Name;
        $scope.College_Name = authData.College_Name;
        AppSettings.userName = authData.userName;
        $scope.BranchId = authData.BranchId;
        $scope.CollegeID = authData.CollegeID;
        $scope.userType = authData.SystemUserTypeId
        $scope.reload = true


        $scope.Submit = function () {
            $scope.Loading = true;
            var getWantingsData = PreExaminationService.getWantingsReport($scope.monthyear, $scope.SelStudentType, $scope.scheme);
            getWantingsData.then(function (data) {
                try {
                    var data = JSON.parse(data)
                    } catch(e) {
                        if (data.length >= 4) {
                            $scope.Loading = false;
                            $scope.Result = true;
                            var location = data;
                            window.location.href = location;
                        }
                    }
                
                if (data.Table[0].ResponceCode == '400') {
                    $scope.Loading = false;
                    alert("No Data Found");
                        

                }  else {

                }
               
                //$scope.ResultNotFound = false;
                //$scope.ResultFound = false;
              //  $scope.LoadImg = false;


            }, function (error) {
                $scope.Loading = false;
                $scope.gentmetbl = false;
                $scope.ResultNotFound = true;
                $scope.Result = false;
               
            });
            

        }
        $scope.GetTable = false;
        //$scope.MonthAndYear = [
        //   { "Id": 1, "ExamYearMonth": "Oct - Nov 2018" },
        //   { "Id": 2, "ExamYearMonth": "Mar - Apr 2019" },
        //   { "Id": 3, "ExamYearMonth": "June 2019" },
        //   { "Id": 4, "ExamYearMonth": "Nov - Dec 2019" }
        //]
        var getExamMonth = PreExaminationService.GetExamMonthYears();
        getExamMonth.then(function (response) {
            if (response.Table.length > 0) {
                $scope.MonthAndYear = response.Table;
            } else {
                $scope.StudentType = [];
                alert("No Student found on this Record");
            }
        },
            function (error) {
                alert("error while loading Student Types");
                console.log(error);

            });
        var expanded = false;
        $scope.showCheckboxes = function () {
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

        //get schemes data for dropdown
        var SCHEMESEMINFO = StudentResultService.GetSchemeDataForResults();
        $scope.seminfo = [];
        $scope.examtypeinfo = [];
        $scope.pin = "";
        $scope.showData = 0;
        SCHEMESEMINFO.then(function (data) {
            if (data.length > 0) {

                $scope.schemeinfo = data;

            }
        }, function (error) {
            alert("unable to load Schemes");
        });
        $scope.optionToggled = function (mid1list) {
            $scope.isAllSelected = $scope.schemeinfo.every(function (itm) { return itm.selected; })
            $scope.arr = [];
            angular.forEach($scope.schemeinfo, function (value, key) {
                if (value.selected === true) {
                    console.log(value);
                    $scope.arr.push({ "schemeid": value.schemeid })
                }
            });
            console.log($scope.arr)
            console.log($scope.userTypes)

        }


        $scope.toggleAll = function () {
            var toggleStatus = $scope.isAllSelected;
            angular.forEach($scope.schemeinfo, function (itm) { itm.selected = toggleStatus; });
            $scope.arr = [];
            angular.forEach($scope.schemeinfo, function (value, key) {
                if (value.selected === true) {
                    console.log(value);
                    $scope.arr.push({ "schemeid": value.schemeid })
                }

            });
            //console.log($scope.arr)
            //console.log($scope.userTypes)
        }


        // student pass type 
        $scope.SelStudentType = 2;
        var LoadExamTypeBysem = StudentResultService.getStudentType();
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
                console.log(error);
            });

       

    
        function uploadFile(file, i) {
            var url = 'https://api.cloudinary.com/v1_1/joezimim007/image/upload'
            var xhr = new XMLHttpRequest()
            var formData = new FormData()
            xhr.open('POST', url, true)
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

            // Update progress (can be used to show progress indicator)
            xhr.upload.addEventListener("progress", function (e) {
                updateProgress(i, (e.loaded * 100.0 / e.total) || 100)
            })

            xhr.addEventListener('readystatechange', function (e) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    updateProgress(i, 100) // <- Add this
                }
                else if (xhr.readyState == 4 && xhr.status != 200) {
                    // Error. Inform the user
                }
            })

            formData.append('upload_preset', 'ujpu6gyk')
            formData.append('file', file)
            xhr.send(formData)
        }

        $scope.FileContains = false;
        $scope.$watch('myFile', function (newFileObj) {
            if (newFileObj) {
                $scope.filename = newFileObj.name;
                $scope.FileContains = true;
            }
        });
        $scope.tabledata = [];
        // reading excel data
        $scope.Exceldata = [];
        $scope.openExcel = function () {

            $scope.reload = false;
            $scope.tabledata = [];
            var reader = new FileReader();
            reader.readAsBinaryString($scope.myFile);
            reader.onload = function (e) {
                var data = e.target.result;
                var workbook = XLSX.read(data, {
                    type: 'binary',


                });

                workbook.SheetNames.forEach(function (sheetName) {
                    // Here is your object
                    var obj2 = []
                    $scope.XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    var json_object = JSON.stringify($scope.XL_row_object);
                    $scope.JsonObj = JSON.parse(json_object)

                    //var obj1 = { "StudentType": "Backlog" }
                    //for (i = 1; i < $scope.XL_row_object.length;i++) {
                    //obj2.push(obj1)
                    //}
                    //$scope.XL_row_object.merge(obj2);
                    if ($scope.XL_row_object.length > 0) {
                        $scope.XL_row_object.forEach(function (e) {
                            if (typeof e === "object") {
                                e["StudentType"] = $scope.SelStudentType
                            }
                            if (typeof e === "object") {
                                e["Exam_MonthYear"] = $scope.monthyear
                            }
                        });
                        var data = {};

                        $scope.tabledata.push({ rows: $scope.XL_row_object, cols: Object.keys($scope.XL_row_object[0]) });
                        $scope.Exceldata.push($scope.XL_row_object);


                        console.log($scope.Exceldata);

                        //$scope.$emit('showLoading', data);
                        console.log($scope.tabledata)
                        if ($scope.tabledata.length > 0) {
                            $scope.ShowTableData = true;
                            $scope.reload = true
                        } else {
                            $scope.reload = true

                            $scope.ShowTableData = false;
                        }

                        document.getElementById("myCheck").click();







                    } else {


                    }

                });



            };

            reader.onerror = function (ex) {
                console.log(ex);
            };

            // $scope.init();


        };

        //-----end-----
        $scope.UploadExcel = function () {


            //for (let obj of $scope.SampleData) {
            ////console.log("object:", obj);
            //    for (let key in obj) {
            //        //console.log("      key:", key, "value:", obj[key]);
            //        for (let obj1 of $scope.tabledata) {
            //        //console.log("object:", obj1);
            //            for (let key1 in obj1) {
            //                //  console.log("      key:", key, "value:", obj[key]);
            //                console.log(key, key1)
            //                if (key == key1) {
            //                    console.log('Matched')
            //                    break;
            //                } else {
            //                    console.log('Not Matched')

            //                }
            //            }
            //        }
            //    }
            //}
            //        $scope.SampleData.forEach(obj => {
            //    Object.entries(obj).forEach((key1, value1) => {

            //        $scope.tabledata.forEach(obj1 => {
            //            Object.entries(obj1).forEach((key2, value2) => {
            //                if (key1 == key2[0]) {
            //                                console.log("All Keys Matched")
            //                                // here is where you grab the value2.color
            //                            } else {
            //                    console.log(key2+"Column Names Not Matched")
            //                    return;

            //                            }
            //            });
            //            console.log('-------------------');
            //        });
            //    });
            //    console.log('-------------------');
            //});

            //for (i = 0; i < $scope.SampleData.length; i++) {
            // var   SampleData = $scope.SampleData[i];
            // for (i = 0; i < $scope.tabledata.length; i++) {
            //     var JsonObj = $scope.tabledata[i];
            //    }
            //}

            //angular.forEach($scope.SampleData, function (value1, key1) {
            //    angular.forEach($scope.tabledata, function (value2, key2) {

            //        if (key1 == key2) {
            //            alert("All Keys Matched")
            //            // here is where you grab the value2.color
            //        } else {
            //            alert("Column Names Not Matched")
            //        }
            //    });
            //});
            $scope.Exceldata = $scope.Exceldata[0]
            console.log($scope.Exceldata);
            //  angular.forEach($scope.Exceldata, function (value, key) {
            for (i = 0; i < $scope.Exceldata.length; i++) {
                if ($scope.Exceldata[i].examcent == "" || $scope.Exceldata[i].examcent == null || $scope.Exceldata[i].examcent == undefined || $scope.Exceldata[i].examcent == 'NULL') {
                    alert('examcent is required');
                    return;
                    break;

                }
                if ($scope.Exceldata[i].ExamcentName == "" || $scope.Exceldata[i].ExamcentName == null || $scope.Exceldata[i].ExamcentName == undefined || $scope.Exceldata[i].ExamcentName == 'NULL') {
                    alert('ExamcentName is required');
                    return;
                    break;
                }
                if ($scope.Exceldata[i].scheme == "" || $scope.Exceldata[i].scheme == null || $scope.Exceldata[i].scheme == undefined || $scope.Exceldata[i].scheme == 'NULL') {
                    alert('scheme is required');
                    return;
                    break;
                }
                if ($scope.Exceldata[i].Branchcode == "" || $scope.Exceldata[i].Branchcode == null || $scope.Exceldata[i].Branchcode == undefined || $scope.Exceldata[i].Branchcode == 'NULL') {
                    alert('Branchcode is required');
                    return;
                    break;
                }
                if ($scope.Exceldata[i].Subcode == "" || $scope.Exceldata[i].Subcode == null || $scope.Exceldata[i].Subcode == undefined || $scope.Exceldata[i].Subcode == 'NULL') {
                    alert('Subcode is required');
                    return;
                    break;
                }
                if ($scope.Exceldata[i].subname == "" || $scope.Exceldata[i].subname == null || $scope.Exceldata[i].subname == undefined || $scope.Exceldata[i].subname == 'NULL') {
                    alert('subname is required');
                    return;
                    break;
                }
                if ($scope.Exceldata[i].pcode == "" || $scope.Exceldata[i].pcode == null || $scope.Exceldata[i].pcode == undefined || $scope.Exceldata[i].pcode == 'NULL') {
                    alert('pcode is required');
                    return;
                    break;
                }
                if ($scope.Exceldata[i].pinno == "" || $scope.Exceldata[i].pinno == null || $scope.Exceldata[i].pinno == undefined || $scope.Exceldata[i].pinno == 'NULL') {
                    alert('pinno is required');
                    return;
                    break;
                }
                if ($scope.Exceldata[i].SName == "" || $scope.Exceldata[i].SName == null || $scope.Exceldata[i].SName == undefined || $scope.Exceldata[i].SName == 'NULL') {
                    alert('SName is required');
                    return;
                    break;
                }

            }
            //   })
            $scope.ShowTableData = false;
            $scope.reload = false
            var type = 1;
            var uploadJson = PreExaminationService.UploadResultJson($scope.Exceldata);
            uploadJson.then(function (data) {
                console.log(data)
                //try {
                //    var data = JSON.parse(data);
                //    console.log(data)
                //    if (data.ResponceCode == '400') {
                //        alert('Data Already Inserted, Please check the downloaded Excel for more details')
                //        var location = data.ResponceDescription;
                //        window.location.href = location;

                //    }
                //} catch (err) { }
                var data = JSON.parse(data);
                if (data.Table[0].ResponceCode == '200') {
                    $scope.reload = true;
                    $('#upldfile').val(null);
                    alert(data.Table[0].ResponceDescription)
                } else if (data.Table[0].ResponceCode == '400') {
                    $scope.reload = true;
                    alert(data.Table[0].ResponceDescription)
                }
                else {
                    $scope.reload = true;
                    $('#upldfile').val(null);
                    alert('Something Went Wrong')
                }
                //$scope.tabledata;
            }, function (error) {
                $('#upldfile').val(null);
                $scope.reload = true;
                $scope.gentmetbl = false;
                $scope.ResultNotFound = true;
                $scope.Result = false;
                $scope.LoadImg = false;
            });
        }
        $scope.upload = function () {

            console.log($scope.tabledata)
            var uploadExcl = PreExaminationService.uploadExcel($scope.myFile);


            uploadExcl.then(function (res) {
                if (res == '1') {

                }
            }, function (err) {
            })


        }
        $scope.init = function () {
            var i, j, column, cell;
            var records = [],
                record;
            var temp = $scope.XL_row_object;
            $scope.numRows = 10;
            $scope.numColumns = 20;


            for (i = 0; i < $scope.numRows; i++) {
                record = [];
                for (j = 0; j < $scope.numColumns; j++) {
                    cell = {
                        value: ''
                    }
                    record.push(cell);
                }
                records.push(record);
            }
            $scope.records = $scope.XL_row_object;

        }

        // $scope.init();

        var hideContextMenu = function () {
            $scope.isContextMenuVisible = false;
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }
        };
        $scope.numRows = 0;
        $scope.numColumns = 0;

        $scope.isContextMenuVisible = false;
        $scope.contextmenuRowIndex = -1;
        $scope.contextmenuColumnIndex = -1
        $scope.openContextMenu = function ($event, rowIndex, columnIndex) {
            $event.preventDefault();

            if ($event.button === 0) {
                $scope.isContextMenuVisible = false;
                return;
            }

            $scope.contextmenuRowIndex = rowIndex;
            $scope.contextmenuColumnIndex = columnIndex;
            $scope.contextMenuStyle = {
                top: $event.clientY + 'px',
                left: $event.clientX + 'px'
            };
            $scope.isContextMenuVisible = true;
        };
        $scope.addRow = function () {
            var i,
                record,
                cell,
                index = $scope.contextmenuRowIndex;

            record = [];
            for (i = 0; i < $scope.numColumns; i++) {
                cell = {
                    value: 'New Cell'
                }
                record.push(cell);
            }

            $scope.records.splice(index, 0, record);
            $scope.isContextMenuVisible = false;
            $scope.numRows = $scope.records.length;
        };
        $scope.removeRow = function () {
            var index = $scope.contextmenuRowIndex;
            $scope.records.splice(index, 1);
            $scope.isContextMenuVisible = false;
            $scope.numRows = $scope.records.length;
        };
        $scope.addColumn = function () {
            var i, record;
            for (i = 0; i < $scope.records.length; i++) {
                record = $scope.records[i];
                record.splice($scope.contextmenuColumnIndex, 0, {
                    value: 'New Col'
                });
            }

            $scope.numColumns = record.length;
        };
        //var LoadActiveSchemes = AssessmentService.getSchemes(2);
        //LoadActiveSchemes.then(function (response) {
        //    $scope.ActiveSchemes = response;
        //},
        //    function (error) {
        //        alert("error while loading Schemes");
        //        var err = JSON.parse(error);
        //        console.log(err.Message);
        //    });

        //var LoadActiveSemesters = AssessmentService.getActiveSemester();
        //LoadActiveSemesters.then(function (response) {
        //    $scope.Semester = response.Table;
        //    //  console.log($scope.ActiveSemesters)
        //},
        //function (error) {
        //    alert("error while loading semesters");
        //    var err = JSON.parse(error);
        //    console.log(err.Message);
        //});






        //var LoadActiveSchemes = AssessmentService.getSchemes(2);
        //LoadActiveSchemes.then(function (response) {
        //    $scope.getActiveSchemes = response;
        //},
        //    function (error) {
        //        alert("error while loading Schemes");
        //        var err = JSON.parse(error);
        //        console.log(err.Message);
        //    });




        //var LoadActiveSemesters = AssessmentService.getActiveSemester();
        //LoadActiveSemesters.then(function (response) {
        //    $scope.sems = response.Table;
        //    //  console.log($scope.ActiveSemesters)
        //},
        //function (error) {
        //    alert("error while loading semesters");
        //    var err = JSON.parse(error);
        //    console.log(err.Message);
        //});


        $scope.Download = function () {

            var location = window.location.origin
            //console.log(location + '/Results/C18/C16C18SamapleFormate.xlsx');
            //window.location.replace('/Results/C18/C16C18SamapleFormate.xlsx');
            window.location.href = location + '/Results/Results_Sample_Format.xlsx';



        }
        $scope.removeColumn = function () {
            var i, record;
            for (i = 0; i < $scope.records.length; i++) {
                record = $scope.records[i];
                record.splice($scope.contextmenuColumnIndex, 1);
            }

            $scope.numColumns = record.length;
        };

        $document.bind('click', function ($evt) {
            var target = angular.element($evt.target).closest('table');
            if (target.length === 0)
                hideContextMenu();

        });




        //---- progress --------------

        var circles = $('.progress .circle');
        var currentCircle = circles.first();
        var previousCircle = $();

        (function () {
            currentCircle.addClass('active');
            previousCircle.removeClass('active').addClass('done');

            var bar = currentCircle.prev();
            bar.addClass('done');

            previousCircle = currentCircle;
            currentCircle = currentCircle.nextAll('.circle:first');

            if (previousCircle.length) {
                setTimeout(arguments.callee, 1000);
            }
        })();


    });
    app.directive('ngRightClick', function ($parse) {
        return function (scope, element, attrs) {
            var fn = $parse(attrs.ngRightClick);
            element.bind('contextmenu', function (event) {
                scope.$apply(function () {
                    event.preventDefault();
                    fn(scope, {
                        $event: event
                    });
                });
            });
        };

        //var SCHEMESEMINFO = StudentWiseService.GetSchemeDataForResults();
        //$scope.pin = "";
        //SCHEMESEMINFO.then(function (data) {
        //    if (data.length > 0) {

        //        $scope.schemeinfo = data;

        //    }
        //}, function (error) {
        //    alert(error);00000000000000000000004
        //});
        $scope.validate = function () {
            $scope.getTable = true;
        }

    });


});

