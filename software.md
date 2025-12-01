---
layout: default
title: Software (GRBL + OpenBuilds)
nav_order: 3
---

# Software: GRBL y OpenBuilds CONTROL

## 1. Arduino IDE

1. Descarga e instala **Arduino IDE**.
2. Conecta el Arduino UNO por USB.
3. En `Herramientas`:
   - `Placa` → **Arduino Uno**
   - `Puerto` → COM correspondiente al Arduino.

## 2. Instalar GRBL 1.1h en el Arduino

1. Descarga el ZIP de **GRBL 1.1** (repositorio `gnea/grbl`).
2. En Arduino IDE:
   - `Programa → Incluir librería → Añadir biblioteca .ZIP…`
   - Selecciona el ZIP descargado.
3. Abre el ejemplo:
   - `Archivo → Ejemplos → grbl → GrblUpload`
4. Haz clic en **Subir**.
5. Abre el **Monitor serie**:
   - Velocidad: **115200**.
   - Al resetear el Arduino deberías ver algo como:
     - `Grbl 1.1h ['$' for help]`.

Si te marca otra versión (0.9, etc.), vuelve a cargar GRBL 1.1h.

## 3. OpenBuilds CONTROL (sender)

1. Instala **OpenBuilds CONTROL**.
2. Conecta el Arduino por USB y abre OpenBuilds.
3. Selecciona el **puerto COM** correcto y pulsa **CONNECT**.
4. En la consola debe aparecer:
   - `Grbl 1.1h [...]`.

Si aparece `ALARM:`, desbloquea temporalmente con:

```gcode
$X
```

## 4. Configuración básica de GRBL

Trabajaremos en **milímetros** y **coordenadas absolutas**:

```gcode
G21        ; milímetros
G90        ; modo absoluto
$13=0      ; reportar en mm
$1=255     ; mantener motores habilitados (no se "aflojan" en reposo)
```

### Ejemplo de parámetros iniciales (adaptables)

> Estos números son un ejemplo típico para tu máquina:
> - X: banda GT2, polea 20T, microstep 1/16 (luego calibrado).
> - Y: husillo T8, lead 8 mm, microstep 1/16.
> - Z: cremallera calibrada empíricamente.

```gcode
$100=111.18   ; X steps/mm (calibrado con regla)
$101=400      ; Y steps/mm (husillo T8 lead 8mm)
$102=53.33    ; Z steps/mm (cremallera, calibrado)

$110=300      ; X velocidad máx (mm/min)
$111=300      ; Y velocidad máx
$112=200      ; Z velocidad máx

$120=10       ; X aceleración (mm/s^2)
$121=10       ; Y aceleración
$122=8        ; Z aceleración
```

### Líneas de arranque (opcional)

Para que GRBL siempre arranque en mm y absoluto:

```gcode
$N0=G21G90
$N1=
```

Al encender o resetear, ejecutará `G21 G90` automáticamente.
