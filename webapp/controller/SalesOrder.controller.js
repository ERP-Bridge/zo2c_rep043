sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/VBox",
    "sap/m/MessageToast"
], function (Controller, JSONModel, Dialog, Button, Text, VBox, MessageToast) {
    "use strict";

    return Controller.extend("zo2c_rep043.controller.SalesOrder", {

        onInit: function () {
            this._bSalesOrderSaved = false;

            var oUiModel = new JSONModel({
                customerDetailsVisible: true,
                serviceDetailsVisible: true,
                attachmentsVisible: true
            });

            this.getView().setModel(oUiModel, "uiModel");

            var oRouter = this.getOwnerComponent().getRouter();

            oRouter.getRoute("RouteSalesOrder")
                .attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            this._bSalesOrderSaved = false;

            var sQuotation = oEvent.getParameter("arguments").qNumber;
            var oModel = this.getOwnerComponent().getModel("quotationModel");

            if (!oModel) {
                return;
            }

            var aData = oModel.getProperty("/quotations") || [];

            var oSelected = aData.find(function (oRow) {
                return oRow.qNumber === sQuotation;
            });

            var oJSON = new JSONModel(oSelected || {});
            this.getView().setModel(oJSON, "selectedQuotation");
        },

        onToggleCustomerDetails: function () {
            this._toggleVisibility("/customerDetailsVisible");
        },

        onToggleServiceDetails: function () {
            this._toggleVisibility("/serviceDetailsVisible");
        },

        onToggleAttachments: function () {
            this._toggleVisibility("/attachmentsVisible");
        },

        _toggleVisibility: function (sPath) {
            var oUiModel = this.getView().getModel("uiModel");
            var bCurrentValue = oUiModel.getProperty(sPath);

            oUiModel.setProperty(sPath, !bCurrentValue);
        },

        formatEyeIcon: function (bVisible) {
            return bVisible ? "sap-icon://hide" : "sap-icon://show";
        },

        onSave: function () {
            this._bSalesOrderSaved = true;
            MessageToast.show("Sales order saved successfully.");
        },

        onConfirmSalesOrder: function () {
            if (!this._oConfirmSalesOrderDialog) {
                this._oConfirmSalesOrderDialog = new Dialog({
                    title: "Confirm Sales Order",
                    contentWidth: "24rem",
                    draggable: false,
                    resizable: false,
                    stretch: false,
                    content: [
                        new VBox({
                            width: "100%",
                            items: [
                                new Text({
                                    width: "100%",
                                    text: "The document will be editable until the request for billing. You can take time to review the document before publishing the order."
                                }).addStyleClass("figmaDialogText")
                            ]
                        }).addStyleClass("figmaDialogContent")
                    ],
                    buttons: [
                        new Button({
                            text: "Cancel",
                            type: "Transparent",
                            press: function () {
                                this._oConfirmSalesOrderDialog.close();
                            }.bind(this)
                        }),
                        new Button({
                            text: "Confirm Order",
                            type: "Emphasized",
                            press: function () {
                                this._bSalesOrderSaved = true;
                                this._oConfirmSalesOrderDialog.close();
                                MessageToast.show("Sales order confirmed.");
                            }.bind(this)
                        })
                    ],
                    afterClose: function () {
                        this._removeBlackOverlayClass();
                    }.bind(this)
                });

                this._oConfirmSalesOrderDialog.addStyleClass("figmaDialog");
                this.getView().addDependent(this._oConfirmSalesOrderDialog);
            }

            this._addBlackOverlayClass();
            this._oConfirmSalesOrderDialog.open();
        },

        onNavBack: function () {
            if (this._bSalesOrderSaved) {
                this._goBackToQuotationList();
                return;
            }

            this._openUnsavedChangesDialog();
        },

        _openUnsavedChangesDialog: function () {
            if (!this._oUnsavedChangesDialog) {
                this._oUnsavedChangesDialog = new Dialog({
                    title: "Return to previous screen ?",
                    contentWidth: "24rem",
                    draggable: false,
                    resizable: false,
                    stretch: false,
                    content: [
                        new VBox({
                            width: "100%",
                            items: [
                                new Text({
                                    width: "100%",
                                    text: "If you return to previous screen without saving data, you will loose the information entered for this document."
                                }).addStyleClass("figmaDialogText")
                            ]
                        }).addStyleClass("figmaDialogContent")
                    ],
                    buttons: [
                        new Button({
                            text: "Cancel",
                            type: "Transparent",
                            press: function () {
                                this._oUnsavedChangesDialog.close();
                            }.bind(this)
                        }),
                        new Button({
                            text: "Discard and leave",
                            type: "Transparent",
                            press: function () {
                                this._oUnsavedChangesDialog.close();
                                this._goBackToQuotationList();
                            }.bind(this)
                        }),
                        new Button({
                            text: "Save and leave",
                            type: "Emphasized",
                            press: function () {
                                this._bSalesOrderSaved = true;
                                this._oUnsavedChangesDialog.close();
                                MessageToast.show("Sales order saved successfully.");
                                this._goBackToQuotationList();
                            }.bind(this)
                        })
                    ],
                    afterClose: function () {
                        this._removeBlackOverlayClass();
                    }.bind(this)
                });

                this._oUnsavedChangesDialog.addStyleClass("figmaDialog");
                this.getView().addDependent(this._oUnsavedChangesDialog);
            }

            this._addBlackOverlayClass();
            this._oUnsavedChangesDialog.open();
        },

        _addBlackOverlayClass: function () {
            document.body.classList.add("blackDialogOverlayActive");
        },

        _removeBlackOverlayClass: function () {
            document.body.classList.remove("blackDialogOverlayActive");
        },

        _goBackToQuotationList: function () {
            this.getOwnerComponent()
                .getRouter()
                .navTo("RouteView1");
        }

    });
});