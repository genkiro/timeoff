Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/', {name: 'homepage'});

Router.route('/settings', {name: 'settings'});
Router.route('/input/create', {name: 'inputCreate'});
Router.route('/input/list', {name: 'inputList'});
Router.route('/calculation/:_id', function () {
    var input = Inputs.findOne({ _id: this.params._id });
    var settings = Settings.findOne({}, {sort: {timeCreated: -1}});
    var machine = Machines.findOne({ name: input.machineName });
    var paper = Papers.findOne({ name: input.paperType });

    this.render('calculation', { data: { _id: this.params._id, input: input, settings: settings, machine: machine, paper: paper } });
}, {name: 'calculation'});

/*
Router.route('/inboundForm', {name: 'inboundForm'});
Router.route('/outboundForm', {name: 'outboundForm'});
Router.route('/transactions', {name: 'transactions'});
Router.route('/stock', {name: 'stock'});
Router.route('/itemList', {name: 'itemList'});
Router.route('/stockReport', {name: 'stockReport'});
*/
