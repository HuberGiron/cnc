---
layout: default
title: Diseño mecánico de esta CNC
nav_order: 4
---

# Diseño mecánico de esta CNC

Esta sección describe la lógica mecánica de la máquina documentada en este repositorio. A partir del conjunto CAD disponible, se observa una **arquitectura cartesiana tipo gantry**, pensada con un enfoque modular y construida a partir de perfilería de aluminio, piezas auxiliares impresas o maquinadas, guías lineales de 8 mm y mecanismos de transmisión basados principalmente en **banda dentada** y **husillo Acme**.

La intención de esta sección no es repetir el inventario eléctrico, sino mostrar **cómo está resuelta físicamente la máquina** y por qué cada subconjunto existe.

## 1. Arquitectura general de la máquina

La máquina está organizada alrededor de tres ideas:

- una **estructura modular** hecha con perfil 2020;
- un **sistema de guiado lineal** con varillas y bloques lineales;
- una **transmisión combinada**, donde distintos ejes pueden usar mecanismos distintos según su función.

Eso es valioso porque no todos los ejes exigen lo mismo. Un eje puede priorizar velocidad y otro puede priorizar empuje o control del avance.

## 2. Estructura principal

La estructura base se construye con **perfil de aluminio 2020** en distintas longitudes. Esta decisión tiene varias ventajas:

- facilita el armado y el desarmado;
- permite corregir geometría con relativa facilidad;
- simplifica futuras iteraciones;
- hace más sencillo documentar medidas, cortes y variantes;
- mantiene el proyecto alineado con una lógica modular de fablab.

El bastidor, el puente y varios soportes secundarios pueden crecer o cambiar sin rediseñar por completo la máquina.

## 3. Sistema de guiado

En el conjunto aparecen componentes como:

- varillas lisas cromadas de 8 mm,
- soportes **SK8**,
- chumaceras **KP08**,
- bloques lineales **SCS8UU** o equivalentes,
- rodamientos lineales **LM8UU**.

Ese conjunto no genera movimiento por sí solo; su función es **guiar** y **restringir** el desplazamiento. Dicho de otra manera:

- la guía mantiene el carro recto,
- la transmisión es la que efectivamente lo desplaza.

Esta distinción es importante para entender por qué una máquina puede usar las mismas guías con mecanismos de transmisión distintos.

## 4. Eje accionado por banda

En el inventario CAD aparecen elementos como:

- motor **NEMA 17**,
- polea **GT2 de 20 dientes**,
- banda GT2,
- soportes superiores e inferiores para el conjunto del motor,
- piezas auxiliares de montaje.

Esto sugiere un eje pensado para:

- recorridos relativamente largos,
- buena velocidad,
- menor masa de transmisión,
- integración sencilla en una máquina ligera.

La cadena mecánica de ese eje puede describirse así:

**motor a pasos → polea → banda dentada → carro o puente móvil**

Ese arreglo es muy razonable en una CNC ligera o un plotter, especialmente si se quiere mantener el sistema simple y rápido.

## 5. Eje accionado por husillo

También aparecen en el proyecto:

- un **husillo Acme de 8 mm**,
- una **tuerca Acme bridada**,
- un **cople flexible 5x8 mm**,
- soportes específicos para el extremo del tornillo y del motor.

Eso es característico de un eje donde interesa un avance más controlado y una respuesta más rígida que la de una banda. La cadena mecánica queda así:

**motor a pasos → cople flexible → husillo → tuerca → carro móvil**

Este tipo de solución es muy común en ejes donde importa más el control del avance o donde el recorrido no es tan largo.

## 6. Piezas auxiliares diseñadas para la máquina

A partir de la nomenclatura actual del proyecto, varias piezas parecen haber sido diseñadas específicamente para esta CNC. Entre ellas:

- `base_abajo`
- `Base_Banda`
- `Base_Banda_v0`
- `Base_electronica`
- `Base_motor_abajo`
- `Base_motor_arriba`
- `Base_tornillo_arriba`
- `tapa_2020`
- posiblemente `engrane` y otras variantes según la versión de ensamble

Estas piezas son clave porque materializan la modularidad del proyecto: permiten adaptar componentes comerciales a una arquitectura propia.

## 7. Componentes comerciales identificados

En el inventario CAD también aparecen componentes comerciales o descargados como referencia:

- `Nema17HS4401`
- `GT2 20T b5`
- `SCS8UU`
- `SK8 Linear shaft holder`
- `KP08 Pillow block bearing 08mm diameter`
- `8mm_acme_nut`
- `Acople FlexibleSLDPRT`
- `Angle Bracket 2020`
- `Allen key bolt M5`
- `BARRA_Acero_cromado_200`
- `PROFILE_20x20x140`, `150`, `180`, `200`

Eso confirma que el proyecto combina muy bien tres niveles de construcción:

- estructura estándar,
- componentes comerciales,
- piezas personalizadas.

## 8. Lectura de diseño: por qué esta CNC está bien planteada para documentación

