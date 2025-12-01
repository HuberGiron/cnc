---
layout: default
title: Hardware y conexiones
nav_order: 2
---

# Hardware y conexiones

## Componentes principales

- **Arduino UNO**
- **CNC Shield V3**
- **Drivers A4988** (o similares) para X, Y, Z
- Motores NEMA 17
- Fuente de **12–24 V** para los motores
- Finales de carrera (microswitch con palanca)
- Lápiz montado en el eje Z (cremallera o husillo corto)

## 1. Montaje del CNC Shield y drivers

1. Inserta el **CNC Shield** sobre el Arduino UNO alineando todos los pines.
2. Coloca los **drivers A4988** en los zócalos X, Y, Z:
   - Verifica la **orientación correcta** (EN, STEP, DIR, VDD, GND alineados con la serigrafía).
   - Normalmente el **potenciómetro** del driver queda hacia el conector de alimentación de la shield.
3. Debajo de cada driver (X, Y, Z) coloca **tres jumpers** de microstepping:
   - MS1, MS2, MS3 → configurados para **1/16 de paso**.
   - Esto hace los movimientos más suaves y precisos.

## 2. Alimentación

- Usa una fuente DC con salida entre **12–24 V** (según tus motores y drivers).
- Conecta la fuente al borne de tornillo del CNC Shield:
  - `+` → positivo de la fuente.
  - `GND` → negativo de la fuente.
- El Arduino se alimenta por **USB**, la shield por la **fuente**:
  - Esto ayuda a separar el ruido de los motores de la lógica.

> Verifica con un multímetro que en el borne de la shield hay el voltaje correcto antes de probar motores.

## 3. Conexión de motores

- Conecta cada NEMA 17 a su respectivo conector:
  - **Eje X** → carro con banda dentada (GT2).
  - **Eje Y** → mesa / base con husillo.
  - **Eje Z** → mecanismo de cremallera / husillo del lápiz.
- Respeta las parejas de bobina (A+, A−, B+, B−).  
  Si el motor **tiembla pero no gira**, probablemente los cables estén cruzados:
  - Cambia el orden hasta que gire suave y firme.

## 4. Finales de carrera (opcional)

- Tipo recomendado: **microswitch mecánico con palanca**, usados en modo **NC** (normalmente cerrado).
- Conexión en el CNC Shield (conector X-, Y-, Z-):
  - C del switch → **GND (G)**.
  - NC del switch → **S (Signal)**.
  - Deja sin conectar el pin de **+5 V**.
- Más adelante, en GRBL, se activan:
  - **Homing** y **límites duros** (ver sección [Calibración](calibracion.md)).

## 5. Montaje del lápiz (eje Z)

- El lápiz debe:
  - Subir lo suficiente para despegar del papel (**Z alto**, por ejemplo Z=5 mm).
  - Bajar hasta tocar el papel ligeramente (**Z bajo**, por ejemplo Z=0 mm o Z=-0.5 mm).
- Revisa que:
  - El lápiz esté firme pero con un poco de elasticidad (resorte, goma).
  - No se atasque en la bajada o subida.
