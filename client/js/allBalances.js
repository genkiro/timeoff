var selectedUserId = new Blaze.ReactiveVar();

Template.allBalances.events({
    'click tr.user': function (e) {
        e.preventDefault();
        selectedUserId.set($(e.target).closest('tr').data('id'));
    }
});

Template.ptoButtons.events({
    'click #addPto': function (e) {
        e.preventDefault();

        PersonnelInfo.upsert(
            { _id: selectedUserId.get()},
            { $push: {
                events: {
                    id: Random.id(),
                    type: 'DIPAKAI',
                    eventStartDate: moment($('#ptoStartDate').val()).toDate(),
                    length: Number($('#ptoLength').val()),
                    description: $('#ptoDescription').val()
                }
            }},
            function () {
                alertify.success('Saved!');
            }
        );
    },
    'click #addCashOutPto': function (e) {
        e.preventDefault();

        PersonnelInfo.upsert(
            { _id: selectedUserId.get()},
            { $push: {
                events: {
                    id: Random.id(),
                    type: 'DIUANGKAN',
                    eventStartDate: moment($('#cashOutPtoDate').val()).startOf('day').toDate(),
                    length: Number($('#cashOutPtoLength').val()),
                    description: $('#cashOutPtoDescription').val()
                }
            }},
            function () {
                alertify.success('Saved!');
            }
        );
    },
    'click #addCreditPto': function (e) {
        e.preventDefault();

        PersonnelInfo.upsert(
            { _id: selectedUserId.get()},
            { $push: {
                events: {
                    id: Random.id(),
                    type: 'KREDIT',
                    eventStartDate: moment($('#creditPtoStartDate').val()).startOf('day').toDate(),
                    length: Number($('#creditPtoLength').val()),
                    description: $('#creditPtoDescription').val()
                }
            }},
            function () {
                alertify.success('Saved!');
            }
        );
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

        PersonnelInfo.upsert(
            { _id: selectedUserId.get()},
            { $push: {
                events: {
                    id: Random.id(),
                    type: 'S_DIPAKAI',
                    eventStartDate: moment($('#sickDaysStartDate').val()).toDate(),
                    length: Number($('#sickDaysLength').val()),
                    description: $('#sickDaysDescription').val()
                }
            }},
            function () {
                alertify.success('Saved!');
            }
        );
    },
    'click #addSickDaysCashOut': function (e) {
        e.preventDefault();

        PersonnelInfo.upsert(
            { _id: selectedUserId.get()},
            { $push: {
                events: {
                    id: Random.id(),
                    type: 'S_DIUANGKAN',
                    eventStartDate: moment($('#cashOutSickDaysStartDate').val()).startOf('day').toDate(),
                    length: Number($('#cashOutSickDayslength').val()),
                    description: $('#cashOutSickDaysDescription').val()
                }
            }},
            function () {
                alertify.success('Saved!');
            }
        );
    },
    'click #addSickDaysCredit': function (e) {
        e.preventDefault();

        PersonnelInfo.upsert(
            { _id: selectedUserId.get()},
            { $push: {
                events: {
                    id: Random.id(),
                    type: 'S_KREDIT',
                    eventStartDate: moment($('#creditSickDaysStartDate').val()).startOf('day').toDate(),
                    length: Number($('#creditSickDaysLength').val()),
                    description: $('#creditSickDaysDescription').val()
                }
            }},
            function () {
                alertify.success('Saved!');
            }
        );
    },
    'click #cashOutAllSickDays': function (e) {
        e.preventDefault();
        var balance = calc.getDetails(selectedUserId.get()).sickDaysBalance;
        if (balance > 0) {
            $('#cashOutSickDayslength').val(balance);
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
            function () { }
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
        return calc.getDetails(this.userId);
    }
});

Template.sickDaysBalanceTable.helpers({
    details: function () {
        return calc.getDetails(this.userId);
    }
});

Template.eventsTable.helpers({
    events: function (id) {
        return _.sortBy(PersonnelInfo.findOne(id).events, 'eventStartDate');
    }
});
