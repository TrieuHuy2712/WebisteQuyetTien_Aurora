$(document).ready(function () {
    LoadInstallmentBill();
});
var stt = 1;
var arr = 1;
var loadDetail = [];
var loadProduct = [];
var createIns = $("#btnCreateIns");
var loadIns = [];
var curInsBill = 0;
function LoadInstallmentBill() {
    $("#myTable5 tbody tr").remove();
    var template = $('#table-template-installmentBill').html();
    var render = "";
    $.ajax({
        type: 'GET',
        url: '/ManageInstallmentBill/getInstallmentBill',
        dataType: 'json',

        success: function (data) {
            console.log(data);
            billDetail = data;
            $.each(data, function (i, item) {
                var date = item.Date;
                var d = date.substring(6, date.length - 2);
                var dateChange = new Date(parseInt(d));
                loadIns = data, //Gán dữ liệu vô mảng
                    console.log(loadIns);
                render += Mustache.render(template, {
                    ID: item.ID,
                    BillCode: item.BillCode,
                    CustomerName: item.CustomerName,
                    Date: dateChange.toLocaleString(),
                    Shipper: item.Shipper,
                    Note: item.Note,
                    Method: item.Method,
                    Period: item.Period,
                    Taken: general.toMoney(item.Taken),
                    Remain: general.toMoney(item.Remain),
                    GrandTotal: general.toMoney(item.GrandTotal),
                });
            });
            if (render != '') {
                $('#tbl-content-product').html(render);
                $('#myTable5').DataTable({
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
                    $('#myTable5_filter input[type = search]').attr('maxlength', 50);
                });
            };
        },
        error: function (ex) {
            console.log("Error");
        },
    });
}
function getCustomerName() {
    dropdown = $('#txtCustomerName_InsEdit');
    dropdown.empty();
    console.log('clear');
    $.ajax({
        type: 'GET',
        url: '/ManageInstallmentBill/getAllCustomer',
        dataType: 'json',

        success: function (data) {
            console.log(data);
            $.each(data, function (i, item) {
                dropdown.append($('<option></option>').attr('value', item.ID).text(item.CustomerName));
            });
        },
        error: function (ex) {
            console.log("Error");
        }
    });
}
$('body').on('click', '.btn-delete-attribute', function (e) {
    e.preventDefault();
    $(this).closest('tr').remove();
    stt--;
});
$('#btn-add-product_insEdit').on('click', function () {
    var template = $('#template-table-insedit').html();
    var render = Mustache.render(template, { STT: stt });
    stt++;
    getAllProduct(render);
});
$("#btnCreateIns").on('click', function () {
    resetInsBill();
    $('#modal-edit-installment').modal('show');
    getCustomerName();
});
function getAllProduct(render) {
    render = $(render);
    dropdownList = render.find('.select2');
    $.ajax({
        type: 'GET',
        url: '/ManageInstallmentBill/getAllProduct',
        dataType: 'json',

        success: function (data) {
            console.log(data);
            loadProduct = data;
            $.each(data, function (i, item) {
                dropdownList.append($('<option></option>').attr('value', item.ID).text(item.ProductName));
            });
            $('#table-product1').append(render);
        },
        error: function (ex) {
            console.log("Error");
        }
    });
}
$('body').on('click', '.btn-edit-ins', function (e) {
    //resetFormBill();
    var arr = 1;
    e.preventDefault();
    $("#title-installmentbill").text("");
    $("#title-installmentbill").text("Cập nhật hóa đơn trả góp");
    console.log('aaa');
    $("#table-product tbody tr").remove();
    var template = $('#template-table-loaded').html();
    var render = '';
    console.log(billDetail);
    //$('#txtCustomerName_InsEdit').attr('disabled', true);
    getCustomerName();
    var that = $(this).data('id');
    curInsBill = that;
    //Duyệt từ mảng
    $.ajax({
        type: 'GET',
        url: '/ManageInstallmentBill/getProduct',
        dataType: 'json',
        data: { id: that },
        success: function (data) {
            //detailList = data;
            console.log(data);
            loadDetail = data;
            $.each(data, function (i, item) {
                render += Mustache.render(template, {
                    STT: arr,
                    ID: item.ID,
                    ProductID: item.ProductID,
                    ProductName: item.ProductName,
                    SalePrice: general.toMoney(item.InstallmentPrice),
                    Quantity: general.toMoney(item.Quantity),
                    GrandTotal: general.toMoney(item.Quantity * item.InstallmentPrice)
                });
                arr++;
            });
            if (render != '') {
                $('#table-product1').html(render);
            };
            $.each(loadIns, function (i, item) {
                if (item.ID == that) {
                    var date = item.Date;
                    var d = date.substring(6, date.length - 2);
                    var dateChange = new Date(parseInt(d));
                    $('#txtBillCode_InsEdit').val(item.BillCode);
                    $('#txtCustomerName_InsEdit').val('' + item.CustomerID + '');
                    console.log(item.CustomerID);
                    $('#txtNote_InsEdit').val(item.Note);
                    $('#txtGrandTotal_InsEdit').val(general.toMoney(item.GrandTotal));
                    $('#txtDate_InsEdit').val(dateChange.toLocaleString());
                    $('#txtShipper_InsEdit').val(item.Shipper);
                    $('#dropdown_method').val(item.Method);
                    $('#txtPeriod_InsEdit').val(item.Period);
                    $('#txtTaken_InsEdit').val(general.toMoney(item.Taken));
                    $('#txtRemain_InsEdit').val(general.toMoney(item.Remain));
                }
            });
            $('#modal-edit-installment').modal('show');
        },
        error: function (ex) {
            console.log("Error");
        },
    });
});

