var platform, ratingTimerId;

var MAX_DIALOG_WAIT_TIME = 5000; //max time to wait for rating to display

var APP_ID = {
    "android": "com.google.android.apps.maps",
    "ios": "585027354",
    "windows": "9wzdncrdc73c"
};

function init(){
    platform = device.platform.toLowerCase();
    if(platform.match(/win/)){
        platform = "windows";
    }
    $('body').addClass(platform);
    $('#launchreview').on("touchstart", launchreview);
    $('#launchrating').on("touchstart", launchrating);
    $('#isRatingSupported').on("touchstart", isRatingSupported);
}

function launchreview(){
    LaunchReview.launch(APP_ID[platform], function (){
        alert("Successfully launched review app");
    }, function (err){
        alert("Error launching review app: " + err);
    });
}

function launchrating(){
    LaunchReview.rating(function(status){
        if(status === "requested"){
            console.log("Requested rating dialog");
            ratingTimerId = setTimeout(ratingDialogNotShown, MAX_DIALOG_WAIT_TIME);
            showPreloader();
        }else{
            clearTimeout(ratingTimerId);
            hidePreloader();
            alert("Successfully displayed rating dialog");
        }
    }, function (err){
        alert("Error launching rating dialog: " + err);
    });
}

function isRatingSupported(){
    var supported = LaunchReview.isRatingSupported();
    alert("Rating dialog supported: " + (supported ? "YES" : "NO"));
}

function ratingDialogNotShown(){
    hidePreloader();
    var msg = "Rating dialog was not shown (after " + MAX_DIALOG_WAIT_TIME + "ms)";
    console.warn(msg);
    alert(msg);
}

function showPreloader(){
    $('#preloader').show();
}

function hidePreloader(){
    $('#preloader').hide();
}


$(document).on("deviceready", init);
