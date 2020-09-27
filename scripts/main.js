// --------------------------------- MQTT Conf ----------------------------------------

var clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)
var host = 'ws://localhost:9001'
var options = {
    keepalive: 30,
    clientId: clientId,
    protocolId: 'MQTT',
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    will: {
      topic: 'WillMsg',
      payload: 'Connection Closed abnormally..!',
      qos: 0,
      retain: false
    },
    rejectUnauthorized: false
  }
  

var client = mqtt.connect(host, options)

client.on('error', function (err) {
  console.log(err)
  client.end()
})

// -----------------------------------------------------------------------------------

const pub_btn = document.getElementById('pub_btn');
const sub_btn = document.getElementById('sub_btn');
const pub_debug = document.getElementById('pub_debug')
const sub_debug = document.getElementById('sub_debug')

pub_btn.addEventListener('click' , function publish(){
    x = document.getElementById("msg").value;
    y = client.publish('presence', x)
    pub_debug.textContent = 'Published' ;
    console.log('Published'+y);  
} );

sub_btn.addEventListener('click' , function subscribe(){
    sub_debug.textContent = 'sub btn clicked';

    console.log('Subscribed');  
} );

client.on('connect', function () {
    console.log('Connected to '+ host);
    client.subscribe('presence', function (err) {
      if (!err) {
        client.publish('presence', 'Hello mqtt')
      }
    })
  })
   
  client.on('message', function (topic, message) {
    console.log('Received : ' + message.toString())
    sub_debug.textContent = 'Received : ' + message.toString();
  })

