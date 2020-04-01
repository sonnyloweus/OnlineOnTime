//no rules currently
'use strict';

// caledar[x][0][0] = monday of the certain week
let calendar = 
[
    [
        ["3/30"],
        ["8:15am8", "9:30am1", "10:45am2", "11:55am9", "12:30am3", "1:45pm4"],
        ["8:15am8", "9:30am5", "10:45am6", "11:55am9", "12:30am7"],
        ["8:15am8", "9:30am1", "10:45am2", "11:55am9", "12:30am3", "1:45pm4"],
        ["8:15am8", "9:30am5", "10:45am6", "11:55am9", "12:30am7"],
        ["8:15am8", "9:30am1", "10:45am2", "11:55am9", "12:30am3", "1:45pm4"]
    ],

    [
        ["4/6"],
        ["8:15am8", "9:30am5", "10:45am6","11:55am9", "12:30am7"],
        ["8:15am8", "9:30am1", "10:45am2","11:55am9", "12:30am3", "1:45pm4"],
        ["8:15am8", "9:30am5", "10:45am6","11:55am9", "12:30am7"],
        ["8:15am8", "9:30am1", "10:45am2","11:55am9", "12:30am3", "1:45pm4"],
        ["8:15am8", "9:30am5", "10:45am6","11:55am9", "12:30am7"]
    ],

    [
        ["4/13"],
        ["8:15am8", "9:30am1", "10:45am2", "11:55am9", "12:30am3", "1:45pm4"],
        ["8:15am8", "9:30am5", "10:45am6", "11:55am9", "12:30am7"],
        ["8:15am8", "9:30am1", "10:45am2", "11:55am9", "12:30am3", "1:45pm4"],
        ["8:15am8", "9:30am5", "10:45am6", "11:55am9", "12:30am7"],
        ["8:15am8", "9:30am1", "10:45am2", "11:55am9", "12:30am3", "1:45pm4"]
    ]

]

function setToMonday() {
  // getting the monday, saturday and sunday count as next monday
  let setDate = new Date();
  let tempDay = setDate.getDay();  

  let diff = 0;

  if(tempDay == 0){
    diff = 1;
  }else if(tempDay == 6){
    diff = 2;
  }else{
    diff = (1 - tempDay);
  }

  setDate.setDate(setDate.getDate() + diff); 
  return (setDate.getMonth()+1) + "/" + setDate.getDate();
}  


chrome.runtime.onInstalled.addListener(function(details) {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {
          hostContains:''
        },
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });

  if(details.reason == "install" || details.reason == "update"){

    chrome.storage.sync.get({
      calendar: []
    }, function(obj){

      let thisWeek = setToMonday();
      for (let i=0; i<calendar.length; i++) {
        if(calendar[i][0][0] == thisWeek){
          obj.calendar = calendar[i];
          break;
        }
      }

      chrome.storage.sync.set(obj);
    });

    let n = new Date();
    let nNum = n.getDay();

    //how many days the next saturday is away
    let saturdayAhead = 6 - nNum;
    if(saturdayAhead == 0){
      saturdayAhead = 7;
    }

    n.setDate(n.getDate() + saturdayAhead); 
    n.setHours(18);
    n.setMinutes(30);

    // console.log(n.getMonth() + "/" + n.getDate());
    // console.log(n.getHours() + ":" + n.getMinutes());

    chrome.alarms.create("Update", {
      when: n.getTime(),
    });
  
  }

});

