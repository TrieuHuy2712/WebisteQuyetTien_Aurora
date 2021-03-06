﻿$(document).ready(function () {
    LoadCashBill();
});
var billDetail = [];
var productList = [];
var detailList = [];
var gIDCashBill = 0;
var stt = 1;
var currentBill = 0;
var currentDetail = 0;
function LoadCashBill() {
    $("#myTable2 tbody tr").remove();
    var template = $('#table-template-cashBill').html();
    var render = "";
    $.ajax({
        type: 'GET',
        url: '/ManageCashBill/getCashBill',
        dataType: 'json',

        success: function (data) {
            console.log(data);
            billDetail = data;
            $.each(data, function (i, item) {
                var date = item.Date;
                var d = date.substring(6, date.length - 2);
                var dateChange = new Date(parseInt(d));
                console.log(d);
                render += Mustache.render(template, {
                    ID: item.ID,
                    BillCode: item.BillCode,
                    CustomerName: item.CustomerName,
                    PhoneNumber: item.PhoneNumber,
                    Address: item.Address,
                    Date: dateChange.toLocaleString(),
                    Shipper: item.Shipper,
                    Note: item.Note,
                    GrandTotal: general.toMoney(item.GrandTotal),
                });
            });
            if (render != '') {
                $('#tbl-content-product').html(render);
            };
            $(document).ready(function () {
                $('#myTable2').DataTable({
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
            });

            $(document).ready(function () {
                $('#myTable2_filter input[type = search]').attr('maxlength', 50);
            });
        },
        error: function (ex) {
            console.log("Error");
        },
    });
}
$('#btn-add-product').on('click', function () {
    var template = $('#template-table-product').html();
    var render = Mustache.render(template, { STT: stt });
    stt++;
    getAllProduct(render);
});
$('body').on('click', '.btn-delete-attribute', function (e) {
    e.preventDefault();
    $(this).closest('tr').remove();
});

function resetFormBill() {
    $('#txtBillCode').val('');
    $('#txtCustomerName').val('');
    $('#txtPhoneNumber').val('');
    $('#txtAddress').val('');
    $('#txtDate').val('');
    $('#txtShipper').val('');
    $('#txtNote').val('');
    $('#txtGrandTotal').val('');
    $('#table-product tr').each(function () { $(this).remove(); });
    stt = 1;
    resetAllValidate();
}

function getAllProduct(render, callback) {
    render = $(render);
    dropdownList = render.find('.select2');

    //dropdownList.empty();
    $.ajax({
        type: 'GET',
        url: '/ManageCashBill/getAllProduct',
        dataType: 'json',

        success: function (data) {
            console.log(data);
            productList = data;
            $.each(data, function (i, item) {
                dropdownList.append($('<option></option>').attr('value', item.ID).text(item.ProductName));
            });
            $('#table-product').append(render);
            if (callback != undefined)
                callback();
        },
        error: function (ex) {
            console.log("Error");
        }
    });
}
$('body').on('click', '.btn-edit-bills', function (e) {
    resetFormBill();

    var arr = 1;
    e.preventDefault();
    $("#title").text("");
    $("#title").text("Cập nhật hóa đơn");
    console.log('aaa');
    $("#table-product tbody tr").remove();
    var template = $('#template-table-loading').html();

    var render = '';
    console.log(billDetail);
    var that = $(this).data('id');
    currentBill = that;
    $.each(billDetail, function (i, item) {
        if (item.ID == that) {
            var date = item.Date;
            var d = date.substring(6, date.length - 2);
            var dateChange = new Date(parseInt(d));
            $('#txtBillCode').val(item.BillCode)
            $('#txtCustomerName').val(item.CustomerName);
            $('#txtPhoneNumber').val(item.PhoneNumber);
            $('#txtAddress').val(item.Address);
            $('#txtDate').val(dateChange.toLocaleString());
            $('#txtNote').val(item.Note);
            $('#txtShipper').val(item.Shipper);
            $('#txtGrandTotal').val(general.toMoney(item.GrandTotal));
        }
    });
    $.ajax({
        type: 'GET',
        url: '/ManageCashBill/getProduct',
        dataType: 'json',
        data: { id: that },
        success: function (data) {
            detailList = data;
            $.each(data, function (i, item) {
                render += Mustache.render(template, {
                    STT: arr,
                    ID: item.ID,
                    ProductID: item.ProductID,
                    ProductName: item.ProductName,
                    SalePrice: general.toMoney(item.SalePrice),
                    Quantity: general.toMoney(item.Quantity),
                    GrandTotal: general.toMoney(item.Quantity * item.SalePrice)
                });
                arr++;
            });
            if (render != '') {
                $('#table-product').html(render);
            };
            $("#modal-cash-bill").modal('show');
        },
        error: function (ex) {
            console.log("Error");
        },
    });
});
$('#btnCreateCash').on('click', function () {
    $('#modal-cash-bill').modal('show');
    resetFormBill();
    currentBill = 0;
    $("#title").text("");
    $("#title").text("Tạo mới hóa đơn");
});
$('body').on('click', '#btnCashCreateNew', function () {
    var billCode = $('#txtBillCode').val();
    var customerName = $('#txtCustomerName').val();
    var phonenumber = $('#txtPhoneNumber').val();
    var address = $('#txtAddress').val();
    var note = $('#txtNote').val();
    var shipper = $('#txtShipper').val();
    var grandTotal = $('#txtGrandTotal').val();
    grandTotal = grandTotal.replace(/\,/g, '');
    grandTotal = parseInt(grandTotal, 10);
    var productBill = [];
    if (checkBillValidation() == true) {
        $('#table-product tr').each(function (i, item) {
            var attributeId = $(this).data('id');
            var keyID = $(this).data('key');

            if (attributeId != "") {
                var sale = $(item).find('#txtSalePriceProduct').first().val();
                sale = sale.replace(/\,/g, '');
                sale = parseInt(sale, 10);
                var quantity1 = $(item).find('#txtQuantityProduct').first().val();
                quantity1 = quantity1.replace(/\,/g, '');
                quantity1 = parseInt(quantity1, 10);

                var obj = {
                    ID: keyID,
                    BillID: currentBill,
                    ProductID: attributeId,
                    Quantity: quantity1,
                    SalePrice: sale
                };
                if (obj.ProductID != null)
                    productBill.push(obj);
            }
        });
        if (productBill.length == 0) {
            $('#validateAdd').text("Vui lòng chọn 1 sản phẩm");
            return false;
        }
        var data = {
            ID: currentBill,
            BillCode: billCode,
            CustomerName: customerName,
            PhoneNumber: phonenumber,
            Address: address,
            Shipper: shipper,
            Note: note,
            GrandTotal: grandTotal,
            CashBillDetails: productBill
        };
        $.ajax({
            type: "POST",
            url: "/ManageCashBill/SaveEntity",
            data: {
                cb: data, billDetail: productBill
            },
            dataType: "json",
            beforeSend: function () {
                general.startLoading();
            },
            success: function (response) {
                $('#modal-cash-bill').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                $('#modal-cash-bill').modal('hide');
                general.stopLoading();
                console.log(response);
                LoadCashBill();
                general.notify("Lưu thành công", "success");
            },
            error: function (request, error) {
                console.log(error);
                $('#modal-cash-bill').modal('hide');
                $('.modal-backdrop').remove();
                LoadCashBill();
                console.log("Có lỗi trong khi ghi");
                general.notify("Có lỗi trong khi ghi", "error");
                general.stopLoading();
            }
        });
    }
});

//Set event auto number
$('body').on('keyup', '#txtQuantityProduct', function () {
    var quantity = $(this).val();
    var sale = $(this).closest('tr').find('td #txtSalePriceProduct').val();
    quantity = quantity.replace(/\,/g, '');
    quantity = parseInt(quantity, 10);

    sale = sale.replace(/\,/g, '');
    sale = parseInt(sale, 10);
    var abc = quantity * sale;
    $(this).closest('tr').find('td #txtGrandTotalProduct').val(general.toMoney(abc));
    var sum = 0;
    $('#table-product tr').each(function (i, item) {
        var grand = $(item).find('#txtGrandTotalProduct').first().val(),
            grand = grand.replace(/\,/g, '');
        grand = parseInt(grand, 10);
        sum += grand;
    });
    $('#txtGrandTotal').val(general.toMoney(sum));
});

$('body').on('change', '#dropdownProduct', function () {
    var bcc = ($(this).val());
    var acc = $(this).closest('tr').find(' td #txtSalePriceProduct');
    var ccc = $(this).closest('tr');
    $.each(productList, function (i, item) {
        if (bcc == item.ID) {
            acc.val(general.toMoney(item.SalePrice));
            ccc.attr('data-id', item.ID);
        }
    });
    ccc.attr('data-key', '0');
    $.each(detailList, function (i, item) {
        if (bcc == item.ProductID) {
            ccc.attr('data-key', item.ID);
        }
    });
});
$('body').on('keyup', '#txtQuantityProduct', function (event) {
    if (event.which >= 37 && event.which <= 40) return;

    $(this).val(function (index, value) {
        return value
            .replace(/\D/g, "")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            ;
    });
});

function checkBillValidation() {
    var countErr = 0;
    if (trim($("#txtCustomerName").val()) == "" || trim($("#txtCustomerName").val()) == null) {
        $('#validateCustomerName').text("Tên khách hàng không được bỏ trống");
        countErr++;
    }
    if (trim($("#txtPhoneNumber").val()) == "" || trim($("#txtPhoneNumber").val()) == null) {
        $('#validatePhoneNumber').text("Số điện thoại không được bỏ trống");
        countErr++;
    }
    if (trim($('#txtQuantityProduct').val()) == "" || trim($('#txtQuantityProduct').val()) == null || trim($('#txtQuantityProduct').val()) == 0) {
        $('#validateCQuantity').text('Số lượng không được bỏ trống');
        countErr++;
    }
    if ($('#dropdownProduct').val() == 0) {
        $('#validatedropdown').text("Vui lòng chọn sản phẩm");
        countErr++;
    }
    if (countErr > 0) {
        return false;
    }
    return true;
}
function resetAllValidate() {
    $('#validateCustomerName').text('');
    $('#validatePhoneNumber').text('');
    $('#validateCQuantity').text('');
    $('#validatedropdown').text('');
    $('#validateAdd').text('');
}
$('#txtCustomerName').on('keyup', function () {
    $('#validateCustomerName').text('');
});
$('#txtPhoneNumber').on('keyup', function () {
    $('#validatePhoneNumber').text('');
});
$('#txtQuantityProduct').on('keyup', function () {
    $(this).find('#validateCQuantity').text('');
});
$('#dropdownProduct').on('change', function () {
    $('#validatedropdown').text('');
});
function trim(value) {
    return value.replace(/^\s+|\s+$/g, "");
}