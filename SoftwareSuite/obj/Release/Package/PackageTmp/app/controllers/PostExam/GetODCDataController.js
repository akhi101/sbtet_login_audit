define(['app'], function (app) {
    app.controller("GetODCDataController", function ($scope, $q, $http, $localStorage, $state, DigitalSignatureService, $stateParams, AppSettings, $uibModal, $timeout, PreExaminationService) {
        //$scope.ApproveStatus = $localStorage.CertificateData.ApproveType;
        ////alert($scope.ApproveStatus)
        //$scope.Scheme = $localStorage.CertificateData.Scheme
        var authData = $localStorage.authorizationData;
        $scope.UserTypeId = authData.SystemUserTypeId

        $scope.btndisable = false;
        $scope.buttonlabel = "Approve";


        var PaymentStudentList = []
        var PaymentStudent = []
        var data = {};
        //$scope.$emit('showLoading', data);
        $scope.Data = false;
        $scope.Nodata = false;
        const $ctrl = this;
        $ctrl.$onInit = () => {
          //  $scope.getlist();
            $scope.smsbtndisable = false;
        }

        DigitalSignatureService.GetUserCertificates().then(
            function (res) {
                if (res.length > 0) {
                    $scope.UserCertificates = res;
                }

            }, function (error) {
                console.log(error);
                $scope.data = false;
                $scope.error = true;
            });

        $scope.getlist = function () {
            var ApproveLists = PreExaminationService.getApprovePinList($scope.Scheme, $scope.ApproveStatus, $scope.UserTypeId);
            ApproveLists.then(function (response) {
                var response = JSON.parse(response)

                if (response.Table[0].ResponseCode == '200') {
                    if (response.Table1.length >= 1) {
                        $scope.$emit('hideLoading', data);
                        $scope.ApprovePinList = response.Table1;
                        for (var j = 0; j < response.Table1.length; j++) {
                            $scope['smsbtndisable' + j] = false;
                        }
                        PaymentStudentList = []
                        PaymentStudent = []
                        $scope.Data = true;
                        $scope.Nodata = false;
                    } else {
                        $scope.$emit('hideLoading', data);
                        $scope.Data = false;
                        $scope.Nodata = true;
                    }
                } else {
                    $scope.$emit('hideLoading', data);
                    $scope.Data = false;
                    $scope.Nodata = true;
                }




            },
                function (error) {
                    $scope.$emit('hideLoading', data);

                    $scope.Data = false;
                    $scope.Nodata = true;
                    alert("error while loading data");
                });
        }

        $scope.ResetCertificateStatus = function (PIN, Path) {
            if (Path == null || Path == '' || Path == undefined) {
                var Path = '';
            }
            var ResetCertificateStatus = PreExaminationService.ResetCertificateStatus(2, PIN, Path);
            ResetCertificateStatus.then(function (response) {
                try { var response = JSON.parse(response) } catch (err) { }
                if (response[0].ResponceCode == "200") {
                    alert(response[0].ResponceDescription);
                    $scope.getlist();
                } else {
                    alert(response[0].ResponceDescription);
                    $scope.getlist();
                }

            }, function (err) {
                $scope.getlist();
            });



        }

        $scope.sensSMS = function (PIN, Path, mobile, ind) {
            if ($scope.UserTypeId == 1007 || $scope.UserTypeId == 1002 || $scope.UserTypeId == 1009 || $scope.UserTypeId == 5) {
                if (mobile == null || angular.isUndefined(mobile) || mobile == "") {
                    alert("Mobile No not Found");
                    return;
                }
                if (Path == null || angular.isUndefined(Path) || Path == "") {
                    alert("Certificate not found");
                    return;
                }
                $scope['smsbtndisable' + ind] = true;
                var resultpath = Path.replace(/(^\w+:|^)\/\//, '');
                var sensSMS = PreExaminationService.sendcertSMS(PIN, resultpath, mobile, "Interim");
                sensSMS.then(function (response) {
                    try { var response = JSON.parse(response) } catch (err) { }
                    if (response == "SUCCESS") {
                        var UpdateSmsStatus = PreExaminationService.UpdateSmsStatus(2, PIN);
                        UpdateSmsStatus.then(function (response) {
                            try { var response = JSON.parse(response) } catch (err) { }
                            if (response[0].ResponceCode == "200") {
                                alert(response[0].ResponceDescription);
                                $scope.getlist();
                            } else {
                                alert(response[0].ResponceDescription);
                                $scope.getlist();
                            }
                            $scope['smsbtndisable' + ind] = false;
                        }, function (err) {
                            $scope['smsbtndisable' + ind] = false;
                            $scope.getlist();
                        });

                    } else {
                        alert(response);
                        $scope.getlist();
                    }
                    $scope['smsbtndisable' + ind] = false;
                }, function (err) {
                    $scope['smsbtndisable' + ind] = false;
                    $scope.getlist();
                });

            }
        }

        $scope.openDetail = function (data) {
            //var data =Json.parse(data)
            $localStorage.ApprovalData = {
                Pin: data.PIn,
                Name: data.Name
            }
            $state.go('Dashboard.PostExam.InterimCertificatePending');
        }

        $scope.openDetails = function (Pin, CertificateType) {

            $localStorage.Interim = {
                Certificate: CertificateType,
                pin: Pin
            }

            $state.go('Dashboard.PostExam.InterimCertificatePending');
        }

        $scope.openPending = function (pin, CertificateType) {


            $localStorage.certData = {
                Certificate: CertificateType,
                pin: pin
            }
            $state.go('Dashboard.PostExam.InterimCertificatePending');


        }

        $scope.Open = function (pin, CertificateType) {
            if ($scope.UserTypeId == 1009) {
                $localStorage.Interim = {
                    Certificate: CertificateType,
                    pin: pin
                }
                $state.go('Dashboard.PostExam.InterimCertificate')
            } else {

            }
        }

        $scope.OpenData = function (pin, CertificateType) {
            $localStorage.Interim = {
                Certificate: CertificateType,
                pin: pin
            }
            $state.go('Dashboard.PostExam.InterimCertificate')
        }


        Array.prototype.remByVal = function (val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] === val) {
                    this.splice(i, 1);
                    break;
                }
            }
            return this;
        }

        Array.prototype.remElementByVal = function (val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i].PIN === val) {
                    this.splice(i, 1);
                    break;
                }
            }
            return this;
        }

        $scope.selectAll = function (val) {
            PaymentStudent = [];

            if (val == true) {
                for (var i = 0; i < $scope.ApprovePinList.length; i++) {

                    $scope.ApprovePinList[i].isChecked = true;
                    if ($scope.ApprovePinList[i].isChecked) {
                        dataPay = {};
                        dataPay.PIN = $scope.ApprovePinList[i].PIN
                        PaymentStudent.push(dataPay);
                        PaymentStudentList.push($scope.ApprovePinList[i].PIN);
                    }
                }

            } else {
                for (var i = 0; i < $scope.ApprovePinList.length; i++) {
                    $scope.ApprovePinList[i].isChecked = false;
                    PaymentStudent = [];
                    PaymentStudentList = [];
                }
            }
            //   console.log(PaymentStudent);
        };

        $scope.selectEntity = function (data) {

            $scope.allItemsSelectedthing = false;
            if (data != null) {
                if (!PaymentStudentList.includes(data.PIN)) {
                    dataPay = {};
                    dataPay.PIN = data.PIN.trim();
                    PaymentStudent.push(dataPay);
                    PaymentStudentList.push(data.PIN);
                }
                else if (PaymentStudentList.includes(data.PIN)) {
                    PaymentStudentList.remByVal(data.PIN);
                    PaymentStudent.remElementByVal(data.PIN);
                    if (PaymentStudentList.length == 0) {
                        $scope.allItemsSelectedthing = false;
                    }
                }

            }

        };


        Array.prototype.remByVal = function (val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] === val) {
                    this.splice(i, 1);
                    break;
                }
            }
            return this;
        }

        Array.prototype.remElementByVal = function (val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i].PIN === val) {
                    this.splice(i, 1);
                    break;
                }
            }
            return this;
        }


        $scope.checkODC = function () {
            $scope.ResultFound = false;
            $scope.ResultNotFound = false;
           
        }

        $scope.GetODC = function (Pin) {

            if ((Pin == undefined) || (Pin == "0") || (Pin == "")) {
                alert("Enter PIN");
                return;
            }
            $scope.ODCPin = Pin;
            $scope.LoadImg = true;
            $scope.ResultFound = false;
            $scope.ResultNotFound = false;
            var getmemodetails = PreExaminationService.getTranscriptODCDetailsByPin(Pin);
            getmemodetails.then(function (res) {
                try { var response = JSON.parse(res) } catch (err) { }
               
                if (response.Table[0].ResponceCode == '200') {
                    $scope.ODCstudData = response.Table1[0];
                    $scope.Odcmarkstable = response.Table2;
                    $scope.ResultFound = true;
                    $scope.LoadImg = false;
                    $scope.ResultNotFound = false;
                }
                else {
                    $scope.ODCstudData = [];
                    $scope.Odcmarkstable = [];
                    $scope.ResultFound = false;
                    $scope.LoadImg = false;
                    $scope.ResultNotFound = true;

                }


            }, function (err) {
                $scope.ResultFound = false;
                $scope.LoadImg = false;
                $scope.ResultNotFound = true;

            })

        }




        $scope.Approve = function () {
            if (PaymentStudent != [] && PaymentStudent != '') {
                var ApproveStatus = 1
                $scope.btndisable = true;
                if ($scope.UserTypeId == '1009') {
                    if (angular.isUndefined($scope.UserCertificates) || $scope.UserCertificates[0].SerialNumber == null) {
                        alert('Link the Digital signature to sign the documents');
                        return;
                    }
                    $scope.buttonlabel = "Signing in process ...";
                    var GetInterimCertificateTobeSignedlocation = PreExaminationService.GetInterimCertificateTobeSignedlocation(PaymentStudent)
                    GetInterimCertificateTobeSignedlocation.then(function (response) {
                        var location = window.location.origin;
                        if (location == "https://sbtet.telangana.gov.in" || location == "https://www.sbtet.telangana.gov.in") {
                            location += "/API/"
                        } else {
                            location += "/"
                        }
                        var responseurl = location + "api/StudentCertificate/StoreSignedCertificate";
                        var paramObject = []
                        if (response.length > 0) {
                            for (var i = 0; i < response.length; i++) {

                                if ($scope.Scheme == 'C18') {
                                    var obj = {
                                        "Pin": response[i].Pin,
                                        "CertificateServiceId": 2,
                                        "PdfLocation": response[i].PdfUrl,
                                        "SerialNumber": $scope.UserCertificates[0].SerialNumber,
                                        "ApplicationNo": angular.isUndefined(response[i].ApplicationNumber) ? "" : response[i].ApplicationNumber,
                                        "Designation": "CONTROLLER OF EXAMINATIONS, SBTET, TELANGANA",
                                        "llx": 360,
                                        "lly": 405,
                                        "urx": 360 + 170,
                                        "ury": 405 + 50,
                                        "responseUrl": btoa(responseurl)
                                    }
                                } else {

                                    var obj = {
                                        "Pin": response[i].Pin,
                                        "CertificateServiceId": 2,
                                        "PdfLocation": response[i].PdfUrl,
                                        "SerialNumber": $scope.UserCertificates[0].SerialNumber,
                                        "ApplicationNo": angular.isUndefined(response[i].ApplicationNumber) ? "" : response[i].ApplicationNumber,
                                        "Designation": "CONTROLLER OF EXAMINATIONS, SBTET, TELANGANA",
                                        "llx": 360,
                                        "lly": 170,
                                        "urx": 360 + 170,
                                        "ury": 170 + 50,
                                        "responseUrl": btoa(responseurl)
                                    }
                                }

                                //var obj = {
                                //    "Pin": response[i].Pin,
                                //    "CertificateServiceId": 2,
                                //    "PdfLocation": response[i].PdfUrl,
                                //    "SerialNumber": $scope.UserCertificates[0].SerialNumber,
                                //    "ApplicationNo": angular.isUndefined(response[i].ApplicationNumber) ? "" : response[i].ApplicationNumber,
                                //    "Designation": "CONTROLLER OF EXAMINATIONS, SBTET, TELANGANA",
                                //    "llx": 360,
                                //    "lly": 100,
                                //    "urx": 360 + 170,
                                //    "ury": 100 + 50,
                                //    "responseUrl": btoa(responseurl)
                                //}
                                console.log(obj)
                                paramObject.push(obj)
                            }
                            var SignPdf = PreExaminationService.SignMultiplePdf(paramObject)
                            SignPdf.then(function (response) {
                                if (response.length > 0) {
                                    var signedpins = [];
                                    response.forEach(function (item, index) {
                                        if (item.status == "SUCCESS") {
                                            signedpins.push({ "PIN": item.Pin });
                                        }
                                    });
                                    if (signedpins.length <= 0) {
                                        alert("certificate signing failed ");
                                        $scope.btndisable = false;
                                        $scope.buttonlabel = "Approve";
                                        return;
                                    }

                                    var getData = PreExaminationService.InterimSetApproveStatus(signedpins, $scope.UserTypeId, ApproveStatus)
                                    getData.then(function (response) {
                                        var response = JSON.parse(response)
                                        if (response.Table[0].ResponseCode == '200') {
                                            alert(response.Table[0].ResponseDescription);
                                            $scope.buttonlabel = "Approve";
                                            $scope.btndisable = false;
                                            $scope.getlist();
                                        } else {
                                            alert(response.Table[0].ResponseDescription);
                                            $scope.btndisable = false;
                                            $scope.buttonlabel = "Approve";
                                            $scope.getlist();
                                        }
                                    }, function (error) {
                                        $scope.result = false;
                                        $scope.btndisable = false;
                                        $scope.buttonlabel = "Approve";
                                    });
                                }

                            }, function (err) {
                                $scope.btndisable = false;
                                $scope.buttonlabel = "Approve";
                                alert("sigining service not available");
                            });
                        }
                    }, function (err) {
                        $scope.btndisable = false;
                        $scope.buttonlabel = "Approve";
                    });



                } else if ($scope.UserTypeId == 1007 || $scope.UserTypeId == 1002) {
                    var getData = PreExaminationService.InterimSetApproveStatus(PaymentStudent, $scope.UserTypeId, ApproveStatus)
                    getData.then(function (response) {
                        var response = JSON.parse(response)
                        if (response.Table[0].ResponseCode == '200') {
                            alert(response.Table[0].ResponseDescription);
                            $scope.btndisable = false;
                            $scope.getlist();
                        } else {
                            alert(response.Table[0].ResponseDescription);
                            $scope.btndisable = false;
                            $scope.getlist();
                        }
                    }, function (error) {
                        $scope.result = false;
                        $scope.btndisable = false;
                    });

                } else {
                    alert('not eligible to for this action');
                }
            } else {
                alert('select the pins');
                return;
            }
        }





        $scope.Reject = function () {
            $swcope.remarks = '';
            //$scope.modalInstance = $uibModal.open({
            //    templateUrl: "/app/Controllers/PostExam/RejectPopup.html",
            //    size: 'xlg',
            //    scope: $scope,
            //    windowClass: 'modal-fit-att',
            //});
        }


        $scope.closeModal = function () {
            $scope.modalInstance.close();
        }

        $scope.Submit = function (remarks) {
            if (PaymentStudent != [] && PaymentStudent != '') {
                var ApproveStatus = 2
                $scope.btndisable = true;

                var Approve = PreExaminationService.InterimSetApproveStatusReject(PaymentStudent, $scope.UserTypeId, ApproveStatus, remarks);
                Approve.then(function (response) {
                    var response = JSON.parse(response)
                    if (response.Table[0].ResponseCode == '200') {
                        alert(response.Table[0].ResponseDescription)
                        $scope.btndisable = false;
                        $scope.getlist();

                    } else if (response.Table[0].ResponseCode == '400') {
                        alert(response.Table[0].ResponseDescription)
                        $scope.btndisable = false;
                        $scope.getlist();
                    }
                    else {
                        //$scope.$emit('hideLoading', data);
                        $scope.Data = false;
                        $scope.Nodata = true;

                    }
                    //alert("Success")

                },
                    function (error) {
                        //$scope.$emit('hideLoading', data);
                        $scope.btndisable = false;

                        $scope.Data = false;
                        $scope.Nodata = true;
                        alert("error while loading data");
                    });
            } else {
                alert('select the pins');
                return;
            }
        }


    })
})