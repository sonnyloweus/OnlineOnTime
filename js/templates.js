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
            // console.log("Week A click valid");
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
            // console.log("Week B click valid");
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