/*
PUERTA AUTOMATICA CON RFID
by: http://elprofegarcia.com/

*/

#include <SPI.h>      //  Libreria SPI
#include <MFRC522.h>      // Libreria  MFRC522
#include <Servo.h>     // Libreria  SERVO
#include <ArduinoJson.h>

#define RST_PIN  9      // Pin de reset
#define SS_PIN  10      // Pin de slave select


MFRC522 mfrc522(SS_PIN, RST_PIN); // Objeto mfrc522 enviando pines de slave select y reset

byte LecturaUID[4];         // Array para almacenar el UID leido
byte Usuario1[4]= {0x28, 0xE5, 0xE5, 0xA2} ;    // NUMERO DEL USUARIO 1 (ponga el de su tarjeta)
byte Usuario2[4]= {0x60, 0x5F, 0xFD, 0x1E} ;    // NUMERO DEL USUARIO 2 (ponga el de su tarjeta)
int analogo5=0;                                 // Variable de lectura del Analogo5 para sensor de obstaculos
Servo servoPT;                                 // Asocia la libreria servo a  servoPT

void enviarExitoF(const char* message){
  JsonDocument docExito;
  docExito["response"]= "success";
  docExito["message"]= message;


  serializeJson(docExito, Serial);
  Serial.println();
}
void enviarErrorF(const char* message){
  JsonDocument docExito;
  docExito["response"]= "error";
  docExito["message"]= message;


  serializeJson(docExito, Serial);
  Serial.println();
}


void setup() {
  
  Serial.begin(9600);     // inicializa comunicacion por monitor serie a 9600 bps
  SPI.begin();        // inicializa bus SPI
  mfrc522.PCD_Init();     // inicializa modulo lector
}
bool shouldReadCard = false;

void loop() {
  
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');  // Leer el comando completo
    if (command == "leerTarjeta") {
      shouldReadCard = true;  // Activar la bandera para leer la tarjeta
    }
  }

  if (shouldReadCard) {
    leerTarjeta();
    shouldReadCard = false;  // Resetear la bandera después de leer la tarjeta
  }
}
  

void leerTarjeta(){
  enviarExitoF("Coloca el tag");
  delay(2500);
  if ( ! mfrc522.PICC_IsNewCardPresent())   // si no hay una tarjeta presente
    return;           // retorna al loop esperando por una tarjeta
  
  if ( ! mfrc522.PICC_ReadCardSerial())     // si no puede obtener datos de la tarjeta
    return;           // retorna al loop esperando por otra tarjeta
      Serial.print("{ \"No_Tarjeta\": \"");
    for (byte i = 0; i < 4; i++) { // bucle recorre de a un byte por vez el UID
      if (mfrc522.uid.uidByte[i] < 0x10){   // si el byte leido es menor a 0x10
        
        }
        else{           // sino
        }

        LecturaUID[i]=mfrc522.uid.uidByte[i];     // almacena en array el byte del UID leido      
        }           
        mfrc522.PICC_HaltA();   // detiene comunicacion con tarjeta 
    Serial.print("0x"+String(LecturaUID[0], HEX) + " 0x" + String(LecturaUID[1], HEX) + " 0x" +String(LecturaUID[2], HEX) + " 0x"+ String(LecturaUID[3], HEX));
  Serial.print("\" }");
  Serial.println();
}


