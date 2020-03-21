let todayTable = document.getElementById("todayTable");
let weekTable = document.getElementById("weekTable");
let today = document.getElementById("today");

let d = new Date();
let daysOfWeek = ['Mon', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Mon']
let dayNum = d.getDay();
let day = daysOfWeek[d.getDay()];

let currentTime = "" + d.getHours() + ":" + (d.getMinutes()+10) + ":" + d.getSeconds();

today.innerHTML = day + "day's";

chrome.storage.sync.get({
    periodNumbers: [],
    periodNames: [],
    periodAlarms: [],
    periodLength: [],
    Mon: [],
    Tues: [],
    Wednes: [],
    Thurs: [],
    Fri: [],
}, function extensionClicked(obj) {

    drawWeekSchedule(obj);   
    drawTodaySchedule(obj); 

    let testTime = new Date(d.getFullYear(), d.getMonth(), d.getDay(), 17, 43, "0", "0");


    chrome.alarms.getAll(function(a){
        outOfDate(a, obj);
        chrome.alarms.getAll(function(a){ console.log(a)});
    });

    chrome.storage.sync.set(obj);
});


chrome.alarms.onAlarm.addListener(function(alarm) {
    alert("Beep");
    console.log("alarm alarm alarm")
  });


// const title = 'Sound Notification';
// const options = {
//   sound: '/demos/notification-examples/audio/notification-sound.mp3'
// };
// registration.showNotification(title, options);