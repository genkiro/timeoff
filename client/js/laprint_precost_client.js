console.log('client file');

// Some hack so we can see all emails
Meteor.subscribe("allUserData");

/* How many rows shown in a page */
pageSize = 25;

// load a language
numeral.language('id', {
    delimiters: {
        thousands: ' ',
        decimal: ','
    },
    abbreviations: {
        thousand: 'ribu',
        million: 'juta',
        billion: 'milyar',
        trillion: 'trilliun'
    },
    currency: {
        symbol: 'Rp. '
    }
});

// switch between languages
numeral.language('id');


$.each({
    rp: function (n) {
        if (!n) { return; }
        return numeral(n).format('$ 0,0[.]00');
    },
    perc: function (o) {
        return (o.hash.nominator * 100 / o.hash.denominator).toFixed(2) + ' %';
    },
    isInRolez: function (role) {
        return Roles.userIsInRole(Meteor.userId(), role);
    },
    toSimpleDate: function (input) {
        if (typeof input != 'undefined' && input instanceof Date) {
            return moment(input).format('D MMMM YYYY');
        } else {
            return input.format('D MMMM YYYY');
        }
    }
}, function ( name, handler ) {
    Handlebars.registerHelper( name, handler );
});

Template.homepage.helpers({
    userId: function () {
        return Meteor.user()._id;
    }
});

Template.personnels.rendered = function () {
    var $date = $('.date');
    $date.datepicker({
        format: "dd MM yyyy",
        todayBtn: "linked",
        clearBtn: true,
        language: "id",
        //daysOfWeekDisabled: "0",
        autoclose: true,
        todayHighlight: true,
        toggleActive: true
    });
    $date.datepicker('update', new Date());
};

Template.personnels.events({
    'click #addPersonnel': function(e) {
        e.preventDefault();
        PersonnelInfo.insert({ name: $('#newPersonnelName').val(), startDate: $('#newPersonnelStartDate').datepicker('getDate') });
    },
    'click .editStartDate': function (e) {
        e.preventDefault();

        var userId = $(e.target).closest('tr').data('id');
        var personnel = PersonnelInfo.findOne({_id: userId });
        var oldDate = personnel ? personnel.startDate : null;

        alertify.prompt('Change start date from "' + oldDate + '" to what?', oldDate,
            function (evt, newDate) {
                PersonnelInfo.upsert({_id: userId }, { $set: { startDate: moment(newDate).toDate() }}, function () {
                    alertify.success('Start date was changed from "' + oldDate + '" to "'  + newDate + '"');
                });
            },
            function () {
                alertify.error('Cancel');
            }
        ).set('type', 'date');
    },
    'click .editName': function (e) {
        e.preventDefault();

        var userId = $(e.target).closest('tr').data('id');
        var oldName = Meteor.users.findOne({_id: userId}).profile.name;

        alertify.prompt('Change name from "' + oldName + '" to what?', oldName,
            function (evt, newName) {
                Meteor.users.update({_id: userId}, {$set: {"profile.name": newName}})
            },
            function () {
                alertify.error('Cancel');
            }
        ).set('type', 'text');
    },
    'click .deleteUser': function (e) {
        e.preventDefault();

        var userId = $(e.target).closest('tr').data('id');
        var user = Meteor.users.findOne({_id: userId});
        var name = user.profile.name;
        var email = _.pluck(user.emails, 'address').join();

        alertify.confirm('Are you sure you want to delete user "' + name + '" (' + email +') ?',
            function (evt, newName) {
                if (userId == Meteor.userId()) {
                    alertify.error('You cannot delete yourself.');
                } else {
                    PersonnelInfo.remove({ _id: userId });
                    Meteor.users.remove({ _id: userId }, function (error, result) {
                        if (error) {
                            alertify.error("Error removing user: ", error);
                        } else {
                            alertify.success('Deleted');
                        }
                    })
                }
            },
            function () {
                alertify.error('Cancel');
            }
        );
    }
});

Template.personnels.helpers({
    users: function () {
        return Meteor.users.find({});
    },
    personnels: function () {
       return PersonnelInfo.find({});
    },
    getSimpleStartDate: function (id) {
        var startDate = calc.getStartDate(id);
        return startDate ? startDate.format('D MMMM YYYY') : '-';
    }
});
