var selectedUserId = new Blaze.ReactiveVar();

Template.allBalances.events({
    'click tr.user': function (e) {
        e.preventDefault();
        selectedUserId.set($(e.target).closest('tr').data('id'));
    }
});

var alertSaveResult = function (err, result) {
    if (err) {
        alertify.error('Error, see console');
        console.log(err);
    } else {
        alertify.success('Saved!');
    }
};

Template.ptoButtons.events({
    'click #addPto': function (e) {
        e.preventDefault();

        Meteor.call('upzert', selectedUserId.get(), {
            id: Random.id(),
            type: 'DIPAKAI',
            eventStartDate: moment($('#ptoStartDate').val()).toDate(),
            length: Number($('#ptoLength').val()),
            description: $('#ptoDescription').val()
        }, alertSaveResult);
    },
    'click #addCashOutPto': function (e) {
        e.preventDefault();

        Meteor.call('upzert', selectedUserId.get(), {
            id: Random.id(),
            type: 'DIUANGKAN',
            eventStartDate: moment($('#cashOutPtoDate').val()).startOf('day').toDate(),
            length: Number($('#cashOutPtoLength').val()),
            description: $('#cashOutPtoDescription').val()
        }, alertSaveResult);
    },
    'click #addCreditPto': function (e) {
        e.preventDefault();

        Meteor.call('upzert', selectedUserId.get(), {
            id: Random.id(),
            type: 'KREDIT',
            eventStartDate: moment($('#creditPtoStartDate').val()).startOf('day').toDate(),
            length: Number($('#creditPtoLength').val()),
            description: $('#creditPtoDescription').val()
        }, alertSaveResult);
    },
    'click #cashOutAllPto': function (e) {
        e.preventDefault();
        var balance = calc.getDetails(selectedUserId.get()).ptoBalance;
        if (balance > 0) {
            $('#cashOutPtoLength').val(balance);
        }
    },
    'click #creditAllPto': function (e) {
        e.preventDefault();
        var balance = calc.getDetails(selectedUserId.get()).ptoBalance;
        if (balance < 0) {
            $('#creditPtoLength').val(-balance);
        }
    },
    'hidden.bs.modal .modal': function (e) {
        $(e.target).find('form')[0].reset();
    }
});

Template.sickDaysButtons.events({
    'click #addSickDays': function (e) {
        e.preventDefault();

        Meteor.call('upzert', selectedUserId.get(), {
            id: Random.id(),
            type: 'S_DIPAKAI',
            eventStartDate: moment($('#sickDaysStartDate').val()).toDate(),
            length: Number($('#sickDaysLength').val()),
            description: $('#sickDaysDescription').val()
        }, alertSaveResult);
    },
    'click #addSickDaysCashOut': function (e) {
        e.preventDefault();

        Meteor.call('upzert', selectedUserId.get(), {
            id: Random.id(),
            type: 'S_DIUANGKAN',
            eventStartDate: moment($('#cashOutSickDaysStartDate').val()).startOf('day').toDate(),
            length: Number($('#cashOutSickDaysLength').val()),
            description: $('#cashOutSickDaysDescription').val()
        }, alertSaveResult);
    },
    'click #addSickDaysCredit': function (e) {
        e.preventDefault();

        Meteor.call('upzert', selectedUserId.get(), {
            id: Random.id(),
            type: 'S_KREDIT',
            eventStartDate: moment($('#creditSickDaysStartDate').val()).startOf('day').toDate(),
            length: Number($('#creditSickDaysLength').val()),
            description: $('#creditSickDaysDescription').val()
        }, alertSaveResult);
    },
    'click #cashOutAllSickDays': function (e) {
        e.preventDefault();
        var balance = calc.getDetails(selectedUserId.get()).sickDaysBalance;
        if (balance > 0) {
            $('#cashOutSickDaysLength').val(balance);
        }
    },
    'click #creditAllSickDays': function (e) {
        e.preventDefault();
        var balance = calc.getDetails(selectedUserId.get()).sickDaysBalance;
        if (balance < 0) {
            $('#creditSickDaysLength').val(-balance);
        }
    },
    'hidden.bs.modal .modal': function (e) {
        $(e.target).find('form')[0].reset();
    }
});

Template.eventsTable.events({
    //TODO: check bug when we keep on deleting events on the same row

    'click .deleteEvent': function (e) {
        e.preventDefault();

        var tr = $(e.target).closest('tr');
        var id = tr.data('id');
        var type = tr.data('type');
        var date = new Date(tr.data('date'));
        var description = tr.data('description');

        alertify.confirm('Are you sure to delete this ' + type + ' "' + description + '" event at ' + moment(date).format('D MMMM YYYY') + ' ?',
            function () {
                PersonnelInfo.update(
                    { _id: selectedUserId.get() },
                    { $pull: {
                        events: { id: id, eventStartDate: date }
                    } },
                    function (err) {
                        if (err) {
                            console.log('err: ', err);
                            alertify.error('Error, see console.log')
                        }

                        alertify.success('Deleted'); });
            },
            function () { alertify.error('Canceled.') }
        );

    }
});




Template.allBalances.helpers({
    users: function () {
        return Meteor.users.find({});
    },
    userId: function () {
        return selectedUserId.get();
    },
    getPtoBalance: function (id) {
        return calc.getDetails(id).ptoBalance;
    },
    getSickDaysBalance: function (id) {
        return calc.getDetails(id).sickDaysBalance;
    },
    isSelected: function (id) {
        return selectedUserId.get() == id;
    }
});

Template.info.helpers({
    accountNotReady: function (id) {
        var user = Meteor.users.findOne(id);
        var personnel = PersonnelInfo.findOne({_id: id });

        return !(user.profile.name && personnel && personnel.startDate);
    },
    name: function (id) {
        return Meteor.users.findOne(id).profile.name;
    },
    details: function () {
        return calc.getDetails(this.userId);
    }
});

Template.ptoButtons.helpers({
    details: function () {
        return calc.getDetails(this.userId);
    }
});

Template.sickDaysButtons.helpers({
    details: function () {
        return calc.getDetails(this.userId);
    }
});

Template.ptoBalanceTable.helpers({
    details: function () {
        var details = calc.getDetails(this.userId);
        _.each(details.ptoZipped, function (el) {
            if (el[1] && el[1].type === 'AKAN_KADALUARSA') {
                el[1].decoration = true;

                var top = 1;
                var bot = 0.3;

                var c = calc.getConstants();
                var expiryDate = moment(el[1].date, c.dateFormat);

                var expireInMonths = moment.duration(expiryDate.diff(moment())).asMonths();
                el[1].opacity = top - (expireInMonths / c.ptoExpiryLength) * (top - bot);
            }
        });
        return details;
    }
});

Template.sickDaysBalanceTable.helpers({
    details: function () {
        var details = calc.getDetails(this.userId);
        _.each(details.sickDaysZipped, function (el) {
            if (el[1] && el[1].type === 'AKAN_KADALUARSA') {
                el[1].decoration = true;

                var top = 1;
                var bot = 0.3;

                var c = calc.getConstants();
                var expiryDate = moment(el[1].date, c.dateFormat);

                var expireInMonths = moment.duration(expiryDate.diff(moment())).asMonths();
                el[1].opacity = top - (expireInMonths / c.sickDaysExpiryLength) * (top - bot);
            }
        });
        return details;
    }
});

Template.eventsTable.helpers({
    events: function (id) {
        var info = PersonnelInfo.findOne(id);
        return info ? _.sortBy(info.events, 'eventStartDate') : '';
    }
});
