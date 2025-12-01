---
layout: default
title: Problemas comunes
nav_order: 6
---

# Problemas comunes y soluciones

## 1. Los motores están “suaves” y no se mueven

**Síntomas:**

- Los motores giran libremente con la mano.
- No responden al jog desde OpenBuilds.

**Causas posibles:**

- No hay alimentación de 12–24 V en el CNC Shield.
- GRBL deshabilita los drivers cuando está en reposo.

**Solución:**

1. Verificar con multímetro que hay tensión en el borne de la shield.
2. Configurar:

   ```gcode
   $1=255
   ```

   para mantener los drivers habilitados.

---

## 2. El motor vibra pero no gira

**Causas posibles:**

- Cables del motor (bobinas) conectados en orden incorrecto.

**Solución:**

- Reorganizar los cables hasta que el motor gire suave:
  - Si tiembla / vibra → los pares A/B están cruzados.
  - Una vez bien conectados, el giro debe ser continuo.

---

## 3. La máquina se mueve demasiado rápido y pierde pasos

**Síntomas:**

- Golpes bruscos.
- Sonido fuerte, motor atascado.
- Posición final incorrecta.

**Solución:**

Bajar velocidades y aceleraciones en GRBL:

```gcode
$110=300
$111=300
$112=200

$120=10
$121=10
$122=8
```

Y en OpenBuilds:

- Step del jog: **1 mm**.
- Feedrate del jog: **100–300 mm/min**.

---

## 4. La distancia real no coincide con la ordenada

**Síntoma:**

- Pides 10 mm y se mueve, por ejemplo, 5.8 mm o 12.3 mm.

**Solución (calibración):**

1. Mide el movimiento real con una regla.
2. Aplica:

   ```text
   steps_nuevo = steps_viejo * (distancia_comandada / distancia_medida)
   ```

3. Actualiza `$100`, `$101` o `$102` según el eje.
4. Repite hasta obtener movimientos precisos.

---

## 5. OpenBuilds indica que GRBL 0.9 es incompatible

**Causa:**

- El Arduino tiene GRBL 0.9 y OpenBuilds CONTROL usa comandos de GRBL 1.1 (`$J`).

**Solución:**

- Cargar **GRBL 1.1h** siguiendo los pasos de [Software (GRBL + OpenBuilds)](software.md).

---

## 6. El lápiz no levanta o no baja correctamente

**Posibles causas:**

- Dirección de Z invertida.
- Alturas Z en el G-code mal configuradas.

**Solución:**

1. Verificar que:
   - **Z+** sube el lápiz.
   - **Z−** lo baja.
2. Ajustar en el G-code:
   - Altura de viaje (`Z up`) → por ejemplo `Z5`.
   - Altura de dibujo (`Z down`) → por ejemplo `Z0` o `Z-0.5` según tu montaje.

---

## 7. El dibujo se sale del área de trabajo

**Causas:**

- El SVG no se escaló correctamente.
- Punto de Zero en la máquina mal elegido.

**Solución:**

- Revisar en Inkscape que el tamaño del diseño sea ≤ 80×56 mm.
- Elegir un Zero físico (X0,Y0) que deje margen suficiente a los lados.
- Repetir el corte/dibujo en vacío o levantando Z para comprobar trayectoria.