$('body').on('keyup', '#txtQuantityProduct_Ins', function () {
    var quantity = $(this).val();
    var sale = $(this).closest('tr').find('td #txtSalePriceProduct_Ins').val();
    quantity = quantity.replace(/\,/g, '');
    quantity = parseInt(quantity, 10);

    sale = sale.replace(/\,/g, '');
    sale = parseInt(sale, 10);
    var abc = quantity * sale;
    $(this).closest('tr').find('td #txtGrandTotalProduct_Ins').val(general.toMoney(abc));
    var sum = 0;
    $('#table-product1 tr').each(function (i, item) {
        var grand = $(item).find('#txtGrandTotalProduct_Ins').first().val(),
            grand = grand.replace(/\,/g, '');
        grand = parseInt(grand, 10);
        sum += grand;
    });
    $('#txtGrandTotal_InsEdit').val(general.toMoney(sum));
    $('#txtTaken_InsEdit').val(general.toMoney(sum * 30 / 100));
    $('#txtRemain_InsEdit').val(general.toMoney(sum-(sum * 30 / 100)));
});

$('body').on('change', '#dropdownIns', function () {
    var bcc = ($(this).val());
    var acc = $(this).closest('tr').find(' td #txtSalePriceProduct_Ins');
    var ccc = $(this).closest('tr');
    $.each(loadProduct, function (i, item) {
        if (bcc == item.ID) {
            acc.val(general.toMoney(item.InstallmentPrice));
            ccc.attr('data-id', item.ID);
        }
    });
    ccc.attr('data-key', '0');
    $.each(loadDetail, function (i, item) {
        if (bcc == item.ProductID) {
            ccc.attr('data-key', item.ID);
        }
    });
});

$('body').on('keyup', '#txtQuantityProduct_Ins', function (event) {
    if (event.which >= 37 && event.which <= 40) return;

    $(this).val(function (index, value) {
        return value
            .replace(/\D/g, "")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            ;
    });
});

