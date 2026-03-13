---
layout: default
title: Diseño mecánico
nav_order: 4
---

# Diseño mecánico de esta CNC

Esta sección describe la lógica mecánica de la máquina documentada en este repositorio. Se observa una **arquitectura cartesiana**, pensada con un enfoque modular y construida a partir de perfilería de aluminio, piezas auxiliares impresas en 3D, guías lineales de 8 mm y mecanismos de transmisión basados principalmente en **banda dentada**, **husillo Acme** y **piñón-cremallera**.

## 1. Arquitectura general de la máquina

La máquina está organizada alrededor de tres funciones:

- **Estructura modular** hecha con perfil 2020;
- **Sistema de guiado lineal** con varillas y bloques lineales;
- **Transmisión combinada**, donde distintos ejes pueden usar mecanismos distintos según su función.

Eso es valioso porque no todos los ejes exigen lo mismo. Un eje puede priorizar velocidad y otro puede priorizar empuje o control del avance.

![cnc 1](assets/img/mecanica/1.png)

![cnc 2](assets/img/mecanica/2.png)

![cnc 3](assets/img/mecanica/3.png)

![cnc 4](assets/img/mecanica/4.png)

![cnc 5](assets/img/mecanica/5.png)

## 2. Estructura principal

La estructura base se construye con **perfil de aluminio 2020** en distintas longitudes y **ángulos para perfil 2020**. Esta decisión tiene varias ventajas:

- Facilita el armado y el desarmado;
- Permite corregir geometría con relativa facilidad;
- Simplifica futuras iteraciones;
- Hace más sencillo documentar medidas, cortes y variantes;
- Mantiene el proyecto alineado con una lógica modular de fablab.

El bastidor, el puente y varios soportes secundarios pueden crecer o cambiar sin rediseñar por completo la máquina.

![cnc 6](assets/img/mecanica/6.png)

![cnc 7](assets/img/mecanica/7.png)

![cnc 8](assets/img/mecanica/8.png)

![cnc 9](assets/img/mecanica/9.png)

## 3. Eje accionado por husillo

El eje Y de la máquina utiliza un mecanismo de husillo, utilizando:

- **Husillo Acme de 8 mm**,
- **Tuerca Acme bridada**,
- **Cople flexible 5x8 mm**,
- Soportes específicos para el extremo del tornillo y del motor.

Eso es característico de un eje donde interesa un avance más controlado y una respuesta más rígida que la de una banda. Este tipo de solución es muy común en ejes donde importa más el control del avance o donde el recorrido no es tan largo.

Para la guía lineal que apoya este mecanismo se utilizan componentes como:

- Varillas lisas cromadas de 8 mm,
- Soportes **SK8**,
- Chumaceras **KP08**,
- Bloques lineales **SCS8UU** o equivalentes,
- Rodamientos lineales **LM8UU**.

Ese conjunto no genera movimiento por sí solo; su función es **guiar** y **restringir** el desplazamiento. Dicho de otra manera:

- la guía mantiene el carro recto,
- la transmisión de husillo es la que efectivamente lo desplaza.

Esta distinción es importante para entender por qué una máquina puede usar las mismas guías con mecanismos de transmisión distintos.

![cnc 10](assets/img/mecanica/10.png)

![cnc 11](assets/img/mecanica/11.png)

![cnc 12](assets/img/mecanica/12.png)

## 4. Eje accionado por banda

El eje X de la máquina utiliza un mecanismo de banda, utilizando:

- Motor **NEMA 17**,
- Polea **GT2 de 20 dientes**,
- Banda **GT2**,
- Soportes superiores e inferiores para el conjunto del motor,
- Piezas auxiliares para el carro móvil con **ruedas Delrin tipo V**.

Esto sugiere un eje pensado para:

- Recorridos relativamente largos,
- Buena velocidad,
- Menor masa de transmisión,
- Integración sencilla en una máquina ligera.

Ese arreglo es muy razonable en una CNC ligera o un plotter, especialmente si se quiere mantener el sistema simple y rápido.

![cnc 13](assets/img/mecanica/13.png)

![cnc 14](assets/img/mecanica/14.png)

![cnc 15](assets/img/mecanica/15.png)

## 5. Eje accionado por piñón-cremallera

