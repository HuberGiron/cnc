---
layout: default
title: Arquitectura
nav_order: 2
---

# Arquitectura general de una CNC

Una máquina **CNC** (*Computer Numerical Control*) es un sistema capaz de ejecutar movimientos controlados a partir de instrucciones numéricas. En lugar de mover manualmente una herramienta, el operador define una geometría, genera trayectorias y la máquina convierte esa información en desplazamientos coordinados sobre sus ejes [1], [2].

En una máquina cartesiana pequeña o mediana, como un plotter o router de escritorio, este proceso puede resumirse así:

**diseño digital → generación de trayectorias → G-code → controlador → drivers → motores → transmisión mecánica → movimiento lineal → herramienta sobre la pieza**

Esta cadena ayuda a entender que una CNC no es solamente “electrónica con motores”, sino una integración entre software, control y diseño mecánico.

## 1. Bloques principales de una CNC

De forma general, una CNC puede descomponerse en los siguientes bloques:

### 1.1 Diseño digital

La pieza, contorno o trayectoria se genera primero en un entorno CAD o a partir de un flujo 2D/3D. Después, un software CAM o una herramienta intermedia convierte esa geometría en trayectorias y parámetros de proceso.

### 1.2 Programa de máquina

El resultado suele expresarse como **G-code**, un conjunto de instrucciones que indican coordenadas, velocidades, movimientos, arranques, pausas y otras acciones necesarias para ejecutar el trabajo [2].

### 1.3 Controlador

El controlador interpreta ese programa y lo traduce en señales temporizadas para cada eje. En esta máquina, ese papel lo realiza **GRBL** corriendo sobre un **Arduino UNO**, junto con la lógica de interfaz proporcionada por el **CNC Shield**.

### 1.4 Etapa de potencia

Los **drivers** convierten las señales de bajo nivel del controlador en corriente adecuada para mover los motores paso a paso. Aquí aparece el puente entre lógica y potencia.

### 1.5 Sistema mecánico

Finalmente, la parte mecánica transforma la rotación de los motores en desplazamiento lineal. Aquí intervienen la estructura, las guías, los carros, los soportes y los mecanismos de transmisión.

## 2. Ejes, estructura y movimiento

En una CNC cartesiana, los movimientos se organizan normalmente sobre los ejes **X, Y y Z**. Cada eje debe cumplir dos funciones al mismo tiempo:

- permitir movimiento en una sola dirección útil;
- restringir los grados de libertad no deseados.

Por eso en una máquina real se combinan dos familias de componentes:

- **componentes de guiado**, que obligan al carro a desplazarse recto;
- **componentes de transmisión**, que son los que efectivamente lo empujan o arrastran.

Esta distinción es importante desde el inicio porque evita una confusión muy común: una guía lineal no reemplaza una banda, un husillo o una cremallera; cada elemento resuelve una función distinta.

## 3. La CNC como sistema modular

Para documentar y diseñar mejor una máquina de este tipo, conviene pensarla como un conjunto de módulos:

- módulo estructural,
- módulo de guiado,
- módulo de transmisión,
- módulo electrónico,
- módulo de control,
- módulo de herramienta.

Este enfoque se relaciona bien con la filosofía de **Machines That Make (MTM)** del MIT Center for Bits and Atoms, donde se trabaja con máquinas, componentes y subconjuntos reconfigurables que permiten prototipar rápidamente nuevas configuraciones y evolucionarlas por iteraciones [3], [4].

La modularidad ofrece ventajas claras:

- facilita rediseñar un eje sin rehacer toda la máquina;
- permite probar varias soluciones de transmisión;
- ayuda a sustituir piezas impresas, comerciales o estructurales;
- mejora la documentación del proyecto;
- vuelve más replicable el sistema.

## 4. Qué aporta el enfoque MTM en un proyecto como este

El valor del enfoque modular no es únicamente teórico. En una CNC didáctica o de laboratorio, pensar en módulos permite:

- escalar la máquina cambiando solo la longitud de perfiles y ejes;
- sustituir un sistema por banda por uno de husillo;
- cambiar el cabezal o herramienta;
- separar claramente la parte mecánica de la parte electrónica;
- mantener el repositorio organizado por subsistemas.

Eso hace que la máquina no sea solo una herramienta terminada, sino también una **plataforma de aprendizaje y evolución**.

---

## Espacio sugerido para imagen / diagrama general

**Ruta sugerida:** `assets/img/arquitectura/arquitectura-cnc-general.png`

Sugerencias de contenido visual:

- diagrama de bloques desde CAD/CAM hasta movimiento físico;
- esquema de ejes X/Y/Z;
- vista general de la máquina terminada;
- imagen que explique la cadena `G-code → control → drivers → motor → transmisión`.

<!--
![Arquitectura general de una CNC](assets/img/arquitectura/arquitectura-cnc-general.png)
*Figura X. Arquitectura general de una máquina CNC cartesiana. Elaboración propia.*
-->

## Espacio sugerido para imagen sobre modularidad / MTM

**Ruta sugerida:** `assets/img/arquitectura/mtm-modularidad.png`

Sugerencias de contenido visual:

- configuraciones reconfigurables tipo stages;
- diagrama de módulos intercambiables;
- comparación entre una máquina monolítica y una modular.

<!--
![Enfoque modular inspirado en MTM](assets/img/arquitectura/mtm-modularidad.png)
*Figura X. Ejemplo de modularidad y reconfiguración de ejes. Adaptado de MTM [3], [4].*
-->

## Espacio sugerido para video

Si quieres insertar un video de explicación general o un recorrido de la máquina, puedes usar una de estas dos opciones.

### Opción A: enlace simple

- Ruta o URL sugerida: `https://www.youtube.com/watch?v=VIDEO_ID`

### Opción B: embebido HTML

```html
<iframe width="560" height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="Video de arquitectura general CNC"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen>
</iframe>
```

## Referencias

[1] Haas Automation, *Mill Programming Workbook*. Oxnard, CA, USA: Haas Automation. [En línea]. Disponible en: https://www.haascnc.com/content/dam/haascnc/en/service/reference/programming-workbooks/mill---programming-workbook.pdf

[2] Haas Automation, *Lathe Programming Workbook*. Oxnard, CA, USA: Haas Automation. [En línea]. Disponible en: https://www.haascnc.com/content/dam/haascnc/en/service/reference/programming-workbooks/lathe---programming-workbook.pdf

[3] MIT Center for Bits and Atoms, “Machines That Make,” 2026. [En línea]. Disponible en: https://mtm.cba.mit.edu/

[4] MIT Center for Bits and Atoms, “Cardboard Stages,” 2014. [En línea]. Disponible en: https://mtm.cba.mit.edu/2014/2014_mmtm/
