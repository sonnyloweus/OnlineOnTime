function makePeriodsArray(obj){

    let periodNames = Array.from(obj.periodNames);
    let periodNumbers = Array.from(obj.periodNumbers);
    let periodAlarms = Array.from(obj.periodAlarms);
    let periodLength = Array.from(obj.periodLength);


    if(periodNumbers.length == 0){
        //initialize with 7 periods
        for(let i = 0; i < 6; i++){
            periodNumbers[i] = i+1;
            periodNames[i] = "Subject " + (i+1);
            periodLength[i] = "60";
            periodAlarms[i] = "5";
        }
    }
    
    let periods = new Array(periodNames.length);

    for (let i = 0; i < periods.length; i++) {
        periods[i] = new Array(4);
    }

    // each period has: period number, period name, length, alarmTime
    for(let i = 0; i < periodNames.length; i++){
        periods[i][0] = periodNumbers[i];
        periods[i][1] = periodNames[i];
        periods[i][2] = periodLength[i];
        periods[i][3] = periodAlarms[i];
    }

    obj.periodNames = periodNames;
    obj.periodNumbers = periodNumbers;
    obj.periodAlarms = periodAlarms;
    obj.periodLength = periodLength;
    chrome.storage.sync.set(obj);
    return periods;
}

function drawTodaySchedule(obj){
    let periods = makePeriodsArray(obj);

    let list = (day == "Mon" ? obj.Mon : day=="Tues" ?obj.Tues: day == "Wednes" ?obj.Wednes: day == "Thurs" ?obj.Thurs:obj.Fri);
    let dayList = Array.from(list);

    // each period has: period number, period name, length, alarmTime
    for(let i = 0; i < dayList.length; i++ ){
        let periodNum = dayList[i].substring(dayList[i].length-1);

        let periodLength = periods[periodNum-1][2];
        let periodTime = dayList[i].substring(0, dayList[i].length-1);
        let e = new Date(d.getTime() + (parseInt(periodLength)*-60000));
        let tempTime = periodTime.substring(0, periodTime.length-2) + ":00";

        if(periodTime.substring(periodTime.length -2) == "pm" && periodTime.substring(0, periodTime.length-5) != "12"){
            tempTime =  ( parseInt(periodTime.substring(0, periodTime.length-5)) +12)
            + periodTime.substring(periodTime.length-5, periodTime.length-2)
            + ":00";
        }

        let eMin = e.getMinutes();
        if(eMin < 10){
            eMin = "0" + eMin;
        }
        let eHour = e.getHours();
        if(eHour < 10){
            eHour = "0" + eHour;
        }
        e = (eHour + ":" + eMin + ":" + e.getSeconds());

        if( currentTime >= tempTime && 
            e <=  tempTime){
            todayTable.innerHTML = todayTable.innerHTML + 
            //start time, period num, period name
                "<tr style='background-color: lightblue'> <td>" + periodTime + "</td>  <td>" + periodNum + "</td>  <td>" + periods[periodNum-1][1] + "</td> </tr>"
            ;

        }else{
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

    let todayColumn = document.getElementById(day);
    todayColumn.style.backgroundColor = "lightblue";
    todayColumn.style.border = "3px solid lightblue";

    //for each day or row
    for(let i = 0; i < 6; i++){
         weekTable.innerHTML = weekTable.innerHTML + "<tr>";

        let htmlString = "";
        //for each period or column
        for(let n = 1; n < 6; n++){
            let theDay = daysOfWeek[n];
            let list = (theDay == "Mon" ? obj.Mon : theDay=="Tues" ?obj.Tues: theDay == "Wednes" ?obj.Wednes: theDay == "Thurs" ?obj.Thurs:obj.Fri);
            let dayList = Array.from(list);

            if(dayList.length == 0){
                initializeDay(obj, theDay);
                list = (theDay == "Mon" ? obj.Mon : theDay=="Tues" ?obj.Tues: theDay == "Wednes" ?obj.Wednes: theDay == "Thurs" ?obj.Thurs:obj.Fri);
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
    console.log(listAlarms);

    if(listAlarms.length == 0 || listAlarms[0].name.substring(0, 3) != day){
        chrome.alarms.clearAll();
        listAlarms = []

        createAlarms(obj);
    }
}

function createAlarms(obj){
    let list = (day == "Mon" ? obj.Mon : day=="Tues" ?obj.Tues: day == "Wednes" ?obj.Wednes: day == "Thurs" ?obj.Thurs:obj.Fri);
    let dayList = Array.from(list);
    for(let i = 0; i < dayList.length; i++){
        let tempString = day + dayList[i].substring(dayList[i].length-1);
        // 00:00xxx
        let hour = dayList[i].substring(0, dayList[i].length-6);

        let periodTime = dayList[i].substring(0, dayList[i].length-1);
        let pmOrAm = periodTime.substring(periodTime.length -2);
        if(pmOrAm == "pm" && hour != 12){
            hour = parseInt(hour + 12);
        }

        let notify =  parseInt( obj.periodAlarms[ parseInt(dayList[i].substring(dayList[i].length-1 )-1)]  );
        let minute = parseInt((dayList[i].substring(dayList[i].length-5, dayList[i].length-3))) - notify ;

        // console.log( d.getFullYear() + ", " + d.getMonth() + ", " + d.getDay() + ", " + hour + ", " + minute + ", " + "0" + ", " +  "0" );

        let alarmTime = new Date(d.getFullYear(), d.getMonth(), d.getDay(), hour, minute, "0", "0");

        chrome.alarms.create(tempString, {
            when: alarmTime.getTime(),
        });
    }
}