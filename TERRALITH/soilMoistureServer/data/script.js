const moistureElem = document.getElementById("moisture");
const water = document.getElementById("water");
const temperatureElem = document.getElementById("temperature");
const proximityElem = document.getElementById("proximity");
const message = document.getElementById("statusMsg");
const url = "ws://192.168.4.1:81/";
let moisturePercent = 0;
let temperature = 0;
let proximity = 0;
let animationInterval; // Almacena la referencia al intervalo de animación

// Conexión WebSocket
const ws = new WebSocket(url);

// Manejar los mensajes WebSocket
ws.onmessage = function (event) {
    const data = JSON.parse(event.data);
    
    // Calcular la diferencia entre el nuevo valor de humedad y el porcentaje actual
    const moistureDiff = Math.abs(data.humidity - moisturePercent);
    
    // Actualizar los porcentajes con los valores recibidos
    moisturePercent = data.humidity;
    temperature = data.temperature;
    proximity = data.proximity;
    message.innerText = data.status;

    // Detener la animación actual si está en ejecución
    if (animationInterval) {
        clearInterval(animationInterval);
    }

    // Animar el nivel de agua
    animateWaterLevel(moistureDiff);

    // Actualizar el valor de la temperatura
    temperatureElem.innerText = `${temperature}°C`;

    // Actualizar el valor de la proximidad
    proximityElem.innerText = proximity;
};

// Función para animar el nivel de agua
function animateWaterLevel(diff) {
    let currentPercent = parseInt(moistureElem.innerHTML); // Porcentaje inicial
    
    animationInterval = setInterval(function () {
        // Incrementar o decrementar el porcentaje actual en función de la diferencia
        if (moisturePercent > currentPercent) {
            currentPercent++;
        } else {
            currentPercent--;
        }
        
        moistureElem.innerHTML = `${currentPercent}%`;
        water.style.transform = `translate(0, ${100 - currentPercent}%)`;

        // Detener la animación cuando el porcentaje actual coincida con el de humedad recibido
        if (currentPercent === moisturePercent) {
            clearInterval(animationInterval);
        }
    }, 60);
}
