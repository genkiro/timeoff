var b = new Blaze.ReactiveVar(30);
var a = new Blaze.ReactiveVar(60);

var orderName = new Blaze.ReactiveVar();
var prodLength = new Blaze.ReactiveVar();
var prodWidth = new Blaze.ReactiveVar();
var prodTotArea = new Blaze.ReactiveVar();
var cylDiameter = new Blaze.ReactiveVar();
var dieLength = new Blaze.ReactiveVar();
var dieWidth = new Blaze.ReactiveVar();
var totDieArea = new Blaze.ReactiveVar();
var totPiecesIn1Die = new Blaze.ReactiveVar();
var prePressMatCost = new Blaze.ReactiveVar();
var prePressArea = new Blaze.ReactiveVar();
var nDie = new Blaze.ReactiveVar();
var prePressSafetyFactor = new Blaze.ReactiveVar();
var totPrePressCost = new Blaze.ReactiveVar();
var paperType = new Blaze.ReactiveVar();
var paperPrice = new Blaze.ReactiveVar();
var totPaperPrice = new Blaze.ReactiveVar();
var quantity = new Blaze.ReactiveVar();
var box = new Blaze.ReactiveVar();
var totPaperWeight = new Blaze.ReactiveVar();
var totFinishedProdArea = new Blaze.ReactiveVar();
var machineName = new Blaze.ReactiveVar();
var machineSpeed = new Blaze.ReactiveVar();
var confWidth = new Blaze.ReactiveVar();
var nOperator = new Blaze.ReactiveVar();
var setupTime = new Blaze.ReactiveVar();
var operatorCost = new Blaze.ReactiveVar();
var efficiencyFactor = new Blaze.ReactiveVar();
var operatorWastePerc = new Blaze.ReactiveVar();
var operatorWaste = new Blaze.ReactiveVar();
var configWaste = new Blaze.ReactiveVar();
var configWastePerc = new Blaze.ReactiveVar();

var totConfigWaste = new Blaze.ReactiveVar();
var totOperatorWasteTarget = new Blaze.ReactiveVar();
var totManufacturingArea = new Blaze.ReactiveVar();
var totFinishedProdCost = new Blaze.ReactiveVar();
var totConfigWasteCost = new Blaze.ReactiveVar();
var totOperatorWasteCost = new Blaze.ReactiveVar();
var totManufacturingCost = new Blaze.ReactiveVar();
var totLength = new Blaze.ReactiveVar();
var totProdTime = new Blaze.ReactiveVar();
var totManHour = new Blaze.ReactiveVar();
var totColorCost = new Blaze.ReactiveVar();

var totPaperCost = new Blaze.ReactiveVar();
var totInkCost = new Blaze.ReactiveVar();
var totMatCost = new Blaze.ReactiveVar();
var totLaborCost = new Blaze.ReactiveVar();
var totPrePressCost = new Blaze.ReactiveVar();
var totOverheadCost = new Blaze.ReactiveVar();
var totCost = new Blaze.ReactiveVar();
var profitMargin = new Blaze.ReactiveVar();
var profit = new Blaze.ReactiveVar();
var totProfit = new Blaze.ReactiveVar();
var totSalesPrice = new Blaze.ReactiveVar();


Template.calculation.rendered = function () {
    $('.number').inputmask("decimal", { autoGroup: true, groupSeparator: " ", groupSize: 3 });
};

