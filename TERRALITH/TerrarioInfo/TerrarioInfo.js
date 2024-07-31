document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const addTerrarioBtn = document.getElementById('add-terrario-btn');
    const closeBtn = document.querySelector('.close-btn');
    const terrarioForm = document.getElementById('terrario-form');
    const terrarioItems = document.getElementById('terrario-items');
    const infoPanel = document.getElementById('info-panel');
    const infoImg = document.getElementById('info-img');
    const infoDate = document.getElementById('info-date');
    const infoData = document.getElementById('info-data');
    const viewDataBtn = document.getElementById('view-data-btn');
    const terrarios = [];

    addTerrarioBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    terrarioForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('terrario-name').value;
        const file = document.getElementById('terrario-img').files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            const newTerrario = {
                name: name,
                imgSrc: e.target.result,
                date: new Date().toLocaleString(),
                data: 'HUM: 86% TEMP: 24C CO2: 1201'
            };
            terrarios.push(newTerrario);
            renderTerrarios();
            modal.style.display = 'none';
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    });

    function renderTerrarios() {
        terrarioItems.innerHTML = '';
        terrarios.forEach((terrario, index) => {
            const terrarioItem = document.createElement('div');
            terrarioItem.classList.add('terrario-item');
            terrarioItem.innerHTML = `
                <img src="${terrario.imgSrc}" alt="Terrario">
                <p>${terrario.name}</p>
            `;
            terrarioItem.addEventListener('click', () => {
                infoPanel.style.display = 'flex';
                infoImg.src = terrario.imgSrc;
                infoDate.textContent = `Fecha de Registro: ${terrario.date}`;
                infoData.textContent = `Últimos Datos Guardados: ${terrario.data}`;
                viewDataBtn.onclick = () => window.location.href = '/soilMoistureServer/data/index.html';
            });
            terrarioItems.appendChild(terrarioItem);
        });
    }
});
