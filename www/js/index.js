var platform, ratingTimerId;

var MAX_DIALOG_WAIT_TIME_IOS = 5*1000; //max time to wait for rating dialog to display on iOS
var MAX_DIALOG_WAIT_TIME_ANDROID = 60*1000; //max time to wait for rating dialog to display on Android and be submitted by user

function init(){
    platform = navigator.userAgent.match('Android') ? "android" : "ios";
    $('body').addClass(platform);
    $('#launchreview').on("click", launchreview);
    $('#launchrating').on("click", launchrating);
    $('#isRatingSupported').on("click", isRatingSupported);
}

function clearRatingDialogTimer(){
    if(ratingTimerId){
        clearTimeout(ratingTimerId);
        ratingTimerId = null;
    }
}

function showAlert(msg){
    clearRatingDialogTimer();
    hidePreloader();
    navigator.notification.alert(msg);
}

function launchreview(){
    LaunchReview.launch(function (){
        showAlert("Successfully launched review app");
    }, function (err){
        showAlert("Error launching review app: " + err);
    });
}

function launchrating(){
    if(cordova.platformId === "android"){
        ratingTimerId = setTimeout(ratingDialogNotShown, MAX_DIALOG_WAIT_TIME_ANDROID);
    }

    // Request the rating dialog
    LaunchReview.rating(function(status){
        if(status === "requested"){
            if(cordova.platformId === "android"){
                showAlert("Displayed rating dialog");
            }else if(cordova.platformId === "ios"){
                console.log("Requested rating dialog");
                ratingTimerId = setTimeout(ratingDialogNotShown, MAX_DIALOG_WAIT_TIME_IOS);
                showPreloader();
            }
        }else if(status === "shown"){
            showAlert("Rating dialog displayed");
        }else if(status === "dismissed"){
            showAlert("Rating dialog dismissed");
        }
    }, function (err){
        showAlert("Error launching rating dialog: " + err);
    });
}

function isRatingSupported(){
    var supported = LaunchReview.isRatingSupported();
    showAlert("Rating dialog supported: " + (supported ? "YES" : "NO"));
}

function ratingDialogNotShown(){
    var msg;
    if(cordova.platformId === "android"){
        msg = "Rating dialog outcome not received (after " + MAX_DIALOG_WAIT_TIME_ANDROID + "ms)";
    }else if(cordova.platformId === "ios"){
        msg = "Rating dialog was not shown (after " + MAX_DIALOG_WAIT_TIME_IOS + "ms)";
    }
    console.warn(msg);
    showAlert(msg);
}

function showPreloader(){
    $('#preloader').show();
}

function hidePreloader(){
    $('#preloader').hide();
}

$(document).on("deviceready", init);
