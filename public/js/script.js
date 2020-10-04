function Connecting() {

    clientID = "abc";

    document.getElementById("status").innerHTML = '<span>connecting...</span><br/>';

    client = new Paho.MQTT.Client('broker.mqttdashboard.com', Number(8000), "abcd");

    client.onConnectionLost = connectionLost;
    client.onMessageArrived = receivedData;

    client.connect({ 
        onSuccess: Connected,
        onFailure: FailedToConnect
    });
}

function FailedToConnect(response){
    document.getElementById("status").innerHTML = '<span>Could not connect</span><br/> error'+ response.errorMessage;
}

function Disconnecting(){
    client.disconnect();
    document.getElementById("status").innerHTML = '<span>Disconnected</span><br/>';
}

function Connected() {
    document.getElementById("status").innerHTML = '<span>connected</span><br/>';
    topic = document.getElementById("topic").value;

    document.getElementById("messages").innerHTML = '<span>Subscribed to: ' + topic + '</span><br/>';

    client.subscribe(topic);

}

function connectionLost(response) {
    document.getElementById("status").innerHTML = '<span>ERROR: Connection lost</span><br/>';
    if (response.errorCode !== 0) {
        document.getElementById("messages").innerHTML = '<span>ERROR: ' +  response.errorCode + ' '+ response.errorMessage+ '</span><br/>';
    }
}

function receivedData(data) {
    document.getElementById("data").innerHTML = '<span>Value: ' + data.payloadString + '</span><br/>';
}