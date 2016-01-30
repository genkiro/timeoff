var daysToCashOut = new Blaze.ReactiveVar(0);
var daysToRedeem = new Blaze.ReactiveVar(0);
var selectedUserId = new Blaze.ReactiveVar();

Template.allBalances.events({
    'click tr.user': function (e) {
        e.preventDefault();
        selectedUserId.set($(e.target).closest('tr').data('id'));
    },
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

Template.allBalances.helpers({
    users: function () {
        return Meteor.users.find({});
    },
    events: function () {
        return _.sortBy(PersonnelInfo.findOne(selectedUserId.get()).events, 'eventStartDate');
    },
    selectedUser: function () {
        return Meteor.users.findOne(selectedUserId.get());
    },
    userId: function () {
        return selectedUserId.get();
    },
    getBalance: function (id) {
        return calc.getDetails(id).balance;
    },
    isSelected: function (id) {
        return selectedUserId.get() == id;
    },
    details: function () {
        return calc.getDetails(selectedUserId.get());
    },
    daysToCashOut: function () {
        return daysToCashOut.get();
    },
    daysToSalvage: function () {
        return daysToRedeem.get();
    }
});