Template.calculation.events({
    'keydown #playground, keypress #playground, keyup #playground': function (e) {
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
    },

    prodLength: function() {
        prodLength.set(this.input.prodLength);
        return prodLength.get();
    },
    prodWidth: function() {
        prodWidth.set(this.input.prodWidth);
        return prodWidth.get();
    },
    prodTotArea: function() {
        prodTotArea.set(prodLength.get() * prodWidth.get());
        return prodTotArea.get();
    },
    cylDiameter: function() {
        return dieLength.get() / Math.PI;
    },
    dieLength: function() {
        dieLength.set(this.input.dieLength);
        return dieLength.get();
    },
    dieWidth: function() {
        dieWidth.set(this.input.dieWidth);
        return dieWidth.get();
    },
    totDieArea: function() {
        totDieArea.set(dieLength.get() * dieWidth.get());
        return totDieArea.get();
    },
    totPiecesIn1Die: function() {
        totPiecesIn1Die.set(this.input.totalPiecesInDie);
        return totPiecesIn1Die.get();
    },
    prePressMatCost: function() {
        prePressMatCost.set(this.settings.materialCost);
        return prePressMatCost.get();
    },
    prePressArea: function() {
        prePressArea.set(totDieArea.get());
        return prePressArea.get();
    },
    nDie: function() {
        nDie.set(this.input.nDieColor);
        return nDie.get();
    },
    prePressSafetyFactor: function() {
        prePressSafetyFactor.set(this.settings.safetyFactor);
        return prePressSafetyFactor.get();
    },
    totPrePressCost: function() {
        totPrePressCost.set(prePressMatCost.get() * prePressArea.get() * nDie.get() * prePressSafetyFactor.get());
        return totPrePressCost.get();
    },
    paperType: function() {
        return this.input.paperType;
    },
    paperPrice: function() {
        paperPrice.set(this.paper.price);
        return paperPrice.get();
    },
    totPaperPrice: function() {
        totPaperPrice.set(paperPrice.get());
        return totPaperPrice.get();
    },

    /* Reserved for Material (Ink) */

    quantity: function() {
        quantity.set(this.input.quantity);
        return quantity.get();
    },
    /*box: function() {
        box.set(quantity.get() / ????????????)
    }*/
    /*totPaperWeight: function() {

    }*/
    totFinishedProdArea: function() {
        totFinishedProdArea.set(quantity.get() * prodTotArea.get());
        return totFinishedProdArea.get();
    },
    machineName: function() {
        return this.input.machineName;
    },
    machineSpeed: function() {
        machineSpeed.set(this.machine.speed);
        return machineSpeed.get();
    },
    confWidth: function() {
        return prodWidth.get();
    },
    nOperator: function() {
        nOperator.set(this.machine.nOperator);
        return nOperator.get();
    },
    setupTime: function() {
        setupTime.set(this.machine.setupTime);
        return setupTime.get();
    },
    operatorCost: function() {
        operatorCost.set(this.settings.operatorCost);
        return operatorCost.get();
    },
    efficiencyFactor: function() {
        efficiencyFactor.set(this.settings.efficiencyFactor);
        return efficiencyFactor.get();
    },
    operatorWastePerc: function() {
        operatorWastePerc.set(this.settings.operatorWastePercent);
        return operatorWastePerc.get();
    },
    operatorWaste: function() {
        operatorWaste.set((configWaste.get() + prodTotArea.get()) / (1 - operatorWastePerc.get()/100) * operatorWastePerc.get()/100);
        return operatorWaste.get();
    },
    configWaste: function() {
        configWaste.set((totDieArea.get() - prodTotArea.get() * totPiecesIn1Die.get())/totPiecesIn1Die.get());
        return configWaste.get();
    },
    configWastePerc: function() {
        configWastePerc.set(100 * configWaste.get() / (prodTotArea.get() + configWaste.get()));
        return configWastePerc.get();
    },
    totConfigWaste: function() {
        totConfigWaste.set(configWaste.get() * quantity.get());
        return totConfigWaste.get();
    },
    totOperatorWasteTarget: function() {
        totOperatorWasteTarget.set(operatorWaste.get() * quantity.get());
        return totOperatorWasteTarget.get();
    },
    totManufacturingArea: function() {
        totManufacturingArea.set(totFinishedProdArea.get() + totConfigWaste.get() + totOperatorWasteTarget.get());
        return totManufacturingArea.get();
    },
    totFinishedProdCost: function() {
        totFinishedProdCost.set(totFinishedProdArea.get() * totPaperPrice.get());
        return totFinishedProdCost.get();
    },
    totConfigWasteCost: function() {
        totConfigWasteCost.set(totConfigWaste.get() * totPaperPrice.get());
        return totConfigWasteCost.get();
    },
    totOperatorWasteCost: function() {
        totOperatorWasteCost.set(totOperatorWasteTarget.get() * totPaperPrice.get());
        return totOperatorWasteCost.get();
    },
    totManufacturingCost: function() {
        totManufacturingCost.set(totFinishedProdCost.get() + totConfigWasteCost.get() + totOperatorWasteCost.get());
        return totManufacturingCost.get();
    },
    totLength: function() {
        totLength.set(totManufacturingArea.get() / dieWidth.get());
        return totLength.get();
    },
    totProdTime: function() {
        // this is wrong because setupTime is a string.
        console.log('first: ' + (1 / (efficiencyFactor.get()/100) * totLength.get() / machineSpeed.get() / 60));
        console.log('setupTime: ' + setupTime.get());
        console.log((1 / (efficiencyFactor.get()/100) * totLength.get() / machineSpeed.get() / 60) + setupTime.get());
        totProdTime.set((1 / (efficiencyFactor.get()/100) * totLength.get() / machineSpeed.get() / 60) + setupTime.get());
        return totProdTime.get();
    },
    totManHour: function() {
        totManHour.set(totProdTime.get() * nOperator.get());
        return totManHour.get();
    },
    totColorCost: function() {
        totColorCost.set(this.input.inkPaperCostPercent * totManufacturingCost.get());
        return totColorCost.get();
    },
    totPaperCost: function() {
        totPaperCost.set(totManufacturingArea.get() * totPaperPrice.get());
        return totPaperCost.get();
    },
    totInkCost: function() {
        totInkCost.set(totColorCost.get());
        return totInkCost.get();
    },
    totMatCost: function() {
        totMatCost.set(totPaperCost.get() + totInkCost.get());
        return totMatCost.get();
    },
    totLaborCost: function() {
        totLaborCost.set(totManHour.get() * operatorCost.get());
        return totLaborCost.get();
    },
    totOverheadCost: function() {
        totOverheadCost.set(totPrePressCost.get());
        return totOverheadCost.get();
    },
    totCost: function() {
        totCost.set(totMatCost.get() + totLaborCost.get() + totOverheadCost.get());
        return totCost.get();
    },
    profitMargin: function() {
        return b.get();
    },
    profit: function() {
        profit.set(totCost.get() / (1-b.get()/100) * b.get()/100);
        return profit.get();
    },
    totProfit: function() {
        totProfit.set(profit.get());
        return totProfit.get();
    },
    totSalesPrice: function() {
        totSalesPrice.set(totCost.get() + totProfit.get());
        return totSalesPrice.get();
    }


        /*
        *var totPaperCost = new Blaze.ReactiveVar();
         var totInkCost = new Blaze.ReactiveVar();
         var totMatCost = new Blaze.ReactiveVar();
         var totLaborCost = new Blaze.ReactiveVar();
         var totPrePressCost = new Blaze.ReactiveVar();
         var totOverheadCost = new Blaze.ReactiveVar();
         var totCost = new Blaze.ReactiveVar();
         var profitMargin = new Blaze.ReactiveVar();
         var profit = new Blaze.ReactiveVar();
         var totProfit = new Blaze.ReactiveVar();
         var totSalesPrice = new Blaze.ReactiveVar();*/

});