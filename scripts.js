

var totalTweets = [];
var earliest = '';

function getTweets(id) {
  if (id) {
    var url = '/tweets?id='+id;
  } else {
    var url = '/tweets';
  }
  $.ajax({
    // headers: {
    //   'Access-Control-Allow-Origin':
    // },
    url: url,
    method: 'GET',
    success: function(response) {
      var results = JSON.parse(response);
      var statuses = results.statuses;
      console.log('statuses', statuses)
      console.log('total', totalTweets)
      console.log('total', totalTweets.length)
      if (statuses.length> 0) {
      var maxID = statuses[statuses.length-1].id;
        if (maxID !== earliest) {
          var info = statuses.map (function(status) {
            var date = status.created_at;

            return {
              username: '@'+status.user.screen_name,
              date: date.slice(0,10),
              time: date.slice(11,19),
              text: status.text
            }
          })
          totalTweets = totalTweets.concat(info);
          earliest = maxID;
          getTweets(maxID);
        } else {
          JSONToCSVConvertor(totalTweets, 'smte2015', true);
        }
      } else {
      JSONToCSVConvertor(totalTweets, 'smte2015', true);
      }
    },
    error: function(error) {
      console.log('error',error);
    }
  })
}
 function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var CSV = '';
    //Set Report title in first row or line

    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {

            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    //Generate a file name
    var fileName = "MyReport_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + encodeURI(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
$(document).ready(function() {
  $('button').click(getTweets);
})
