var configBtn = document.getElementById('conf_btn');
var pubBtn = document.getElementById('pub_btn');
var subBtn = document.getElementById('sub_btn');
var unSubBtn = document.getElementById('un_sub_btn');
var confExpBtn = document.getElementById('conf_exp');
var subDebug = document.getElementById('sub_debug_window');
var conStatus = document.getElementById('con_status');
var debugWindow = document.getElementById('debug_window');

var subscibed = new Boolean(false);
var i = new Boolean(true);
var k =2;
var subMsgArray = [];
let csvContent = "data:text/csv;charset=utf-8,";

function conf(x, y) {
    window.clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)
    if (y.length != 0) {
        clientId = y;
    }

    window.host = x;
    window.activeTopic = '0';
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
        printToDebugWindow(err);
        client.end()
    })

    client.on('connect', function() {
            if (client.connected) {
                console.log('Connected to ' + host + '  | Client ID' + clientId);
                conStatus.textContent = 'Connected';
                document.getElementsByClassName('con_status_div')[0].style.backgroundColor = '#5bce74';
                printToDebugWindow('Connected to ' + host + '  | Client ID : ' + clientId);
                expand(true);
                connection_stat();
            } else {
                conStatus.textContent = 'Disconnected';
                conStatus.style.backgroundColor =  '#e77a7a';
            }
    })

    client.on('message', function(topic, message) {
        console.log('Received "' + message.toString() + '" from topic "' + topic.toString() + '"');
        printSubmsg(message.toString());
    })
}

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
    conStatus.textContent = client.connected ? 'Connected' : 'Disconected';
    if(!client.connected) {
        alert( 'Disconnected from ' + host)
        printToDebugWindow('Disconnected from ' + host);
        expand(false);
    }
    else{
    setTimeout(connection_stat,1000);
    }
}

function printToDebugWindow(msg){
    if(msg === document.getElementsByClassName('msg')[0].innerText || k-1+ " " +msg === document.getElementsByClassName('msg')[0].innerText){
        var template = [];
        template.push(
            '<div style="color:#056676;font-family: "Baloo Tammudu 2", sans-serif;">',
                '<span>' + time()+ '</span>',
            '</div>',
            '<div class="msg" style="font-family: "Raleway", sans-serif;">',
            '<span style="color:red"><b>' + k + '</b></span> <span><b>' + msg + '</b></span>',
            '</div>'
        );
        document.getElementsByClassName('msg_div')[0].innerHTML = template.join('');;
        k=k+1;
        console.log('inside is prev msg')
    }
    else{
        console.log(document.getElementsByClassName('msg')[0].innerText);
        var diva = document.createElement('div');
        diva.className = 'msg_div';
        var template = [];
        template.push(
            '<div style="color:#056676;font-family: "Baloo Tammudu 2", sans-serif;">',
                '<span>' + time()+ '</span>',
            '</div>',
            '<div class="msg" style="font-family: "Raleway", sans-serif;">',
                '<span><b>' + msg + '</b></span>',
            '</div>'
        );
        diva.innerHTML = template.join('');
        debugWindow.prepend(diva);
        k=2;
    }


}

function printSubmsg(msg){
    subMsgArray.push(time()+','+msg);
    console.log(subMsgArray);
    var diva = document.createElement('div');
    diva.className = 'msg_div';
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
    subDebug.prepend(diva);
}

function unSubscribe() {
    subMsgArray.forEach( function (line){
        csvContent += line + "\r\n";
    });
    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
    if(subscibed){
        client.unsubscribe(activeTopic, function(err) {
            if (!err) {
                subscibed = false;
                subDebug.textContent = ('');
                console.log('Unsubscribed from : ' + activeTopic);
                document.getElementById('activeTopic').textContent = '';
                printToDebugWindow('Unsubscribed from : ' + activeTopic);
                document.getElementsByClassName('unsub_btn')[0].style.display ="none";
                activeTopic = '';
            }
        });
    }
}

function subscribe() {
    const newTopic = document.getElementById("sub_topic").value;
    if (newTopic.length != 0) {
        if(newTopic===activeTopic){
            printToDebugWindow('Already subscribed to : ' + activeTopic);
        }
        else{
             if(subscibed === true){
                unSubscribe();
            }
            client.subscribe(newTopic, function(err) {
                if (!err) {
                    subscibed = true;
                    activeTopic = newTopic;
                    console.log('Subscribed to : ' + activeTopic);
                    printToDebugWindow('Subscribed to : ' + activeTopic);
                    document.getElementsByClassName('unsub_btn')[0].style.display ="inline";
                    document.getElementById('activeTopic').textContent = '    [ Topic : '+activeTopic +' ]';
                }
            });
        } 
    }
    else {
            printToDebugWindow('Topic can\'t be blank');
            console.log('Topic can\'t be blank');
    }

}

confExpBtn.addEventListener('click',function exp(){
    console.log('exp btn pressed');
    expand(i);
    i = !i;
});

configBtn.addEventListener('click', function config() {
    brocker = document.getElementById("host").value;
    port = document.getElementById("port").value;
    clientId = document.getElementById("clientId").value;
    if (brocker.length != 0 || port.length != 0) {
        var host = 'ws://' + brocker + ':' + port
        conf(host, clientId);
    } else {
        printToDebugWindow('Values can\'t be blank');
        console.log('Values can\'t be blank');
    }
});

pubBtn.addEventListener('click', function publish() {
    x = document.getElementById("msg").value;
    y = document.getElementById("pub_topic").value;
    if (y.length != 0) {
        if (x.length != 0) {
            client.publish(y, x)
            printToDebugWindow('Published "' + x + '" to topic "' + y);
            console.log('Published "' + x + '"to topic "' + y + '"');
        } else {
            printToDebugWindow('Message can\'t be blank');
            console.log('Message can\'t be blank');
        }
    } else {
        if (x.length != 0) {
            printToDebugWindow('Topic can\'t be blank');
            console.log('Topic can\'t be blank');
        } else {
            printToDebugWindow('Topic and Message can\'t be blank');
            console.log('Topic and Message can\'t be blank');
        }
    }

});

subBtn.addEventListener('click', subscribe);

unSubBtn.addEventListener('click', unSubscribe);

conf('ws://localhost:9001','');
