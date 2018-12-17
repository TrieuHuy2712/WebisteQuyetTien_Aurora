function getUnit (callback) {
    $.ajax({
        type: 'GET',
        url: 'unit/GetAll',
        success: function (response) {
            callback(response);
        },
        error: function (err) {
            return null;
        }
    });
}
var gListUnit;
getUnit(function (res) {
    gListUnit = res;
});
var unitround = {
    
    RoundByUnit: function (val, unitName) {
        if (general.toFloat(val) > 0) {
            for (var i = 0; i < gListUnit.length; i++) {
                if (gListUnit[i].UnitName == unitName) {
                    return general.toRound(val, 5);
                }
            }
        }

    }

}