$('body').on('click', '#btnInsCreateNew', function () {
    var bill = $('#txtBillCode_InsEdit').val();
    var customer = $('#txtCustomerName_InsEdit').val();
    var note = $('#txtNote_InsEdit').val();
    var grandTotal = $('#txtGrandTotal_InsEdit').val();
    var date = $('#txtDate_InsEdit').val();
    var shipper = $('#txtShipper_InsEdit').val();
    var method = $('#dropdown_method').val();
    var period = $('#txtPeriod_InsEdit').val();
    var taken = $('#txtTaken_InsEdit').val();
    var remain = $('#txtRemain_InsEdit').val();
    period = period.replace(/\,/g, '');
    period = parseInt(period, 10);
    grandTotal = grandTotal.replace(/\,/g, '');
    grandTotal = parseInt(grandTotal, 10);

    taken = taken.replace(/\,/g, '');
    taken = parseInt(taken, 10);

    remain = remain.replace(/\,/g, '');
    remain = parseInt(remain, 10);
    var productBill = [];
    if (checkBillValidation() == true) {
        $('#table-product1 tr').each(function (i, item) {
            var attributeId = $(this).data('id');
            var keyID = $(this).data('key');

            if (attributeId != "") {
                var sale = $(item).find('#txtSalePriceProduct_Ins').first().val();
                sale = sale.replace(/\,/g, '');
                sale = parseInt(sale, 10);
                var quantity1 = $(item).find('#txtQuantityProduct_Ins').first().val();
                quantity1 = quantity1.replace(/\,/g, '');
                quantity1 = parseInt(quantity1, 10);

                var obj = {
                    ID: keyID,
                    BillID: curInsBill,
                    ProductID: attributeId,
                    Quantity: quantity1,
                    InstallmentPrice: sale
                };
                if (obj.ProductID != null)
                    productBill.push(obj);
            }
        });
        var data = {
            ID: curInsBill,
            BillCode: bill,
            CustomerID: customer,
            Shipper: shipper,
            Note: note,
            GrandTotal: grandTotal,
            Method: method,
            Period: period,
            Taken: taken,
            Remain: remain,
            InstallmentBillDetails: productBill
        };
        $.ajax({
            type: "POST",
            url: "/ManageInstallmentBill/SaveEntity",
            data: data,
            dataType: "json",
            beforeSend: function () {
                general.startLoading();
            },
            success: function (response) {
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                $('#modal-edit-installment').modal('hide');
                general.stopLoading();
                console.log(response);
                general.notify("Lưu thành công", "success");
                LoadInstallmentBill();
            },
            error: function (request, error) {
                console.log(error);
                $('#modal-edit-installment').modal('hide');
                $('.modal-backdrop').remove();
                LoadInstallmentBill();
                console.log("Có lỗi trong khi ghi");
                general.notify("Lưu thành công", "error");
                general.stopLoading();
            }
        });
    }
});
//Set event onkeyup
$('body').on('keyup', '#txtTaken_InsEdit', function (event) {
    if (event.which >= 37 && event.which <= 40) return;

    $(this).val(function (index, value) {
        return value
            .replace(/\D/g, "")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            ;
    });
});
$('body').on('keyup', '#txtRemain_InsEdit', function (event) {
    if (event.which >= 37 && event.which <= 40) return;

    $(this).val(function (index, value) {
        return value
            .replace(/\D/g, "")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            ;
    });
});
$('body').on('keyup', '#txtPeriod_InsEdit', function (event) {
    if (event.which >= 37 && event.which <= 40) return;

    $(this).val(function (index, value) {
        return value
            .replace(/\D/g, "")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            ;
    });
});
function resetInsBill() {
    $('#txtBillCode_InsEdit').val('');
    $('#txtCustomerName_InsEdit').val('');
    $('#txtNote_InsEdit').val('');
    $('#txtGrandTotal_InsEdit').val('');
    $('#txtDate_InsEdit').val('');
    $('#txtShipper_InsEdit').val('');
    $('#dropdown_method').val('');
    $('#txtPeriod_InsEdit').val('');
    $('#txtTaken_InsEdit').val('');
    $('#txtRemain_InsEdit').val('');
    $('#table-product1 tr').each(function () { $(this).remove(); });
    resetValidate();
    stt = 1;
}
function checkBillValidation() {
    var countErr = 0;
    var grandTotal = $('#txtGrandTotal_InsEdit').val();
    grandTotal = grandTotal.replace(/\,/g, '');
    grandTotal = parseInt(grandTotal, 10);

    var taken = $('#txtTaken_InsEdit').val();
    taken = taken.replace(/\,/g, '');
    taken = parseInt(taken, 10);
    if (trim($("#txtCustomerName_InsEdit").val()) == "" || trim($("#txtCustomerName_InsEdit").val()) == null) {
        $('#validateCustomerNameIns').text("Tên khách hàng không được bỏ trống");
        countErr++;
    }
    if ($("#txtPeriod_InsEdit").val() == "" || $("#txtPeriod_InsEdit").val() == null) {
        $('#validatePeriodEdit').text("Thời hạn trả không được bỏ trống");
        countErr++;
    }
    if ($("#txtTaken_InsEdit").val() == "" || $("#txtTaken_InsEdit").val() == null) {
        $('#validateTakenEdit').text("Taken không được bỏ trống");
        countErr++;
    }
    if ($("#txtRemain_InsEdit").val() == "" || $("#txtRemain_InsEdit").val() == null) {
        $('#validateRemainnEdit').text("Remain không được bỏ trống");
        countErr++;
    }

    if ($('#txtQuantityProduct_Ins').val() == "" || $('#txtQuantityProduct_Ins').val() == null || $('#txtQuantityProduct_Ins').val() == 0) {
        $('#validateQuantityIns').text('Số lượng không được bỏ trống');
        countErr++;
    }
    //if ($('#dropdownInst').val() == 0) {
    //    $('#validatedropdownIns').text("Vui lòng chọn sản phẩm");
    //    countErr++;
    //}
    if (taken < (grandTotal * 30 / 100)) {
        countErr++;
    }
    if (countErr > 0) {
        return false;
    }
    return true;
}

