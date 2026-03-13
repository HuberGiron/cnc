---
layout: default
title: Diseño mecánico
nav_order: 4
---

# Diseño mecánico de esta CNC

Esta sección describe la lógica mecánica de la máquina documentada en este repositorio. Se observa una **Arquitectura cartesiana**, pensada con un enfoque modular y construida a partir de perfilería de aluminio, piezas auxiliares impresas en 3D, guías lineales de 8 mm y mecanismos de transmisión basados principalmente en **banda dentada**, **husillo Acme** y **piñon-cremallera**.


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

La estructura base se construye con **perfil de aluminio 2020** en distintas longitudes y **angulos para perfil 2020**. Esta decisión tiene varias ventajas:

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

El eje Y de la maquina utiliza un mecanismo de husillo, utilizando:

- **Husillo Acme de 8 mm**,
- **Tuerca Acme bridada**,
- **Cople flexible 5x8 mm**,
- Soportes específicos para el extremo del tornillo y del motor.

Eso es característico de un eje donde interesa un avance más controlado y una respuesta más rígida que la de una banda. Este tipo de solución es muy común en ejes donde importa más el control del avance o donde el recorrido no es tan largo.

Para la guia lineal que apoya este mecanismo se utilzan componentes como:

- Varillas lisas cromadas de 8 mm,
- Soportes **SK8**,
- Chumaceras **KP08**,
- Bloques lineales **SCS8UU** o equivalentes,
- Rodamientos lineales **LM8UU**.

Ese conjunto no genera movimiento por sí solo; su función es **guiar** y **restringir** el desplazamiento. Dicho de otra manera:

- la guía mantiene el carro recto,
- la transmisión de Husillo es la que efectivamente lo desplaza.

Esta distinción es importante para entender por qué una máquina puede usar las mismas guías con mecanismos de transmisión distintos.

![cnc 10](assets/img/mecanica/10.png)

![cnc 11](assets/img/mecanica/11.png)

![cnc 12](assets/img/mecanica/12.png)


## 4. Eje accionado por banda

El eje x de la maquina utiliza un mecanismo de banda, utilizando:

- Motor **NEMA 17**,
- Polea **GT2 de 20 dientes**,
- Banda **GT2**,
- Soportes superiores e inferiores para el conjunto del motor,
- Piezas auxiliares para el carro movil con **Ruedas Delrin Tipo V**.

Esto sugiere un eje pensado para:

- Recorridos relativamente largos,
- Buena velocidad,
- Menor masa de transmisión,
- Integración sencilla en una máquina ligera.

Ese arreglo es muy razonable en una CNC ligera o un plotter, especialmente si se quiere mantener el sistema simple y rápido.

![cnc 13](assets/img/mecanica/13.png)

![cnc 14](assets/img/mecanica/14.png)

![cnc 15](assets/img/mecanica/15.png)

## 5. Eje accionado por piñon-cremallera

El eje z de la maquina utiliza un mecanismo de piñon-cremallera que soporta la herramienta del plotter (lapiz), donde el engrane y la cremallera se realizaron en impresion 3d.

![cnc 16](assets/img/mecanica/16.png)

![cnc 17](assets/img/mecanica/17.png)

![cnc 18](assets/img/mecanica/18.png)

---

## Descarga de STL para impresion 3D

- [Descargar STL de `Eje husillo`](assets/files/stl/base_abajo.stl)
---

# Componentes comerciales y ligas de compra

## Proveedores sugeridos

Para este proyecto conviene separar dos tipos de compra:

### Componentes electrónicos y de movimiento ligero

Proveedor sugerido: **UNIT Electronics**

### Perfilería estructural

Proveedor sugerido: **Mercado Libre México** para perfil 2020 y accesorios de estructura

## Ligas sugeridas de compra

> **Nota:** estas ligas sirven como referencia de partida. Conviene revisar existencia, medidas exactas y compatibilidad antes de comprar.

### Electrónica y movimiento — UNIT Electronics

