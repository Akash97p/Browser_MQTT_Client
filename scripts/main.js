var conf_btn = document.getElementById('conf_btn');
var pub_btn = document.getElementById('pub_btn');
var sub_btn = document.getElementById('sub_btn');
var conf_exp_btn = document.getElementById('conf_exp');
var sub_debug = document.getElementById('sub_debug');
var con_status = document.getElementById('con_status');
var debug_window = document.getElementById('debug_window');

var i =0;

function expand(cm) {
    if(cm){
        document.getElementsByClassName('conf_div')[0].style.display ="none";
        document.getElementsByClassName('pub_div')[0].style.gridRow ="2/4";
        document.getElementsByClassName('sub_div')[0].style.gridRow ="4/6";
        document.getElementsByClassName('sub_debug')[0].style.gridRow ="2/6";
    }
    else{
        document.getElementsByClassName('conf_div')[0].style.display ="";
        document.getElementsByClassName('pub_div')[0].style.gridRow ="3/5";
        document.getElementsByClassName('sub_div')[0].style.gridRow ="5/6";
        document.getElementsByClassName('sub_debug')[0].style.gridRow ="3/6";
    }
}

conf_exp_btn.addEventListener('click',function exp(){
    i=i+1;
    console.log('exp btn pressed');
    if (i%2){
        expand(1);
    }
    else {
        expand(0);
    }
});

conf_btn.addEventListener('click', function config() {
    brocker = document.getElementById("host").value;
    port = document.getElementById("port").value;
    clientId = document.getElementById("clientId").value;
    if (brocker.length != 0 || port.length != 0) {
        var host = 'ws://' + brocker + ':' + port
        conf(host, clientId);
    } else {
        debug_window.textContent = 'Values can\'t be blank \r\n';
        console.log('Values can\'t be blank');
    }
});

pub_btn.addEventListener('click', function publish() {
    x = document.getElementById("msg").value;
    y = document.getElementById("pub_topic").value;
    if (y.length != 0) {
        if (x.length != 0) {
            client.publish(y, x)
            debug_window.textContent = 'Published "' + x + '" to topic "' + y + '"\r\n';
            console.log('Published "' + x + '"to topic "' + y + '"');
        } else {
            debug_window.textContent = 'Message can\'t be blank \r\n';
            console.log('Message can\'t be blank');
        }
    } else {
        if (x.length != 0) {
            debug_window.textContent = 'Topic can\'t be blank \r\n';
            console.log('Topic can\'t be blank');
        } else {
            debug_window.textContent = 'Topic and Message can\'t be blank \r\n';
            console.log('Topic and Message can\'t be blank');
        }
    }

});

sub_btn.addEventListener('click', function subscribe() {
    x = document.getElementById("sub_topic").value;
    if (x.length != 0) {
        client.unsubscribe(sub_topic, function(err) {
            if (!err) {
                sub_debug.textContent = 'Unsubscribed from : ' + sub_topic;
                console.log('Unsubscribed from : ' + sub_topic);
                client.subscribe(x, function(err) {
                    if (!err) {
                        debug_window.textContent = 'Unsubscribed from : ' + sub_topic + '  and  Subscribed to : ' + x + '\r\n';
                        sub_topic = x;
                        console.log('Subscribed to : ' + x);
                    }
                })
            }
        })
    } else {
        sub_debug.textContent = 'Topic can\'t be blank';
        console.log('Topic can\'t be blank');
    }
});

// --------------------------------- MQTT Conf ----------------------------------------
function conf(x, y) {
    window.clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)
    if (y.length != 0) {
        clientId = y;
    }

    window.host = x;
    window.sub_topic = 'default_topic';
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

    window.client = mqtt.connect(host, options)
    client.on('error', function(err) {
        console.log('bla + ' + err)
        debug_window.textContent = err;
        client.end()
    })

    client.on('connect', function() {
        client.subscribe(sub_topic, function(err) {
            if (!err) {
                console.log('Connected to ' + host + '  | Client ID' + clientId);
                con_status.textContent = 'Connected';
                document.getElementsByClassName('con_status_div')[0].style.backgroundColor = "green";
                debug_window.textContent = 'Connected to ' + host + '  | Client ID : ' + clientId + '\r\n';
                i=i+1;
                expand(1);
            } else {
                con_status.textContent = 'Disconnected';
                con_status.style.backgroundColor = "red";
            }
        })
    })

    client.on('message', function(topic, message) {
        console.log('Received "' + message.toString() + '" from topic "' + topic.toString() + '"')
        sub_debug.textContent = 'Received "' + message.toString() + '" from topic "' + topic.toString() + '"';
    })
}
// -----------------------------------------------------------------------------------

// conf('ws://localhost:9001','');