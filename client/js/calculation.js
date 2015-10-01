var targetProfitMargin = new Blaze.ReactiveVar(30);

var orderName = new Blaze.ReactiveVar();
var prodLength = new Blaze.ReactiveVar();
var prodWidth = new Blaze.ReactiveVar();
var prodTotArea = new Blaze.ReactiveVar();
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
var totFinishedProdArea = new Blaze.ReactiveVar();
var machineName = new Blaze.ReactiveVar();
var machineSpeed = new Blaze.ReactiveVar();
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
var totOverheadCost = new Blaze.ReactiveVar();
var totCost = new Blaze.ReactiveVar();
var profit = new Blaze.ReactiveVar();
var totProfit = new Blaze.ReactiveVar();
var totSalesPrice = new Blaze.ReactiveVar();

var totPaperCostPerPiece = new Blaze.ReactiveVar();
var totInkCostPerPiece = new Blaze.ReactiveVar();
var totMatCostPerPiece = new Blaze.ReactiveVar();
var totLaborCostPerPiece = new Blaze.ReactiveVar();
var totOverheadCostPerPiece = new Blaze.ReactiveVar();
var totCostPerPiece = new Blaze.ReactiveVar();
var profitPerPiece = new Blaze.ReactiveVar();
var totProfitPerPiece = new Blaze.ReactiveVar();
var totSalesPricePerPiece = new Blaze.ReactiveVar();

var totPaperCostPerM2 = new Blaze.ReactiveVar();
var totInkCostPerM2 = new Blaze.ReactiveVar();
var totMatCostPerM2 = new Blaze.ReactiveVar();
var totLaborCostPerM2 = new Blaze.ReactiveVar();
var totOverheadCostPerM2 = new Blaze.ReactiveVar();
var totCostPerM2 = new Blaze.ReactiveVar();
var profitPerM2 = new Blaze.ReactiveVar();
var totProfitPerM2 = new Blaze.ReactiveVar();
var totSalesPricePerM2 = new Blaze.ReactiveVar();

Template.calculation.rendered = function () {
    $('.number').inputmask("decimal", { autoGroup: true, groupSeparator: " ", groupSize: 3 });
};

Template.calculation.events({
    'click #saveToOutput': function(e) {
        e.preventDefault();
        Outputs.insert({
            customer: this.input.customer,
            entryDate: this.input.entryDate,
            itemCode: this.input.itemCode,
            orderName: this.input.orderName,
            quantity: this.input.quantity,
            designAge: this.input.designAge,
            prodLength: this.input.prodLength,
            prodWidth: this.input.prodWidth,
            paperType: this.input.paperType,
            paperPrice: this.paper.price,
            dieLength: this.input.dieLength,
            dieWidth: this.input.dieWidth,
            totalPiecesInDie: this.input.totalPiecesInDie,
            nDieColor: this.input.nDieColor,
            machineName: this.input.machineName,
            machineSpeed: this.machine.speed,
            setupTime: this.machine.setupTime,
            nOperator: this.machine.nOperator,
            totCostPerPiece: totCostPerPiece.get(),
            profitMarginOffered: targetProfitMargin.get(),
            pricePerPieceOffered: totSalesPricePerPiece.get(),
            totSalesPricePerPiece: totSalesPricePerPiece.get(),
            totSalesPrice: totSalesPrice.get(),
            totProfit: totProfit.get()
        }, function (err, result) {
            if (err) {
                var msg = "err: " + err;
                console.log(msg);
            } else {
                Router.go('output');
                alertify.success('Saved!');
            }
        });

    },
    'submit form': function (e) {
        e.preventDefault();
    },
    'keydown #targetProfitMargin, keypress #targetProfitMargin, keyup #targetProfitMargin': function (e) {
        targetProfitMargin.set(Number($(e.target).inputmask('unmaskedvalue')));
    },

    'blur #salesPricePerPiece': function (e) {
        var salesPricePerPiece = Number($(e.target).inputmask('unmaskedvalue'));
        var m = (salesPricePerPiece - totCostPerPiece.get()) / salesPricePerPiece;
        targetProfitMargin.set(m * 100);
    },

    'blur #totalNetProfit': function (e) {
        var totProfit = Number($(e.target).inputmask('unmaskedvalue'));
        console.log('totProfit: ' + totProfit + ' m: ' + (totProfit / (totCost.get() + totProfit)) + ' totCost.get(): ' + totCost.get());
        var m = totProfit / (totCost.get() + totProfit);
        targetProfitMargin.set(m * 100);
    },

    'blur #totalSales': function (e) {
        var totSalesPrice = Number($(e.target).inputmask('unmaskedvalue'));
        var m = (totSalesPrice - totCost.get()) / totSalesPrice;
        console.log('sp = ' + totSalesPrice + ' totCost= ' + totColorCost.get());
        targetProfitMargin.set(m * 100);
    }
});

