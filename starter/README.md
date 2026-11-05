# Katas - Análisis de complejidad con Big-O

## Brief

Katas de análisis de complejidad sobre el dominio del Gestor de Tareas (el mini-Trello del proyecto final): dado un set de 6 funciones que operan sobre arrays de tareas, anotar la Big-O de cada una con su justificación, verificar dos de ellas con `console.time()` y optimizar las 2 más caras. El resultado se empaqueta como las primeras utilidades de `lib/utils/` del proyecto, cada una con su comentario de complejidad.

## Objetivos de aprendizaje

* Etiquetar funciones reales con su complejidad Big-O de peor caso, justificándola en una frase.
* Detectar bucles escondidos en métodos de una línea (`includes`, `find`, `filter`) y cuadráticos camuflados (recorridos anidados, `shift` dentro de un bucle).
* Distinguir bucles seguidos (suman $O(n)$) de bucles anidados (multiplican $\rightarrow O(n^2)$).
* Medir la diferencia real entre curvas con `console.time()` / `console.timeEnd()` sobre arrays grandes.
* Aplicar la convención del proyecto: comentario `// Complejidad: O(...)` justificación encima de cada utilidad de `lib/utils/`.

## Enunciado

Crea un archivo `katas-complejidad.js` (o `.ts` si prefieres tipar) que se ejecute con `node katas-complejidad.js`. Parte de este dataset de tareas del Gestor de Tareas y de un generador de datos grandes:

```javascript
const tareas = [
  { id: 101, titulo: "Diseñar el tablero", estado: "pendiente", prioridad: 2 },
  { id: 102, titulo: "Modelo de usuario", estado: "en-curso", prioridad: 1 },
  { id: 103, titulo: "Configurar linter", estado: "hecha", prioridad: 3 },
  { id: 104, titulo: "Pantalla de login", estado: "pendiente", prioridad: 1 },
  { id: 105, titulo: "API de comentarios", estado: "en-curso", prioridad: 2 },
];

// Genera n tareas para las mediciones de la kata 2
function generarTareas(n) {
  const resultado = [];
  for (let i = 0; i < n; i++) {
    resultado.push({
      id: i,
      titulo: `Tarea ${i}`,
      estado: i % 3 === 0 ? "hecha" : "pendiente",
      prioridad: (i % 3) + 1,
    });
  }
  return resultado;
}
```

### Kata 1 - Ponle precio a cada función (análisis)

Copia estas 6 funciones en tu archivo. Encima de cada una, escribe un comentario con su complejidad Big-O de peor caso y una justificación de una frase, siguiendo la convención del proyecto:
```javascript
// Complejidad: `O(...)` justificación en una frase.
```

```javascript
function primeraTarea(tareas) {
  return tareas[0] ?? null;
}

function buscarPorId(tareas, id) {
  return tareas.find((t) => t.id === id) ?? null;
}

function contarPendientesYHechas(tareas) {
  let pendientes = 0;
  for (const t of tareas) {
    if (t.estado === "pendiente") pendientes++;
  }
  let hechas = 0;
  for (const t of tareas) {
    if (t.estado === "hecha") hechas++;
  }
  return { pendientes, hechas };
}

function hayTitulosDuplicados(tareas) {
  for (let i = 0; i < tareas.length; i++) {
    for (let j = i + 1; j < tareas.length; j++) {
      if (tareas[i].titulo === tareas[j].titulo) return true;
    }
  }
  return false;
}

function tareasDelSprint(tareas, idsDelSprint) {
  return tareas.filter((t) => idsDelSprint.includes(t.id));
}

function procesarCola(tareas) {
  const cola = [...tareas];
  const procesadas = [];
  while (cola.length > 0) {
    const t = cola.shift();
    procesadas.push(t.titulo);
  }
  return procesadas;
}
```

