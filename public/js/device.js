const mqtt = require("mqtt")
const client = mqtt.connect("ws://broker.mqttdashboard.com:8000/mqtt",{
    clientId: "clientId-11543"
})

var heartRate = 73

client.on("connect", function(){
    console.log("connected to broker")
    getHeartRate()
})

client.on('error', function(error){
    console.log("error occured ", error)
})

function getHeartRate(){
    console.log("sending the heartRate")
    setInterval(changeHearRate, 1000)
    setInterval(function(){
        client.publish("heartSensor11543", heartRate.toString())
    },100)
}

function changeHearRate(){
    heartRate = Math.floor(Math.random() * (78 - 72) + 72)
}