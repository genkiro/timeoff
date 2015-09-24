var b = new Blaze.ReactiveVar(30);
var a = new Blaze.ReactiveVar(60);

Template.calculation.rendered = function () {
    $('.number').inputmask("decimal", { autoGroup: true, groupSeparator: " ", groupSize: 3 });
};

Template.calculation.events({
    'keydown #targetProfitMargin, keypress #targetProfitMargin, keyup #targetProfitMargin': function (e) {
        b.set($(e.target).inputmask('unmaskedvalue'));
        a.set(b.get() * 2);
    },

    'keydown #salesPricePerPiece, keypress #salesPricePerPiece, keyup #salesPricePerPiece': function (e) {
        a.set($(e.target).inputmask('unmaskedvalue'));
        b.set(a.get() / 2);
    }
});

Template.calculation.helpers({
    b: function() {
        return b.get();
    },
    a: function() {
        return a.get();
    }
});