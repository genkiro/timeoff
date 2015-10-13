console.log('client file');

Accounts.config({ forbidClientAccountCreation : true });

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
    }
}, function ( name, handler ) {
    Handlebars.registerHelper( name, handler );
});

Template.inputForm.rendered = function() {
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

    $('#paperType').typeahead({
        source: function() {
            var arr = [];
            Papers.find({}).forEach(function (x) { arr.push(x.name); });
            return arr;
        },
        autoSelect: true
    });

    $('#machineName').typeahead({
        source: function() {
            var arr = [];
            Machines.find({}).forEach(function (x) { arr.push(x.name); });
            return arr;
        },
        autoSelect: true
    });

    var input = Template.currentData().input;
    if (input) {
        $('#entryDate').datepicker('update', input.entryDate);
        $('input[value="' + input.designAge + '"]').prop("checked", true);
    } else {
        console.log('Template.currentData() ', Template.currentData());
    }
};

Template.inputForm.events({
    'submit form': function (e) {
        e.preventDefault();

        var input = {
            customer: e.target.customer.value,
            entryDate: $(e.target.entryDate).datepicker('getDate'),
            itemCode: e.target.itemCode.value,
            orderName: e.target.orderName.value,
            quantity: Number($(e.target.quantity).inputmask('unmaskedvalue')),
            designAge: $('input[name="designAge"]:checked').val(),
            prodLength: Number($(e.target.prodLength).inputmask('unmaskedvalue')),
            prodWidth: Number($(e.target.prodWidth).inputmask('unmaskedvalue')),
            paperType: e.target.paperType.value,
            dieLength: Number($(e.target.dieLength).inputmask('unmaskedvalue')),
            dieWidth: Number($(e.target.dieWidth).inputmask('unmaskedvalue')),
            totalPiecesInDie: Number($(e.target.totalPiecesInDie).inputmask('unmaskedvalue')),
            nDieColor: Number($(e.target.nDieColor).inputmask('unmaskedvalue')),
            machineName: e.target.machineName.value,
            inkPaperCostPercent: Number($(e.target.inkPaperCostPercent).inputmask('unmaskedvalue')),
            isProcessed: this.input ? this.input.isProcessed : false
        };

        if (this.input) {
            Inputs.update(this.input._id,

                { $set: input },

                function (err, result) {
                if (err) {
                    var msg = "err: " + err;
                    console.log(msg);
                } else {
                    Router.go('inputList');
                    alertify.success('Updated!');
                }
            });
        } else {
            Inputs.insert(input, function (err, result) {
                if (err) {
                    var msg = "err: " + err;
                    console.log(msg);
                } else {
                    Router.go('inputList');
                    alertify.success('Saved!');
                }
            });
        }
    }
});

Template.inputList.helpers({
    inputs: function () {
        return Inputs.find({ isProcessed: false }, { sort: { entryDate: 1 }});
    }
});

Template.settings.rendered = function () {
    $('.rupiah').inputmask("integer", { autoGroup: true, groupSeparator: " ", groupSize: 3 });
};

Template.settings.helpers({
    settings: function () {
        return Settings.findOne({}, {sort: {timeCreated: -1}});
    },
    machines: function () {
        return Machines.find({});
    },
    papers: function () {
        return Papers.find({});
    }
});

Template.settings.events({
    'click #addPaper': function (e) {
        e.preventDefault();
        Papers.insert({
            name: $('#newPaperName').val(),
            price: Number($('#newPaperPrice').val()),
        }, function (err, result) {
            if (err) {
                var msg = "err: " + err;
                console.log(msg);
            } else {
                $('#newPaperName').val('');
                $('#newPaperPrice').val('');
                alertify.success('Saved!');
            }
        })
    },
    'click .deletePaper': function (e) {
        e.preventDefault();

        var paperId = $(e.target).closest('tr').data('id');
        var paper = Papers.findOne({_id: paperId });

        alertify.confirm('Yakin mau hapus "' + paper.name + '" ?',
            function () {
                Papers.remove({_id: paperId}, function (err) { alertify.success('Terhapus'); });
            },
            function () { }
        );
    },
    'click #addMachine': function (e) {
        e.preventDefault();
        Machines.insert({
            name: $('#newMachineName').val(),
            speed: Number($('#newMachineSpeed').val()),
            setupTime: Number($('#newMachineSetupTime').val()),
            nOperator: Number($('#newMachineNOperator').val())
        }, function (err, result) {
            if (err) {
                var msg = "err: " + err;
                console.log(msg);
            } else {
                $('#newMachineName').val('');
                $('#newMachineSpeed').val('');
                $('#newMachineSetupTime').val('');
                $('#newMachineNOperator').val('');
                alertify.success('Saved!');
            }
        })
    },
    'click .deleteMachine': function (e) {
        e.preventDefault();

        var machineId = $(e.target).closest('tr').data('id');
        var machine = Machines.findOne({_id: machineId });

        alertify.confirm('Yakin mau hapus "' + machine.name + '" ?',
            function () {
                Machines.remove({_id: machineId}, function (err) { alertify.success('Terhapus'); });
            },
            function () { }
        );
    },
    'submit form': function (e) {
        e.preventDefault();

        Settings.insert({
            materialCost: Number($(e.target.materialCost).inputmask('unmaskedvalue')),
            safetyFactor: Number(e.target.safetyFactor.value),
            operatorCost: Number($(e.target.operatorCost).inputmask('unmaskedvalue')),
            efficiencyFactor: Number(e.target.efficiencyFactor.value),
            operatorWastePercent: Number(e.target.operatorWastePercent.value),
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

Template.output.helpers({
    outputs: function() {
        return Outputs.find({}, {limit: Session.get('outputPaging'), sort: {timeCreated: -1}});
    }
});

Template.output.rendered = function () {
    Session.set('outputPaging', pageSize);
};

Template.output.events({
    'click #loadMoreOutputs': function (e) {
        e.preventDefault();
        var lastVal = Session.get('outputPaging');

        if (lastVal >= Outputs.find({}).count()) {
            alertify.error('No more outputs..');
        } else {
            Session.set('outputPaging', lastVal + pageSize);
        }
    }
});
