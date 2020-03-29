function makePeriodsArray(obj){

    let periodNames = Array.from(obj.periodNames);
    let periodNumbers = Array.from(obj.periodNumbers);
    let periodAlarms = Array.from(obj.periodAlarms);
    let periodLength = Array.from(obj.periodLength);
    let passingLength = Array.from(obj.passingLength);


    if(periodNumbers.length == 0){
        //initialize with 7 periods
        for(let i = 0; i < 9; i++){
            periodNumbers[i] = (i+1).toString(16);
            if(i == 7){
                periodNames[i] = "Office Hours";
                periodLength[i] = "60";
            }else if(i==8){
                periodNames[i] = "Lunch 🍕";
                periodLength[i] = "25";
            }else{
                periodNames[i] = "Subject " + (i+1);
                periodLength[i] = "60";
            }

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
        let periodNum = parseInt(dayList[i].substring(dayList[i].length-1), 16);
        let periodTime = dayList[i].substring(0, dayList[i].length-1);
        let timeOnly = dayList[i].substring(0, dayList[i].length-3);
        let pmOrAm = dayList[i].substring(dayList[i].length-3, dayList[i].length-1);

        
        let periodLength = periods[periodNum-1][2];
        let passingLength = periods[periodNum-1][4];
        // console.log(periods);

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

        // currentTime = current Time
        // e = currentTime - (the period's length plus it's passing length)
        // tempTime = the period's time

        if( currentTime >= tempTime && e <=  tempTime){
            console.log(currentTime + " / " + tempTime + " / " + e);
            todayTable.innerHTML = todayTable.innerHTML + 
            //start time, period num, period name
                "<tr style='background-color: lightblue'> <td> 🔔 " + periodTime + "</td>  <td>" + periodNum + "</td>  <td>" + periods[periodNum-1][1] + "</td> </tr>"
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
    ["8:15am8", "9:30am1", "10:45am2", "11:55am9", "12:30am3", "1:45pm4"],
    ["8:15am8", "9:30am5", "10:45am6", "11:55am9", "12:30am7"],
    ["8:15am8", "9:30am1", "10:45am2", "11:55am9", "12:30am3", "1:45pm4"],
    ["8:15am8", "9:30am5", "10:45am6", "11:55am9", "12:30am7"],
    ["8:15am8", "9:30am1", "10:45am2", "11:55am9", "12:30am3", "1:45pm4"]
]

let defaultWeekB = [
    ["8:15am8", "9:30am5", "10:45am6","11:55am9", "12:30am7"],
    ["8:15am8", "9:30am1", "10:45am2","11:55am9", "12:30am3", "1:45pm4"],
    ["8:15am8", "9:30am5", "10:45am6","11:55am9", "12:30am7"],
    ["8:15am8", "9:30am1", "10:45am2","11:55am9", "12:30am3", "1:45pm4"],
    ["8:15am8", "9:30am5", "10:45am6","11:55am9", "12:30am7"]
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
                    "<td>"+ dayList[i].substring(0, dayList[i].length - 1) + " " + parseInt(dayList[i].substring(dayList[i].length - 1), 16) +"</td>"
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
        listAlarms = []
        createAlarms(obj);
    }
}

function createAlarms(obj){
    // console.log("created Alarms");
    chrome.alarms.clearAll();

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

        let notify =  parseInt( obj.periodAlarms[ parseInt(dayList[i].substring(dayList[i].length-1), 16) - 1]  );
        let minute = parseInt((dayList[i].substring(dayList[i].length-5, dayList[i].length-3))) ;

        // console.log( d.getFullYear() + ", " + d.getMonth() + ", " + d.getDate() + ", " + hour + ", " + minute + ", " + "0" + ", " +  "0" );
        let temp = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hour, minute, "0", "0");
        let alarmTime = new Date(temp.getTime() - (notify*60000));

        chrome.alarms.create(tempString, {
            when: alarmTime.getTime(),
        });
    }
}
