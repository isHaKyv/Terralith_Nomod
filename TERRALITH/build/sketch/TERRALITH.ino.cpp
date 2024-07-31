#line 1 "C:\\Users\\Syku\\Downloads\\TERRALITH\\TERRALITH.ino"
#include <Arduino.h>

#line 3 "C:\\Users\\Syku\\Downloads\\TERRALITH\\TERRALITH.ino"
void setup();
#line 8 "C:\\Users\\Syku\\Downloads\\TERRALITH\\TERRALITH.ino"
void loop();
#line 3 "C:\\Users\\Syku\\Downloads\\TERRALITH\\TERRALITH.ino"
void setup() {
  Serial.begin(115200);
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);  // Encender el LED
  Serial.println("Led encendido");  // Aquí falta un punto y coma
  delay(1000);                      // Esperar 1 segundo
  
  digitalWrite(LED_BUILTIN, LOW);   // Apagar el LED
  Serial.println("Led apagado");    // Aquí falta un punto y coma
  delay(1000);                      // Esperar 1 segundo
}

