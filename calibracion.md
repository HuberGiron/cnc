---
layout: default
title: Calibración
nav_order: 4
---

# Calibración de la CNC

En esta sección ajustaremos los parámetros de **pasos por milímetro (steps/mm)** de cada eje para que, cuando el G-code pida un movimiento de por ejemplo `X10`, la máquina se mueva realmente **10 mm** en ese eje, independientemente de si usa:

- Husillo (tornillo de potencia)
- Banda dentada + polea
- Cremallera + piñón

> ⚠️ **Nota:** Aquí solo veremos la parte de *distancia recorrida*. La configuración de velocidades, aceleraciones y límites se puede afinar después, cuando la máquina ya se mueva en la distancia correcta.

---

## 1. Concepto general de steps/mm

GRBL convierte los movimientos en **pasos de motor**. Cada motor paso a paso tiene:

- Ciertos **pasos completos** por vuelta (típicamente 200 pasos/rev).
- Un **microstepping** configurado en el driver (por ejemplo 1/16).
- Un mecanismo mecánico (husillo, banda, cremallera…) que convierte las vueltas en **mm de avance**.

Fórmula general:

```text
steps/mm = (pasos_motor_por_vuelta × microsteps × relación_extra) / avance_mm_por_vuelta
```

Donde:

- `pasos_motor_por_vuelta` → típicamente 200 para NEMA 17.
- `microsteps` → depende de cómo pusiste los jumpers MS1–MS2–MS3 (por ejemplo, 16 para 1/16 de paso).
- `relación_extra` → se usa si hay alguna relación mecánica adicional (por ejemplo poleas 2:1). Si no hay, vale 1.
- `avance_mm_por_vuelta` → cuántos mm se mueve el eje por **una vuelta completa** del motor o del mecanismo.

---

## 2. Husillo (tornillo de potencia)

En un husillo, la distancia que avanza la tuerca por vuelta se llama **lead** o **paso efectivo**.

Ejemplos comunes:

- Husillo T8 con lead de 8 mm → avanza 8 mm por vuelta.
- Husillo con lead de 2 mm → avanza 2 mm por vuelta.

Fórmula:

```text
steps/mm = (pasos_motor_por_vuelta × microsteps × relación_extra) / lead_mm
```

Ejemplo (muy típico):

- Motor: 200 pasos/vuelta
- Microstepping: 1/16 → `microsteps = 16`
- Lead: 8 mm
- Sin relación adicional (relación_extra = 1)

```text
steps/mm = (200 × 16 × 1) / 8 = 400 steps/mm
```

Este valor lo asignarías al eje que use ese husillo, por ejemplo:

```gcode
$100=400   ; X usa husillo
```

o

```gcode
$101=400   ; Y usa husillo
```

dependiendo de tu mecánica.

---

## 3. Banda dentada + polea

En un sistema de **banda dentada**, la distancia por vuelta depende de:

- El **paso de la banda** (por ejemplo GT2 → 2 mm entre dientes).
- El número de **dientes de la polea**.

Avance por vuelta:

```text
avance_mm_por_vuelta = paso_banda_mm × dientes_polea
```

Fórmula de steps/mm:

```text
steps/mm = (pasos_motor_por_vuelta × microsteps × relación_extra) / (paso_banda_mm × dientes_polea)
```

Ejemplo:

- Banda: GT2 → `paso_banda_mm = 2`
- Polea: 20 dientes → `dientes_polea = 20`
- Motor: 200 pasos/vuelta
- Microstepping: 1/16
- Sin relación adicional

```text
avance_mm_por_vuelta = 2 × 20 = 40 mm
steps/mm = (200 × 16) / 40 = 80 steps/mm
```

De nuevo, este valor lo pondrías en `$100`, `$101` o `$102` según qué eje use banda.

---

## 4. Cremallera + piñón

En una cremallera, un **piñón** (engranaje) avanza sobre dientes lineales.

Si conoces el **módulo** del engranaje y el número de dientes, la distancia por vuelta es:

```text
avance_mm_por_vuelta = π × módulo_mm × dientes_piñón
```

Fórmula de steps/mm:

```text
steps/mm = (pasos_motor_por_vuelta × microsteps × relación_extra) / (π × módulo_mm × dientes_piñón)
```

Ejemplo:

- Motor: 200 pasos/vuelta
- Microstepping: 1/16
- Módulo del piñón: 1 mm
- Dientes del piñón: 20

```text
avance_mm_por_vuelta = π × 1 × 20 ≈ 62.83 mm
steps/mm ≈ (200 × 16) / 62.83 ≈ 50.96 steps/mm
```

> 🔎 Si no conoces el módulo o la geometría exacta de tu cremallera, puedes arrancar con un valor aproximado (por ejemplo 40–60 steps/mm) y luego **ajustar por medición**, como se explica en la siguiente sección.

---

## 5. Ajuste fino por medición (método general)

