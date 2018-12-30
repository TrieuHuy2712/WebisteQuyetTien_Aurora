$(document).ready(function () {
    LoadData();

    CKEDITOR.replace('editorDescription');
});
var gIDProduct = 0;
var currentID = "";
var count = 0;
var getImage = "";
var sizeImg = true;
//Khi nhấn vào sẽ show modal
$('body').on('click', '#btnCreate', function () {
    $('#modal-add-edit').modal('show');
    $('#titleProduct').text('');
    $('#titleProduct').text('Thêm mới sản phẩm');
    resetForm();
    getProductType();
    getManufacture();
});
//Thực hiện lưu hình ảnh và những thông tin mới
$("#btnAttributeCreateNew").on('click', function () {
    resetValidate();
    var productCode = $('#txtProductCode').val();
    var productTypeId = $('#material-dropdown').val();
    var manufactoryId = $('#manufacture-dropdown').val();
    var salePrice = $('#txtSalePrice').val();
    var editorText = CKEDITOR.instances.editorDescription.getData();
    var originPrice = $('#txtOriginPrice').val();
    var installmentPrice = $('#txtInstallmentPrice').val();
    var quantity = $('#txtQuantity').val();
    var productName = $('#txtProductName').val();
    var status = $('#statusProduct').val();
    console.log(editorText);
    //Convert againt number
    console.log(productCode);
    salePrice = salePrice.replace(/\,/g, '');
    salePrice = parseInt(salePrice, 10);

    originPrice = originPrice.replace(/\,/g, '');
    originPrice = parseInt(originPrice, 10);

    installmentPrice = installmentPrice.replace(/\,/g, '');;
    installmentPrice = parseInt(installmentPrice, 10);

    quantity = parseInt(quantity, 10);
    if (status == 1) {
        status = true;
    } else {
        status = false;
    }
    if (checkValidation() == true) {
        if (sizeImg == true) {
            $.ajax({
                type: "POST",
                url: "/Manage/SaveEntity",
                data: {
                    ID: gIDProduct,
                    ProductCode: productCode,
                    ProductName: productName,
                    ProductTypeID: productTypeId,
                    ManufactoryID: manufactoryId,
                    OriginPrice: originPrice,
                    SalePrice: salePrice,
                    InstallmentPrice: installmentPrice,
                    Quantity: quantity,
                    Description: CKEDITOR.instances.editorDescription.getData(),
                    //Description: editorText,
                    Status: status,
                },
                dataType: "json",
                beforeSend: function () {
                    general.startLoading();
                },
                success: function (response) {
                    currentID = response.ID;
                    console.log(gIDProduct);
                    console.log(response);
                    //KIểm tra xem có tồn tại hay không
                    $('#modal-add-edit').modal('hide');
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                    console.log("Save thành công");
                    general.stopLoading();
                    if ($("#txtUploadFile").get(0).files.length != 0) {
                        uploadImage(currentID);
                    }
                    LoadData();
                    general.notify("Load thành công", "success");
                    console.log(response);
                },
                error: function () {
                    general.notify('Có lỗi', 'error');
                    general.stopLoading();
                }
            });
        }
    }
    return false;
});
//----------Sự kiện không cho nhập số giá gốc-----------------//
$('body').on('keyup', '#txtOriginPrice', function (event) {
    if (event.which >= 37 && event.which <= 40) return;

    $(this).val(function (index, value) {
        return value
            .replace(/\D/g, "")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            ;
    });
});
//----------Sự kiện không cho nhập số giá bán-----------------//
$('body').on('keyup', '#txtSalePrice', function (event) {
    if (event.which >= 37 && event.which <= 40) return;

    $(this).val(function (index, value) {
        return value
            .replace(/\D/g, "")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            ;
    });
});
//----------Sự kiện không cho nhập số giá góp-----------------//
$('body').on('keyup', '#txtInstallmentPrice', function (event) {
    if (event.which >= 37 && event.which <= 40) return;

    $(this).val(function (index, value) {
        return value
            .replace(/\D/g, "")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            ;
    });
});
//----------Sự kiện không cho nhập số cho Số lượng-----------------//
$('body').on('keyup', '#txtQuantity', function (event) {
    if (event.which >= 37 && event.which <= 40) return;

    $(this).val(function (index, value) {
        return value
            .replace(/\D/g, "")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            ;
    });
});

