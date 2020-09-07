var platform, ratingTimerId;

var MAX_DIALOG_WAIT_TIME = 5000; //max time to wait for rating to display

function init(){
    platform = navigator.userAgent.match('Android') ? "android" : "ios";
    $('body').addClass(platform);
    $('#launchreview').on("click", launchreview);
    $('#launchrating').on("click", launchrating);
    $('#isRatingSupported').on("click", isRatingSupported);
}

function showAlert(msg){
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
    LaunchReview.rating(function(status){
        if(cordova.platformId === "android"){
            showAlert("Rating dialog displayed");
        }else if(cordova.platformId === "ios"){
            if(status === "requested"){
                console.log("Requested rating dialog");
                ratingTimerId = setTimeout(ratingDialogNotShown, MAX_DIALOG_WAIT_TIME);
                showPreloader();
            }else if(status === "shown"){
                clearTimeout(ratingTimerId);
                hidePreloader();
                showAlert("Rating dialog displayed");
            }else if(status === "dismissed"){
                showAlert("Rating dialog dismissed");
            }
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
    hidePreloader();
    var msg = "Rating dialog was not shown (after " + MAX_DIALOG_WAIT_TIME + "ms)";
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
