$(document).ready(function () {
    LoadData();
});
var gIDProduct = 0;
var currentID = "";
$("#btnCreate").on('click', function () {
    resetForm();
    getProductType();
});
//Thực hiện lưu hình ảnh
$("#btnAttributeCreateNew").on('click', function () {
    var productCode = $('#txtProductCode').val();
    var productTypeId = $('#material-dropdown').val();
    var salePrice = $('#txtSalePrice').val();
    var originPrice = $('#txtOriginPrice').val();
    var installmentPrice = $('#txtInstallmentPrice').val();
    var quantity = $('#txtQuantity').val();
    var productName = $('#txtProductName').val();
    var status = $('#statusProduct').val();
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

    $.ajax({
        type: "POST",
        url: "/Manage/SaveEntity",
        data: {
            ID: gIDProduct,
            ProductCode: productCode,
            ProductName: productName,
            ProductTypeID: productTypeId,
            OriginPrice: originPrice,
            SalePrice: salePrice,
            InstallmentPrice: installmentPrice,
            Quantity: quantity,
            Status: status,
        },
        dataType: "json",
        beforeSend: function () {
            general.startLoading();
        },
        success: function (response) {
            currentID = response.ID;
            console.log(gIDProduct);
            //KIểm tra xem có tồn tại hay không
            $('#modal-add-edit').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            console.log("Save thành công");
            general.stopLoading();
            if ($("#txtUploadFile").get(0).files.length != 0) {
                uploadImage(currentID);
                window.location.reload();
            } else {
                LoadData();
            }
           
            

            console.log(response);
        },
        error: function () {
            general.notify('Có lỗi', 'error');
            general.stopLoading();
        }
    });
    return false;
});

//14/12/2018: Author: Triệu Đức Huy
//--------------Content--------------//
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
    $('#txtProductCode').val('');
    $('#txtProductName').val('');
    $('#txtOriginPrice').val('');
    $('#txtSalePrice').val('');
    $('#txtInstallmentPrice').val('');
    $('#material-dropdown').val('').trigger('change.select2');
    $('#statusProduct').val('');
    $('#txtQuantity').val('');
}
///Load Dữ liệu/////
$('body').on('click', '.btn-edit', function (e) {
    e.preventDefault();
    var that = $(this).data('id');
    console.log(that);
    getProductType();
    $('#modal-add-edit').show();
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
                $('#HinhAnhSP').attr('src', '/www.root/Img/' + response.ID + '.png');
                if (response.Status == true) {
                    $('#statusProduct').val("1");
                } else if (response.Status == false) {
                    $('#statusProduct').val("0");
                }

                $('#txtQuantity').val(response.Quantity);
            }
            $('#modal-add-edit').modal('toggle');
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

        success: function (data) {
            console.log(data);
            $.each(data, function (i, item) {
                render += Mustache.render(template, {
                    ID: item.ID,
                    ProductCode: item.ProductCode,
                    ProductName: item.ProductName,
                    SalePrice: general.toMoney(item.SalePrice),
                    OriginPrice: general.toMoney(item.OriginPrice),
                    InstallmentPrice: general.toMoney(item.InstallmentPrice),
                    Quantity: item.Quantity,
                    ProductTypeID: item.ProductTypeName,
                    Status: general.getStatus(item.Status),
                });
            });

            if (render != '') {
                $('#tbl-content').html(render);
            };
            $(document).ready(function () {
                $('#myTable').DataTable();
            });
        },
        error: function (ex) {
            console.log("Error");
        }
    });
}