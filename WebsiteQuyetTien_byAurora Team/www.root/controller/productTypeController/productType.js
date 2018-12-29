$(document).ready(function () {
    LoadData();
});
var gIDType = 0;
var code = $('#txtTypeCode');
var name = $('#txtTypeName');

$('#btnCreateType').on('click', function () {
    $('#modal-product-type').modal('show');
    gIDType = 0;
    resetType();
});
$('body').on('click', '.btn-edit', function () {
    $('#modal-product-type').modal('show');
    
    var that = $(this).data('id');
    gIDType = that;
    $.ajax({
        type: 'GET',
        url: '/ProductType/getTypeID',
        dataType: 'json',
        data: { id: that },
        success: function (data) {
            console.log(data);
            
            $('#txtTypeCode').val(data.ProductTypeCode);
            $('#txtTypeName').val(data.ProductTypeName);
        },

        error: function (ex) {
            console.log("Error");
        },
    });
});
function LoadData() {
    $("#myTypeTable tbody tr").remove();
    var template = $('#table-type-template').html();
    var render = "";
    $.ajax({
        type: 'GET',
        url: '/ProductType/getTypeProduct',
        dataType: 'json',
        success: function (data) {
            console.log(data);
            $.each(data, function (i, item) {
                render += Mustache.render(template, {
                    ID: item.ID,
                    TypeCode: item.ProductTypeCode,
                    TypeName: item.ProductTypeName,
                });
            });

            if (render != '') {
                $('#tbl-type-content').html(render);
            };

            $('#myTypeTable').DataTable({
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
                $('#myTypeTable_filter input[type = search]').attr('maxlength', 50);
            });
        },

        error: function (ex) {
            console.log("Error");
        },
    });
}
$('body').on('click', '#btnTypeCreateNew', function () {
    var codeType = $('#txtTypeCode').val();
    var nameType = $('#txtTypeName').val();
    if (validateType() == true) {
        $.ajax({
            type: "POST",
            url: "/ProductType/SaveEntity",
            data: {
                ID: gIDType,
                ProductTypeCode: codeType,
                ProductTypeName: nameType,
            },
            dataType: "json",
            beforeSend: function () {
                general.startLoading();
            },
            success: function (response) {
                $('#modal-product-type').modal('hide');
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
    $('#txtTypeCode').val("");
    $('#txtTypeName').val("");
    $('#validateTypeCode').text('');
    $('#validateTypeName').text('');
}
function validateType() {
    var countErr = 0;
    if ($('#txtTypeCode').val() == null || $('#txtTypeCode').val() == '') {
        $('#validateTypeCode').text('Mã loại sản phẩm không được rỗng');
        countErr++;

    }
    if ($('#txtTypeName').val() == null || $('#txtTypeName').val() == '') {
        $('#validateTypeName').text('Mã loại sản phẩm không được rỗng');
        countErr++;

    }
    if (countErr > 0) {
        return false;
    }
    return true;
}
$('#txtTypeCode').on('keyup', function () {
    $('#validateTypeCode').text('');
});
$('#txtTypeName').on('keyup', function () {
    $('#validateTypeName').text('');
});