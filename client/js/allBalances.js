var daysToCashOut = new Blaze.ReactiveVar(0);
var daysToRedeem = new Blaze.ReactiveVar(0);
var selectedUserId = new Blaze.ReactiveVar();

Template.allBalances.events({
    'click tr.user': function (e) {
        e.preventDefault();
        selectedUserId.set($(e.target).closest('tr').data('id'));
    }
});

Template.buttons.events({
    'click #addPTO': function (e) {
        e.preventDefault();

        PersonnelInfo.upsert(
            { _id: selectedUserId.get()},
            { $push: {
                events: {
                    id: Random.id(),
                    type: 'USAGE',
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
    'click #addCashOut': function (e) {
        e.preventDefault();

        PersonnelInfo.upsert(
            { _id: selectedUserId.get()},
            { $push: {
                events: {
                    id: Random.id(),
                    type: 'CASHOUT',
                    eventStartDate: moment($('#cashOutDate').val()).startOf('day').toDate(),
                    length: Number($('#cashOutLength').val()),
                    description: $('#cashOutDescription').val()
                }
            }},
            function () {
                alertify.success('Saved!');
            }
        );
    },
    'click #addRedemption': function (e) {
        e.preventDefault();

        PersonnelInfo.upsert(
            { _id: selectedUserId.get()},
            { $push: {
                events: {
                    id: Random.id(),
                    type: 'REDEMPTION',
                    eventStartDate: moment($('#redemptionDate').val()).startOf('day').toDate(),
                    length: Number($('#redemptionLength').val()),
                    description: $('#redemptionDescription').val()
                }
            }},
            function () {
                alertify.success('Saved!');
            }
        );
    },
    'click #cashOutAll': function (e) {
        e.preventDefault();
        var balance = calc.getDetails(selectedUserId.get()).balance;
        $('#cashOutLength').val(balance);
        daysToCashOut.set(balance);
    },
    'keydown #cashOutLength, keypress #cashOutLength, keyup #cashOutLength, change #cashOutLength': function (e) {
        daysToCashOut.set($('#cashOutLength').val());
    },
    'click #redemptionAll': function (e) {
        e.preventDefault();
        var balance = calc.getDetails(selectedUserId.get()).balance;
        $('#redemptionLength').val(balance);
        daysToRedeem.set(balance);
    },
    'keydown #redemptionLength, keypress #redemptionLength, keyup #redemptionLength, change #redemptionLength': function (e) {
        daysToRedeem.set($('#redemptionLength').val());
    },
    'hidden.bs.modal .modal': function (e) {
        $(e.target).find('form')[0].reset();
        daysToCashOut.set(0);
        daysToRedeem.set(0);
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
                    function (err) { alertify.success('Deleted'); });
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
    getBalance: function (id) {
        return calc.getDetails(id).balance;
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

Template.buttons.helpers({
    details: function () {
        return calc.getDetails(this.userId);
    },
    daysToCashOut: function () {
        return daysToCashOut.get();
    },
    daysToSalvage: function () {
        return daysToRedeem.get();
    }
});

Template.balanceTable.helpers({
    details: function () {
        return calc.getDetails(this.userId);
    }
});

Template.eventsTable.helpers({
    events: function (id) {
        return _.sortBy(PersonnelInfo.findOne(id).events, 'eventStartDate');
    }
});
