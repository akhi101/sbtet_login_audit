define(['app'], function (app) {
    app.controller("StudentRegController", function ($filter, $crypto, $http, $scope, $state, $localStorage, $stateParams, AppSettings, StudentRegService, $rootScope, SystemUserService) {
        var authData = JSON.parse(sessionStorage.getItem('user'));
        const $ctrl = this;
        $ctrl.$onInit = () => {
            var eKey = SystemUserService.GetEKey();
            eKey.then(function (res) {
                $scope.LoginEKey = res;
            });
        }

        $scope.userType = authData.SystemUserTypeId;
        if ($scope.userType == 2 || $scope.userType == 3) {
            alert("UnAuthorized Access")
            $state.go('Dashboard')
        }
        $scope.CompanyName = AppSettings.CompanyName;
        $scope.LoginYear = AppSettings.SelectedYear;
        var PageNm = $state.current.name.split(".")[1];
        var RightForCurrentPage = [];
        var UsersRightsdata = [];
        $scope.Form = true;
        $scope.details = false;
        var submitted = false;
        //var authData = $localStorage.authorizationData;
        //$scope.userType = authData.SystemUserTypeId;
        $scope.categorydisable = true;
        $scope.DOBDisable = true;
        $scope.Religiondisable = true;
        //var studentID = $stateParams.StudRegID;
        //alert(studentID)
        var studentID = window.localStorage.StudRegID;
        //console.log(studentID)
        $scope.RouteName = window.localStorage.RouteName;
        // var studentID = '52399';
        UsersRightsdata = AppSettings.UserRights;

        $scope.mandals = [];
        $scope.PreDisable = true;
        $scope.stdIsScholarshipRequired = false;
        //$scope.closeModal = function () {
        //    $rootScope.modalInstance.close('a');
        //}

        $('#ParentContact').keypress(function (e) {
            var regex = new RegExp("^[0-9-]+$");
            var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
            if (regex.test(str)) {
                return true;
            }

            e.preventDefault();
            return false;
        });


        $('#stdMobile').keypress(function (e) {
            var regex = new RegExp("^[0-9-]+$");
            var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
            if (regex.test(str)) {
                return true;
            }

            e.preventDefault();
            return false;
        });


        $scope.hasError = function (field, validation) {
            if (validation) {
                return ($scope.studentRegForm[field].$dirty && $scope.studentRegForm[field].$error[validation]) || ($scope.submitted && $scope.studentRegForm[field].$error[validation]);
            }
            return ($scope.studentRegForm[field].$dirty && $scope.studentRegForm[field].$invalid) || ($scope.submitted && $scope.studentRegForm[field].$invalid);
        };

        $scope.goToStudentList = function () {
            $state.go('Dashboard.AdmissionDashboard.Admission.StudentRegList');
        };

        $scope.UpdateFirstPage = function () {
            //if ($scope.FileName == null || $scope.FileName == "" || $scope.FileName == undefined) {
            //    $scope.StudentReg.PhotoUpload =0
            //} else {
            //    $scope.StudentReg.PhotoUpload = 1
            //}
            console.log($scope.StudentReg)
            if ($scope.StudentReg.profilephoto == null || $scope.StudentReg.profilephoto == '') {
                alert('Please Upload photo')
            } else if ($scope.StudentReg.CandidateSign == null || $scope.StudentReg.CandidateSign == '') {
                alert('Please Upload Sign')
            } else if ($scope.StudentReg.StudentContact.length > 10) {
                alert("Student Mobile number must be 10 digits")
            } else if ($scope.StudentReg.ParentContact.length > 10) {
                alert("Parent Mobile number must be 10 digits")
            
            } else {
                //alert("Updating Student Details");
                //validation

                $scope.submitted = true;

                $scope.StudentReg.UpdLoginId = $localStorage.authorizationData.SysUserID;
                $scope.StudentReg.SpecialCategoryId = "";
                var spCatStr = "";
                angular.forEach($scope.staticData.Table10, function (data) {
                    var chk = document.getElementById('spCatId' + data.SpecialCategoryId);
                    if (chk.checked) {
                        spCatStr += data.SpecialCategoryId + ",";
                    }
                });
                if (spCatStr.length > 0) {
                    spCatStr = spCatStr.slice(0, spCatStr.length - 1);
                    $scope.StudentReg.SpecialCategoryId = spCatStr;
                }

                // console.log("Sending Object");
                //console.log($scope.StudentReg);

                try {
                    if ($scope.StudentReg.DateOfBirth !== null && $scope.StudentReg.DateOfBirth !== undefined) {
                        var d = $scope.StudentReg.DateOfBirth.toISOString().slice(0, 10).split('-');
                        if (d[0].length === 4) {
                            $scope.StudentReg.DateOfBirth = d[2] + "-" + d[1] + "-" + d[0];
                        }
                    }
                    else {
                        $scope.StudentReg.DateOfBirth = null;
                    }
                } catch (err) {
                    //alert(err);
                }


                var formStatus = $scope.studentRegForm.$valid;

                if (formStatus) {
                    StudentRegService.UpdateStudentReg($scope.StudentRegCopy).then(function (data) {
                        if (data != "Updated Successfully") {
                            var res1 = JSON.parse(data);
                            try {
                                var res2 = JSON.parse(res1);
                            }
                            catch
                            {

                            }
                            const keyToExclude = 'm4e/P4LndQ4QYQ8G+RzFmQ==';
                            if (res2.Status) {
                                // var keys = Object.keys(res);

                                //   $scope.statusKey = keys[0];
                                $scope.statusValue = res2.Status;

                                // $scope.descriptionKey = keys[1];
                                $scope.descriptionValue = res2.Description;

                                $scope.EncStatusDescription2 = $scope.descriptionValue;
                                if ($scope.statusValue == '6tEGN7Opkq9eFqVERJExVw==') {
                                    $scope.decryptParameter2();
                                    alert($scope.decryptedParameter2);

                                }
                            }
                        }

                        else {

                            alert("Student Details Updated Successfully!");
                            var StudentRegReq = StudentRegService.GetStudentRegById(studentID).then(function (data) {

                                data = data[0];
                                if (data.DateOfBirth !== undefined) {
                                    if (data.DateOfBirth !== null) {
                                        var d = data.DateOfBirth.split('-');
                                    }
                                    if (d !== undefined && d[2] !== null && d[2] !== undefined) {
                                        if (d[2].length === 4)
                                            data.DateOfBirth = new Date(d[2] + "-" + d[1] + "-" + d[0]);
                                    }
                                }
                                else {
                                    $scope.StudentReg.DateOfBirth = null;
                                }

                                //if ($scope.StudentReg.DateOfBirth != null && $scope.StudentReg.DateOfBirth != "" && $scope.StudentReg.DateOfBirth != undefined) {


                                //}
                                $scope.StudentReg = data;
                                if (data.SemId > 1 && data.SemId < 9) {
                                    $scope.DOBDisable = false;
                                } else {
                                    $scope.DOBDisable = true;
                                }


                                if (data.CategoryId == 1 || $scope.userType == 2) {
                                    $scope.categorydisable = false;
                                    $scope.Religiondisable = false;
                                } else {
                                    $scope.categorydisable = true;
                                    $scope.Religiondisable = true;
                                }
                                $scope.updateMandals();
                                // console.log(data);
                                if ($scope.StudentReg.SpecialCategoryId !== null) {
                                    var spCatList = $scope.StudentReg.SpecialCategoryId.split(',');

                                    if (spCatList.length > 0 && $scope.StudentReg.SpecialCategoryId !== "") {
                                        angular.forEach(spCatList, function (data) {
                                            document.getElementById('spCatId' + data).checked = true;
                                        });
                                    }
                                }


                                var Aadharstatus = $scope.StudentReg.AadharVerfied;

                                // console.log("Aadhaar status " + Aadharstatus);
                                if (Aadharstatus) {
                                    $scope.AadhaarStatus = true;
                                }
                                else {
                                    $scope.AadhaarStatus = false;
                                }
                                //$scope.updateMandals();

                            },
                                function (error) {
                                    alert(error);
                                });
                            $state.go('Dadshboard.AdmissionDashboard.Admission.StudentRegList');
                            // $state.go('Admission.StudentRegList', { 'StudRegID': 0 });
                            // toaster.pop('success', 'update', 'student details are updated successfully');
                            //$rootScope.modalInstance.close('a');
                        }
                    }, function (err) {
                        // try {
                        //     err = JSON.parse(err);
                        //     var errs = Object.keys(err.ModelState);
                        //     var errStr = "";
                        //     for (var i = 0; i < errs.length; i++) {
                        //         // console.log(err.ModelState[errs[i]]);
                        //         errStr += err.ModelState[errs[i]][0] + "\n";
                        //     }
                        // alert(errStr);
                        console.log(err);
                        // } catch (err) {
                        //     console.log(err);
                        // }
                    });
                }
                else {
                    alert("fields are missing");
                    //toaster.pop('error', 'error', 'some some fields are missing');

                }
            }
        }
        var GetDistricts = StudentRegService.getDistricts()
        GetDistricts.then(function (data) {
            // console.log(data);

            $scope.districts = data.Table
        }, function (error) {
            alert(error);
        });

        function restrictAlphabets(e) {
            var x = e.which || e.keycode;
            if ((x >= 48 && x <= 57) || x == 8 ||
                (x >= 35 && x <= 40) || x == 46)
                return true;
            else
                return false;
        }




        $scope.updateMandals = function () {
            StudentRegService.GetMandalsForDistrict($scope.StudentReg.DistrictId).then(function (data) {
                $scope.mandals = data;
                // console.log(data.Table);
            }, function (error) {
                alert(error);
            });
        }

        $scope.selectioncheck = function (val) {
            if (val.SpecialCategoryId !== "" || val.SpecialCategoryId !== null && val.SpecialCategoryId !== undefined)
                angular.forEach($scope.staticData.Table10, function (data) {
                    var chk = document.getElementById('spCatId' + data.SpecialCategoryId);
                    if (data.SpecialCategoryId != val.SpecialCategoryId) {
                        chk.checked = false;
                    }
                });

        }

        //$scope.updateMandals = function () {
        //    StudentRegService.GetMandalsForDistrict($scope.StudentReg.DistrictId).then(function (data) {
        //        $scope.mandals = data.Table;
        //        console.log("mandals" + data.Table);
        //    }, function (error) {
        //        alert(error);
        //    });
        //}

        var stydentPrintData = StudentRegService.GetStudentDetailsPrint(studentID).then(function (data) {

            $scope.printData = data[0];
            
        },
            function (error) {
                alert(error);
            });



        function encAadhar(aadhaar) {
            if (aadhaar && aadhaar.length === 12) {
                return $crypto.encrypt($crypto.encrypt($scope.AadharNo, 'HBSBP9214EDU00TS'), $scope.LoginEKey) + '$$@@$$' + $scope.LoginEKey;
            }
            return aadhaar; // Return original if not 12 digits
        }


        function encAadhar(aadhaar) {
            if (aadhaar && aadhaar.length === 12) {
                return $crypto.encrypt($crypto.encrypt($scope.AadharNo, 'HBSBP9214EDU00TS'), $scope.LoginEKey) + '$$@@$$' + $scope.LoginEKey;
            }
            return aadhaar; // Return original if not 12 digits
        }
        function encFAadhar(aadhaar) {
            if (aadhaar && aadhaar.length === 12) {
                return $crypto.encrypt($crypto.encrypt($scope.FAadharNo, 'HBSBP9214EDU00TS'), $scope.LoginEKey) + '$$@@$$' + $scope.LoginEKey;
            }
            return aadhaar; // Return original if not 12 digits
        }
        function encMAadhar(aadhaar) {
            if (aadhaar && aadhaar.length === 12) {
                return $crypto.encrypt($crypto.encrypt($scope.MAadharNo, 'HBSBP9214EDU00TS'), $scope.LoginEKey) + '$$@@$$' + $scope.LoginEKey;
            }
            return aadhaar; // Return original if not 12 digits
        }

        var StudentRegReq = StudentRegService.GetStudentRegById(studentID).then(function (data) {

            data = data[0];
            $scope.AadharNo = data.AadharNo;
            $scope.FAadharNo = data.FatherAadhaarNo;
            $scope.MAadharNo = data.MotherAadhaarNo;
            var aadhaar = $scope.AadharNo;
            if (aadhaar.length == 12) {  // Ensure it's a valid Aadhaar length
                $scope.maskedAadhaar = "XXXXXXXX" + aadhaar.substring(8);
            } 
            else {
                $scope.maskedAadhaar = "";
            }
            var Faadhaar = $scope.FAadharNo;
            if (Faadhaar.length == 12) {  // Ensure it's a valid Aadhaar length
                $scope.maskedFAadhaar = "XXXXXXXX" + Faadhaar.substring(8);
            }
            else {
                $scope.maskedFAadhaar = "";
            }
            var MAadharNo = $scope.MAadharNo;
            if (MAadharNo.length == 12) {  // Ensure it's a valid Aadhaar length
                $scope.maskedMAadhaar = "XXXXXXXX" + MAadharNo.substring(8);
            } 
            else {
                $scope.maskedMAadhaar = "";
            }
            if (data.DateOfBirth !== undefined) {
                if (data.DateOfBirth !== null) {
                    var d = data.DateOfBirth.split('-');
                }
                if (d !== undefined && d[2] !== null && d[2] !== undefined) {
                    if (d[2].length === 4)
                        data.DateOfBirth = new Date(d[2] + "-" + d[1] + "-" + d[0]);
                }
            }
            else {
                $scope.StudentReg.DateOfBirth = null;
                $scope.maskedAadhaar = aadhaar; // Show original if length is not 12
            }

            //if ($scope.StudentReg.DateOfBirth != null && $scope.StudentReg.DateOfBirth != "" && $scope.StudentReg.DateOfBirth != undefined) {


            //}
            $scope.StudentReg = data;
            $scope.StudentId = data.StudentId;
            $scope.PIN = data.PIN;
            $scope.AcademicYearId = data.AcademicYearId;
            $scope.ShiftId = data.ShiftId;
            $scope.Name = data.Name;
            $scope.StudentId = data.Gender;
            $scope.StudentId = data.DateOfBirth;
            $scope.StudentId = data.FatherName;
            $scope.StudentId = data.profilephoto;
            $scope.StudentId = data.CandidateSign;
            $scope.FatherName = data.FatherName;
            $scope.CategoryId = data.CategoryId;
            $scope.AdmissionCategory = data.AdmissionCategory;
            $scope.SemId = data.SemId;
            $scope.BranchId = data.BranchId;
            $scope.TenthYear = data.TenthYear;
            $scope.TenthBoard = data.TenthBoard;
            $scope.TenthHallticketNo = data.TenthHallticketNo;
            $scope.PolycetHallTicketNo = data.PolycetHallTicketNo;
            $scope.MinorityType = data.MinorityType;
            $scope.Region = data.Region;
            $scope.MotherName = data.MotherName;
            $scope.QualificationId = data.QualificationId;
            $scope.ReligionId = data.ReligionId;
            $scope.StudentRecided = data.StudentRecided;
            $scope.HouseNo = data.HouseNo;
            $scope.VillageorTown = data.VillageorTown;
            $scope.DistrictId = data.DistrictId;
            $scope.MandalId = data.MandalId;
            $scope.Pincode = data.Pincode;
            $scope.EmailId = data.EmailId;
            $scope.ParentContact = data.ParentContact;
            $scope.StudentContact = data.StudentContact;
            $scope.IsFatherGovtEmp = data.IsFatherGovtEmp;
            $scope.Income = data.Income;
            $scope.Occupation = data.Occupation;
            $scope.CasteNo = data.CasteNo;
            $scope.BankId = data.BankId;
            $scope.BankAccountNo = data.BankAccountNo;
            $scope.IfscCode = data.IfscCode;
            $scope.BankBranch = data.BankBranch;
            var StudentRegCopy = angular.copy($scope.StudentReg); // Create a copy
            StudentRegCopy.AadharNo = encAadhar(StudentRegCopy.AadharNo);
            StudentRegCopy.FatherAadhaarNo = encFAadhar(StudentRegCopy.FatherAadhaarNo);
            StudentRegCopy.MotherAadhaarNo = encMAadhar(StudentRegCopy.MotherAadhaarNo);
            $scope.StudentRegCopy = StudentRegCopy;
            if (data.SemId > 1 && data.SemId < 9) {
                $scope.DOBDisable = false;
            } else {
                $scope.DOBDisable = true;
            }


            if (data.CategoryId == 1 || $scope.userType == 2) {
                $scope.categorydisable = false;
                $scope.Religiondisable = false;
            } else {
                $scope.categorydisable = true;
                $scope.Religiondisable = true;
            }
            $scope.updateMandals();
            // console.log(data);
            if ($scope.StudentReg.SpecialCategoryId !== null) {
                var spCatList = $scope.StudentReg.SpecialCategoryId.split(',');

                if (spCatList.length > 0 && $scope.StudentReg.SpecialCategoryId !== "") {
                    angular.forEach(spCatList, function (data) {
                        if (document.getElementById('spCatId' + data) != null) {
                            document.getElementById('spCatId' + data).checked = true;
                        }

                    });
                }
            }


            var Aadharstatus = $scope.StudentReg.AadharVerfied;

            // console.log("Aadhaar status " + Aadharstatus);
            if (Aadharstatus) {
                $scope.AadhaarStatus = true;
            }
            else {
                $scope.AadhaarStatus = false;
            }
            //$scope.updateMandals();
        },
            function (error) {
                alert(error);
            });

        var staticData = StudentRegService.GetStaticDataForAdmission().then(function (data) {
            $scope.staticData = data;


        },
            function (error) {
                alert(error);
            });

        $scope.UpdateStudent = function () {
            try {
                if ($scope.StudentReg.DateOfBirth !== null && $scope.StudentReg.DateOfBirth !== undefined) {
                    var d = $scope.StudentReg.DateOfBirth.toISOString().slice(0, 10).split('-');
                    if (d !== undefined && d[0] !== null && d[0] !== undefined) {
                        if (d[0].length === 4) {
                            $scope.StudentReg.DateOfBirth = d[2] + "-" + d[1] + "-" + d[0];
                        }
                    }
                }
                else {
                    $scope.StudentReg.DateOfBirth = null;
                }
            } catch (err) {
                // 
            }

            StudentRegService.UpdateStudentReg($scope.StudentReg).then(function (data) {
                if (data.Table.length > 0) {
                    alert("Pin Generated");
                }
                else {
                    alert("Student Updated Successfully");
                    // $state.go('Admission.StudentRegList', { 'StudRegID': 0 });

                    $state.go('Dashboard');
                }
            }, function (error) {
                alert(error);
            });
        }


        $scope.decryptParameter2 = function () {
            var base64Key = "iT9/CmEpJz5Z1mkXZ9CeKXpHpdbG0a6XY0Fj1WblmZA="; // AES-256 Key
            var base64IV = "u4I0j3AQrwJnYHkgQFwVNw=="; // AES IV
            var ciphertext = $scope.EncStatusDescription2; // Encrypted text (Base64)

            var key = CryptoJS.enc.Base64.parse(base64Key);
            var iv = CryptoJS.enc.Base64.parse(base64IV);

            // Decrypt the ciphertext
            var decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC, // Ensure CBC mode
                padding: CryptoJS.pad.Pkcs7, // Ensure PKCS7 padding
            });

            // Convert decrypted data to a UTF-8 string
            $scope.decryptedText2 = decrypted.toString(CryptoJS.enc.Utf8);
            $scope.decryptedParameter2 = $scope.decryptedText2;
        };
        $scope.viewDetails = function () {
            $scope.Form = false;
            $scope.details = true;
        }

        $scope.backPage = function () {
            $scope.Form = true;
            $scope.details = false;
        }
        $scope.uploadPhoto = function () {
            var input = document.getElementById("stdPhotoFile");
            var fileSize = input.files[0].size;
            $scope.FileName = input.files[0].name
            if (fileSize <= 200000) {
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
                            var base64Image1 = canvas.toDataURL("image/png").replace(/^data:image\/[a-z]+;base64,/, "");
                            var base64Image = canvas.toDataURL("image/png");
                            //$scope.userPhoto1 = base64Image1;
                            //$scope.userPhoto = base64Image;
                            //canvas.width = this.width;
                            //canvas.height = this.height;
                            //context.drawImage(this, 0, 0);

                            //var base64Image = canvas.toDataURL("image/png");
                            $scope.StudentReg.profilephoto = base64Image;
                            $scope.StudentReg.profilephoto1 = base64Image1;


                        });


                    }
                    // reader.onload = function (e) {
                    //     $('#stdPhotoImg').attr('src', e.target.result);

                    //     var canvas = document.createElement("canvas");
                    //     var imageElement = document.createElement("img");

                    //     imageElement.setAttribute = $('<img>', { src: e.target.result });
                    //     var context = canvas.getContext("2d");
                    //     imageElement.setAttribute.one("load", function () {
                    //         canvas.width = this.width;
                    //         canvas.height = this.height;
                    //         context.drawImage(this, 0, 0);
                    //         var base64Image = canvas.toDataURL("image/png");
                    //         $scope.StudentReg.profilephoto = base64Image;
                    //     });  
                    //     imageElement.setAttribute.load(function () {

                    //         canvas.width = this.width;
                    //         canvas.height = this.height;

                    //         context.drawImage(this, 0, 0);
                    //         var base64Image = canvas.toDataURL("image/png");

                    //         // var data = base64Image.replace(/^data:image\/\w+;base64,/, "");

                    //         $scope.StudentReg.profilephoto = base64Image;
                    //     });

                    // }


                }
            }
            else {
                alert("file size should be less then 200kb ");
            }
        }

        $scope.uploadSign = function () {
            var input = document.getElementById("stdCandidateSignFile");
            var fileSize = input.files[0].size;
            if (fileSize <= 102400) {
                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    reader.readAsDataURL(input.files[0]);
                    reader.onload = function (e) {
                        $('#stdCandidateSignImg').attr('src', e.target.result);
                        var canvas = document.createElement("canvas");
                        var imageElement = document.createElement("img");

                        imageElement.setAttribute = $('<img>', { src: e.target.result });
                        var context = canvas.getContext("2d");
                        imageElement.setAttribute.one("load", function () {
                            canvas.width = this.width;
                            canvas.height = this.height;
                            context.drawImage(this, 0, 0);
                            var base64Image = canvas.toDataURL("image/png");
                            $scope.StudentReg.CandidateSign = base64Image;
                        });

                    }


                }
            }
            else {
                alert("file size should be less then 100kb ");
            }
        }

        $scope.GenPin = function () {
            StudentRegService.GenPin(studentID).then(function (data, status, headers, config, error) {
                // console.log(data);
                $scope.pinReply = data[0];
                $scope.StudentReg.PIN = $scope.pinReply.PIN;
                alert($scope.pinReply.Result);
            }, function (error) {
                alert(error);
            });
        };

        $scope.printDetails = function () {

            $scope.printHead = true;
            var divName = "idtoDivPrint";
            var $markstable = document.createElement("div");
            $markstable.innerHTML = '';
            $markstable.className = "table";
            var divToPrint = document.getElementById(divName);
            var temp = document.body.innerHTML;
            //    $("#markslist").hide();
            var domClone = divToPrint.cloneNode(true);
            var $printSection = document.getElementById("printSection");
            if ($printSection) {
                var $printSection = document.createElement("div");
                $printSection.id = "printSection";


                document.body.appendChild($printSection);

                var $ele1 = document.createElement("div");
                $ele1.className = "row";

                var $ele2 = document.createElement("div");
                $ele2.className = "col-lg-2 col-md-12";

                var $ele3 = document.createElement("div");
                $ele3.className = "col-lg-10 col-md-12";


                $ele1.appendChild($ele3);

                $printSection.appendChild($ele1);

                $printSection.appendChild($ele1);
                $printSection.appendChild($markstable);

            }
            var tempTitle = document.title;
            document.title = 'StudentDetails';
            window.print();
            document.title = tempTitle;


        }
    });
});