function resetValidate() {
    $('#txtCustomerName_InsEdit').text("");
    $('#validatePeriodEdit').text("");
    $('#validateTakenEdit').text("");
    $('#validateRemainnEdit').text("");
    $('#validateQuantityIns').text("");
    $('#validatedropdown').text("");
}

$('#txtCustomerName_InsEdit').on('change', function () {
    $('#validateCustomerName').text('');
});
$('#txtPeriod_InsEdit').on('keyup', function () {
    $('#validatePeriodEdit').text('');
});
$('#txtTaken_InsEdit').on('keyup', function () {
    var grandTotal = $('#txtGrandTotal_InsEdit').val();
    grandTotal = grandTotal.replace(/\,/g, '');
    grandTotal = parseInt(grandTotal, 10);

    var taken = $('#txtTaken_InsEdit').val();
    taken = taken.replace(/\,/g, '');
    taken = parseInt(taken, 10);

    var remain = grandTotal - taken;

    if (taken < (grandTotal * 30 / 100)) {
        $('#validateTakenEdit').text('Số tiền bạn trả ít hơn 30% tổng hóa đơn');
    } else if (taken >= (grandTotal * 30 / 100)) {
        $('#txtRemain_InsEdit').val(general.toMoney(remain));
        $('#validateTakenEdit').text('');
    } 
   
});
$('#txtRemain_InsEdit').on('keyup', function () {
    $('#validateRemainEdit').text('');
});
$('#dropdownInst').on('change', function () {
    $(this).closest('#validatedropdownIns').text('');
});
$('#txtQuantityProduct_Ins').on('keyup', function () {
    $(this).closest('#validateQuantityIns').text('');
});

function trim(value) {
    return value.replace(/^\s+|\s+$/g, "");
}