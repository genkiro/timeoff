Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/', {name: 'homepage'});
Router.route('/allbalances', {name: 'allBalances'});
Router.route('/personnels', {name: 'personnels'});

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
Router.onBeforeAction(adminFilter, {only: ['allBalances','personnels']});