El eje Z de la máquina utiliza un mecanismo de **piñón-cremallera** que soporta la herramienta del plotter (lápiz), donde el engrane y la cremallera se realizaron en impresión 3D.

![cnc 16](assets/img/mecanica/16.png)

![cnc 17](assets/img/mecanica/17.png)

![cnc 18](assets/img/mecanica/18.png)

---

## Descarga de STL para impresión 3D

A continuación se listan las piezas finales STL que forman parte de esta versión de la máquina. Se recomienda mantener los nombres de archivo sin acentos ni espacios para evitar problemas en GitHub Pages o al enlazarlos desde Markdown.

### Piezas STL finales

- [EjeX_Base_carroBanda.stl](assets/files/stl/EjeX_Base_carroBanda.stl)
- [EjeX_Base_motor_arriba.stl](assets/files/stl/EjeX_Base_motor_arriba.stl)
- [EjeX_Base_tornillo_arriba.stl](assets/files/stl/EjeX_Base_tornillo_arriba.stl)
- [EjeY_base_abajo.stl](assets/files/stl/EjeY_base_abajo.stl)
- [EjeY_Base_motor_abajo.stl](assets/files/stl/EjeY_Base_motor_abajo.stl)
- [EjeZ_cremallera.stl](assets/files/stl/EjeZ_cremallera.stl)
- [EjeZ_engrane.stl](assets/files/stl/EjeZ_engrane.stl)
- [Estructura_Base_electronica.stl](assets/files/stl/Estructura_Base_electronica.stl)
- [Estructura_tapa_2020.stl](assets/files/stl/Estructura_tapa_2020.stl)

### Nota de organización

Si tu archivo actualmente se llama `Estructura_tapa 2020.stl`, conviene renombrarlo a:

`Estructura_tapa_2020.stl`

para evitar espacios en la URL.

---

# Componentes comerciales y ligas de compra

## Proveedores sugeridos

Para este proyecto conviene separar las compras en cuatro grupos:

1. **Control y electrónica**
2. **Movimiento lineal y transmisión**
3. **Estructura**
4. **Tornillería y accesorios**

### Proveedor sugerido para electrónica y movimiento ligero

**UNIT Electronics**

### Proveedor sugerido para perfilería estructural

**Mercado Libre México** para perfil 2020 / V-slot y accesorios de estructura.

## Revisión del BOM actual

Después de depurar la documentación, el listado de compras conviene quedar así:

### A. Control y electrónica

- Arduino UNO
- CNC Shield V3
- Drivers A4988 o DRV8825 para X, Y y Z
- Motores NEMA 17
- Fuente conmutada de 12 V
- Cable USB tipo B para el Arduino
- Finales de carrera (opcionales, pero recomendables)

### B. Movimiento lineal y transmisión

- Banda GT2 de 6 mm
- Polea GT2 de 20 dientes con barreno de 5 mm para motor NEMA 17
- Husillo Acme T8 de 8 mm con tuerca
- Cople flexible 5x8 mm
- Varillas lisas de 8 mm
- Soportes SK8 para varilla de 8 mm
- Chumaceras KP08
- Rodamientos lineales SCS8UU o LM8UU
- Ruedas Delrin tipo V
- Retorno/tensado de banda (agregar explícitamente si tu eje X usa balero o polea loca)

### C. Estructura

- Perfil aluminio **2020 V-slot**
- Ángulos de ajuste para perfil 2020
- Tapa y base electrónica impresas en 3D

### D. Tornillería y accesorios

- Tornillos M5x8 para perfilería
- Tuercas T M5 para perfil V-slot
- Tornillería M3/M4/M5 según motores, ruedas y soportes
- Separadores, arandelas y tuercas para el carro del eje X

## Ligas sugeridas de compra

> **Nota:** estas ligas sirven como referencia de partida. Conviene revisar existencia, medidas exactas, diámetro de barreno, longitud del husillo y compatibilidad con tu versión final antes de comprar.

### Electrónica y control — UNIT Electronics

