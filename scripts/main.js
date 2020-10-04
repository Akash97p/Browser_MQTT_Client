var conf_btn = document.getElementById('conf_btn');
var pub_btn = document.getElementById('pub_btn');
var sub_btn = document.getElementById('sub_btn');
var un_sub_btn = document.getElementById('un_sub_btn');
var conf_exp_btn = document.getElementById('conf_exp');
var con_discon = document.getElementById('con_status_div');
var sub_debug = document.getElementById('sub_debug_window');
var con_status = document.getElementById('con_status');
var debug_window = document.getElementById('debug_window');

var new_sec = new Boolean(true);
var i = new Boolean(true);
var k =2;
var prevMsg ='';
let dw = ['dw1','dw2','dw3','dw4','dw5','dw6'];

function expand(cm) {
    if(cm){
        document.getElementsByClassName('conf_div')[0].style.display ="none";
        document.getElementsByClassName('pub_div')[0].style.gridRow ="2/4";
        document.getElementsByClassName('sub_div')[0].style.gridRow ="4/6";
        document.getElementsByClassName('sub_debug')[0].style.gridRow ="2/6";
        document.getElementById('conf_exp').className  = "exp_btn";
    }
    else{
        document.getElementsByClassName('conf_div')[0].style.display ="";
        document.getElementsByClassName('pub_div')[0].style.gridRow ="3/5";
        document.getElementsByClassName('sub_div')[0].style.gridRow ="5/6";
        document.getElementsByClassName('sub_debug')[0].style.gridRow ="3/6";
        document.getElementById('conf_exp').className  = "exp_btn_dwn";
    }
}

function time(){
    var d = new Date();
    var hr  = d.getHours();
    var mt  = d.getMinutes();
    var sec = d.getSeconds();
    var ms = d.getMilliseconds();
    if (hr>12){hr=hr-12; ms = ms +' PM';}
    return(hr+':'+mt+':'+sec+':'+ms);
}

function connection_stat(){
    document.getElementsByClassName('con_status_div')[0].style.backgroundColor = client.connected ?  '#5bce74' :'#e77a7a' ;
    con_status.textContent = client.connected ? 'Connected' : 'Disconected';
    if(!client.connected) {
        expand(false);
    }
    setTimeout(connection_stat,1000);
}

function write_debug_window(msg){
    if(msg === document.getElementById(dw[0]).innerText || k-1+ " " +msg === document.getElementById(dw[0]).innerText){
        document.getElementById(dw[0]).textContent = k+ " " +msg;
        k=k+1;
    }
    else{
        for (let index = dw.length; index >=2; index--) {
            document.getElementById(dw[index-1]).textContent = document.getElementById(dw[index-2]).innerText;
        }
    document.getElementById(dw[0]).textContent = msg
    k=2;
    }
}

function write_sub_debug_window(msg){
    var diva = document.createElement('div');
    diva.className = 'msg_div';
    // var pElem = document.createElement('p');
    // pElem.innerHTML = msg;
    // diva.append(pElem);
    // sub_debug.prepend(diva);
    var template = [];
    template.push(
        '<div style="color:#056676;font-family: "Baloo Tammudu 2", sans-serif;">',
            '<span>' + time()+ '</span>',
        '</div>',
        '<div style="font-family: "Raleway", sans-serif;">',
            '<span><b>' + msg + '</b></span>',
        '</div>'
    );
    diva.innerHTML = template.join('');
    sub_debug.prepend(diva);
}

conf_exp_btn.addEventListener('click',function exp(){
    console.log('exp btn pressed');
    expand(i);
    i = !i;
});

conf_btn.addEventListener('click', function config() {
    brocker = document.getElementById("host").value;
    port = document.getElementById("port").value;
    clientId = document.getElementById("clientId").value;
    if (brocker.length != 0 || port.length != 0) {
        var host = 'ws://' + brocker + ':' + port
        conf(host, clientId);
    } else {
        write_debug_window('Values can\'t be blank');
        console.log('Values can\'t be blank');
    }
});

pub_btn.addEventListener('click', function publish() {
    x = document.getElementById("msg").value;
    y = document.getElementById("pub_topic").value;
    if (y.length != 0) {
        if (x.length != 0) {
            client.publish(y, x)
            write_debug_window('Published "' + x + '" to topic "' + y);
            console.log('Published "' + x + '"to topic "' + y + '"');
        } else {
            write_debug_window('Message can\'t be blank');
            console.log('Message can\'t be blank');
        }
    } else {
        if (x.length != 0) {
            write_debug_window('Topic can\'t be blank');
            console.log('Topic can\'t be blank');
        } else {
            write_debug_window('Topic and Message can\'t be blank');
            console.log('Topic and Message can\'t be blank');
        }
    }

});

sub_btn.addEventListener('click', function subscribe() {
    x = document.getElementById("sub_topic").value;
    if (x.length != 0) {
        if(x===sub_topic && !new_sec){
            write_debug_window('Already subscribed to : ' + sub_topic);
        }
        else{
        if(!new_sec){
            client.unsubscribe(sub_topic, function(err) {
                if (!err) {
                    console.log('Unsubscribed from : ' + sub_topic);
                    write_debug_window('Unsubscribed from : ' + sub_topic);
                    document.getElementById('active_topic').textContent = '';
                    document.getElementsByClassName('unsub_btn')[0].style.display ="none";
            }
            })
        }
        client.subscribe(x, function(err) {
            if (!err) {
                write_debug_window('Subscribed to : ' + x);
                sub_topic = x;
                document.getElementById('active_topic').textContent = '    [ Topic : '+x +' ]';
                console.log('Subscribed to : ' + x);
                new_sec = false;
                document.getElementsByClassName('unsub_btn')[0].style.display ="inline";
            }
        })
    } 
}else {
        write_debug_window('Topic can\'t be blank');
        console.log('Topic can\'t be blank');
    }

});

un_sub_btn.addEventListener('click', function subscribe() {
    if(!new_sec){
        client.unsubscribe(sub_topic, function(err) {
            if (!err) {
                console.log('Unsubscribed from : ' + sub_topic);
                write_debug_window('Unsubscribed from : ' + sub_topic);
                    document.getElementById('active_topic').textContent = '';
                    sub_debug.textContent = ('');
                    document.getElementsByClassName('unsub_btn')[0].style.display ="none";
            }
        })
        new_sec = true;
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
        write_debug_window(err);
        client.end()
    })

    client.on('connect', function() {
            if (client.connected) {
                console.log('Connected to ' + host + '  | Client ID' + clientId);
                con_status.textContent = 'Connected';
                document.getElementsByClassName('con_status_div')[0].style.backgroundColor = '#5bce74';
                write_debug_window('Connected to ' + host + '  | Client ID : ' + clientId);
                expand(true);
                connection_stat();
            } else {
                con_status.textContent = 'Disconnected';
                con_status.style.backgroundColor =  '#e77a7a';
            }
    })

    client.on('message', function(topic, message) {
        console.log('Received "' + message.toString() + '" from topic "' + topic.toString() + '"')
        // sub_debug.textContent = 'Received "' + message.toString() + '" from topic "' + topic.toString() + '"';
        write_sub_debug_window(message.toString());
    })
}
// -----------------------------------------------------------------------------------

conf('ws://localhost:9001','');
