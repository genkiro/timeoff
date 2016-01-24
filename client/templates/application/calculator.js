calc = {
    getStartDate: function (id) {
        var personnel = PersonnelInfo.findOne({_id: id});
        return personnel ? moment(personnel.startDate) : null;
    },
    getAchieved: function (id) {
        var today = moment();
        var startDate = this.getStartDate(id);
        return today.diff(startDate, 'month'); // Can be NaN if startDate is not found
    },
    getUsages: function (id) {
        return 0;
    },
    getBalance: function (id) {
        return Math.min(this.getAchieved(id) - this.getUsages(), 12);
    }
    //getAll: function (id) {
    //    return data structure that represents all.
    //}
};