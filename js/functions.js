function makePeriodsArray(obj){

    let periodNames = Array.from(obj.periodNames);
    let periodNumbers = Array.from(obj.periodNumbers);
    let periodAlarms = Array.from(obj.periodAlarms);
    let periodLength = Array.from(obj.periodLength);
    let passingLength = Array.from(obj.passingLength);


    if(periodNumbers.length == 0){
        //initialize with 7 periods
        for(let i = 0; i < 7; i++){
            periodNumbers[i] = i+1;
            periodNames[i] = "Subject " + (i+1);
            periodLength[i] = "50";
            periodAlarms[i] = "5";
            passingLength[i] = "10";
        }
    }
    
    let periods = new Array(periodNames.length);

    for (let i = 0; i < periods.length; i++) {
        periods[i] = new Array(5);
    }

    // each period has: period number, period name, length, alarmTime, passingLength
    for(let i = 0; i < periodNames.length; i++){
        periods[i][0] = periodNumbers[i];
        periods[i][1] = periodNames[i];
        periods[i][2] = periodLength[i];
        periods[i][3] = periodAlarms[i];
        periods[i][4] = passingLength[i];
    }

    obj.periodNames = periodNames;
    obj.periodNumbers = periodNumbers;
    obj.periodAlarms = periodAlarms;
    obj.periodLength = periodLength;
    obj.passingLength = passingLength;

    chrome.storage.sync.set(obj);

    return periods;
}

function drawTodaySchedule(obj){
    let periods = makePeriodsArray(obj);

    let list = (day == "Mon" ? obj.Mon : day=="Tues" ? obj.Tues: day == "Wednes" ? obj.Wednes: day == "Thurs" ? obj.Thurs:obj.Fri);
    let dayList = Array.from(list);
    let previous = false;
    // each period has: period number, period name, length, alarmTime, passingLength
    for(let i = 0; i < dayList.length; i++ ){
        let periodNum = dayList[i].substring(dayList[i].length-1);
        let periodTime = dayList[i].substring(0, dayList[i].length-1);
        let timeOnly = dayList[i].substring(0, dayList[i].length-3);
        let pmOrAm = dayList[i].substring(dayList[i].length-3, dayList[i].length-1);

        let periodLength = periods[periodNum-1][2];
        let passingLength = periods[periodNum-1][4];

        let e = new Date(d.getTime() - ((parseInt(periodLength) + parseInt(passingLength))*60000));

        let hour = timeOnly.substring(0, timeOnly.length-3);
        if(pmOrAm == "pm" && hour != "12"){
            hour = parseInt(hour) + 12;
        }
        if(hour <= 9){
            hour = "0" + hour;
        }

        let tempTime = hour + ":" + timeOnly.substring(timeOnly.length-2) + ":00";

        let eMin = e.getMinutes();
        if(eMin < 10){
            eMin = "0" + eMin;
        }
        let eHour = e.getHours();
        if(eHour < 10){
            eHour = "0" + eHour;
        }
        e = (eHour + ":" + eMin + ":" + e.getSeconds());

        if( currentTime >= tempTime && e <=  tempTime){
            // console.log(currentTime + " / " + tempTime + " / " + e);
            todayTable.innerHTML = todayTable.innerHTML + 
            //start time, period num, period name
                "<tr style='background-color: lightblue'> <td>" + periodTime + "</td>  <td>" + periodNum + "</td>  <td>" + periods[periodNum-1][1] + "</td> </tr>"
            ;
            previous = true;
        }else if(previous){
            previous = false;
            todayTable.innerHTML = todayTable.innerHTML + 
            //start time, period num, period name
                "<tr style='background-color: rgb(224, 237, 241)'> <td>" + periodTime + "</td>  <td>" + periodNum + "</td>  <td>" + periods[periodNum-1][1] + "</td> </tr>"
            ;
        }else{
            // console.log(currentTime + " / " + tempTime + " / " + e);
            todayTable.innerHTML = todayTable.innerHTML + 
            //start time, period num, period name
                "<tr> <td>" + periodTime + "</td>  <td>" + periodNum + "</td>  <td>" + periods[periodNum-1][1] + "</td> </tr>"
            ;
        }

    }
}

