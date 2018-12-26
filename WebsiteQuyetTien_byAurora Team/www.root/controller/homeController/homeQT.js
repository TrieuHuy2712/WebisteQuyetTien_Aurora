$(document).ready(function () {
    LoadData();
});
var arrProduct = [];
function LoadData() {
    $.ajax({
        type: 'GET',
        url: '/Home/getProductName',
        dataType: 'json',
        success: function (data) {
            console.log(data);

            arrProduct = data;
        },
        error: function (ex) {
            console.log("Error");
        },
    });
}