Siempre es recomendable ajustar por medición, aunque hayas calculado steps/mm con fórmulas. El procedimiento es el mismo para cualquier eje (X, Y o Z) y cualquier mecanismo (husillo, banda, cremallera).

### 5.1. Preparación

1. Asegúrate de estar en **milímetros** y modo **absoluto**:

   ```gcode
   G21     ; trabajar en mm
   G90     ; coordenadas absolutas
   ```

2. Lleva el eje a una posición de referencia (por ejemplo, cerca de un extremo físico) y pon marcas donde puedas medir con una regla o calibrador.

3. Haz cero en ese eje (desde el sender o con `G92`, según tu flujo).

---

### 5.2. Movimiento de prueba y medición

1. Elige una distancia **comandada** razonable (por ejemplo 10 mm o 20 mm).
2. Envía un movimiento con velocidad moderada:

   ```gcode
   G1 X10 F150   ; ejemplo en eje X
   ```

3. Mide con la regla/calibrador la **distancia real** que se movió el eje (D_medida).

- Distancia comandada = `D_comandada` (ej. 10 mm).
- Distancia medida = `D_medida` (ej. 5.85 mm).

---

### 5.3. Cálculo del nuevo steps/mm

Usa la fórmula de corrección:

```text
steps_nuevo = steps_viejo × (D_comandada / D_medida)
```

Ejemplo real:

- `steps_viejo = 80` steps/mm
- `D_comandada = 10 mm`
- `D_medida = 5.85 mm`

```text
steps_nuevo = 80 × (10 / 5.85) ≈ 136.75 steps/mm
```

Actualizas el parámetro del eje correspondiente (por ejemplo X):

```gcode
$100=136.75
```

Luego repites la prueba:

1. Vuelves a mandar `G1 X10 F150` desde cero.
2. Mides de nuevo.
3. Si, por ejemplo, ahora obtienes 12.3 mm, repites con:
   - `steps_viejo = 136.75`
   - `D_comandada = 10`
   - `D_medida = 12.3`

Repites el ajuste hasta que obtengas algo cercano a 10 mm (por ejemplo 9.8–10.2 mm).

---

### 5.4. Repetir para Y y Z

- Para el **eje Y**, usas el mismo procedimiento con `$101`.
- Para el **eje Z**, usas `$102`, con recorridos más pequeños (por ejemplo 5 mm) para evitar golpes contra topes o la mesa.

> ✅ Consejo: anota en alguna parte tus valores finales de `$100`, `$101`, `$102` como respaldo, por si en algún momento se borra o resetea la configuración de GRBL.

---

## 6. (Opcional) Recorrido máximo y límites suaves

Una vez que tus ejes se mueven la distancia correcta, puedes medir el **recorrido máximo útil** de cada eje (área de trabajo).

1. Desde un extremo seguro, manda movimientos hasta donde ya no quieras que avance (antes del tope mecánico).
2. Anota el recorrido máximo en mm para cada eje:
   - `X_max`
   - `Y_max`
   - `Z_max`

Puedes registrar esos recorridos en GRBL:

```gcode
$130=X_max   ; recorrido máximo en X (mm)
$131=Y_max   ; recorrido máximo en Y (mm)
$132=Z_max   ; recorrido máximo en Z (mm)
```

Si más adelante activas **soft limits** (`$20=1`), GRBL no permitirá comandos que salgan de esos rangos.

---

## 7. Comandos G básicos para pruebas

Antes de pasar a generar archivos `.nc` más complejos, es útil familiarizarse con algunos comandos G sencillos. Estos comandos se pueden escribir directamente en la consola de OpenBuilds CONTROL.

### 7.1. Cambio de unidades y modos

```gcode
G21      ; usar milímetros
G20      ; usar pulgadas

G90      ; modo absoluto (coordenadas desde el origen)
G91      ; modo incremental (movimientos relativos)
```

### 7.2. Movimientos rápidos y de trabajo

```gcode
G0 X0 Y0 Z5      ; movimiento rápido (rápido a la posición indicada)
G1 X10 F200      ; movimiento lineal a X=10 mm con avance 200 mm/min
G1 Y10           ; movimiento lineal a Y=10 mm (mantiene F anterior)
G1 X0 Y0         ; regreso al origen en XY
```

### 7.3. Ejemplo: pequeño rectángulo de prueba

Este no será todavía nuestro archivo final, pero ilustra la idea de un ciclo simple:

```gcode
G21 G90           ; mm y modo absoluto
G0 X0 Y0 Z5       ; ir rápido al origen, levantar Z
G1 Z0 F100        ; bajar Z (acercar herramienta)
G1 X20 F200       ; trazar 20 mm en X
G1 Y10            ; trazar 10 mm en Y
G1 X0             ; volver a X=0
G1 Y0             ; volver a Y=0
G0 Z5             ; levantar Z
```

En la siguiente sección formalizaremos esto en un **archivo G-code (.nc)** bien estructurado para dibujar un cuadrado.

---

## Siguiente sección

[Crear tu primer archivo G-code (.nc) con un cuadrado](primer-gcode.md)
