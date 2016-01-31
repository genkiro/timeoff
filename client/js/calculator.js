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
    getDetails: function (id) {
        if (_.isUndefined(id) || _.isNull(id)) { return; }

        var personnel = this.getPersonnel(id);
        var start = this.getStartDate(id);
        var end = moment().add(1, 'days');
        var i = start;

        var plus = [];
        var minus = [];

        while (i.isSameOrBefore(end)) {
            var nextI = moment(i).add(1, 'months').startOf('month');

            // First of the month
            if (i.date() == 1) {
                // Achieved one
                plus.push({ type: 'ACHIEVED', date: i.format('D MMMM YYYY') });

                // Expire if necessary
                if ((plus.length - minus.length) > this.expiryLength()) {
                    minus.push({ type: 'EXPIRED', date: i.format('D MMMM YYYY') });
                }
            }

            // All events from x to the end of month, sorted chronologically
            var events = _.chain(personnel.events).filter(function (e) {
                return moment(e.eventStartDate).isBetween(moment(i).subtract(1, 'days'), nextI);
            }).sortBy('eventStartDate').value();

            _.each(events, function (e) {
                if (e.type == 'USAGE' || e.type == 'CASHOUT') {
                    for (var j = 0; j < e.length; j++) {
                        minus.push({ type: e.type, date: moment(e.eventStartDate).format('D MMMM YYYY') });
                    }
                } else if (e.type == 'REDEMPTION') {
                    for (var j = 0; j < e.length; j++) {
                        plus.push({ type: e.type, date: moment(e.eventStartDate).format('D MMMM YYYY') });
                    }
                }

            });

            // Next iteration
            i = nextI;
        }

        return {
            plus: plus,
            minus: minus,
            zipped: _.zip(plus, minus),
            balance: plus.length - minus.length,
            startDate: this.getStartDate(id)
        };
    }
};
