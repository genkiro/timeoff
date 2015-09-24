console.log('client file');

Template.inputCreate.rendered = function() {
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

    $('.integer').inputmask("integer", { autoGroup: true, groupSeparator: " ", groupSize: 3 });
    $('.decimal').inputmask("decimal", { autoGroup: true, groupSeparator: " ", radixPoint: ".", groupSize: 3 });
};

Template.inputCreate.events({
    'submit form': function (e) {
        e.preventDefault();

        Inputs.insert({
            customer: e.target.customer.value,
            entryDate: $(e.target.entryDate).datepicker('getDate'),
            itemCode: e.target.itemCode.value,
            orderName: e.target.orderName.value,
            quantity: $(e.target.quantity).inputmask('unmaskedvalue'),
            designAge: $('input[name="designAge"]:checked').val(),
            prodLength: $(e.target.prodLength).inputmask('unmaskedvalue'),
            prodWidth: $(e.target.prodWidth).inputmask('unmaskedvalue'),
            paperType: e.target.paperType.value,
            dieLength: $(e.target.dieLength).inputmask('unmaskedvalue'),
            dieWidth: $(e.target.dieWidth).inputmask('unmaskedvalue'),
            totalPiecesInDie: $(e.target.totalPiecesInDie).inputmask('unmaskedvalue'),
            nDieColor: $(e.target.nDieColor).inputmask('unmaskedvalue'),
            machineName: e.target.machineName.value,
            inkPaperCostPercent: $(e.target.inkPaperCostPercent).inputmask('unmaskedvalue')
        }, function (err, result) {
            if (err) {
                var msg = "err: " + err;
                console.log(msg);
            } else {
                Router.go('inputList');
                alertify.success('Saved!');
            }
        });
    }
});

Template.inputList.helpers({
    inputs: function () {
        return Inputs.find({}, { sort: { entryDate: 1 }});
    }
});

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

        Settings.insert({
            materialCost: $(e.target.materialCost).inputmask('unmaskedvalue'),
            safetyFactor: e.target.safetyFactor.value,
            operatorCost: $(e.target.operatorCost).inputmask('unmaskedvalue'),
            efficiencyFactor: e.target.efficiencyFactor.value,
            operatorWastePercent: e.target.operatorWastePercent.value,
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
