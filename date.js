module.exports=date;

function date(){
var today = new Date();
var options={ weekday:"long", day:"numeric",month:"long"};
var dayName = today.toLocaleString("en-US",options);
return dayName;
}
