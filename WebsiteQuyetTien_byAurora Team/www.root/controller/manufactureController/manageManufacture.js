$(document).ready(function () {
    LoadData();
});
var gIDType = 0;

$('#btnCreateManu').on('click', function () {
    $('#modal-manu-type').modal('show');
    gIDType = 0;
    resetType();
});
$('body').on('click', '.btn-edit', function () {
    $('#modal-manu-type').modal('show');

    var that = $(this).data('id');
    gIDType = that;
    $.ajax({
        type: 'GET',
        url: '/ManageManufacture/getTypeID',
        dataType: 'json',
        data: { id: that },
        success: function (data) {
            console.log(data);
            $('#txtManuCode').val(data.ManufactoryCode);
            $('#txtManuName').val(data.ManufactoryName);
        },

        error: function (ex) {
            console.log("Error");
        },
    });
});
function LoadData() {
    $("#myManuTable tbody tr").remove();
    var template = $('#table-manu-template').html();
    var render = "";
    $.ajax({
        type: 'GET',
        url: '/ManageManufacture/getTypeProduct',
        dataType: 'json',
        success: function (data) {
            console.log(data);
            $.each(data, function (i, item) {
                render += Mustache.render(template, {
                    ID: item.ID,
                    ManuName: item.ManufactoryName,
                    ManuCode: item.ManufactoryCode,
                });
            });

            if (render != '') {
                $('#tbl-manu-content').html(render);
            };

            $('#myManuTable').DataTable({
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
                $('#myManuTable_filter input[type = search]').attr('maxlength', 50);
            });
        },

        error: function (ex) {
            console.log("Error");
        },
    });
}
$('body').on('click', '#btnManuCreateNew', function () {
    var codeType = $('#txtManuCode').val();
    var nameType = $('#txtManuName').val();
    if (validateType() == true) {
        $.ajax({
            type: "POST",
            url: "/ManageManufacture/SaveEntity",
            data: {
                ID: gIDType,
                ManufactoryCode: codeType,
                ManufactoryName: nameType,
            },
            dataType: "json",
            beforeSend: function () {
                general.startLoading();
            },
            success: function (response) {
                $('#modal-manu-type').modal('hide');
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
    $('#txtManuCode').val("");
    $('#txtManuName').val("");
    $('#validateManuCode').text('');
    $('#validateManuName').text('');
}
function validateType() {
    var countErr = 0;
    if (trim($('#txtManuCode').val()) == null || trim($('#txtManuCode').val()) == '') {
        $('#validateManuCode').text('Mã loại sản phẩm không được rỗng');
        countErr++;

    }
    if (trim($('#txtManuName').val()) == null || trim($('#txtManuCode').val()) == '') {
        $('#validateManuName').text('Mã loại sản phẩm không được rỗng');
        countErr++;

    }
    if (countErr > 0) {
        return false;
    }
    return true;
}
$('#txtManuCode').on('keyup', function () {
    $('#validateTypeCode').text('');
});
$('#txtManuName').on('keyup', function () {
    $('#validateTypeName').text('');
});
function trim(value) {
    return value.replace(/^\s+|\s+$/g, "");
}