let defaultWeek = [
    ["8:15am1", "9:15am2", "10:20am3", "11:20am4", "12:55pm5", "1:55pm6"],
    ["8:15am1", "9:15am7", "10:20am2", "11:20am3", "12:55pm4", "1:55pm5"],
    ["9:20am1", "10:30am6", "11:30am7", "1:00pm2", "2:00pm3"],
    ["8:15am1", "9:15am4", "10:20am5", "11:20am6", "12:55pm7", "1:55pm2"],
    ["8:15am3", "9:15am4", "10:15am5", "11:30am6", "12:30pm7"]
];

function initializeDay(obj, theDay){
    let defaultNum = (theDay == "Mon" ? 0 : theDay=="Tues" ?1: theDay == "Wednes" ?2: theDay == "Thurs" ?3:4);
    let tempList = defaultWeek[defaultNum];

    if(obj.Mon.length == 0){
        obj.Mon = tempList;
    }else if(obj.Tues.length == 0){
        obj.Tues = tempList;
    }else if(obj.Wednes.length == 0){
        obj.Wednes = tempList;
    }else if(obj.Thurs.length == 0){
        obj.Thurs = tempList;
    }else {
        obj.Fri = tempList;
    }
    chrome.storage.sync.set(obj);
}

function drawWeekSchedule(obj){
    let periods = makePeriodsArray(obj);

    let todayColumn = document.getElementById(day);
    todayColumn.style.backgroundColor = "lightblue";
    todayColumn.style.border = "3px solid lightblue";

    let mostPeriods = 0;
    //check each day
    for(let i = 0; i < 5; i++){
        mostPeriods = Math.max(defaultWeek[i].length, mostPeriods);
    }

    //for each period or row
    for(let i = 0; i < mostPeriods; i++){
        weekTable.innerHTML = weekTable.innerHTML + "<tr>";

        let htmlString = "";
        //for each day of week or column
        for(let n = 1; n < 6; n++){
            let theDay = daysOfWeek[n];
            let list = (theDay == "Mon" ? obj.Mon : theDay=="Tues" ? obj.Tues: theDay == "Wednes" ? obj.Wednes: theDay == "Thurs" ? obj.Thurs:obj.Fri);
            let dayList = Array.from(list);

            if(dayList.length == 0){
                initializeDay(obj, theDay);
                list = (theDay == "Mon" ? obj.Mon : theDay=="Tues" ? obj.Tues: theDay == "Wednes" ? obj.Wednes: theDay == "Thurs" ? obj.Thurs:obj.Fri);
                dayList = Array.from(list);
            }

            if(!(dayList.length - 1 < i)){
                htmlString = htmlString +
                    "<td>"+ dayList[i].substring(0, dayList[i].length - 1) + " " + dayList[i].substring(dayList[i].length - 1) +"</td>"
                ;
            }else{
                htmlString = htmlString + "<td></td>";
            }
        }

        weekTable.innerHTML = weekTable.innerHTML + htmlString + "</tr>"
    }

}

function outOfDate(listAlarms, obj){

    if(listAlarms.length == 0){
        // let list = (day == "Mon" ? obj.Mon : day=="Tues" ? obj.Tues: day == "Wednes" ? obj.Wednes: day == "Thurs" ? obj.Thurs:obj.Fri);
        // let dayList = Array.from(list);
        // let tempCurrentTime = new Date();
        // let i = dayList.length - 1;

        // let hour = dayList[i].substring(0, dayList[i].length-6);
        // let periodTime = dayList[i].substring(0, dayList[i].length-1);
        // let pmOrAm = periodTime.substring(periodTime.length -2);
        // if(pmOrAm == "pm" && hour != 12){
        //     hour = parseInt(hour) + 12;
        // }
        // let notify =  parseInt( obj.periodAlarms[ parseInt(dayList[i].substring(dayList[i].length-1 )-1)]  );
        // let minute = parseInt((dayList[i].substring(dayList[i].length-5, dayList[i].length-3)));
        // let temp = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hour, minute, "0", "0");
        // let alarmTime = new Date(temp.getTime() - (notify*60000));

        // console.log(tempCurrentTime.getHours() + " . " + tempCurrentTime.getMinutes());

        // if(tempCurrentTime.getTime() < alarmTime.getTime()){
            chrome.alarms.clearAll();
            listAlarms = []
    
            createAlarms(obj);
        // }
    }
}

