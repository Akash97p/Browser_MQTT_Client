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
const conf_btn = document.getElementById('conf_btn');
const pub_btn = document.getElementById('pub_btn');
const sub_btn = document.getElementById('sub_btn');
const pub_debug = document.getElementById('pub_debug')
const sub_debug = document.getElementById('sub_debug')
const conf_debug = document.getElementById('conf_debug')

var sub_topic = 'topic1';
var prev_sub_topic ;

pub_btn.addEventListener('click' , function publish(){
    x = document.getElementById("msg").value;
    y = document.getElementById("pub_topic").value;
    if(y.length != 0 ){
        if(x.length != 0 ){
        client.publish(y, x)
        pub_debug.textContent = 'Published' ;
        console.log('Published');
        }
        else{
            pub_debug.textContent = 'Message can\'t be blank' ;
            console.log('Message can\'t be blank');
        }
    }
    else{
        if(x.length != 0 ){
        pub_debug.textContent = 'Topic can\'t be blank' ;
        console.log('Topic can\'t be blank');
        }
        else{
            pub_debug.textContent = 'Topic and Message can\'t be blank' ;
            console.log('Topic and Message can\'t be blank');
        }
    }
  
} );

sub_btn.addEventListener('click' , function subscribe(){
    sub_debug.textContent = 'sub btn clicked';

    console.log('Subscribed');  
} );

client.on('connect', function () {
    console.log('Connected to '+ host);
    client.subscribe(sub_topic, function (err) {
      if (!err) {
        // client.publish('ack', 'Hello mqtt')
      }
    })
  })
   
  client.on('message', function (topic, message) {
    console.log('Received : ' + message.toString())
    sub_debug.textContent = 'Received : ' + message.toString();
  })

