//no rules currently
'use strict';


chrome.runtime.onInstalled.addListener(function() {
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


});


chrome.alarms.onAlarm.addListener(function(alarm) {

  let tempCurrentTime = new Date(Date.now() - (5*60000));
  let alarmTime = new Date(alarm.scheduledTime);
  let todayDay =tempCurrentTime.getDay();

  if(todayDay != 0 && todayDay != 6){
    if(alarmTime.getTime() > tempCurrentTime.getTime()){

      chrome.storage.sync.set({}, function (obj) {
        let periodNum = (parseInt(alarm.name.substring(3), 16));
        let notificationOptions = {
            type: 'basic',
            iconUrl: 'images/OnlineOnTimeIcon534.png',
            title: "Period " + periodNum,
            message: 'You have class soon! Wake up, dude!',
            requireInteraction: true
        }
        chrome.notifications.create(alarm.name, notificationOptions);
      });

    }
  }

  chrome.alarms.getAll(function(a){ 
  
    if(a.length == 0){
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

        // console.log("last alarm called, making new alarms here for " + day + "day");
        let list = (day == "Mon" ? obj.Mon : day=="Tues" ? obj.Tues: day == "Wednes" ? obj.Wednes: day == "Thurs" ? obj.Thurs:obj.Fri);
        let dayList = Array.from(list);

        for(let i = 0; i < dayList.length; i++){
            let tempString = day + parseInt(dayList[i].substring(dayList[i].length-1), 16);
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

        chrome.alarms.getAll(function(a){ 
          // console.log(a)
        });

      });


    }
  });



});
