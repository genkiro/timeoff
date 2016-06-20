var ptoExpiryLength = 12;
var sickDaysExpiryLength = 6;
var dateFormat = 'D MMMM YYYY';

calc = {
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

        var ptoPlus = [];
        var ptoMinus = [];
        var sickDaysPlus = [];
        var sickDaysMinus = [];

        while (i && i.isSameOrBefore(end)) {
            var nextI = moment(i).add(1, 'months').startOf('month');

            // First of the month
            if (i.date() == 1) {
                // Achieved one PTO
                ptoPlus.push({ type: 'DIPEROLEH', date: i.format(dateFormat) });

                // Achieved one sick day every couple of month
                if ((i.month() % 2) != (start.month() % 2)) {
                    sickDaysPlus.push({ type: 'S_DIPEROLEH', date: i.format(dateFormat) })
                }

                // Expire PTO if necessary
                if ((ptoPlus.length - ptoMinus.length) > ptoExpiryLength) {
                    ptoMinus.push({ type: 'KADALUARSA', date: i.format(dateFormat) });
                }

                // Expire sick days if necessary
                if ((sickDaysPlus.length - sickDaysMinus.length) > sickDaysExpiryLength) {
                    sickDaysMinus.push({ type: 'S_KADALUARSA', date: i.format(dateFormat) });
                }
            }

            // All events from x to the end of month, sorted chronologically
            var events = _.chain(personnel.events).filter(function (e) {
                return moment(e.eventStartDate).isBetween(moment(i).subtract(1, 'days'), nextI);
            }).sortBy('eventStartDate').value();

            _.each(events, function (e) {
                // Properly put the event on the PTO balance sheet
                if (e.type == 'DIPAKAI' || e.type == 'DIUANGKAN') {
                    for (var j = 0; j < e.length; j++) {
                        ptoMinus.push({ type: e.type, date: moment(e.eventStartDate).format(dateFormat) });
                    }
                } else if (e.type == 'KREDIT') {
                    for (var j = 0; j < e.length; j++) {
                        ptoPlus.push({ type: e.type, date: moment(e.eventStartDate).format(dateFormat) });
                    }
                }

                // Properly put the event on the sick days balance sheet
                if (e.type == 'S_DIPAKAI' || e.type == 'S_DIUANGKAN') {
                    for (var j = 0; j < e.length; j++) {
                        sickDaysMinus.push({ type: e.type, date: moment(e.eventStartDate).format(dateFormat) });
                    }
                } else if (e.type == 'S_KREDIT') {
                    for (var j = 0; j < e.length; j++) {
                        sickDaysPlus.push({ type: e.type, date: moment(e.eventStartDate).format(dateFormat) });
                    }
                }
            });

            // Next iteration
            i = nextI;
        }

        return {
            startDate: this.getStartDate(id),
            ptoZipped: _.zip(ptoPlus, ptoMinus),
            ptoBalance: ptoPlus.length - ptoMinus.length,
            sickDaysZipped: _.zip(sickDaysPlus, sickDaysMinus),
            sickDaysBalance: sickDaysPlus.length - sickDaysMinus.length
        };
    }
};
