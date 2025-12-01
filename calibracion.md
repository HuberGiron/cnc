---
layout: default
title: Calibración
nav_order: 4
---

# Calibración de la CNC

*Antes de Configurar, hay que explicar donde esta la terminal y como enviaremos estos comandos utilizando el Openbuilds.
   ![x](assets/img/x.jpg)

*Hay que explicar la diferencia entre comandos de codigo G o ISO para lectura y los comandos para configurar y cambiar los parametros de  la maquina.

## 1. Concepto general

Cada eje necesita un valor correcto de **steps/mm** para que:
- Cuando ordenes `X10`, realmente se mueva 10 mm.
- No pierda pasos ni se quede corto.

También ajustaremos velocidades y aceleraciones para que los movimientos sean suaves.

## 2. Cálculo inicial de steps/mm

Fórmula general:

```text
steps/mm = (pasos_motor_por_vuelta * microsteps) / avance_mm_por_vuelta
```

- Motor NEMA 17 típico: **200 pasos/vuelta**.
- Microstepping usado: **1/16** → `microsteps = 16`.

### Eje Y – husillo T8 (lead 8 mm)

```text
steps/mm = (200 * 16) / 8 = 400
```

### Eje X – banda GT2, polea 20T

```text
avance_por_vuelta = 20 dientes * 2 mm = 40 mm
steps/mm = (200 * 16) / 40 = 80
```

### Eje Z – cremallera

Se usa un valor aproximado y luego se ajusta por medición, por ejemplo:

```gcode
$102=40
```

y luego se calibra como los demás.

## 3. Calibración por medición (ejemplo con X)

1. Asegúrate de estar en mm y absoluto:

   ```gcode
   G21
   G90
   ```

2. Lleva X a una referencia física:

   ```gcode
   G0 X0
   ```

3. Marca un cero con una regla y ordena un movimiento:

   ```gcode
   G1 X10 F150
   ```

4. Mide con la regla cuánto se movió realmente:
   - `comandado = 10 mm`
   - `medido = D_real` (por ejemplo 5.85 mm).

5. Calcula el nuevo valor:

```text
steps_nuevo = steps_viejo * (comandado / medido)
```

Ejemplo real:

- `steps_viejo = 80`
- `comandado = 10 mm`
- `medido = 5.85 mm`

```text
steps_nuevo = 80 * (10 / 5.85) ≈ 136.75
```

Luego:

```gcode
$100=136.75
```

6. Repite la prueba (de nuevo `G1 X10`) y vuelve a medir:
   - Si ahora se movió, por ejemplo, 12.3 mm, repites el proceso con:
     - `steps_viejo = 136.75`
     - `comandado = 10`
     - `medido = 12.3`.

Repite hasta que al pedir 10 mm obtengas ~10 mm (9.8–10.2 es aceptable).

## 4. Calibrar Y y Z

- **Y**: mismo procedimiento usando `$101`.
- **Z**: igual, usando `$102`, con recorridos más pequeños (p.ej. 5 o 10 mm) para no pegar topes.

## 5. Área de trabajo y límites

Una vez calibrados los ejes:

1. Mueve X e Y hasta los extremos físicos seguros.
2. Anota los recorridos máximos:
   - `X max` ≈ 100 mm
   - `Y max` ≈ 70 mm
3. Opcionalmente puedes configurar límites suaves:

```gcode
$130=100    ; X max travel (mm)
$131=70     ; Y max travel (mm)
$132=20     ; Z max travel (mm aprox, según tu montaje)
$20=1       ; activar soft limits (requiere homing)
```
