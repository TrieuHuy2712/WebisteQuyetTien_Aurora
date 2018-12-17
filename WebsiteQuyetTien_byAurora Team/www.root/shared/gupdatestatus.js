var gupdatestatus = {
    boqSoStatusFk: function (id, sostatus) {
        $.ajax({
            type: 'POST',
            url: '/SalesOrderBOQ1/UpdateSOStatusFK',
            data: { KeyId: id, SOStatusFK: sostatus },
            dataType: 'json',           
            success: function (response) {
                return sostatus;
            },
            error: function (status) {
                console.log(status);
                general.notify('Cập nhật trạng thái Boq bị lỗi', 'error');
                return 0;
            }
        });
    },
    boqstatus:function(id, status,callback) {
        $.ajax({
            type: 'POST',
            url: '/SalesOrderBOQ1/UpdateStatus',
            data: { KeyId: id, status: status },
            dataType: 'json',
            success: function (response) {
                if (callback != undefined)
                    callback();
            },
            error: function (status) {
                console.log(status);
                if (callback != undefined)
                    callback();
                general.notify('Cập nhật trạng thái lỗi', 'error');
              
            }
        });
        return false;
    },
    projectstatus:function (id, status) {
        $.ajax({
            type: 'POST',
            url: '/Project/UpdateStatus',
            data: { KeyId: id, status: status },
            dataType: 'json',
            success: function (response) {
                return true;
            },
            error: function (status) {
                console.log(status);
                general.notify('Cập nhật trạng thái công trình bị lỗi', 'error');
                return false;
            }
        });
    },
    projectForSo: function (id, soid, callback) {
        $.ajax({
            type: 'POST',
            url: '/Project/UpdateForSo',
            data: { KeyId: id, soid: soid },
            dataType: 'json',
            success: function (response) {
                callback();
                return true;
            },
            error: function (status) {
                console.log(status);
                general.notify('Cập nhật trạng thái công trình bị lỗi', 'error');
                return false;
            }
        });
    },
    boq1statusCompleted: function (soid, soStatus, status,callback) {
            this.boqSoStatusFk(soid, soStatus);
        this.boqstatus(soid, status, function () {
            if (callback != undefined)
                callback();
            general.stopLoad();
        });
    }
}