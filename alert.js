var alertQueue = [];
var alertPush = 0;
var alertPop = 0;
var alertCounter = 1;
var cachedAlertHtml = "";
var cachedConfirmHtml = "";
var isAlertBoxActive = false;

function AddToAlertQueue(modalId) {
    alertQueue[alertPush++] = modalId;
}

function ProcessAlertQueue() {
    if (alertPop < alertQueue.length) {        
        ShowAlertBox(alertQueue[alertPop++]);
    }
    else {
        SetAlertFlag(false);
        alertPop = 0;
        alertPush = 0;
        alertQueue.length = 0;
    }
}

function SetAlertFlag(flag) {
    isAlertBoxActive = flag;
}

function ShowAlertBox(modalId) {
    var backDrop = $(".modal-backdrop").length == 0 ? "static" : null;
    /*backDrop = static --> To disabled hiding the modal when user clicks on the gray overlay
    backDrop = null --> To not show the back drop overlay when one already exists*/
    $("#" + modalId).modal({
        keyboard: false, /*To disable hiding the modal using Escape key*/
        backdrop: backDrop
    });
    SetAlertFlag(true);
}
BootStrapAlert = {

    alert: function (msg, options) {
        var id = "alertBox_" + alertCounter++;
        var defaultAlertOptions =
		{
		    header: "&nbsp;",
		    buttonText: "Ok"
		};
        if (cachedAlertHtml === "") {
            cachedAlertHtml = "<div id='#ID#' class='modal hide fade' tabindex='-1' role='dialog' aria-labelledby='alertModalLabel' aria-hidden='true'>" +
								 	"<div class='modal-header'>" +
								 		"<h3 id='alertModalLabel'>#Header</h3>" +
							 		"</div>" +
							 		"<div class='modal-body'>" +
							 			"<p>#Message#</p>" +
						 			"</div>" +
						 			"<div class='modal-footer'>" +
						 				"<button class='btn btn-primary' modal-id='#ID#' id='btn#ID#' aria-hidden='true'>#ButtonText#</button>" +
					 				"</div>" +
				 				"</div>";
        }
        var mergedOptions = $.extend(true, {}, defaultAlertOptions, options);
        var html = cachedAlertHtml.replace("#Header", mergedOptions.header).replace("#Message#", msg).replace("#ButtonText#", mergedOptions.buttonText);
        html = html.replace(/#ID#/g, id);

        $("body").append(html);

        $("#btn" + id).click(function () {
            var modalId = $(this).attr("modal-id");
            $('#' + modalId).modal("hide");
            ProcessAlertQueue();
        });
        
        if (!isAlertBoxActive) {
            ShowAlertBox(id);            
        }
        else
            AddToAlertQueue(id);
    },

    confirm: function (msg, options, cb) {
        var id = "confirm_" + alertCounter++;

        var defaultConfirmOptions =
		{
		    header: "Confirm",
		    buttonOkText: "OK",
		    buttonCancelText: "Cancel"
		};
        
        if (cachedConfirmHtml === "") {
            cachedConfirmHtml = "<div id='#ID#' class='modal hide fade confirmation-modal' tabindex='-1' role='dialog' aria-labelledby='confirmModalLabel' aria-hidden='true'>" +
								 	"<div class='modal-header'>" +
								 		"<h3 id='confirmModalLabel'>#Header</h3>" +
							 		"</div>" +
							 		"<div class='modal-body'>" +
							 			"<p>#Message#</p>" +
						 			"</div>" +
						 			"<div class='modal-footer'>" +
						 				"<button class='confirm-action btn btn-primary' modal-id='#ID#' data-action='ok' style='width:72px;'>#ButtonOkText#</button>" +
						 				"<button class='confirm-action btn' modal-id='#ID#' aria-hidden='true' data-action='cancel' width:72px;>#ButtonCancelText#</button>" +
					 				"</div>" +
				 				"</div>";
        }

        var mergedOptions = $.extend(true, {}, defaultConfirmOptions, options);
        var html = cachedConfirmHtml.replace("#Header", mergedOptions.header).replace("#Message#", msg).replace("#ButtonOkText#", mergedOptions.buttonOkText).replace("#ButtonCancelText#", mergedOptions.buttonCancelText);
        html = html.replace(/#ID#/g, id);

        $("body").append(html);

        $(".confirm-action").click(function () {
            var modalId = $(this).attr("modal-id");
            $('#' + modalId).modal("hide");
            if (cb) {
                var action = $(this).attr("data-action") == "ok" ? true : false;
                cb(action,options);
            }
            ProcessAlertQueue();
        });

        if (!isAlertBoxActive) {
            ShowAlertBox(id);
        }
        else
            AddToAlertQueue(id);
    }
};

function alert(msg) {
    BootStrapAlert.alert(msg, { header: "Alert" });
}

function confirm(msg,options,cb) {
    BootStrapAlert.confirm(msg, { header: "Confirmation", ele: options.ele, functions: options.functions , misc : options.misc }, cb);
}