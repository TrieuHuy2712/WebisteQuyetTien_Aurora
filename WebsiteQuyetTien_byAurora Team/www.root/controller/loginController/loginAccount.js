$('#btnSubmit').on('click', function () {
    var username = $('#txtUsername').val();
    var password = $('#txtPassword').val();
    $.ajax({
        type: "POST",
        url: "/Login/checkLogin",
        data: {
            username: username,
            password: password
        },
      
        beforeSend: function () {
            
        },
        success: function (response) {
            window.location.href = "/Manage";
        },
        error: function () {
            console.log("Xảy ra lỗi");
        }
    });
    return false;
});