Desde el punto de vista didáctico, esta CNC está muy bien planteada porque permite explicar con claridad:

- la diferencia entre estructura, guía y transmisión;
- la selección de mecanismos por eje;
- la integración entre piezas impresas y piezas compradas;
- la lógica de rediseño incremental;
- la transición entre CAD, ensamble y puesta en marcha.

En otras palabras, no es solo una máquina funcional: también es una **buena máquina para enseñar diseño mecánico de CNC**.

---

## Espacio sugerido para imagen: vista general del ensamble

**Ruta sugerida:** `assets/img/diseno/vista-general-cnc.png`

Contenido sugerido:

- render general del ensamble;
- vista isométrica completa;
- imagen donde se vea claramente la estructura gantry.

<!--
![Vista general de la CNC](assets/img/diseno/vista-general-cnc.png)
*Figura X. Vista general de la arquitectura mecánica de la CNC propuesta. Elaboración propia.*
-->

## Espacio sugerido para imagen: vista explotada o subconjuntos

**Ruta sugerida:** `assets/img/diseno/vista-explotada-cnc.png`

Contenido sugerido:

- explote por módulos;
- separación entre base, guías, motores y transmisiones;
- vistas por eje.

<!--
![Vista explotada de la CNC](assets/img/diseno/vista-explotada-cnc.png)
*Figura X. Vista explotada de subconjuntos mecánicos de la CNC. Elaboración propia.*
-->

## Espacio sugerido para imagen: eje por banda

**Ruta sugerida:** `assets/img/diseno/eje-banda.png`

<!--
![Detalle del eje por banda](assets/img/diseno/eje-banda.png)
*Figura X. Subconjunto del eje accionado por banda dentada. Elaboración propia.*
-->

## Espacio sugerido para imagen: eje por husillo

**Ruta sugerida:** `assets/img/diseno/eje-husillo.png`

<!--
![Detalle del eje por husillo](assets/img/diseno/eje-husillo.png)
*Figura X. Subconjunto del eje accionado por husillo Acme. Elaboración propia.*
-->

## Espacio sugerido para video de ensamble o recorrido 3D

```html
<iframe width="560" height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="Video de diseño mecánico CNC"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen>
</iframe>
```

---

# Descargables 3D y archivos CAD

Una buena práctica en un repositorio de Just the Docs es separar claramente:

- **STL** para impresión o fabricación rápida,
- **STEP** para interoperabilidad CAD,
- **archivos fuente** (`.SLDPRT`, `.SLDASM`, etc.) cuando sea posible,
- **piezas comerciales** que no se descargan, sino que se compran.

## Estructura sugerida de carpetas

```text
assets/
  files/
    stl/
    step/
    bom/
  img/
    diseno/
    mecanismos/
    arquitectura/
```

## Tabla sugerida de descargables y componentes

| Elemento | Tipo sugerido | Ruta sugerida en el repo | Nota |
|---|---|---|---|
| base_abajo | STL | `assets/files/stl/base_abajo.stl` | Pieza personalizada |
| Base_Banda | STL | `assets/files/stl/base_banda.stl` | Pieza personalizada |
| Base_Banda_v0 | STL | `assets/files/stl/base_banda_v0.stl` | Variante histórica |
| Base_electronica | STL | `assets/files/stl/base_electronica.stl` | Soporte de electrónica |
| Base_motor_abajo | STL | `assets/files/stl/base_motor_abajo.stl` | Soporte inferior del motor |
| Base_motor_arriba | STL | `assets/files/stl/base_motor_arriba.stl` | Soporte superior del motor |
| Base_tornillo_arriba | STL | `assets/files/stl/base_tornillo_arriba.stl` | Soporte para eje con husillo |
| tapa_2020 | STL | `assets/files/stl/tapa_2020.stl` | Tapa o acabado de perfilería |
| engrane | STL / STEP | `assets/files/stl/engrane.stl` | Confirmar si es pieza final o auxiliar |
| 24mm-wheel-2020-gantry | STEP | `assets/files/step/24mm-wheel-2020-gantry.step` | Subconjunto de referencia |
| 210_8mm_2mm_4_start_Acme | STEP / CAD | `assets/files/step/210_8mm_2mm_4_start_acme.step` | Husillo de referencia |
| Acople FlexibleSLDPRT | Fuente CAD | `assets/files/step/acople-flexible.step` | Puede publicarse como STEP |
| 8mm_acme_nut | STEP / CAD | `assets/files/step/8mm_acme_nut.step` | Tuerca comercial de referencia |
```

## Sección sugerida para botones de descarga

Puedes usar botones sencillos de markdown así:

- [Descargar STL de `base_abajo`](assets/files/stl/base_abajo.stl)
- [Descargar STL de `Base_Banda`](assets/files/stl/base_banda.stl)
- [Descargar STEP del conjunto `24mm-wheel-2020-gantry`](assets/files/step/24mm-wheel-2020-gantry.step)

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