function alarmUpdate(obj, day, d){
  // console.log("last alarm called, making new alarms here for " + day + "day");
  let list = (day == "Mon" ? obj.Mon : day=="Tues" ? obj.Tues: day == "Wednes" ? obj.Wednes: day == "Thurs" ? obj.Thurs:obj.Fri);
  let dayList = Array.from(list);

  for(let i = 0; i < dayList.length; i++){
    let tempString = i + day + dayList[i].substring(dayList[i].length-1);
    // 00:00xxx
    let hour = dayList[i].substring(0, dayList[i].length-6);

    let periodTime = dayList[i].substring(0, dayList[i].length-1);
    let pmOrAm = periodTime.substring(periodTime.length -2);
    if(pmOrAm == "pm" && hour != 12){
        hour = parseInt(hour) + 12;
    }

    let notify =  parseInt( obj.periodAlarms[ parseInt(dayList[i].substring(dayList[i].length-1 )-1)]  );
    let minute = parseInt((dayList[i].substring(dayList[i].length-5, dayList[i].length-3))) ;

    // console.log( d.getFullYear() + ", " + d.getMonth() + ", " + d.getDate() + ", " + hour + ", " + minute + ", " + "0" + ", " +  "0" );
    let temp = new Date(d.getFullYear(), d.getMonth(), (parseInt(d.getDate())+1), hour, minute, "0", "0");
    let alarmTime = new Date(temp.getTime() - (notify*60000));

    chrome.alarms.create(tempString, {
        when: alarmTime.getTime(),
    });
  }
}

chrome.alarms.onAlarm.addListener(function(alarm) {

  if(alarm.name != "Update"){

    let tempCurrentTime = new Date(Date.now() - (1*60000));
    let alarmTime = new Date(alarm.scheduledTime);
    let todayDay =tempCurrentTime.getDay();

    if(todayDay != 0 && todayDay != 6){
      if(alarmTime.getTime() > tempCurrentTime.getTime()){

        chrome.storage.sync.get({
          periodNames: [],
          periodAlarms: []
        }, function (obj) {
          let periodNum = (parseInt(alarm.name.substring(alarm.name.length-1), 16));
          let periodName = obj.periodNames[periodNum - 1];
          let alarmDelay = parseInt(obj.periodAlarms[periodNum - 1]);
          let amOrpm = "am";
          alarmTime.setMinutes(alarmTime.getMinutes() + alarmDelay);
          let minute = alarmTime.getMinutes();
          if(minute <= 9){
            minute = "0" + minute;
          }

          let hour = alarmTime.getHours();
          if(hour >= 12){
            amOrpm = "pm";
          }
          if(hour >= 13){
            hour -= 12;
          }

          let startTime = hour +":"+ minute + amOrpm;

          let notificationOptions = {
              type: 'basic',
              iconUrl: 'images/OnlineOnTimeIcon534.png',
              title: "Period " + periodNum + " " + periodName,
              message: 'You have class at ' + startTime + ' ! Wake up, dude!',
              requireInteraction: true
          }
          chrome.notifications.create(alarm.name, notificationOptions);
        });

      }
    }

    chrome.alarms.getAll(function(a){ 
    
      if(a.length == 1){
        let d = new Date();
        let dayNames = ['Mon', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Mon']
        let dayNameNum = parseInt(d.getDay()) + 1;
        if(dayNameNum >= dayNames.length){
          dayNameNum = 0;
        }
        let day = dayNames[dayNameNum];

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
          Fri: []
        }, function alarmsOut(obj) {

          alarmUpdate(obj, day, d);

          chrome.alarms.getAll(function(a){ 
            // console.log(a)
          });

        });


      }
    });
  }else if (alarm.name == "Update"){
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
      calendar: []
    }, function(obj){

      let d = new Date();
      let dayNames = ['Mon', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Mon']
      let dayNameNum = parseInt(d.getDay()) + 1;
      if(dayNameNum >= dayNames.length){
        dayNameNum = 0;
      }
      let day = dayNames[dayNameNum];

      console.log("updating calendar")
      chrome.alarms.clearAll();

      alarmUpdate(obj, day, d);

      let thisWeek = setToMonday();
      for (let i=0; i<calendar.length; i++) {
        if(calendar[i][0][0] == thisWeek){
          obj.calendar = calendar[i];
          break;
        }
      }

      let g = new Date();

      g.setDate(g.getDate() + 7); 
      g.setHours(0);
      g.setMinutes(1);

      chrome.alarms.create("Update", {
        when: g.getTime(),
      });

      chrome.storage.sync.set(obj);
    });

  }



});
