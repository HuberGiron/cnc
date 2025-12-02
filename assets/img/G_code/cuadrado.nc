( Cuadrado 20x20 mm )
G21         (milimetros)
G90         (coordenadas absolutas)

G0 Z5       (subir lapiz a altura segura)
G0 X0 Y0    (ir a la esquina de inicio)

G1 Z0 F100  (bajar lapiz para dibujar)

G1 X20 Y0 F200   (lado 1: derecha 20 mm)
G1 X20 Y20       (lado 2: arriba 20 mm)
G1 X0  Y20       (lado 3: izquierda 20 mm)
G1 X0  Y0        (lado 4: bajar 20 mm, cerrar cuadrado)

G0 Z5       (levantar lapiz)
G0 X0 Y0    (volver al origen, opcional)

M30         (fin de programa)
