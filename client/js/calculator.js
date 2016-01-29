calc = {
    expiryLength: function () {
        return 12;
    },
    getPersonnel: function (id) {
        return PersonnelInfo.findOne({_id: id});
    },
    getStartDate: function (id) {
        var personnel = this.getPersonnel(id);
        return personnel ? moment(personnel.startDate) : null;
    },
    getAchieved: function (id) {
        return moment().diff(this.getStartDate(id).startOf('month'), 'month');
    },
    getUsages: function (id) {
        var personnel = this.getPersonnel(id);
        var sum = 0;

        _.chain(personnel.events)
         .filter(function (el, i) { return el.type = 'USAGE'; })
         .each(function (el, i) { sum += el['length']; });

        return sum;
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
    },
    getDetails: function (id) {
        if (_.isUndefined(id) || _.isNull(id)) { return; }

        var personnel = this.getPersonnel(id);
        var start = this.getStartDate(id);
        var end = moment();
        var i = start;

        var plus = [];
        var minus = [];


        while (i.isSameOrBefore(end)) {
            var nextI = moment(i).add(1, 'months').startOf('month');

            // First of the month
            if (i.date() == 1) {
                // Achieved one
                plus.push({ type: 'ACHIEVED', date: i });

                // Expire if necessary
                if ((plus.length - minus.length) > this.expiryLength()) {
                    minus.push({ type: 'EXPIRED', date: i });
                }
            }

            // All events from x to the end of month, sorted chronologically
            var events = _.chain(personnel.events).filter(function (e) {
                return moment(e.eventStartDate).isBetween(moment(i).subtract(1, 'days'), nextI);
            }).sortBy('eventStartDate').value();

            _.each(events, function (e) {
                if (e.type == 'USAGE' || e.type == 'CASHOUT') {

                    minus.push({ type: e.type, date: moment(e.eventStartDate) });
                }
            });

            // Next iteration
            i = nextI;
        }

        return _.zip(plus, minus);
    }
};