Template.calculation.helpers({
    targetProfitMargin: function() {
        return targetProfitMargin.get();
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

    quantity: function() {
        quantity.set(this.input.quantity);
        return quantity.get();
    },
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
        totProdTime.set((1 / (efficiencyFactor.get()/100) * totLength.get() / machineSpeed.get() / 60) + setupTime.get());
        return totProdTime.get();
    },
    totManHour: function() {
        totManHour.set(totProdTime.get() * nOperator.get());
        return totManHour.get();
    },
    totColorCost: function() {
        totColorCost.set(this.input.inkPaperCostPercent/100 * totManufacturingCost.get());
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
        return targetProfitMargin.get();
    },
    profit: function() {
        profit.set(totCost.get() / (1-targetProfitMargin.get()/100) * targetProfitMargin.get()/100);
        return profit.get();
    },
    totProfit: function() {
        totProfit.set(profit.get());
        return totProfit.get();
    },
    totSalesPrice: function() {
        totSalesPrice.set(totCost.get() + totProfit.get());
        return totSalesPrice.get();
    },

    totPaperCostPerPiece: function() {
        totPaperCostPerPiece.set(totPaperCost.get() / quantity.get());
        return totPaperCostPerPiece.get();
    },
    totInkCostPerPiece: function() {
        totInkCostPerPiece.set(totInkCost.get() / quantity.get());
        return totInkCostPerPiece.get();
    },
    totMatCostPerPiece: function() {
        totMatCostPerPiece.set(totMatCost.get() / quantity.get());
        return totMatCostPerPiece.get();
    },
    totLaborCostPerPiece: function() {
        totLaborCostPerPiece.set(totLaborCost.get() / quantity.get());
        return totLaborCostPerPiece.get();
    },
    totOverheadCostPerPiece: function() {
        totOverheadCostPerPiece.set(totOverheadCost.get() / quantity.get());
        return totOverheadCostPerPiece.get();
    },
    totCostPerPiece: function() {
        totCostPerPiece.set(totMatCostPerPiece.get() + totLaborCostPerPiece.get() + totOverheadCostPerPiece.get());
        return totCostPerPiece.get();
    },
    profitPerPiece: function() {
        profitPerPiece.set(totCostPerPiece.get() / (1-targetProfitMargin.get()/100) * targetProfitMargin.get()/100);
        return profitPerPiece.get();
    },
    totProfitPerPiece: function() {
        totProfitPerPiece.set(profitPerPiece.get());
        return totProfitPerPiece.get();
    },
    totSalesPricePerPiece: function() {
        totSalesPricePerPiece.set(totCostPerPiece.get() + totProfitPerPiece.get());
        return totSalesPricePerPiece.get();
    },

    totPaperCostPerM2: function() {
        totPaperCostPerM2.set(totPaperCost.get() / totManufacturingArea.get());
        return totPaperCostPerM2.get();
    },
    totInkCostPerM2: function() {
        totInkCostPerM2.set(totInkCost.get() / totManufacturingArea.get());
        return totInkCostPerM2.get();
    },
    totMatCostPerM2: function() {
        totMatCostPerM2.set(totMatCost.get() / totManufacturingArea.get());
        return totMatCostPerM2.get();
    },
    totLaborCostPerM2: function() {
        totLaborCostPerM2.set(totLaborCost.get() / totManufacturingArea.get());
        return totLaborCostPerM2.get();
    },
    totOverheadCostPerM2: function() {
        totOverheadCostPerM2.set(totOverheadCost.get() / totManufacturingArea.get());
        return totOverheadCostPerM2.get();
    },
    totCostPerM2: function() {
        totCostPerM2.set(totMatCostPerM2.get() + totLaborCostPerM2.get() + totOverheadCostPerM2.get());
        return totCostPerM2.get();
    },
    profitPerM2: function() {
        profitPerM2.set(totCostPerM2.get() / (1-targetProfitMargin.get()/100) * targetProfitMargin.get()/100);
        return profitPerM2.get();
    },
    totProfitPerM2: function() {
        totProfitPerM2.set(profitPerM2.get());
        return totProfitPerM2.get();
    },
    totSalesPricePerM2: function() {
        totSalesPricePerM2.set(totCostPerM2.get() + totProfitPerM2.get());
        return totSalesPricePerM2.get();
    }

});