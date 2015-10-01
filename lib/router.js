Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/', {name: 'homepage'});

Router.route('/settings', {name: 'settings'});
Router.route('/input/create', {name: 'inputCreate'});
Router.route('/input/list', {name: 'inputList'});
Router.route('/output/list', {name: 'output'});
Router.route('/calculation/:_id', function () {
    var input = Inputs.findOne({ _id: this.params._id });
    var settings = Settings.findOne({}, {sort: {timeCreated: -1}});
    var machine = Machines.findOne({ name: input.machineName });
    var paper = Papers.findOne({ name: input.paperType });

    this.render('calculation', { data: { input_id: this.params._id, input: input, settings: settings, machine: machine, paper: paper } });
}, {name: 'calculation'});

var mustBeSignedIn = function(pause) {
    if (!(Meteor.user() || Meteor.loggingIn())) {
        Router.go('homepage');
    } else {
        this.next();
    }
};

var adminFilter = function(pause) {
    if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
        this.next();
    } else {
        this.render('unauthorized');
    }
};

Router.onBeforeAction(mustBeSignedIn, {except: ['homepage']});
Router.onBeforeAction(adminFilter, {only: ['output','calculation','settings']});