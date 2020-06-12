function justForCall(){}
function onEdit(e)
{
 var tsss = SpreadsheetApp.getActiveSpreadsheet();
 var tss = tsss.getActiveSheet();
 var excludes = ["Template","Login ID","CH ID-Summary","Weekly Summary"];
 if (excludes.indexOf(tss.getName()) !== -1) return;
  var tscell = e.range; 
  tsdoSomething(tscell);
}

function tsdoSomething(tscell)
{
  var tssheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var tsr = tscell.getRow();
  var tsc = tscell.getColumn();
  if (tsc==8 && tsr!==1)
  {
    if(tsr==2)
    {
      var tsuploader = tssheet.getRange("A2").getValue();
      var tsloginTime = tssheet.getRange("C2").getDisplayValue()
      var tscurrentTime = Utilities.formatDate(new Date(), 'IST', 'HH:mm');
      var tsvalue = tsgetHourDiff(tscurrentTime,tsloginTime);
      tssheet.getRange("P2").setValue(tsvalue);
      tssheet.getRange("Q2").setValue(tscurrentTime);
    }
    else if(tsr>2)
    {
      //uploadersList
      var tsrawUploaders = tssheet.getRange("A2:A").getValues();
      var tsnumberOfValues = tsrawUploaders.filter(String).length;
      var tsuploadersList = tssheet.getRange(2,1,tsnumberOfValues).getDisplayValues();

      // timeStamp values      
      var tsdataRange = tssheet.getDataRange().getDisplayValues();
      var tslastcell = tsdataRange.length;
      var tsthreevalues = [];
      for(i=1;i<tsdataRange.length;i++)
      {
        if(tsdataRange[i][0]==="")
          continue;
        else tsthreevalues.push([tsdataRange[i][0],tsdataRange[i][2],tsdataRange[i][15],tsdataRange[i][16]]);
      }
      var tslastcell = tsthreevalues.length;
      
      var tsuploader = tssheet.getRange("A"+tsr).getValue();
      console.log("We are calling qcodewise!!");
      var tssingleuploadervalues = fAndC(tsthreevalues,tsuploader);
      console.log(tssingleuploadervalues);
      var tscurrentTime = Utilities.formatDate(new Date(), 'IST', 'HH:mm');
      for(i in tsthreevalues)
      { 
        if (tsuploader === tsthreevalues[i][0])
        {
          if (tsthreevalues[i][3]==="") 
          {
            var tsvalue = tsgetHourDiff(tscurrentTime,tsthreevalues[i][1]);
            tssheet.getRange("P"+tsr).setValue(tsvalue);
            tssheet.getRange("Q"+tsr).setValue(tscurrentTime);
          }
        }
      }
      var tsprev,tsprevm,tsourValue;
      
      for (var i in tssingleuploadervalues)
      {
        if (tsuploader === tssingleuploadervalues[i][0] && tssingleuploadervalues[i][3]!=="" && tssingleuploadervalues.length > 1)
        {
          var tsdata = tssingleuploadervalues[i][3].split(":");
          var tsh = tsdata[0];
          var tsm = tsdata[1];
          if(tsh!==tsprev)
          {
            if(tsh > tsprev)
              tsourValue = (tsh+" : "+tsm);
            else tsourValue = (tsprev+":"+tsprevm);
          }
          else if(tsh === tsprev && tsm!==tsprevm)
          {
            if(tsm > tsprevm)
              tsourValue= (tsh+":"+tsm);
            else tsourValue = (tsprev+":"+tsprevm);
          }
          else tsourValue = (tsh+":"+tsm)
          
          tsprev = tsh;
          tsprevm = tsm;
        }
        else  
        {
          tsourValue = tssingleuploadervalues[i][3];
        }
      }
      
      console.log(tsourValue);
      var tsvalue = tsgetHourDiff(tscurrentTime,tsourValue);
      tssheet.getRange("P"+tsr).setValue(tsvalue);
      tssheet.getRange("Q"+tsr).setValue(tscurrentTime);
      
    }
  }
}

function fAndC(arr,tsbc) {         
  var tslist = [],tsprev;
  for ( var i  = 0; i < arr.length; i++ ) {
    if ( arr[i][0] === tsbc  && arr[i][3]!=="" ) {
      tslist.push(arr[i]);
    } 
  }
  return tslist;
}
  
function tsgetHourDiff(a, b) {
    if (!isValidHour(a) || !isValidHour(b)) {
        return "Invalid input(s)";
    }

    var h1 = a.split(":"), h2 = b.split(":");
    var h = 0, m = 0;
    h = h1[0] - h2[0];
    m = h1[1] - h2[1];

    if (h < 0) {
        h = -h; 
        m = -m;
    }
    if (h == 0) {
        m = Math.abs(m);
    }
    if (m < 0) {
        m = m + 60;
        h = h - 1;
    }
   return m;
}

function isValidHour(hour) {
    hourPattern = "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$";
    if (hour.match(hourPattern)) {return true;}
    return false;
}
