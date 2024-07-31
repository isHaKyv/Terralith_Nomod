# 1 "C:\\Users\\Syku\\Downloads\\TERRALITH\\TERRALITH.ino"
# 2 "C:\\Users\\Syku\\Downloads\\TERRALITH\\TERRALITH.ino" 2

void setup() {
  Serial0.begin(115200);
  pinMode(LED_BUILTIN, 0x03);
}

void loop() {
  digitalWrite(LED_BUILTIN, 0x1); // Encender el LED
  Serial0.println("Led encendido"); // Aquí falta un punto y coma
  delay(1000); // Esperar 1 segundo

  digitalWrite(LED_BUILTIN, 0x0); // Apagar el LED
  Serial0.println("Led apagado"); // Aquí falta un punto y coma
  delay(1000); // Esperar 1 segundo
}
