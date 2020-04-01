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
    editPeriodSettings.style.border = "none";

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
        let num = parseInt(perNum2.innerHTML);

        let indexNum = periodNumbers.indexOf( num.toString(16) );
        // console.log("saving the periond " + indexNum + "from" + (num.toString(16)) );

        // console.log(indexNum);
        // console.log(periodNumbers);

        perName2 = document.getElementById("perName2");
        alarmTime2 = document.getElementById("alarmTime2");

        periodNames[indexNum] = (perName2.value)
        periodAlarms[indexNum] = (alarmTime2.value);
        periodLength[indexNum] = ("50");
        passingLength[indexNum] = ("10");

        // console.log(periodNumbers);
        // console.log(periodNames);

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
    editPeriodSettings.style.border = "3px solid lightblue";
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
        let indexNum = periodNumbers.indexOf(num.toString(16));
        // console.log(indexNum + "from" + num);
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
                "<tr> <td>" + parseInt(obj.periodNumbers[i], 16) + "</td> <td>" + obj.periodNames[i] + "</td> <td> " + obj.periodAlarms[i] + " min before </td> <td><button class='edit' id=" + parseInt(obj.periodNumbers[i], 16) + " title='edit period'>✎</button></td> </tr>"
            ;
            tempButtons.push(parseInt(obj.periodNumbers[i], 16));
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
        if(obj.periodNumbers.length >= 15){
            alert("You have the maximum amount of periods");
        }else{
            newPeriodSettings.style.border = "3px solid lightblue";
            newPeriodSettings.style.maxHeight = "234px";
            perNum.innerHTML = obj.periodNumbers.length + 1;
            perName.value = "";
            alarmTime.value = 5;
            notifyTime.innerHTML = alarmTime.value;
        }
    });
}

function createForm(event) { 
    event.preventDefault(); 
    newPeriodSettings.style.maxHeight = "0px";
    newPeriodSettings.style.border = "none";

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
        periodNumbers.push(parseInt(perNum.innerHTML).toString(16));
        periodAlarms.push(alarmTime.value);
        periodLength.push("50");
        passingLength.push("10");

        obj.periodNames = periodNames;
        obj.periodNumbers = periodNumbers;
        obj.periodAlarms = periodAlarms;
        obj.periodLength = periodLength;
        obj.passingLength = passingLength;

        chrome.storage.sync.set(obj);
        perName.innerHTML = "";
        drawPeriods();

    });
} 

periodForm.addEventListener('submit', createForm);

closePeriodSettings.onclick = function(){
    newPeriodSettings.style.border = "none";
    newPeriodSettings.style.maxHeight = "0px";
}

closePeriodSettings2.onclick = function(){
    editPeriodSettings.style.border = "none";
    editPeriodSettings.style.maxHeight = "0px";
}