function createAlarms(obj){
    console.log("created Alarms");

    let list = (day == "Mon" ? obj.Mon : day=="Tues" ? obj.Tues: day == "Wednes" ? obj.Wednes: day == "Thurs" ? obj.Thurs:obj.Fri);
    let dayList = Array.from(list);
    for(let i = 0; i < dayList.length; i++){
        let tempString = day + dayList[i].substring(dayList[i].length-1);
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
        let temp = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hour, minute, "0", "0");
        let alarmTime = new Date(temp.getTime() - (notify*60000));

        chrome.alarms.create(tempString, {
            when: alarmTime.getTime(),
        });
    }
}

// function notify(){
//     console.log("notify called");
//     chrome.storage.sync.get({}, function (obj) {
//         let notificationOptions = {
//             type: 'basic',
//             iconUrl: 'images/get_started128.png',
//             title: 'Don\'t forget!',
//             message: 'You have class. Wake up, dude!'
//         }
//         chrome.notifications.create('Reminder', notificationOptions);
//     });
// }

let editPeriodSettings = document.getElementById("editPeriodSettings");
let perNum2 = document.getElementById("perNum2");
let perName2 = document.getElementById("perName2");
let notifyTime2 = document.getElementById("notifyTime2");
let alarmTime2 = document.getElementById("alarmTime2");
let savePeriod = document.getElementById("savePeriod");
let periodForm2 = document.getElementById("periodForm2");
let closePeriodSettings2 = document.getElementById("closePeriodSettings2");

function saveForm(){
    event.preventDefault(); 
    editPeriodSettings.style.maxHeight = "0px";

    chrome.storage.sync.get({
        periodNumbers: [],
        periodNames: [],
        periodAlarms: [],
        periodLength: [],
        passingLength: [],
    }, function (obj) {

        let periodNames = Array.from(obj.periodNames);
        let periodNumbers = Array.from(obj.periodNumbers);
        let periodAlarms = Array.from(obj.periodAlarms);
        let periodLength = Array.from(obj.periodLength);
        let passingLength = Array.from(obj.passingLength);
        perNum2 = document.getElementById("perNum2").innerHTML;

        let indexNum = periodNumbers.indexOf(parseInt(perNum2));

        console.log(indexNum);
        console.log(periodNumbers);

        perName2 = document.getElementById("perName2");
        alarmTime2 = document.getElementById("alarmTime2");

        periodNames[indexNum] = (perName2.value);
        periodAlarms[indexNum] = (alarmTime2.value);
        periodLength[indexNum] = ("50");
        passingLength[indexNum] = ("10");

        obj.periodNames = periodNames;
        obj.periodNumbers = periodNumbers;
        obj.periodAlarms = periodAlarms;
        obj.periodLength = periodLength;
        obj.passingLength = passingLength;

        chrome.storage.sync.set(obj, function(){
            drawPeriods();
            update();
        });
    });
}

function editPer(num){
    editPeriodSettings.style.maxHeight = "234px";
    chrome.storage.sync.get({
        periodNumbers: [],
        periodNames: [],
        periodAlarms: [],
        periodLength: [],
        passingLength: [],
    }, function (obj) {
        periodNumbers = Array.from(obj.periodNumbers);
        let indexNum = periodNumbers.indexOf(num);
        alarmTime2.value = obj.periodAlarms[indexNum];
        perNum2.innerHTML = num;
        perName2.value = obj.periodNames[indexNum];
    });
}

