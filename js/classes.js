//disable enter key
window.addEventListener('keydown',function(e){if(e.keyIdentifier=='U+000A'||e.keyIdentifier=='Enter'||e.keyCode==13){if(e.target.nodeName=='INPUT'&&e.target.type=='text'){e.preventDefault();return false;}}},true);

let todayTable = document.getElementById("todayTable");
let weekTable = document.getElementById("weekTable");
let today = document.getElementById("today");

let d = new Date();
let daysOfWeek = ['Mon', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Mon']
let dayNum = d.getDay();
let day = daysOfWeek[d.getDay()];

let currentHour = d.getHours();

if(currentHour <= 9){
    currentHour = "0" + currentHour;
}

let currentTime = "" + currentHour + ":" + (d.getMinutes()) + ":" + d.getSeconds();

today.innerHTML = day + "day's";


chrome.storage.sync.get({
    periodNumbers: [],
    periodNames: [],
    periodAlarms: [],
    periodLength: [],
    passingLength: [],
    Mon: [],
    Tues: [],
    Wednes: [],
    Thurs: [],
    Fri: [],
}, function extensionClicked(obj) {
    
    drawWeekSchedule(obj);   
    drawTodaySchedule(obj); 

    chrome.alarms.getAll(function(a){
        // console.log(a);
        outOfDate(a, obj);
        chrome.alarms.getAll(function(a){ 
            // console.log(a);
            for(let i = 0; i < a.length; i++){
                let date = new Date(a[i].scheduledTime);
                console.log(a[i].name + " : " + (date.getMonth()+1) + "/" + date.getDate() + ", " + date.getHours() + ":" + date.getMinutes());
            }
        });
    });

    chrome.storage.sync.set(obj, function(){});
});




let alarmTime = document.getElementById("alarmTime");
let notifyTime = document.getElementById("notifyTime");
notifyTime.innerHTML = alarmTime.value;

alarmTime.oninput = function() {
    notifyTime.innerHTML = this.value;
}

notifyTime2.innerHTML = alarmTime.value;

alarmTime2.oninput = function() {
    notifyTime2.innerHTML = this.value;
}

function update(){
    chrome.storage.sync.get({
        periodNumbers: [],
        periodNames: [],
        periodAlarms: [],
        periodLength: [],
        passingLength: [],
        Mon: [],
        Tues: [],
        Wednes: [],
        Thurs: [],
        Fri: [],
    }, function extensionClicked(obj) {

        todayTable.innerHTML = "<tr><th>Time</th><th colspan='2' style='text-align: left;'>Period</th> </tr>";
        weekTable.innerHTML = "<colgroup><col id='Mon' /><col id='Tues'/><col id='Wednes' /><col id='Thurs'/><col id='Fri' />"
        + "</colgroup><tr style='background-color: lightblue;'><th>Mon</th><th>Tue</th> <th>Wed</th><th>Thu</th> <th>Fri</th></tr>";

        drawWeekSchedule(obj);   
        drawTodaySchedule(obj); 
    
        chrome.alarms.getAll(function(a){
            // console.log(a);
            outOfDate(a, obj);
            chrome.alarms.getAll(function(a){ 
                // console.log(a);
                for(let i = 0; i < a.length; i++){
                    let date = new Date(a[i].scheduledTime);
                    console.log(a[i].name + " : " + (date.getMonth()+1) + "/" + date.getDate() + ", " + date.getHours() + ":" + date.getMinutes());
                }
            });
        });
    
        chrome.storage.sync.set(obj, function(){});
    });
    
}