- [NEMA 17 17HS4401, 1.7 A, 4 kg/cm](https://uelectronics.com/producto/nema-17-17hs4401-motor-a-pasos-1-7amp-4kg-cm/)
- [CNC Shield V3 para Arduino Uno](https://uelectronics.com/producto/cnc-shield-v3-para-arduino-uno/)
- [A4988 driver para motor a pasos con disipador](https://uelectronics.com/producto/a4988-driver-para-motor-a-pasos-con-disipador/)
- [Banda dentada GT2 2GT de 6 mm, 10 m](https://uelectronics.com/producto/banda-dentada-gt2-2gt-6mm-10-metros/)
- [Polea dentada GT2 20 dientes para banda de 6 mm](https://uelectronics.com/producto/polea-dentada-gt2-20-para-banda-6mm/)
- [Soporte de eje óptico lineal SK8 8 mm](https://uelectronics.com/producto/soporte-de-eje-optico-lineal-sk8-8mm/)
- [KP08 chumacera de piso 8 mm](https://uelectronics.com/producto/kp08-chumacera-de-piso-8mm/)
- [SC8UU rodamiento lineal 8 mm](https://uelectronics.com/producto/sc8uu-rodamiento-lineal-8mm/)
- [Varilla lisa de 8 mm de acero 1045](https://uelectronics.com/producto/varilla-lisa-de-8mm-de-acero-1045/)
- [Cople flexible D18L25 tipo Nema](https://uelectronics.com/producto/cople-flexible-d18l25-nema-acoplador/)

### Estructura — Mercado Libre México

- [Listado general de perfil aluminio 2020](https://listado.mercadolibre.com.mx/perfil-aluminio-2020)
- [Listado general de perfil aluminio 2020 V-slot](https://listado.mercadolibre.com.mx/perfil-aluminio-2020-v-slot)
- [Listado general de perfil aluminio 20 x 20](https://listado.mercadolibre.com.mx/perfil-aluminio-20-x-20)

## Tabla sugerida para BOM de compra

| Componente | Cantidad | Proveedor sugerido | Link |
|---|---:|---|---|
| Perfil 2020 | Por definir | Mercado Libre | Ver listados arriba |
| NEMA 17 | 2–3 | UNIT Electronics | Sí |
| CNC Shield V3 | 1 | UNIT Electronics | Sí |
| A4988 | 3–4 | UNIT Electronics | Sí |
| Polea GT2 20T | Según eje | UNIT Electronics | Sí |
| Banda GT2 6 mm | Según recorrido | UNIT Electronics | Sí |
| SC8UU | Según diseño | UNIT Electronics | Sí |
| SK8 | Según diseño | UNIT Electronics | Sí |
| KP08 | Según diseño | UNIT Electronics | Sí |
| Varilla lisa 8 mm | Según longitud | UNIT Electronics | Sí |
| Husillo Acme + tuerca | Según diseño | Proveedor por definir | Agregar link específico |

---

# Referencias

[1] MIT Center for Bits and Atoms, “Machines That Make,” 2026. [En línea]. Disponible en: https://mtm.cba.mit.edu/

[2] MIT Center for Bits and Atoms, “Cardboard Stages,” 2014. [En línea]. Disponible en: https://mtm.cba.mit.edu/2014/2014_mmtm/

[3] UNIT Electronics, “Nema 17 17HS4401 Motor a Pasos 1.7Amp 4kg/cm,” 2026. [En línea]. Disponible en: https://uelectronics.com/producto/nema-17-17hs4401-motor-a-pasos-1-7amp-4kg-cm/

[4] UNIT Electronics, “CNC Shield V3 Para Arduino Uno,” 2026. [En línea]. Disponible en: https://uelectronics.com/producto/cnc-shield-v3-para-arduino-uno/

[5] UNIT Electronics, “A4988 Driver para Motor a Pasos con Disipador,” 2026. [En línea]. Disponible en: https://uelectronics.com/producto/a4988-driver-para-motor-a-pasos-con-disipador/

[6] UNIT Electronics, “Banda Dentada GT2 2GT 6mm 10 Metros,” 2026. [En línea]. Disponible en: https://uelectronics.com/producto/banda-dentada-gt2-2gt-6mm-10-metros/

[7] UNIT Electronics, “Polea Dentada GT2 20 para Banda 6mm,” 2026. [En línea]. Disponible en: https://uelectronics.com/producto/polea-dentada-gt2-20-para-banda-6mm/

[8] UNIT Electronics, “Soporte De Eje Óptico Lineal SK8 8mm,” 2026. [En línea]. Disponible en: https://uelectronics.com/producto/soporte-de-eje-optico-lineal-sk8-8mm/

[9] UNIT Electronics, “KP08 Chumacera de Piso 8mm,” 2026. [En línea]. Disponible en: https://uelectronics.com/producto/kp08-chumacera-de-piso-8mm/

[10] UNIT Electronics, “SC8UU Rodamiento Lineal 8mm,” 2026. [En línea]. Disponible en: https://uelectronics.com/producto/sc8uu-rodamiento-lineal-8mm/

[11] UNIT Electronics, “Varilla Lisa de 8mm de Acero 1045,” 2026. [En línea]. Disponible en: https://uelectronics.com/producto/varilla-lisa-de-8mm-de-acero-1045/

[12] Mercado Libre México, “Listado general de perfil aluminio 2020,” 2026. [En línea]. Disponible en: https://listado.mercadolibre.com.mx/perfil-aluminio-2020