- [Arduino UNO Rev3](https://uelectronics.com/producto/arduino-uno-rev3/)
- [CNC Shield V3 para Arduino Uno](https://uelectronics.com/producto/cnc-shield-v3-para-arduino-uno/)
- [A4988 driver para motor a pasos con disipador](https://uelectronics.com/producto/a4988-driver-para-motor-a-pasos-con-disipador/)
- [NEMA 17 17HS4401, 1.7 A, 4 kg/cm](https://uelectronics.com/producto/nema-17-17hs4401-motor-a-pasos-1-7amp-4kg-cm/)
- [Fuente conmutada 12 V 5 A](https://uelectronics.com/producto/fuente-conmutada-12v-5a/)
- [Cable USB 2.0 tipo B](https://uelectronics.com/producto/cable-usb-2-0-para-datos-o-alimentacion/)
- [Sensor final de carrera tipo endstop](https://uelectronics.com/producto/sensor-final-de-carrera-limit-switch-end-stop-impresora-3d-cnc/)

### Movimiento lineal y transmisión — UNIT Electronics

- [Banda dentada GT2 2GT de 6 mm, 10 m](https://uelectronics.com/producto/banda-dentada-gt2-2gt-6mm-10-metros/)
- [Polea dentada GT2 20 dientes para banda de 6 mm](https://uelectronics.com/producto/polea-dentada-gt2-20-para-banda-6mm/)
- [Tornillo Acme 8 mm con tuerca T8](https://uelectronics.com/producto/tornillo-acme-8mm-con-tuerca-t8-30cm-50cm-60cm/)
- [Cople flexible D18L25 tipo Nema (5x8 mm)](https://uelectronics.com/producto/cople-flexible-d18l25-nema-acoplador/)
- [Varilla lisa de 8 mm de acero 1045](https://uelectronics.com/producto/varilla-lisa-de-8mm-de-acero-1045/)
- [Soporte de eje óptico lineal SK8 8 mm](https://uelectronics.com/producto/soporte-de-eje-optico-lineal-sk8-8mm/)
- [KP08 chumacera de piso 8 mm](https://uelectronics.com/producto/kp08-chumacera-de-piso-8mm/)
- [SC8UU rodamiento lineal 8 mm](https://uelectronics.com/producto/sc8uu-rodamiento-lineal-8mm/)
- [LM8UU rodamiento lineal 8 mm](https://uelectronics.com/producto/balero-rodamiento-lineal-lm8uu-de-8mm-3d-cnc/)
- [Ruedas Delrin tipo V y Dual V](https://uelectronics.com/producto/ruedas-delrin-tipo-v-y-dual-v/)

### Estructura — UNIT Electronics / Mercado Libre

- [Ángulo de ajuste para perfil V-slot](https://uelectronics.com/producto/angulo-de-ajuste-para-perfil-v-slot/)
- [Listado general de perfil aluminio 2020 V-slot en Mercado Libre](https://listado.mercadolibre.com.mx/perfiles-aluminio-v-slot)
- [Listado general de perfil 2020 aluminio en Mercado Libre](https://listado.mercadolibre.com.mx/perfil-2020-aluminio)

## Tabla sugerida para BOM final

| Componente | Cantidad sugerida | Comentario |
|---|---:|---|
| Arduino UNO | 1 | Control principal |
| CNC Shield V3 | 1 | Expansión para GRBL |
| A4988 | 3 | Uno por eje |
| NEMA 17 | 3 | X, Y y Z |
| Fuente 12 V | 1 | 5 A mínimo recomendado |
| Cable USB tipo B | 1 | Programación y control |
| Final de carrera | 2–3 | Opcional, recomendable |
| Banda GT2 6 mm | 1 rollo / tramo | Según recorrido del eje X |
| Polea GT2 20T, barreno 5 mm | 1–2 | Al menos una motriz; verificar retorno/tensión |
| Husillo Acme T8 + tuerca | 1 | Eje Y |
| Cople flexible 5x8 mm | 1 | Motor-husillo |
| Varilla lisa 8 mm | 2 o más | Según longitudes del eje |
| SK8 | 4 o más | Según número de apoyos |
| KP08 | 2 o más | Según extremos del husillo/ejes |
| SC8UU o LM8UU | Según diseño | Elegir según tu implementación final |
| Ruedas Delrin tipo V | Según carro | Verificar si usarás ruedas sueltas o kit |
| Perfil 2020 V-slot | Según corte | Importante si usarás ruedas tipo V |
| Ángulos 2020 | Según estructura | Uniones del bastidor |
| Tornillos M5x8 | Según estructura | Para perfilería |
| Tuercas T M5 | Según estructura | Para perfilería V-slot |
| Tornillería variada M3/M4/M5 | Según diseño | Motores, soportes y carros |

## Notas importantes antes de comprar

- Si usarás **ruedas Delrin tipo V**, lo más consistente es documentar el perfil como **2020 V-slot** y no solo como “perfil 2020”.
- En tu eje X con banda todavía conviene dejar explícito qué usarás para el **retorno o tensión de la banda**: una polea loca, un balero o una solución impresa.
- En la guía lineal conviene elegir y fijar una sola redacción final: **SCS8UU**, **LM8UU** o ambos, según lo que realmente use tu máquina.
- Si las ruedas Delrin se compran **sueltas**, revisa si además necesitas **separadores, excéntricas, tornillos y tuercas**. Si compras un kit de placa V-slot, muchas de esas piezas ya vienen incluidas.

---

# Referencias

[1] MIT Center for Bits and Atoms, “Machines That Make,” 2026. [En línea]. Disponible en: https://mtm.cba.mit.edu/

[2] MIT Center for Bits and Atoms, “Cardboard Stages,” 2014. [En línea]. Disponible en: https://mtm.cba.mit.edu/2014/2014_mmtm/

[3] UNIT Electronics, “Arduino UNO Rev3,” 2026. [En línea]. Disponible en: https://uelectronics.com/producto/arduino-uno-rev3/

[4] UNIT Electronics, “CNC Shield V3 para Arduino Uno,” 2026. [En línea]. Disponible en: https://uelectronics.com/producto/cnc-shield-v3-para-arduino-uno/

[5] UNIT Electronics, “A4988 Driver para Motor a Pasos con Disipador,” 2026. [En línea]. Disponible en: https://uelectronics.com/producto/a4988-driver-para-motor-a-pasos-con-disipador/

[6] UNIT Electronics, “NEMA 17 17HS4401 Motor a Pasos 1.7Amp 4kg/cm,” 2026. [En línea]. Disponible en: https://uelectronics.com/producto/nema-17-17hs4401-motor-a-pasos-1-7amp-4kg-cm/

[7] UNIT Electronics, “Banda Dentada GT2 2GT 6mm 10 Metros,” 2026. [En línea]. Disponible en: https://uelectronics.com/producto/banda-dentada-gt2-2gt-6mm-10-metros/

[8] UNIT Electronics, “Polea Dentada GT2 20 para Banda 6mm,” 2026. [En línea]. Disponible en: https://uelectronics.com/producto/polea-dentada-gt2-20-para-banda-6mm/

[9] UNIT Electronics, “Tornillo Acme 8mm con Tuerca T8,” 2026. [En línea]. Disponible en: https://uelectronics.com/producto/tornillo-acme-8mm-con-tuerca-t8-30cm-50cm-60cm/

[10] UNIT Electronics, “Varilla Lisa de 8mm de Acero 1045,” 2026. [En línea]. Disponible en: https://uelectronics.com/producto/varilla-lisa-de-8mm-de-acero-1045/

[11] UNIT Electronics, “Soporte de Eje Óptico Lineal SK8 8mm,” 2026. [En línea]. Disponible en: https://uelectronics.com/producto/soporte-de-eje-optico-lineal-sk8-8mm/

[12] UNIT Electronics, “KP08 Chumacera de Piso 8mm,” 2026. [En línea]. Disponible en: https://uelectronics.com/producto/kp08-chumacera-de-piso-8mm/

[13] UNIT Electronics, “SC8UU Rodamiento Lineal 8mm,” 2026. [En línea]. Disponible en: https://uelectronics.com/producto/sc8uu-rodamiento-lineal-8mm/

[14] UNIT Electronics, “Balero Rodamiento Lineal LM8UU de 8mm 3D CNC,” 2026. [En línea]. Disponible en: https://uelectronics.com/producto/balero-rodamiento-lineal-lm8uu-de-8mm-3d-cnc/

[15] UNIT Electronics, “Ruedas Delrin Tipo V y Dual V,” 2026. [En línea]. Disponible en: https://uelectronics.com/producto/ruedas-delrin-tipo-v-y-dual-v/

[16] UNIT Electronics, “Ángulo de Ajuste para Perfil V-slot,” 2026. [En línea]. Disponible en: https://uelectronics.com/producto/angulo-de-ajuste-para-perfil-v-slot/