**Pistas de razonamiento (respóndelas en comentarios donde apliquen):**
1. ¿`find` recorre? ¿En qué caso llega hasta el final?
2. En `contarPendientesYHechas`, ¿los dos bucles van seguidos o anidados? ¿Suman o multiplican?
3. En `tareasDelSprint`, con $n$ tareas y $m$ ids, ¿cuántas comparaciones se hacen en el peor caso?
4. En `procesarCola`, ¿cuánto cuesta cada `shift`? ¿Cuántas veces se ejecuta?

### Kata 2 - Verifica dos con el cronómetro (medición)

Elige dos funciones de la Kata 1 con curvas distintas (sugerencia: `primeraTarea` frente a `buscarPorId` del último ID) y compáralas con `console.time()` / `console.timeEnd()`:

1. Genera un array pequeño (`generarTareas(1_000)`) y uno grande (`generarTareas(1_000_000)`).
2. Mide cada función sobre ambos arrays, buscando siempre el peor caso (por ejemplo, el ID que está al final).
3. Repite cada medición al menos 3 veces.
4. En un comentario, resume qué observaste: ¿qué función creció al crecer $n$ y cuál no? ¿Coincide con las etiquetas de la Kata 1? ¿Bailaron los milisegundos entre repeticiones?

### Kata 3 - Optimiza las dos más caras (mejora)

De las funciones de la Kata 1, las dos más caras son `hayTitulosDuplicados` ($O(n^2)$) y `procesarCola` ($O(n^2)$ por el `shift` dentro del bucle). Escribe una versión mejorada de cada una:

1. `hayTitulosDuplicadosV2`: consigue detectar duplicados en $O(n)$. *Pista:* no necesitas comparar pares, solo recordar los títulos ya vistos. Se permite usar `Set` de forma básica (`new Set()`, `.has()`, `.add()`) aunque todavía no lo hayamos estudiado a fondo (llega en el submódulo 3.3).
2. `procesarColaV2`: consigue el mismo resultado sin ningún `shift`. *Pista:* un bucle `for` clásico o `for...of` ya recorre en orden sin desplazar nada.

Cada versión nueva lleva su comentario `// Complejidad: ...` y, debajo, un comentario que explique en 1-2 frases por qué la nueva versión es más barata que la original. Verifica con `console.time()` que la mejora se nota con `generarTareas(10_000)` (en la versión original de `hayTitulosDuplicados`, usa un array sin duplicados para forzar el peor caso).

### Kata 4 - Tus primeras utilidades de lib/utils/ (entrega al proyecto)

Crea un segundo archivo `tareas-utils.js` (o `.ts`) que exporte las versiones definitivas (las mejoradas donde las haya) de estas cuatro utilidades, cada una con su comentario de complejidad:

* `buscarPorId(tareas, id)`
* `contarPendientesYHechas(tareas)`
* `hayTitulosDuplicados(tareas)` (la versión $O(n)$)
* `ordenarPorPrioridad(tareas)` (nueva: devuelve una copia ordenada por prioridad ascendente usando `sort` con comparador - ¿qué etiqueta le corresponde?)

Este archivo es el embrión del paquete `lib/utils/` del proyecto final: lo iremos ampliando en los siguientes submódulos del módulo.

## Resultado final

* `katas-complejidad.js` (o `.ts`) con las katas 1-3 resueltas, cada kata separada con un comentario `// Kata N - ...`
* `tareas-utils.js` (o `.ts`) con las 4 utilidades de la kata 4 exportadas y anotadas.
* Comentarios con las anotaciones `// Complejidad: O(...)` + justificación en **TODAS** las funciones de ambos archivos.
* Comentario-resumen de las mediciones de la Kata 2 (números aproximados que obtuviste y conclusión).

---

## Starter (para Classroom)

Cuando este ejercicio se sincronice con GitHub Classroom, el repo template incluirá:

```text
starter/
├── katas-complejidad.js  # dataset + generarTareas + las 6 funciones de la kata 1 con TODO
├── tareas-utils.js       # esqueleto de la kata 4 con los 4 exports vacíos y TODO
├── package.json          # node, sin dependencias adicionales
├── .nvmrc                # versión de Node sugerida
└── README.md             # enunciado completo + instrucciones de entrega (flujo PR)
```