var ngeneralController = function () {
    this.initialize = function () {
        registerEvents();
        loadNotificationHome();
    }
    function registerEvents() {
        $('#notification_content').on('click', function () {
            $('#number_noti').text('');
            $.ajax({
                type: 'POST',
                url: '/Notification/UpdateStatus',
                data: {status:true},
                success: function (res) {

                },
                error: function (err) {

                }
            });
        });
        $('body').on('click', '#ViewAll a', function () {
            window.location.href = "/Notification";

        });
    }
}
function loadNotificationHome() {
    var template = $('#notification-template').html();
    var render = '';
    $.ajax({
        type: 'GET',
        url: '/Notification/GetByUserId',
        success: function (res) {
            var data = res;
            console.log(res);
            var count = 0;
            data.forEach(function (item) {
                if (item.Status == 0) {
                    render += Mustache.render(template, {
                        NotificationTime: general.dateTimeFormatJson(item.NotificationTime),
                        NotificationContent: item.NotificationContent
                    });
                    count++;
                }
                
            });
            if (render != '')
                $('#notification').html(render);
            $('#notification').append("<li id='ViewAll'><div class='text-center'><a><strong>Xem tất cả</strong><i class='fa fa-angle-right'></i></a></div></li >");
            if (count > 0)
                $('#number_noti').text(count);
        },
        error: function (err) {
            general.notify('Không load được dữ liệu', 'error');
        }
    });

}