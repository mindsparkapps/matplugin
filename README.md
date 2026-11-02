# MathViz 3D · plugin de ZenBan

Graficador 3D de funciones, derivadas e integrales (Three.js + math.js).

Funciona sola (abriendo `index.html`) y como **plugin de ZenBan** (un objeto más del lienzo):

- `zenban-plugin.json`: nombre, ícono y tamaño del plugin.
- `zenban-plugin-sdk.js`: copia del SDK de ZenBan (los mensajes entre el plugin y el lienzo).
- `zenban-integration.js`: guarda la función y los controles dentro del objeto del lienzo, así se sincronizan con Drive.

## Usarlo en ZenBan

1. Publica la carpeta (por ejemplo con GitHub Pages).
2. En ZenBan: ⚙️ Configuración › Plugins › pega la dirección publicada › Agregar.
3. Botón derecho en el lienzo › Agregar aquí › MathViz 3D.

Para probarlo sin publicar, sírvelo en tu PC (por ejemplo `python -m http.server 5190`) y agrega `http://localhost:5190/` como plugin en ZenBan abierto también en `localhost`.

## Tema y estilo

Arriba a la derecha hay dos botones (y el de estilo también en la barra de la ventana de ZenBan, junto a ⟳):

- **🎨 Estilo**: *Propio* (violeta y verde de MathViz) o *ZenBan* (su paleta). Dentro de ZenBan arranca con el de ZenBan.
- **🌗 Tema**: *Auto* (dentro de ZenBan sigue su tema; solo, el del sistema), *Claro* u *Oscuro*. Afecta a todo: lecciones, gráficas 2D y escena 3D.

Dentro de ZenBan se guardan en el objeto; solo, en `localStorage`. Lo maneja `tema.js` (`MathVizTema`).
