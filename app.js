const bodyParser = require('body-parser')
const port = 8080
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var os = require('os-utils');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'));


var porcentajeRAM = [0];
var porcentajeCPU = [0];


setInterval( function(){
    
    var fs = require("fs")
	var bnf = fs.readFileSync("/proc/meminfo","utf8");
	var lineas = bnf.split("\n");

	var numProcesos = 0;
	for(var i=0; i<numProcesos; i++){
		try{

		}catch(e){

		}
	}

	
	var valores = {};

	for(var i=0; i<lineas.length; i++){
		var aux = lineas[i];
		var ar = aux.split(":");
		if(ar.length!=2){
			continue;
		}

		valores[ar[0]] = ar[1].trim();
	}

	var find = ' kB';
    var re = new RegExp(find,'g');
    var tex = valores.MemTotal;
	var letra = tex.replace(re,'');
	var tex2 = valores.Active;
	var letra2 = tex2.replace(re,'');
            
    var porc = ((letra2-letra)/letra)*100;
    porc = 100 + porc;

    var ramtotal = trunc((letra/1000),2);
    var ramconsumida = trunc((letra2)/1000,2);
    var ramconsumidaporcentaje = trunc(porc,2);
	console.log("Memoria RAM Total: "+ramtotal);
	console.log("Memoria RAM Consumida: "+ramconsumida);
	console.log("Porcentaje de consumo de RAM: "+ ramconsumidaporcentaje);

    io.sockets.emit('graph', porcentajeRAM, porcentajeCPU, ramtotal, ramconsumida, ramconsumidaporcentaje);
    os.cpuUsage(function(v){
        var porCPU = trunc((v*100),2);
        console.log("% DE USO CPU : "+ porCPU);
        porcentajeCPU.push(porCPU);
        porcentajeRAM.push(ramconsumidaporcentaje);
    });

  }, 5000);

server.listen(port, () => console.log(`Example app listening on port ${port}!`));

function trunc (x, posiciones = 0) {
	var s = x.toString()
	var l = s.length
	var decimalLength = s.indexOf('.') + 1
  
	if (l - decimalLength <= posiciones){
	  return x
	}
	// Parte decimal del número
	var isNeg  = x < 0
	var decimal =  x % 1
	var entera  = isNeg ? Math.ceil(x) : Math.floor(x)
	var decimalFormated = Math.floor(
	  Math.abs(decimal) * Math.pow(10, posiciones)
	)
	
	var finalNum = entera + 
	  ((decimalFormated / Math.pow(10, posiciones))*(isNeg ? -1 : 1))
	
	return finalNum
  }