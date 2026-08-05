sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("zo2c_rep043.controller.View1", {

        onInit: function () {
            var oModel = this.getView().getModel("quotationModel");
            console.log("Model:", oModel);
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