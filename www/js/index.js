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
    $('#launchreview').on("touchstart", launchreview);
}

function launchreview(){
    LaunchReview.launch(APP_ID[platform], success);
}

function success(){
    alert("Successfully launched review app");
}

$(document).on("deviceready", init);