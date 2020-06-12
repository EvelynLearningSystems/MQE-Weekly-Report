function onOpen(e) {
  SpreadsheetApp.getUi() 
      .createMenu('Run')
      .addItem('Get Data', 'getDateWise')
      .addToUi();
}

function getDateWise() 
{
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Weekly Summary");
  var fromDate = ss.getRange("B1").getDisplayValue();
  var toDate = ss.getRange("C1").getDisplayValue();
  console.log(fromDate+" , "+toDate);
  var chss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CH ID-Summary");
  
  var dataRangeNew = chss.getDataRange();
  var lastcell = dataRangeNew.getLastRow();
  var lastcol = dataRangeNew.getLastColumn();
  
  var chDates = chss.getRange(2, lastcol);
  var dates = [];
  var range = chss.getRange(1,1,1,lastcol);
  var mergedRanges = range.getMergedRanges();
  for (var i = 0; i < mergedRanges.length; i++) 
  {
    dates.push([mergedRanges[i].getDisplayValue(),mergedRanges[i].getA1Notation()]);
  }
  dates = dates.sort();
  for(var i=0; i<dates.length; i++)
  {
   if(fromDate === dates[i][0]) 
   {
     var fdrange = dates[i][1];
   }
    if(toDate === dates[i][0]) 
   {
     var tdrange = dates[i][1];
   }
  }
  
  var fedrange = fdrange.split(":");
  var fedrange = fedrange[0].substring(0, fedrange[0].length-1);
  fedrange+="3";
  
  var tedrange = tdrange.split(":");
  var tedrange = tedrange[1].substring(0, tedrange[1].length-1);
  tedrange+=lastcell;
  console.log(fedrange+" , "+tedrange);
  
  var uniquebc = getDataRegionData(fedrange,tedrange);
  var uniqueup = getUploaderRegionData(fedrange,tedrange);
 
  var rawDataRegion = chss.getRange(fedrange+":"+tedrange).getDisplayValues();
  var dtrgn = chss.getRange(fedrange+":"+tedrange).getLastColumn();
  var i=0;
  var data = [];
  while(i<dtrgn)
  {
    for(var j=0;j<rawDataRegion.length;j++)
    {
      if (rawDataRegion[j][i]!=="")
      {
        data.push([rawDataRegion[j][i],rawDataRegion[j][i+1],rawDataRegion[j][i+2],rawDataRegion[j][i+3],rawDataRegion[j][i+4],rawDataRegion[j][i+5]]);
      }
    }
    i+=6;
  }
  var dis=0;
  var newFinData = [];
  for (var i=0; i<uniquebc.length;i++)
  { 
    newFinData = qcodeWise(data,uniquebc[i]);
    console.log(newFinData);
    uploadData(newFinData,dis);
    
    dis+=8;
  }
}

function qcodeWise(data,bc)
{
  const map = {}

  for (entry of data) {  
  if(bc!== entry[1]) {
    continue;
  } 
  const key = entry[0]+entry[1]
  
   if (map[key])
   {
   map[key] = [entry[0], entry[1], 
   parseInt(map[key][2]) + parseInt(entry[2]),
   parseInt(map[key][3]) + parseInt(entry[3]),
   parseInt(map[key][4]) + parseInt(entry[4]),  
   parseInt(map[key][5]) + parseInt(entry[5]), ];
   } 
   else 
   {
    map[key] = entry;
   } 
}       
return Object.keys(map).map( key => map[key]);
}

function uploadData(newFinData,dis)
{ 
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Weekly Summary");
  var bcCell = sheet.getRange("A"+(4+dis));
  var distance = 0;
  for(var i=0; i<newFinData.length; i++)
  { 
    bcCell.offset(0,(i+1)).setValue(newFinData[i][0]);
    if(distance<i+5)
    {bcCell.offset(distance+1,0).setValue("Hours Spent");
    bcCell.offset(distance+2,0).setValue("Questions Extracted");
    bcCell.offset(distance+3,0).setValue("Questions Reviewed");
    bcCell.offset(distance+4,0).setValue("Questions Rectified");
    }
    bcCell.setValue(newFinData[i][1]);
    bcCell.offset(1,(i+1)).setValue(newFinData[i][5]);
    bcCell.offset(2,(i+1)).setValue(newFinData[i][2]);
    bcCell.offset(3,(i+1)).setValue(newFinData[i][3]);
    bcCell.offset(4,(i+1)).setValue(newFinData[i][4]);
    distance +=8; 
  }
  
}

function getUploaderRegionData(fdrange,tdrange)
{
  var chss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CH ID-Summay");
  var dtrgn = chss.getRange(fdrange+":"+tdrange).getLastRow();
  var rawDataRegion = chss.getRange(fdrange+":"+tdrange).getDisplayValues();

  var six = 0;
  var i=0;
  var uniqueUploaders =[];
  while(i<dtrgn)
  {
    for(var j=0;j<rawDataRegion.length;j++)
    {
      uniqueUploaders.push(rawDataRegion[j][i]);
    }
    i+=6;
  } 
  var hellooo = filterAndCount(uniqueUploaders);
  var clist = hellooo.list;
  var ctotal = hellooo.total;
  var ccount = hellooo.count;

  return clist;  
}


function getDataRegionData(fdrange,tdrange)
{
  var chss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CH ID-Summay");
  var dtrgn = chss.getRange(fdrange+":"+tdrange).getLastRow();
  var rawDataRegion = chss.getRange(fdrange+":"+tdrange).getDisplayValues();

  var six = 0;
  var i=1;
  var uniqueBookCodes =[];
  while(i<dtrgn)
  {
    for(var j=0;j<rawDataRegion.length;j++)
    {
      uniqueBookCodes.push(rawDataRegion[j][i]);
    }
    i+=6;
  } 
  var hellooo = filterAndCount(uniqueBookCodes);
  var clist = hellooo.list;
  var ctotal = hellooo.total;
  var ccount = hellooo.count;

  return clist;  
}

function filterAndCount(arr) {         //to filter and make array for the counts and the list.
  var total ,list = [], count = [], prev;
  arr.sort();
  for ( var i  = 0; i < arr.length; i++ ) {
    if ( arr[i] == prev ) {
       count[count.length-1]++;
    } 
    else {
      list.push(arr[i]);
      count.push(1);
    }
    prev = arr[i];
  }
  var total = arr.length;
  return {
    list: list,
    count: count,
    total:total
  };
}