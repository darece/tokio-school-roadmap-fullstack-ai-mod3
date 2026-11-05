"use strict";
const tareas = [
    { id: 101, titulo: "Diseñar el tablero", estado: "pendiente", prioridad: 2 },
    { id: 102, titulo: "Modelo de usuario", estado: "en-curso", prioridad: 1 },
    { id: 103, titulo: "Configurar linter", estado: "hecha", prioridad: 3 },
    { id: 104, titulo: "Pantalla de login", estado: "pendiente", prioridad: 1 },
    { id: 105, titulo: "API de comentarios", estado: "en-curso", prioridad: 2 },
];
// Kata 1 - Ponle precio a cada función (análisis)
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
// Complejidad: O(1) - El acceso a índices de un array se hace directo, sea cual sea dicho elemento
function primeraTarea(tareas) {
    return tareas[0] ?? null;
}
// Complejidad: O(n) - El método `find` ha de recorrer todos los elementos, y por tanto en el peor de los casos puede estar al final de todo la tarea encontrada, además, no hace ningúna optimizaciónd e partición, sino que es secuencial
function buscarPorId(tareas, id) {
    return tareas.find((t) => t.id === id) ?? null;
    // 1. ¿`find` recorre? Sí, debe recorrer, porque si el elemento que hace match es el que está el último del array, pues deberá haber recorrido todos los anteriores. ¿En qué caso llega hasta el final? Cuando no ha encontrado ningún elemento que haga el match, o incluso ni el último hace match, en tal caso se ejecutará el null.
}
// Complejidad: O(n) - Son dos for independientes, con lo cual 2n -> n anulando la ocnstante.
function contarPendientesYHechas(tareas) {
    let pendientes = 0;
    for (const t of tareas) {
        if (t.estado === "pendiente")
            pendientes++;
    }
    let hechas = 0;
    for (const t of tareas) {
        if (t.estado === "hecha")
            hechas++;
    }
    // 2. Ambos bucles son seguidos, y por tanto suman, en este caso n+n, porque son sobre el mismo conjunto
    return { pendientes, hechas };
}
// Complejidad: O(n^2) - Son dos bucles anidados, y aunque el pequeño se va reduciendo en cada iteración, la tendencia es grande
function hayTitulosDuplicados(tareas) {
    for (let i = 0; i < tareas.length; i++) {
        for (let j = i + 1; j < tareas.length; j++) {
            if (tareas[i].titulo === tareas[j].titulo)
                return true;
        }
    }
    return false;
}
// Complejidad: O(n^2) - Son dos métodos de javacript de complejidad n, y uno está dentro del otro
function tareasDelSprint(tareas, idsDelSprint) {
    return tareas.filter((t) => idsDelSprint.includes(t.id));
    // 3. El número de comparaciones en el peor de los casos, sería cuando no se cumple ninguna de las tareas buscadas. En tal caso si tenemos n tareas y m id's, esto sería tal cual nxm comparaciones o búsquedas, es decir n^2.
}
// Complejidad: O(n^2) - El bucle while se ejecuta n veces, y aunque se va reduciendo a medida que el shift interno actúa, en realidad el shift interno es de complejidad n, con lo cual serían de por sí dos bucles for anidados, por tanto n^2.
function procesarCola(tareas) {
    const cola = [...tareas];
    const procesadas = [];
    while (cola.length > 0) {
        const t = cola.shift();
        if (t !== undefined)
            procesadas.push(t.titulo);
    }
    return procesadas;
    // 4. Cada shift cuesta n comparaciones, entonces vemos que está dentro de un while del tamañod e la cola original (tareas). Entonces en cada operación se va reduciendo un elemento, pero esto no cambia que sea n^2 a nivel de curva.
}
// Kata 2 - Verifica dos con el cronómetro (medición)
// 1. Generación muchas tareas
const tareasMil = generarTareas(1000);
const tareasMill = generarTareas(1000000);
// 2. Generación de llamadas y cáuclo tiempos
console.time("Llamada a primeraTarea 1k");
primeraTarea(tareasMil);
console.timeEnd("Llamada a primeraTarea 1k");
console.time("Llamada a buscarPorId 1k");
buscarPorId(tareasMil, -200);
console.timeEnd("Llamada a buscarPorId 1k");
console.time("Llamada a primeraTarea 1M");
primeraTarea(tareasMill);
console.timeEnd("Llamada a primeraTarea 1M");
console.time("Llamada a buscarPorId 1M");
buscarPorId(tareasMill, -200);
console.timeEnd("Llamada a buscarPorId 1M");
// Resultados
/*
PS > node .\katas-complejidad.js
Llamada a primeraTarea 1k: 0.109ms
Llamada a buscarPorId 1k: 0.072ms
Llamada a primeraTarea 1M: 0.006ms
Llamada a buscarPorId 1M: 8.355ms
PS > node .\katas-complejidad.js
Llamada a primeraTarea 1k: 0.102ms
Llamada a buscarPorId 1k: 0.115ms
Llamada a primeraTarea 1M: 0.006ms
Llamada a buscarPorId 1M: 7.731ms
PS > node .\katas-complejidad.js
Llamada a primeraTarea 1k: 0.066ms
Llamada a buscarPorId 1k: 0.078ms
Llamada a primeraTarea 1M: 0.005ms
Llamada a buscarPorId 1M: 8.39ms
*/
// Conclusiones: Se observa que incluso es más rápido buscar la priemra tarea  con 1 millón que con 1. Y se observa claramente que la búsqueda por id (y por un id existente) es hasta 3 órdenes de magnitudo más grande de buscar 1000 que 1 millón, con lo cual esto cuadraría con la complejidad observada (1 vs. n).
// Kata 3 - Optimiza las dos más caras (mejora)
// Complejidad: O(n) es un bucle simple sin ninguno anidado dentro.
// Es más barato porque a diferencia del original no hay dos bucles anidados, de hecho en total solo hay un bucle
function hayTitulosDuplicadosV2(tareas) {
    const tareasCopy = [...tareas];
    const titulosEncontrados = new Set();
    while (tareasCopy.length > 0) {
        const tareaPorVer = tareasCopy.pop();
        if (tareaPorVer === undefined) {
            return false;
        }
        const tituloPorVer = tareaPorVer.titulo;
        if (titulosEncontrados.has(tituloPorVer)) {
            return true;
        }
        titulosEncontrados.add(tituloPorVer);
    }
    return false;
}
const tareasNew = [...tareas];
tareasNew.push({ id: 200, titulo: "Diseñar el tablero", estado: "en-curso", prioridad: 1 });
console.log(hayTitulosDuplicadosV2(tareasNew));
// Complejidad: O(n), se ve directament que es un único bucle que se ejecuta como tantas tareas haya en la lista
// A diferencia del original, que estaba haciendo el método `shift` dentro del bucle que eso internamente es un bucle entero, por lo tanto había dos bucles anidadeos.
function procesarColaV2(tareas) {
    const procesadas = [];
    for (const tarea of tareas) {
        procesadas.push(tarea.titulo);
    }
    return procesadas;
}
console.log(tareasNew);
const procesadasCola = procesarColaV2(tareasNew);
console.log(procesadasCola);
const tareas10Mil = generarTareas(10000);
console.time("Versión original con 10K");
hayTitulosDuplicados(tareas10Mil);
console.timeEnd("Versión original con 10K");
console.time("Versión mejorada con 10K");
hayTitulosDuplicadosV2(tareas10Mil);
console.timeEnd("Versión mejorada con 10K");
