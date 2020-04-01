let calendarPage = document.getElementById("calendarPage");
let calendarButton = document.getElementById("calendarButton");
let backCalendar = document.getElementById("backCalendar");

calendarButton.onclick = function(){
    calendarPage.style.display = "block";
    backCalendar.style.display = "block";
    eachPeriodButton.style.display = "none";
    home.style.display = "none";
}

backCalendar.onclick = function(){
    home.style.display = "block";
    calendarPage.style.display = "none";
    backCalendar.style.display = "none";
    eachPeriodButton.style.display = "block";
}

let calendarHeader = document.getElementById("vertically");

function setToMonday(date) {
    // getting the monday, saturday and sunday count as next monday
    let tempDay = date.getDay();  

    let diff = 0;

    if(tempDay == 0){
        diff = 1;
    }else if(tempDay == 6){
        diff = 2;
    }else{
        diff = (1 - tempDay);
    }

    date.setDate(date.getDate() + diff); 
    return (date.getMonth()+1) + "/" + date.getDate();
}  


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
  

function printDay(date){
    tempWeek = date.split("/");
    let clickDay = new Date(tempWeek[2], parseInt(tempWeek[0])-1, parseInt(tempWeek[1]));
    let tempDay = new Date(tempWeek[2], parseInt(tempWeek[0])-1, parseInt(tempWeek[1]));
    let week = setToMonday(tempDay);

    for (let i=0; i<calendar.length; i++) {
        if(calendar[i][0][0] == week){
            week = calendar[i];
            break;
        }
    }
    calendarHeader.innerHTML = "";

    if(week != setToMonday(new Date(tempWeek[2], parseInt(tempWeek[0])-1, parseInt(tempWeek[1])))){

        if(clickDay.getDay() == 6 || clickDay.getDay() == 0){
            let para = document.createElement("P"); 
            let t = document.createTextNode("No School");
            para.appendChild(t);  
            calendarHeader.appendChild(para);
        }else{

            let tempToday = week[clickDay.getDay()];
            console.log(tempToday);
            
            for(let i = 0; i < tempToday.length; i++){
                let para = document.createElement("P");                    
                let t = document.createTextNode(" " + tempToday[i].substring(0, tempToday[i].length-1) + " Period " + parseInt(tempToday[i].substring(tempToday[i].length-1), 16));    
                para.appendChild(t);  
                calendarHeader.appendChild(para);
            }
        
        }

    }else{
        let para = document.createElement("P"); 
        let t = document.createTextNode("Schedule TBD");
        para.appendChild(t);  
        calendarHeader.appendChild(para);
    }
}


let calendarDates = document.getElementById("datepicker");
let allDates = calendarDates.getElementsByClassName("ui-state-default");

$(".datepicker").datepicker({
    onSelect: function (dateText, inst) {
        printDay(
            dateText
        );
    },

    prevText: '<',
    nextText: '>'
});
