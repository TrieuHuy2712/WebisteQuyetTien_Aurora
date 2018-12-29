$(document).ready(function () {
    LoadData();
});
var gCustomer = 0;
function LoadData() {
    $("#myCustomerTable tbody tr").remove();
    var template = $('#table-customer-template').html();
    var render = "";
    $.ajax({
        type: 'GET',
        url: '/ManageCustomer/getCustomer',
        dataType: 'json',
        success: function (data) {
            console.log(data);
            $.each(data, function (i, item) {
                render += Mustache.render(template, {
                    ID: item.ID,
                    CustomerCode: item.CustomerCode,
                    CustomerName: item.CustomerName,
                    PhoneNumber: item.PhoneNumber,
                    Address: item.Address,
                    YearOfBirth: item.YearOfBirth,
                });
            });

            if (render != '') {
                $('#tbl-customer-content').html(render);
            };

            $('#myCustomerTable').DataTable({
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
                $('#myCustomer_filter input[type = search]').attr('maxlength', 50);
            });
        },

        error: function (ex) {
            console.log("Error");
        },
    });
}
$('#btnCreate').on('click', function () {
    $('#modal-customer').modal('show');
    loadYear();
    gCustomer = 0;
    resetType();
});
$('body').on('click', '.btn-edit', function () {
    $('#modal-customer').modal('show');
    loadYear();
    var that = $(this).data('id');
    gCustomer = that;
    $.ajax({
        type: 'GET',
        url: '/ManageCustomer/getCustomerID',
        dataType: 'json',
        data: { id: that },
        success: function (data) {
            console.log(data);

            $('#txtCustomerCode').val(data.CustomerCode);
            $('#txtCustomerName').val(data.CustomerName);
            $('#txtPhoneNumber').val(data.PhoneNumber);
            $('#txtCustomerAddress').val(data.Address);
            $('#dob-dropdown').val(data.YearOfBirth);
        },

        error: function (ex) {
            console.log("Error");
        },
    });
});
function loadYear() {
    //populate our years select box
    for (i = new Date().getFullYear(); i > 1900; i--) {
        $('#dob-dropdown').append($('<option />').val(i).html(i));
    }
};
$('body').on('click', '#btnCustomerCreateNew', function () {
    var code = $('#txtCustomerCode').val();
    var name = $('#txtCustomerName').val();
    var phone = $('#txtPhoneNumber').val();
    var address = $('#txtCustomerAddress').val();
    var year = $('#dob-dropdown').val();
    if (validateCustomer() == true) {
        $.ajax({
            type: "POST",
            url: "/ManageCustomer/SaveEntity",
            data: {
                ID: gCustomer,
                CustomerCode: code,
                CustomerName: name,
                PhoneNumber: phone,
                Address: address,
                YearOfBirth: year
            },
            dataType: "json",
            beforeSend: function () {
                general.startLoading();
            },
            success: function (response) {
                $('#modal-customer').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                console.log("Save thành công");
                LoadData();
                general.notify("Lưu thành công", "success");
                console.log(response);
            },
            error: function () {
                general.notify('Có lỗi', 'error');
                general.stopLoading();
            }
        });
    }

    return false;
});
function resetType() {
    $('#txtCustomerCode').val('');
    $('#txtCustomerName').val('');
    $('#txtPhoneNumber').val('');
    $('#txtCustomerAddress').val('');
    $('#dob-dropdown').val(1900);
}
function validateCustomer() {
    var countErr = 0;
    if ($('#txtCustomerCode').val() == null || $('#txtCustomerCode').val() == '') {
        $('#validateCustomerCode').text('Mã khách hàng không được bỏ trống');
        countErr++;
    }
    if ($('#txtCustomerName').val() == null || $('#txtCustomerName').val() == '') {
        $('#validateCustomerName').text('Tên khách hàng không được bỏ trống');
        countErr++;
    }
    if ($('#txtPhoneNumber').val() == null || $('#txtPhoneNumber').val() == '') {
        $('#validatePhoneNumber').text('Tên khách hàng không được bỏ trống');
        countErr++;
    }
    if ($('#dob-dropdown').val() == null || $('#dob-dropdown').val() == '') {
        $('#validatedob').text('Năm sinh không được bỏ trống');
        countErr++;
    }
    if (countErr > 0) {
        return false;
    }
    return true;
}
$('#txtCustomerCode').on('keyup', function () {
    $('#validateCustomerCode').text('');
});
$('#txtCustomerName').on('keyup', function () {
    $('#validateCustomerName').text('');
});
$('#txtPhoneNumber').on('keyup', function () {
    $('#validatePhoneNumber').text('');
});

$('#dob-dropdown').on('change', function () {
    if ($('#dob-dropdown') != null || $('#dob-dropdown') != '') {
        $('#validatedob').text('');
    }
});