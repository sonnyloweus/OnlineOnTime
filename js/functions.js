function makePeriodsArray(obj){

    let periodNames = Array.from(obj.periodNames);
    let periodNumbers = Array.from(obj.periodNumbers);
    let periodAlarms = Array.from(obj.periodAlarms);
    let periodLength = Array.from(obj.periodLength);
    let passingLength = Array.from(obj.passingLength);


    if(periodNumbers.length == 0){
        //initialize with 7 periods
        for(let i = 0; i < 8; i++){
            periodNumbers[i] = i+1;
            if(i == 7){
                periodNames[i] = "Office Hours";
            }else{
                periodNames[i] = "Subject " + (i+1);
            }
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

let defaultWeekA = [
    ["8:15am8", "9:30am1", "10:45am2", "12:30am3", "1:45pm4"],
    ["8:15am8", "9:30am5", "10:45am6", "12:30am7"],
    ["8:15am8", "9:30am1", "10:45am2", "12:30am3", "1:45pm4"],
    ["8:15am8", "9:30am5", "10:45am6", "12:30am7"],
    ["8:15am8", "9:30am1", "10:45am2", "12:30am3", "1:45pm4"]
]

let defaultWeekB = [
    ["8:15am8", "9:30am5", "10:45am6", "12:30am7"],
    ["8:15am8", "9:30am1", "10:45am2", "12:30am3", "1:45pm4"],
    ["8:15am8", "9:30am5", "10:45am6", "12:30am7"],
    ["8:15am8", "9:30am1", "10:45am2", "12:30am3", "1:45pm4"],
    ["8:15am8", "9:30am5", "10:45am6", "12:30am7"]
]

function initializeDay(obj, theDay){
    let defaultNum = (theDay == "Mon" ? 0 : theDay=="Tues" ?1: theDay == "Wednes" ?2: theDay == "Thurs" ?3:4);
    let tempList = defaultWeekA[defaultNum];

    obj.week[0] = "weekA";
    obj.WeekA = defaultWeekA;
    obj.WeekB= defaultWeekB;
    // console.log(obj.WeekA);

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
    let tempWeek = [];
    if(obj.week[0] == "weekA"){
        tempWeek = defaultWeekA;
    }else{
        tempWeek = defaultWeekB;
    }
    //check each day
    for(let i = 0; i < 5; i++){
        let list = (i == "0" ? obj.Mon : i=="1" ? obj.Tues: i == "2" ? obj.Wednes: i == "3" ? obj.Thurs:obj.Fri);
        if(list.length == 0){
            mostPeriods = Math.max(tempWeek[i].length, mostPeriods);
        }else{
            mostPeriods = Math.max(list.length, mostPeriods);
        }
        // console.log(list);
    }

    // console.log("most periods is " + mostPeriods);

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
    // console.log("created Alarms");

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
        Mon: [],
        Tues: [],
        Wednes: [],
        Thurs: [],
        Fri: []
    }, function (obj) {

        let periodNames = Array.from(obj.periodNames);
        let periodNumbers = Array.from(obj.periodNumbers);
        let periodAlarms = Array.from(obj.periodAlarms);
        let periodLength = Array.from(obj.periodLength);
        let passingLength = Array.from(obj.passingLength);

        let indexNum = periodNumbers.indexOf(parseInt(perNum2.innerHTML));

        // console.log(indexNum);
        // console.log(periodNumbers);

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
            chrome.alarms.clearAll();
            createAlarms(obj);
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
        // console.log(num);
        perNum2.innerText = "" + num;
        periodNumbers = Array.from(obj.periodNumbers);
        let indexNum = periodNumbers.indexOf(num);
        alarmTime2.value = obj.periodAlarms[indexNum];
        notifyTime2.innerHTML = alarmTime2.value;
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
                // console.log(tempButtons[i] + "clicked");
                editPer(tempButtons[i]);
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
    chrome.storage.sync.get({
        periodNumbers: [],
    }, function (obj) {
        if(obj.periodNumbers.length >= 9){
            alert("You have the maximum amount of periods");
        }else{
            newPeriodSettings.style.maxHeight = "234px";
            perNum.innerHTML = obj.periodNumbers.length + 1;
        }
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

let editWeekSchedule = document.getElementById("editWeekSchedule");
let editScheduleButton = document.getElementById("editSchedule");
let backWeek = document.getElementById("backWeek");
let editTodayTable = document.getElementById("editTodayTable");

let addPeriodButton = document.getElementById("addPeriod");

let monSch = document.getElementById("MonSch")
let tueSch = document.getElementById("TuesSch")
let wedSch = document.getElementById("WednesSch")
let thurSch = document.getElementById("ThursSch")
let friSch = document.getElementById("FriSch")

function getOptions(obj, num){
    let htmlString = "";
    let templateFront = "<option value=";
    let templateBack = "</option>"
    for(let i = 0; i < obj.periodNumbers.length; i++){
        let tempValue = obj.periodNumbers[i];
        let tempText = obj.periodNumbers[i] + "  " + obj.periodNames[i];
        if(tempValue == num){
            htmlString = htmlString + templateFront + tempValue + " selected >" + tempText + templateBack;
        }else{
            htmlString = htmlString + templateFront + tempValue + ">" + tempText + templateBack;
        }
    }
    return htmlString;
}

function needToSave(num){
    console.log("changed");
    let needRed = document.getElementById("saveNewPeriod" + num);
    needRed.style.border = "2px solid red";
}

function editToday(weekday){
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
    }, function (obj) {
        // console.log(obj.Mon);

        editTodayTable.innerHTML = "<table id='editTodayTable' style='width:100%'><tr><th>Time</th><th colspan='3' style='text-align: left;'>Period and Subject</th> <th></th> <th></th> <th></th> </tr></table>"

        let periods = makePeriodsArray(obj);

        let list = (weekday == "Mon" ? obj.Mon : weekday=="Tues" ? obj.Tues: weekday == "Wednes" ? obj.Wednes: weekday == "Thurs" ? obj.Thurs:obj.Fri);
        let dayList = Array.from(list);
        let previous = false;
        // each period has: period number, period name, length, alarmTime, passingLength
        for(let i = 0; i < dayList.length; i++ ){
            let periodNum = dayList[i].substring(dayList[i].length-1);
            let periodTime = dayList[i].substring(0, dayList[i].length-1);
            let timeOnly = dayList[i].substring(0, dayList[i].length-3);
            let pmOrAm = dayList[i].substring(dayList[i].length-3, dayList[i].length-1);

            let hour = timeOnly.substring(0, timeOnly.length-3);
            if(pmOrAm == "pm" && hour != "12"){
                hour = parseInt(hour) + 12;
            }
            if(hour <= 9){
                hour = "0" + hour;
            }

            let tempTime = hour + ":" + timeOnly.substring(timeOnly.length-2);
    
            // console.log(currentTime + " / " + tempTime + " / " + e);
            editTodayTable.innerHTML = editTodayTable.innerHTML + "<tr>" 
                + " <td><input id=" + "newTime" + i + " type='time'value=" + tempTime  + "> </td> " 
                + " <td> <select id=" + "setNewPeriod" + i + " >" + getOptions(obj, periodNum)  + "</select></td> " 
                + " <td><button title='Delete Period' class='deletePeriod' id=" + "trashPeriod" + i + ">✗</button></td>" 
                + " <td><button title='Save Changes' class='savePeriod' id=" + "saveNewPeriod" + i + ">📥</button></td>"
                + " <td><button title='Insert Period Below' class='insertPeriod' id=" + "insertPeriod" + i + ">↧</button></td>" + 
                "</tr>"
            ;
        }

        for(let i = 0; i < dayList.length; i++ ){
            document.getElementById("trashPeriod" + i).addEventListener("click", function(){
                deletePeriod(i, weekday);
            });
            document.getElementById("saveNewPeriod" + i).addEventListener("click", function(){
                saveNewPeriod(i, weekday);
            });
            document.getElementById("insertPeriod" + i).addEventListener("click", function(){
                insertPeriodBelow(i, weekday);
            });
            document.getElementById("newTime" + i).onchange = function(){
                needToSave(i);
            }
            document.getElementById("setNewPeriod" + i).onchange = function(){
                needToSave(i);
            }
        }

    });
}

function insertPeriodBelow(num, weekday){
    chrome.storage.sync.get({
        Mon: [],
        Tues: [],
        Wednes: [],
        Thurs: [],
        Fri: [],
    }, function (obj) {
        let list = (weekday == "Mon" ? obj.Mon : weekday=="Tues" ? obj.Tues: weekday == "Wednes" ? obj.Wednes: weekday == "Thurs" ? obj.Thurs:obj.Fri);
        let dayList = Array.from(list);


        let newTime = document.getElementById("newTime" + num).value;
        let newPeriod = document.getElementById("setNewPeriod" + num).value;
        let amOrpm = "am";
        if(newTime > "12:59"){
            newTime = (parseInt(newTime.substring(0, 2))-12) + newTime.substring(2);
            amOrpm = "pm";
        }

        if(newTime.substring(0, 1) == "0"){
            newTime = newTime.substring(1);
        }

        dayList.splice(num+1, 0, ("" + newTime + amOrpm + newPeriod));

        // console.log(dayList);

        if(weekday == "Mon"){
            obj.Mon = dayList;
        }else if(weekday == "Tues"){
            obj.Tues = dayList;
        }else if(weekday == "Wednes"){
            obj.Wednes = dayList;
        }else if(weekday == "Thurs"){
            obj.Thurs = dayList;
        }else if(weekday == "Fri"){
            obj.Fri = dayList;
        }
        chrome.storage.sync.set(obj, function(){
            // console.log(obj.Mon);
            editToday(weekday);
        })
    });
}

function saveNewPeriod(num, weekday){
    chrome.storage.sync.get({
        Mon: [],
        Tues: [],
        Wednes: [],
        Thurs: [],
        Fri: [],
    }, function (obj) {
        let list = (weekday == "Mon" ? obj.Mon : weekday=="Tues" ? obj.Tues: weekday == "Wednes" ? obj.Wednes: weekday == "Thurs" ? obj.Thurs:obj.Fri);
        let dayList = Array.from(list);
        let newTime = document.getElementById("newTime" + num).value;
        let newPeriod = document.getElementById("setNewPeriod" + num).value;
        let amOrpm = "am";
        if(newTime > "12:59"){
            newTime = (parseInt(newTime.substring(0, 2))-12) + newTime.substring(2);
            amOrpm = "pm";
        }

        if(newTime.substring(0, 1) == "0"){
            newTime = newTime.substring(1);
        }

        dayList[num] = "" + newTime + amOrpm + newPeriod;

        // console.log(dayList);

        if(weekday == "Mon"){
            obj.Mon = dayList;
        }else if(weekday == "Tues"){
            obj.Tues = dayList;
        }else if(weekday == "Wednes"){
            obj.Wednes = dayList;
        }else if(weekday == "Thurs"){
            obj.Thurs = dayList;
        }else if(weekday == "Fri"){
            obj.Fri = dayList;
        }
        
        chrome.storage.sync.set(obj, function(){
            // console.log(obj.Mon);
            editToday(weekday);
        })
    });
}


function deletePeriod(num, weekday){
    chrome.storage.sync.get({
        Mon: [],
        Tues: [],
        Wednes: [],
        Thurs: [],
        Fri: [],
    }, function (obj) {
        let list = (weekday == "Mon" ? obj.Mon : weekday=="Tues" ? obj.Tues: weekday == "Wednes" ? obj.Wednes: weekday == "Thurs" ? obj.Thurs:obj.Fri);
        let dayList = Array.from(list);
        dayList.splice(num, 1);

        // console.log(dayList);

        if(weekday == "Mon"){
            obj.Mon = dayList;
        }else if(weekday == "Tues"){
            obj.Tues = dayList;
        }else if(weekday == "Wednes"){
            obj.Wednes = dayList;
        }else if(weekday == "Thurs"){
            obj.Thurs = dayList;
        }else if(weekday == "Fri"){
            obj.Fri = dayList;
        }
        
        chrome.storage.sync.set(obj, function(){
            // console.log(obj.Mon);
            editToday(weekday);
        })
    });
}

function clearActive(){
    monSch.style.fontWeight = "initial";
    monSch.style.backgroundColor = "white";
    tueSch.style.fontWeight = "initial";
    tueSch.style.backgroundColor = "white";
    wedSch.style.fontWeight = "initial";
    wedSch.style.backgroundColor = "white";
    thurSch.style.fontWeight = "initial";
    thurSch.style.backgroundColor = "white";
    friSch.style.fontWeight = "initial";
    friSch.style.backgroundColor = "white";
}

editScheduleButton.onclick = function(){
    clearActive();
    editWeekSchedule.style.display = "block";
    home.style.display = "none"
    eachPeriodButton.style.display = "none";

    monSch.style.fontWeight = 600;
    monSch.style.backgroundColor = "lightblue";

    addPeriodButton.addEventListener("click", function(){
        insertPeriodBelow(0, "Mon");
    });

    editToday("Mon");
}

monSch.onclick = function(){
    clearActive();
    monSch.style.fontWeight = 600;
    monSch.style.backgroundColor = "lightblue";
    editToday("Mon");
    addPeriodButton.addEventListener("click", function(){
        insertPeriodBelow(0, "Mon");
    });
}
tueSch.onclick = function(){
    clearActive();
    tueSch.style.fontWeight = 600;
    tueSch.style.backgroundColor = "lightblue";
    editToday("Tues");
    addPeriodButton.addEventListener("click", function(){
        insertPeriodBelow(0, "Tues");
    });
}
wedSch.onclick = function(){
    clearActive();
    wedSch.style.fontWeight = 600;
    wedSch.style.backgroundColor = "lightblue";
    editToday("Wednes");
    addPeriodButton.addEventListener("click", function(){
        insertPeriodBelow(0, "Wednes");
    });
}
thurSch.onclick = function(){
    clearActive();
    thurSch.style.fontWeight = 600;
    thurSch.style.backgroundColor = "lightblue";
    editToday("Thurs");
    addPeriodButton.addEventListener("click", function(){
        insertPeriodBelow(0, "Thurs");
    });
}
friSch.onclick = function(){
    clearActive();
    friSch.style.fontWeight = 600;
    friSch.style.backgroundColor = "lightblue";
    editToday("Fri");
    addPeriodButton.addEventListener("click", function(){
        insertPeriodBelow(0, "Fri");
    });
}

backWeek.onclick = function(){
    update();
    editWeekSchedule.style.display = "none";
    home.style.display = "block"
    eachPeriodButton.style.display = "block";
}

let templateA = document.getElementById("templateA");
let templateB = document.getElementById("templateB");

templateA.onclick = function(){
    chrome.storage.sync.get({
        Mon: [],
        Tues: [],
        Wednes: [],
        Thurs: [],
        Fri: [],
        WeekA: [],
        WeekB: [],
        week: [],
        periodNumbers: [],
        periodNames: [],
        periodAlarms: [],
        periodLength: [],
        passingLength: [],
    }, function extensionClicked(obj) {

        if(obj.week[0] == "weekB"){
            obj.week[0] = "weekA";
            console.log("Week A click valid");
            templateB.style.fontWeight = "initial";
            templateA.style.fontWeight = "600";

            let Bweek = Array.from(obj.WeekB);

            Bweek[0] = obj.Mon;
            Bweek[1] = obj.Tues;
            Bweek[2] = obj.Wednes;
            Bweek[3] = obj.Thurs;
            Bweek[4] = obj.Fri;

            obj.WeekB = Bweek;

            let Aweek = Array.from(obj.WeekA);

            obj.Mon = Aweek[0];
            obj.Tues = Aweek[1];
            obj.Wednes = Aweek[2];
            obj.Thurs = Aweek[3];
            obj.Fri = Aweek[4];

        }

        chrome.storage.sync.set(obj, function(){
            createAlarms(obj);
            update();
        });
    });
}

templateB.onclick = function(){
    chrome.storage.sync.get({
        Mon: [],
        Tues: [],
        Wednes: [],
        Thurs: [],
        Fri: [],
        WeekA: [],
        WeekB: [],
        week: [],
        periodNumbers: [],
        periodNames: [],
        periodAlarms: [],
        periodLength: [],
        passingLength: []
    }, function extensionClicked(obj) {

        if(obj.week[0] == "weekA"){
            obj.week[0] = "weekB"
            console.log("Week B click valid");
            templateA.style.fontWeight = "100";
            templateB.style.fontWeight = "600";

            let Aweek = Array.from(obj.WeekA);

            Aweek[0] = obj.Mon;
            Aweek[1] = obj.Tues;
            Aweek[2] = obj.Wednes;
            Aweek[3] = obj.Thurs;
            Aweek[4] = obj.Fri;

            obj.WeekA = Aweek;

            let Bweek = Array.from(obj.WeekB);

            obj.Mon = Bweek[0];
            obj.Tues = Bweek[1];
            obj.Wednes = Bweek[2];
            obj.Thurs = Bweek[3];
            obj.Fri = Bweek[4];

        }

        chrome.storage.sync.set(obj, function(){
            createAlarms(obj);
            update();
        });
    });
}