function drawPeriods(){
    chrome.storage.sync.get({
        periodNumbers: [],
        periodNames: [],
        periodAlarms: [],
        periodLength: [],
        passingLength: [],
    }, function (obj) {
        let tempButtons = [];
        let periodNames = Array.from(obj.periodNames);
        periodTable.innerHTML = "<tr> <th>Period</th> <th>Subject</th> <th>Alarm</th> <th></th> </tr>";
        for(let i = 0; i < periodNames.length; i++){
            periodTable.innerHTML = periodTable.innerHTML + 
                "<tr> <td>" + obj.periodNumbers[i] + "</td> <td>" + obj.periodNames[i] + "</td> <td> " + obj.periodAlarms[i] + " min before </td> <td><button class='edit' id=" + obj.periodNumbers[i] + ">✎</button></td> </tr>"
            ;
            tempButtons.push(obj.periodNumbers[i]);
            // console.log(tempButton);
        }

        for(let i = 0; i < tempButtons.length; i++){
            document.getElementById(tempButtons[i]).addEventListener("click", function(){
                editPer(tempButtons[i])
            });
        }

    });
}

periodForm2.addEventListener('submit', saveForm);

let eachPeriodButton = document.getElementById("eachPeriodButton");
let editPeriods = document.getElementById("editPeriods");
let home = document.getElementById("home");
let eachPeriodButtonFlip = 1;
let periodTable = document.getElementById("periodTable");
let newPeriod = document.getElementById("newPeriod");
let newPeriodSettings = document.getElementById("newPeriodSettings");
let closePeriodSettings = document.getElementById("closePeriodSettings");
let perNum = document.getElementById("perNum");
let createPeriod = document.getElementById("createPeriod");
let periodForm = document.getElementById("periodForm");

eachPeriodButton.onclick = function(){
    if(eachPeriodButtonFlip == 1){
        eachPeriodButton.innerHTML = " Back to Home ";
        editPeriods.style.display = "block";
        home.style.display = "none";

        drawPeriods();


    }else{
        eachPeriodButton.innerHTML = " Edit Periods ";
        home.style.display = "block";
        editPeriods.style.display = "none";
    }
    eachPeriodButtonFlip *= -1;
}

newPeriod.onclick = function(){
    newPeriodSettings.style.maxHeight = "234px";
    chrome.storage.sync.get({
        periodNumbers: [],
    }, function (obj) {
        perNum.innerHTML = obj.periodNumbers.length + 1;
    });
}

function createForm(event) { 
    event.preventDefault(); 
    newPeriodSettings.style.maxHeight = "0px";

    chrome.storage.sync.get({
        periodNumbers: [],
        periodNames: [],
        periodAlarms: [],
        periodLength: [],
        passingLength: [],
    }, function (obj) {

        let periodNames = Array.from(obj.periodNames);
        let periodNumbers = Array.from(obj.periodNumbers);
        let periodAlarms = Array.from(obj.periodAlarms);
        let periodLength = Array.from(obj.periodLength);
        let passingLength = Array.from(obj.passingLength);

        let perName = document.getElementById("perName");
        let alarmTime = document.getElementById("alarmTime");

        periodNames.push(perName.value);
        periodNumbers.push(parseInt(perNum.innerHTML));
        periodAlarms.push(alarmTime.value);
        periodLength.push("50");
        passingLength.push("10");

        obj.periodNames = periodNames;
        obj.periodNumbers = periodNumbers;
        obj.periodAlarms = periodAlarms;
        obj.periodLength = periodLength;
        obj.passingLength = passingLength;

        chrome.storage.sync.set(obj);

        drawPeriods();

    });
} 

periodForm.addEventListener('submit', createForm);

closePeriodSettings.onclick = function(){
    newPeriodSettings.style.maxHeight = "0px";
}

closePeriodSettings2.onclick = function(){
    editPeriodSettings.style.maxHeight = "0px";
}