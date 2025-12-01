---
layout: default
title: Flujo de trabajo con FabModules
nav_order: 5
---

# Flujo de trabajo con FabModules

Este flujo describe cómo pasar de un diseño 2D (SVG) a **G-code** y luego dibujarlo en la CNC.

## 1. Diseñar y exportar SVG

Puedes diseñar en:

- **Tinkercad** (vista superior, 2D).
- **Inkscape** u otro editor vectorial.

Pasos generales:

1. Diseña la figura (contornos, logos, textos convertidos a curvas).
2. Exporta como **SVG**:
   - En Tinkercad: `Export → .SVG`.
   - En Inkscape: `Archivo → Guardar como → SVG`.

## 2. Escalar y preparar el SVG (Inkscape)

1. Abre el SVG en **Inkscape**.
2. Cambia las unidades a **mm** (barra superior).
3. Selecciona todo el dibujo (`Ctrl + A`).
4. Escala para que quepa en tu área de trabajo (usando ~80% de margen):
   - Ancho máximo ≈ **80 mm**.
   - Alto máximo ≈ **56 mm**.
5. Con el dibujo seleccionado:
   - `Trayecto → Objeto a trayecto` (convertir a curvas).
6. Guarda el SVG.

## 3. Generar G-code con FabModules

1. Abre **FabModules** (web o local).
2. En `input format` selecciona:
   - `SVG` y carga tu archivo.
3. En `output format` selecciona:
   - Alguna opción de **G-code** genérico (depende de la versión de FabModules, puede ser “.nc (gcode)”).
4. Selecciona un proceso 2D (outline / profiling):
   - Profundidad final (`z final`) muy pequeña (dibujar, no fresar):
     - Ejemplo: `z final = -0.1 mm`.
   - Altura de viaje (`z up`) suficiente:
     - Ejemplo: `z up = 5 mm`.
   - Feedrate (velocidad de avance):
     - Ejemplo: `400–600 mm/min`.
   - Unidades: **mm**.
5. Haz clic en **calculate / generate**.
6. Guarda el archivo resultante (`.nc` o `.gcode`), por ejemplo:  
   `dibujo_fabmodules.nc`.

## 4. Enviar el G-code a la CNC (OpenBuilds CONTROL)

1. Abre **OpenBuilds CONTROL**.
2. Conecta al GRBL (Arduino).
3. Coloca el papel y ajusta la posición inicial del lápiz.
4. Haz **Zero** en:
   - **X** y **Y** → donde quieres que esté el origen del diseño.
   - **Z** → en el punto donde el lápiz apenas toca el papel (por ejemplo Z=0).
5. Carga el archivo `dibujo_fabmodules.nc`.
6. Revisa la vista previa:
   - Tamaño y posición del dibujo.
7. Pulsa **Start**:
   - La máquina debe:
     - Subir Z a la altura de viaje (z up).
     - Bajar Z a la altura de dibujo (z final) para trazar.
     - Respetar el área de trabajo calibrada.

## 5. Ajustes frecuentes

- Si el dibujo sale **muy pequeño / grande**:
  - Revisa la escala en Inkscape.
  - Revisa si FabModules está usando mm o unidades distintas.
- Si el dibujo sale **desplazado**:
  - Cambia el punto de **Zero** en la CNC.
  - O reposiciona la figura en Inkscape (mover el diseño dentro del lienzo).
