# PoseSynth
Programa para controlar un sintetizador en pure data en tiempo real con el cuerpo.

## Descripción:
El objetivo de este proyecto es mostrar cómo podemos usar modelos ya existentes de inteligencia artificial como interface para la actividad creativa. En este caso, se emplea la posición del cuerpo y de los brazos para controlar el volumen y la complejidad de los componentes rítmicos y armónicos de una pequeña pieza sonora.

## Componentes:
- ### Pure Data:
  <img src="https://www.shedhalle.de/licht2014/wp-content/uploads/2014/10/pure-data.jpg" width="128px"></img>
  
  Pure Data es un software de código abierto que provee un entorno de programación visual orientado a la multimedia.
  
- ### Node.js:

  <img src="https://nitayneeman.com/images/thumbnails/node.js.png" width="128px"></img>
  
  Node.js es un entorno de ejecución de Javascript ampliamente usado en diversas aplicaciones, principalmente Web.
  
- ### TensorFlow:

  <img src="https://www.nxp.com/assets/images/en/logos-external/TensorFlow-Logo-ML.png" width="128px"></img>
  
  Tensorflow es una librería para construir modelos de inteligencia artificial. Tiene varias opciones para sacar modelos a producción en lenguajes como Python y Javascript, al igual que opciones para ejecutar modelos en microprocesadores.
  
- ### MoveNet:
  
  MoveNet es un modelo de inteligencia artificial que está disponible en TensorFlow Hub. Este modelo predice keypoints de 17 partes del cuerpo en tiempo real. Se puede ejecutar en la web con aceleramiento de hardware (WebGL). [Más información aquí](https://blog.tensorflow.org/2021/05/next-generation-pose-detection-with-movenet-and-tensorflowjs.html)
  

## Cómo correrlo:
1. Instalar [Pure Data](https://puredata.info/downloads/pure-data) y [Node.js](https://nodejs.org/en/download/)
2. Clonar el repositorio:

  ```shell
  git clone https://github.com/aristizabal95/posesynth
  ```
  
3. Ir a la carpeta del proyecto e instalar dependencias

  ```shell
  cd posesynth
  npm install
  ```
  
4. 
