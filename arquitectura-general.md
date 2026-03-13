---
layout: default
title: Arquitectura
nav_order: 2
---

# Arquitectura general de una CNC

Una máquina **CNC** (*Computer Numerical Control*) es un sistema capaz de ejecutar movimientos controlados a partir de instrucciones numéricas. En lugar de mover manualmente una herramienta, el operador define una geometría, genera trayectorias y la máquina convierte esa información en desplazamientos coordinados sobre sus ejes [1], [2].

![Arquitectura general de una CNC](assets/img/arquitectura/cnc-ejes.png)

## 1. Bloques principales de una CNC

De forma general, una CNC puede descomponerse en los siguientes bloques:

### 1.1 Diseño digital

La pieza, contorno o trayectoria se genera primero en un entorno CAD o a partir de un flujo 2D/3D. Después, un software CAM o una herramienta intermedia convierte esa geometría en trayectorias y parámetros de proceso.

![Arquitectura general de una CNC](assets/img/mods/2.png)

### 1.2 Programa de máquina

El resultado suele expresarse como **G-code**, un conjunto de instrucciones que indican coordenadas, velocidades, movimientos, arranques, pausas y otras acciones necesarias para ejecutar el trabajo [2].

![Consola de OpenBuilds CONTROL con comandos G](assets/img/enviar_comandos.png)

### 1.3 Controlador y Etapa de potencia

El controlador interpreta ese programa y lo traduce en señales temporizadas para cada eje. En esta máquina, ese papel lo realiza **GRBL** corriendo sobre un **Arduino UNO**, junto con la lógica de interfaz proporcionada por el **CNC Shield**.

Los **drivers** convierten las señales de bajo nivel del controlador en corriente adecuada para mover los motores paso a paso. Aquí aparece el puente entre lógica y potencia.

![CNC Shield y drivers](assets/img/shield_conectado.jpg)

### 1.4 Sistema mecánico

Finalmente, la parte mecánica transforma la rotación de los motores en desplazamiento lineal. Aquí intervienen la estructura, las guías, los carros, los soportes y los mecanismos de transmisión.

![Maquina ejemplo CNC](assets/img/cnc.jpg)

## 2. Ejes, estructura y movimiento

En una CNC cartesiana, los movimientos se organizan normalmente sobre los ejes **X, Y y Z**. Cada eje debe cumplir dos funciones al mismo tiempo:

- permitir movimiento en una sola dirección útil;
- restringir los grados de libertad no deseados.

Por eso en una máquina real se combinan dos familias de componentes:

- **Componentes de guiado**, que obligan al carro a desplazarse recto.

![Guias](assets/img/arquitectura/guias.png)

- **Componentes de transmisión**, que son los que efectivamente lo empujan o arrastran.

![Mecanismos](assets/img/arquitectura/mecanismos.png)

Esta distinción es importante desde el inicio porque evita una confusión muy común: una guía lineal no reemplaza una banda, un husillo o una cremallera; cada elemento resuelve una función distinta.

## 3. La CNC como sistema modular

Para documentar y diseñar mejor una máquina de este tipo, conviene pensarla como un conjunto de módulos:

- Módulo estructural
- Módulo de guiado
- Módulo de transmisión
- Módulo electrónico
- Módulo de control
- Módulo de herramienta

Este enfoque se relaciona bien con la filosofía de **Machines That Make (MTM)** del MIT Center for Bits and Atoms, donde se trabaja con máquinas, componentes y subconjuntos reconfigurables que permiten prototipar rápidamente nuevas configuraciones y evolucionarlas por iteraciones [3], [4].

![Maquina ejemplo CNC](assets/img/arquitectura/mtm1.jpg)

La modularidad ofrece ventajas claras:

- Facilita rediseñar un eje sin rehacer toda la máquina;
- Permite probar varias soluciones de transmisión;
- Ayuda a sustituir piezas impresas, comerciales o estructurales;
- Mejora la documentación del proyecto;
- Vuelve más replicable el sistema.

El valor del enfoque modular no es únicamente teórico. En una CNC didáctica o de laboratorio, pensar en módulos permite:

- escalar la máquina cambiando solo la longitud de perfiles y ejes;
- sustituir un sistema por banda por uno de husillo;
- cambiar el cabezal o herramienta;
- separar claramente la parte mecánica de la parte electrónica;

Eso hace que la máquina no sea solo una herramienta terminada, sino también una **plataforma de aprendizaje y evolución**.

![MTM1](assets/img/arquitectura/mtm2.png)

![MTM2](assets/img/arquitectura/mtm_video.gif)

![MTM3](assets/img/arquitectura/mtm3.png)

## 5. MTM en FabAcademy
<video controls width="640">
  <source src="{{ 'https://ng.cba.mit.edu/show/video/15.10.cardboard.mp4' | relative_url }}" type="video/mp4">
  Tu navegador no soporta video HTML5.
</video>


## Referencias

[1] Haas Automation, *Mill Programming Workbook*. Oxnard, CA, USA: Haas Automation. [En línea]. Disponible en: https://www.haascnc.com/content/dam/haascnc/en/service/reference/programming-workbooks/mill---programming-workbook.pdf

[2] Haas Automation, *Lathe Programming Workbook*. Oxnard, CA, USA: Haas Automation. [En línea]. Disponible en: https://www.haascnc.com/content/dam/haascnc/en/service/reference/programming-workbooks/lathe---programming-workbook.pdf

[3] MIT Center for Bits and Atoms, “Machines That Make,” 2026. [En línea]. Disponible en: https://mtm.cba.mit.edu/

[4] MIT Center for Bits and Atoms, “Cardboard Stages,” 2014. [En línea]. Disponible en: https://mtm.cba.mit.edu/2014/2014_mmtm/
