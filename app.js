const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

const NASA_API_KEY = 'lUkGfVa1XGW3DQwUSSVdzBQxSpAEyyi0yX8mjJPT';

async function getNasaEvents() {
  const eventPromises = [];
  for (let i = 0; i < 4; i++) {
    const date = randomDate(new Date(1995, 5, 16), new Date());
    const formattedDate = formatDate(date);
    eventPromises.push(axios.get(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${formattedDate}`));
  }
  const responses = await Promise.all(eventPromises);
  const events = responses.map(response => response.data);
  return events;
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

app.get('/', async (req, res) => {
  try {
    const events = await getNasaEvents();
    let html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Eventos de la NASA</title>
        <style>
        
          body {
            background-color: #E8DAEF;
            margin: 0; /* Elimina el margen predeterminado */
            padding: 20px; /* Agrega un espacio alrededor del contenido */
          }
          h1{
            text-align:center;
            }
          /* Estilos para las tarjetas */
          .card {
            flex: 1 0 calc(50% - 20px);
            max-width: 400px;
            border: 1px solid #ccc;
            border-radius: 5px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.8);
            margin: 10px; /* Agregamos un margen para separar las tarjetas */
            transition: box-shadow 0.3s ease, transform 0.3s ease; /* Transición suave para la sombra y transformación */
          }

          .card:hover {
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.8); /* Cambia la sombra al pasar el ratón */
            transform: scale(1.1); /* Efecto de zoom al pasar el ratón */
          }

          .card img {
            width: 100%;
            height: auto;
          }

          .card-content {
            padding: 20px;
          }

          .card-content h2 {
            margin-top: 0;
          }

          .card-content p {
            margin-bottom: 0;
          }
          
        </style>
      </head>
      <body>
        <h1>Eventos de la NASA</h1>
        <div style="display: flex; flex-wrap: wrap; justify-content: center;">`; // Iniciamos el contenedor de las tarjetas

    events.forEach(event => {
      if (event.media_type === 'image') {
        html += `
          <div class="card">
            <img src="${event.url}" alt="${event.title}">
            <div class="card-content">
              <h2>${event.title}</h2>
              <p>${event.explanation}</p>
            </div>
          </div>
        `;
      } else {
        console.log(`Evento "${event.title}" no es una imagen y no será mostrado.`);
      }
    });

    html += `</div></body></html>`;
    res.send(html);
  } catch (error) {
    res.status(500).send('Hubo un problema al obtener los eventos del calendario de la NASA');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
