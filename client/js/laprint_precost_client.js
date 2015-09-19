console.log('client file');

Template.settings.rendered = function () {
    $('.rupiah').inputmask("integer", { autoGroup: true, groupSeparator: " ", groupSize: 3 });
};

Template.settings.helpers({
    settings: function () {
        return Settings.findOne({}, {sort: {timeCreated: -1}});
    }
});

Template.settings.events({
    'submit form': function (e) {
        e.preventDefault();

        var materialCost = $(e.target.materialCost).inputmask('unmaskedvalue');
        var safetyFactor = e.target.safetyFactor.value;
        var operatorCost = $(e.target.operatorCost).inputmask('unmaskedvalue');
        var efficiencyFactor = e.target.efficiencyFactor.value;
        var operatorWastePercent = e.target.operatorWastePercent.value;

        Settings.insert({
            materialCost: materialCost,
            safetyFactor: safetyFactor,
            operatorCost: operatorCost,
            efficiencyFactor: efficiencyFactor,
            operatorWastePercent: operatorWastePercent,
            timeCreated: new Date()
        }, function (err, result) {
            if (err) {
                var msg = "err: " + err;
                console.log(msg);
            } else {
                alertify.success('Saved!');
            }
        });
    }
});