///-------Ajax Sửa------////
function resetForm() {
    $('#txtProductCode').val("");
    $('#txtProductName').val("");
    $('#txtOriginPrice').val('');
    $('#txtSalePrice').val('');
    $('#txtInstallmentPrice').val('');
    $('#material-dropdown').val('').trigger('change.select2');
    $('#statusProduct').val('');
    $('#txtQuantity').val('');
    $('#HinhAnhSP').attr('src', "#");
    CKEDITOR.instances.editorDescription.setData("");
}
///Load Dữ liệu/////
$('body').on('click', '.btn-edit', function (e) {
    e.preventDefault();
    resetValidate();
    $('#titleProduct').text('');
    $('#titleProduct').text('Chỉnh sửa sản phẩm');
    var that = $(this).data('id');
    console.log(that);
    getProductType();
    getManufacture();
    $.ajax({
        type: "GET",
        url: "/Manage/GetById",
        data: { id: that },
        dataType: "json",
        beforeSend: function () {
        },
        success: function (response) {
            console.log(response);
            console.log(response.ProductTypeID);

            if (response != null) {
                gIDProduct = that;
                $('#txtProductCode').val(response.ProductCode);
                $('#txtProductName').val(response.ProductName);
                $('#txtOriginPrice').val(general.toMoney(response.OriginPrice));
                $('#txtSalePrice').val(general.toMoney(response.SalePrice));
                $('#txtInstallmentPrice').val(general.toMoney(response.InstallmentPrice));
                $('#material-dropdown').val('' + response.ProductTypeID + '').trigger('change.select2');
                $('#manufacture-dropdown').val('' + response.ManufactoryID + '').trigger('change.select2');
                CKEDITOR.instances.editorDescription.setData(response.Description);
                $('#HinhAnhSP').attr('src', '/www.root/Img/' + response.ID + ".png?" + new Date().getTime() + '');
                if (response.Status == true) {
                    $('#statusProduct').val("1");
                } else if (response.Status == false) {
                    $('#statusProduct').val("0");
                }

                $('#txtQuantity').val(response.Quantity);
            }

            $('#modal-add-edit').modal('show');
        },
        error: function (status) {
            //tedu.notify('Có lỗi xảy ra', 'error');
            general.stopLoading();
        }
    });
});
$('body').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    var that = $(this).data('id');
    console.log(that);
    $.ajax({
        type: "POST",
        url: "/Manage/Delete",
        data: {
            ID: that,
        },
        dataType: "json",
        beforeSend: function () {
        },
        success: function (response) {
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            console.log("Save thành công");

            general.stopLoading();
            general.notify("Bạn đã khóa lại", "error");
            LoadData();
        },
        error: function (status) {
            general.stopLoading();
        }
    });
});

//Hàm Upload hình ảnh
function uploadImage(currID) {
    if (window.FormData !== undefined) {
        var fileUpload = $('#txtUploadFile').get(0);
        var files = fileUpload.files;
        var formData = new FormData();
        formData.append('file', files[0], currID);
    }
    $.ajax({
        type: "POST",
        url: "/Manage/UploadImage",
        contentType: false,
        processData: false,
        data: formData,
        success: function (urlImage) {
            console.log("Lưu thành công");
        },
        error: function (err) {
            alert("Có lỗi khi upload: " + err.statusText);
        }
    });
}
//Hàm lấy productType
function getProductType() {
    dropdown = $('#material-dropdown');
    $('#material-dropdown').select2();
    dropdown.empty();

    var count = 0;
    $.ajax({
        type: 'GET',
        url: '/Manage/getProductType',
        dataType: 'json',

        success: function (data) {
            console.log(data);
            $.each(data, function (i, item) {
                dropdown.append($('<option></option>').attr('value', item.ID).text(item.ProductTypeName));
            });
        },
        error: function (ex) {
            console.log("Error");
        }
    });
}
function getManufacture() {
    dropdown1 = $('#manufacture-dropdown');
    $('#manufacture-dropdown').select2();
    dropdown1.empty();

    var count = 0;
    $.ajax({
        type: 'GET',
        url: '/Manage/getManufacture',
        dataType: 'json',

        success: function (data) {
            console.log(data);
            $.each(data, function (i, item) {
                dropdown1.append($('<option></option>').attr('value', item.ID).text(item.ManufactoryName));
            });
        },
        error: function (ex) {
            console.log("Error");
        }
    });
}
//Hàm show hình ảnh
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#HinhAnhSP')
                .attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}
