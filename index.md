---
layout: default
title: Inicio
nav_order: 1
---

# CNC Plotter – Manual de Uso

Este sitio documenta una **CNC cartesiana de 3 ejes** basada en una arquitectura simple, modular y replicable. La idea no es solo explicar cómo conectar la electrónica y cargar GRBL, sino también mostrar **cómo está pensada la máquina completa**: estructura, mecanismos de transmisión, criterios de diseño y flujo de puesta en marcha.

La documentación está organizada desde lo general hacia lo particular:

## Contenidos

1. [Arquitectura general de una CNC](arquitectura-general.md)
2. [Motores y mecanismos de transmisión](motores-y-mecanismos.md)
3. [Diseño mecánico de esta CNC](diseno-mecanico-cnc.md)
4. [Hardware y conexiones](hardware.md)
5. [Software (GRBL + OpenBuilds)](software.md)
6. [Calibración](calibracion.md)
7. [Primer archivo G-code (.nc)](primer-gcode.md)
8. [Flujo de trabajo con FabModules](flujo-fabmodules.md)

## En qué consiste este proyecto

Esta máquina usa una lógica típica de fabricación digital ligera:

- **Diseño mecánico modular** con perfilería de aluminio y piezas auxiliares.
- **Motores a pasos** para el accionamiento de los ejes.
- **Mecanismos de transmisión** que convierten rotación en movimiento lineal.
- **Controlador basado en Arduino UNO + CNC Shield + drivers A4988**.
- **Firmware GRBL 1.1** para interpretar comandos de movimiento.
- **OpenBuilds CONTROL** como sender para pruebas y ejecución de G-code.
- **Flujo CAD/CAM** para pasar de un diseño digital a trayectorias reales de máquina.

## Enfoque de la documentación

Este repositorio tiene dos capas:

1. una capa **introductoria y conceptual**, para entender cómo funciona una CNC y por qué se diseña así;
2. una capa **práctica**, enfocada en hardware, software, calibración y operación real.

La primera capa es importante porque ayuda a interpretar mejor las decisiones del proyecto: por qué un eje usa banda, por qué otro puede usar husillo, por qué las guías lineales no son lo mismo que la transmisión y cómo la modularidad permite iterar el diseño.

## Requisitos básicos

- Computadora con Windows, macOS o Linux.
- Conexión USB al Arduino.
- Fuente de alimentación para motores (12–24 V).
- Máquina armada o parcialmente armada para realizar pruebas.
- Acceso a los archivos STL, STEP y G-code del proyecto.

## Sugerencia de lectura

Si es tu primera vez con una máquina CNC, conviene seguir este orden:

1. Arquitectura general.
2. Motores y mecanismos.
3. Diseño mecánico de esta CNC.
4. Hardware.
5. Software.
6. Calibración.
7. Primer G-code.
8. Flujo FabModules.

---

## Nota sobre imágenes, videos y descargables

Las nuevas secciones del repositorio ya incluyen espacios sugeridos para:

- imágenes y diagramas,
- videos embebidos o enlazados,
- STL/STEP descargables,
- ligas de compra de componentes comerciales,
- referencias en formato IEEE.

La idea es que estas páginas sirvan tanto como **manual técnico** como **bitácora de diseño** de la máquina.
