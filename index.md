---
layout: default
title: Inicio
nav_order: 1
---

# CNC Plotter – Manual de Uso

Este sitio documenta una **CNC de 3 ejes para dibujar con lápiz** basada en:

- Arduino UNO + CNC Shield + drivers A4988
- Firmware **GRBL 1.1**
- Sender **OpenBuilds CONTROL**
- Área de trabajo aproximada: **100 mm × 70 mm**
- Flujo de trabajo desde **SVG / FabModules → G-code → OpenBuilds → CNC**

## Contenidos

1. [Hardware y conexiones](hardware.md)  
2. [Software (GRBL + OpenBuilds)](software.md)  
3. [Calibración](calibracion.md)  
4. [Flujo de trabajo con FabModules](flujo-fabmodules.md)  
5. [Problemas comunes](problemas.md)  

## Requisitos básicos

- Conocimientos básicos de:
  - Electrónica (12–24 V, fuentes, polaridad).
  - Manejo de archivos G-code (`.nc`, `.gcode`).
- Acceso a:
  - Computadora con Windows / macOS / Linux.
  - Conexión USB al Arduino.
  - Fuente de alimentación para motores (12–24 V).

## Cómo ver este manual

Recomendado montarlo en:

- **GitHub Pages + Just the Docs** (configurado desde `_config.yml`).
- Navegar desde un navegador web en la computadora que controla la CNC.
