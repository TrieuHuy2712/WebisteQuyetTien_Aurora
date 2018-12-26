$(document).ready(function () {
    LoadData();
    var arrProduct = {
        url: "/Home/getProductName",

        getValue: "ProductName",
        list: {
            match: {
                enabled: true
            },
            maxNumberOfElements: 6,

            showAnimation: {
                type: "slide",
                time: 300
            },
            hideAnimation: {
                type: "slide",
                time: 300
            }
        },



    };

    $("#SearchInput").easyAutocomplete(arrProduct);
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