var platform;

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
    LaunchReview.rating(function (){
        alert("Successfully launched rating dialog");
    }, function (err){
        alert("Error launching rating dialog: " + err);
    });
}

function isRatingSupported(){
    var supported = LaunchReview.isRatingSupported();
    alert("Rating dialog supported: " + (supported ? "YES" : "NO"));
}



$(document).on("deviceready", init);