//Hàm load dữ liệu
function LoadData() {
    $("#myTable tbody tr").remove();
    var template = $('#table-template').html();
    var render = "";
    $.ajax({
        type: 'GET',
        url: '/Manage/getProduct',
        dataType: 'json',
        processData: false,
        contentType: false,
        cache: false,
        success: function (data) {
            console.log(data);
            $.each(data, function (i, item) {
                $("#imgSrc").remove();
                render += Mustache.render(template, {
                    ID: item.ID,
                    ProductCode: item.ProductCode,
                    ProductName: item.ProductName,
                    SalePrice: general.toMoney(item.SalePrice),
                    OriginPrice: general.toMoney(item.OriginPrice),
                    InstallmentPrice: general.toMoney(item.InstallmentPrice),
                    Quantity: general.toMoney(item.Quantity),
                    ProductTypeID: item.ProductTypeName,
                    Status: general.getStatus(item.Status),
                    ManufactoryID: item.ManufactoryName,
                    Img: "/www.root/Img/" + item.ID + ".png?" + new Date().getTime(),
                });
            });

            if (render != '') {
                $('#tbl-content').html(render);
            };

            $('#myTable').DataTable({
                "aaSorting": [],
                //stateSave: true,
                destroy: true,
                retrieve: true,

                "language": {
                    "sProcessing": "Đang xử lý...",
                    "sLengthMenu": "Xem _MENU_ sản phẩm",
                    "sZeroRecords": "Không tìm thấy sản phẩm nào phù hợp",
                    "sInfo": "Đang xem _START_ đến _END_ trong tổng số _TOTAL_ sản phẩm",
                    "sInfoEmpty": "Đang xem 0 đến 0 trong tổng số 0 sản phẩm",
                    "sInfoFiltered": "(được lọc từ _MAX_ sản phẩm)",
                    "sInfoPostFix": "",
                    "sSearch": "Tìm sản phẩm:",
                    "sUrl": "",
                    "oPaginate": {
                        "sFirst": "Đầu",
                        "sPrevious": "Trước",
                        "sNext": "Tiếp",
                        "sLast": "Cuối"
                    }
                },
            });
            $(document).ready(function () {
                $('#myTable_filter input[type = search]').attr('maxlength', 50);
            });
        },

        error: function (ex) {
            console.log("Error");
        },
    });
}

//Kiểm tra validation
function checkValidation() {
    var countErr = 0;
    var salePrice = $('#txtSalePrice').val();
    var originPrice = $('#txtOriginPrice').val();
    var installmentPrice = $('#txtInstallmentPrice').val();
    salePrice = salePrice.replace(/\,/g, '');
    salePrice = parseInt(salePrice, 10);

    originPrice = originPrice.replace(/\,/g, '');
    originPrice = parseInt(originPrice, 10);

    installmentPrice = installmentPrice.replace(/\,/g, '');;
    installmentPrice = parseInt(installmentPrice, 10);
    if (trim($("#txtProductName").val()) == "" || trim($("#txtProductName").val()) == null) {
        $('#validateProductName').text("Tên sản phẩm không được bỏ trống");
        countErr++;
    }
    if (trim($("#txtOriginPrice").val()) == "" || trim($("#txtOriginPrice").val()) == null) {
        $('#validateOriginPrice').text("Giá gốc không được bỏ trống");
        countErr++;
    }
    if (trim($("#txtSalePrice").val()) == "" || trim($("#txtSalePrice").val()) == null) {
        $('#validateSalePrice').text("Giá gốc không được bỏ trống");
        countErr++;
    }
    if (salePrice < originPrice) {
        console.log(originPrice);
        console.log(salePrice);
        $('#validateSalePrice').text("Giá bán phải lớn hơn giá gốc");
        countErr++;
    }
    if (trim($("#txtInstallmentPrice").val()) == "" || trim($("#txtInstallmentPrice").val()) == null) {
        $('#validateInstallmentPrice').text("Giá góp không được bỏ trống");
        countErr++;
    }
    if (installmentPrice < originPrice) {
        $('#validateInstallmentPrice').text("Giá góp phải lớn hơn giá gốc");
        countErr++;
    }
    if (trim($("#txtQuantity").val()) == "" || trim($("#txtQuantity").val()) == null) {
        $('#validateQuantity').text("Số lượng không được bỏ trống");
        countErr++;
    }
    if (gIDProduct == 0) {
        if ($("#txtUploadFile").get(0).files.length == 0) {
            $('#validateUploadFile').text("Vui lòng chọn hình ảnh");
            countErr++;
        }
    }
    
   

    if (countErr > 0) {
        return false;
    }
    return true;
}
//Reset validation
function resetValidate() {
    $('#validateProductName').text("");
    $('#validateOriginPrice').text("");
    $('#validateSalePrice').text("");
    $('#validateInstallmentPrice').text("");
    $('#validateQuantity').text("");
    $('#validateUploadFile').text("");
}
//Ẩn validation khi nhập chữ
$("#txtProductName").keyup(function () {
    var val = $(this).val();
    $("#validateProductName").text("");
});
$("#txtOriginPrice").keyup(function () {
    var val = $(this).val();
    $("#validateOriginPrice").text("");
});
$("#txtSalePrice").keyup(function () {
    var val = $(this).val();
    $("#validateSalePrice").text("");
});
$("#txtInstallmentPrice").keyup(function () {
    var val = $(this).val();
    $("#validateInstallmentPrice").text("");
});
$("#txtQuantity").keyup(function () {
    var val = $(this).val();
    $("#validateQuantity").text("");
});
$("#txtUploadFile").change(function () {
    $('#validateUploadFile').text("");
});
$('#txtUploadFile').bind('change', function () {
    if ((this.files[0].size / 1024 / 1024) > 2) {
        $('#validateUploadFile').text("Vui lòng chọn hình ảnh nhỏ hơn 2MB");
        sizeImg = false;

    }
});
function trim(value) {
    return value.replace(/^\s+|\s+$/g, "");
}
