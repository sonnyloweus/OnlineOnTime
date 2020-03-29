
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
        let tempValue = parseInt(obj.periodNumbers[i], 16);
        let tempText = parseInt(obj.periodNumbers[i], 16) + "  " + obj.periodNames[i];
        if(tempValue == num){
            htmlString = htmlString + templateFront + tempValue + " selected >" + tempText + templateBack;
        }else{
            htmlString = htmlString + templateFront + tempValue + ">" + tempText + templateBack;
        }
    }
    return htmlString;
}

function needToSave(num){
    // console.log("changed");
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
            let periodNum = parseInt(dayList[i].substring(dayList[i].length-1), 16);
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
        let tempPerNum = parseInt(document.getElementById("setNewPeriod" + num).value);
        let newPeriod = tempPerNum.toString(16);
        let amOrpm = "am";
        if(newTime > "12:59"){
            newTime = (parseInt(newTime.substring(0, 2))-12) + newTime.substring(2);
            amOrpm = "pm";
        }

        if(newTime.substring(0, 1) == "0"){
            newTime = newTime.substring(1);
        }

        console.log(newTime);

        dayList.splice(num+1, 0, ("" + newTime + amOrpm + newPeriod));

        console.log(dayList);

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
        WeekA: [],
        WeekB: [],
        week: [],
        periodNumbers: [],
        periodNames: [],
        periodAlarms: [],
        periodLength: [],
        passingLength: []
    }, function (obj) {
        let list = (weekday == "Mon" ? obj.Mon : weekday=="Tues" ? obj.Tues: weekday == "Wednes" ? obj.Wednes: weekday == "Thurs" ? obj.Thurs:obj.Fri);
        let dayList = Array.from(list);

        let newTime = document.getElementById("newTime" + num).value;

        let tempPerNum = parseInt(document.getElementById("setNewPeriod" + num).value);
        let newPeriod = (tempPerNum.toString(16));
        let amOrpm = "am";
        if(newTime > "12:59"){
            newTime = (parseInt(newTime.substring(0, 2))-12) + newTime.substring(2);
            amOrpm = "pm";
        }

        if(newTime.substring(0, 1) == "0"){
            newTime = newTime.substring(1);
        }

        dayList[num] = "" + newTime + amOrpm + newPeriod;

        console.log(dayList);

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
            createAlarms(obj);
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
        createAlarms(obj);
    });
    editWeekSchedule.style.display = "none";
    home.style.display = "block"
    eachPeriodButton.style.display = "block";
}

