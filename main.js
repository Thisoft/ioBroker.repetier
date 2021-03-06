/* jshint -W097 */// jshint strict:false
/*jslint node: true */
'use strict';

var utils = require(__dirname + '/lib/utils'); // Get common adapter utils
var request = require('request');

var adapter = new utils.Adapter('repetier');

adapter.on('ready', function () {
    main();
});

function main() {

    var repetierIP = adapter.config.repetierIP;
    var repetierPort = adapter.config.repetierPort;
    var repetierApi = adapter.config.repetierApi;
    var printerrepone = adapter.config.printerone;
    var printerone = printerrepone.replace(/ /g, '_'); //Leerzeichen ersetzen
    var printerreptwo = adapter.config.printertwo;
    var printertwo = printerreptwo.replace(/ /g, '_'); //Leerzeichen ersetzen
    var printerrepthree = adapter.config.printerthree;
    var printerthree = printerrepthree.replace(/ /g, '_'); //Leerzeichen ersetzen
    let path = repetierIP.replace(/\./g, '_') + '.' ;

    adapter.log.debug('repetier IP: ' + repetierIP);
    
//Erster request für "listPrinter"


 request(
            {
                url:  'http://' + repetierIP + ':' + repetierPort + '/printer/api/' + printerone + '?a=listPrinter&data&apikey=' + repetierApi,
                json: true
            },
            function (error, response, content) {
                adapter.log.debug('Request done');

                if (!error && response.statusCode == 200) {

// Abfrage "listPrinter" erster Drucker

                    if (content && content.hasOwnProperty(0)) {
                        for (var key1 in content[0]) {
                            var obj1 = content[0][key1];
 //                                 adapter.log.debug('key: ' + key1);
 //                        adapter.log.debug('obj: ' + obj1);
      
                             adapter.setObjectNotExists(path + printerone + '.Druckteil', {
                                type: 'state',
                                common: {
                                    name: 'Druckteil',
                                },
                                native: {}
                            });
                        adapter.setState(path + printerone + '.Druckteil', {val: content[0].job, ack: true});

  //Wenn nicht gedruckt wird, keine Anfrage der Zeiten, da im JSON nicht vorhanden
  
            if(content[0].job !== 'none'){   
                        
                            adapter.setObjectNotExists(path + printerone + '.GesamtDruckzeit', {
                                type: 'state',
                                common: {
                                    name: 'GesamtDruckzeit',
                                },
                                native: {}
                            });
                        adapter.setState(path + printerone + '.GesamtDruckzeit', {val: Math.round (1 * content[0].printTime / 60) , ack: true});
                        
                            adapter.setObjectNotExists(path + printerone + '.DruckzeitAbgeschlossen', {
                                type: 'state',
                                common: {
                                    name: 'DruckzeitAbgeschlossen',
                                },
                                native: {}
                            });
                        adapter.setState(path + printerone + '.DruckzeitAbgeschlossen', {val: Math.round (1 * content[0].printedTimeComp.toFixed(2) / 60), ack: true});
                        
                          adapter.setObjectNotExists(path + printerone + '.Restzeit', {
                                type: 'state',
                                common: {
                                    name: 'Restzeit',
                                },
                                native: {}
                            });
                        adapter.setState(path + printerone + '.Restzeit', {val: Math.round ((1 * content[0].printTime.toFixed(2) / 60)-(1 * content[0].printedTimeComp / 60)), ack: true});   
                           
                            adapter.setObjectNotExists(path + printerone + '.Status', {
                                type: 'state',
                                common: {
                                    name: 'Status',
                                },
                                native: {}
                            });
                        adapter.setState(path + printerone + '.Status', {val: content[0].done.toFixed(2) + ' %', ack: true});
                          }
                          
//Wenn Druckteil fertig, dann Zeiten löschen 

            if(content[0].job === 'none'){       
            
             adapter.setState(path + printerone + '.GesamtDruckzeit', '----');
             adapter.setState(path + printerone + '.DruckzeitAbgeschlossen', '----'); 
             adapter.setState(path + printerone + '.Restzeit', '----');
             adapter.setState(path + printerone + '.Status', '----');
                           }    
                        }      
                    }
                    
// Abfrage "listPrinter" zweiter Drucker

                if (content && content.hasOwnProperty(1)) {
                        for (var key2 in content[1]) {
                            var obj2 = content[1][key2];
 //                                adapter.log.debug('key: ' + key2);
 //                        adapter.log.debug('obj: ' + obj2);
      
                             adapter.setObjectNotExists(path + printertwo + '.Druckteil', {
                                type: 'state',
                                common: {
                                    name: 'Druckteil',
                                },
                                native: {}
                            });
                        adapter.setState(path + printertwo + '.Druckteil', {val: content[1].job, ack: true});
            
  //Wenn nicht gedruckt wird, keine Anfrage der Zeiten, da im JSON nicht vorhanden            
                        
            if(content[1].job !== 'none'){
                        
                            adapter.setObjectNotExists(path + printertwo + '.GesamtDruckzeit', {
                                type: 'state',
                                common: {
                                    name: 'GesamtDruckzeit',
                                },
                                native: {}
                            });
                        adapter.setState(path + printertwo + '.GesamtDruckzeit', {val: Math.round (1 * content[1].printTime / 60), ack: true});
                        
                            adapter.setObjectNotExists(path + printertwo + '.DruckzeitAbgeschlossen', {
                                type: 'state',
                                common: {
                                    name: 'DruckzeitAbgeschlossen',
                                },
                                native: {}
                            });
                        adapter.setState(path + printertwo + '.DruckzeitAbgeschlossen', {val: Math.round (1 * content[1].printedTimeComp.toFixed(2) / 60), ack: true});
                        
                          adapter.setObjectNotExists(path + printertwo + '.Restzeit', {
                                type: 'state',
                                common: {
                                    name: 'Restzeit',
                                },
                                native: {}
                            });
                        adapter.setState(path + printertwo + '.Restzeit', {val: Math.round ((1 * content[1].printTime.toFixed(2) / 60)-(1 * content[1].printedTimeComp / 60)), ack: true});                         
                    
                            adapter.setObjectNotExists(path + printertwo + '.Status', {
                                type: 'state',
                                common: {
                                    name: 'Status',
                                },
                                native: {}
                            });
                        adapter.setState(path + printertwo + '.Status', {val: content[1].done.toFixed(2) + ' %', ack: true});
                          }

//Wenn Druckteil fertig, dann Zeiten löschen 
                          
                          
             if(content[1].job === 'none'){      
            
             adapter.setState(path + printertwo + '.GesamtDruckzeit', '----');
             adapter.setState(path + printertwo + '.DruckzeitAbgeschlossen', '----'); 
             adapter.setState(path + printertwo + '.Restzeit', '----');
             adapter.setState(path + printertwo + '.Status', '----');
            
                           }   
            }      
        } 
                    
  
// Abfrage "listPrinter" dritter Drucker

                    if (content && content.hasOwnProperty(2)) {
                        for (var key3 in content[2]) {
                            var obj3 = content[2][key3];
 //                                adapter.log.debug('key: ' + key3);
 //                        adapter.log.debug('obj: ' + obj3);
      
                             adapter.setObjectNotExists(path + printerthree + '.Druckteil', {
                                type: 'state',
                                common: {
                                    name: 'Druckteil',
                                },
                                native: {}
                            });
                        adapter.setState(path + printerthree + '.Druckteil', {val: content[2].job, ack: true});

//Wenn nicht gedruckt wird, keine Anfrage der Zeiten, da im JSON nicht vorhanden
                        
            if(content[2].job !== 'none'){
                        
                            adapter.setObjectNotExists(path + printerthree + '.GesamtDruckzeit', {
                                type: 'state',
                                common: {
                                    name: 'GesamtDruckzeit',
                                },
                                native: {}
                            });
                        adapter.setState(path + printerthree + '.GesamtDruckzeit', {val: Math.round (1 * content[2].printTime / 60), ack: true});
                        
                            adapter.setObjectNotExists(path + printerthree + '.DruckzeitAbgeschlossen', {
                                type: 'state',
                                common: {
                                    name: 'DruckzeitAbgeschlossen',
                                },
                                native: {}
                            });
                        adapter.setState(path + printerthree + '.DruckzeitAbgeschlossen', {val: Math.round (1 * content[2].printedTimeComp.toFixed(2) / 60), ack: true});
                    
                          adapter.setObjectNotExists(path + printerthree + '.Restzeit', {
                                type: 'state',
                                common: {
                                    name: 'Restzeit',
                                },
                                native: {}
                            });
                        adapter.setState(path + printerthree + '.Restzeit', {val: Math.round ((1 * content[2].printTime.toFixed(2) / 60)-(1 * content[2].printedTimeComp / 60)), ack: true});                         
                    
                            adapter.setObjectNotExists(path + printerthree + '.Status', {
                                type: 'state',
                                common: {
                                    name: 'Status',
                                },
                                native: {}
                            });
                        adapter.setState(path + printerthree + '.Status', {val: content[2].done.toFixed(2) + ' %', ack: true});
                          }
                          
//Wenn Druckteil fertig, dann Zeiten löschen 
                          
             if(content[2].job === 'none'){      
            
             adapter.setState(path + printerthree + '.GesamtDruckzeit', '----');
             adapter.setState(path + printerthree + '.DruckzeitAbgeschlossen', '----'); 
             adapter.setState(path + printerthree + '.Restzeit', '----');
             adapter.setState(path + printerthree + '.Status', '----');
            
                              }                             
                        }      
                    }                    
                }
            }
      );    


// Zweiter Request für "stateList"

        request(
            {
                url: 'http://' + repetierIP + ':' + repetierPort + '/printer/api/' + printerone + '?a=stateList&data&apikey=' + repetierApi,
                json: true
            },
            function (error, response, content) {
                adapter.log.debug('Request done');

                if (!error && response.statusCode == 200) {
      
                    if (content && content.hasOwnProperty(printerone || printertwo || printerthree)) {
                        for (var key in content[printerone]) {
                            var obj = content[printerone][key];
 //                                 adapter.log.debug('key: ' + key);
 //                         adapter.log.debug('obj: ' + obj);
    
//Path write Printer One 
                            adapter.setObjectNotExists(path + printerone, {
                                type: 'channel',
                                common: {
                                    name: printerone,
                                },
                                native: {}
                            });
                            
                            adapter.setObjectNotExists(path + printerone + '.Extruder', {
                                type: 'channel',
                                common: {
                                    name: printerone + '.Extruder',
                                },
                                native: {}
                            });
                            
                            
                            adapter.setObjectNotExists(path + printerone + '.Bett', {
                                type: 'channel',
                                common: {
                                    name: printerone + '.Bett',
                                },
                                native: {}
                            });
                            
//Path write Printer Two

                            adapter.setObjectNotExists(path + printertwo, {
                                type: 'channel',
                                common: {
                                    name: printertwo,
                                },
                                native: {}
                            });
                            
                            adapter.setObjectNotExists(path + printertwo + '.Extruder', {
                                type: 'channel',
                                common: {
                                    name: printertwo + '.Extruder',
                                },
                                native: {}
                            });
                            
                            
                            adapter.setObjectNotExists(path + printertwo + '.Bett', {
                                type: 'channel',
                                common: {
                                    name: printertwo + '.Bett',
                                },
                                native: {}
                            });
                            
//Path write Printer Three

                            adapter.setObjectNotExists(path + printerthree, {
                                type: 'channel',
                                common: {
                                    name: printerthree,
                                },
                                native: {}
                            });
                            
                            adapter.setObjectNotExists(path + printerthree + '.Extruder', {
                                type: 'channel',
                                common: {
                                    name: printerthree + '.Extruder',
                                },
                                native: {}
                            });
                            
                            
                            adapter.setObjectNotExists(path + printerthree + '.Bett', {
                                type: 'channel',
                                common: {
                                    name: printerthree + '.Bett',
                                },
                                native: {}
                            });
                        

//Data write Printer One

                        if (content && content.hasOwnProperty(printerone)) {

                       adapter.setObjectNotExists(path + printerone + '.Firmware', {
                                type: 'state',
                                common: {
                                    name: 'Firmware',
                                },
                                native: {}
                            });
                            adapter.setState(path + printerone + '.Firmware', {val: content[printerone].firmware, ack: true});

                       adapter.setObjectNotExists(path + printerone + '.Layer', {
                                type: 'state',
                                common: {
                                    name: 'Layer',
                                },
                                native: {}
                            });
                            adapter.setState(path + printerone + '.Layer', {val: content[printerone].layer, ack: true});
                        
                       adapter.setObjectNotExists(path + printerone + '.SpeedMultiply', {
                                type: 'state',
                                common: {
                                    name: 'SpeedMultiply',
                                },
                                native: {}
                            });
                            adapter.setState(path + printerone + '.SpeedMultiply', {val: content[printerone].speedMultiply, ack: true});
                        
                        
                        adapter.setObjectNotExists(path + printerone + '.FlowMultiply', {
                                type: 'state',
                                common: {
                                    name: 'FlowMultiply',
                                },
                                native: {}
                            });
                            adapter.setState(path + printerone + '.FlowMultiply', {val: content[printerone].flowMultiply, ack: true});
                                                                        
                        
                        adapter.setObjectNotExists(path + printerone + '.Extruder.aktuelleTemperatur', {
                                type: 'state',
                                common: {
                                    name: 'aktuelleTemperatur',
                                },
                                native: {}
                            });
                            adapter.setState(path + printerone + '.Extruder.aktuelleTemperatur', {val: content[printerone].extruder[0].tempRead, ack: true});
     
     
                        adapter.setObjectNotExists(path + printerone + '.Bett.aktuelleTemperatur', {
                                type: 'state',
                                common: {
                                    name: 'aktuelleTemperatur',
                                },
                                native: {}
                            });
                            adapter.setState(path + printerone + '.Bett.aktuelleTemperatur', {val: content[printerone].heatedBeds[0].tempRead, ack: true});                                

                        }
                       
//Data write Printer Two                          
                       
                        if (content && content.hasOwnProperty(printertwo)) {

                       adapter.setObjectNotExists(path + printertwo + '.Firmware', {
                                type: 'state',
                                common: {
                                    name: 'Firmware',
                                },
                                native: {}
                            });
                            adapter.setState(path + printertwo + '.Firmware', {val: content[printertwo].firmware, ack: true});

                      adapter.setObjectNotExists(path + printertwo + '.Layer', {
                                type: 'state',
                                common: {
                                    name: 'Layer',
                                },
                                native: {}
                            });
                            adapter.setState(path + printertwo + '.Layer', {val: content[printertwo].layer, ack: true});
                        
                       adapter.setObjectNotExists(path + printertwo + '.SpeedMultiply', {
                                type: 'state',
                                common: {
                                    name: 'SpeedMultiply',
                                },
                                native: {}
                            });
                            adapter.setState(path + printertwo + '.SpeedMultiply', {val: content[printertwo].speedMultiply, ack: true});
                        
                        adapter.setObjectNotExists(path + printertwo + '.FlowMultiply', {
                                type: 'state',
                                common: {
                                    name: 'FlowMultiply',
                                },
                                native: {}
                            });
                            adapter.setState(path + printertwo + '.FlowMultiply', {val: content[printertwo].flowMultiply, ack: true});
                                                                                                                       
                        
                        adapter.setObjectNotExists(path + printertwo + '.Extruder.aktuelleTemperatur', {
                                type: 'state',
                                common: {
                                    name: 'aktuelleTemperatur',
                                },
                                native: {}
                            });
                            adapter.setState(path + printertwo + '.Extruder.aktuelleTemperatur', {val: content[printertwo].extruder[0].tempRead, ack: true});
     
     
                        adapter.setObjectNotExists(path + printertwo + '.Bett.aktuelleTemperatur', {
                                type: 'state',
                                common: {
                                    name: 'aktuelleTemperatur',
                                },
                                native: {}
                            });
                            adapter.setState(path + printertwo + '.Bett.aktuelleTemperatur', {val: content[printertwo].heatedBeds[0].tempRead, ack: true});                                
                        }

//Data write Printer Three


                if (content && content.hasOwnProperty(printerthree)) {

                       adapter.setObjectNotExists(path + printerthree + '.Firmware', {
                                type: 'state',
                                common: {
                                    name: 'Firmware',
                                },
                                native: {}
                            });
                            adapter.setState(path + printerthree + '.Firmware', {val: content[printerthree].firmware, ack: true});

                       adapter.setObjectNotExists(path + printerthree + '.Layer', {
                                type: 'state',
                                common: {
                                    name: 'Layer',
                                },
                                native: {}
                            });
                            adapter.setState(path + printerthree + '.Layer', {val: content[printerthree].layer, ack: true});
                        
                       adapter.setObjectNotExists(path + printerthree + '.SpeedMultiply', {
                                type: 'state',
                                common: {
                                    name: 'SpeedMultiply',
                                },
                                native: {}
                            });
                            adapter.setState(path + printerthree + '.SpeedMultiply', {val: content[printerthree].speedMultiply, ack: true});
                        
                        adapter.setObjectNotExists(path + printerthree + '.FlowMultiply', {
                                type: 'state',
                                common: {
                                    name: 'FlowMultiply',
                                },
                                native: {}
                            });
                            adapter.setState(path + printerthree + '.FlowMultiply', {val: content[printerthree].flowMultiply, ack: true});
                                                                                                                        
                        
                        adapter.setObjectNotExists(path + printerthree + '.Extruder.aktuelleTemperatur', {
                                type: 'state',
                                common: {
                                    name: 'aktuelleTemperatur',
                                },
                                native: {}
                            });
                            adapter.setState(path + printerthree + '.Extruder.aktuelleTemperatur', {val: content[printerthree].extruder[0].tempRead, ack: true});
     
     
                        adapter.setObjectNotExists(path + printerthree + '.Bett.aktuelleTemperatur', {
                                type: 'state',
                                common: {
                                    name: 'aktuelleTemperatur',
                                },
                                native: {}
                            });
                            adapter.setState(path + printerthree + '.Bett.aktuelleTemperatur', {val: content[printerthree].heatedBeds[0].tempRead, ack: true});                                

                            }
                        }
                    } else {
                        adapter.log.warn('Response has no valid content. Check IP address and try again.');
                    }

                } else {
                    adapter.log.error(error);
                }
            }
         );

        setTimeout(function () {
        adapter.stop();
    }, 4000);
}
