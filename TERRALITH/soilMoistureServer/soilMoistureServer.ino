#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <WebSocketsServer.h>
#include <SPIFFS.h>
#include <DHT.h>

// Credenciales para el punto de acceso
const char *ssid = "EmlitoWapo";
const char *password = "123456789";

// Servidores
AsyncWebServer server(80);
WebSocketsServer webSocket(81);
const unsigned long sendInterval = 1000;

// Sensor de humedad de suelo
const uint16_t dry = 636; // Valor de cal para sensor seco
const uint16_t wet = 265; // Valor cal para sensor húmedo
const uint8_t sensorPin = 35;
uint16_t sensorReading;

// Sensor de temperatura DHT11
#define DHTPIN 26
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Sensor de proximidad
const uint8_t proximitySensorPin = 34; // Cambia este valor al pin correcto
uint16_t proximityReading;

void setup() {
    Serial.begin(115200);
    analogReadResolution(10);

    // Configurar el ESP32 como punto de acceso
    WiFi.softAP(ssid, password);

    Serial.println();
    Serial.println("Punto de acceso configurado");
    Serial.print("Direccion IP: ");
    Serial.println(WiFi.softAPIP());

    if (SPIFFS.begin(true)) {
        Serial.println("SPIFFS montada satisfactoriamente");

        // Imprime la lista de archivos en el directorio "data" (Opcional)
        File root = SPIFFS.open("/");
        File file = root.openNextFile();
        while (file) {
            Serial.print("Archivo: ");
            Serial.println(file.name());
            file = root.openNextFile();
        }
    } else {
        Serial.println("Error montando SPIFFS");
    }

    server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
        request->send(SPIFFS, "/index.html", "text/html");
    });

    // Ruta para cargar el archivo style.css
    server.on("/style.css", HTTP_GET, [](AsyncWebServerRequest *request) {
        request->send(SPIFFS, "/style.css", "text/css");
    });

    // Ruta para cargar el archivo script.js
    server.on("/script.js", HTTP_GET, [](AsyncWebServerRequest *request) {
        request->send(SPIFFS, "/script.js", "text/javascript");
    });

    server.onNotFound(notFound);
    server.begin();

    webSocket.begin();
    webSocket.onEvent(handleWebSocketMessage);

    dht.begin();
}

void loop() {
    webSocket.loop(); // WebSocket events

    static uint32_t prevMillis = 0;
    if (millis() - prevMillis >= sendInterval) {
        prevMillis = millis();

        // Lectura del sensor de humedad del suelo y conversión a porcentaje
        sensorReading = analogRead(sensorPin);
        uint16_t moisturePercentage = map(sensorReading, wet, dry, 100, 0);
        moisturePercentage = constrain(moisturePercentage, 0, 100);

        // Leer la temperatura del DHT11
        float temperature = dht.readTemperature();

        // Leer el valor del sensor de proximidad
        proximityReading = analogRead(proximitySensorPin);

        String status;
        if (moisturePercentage < 25)
            status = "Suelo muy seco - Regar!";
        else if (moisturePercentage >= 25 && moisturePercentage < 70)
            status = "Humedad de Suelo Ideal";
        else
            status = "Suelo demasiado HUMEDO!";

        sendData(moisturePercentage, temperature, proximityReading, status);
    }
}

void sendData(uint16_t humidityPercentage, float temperature, uint16_t proximity, String statusMessage) {
    // Construimos el JSON
    String data = "{\"humidity\":" + String(humidityPercentage) + ",\"temperature\":" + String(temperature) + ",\"proximity\":" + String(proximity) + ",\"status\":\"" + statusMessage + "\"}";

    // Enviamos JSON serializado via WebSocket
    webSocket.broadcastTXT(data);

    // Lo podemos imprimir en el monitor opcionalmente (Debugging)
    Serial.println(data);
}

void handleWebSocketMessage(uint8_t num, WStype_t type, uint8_t *payload, size_t length) {
    switch (type) {
        case WStype_DISCONNECTED:
            Serial.printf("[%u] Desconectado!\n", num);
            break;
        case WStype_CONNECTED: {
            IPAddress ip = webSocket.remoteIP(num);
            Serial.printf("[%u] Conectado desde %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);
        } break;
        case WStype_TEXT:
            Serial.printf("[%u] Texto recibido: %s\n", num, payload);
            break;
    }
}

void notFound(AsyncWebServerRequest *request) {
    request->send(404, "text/plain", "Pagina no encontrada!");
}
