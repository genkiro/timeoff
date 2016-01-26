calc = {
    getStartDate: function (id) {
        var personnel = PersonnelInfo.findOne({_id: id});
        return personnel ? moment(personnel.startDate) : null;
    },
    getAchieved: function (id) {
        return moment().diff(this.getStartDate(id).startOf('month'), 'month');
    },
    getUsages: function (id) {
        return 0;
    },
    getBeforeExpiration: function (id) {
        return this.getAchieved(id) - this.getUsages(id);
    },
    getExpired: function (id) {
        return this.getBeforeExpiration(id) - this.getAfterExpiration(id);
    },
    getAfterExpiration: function(id) {
        return Math.min(this.getBeforeExpiration(id), 12);
    },
    getFinalBalance: function (id) {
        return this.getAfterExpiration(id);
    },
    getCompleteCalc: function (id) {
        return {
            startDate: this.getStartDate(id),
            achieved: this.getAchieved(id),
            usages: this.getUsages(id),
            beforeExpiration: this.getBeforeExpiration(id),
            expired: this.getExpired(id),
            afterExpiration: this.getAfterExpiration(id),
            finalBalance: this.getFinalBalance(id)
        }
    }
};