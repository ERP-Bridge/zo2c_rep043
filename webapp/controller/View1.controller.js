sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
], function (Controller, JSONModel, Filter, FilterOperator, MessageToast) {
    "use strict";

    return Controller.extend("zo2c_rep043.controller.View1", {

        onInit: function () {
            var oCustomerFilterModel = new JSONModel({
                selectedCustomerKey: "BE_JNJ",
                customers: [
    {
        key: "BE_JNJ",
        text: "Johnson & Johnson Innovative Medicine - Belgium"
    },
    {
        key: "BE_MEDILINK",
        text: "MediLink Belgium Services - Belgium"
    },
    {
        key: "IT_FRESHBITE",
        text: "FreshBite Foods Italy - Italy"
    },
    {
        key: "IT_VERDURA",
        text: "Verdura Foods Italy - Italy"
    }
]
            });

            this.getView().setModel(oCustomerFilterModel, "customerFilterModel");

            this.getView().addEventDelegate({
                onAfterShow: function () {
                    this._applyCustomerFilter();
                }.bind(this)
            });
        },

        onCustomerFilterChange: function () {
            this._applyCustomerFilter();

            var oTable = this.byId("quotationTable");
            var oCreateButton = this.byId("view1CreateSalesOrderButton");

            oTable.removeSelections(true);
            oCreateButton.setEnabled(false);
        },

        _applyCustomerFilter: function () {
            var oTable = this.byId("quotationTable");
            var oBinding = oTable.getBinding("items");
            var sSelectedCustomerKey = this.getView()
                .getModel("customerFilterModel")
                .getProperty("/selectedCustomerKey");

            if (!oBinding || !sSelectedCustomerKey) {
                return;
            }

            oBinding.filter([
                new Filter("customerKey", FilterOperator.EQ, sSelectedCustomerKey)
            ]);
        },

        onQuotationSelectionChange: function () {
            var oTable = this.byId("quotationTable");
            var aSelectedItems = oTable.getSelectedItems();
            var oCreateButton = this.byId("view1CreateSalesOrderButton");

            oCreateButton.setEnabled(aSelectedItems.length === 1);
        },

        onCreateSalesOrder: function () {
            var oTable = this.byId("quotationTable");
            var aSelectedItems = oTable.getSelectedItems();

            if (aSelectedItems.length === 0) {
                MessageToast.show("Please select one quotation first.");
                return;
            }

            if (aSelectedItems.length > 1) {
                MessageToast.show("Please select only one quotation to create sales order.");
                return;
            }

            var oSelectedItem = aSelectedItems[0];
            var oContext = oSelectedItem.getBindingContext("quotationModel");

            if (!oContext) {
                MessageToast.show("Selected quotation data not found.");
                return;
            }

            var sQuotation = oContext.getProperty("qNumber");

            if (!sQuotation) {
                MessageToast.show("Quotation number not found.");
                return;
            }

            this.getOwnerComponent()
                .getRouter()
                .navTo("RouteSalesOrder", {
                    qNumber: sQuotation
                });
        },

        formatApprovalStatusState: function (sStatus) {
            switch (sStatus) {
                case "Approved":
                    return "Success";
                case "Rejected":
                    return "Warning";
                case "Customer Rejected":
                    return "Error";
                case "Customer Review":
                    return "Information";
                case "Sales Order":
                    return "Information";
                case "Draft":
                default:
                    return "None";
            }
        },

        formatApprovalStatusIcon: function (sStatus) {
            switch (sStatus) {
                case "Approved":
                    return "sap-icon://accept";
                case "Rejected":
                    return "sap-icon://alert";
                case "Customer Rejected":
                    return "sap-icon://decline";
                case "Customer Review":
                    return "sap-icon://information";
                case "Sales Order":
                    return "sap-icon://information";
                case "Draft":
                default:
                    return "";
            }
        }

    });
});