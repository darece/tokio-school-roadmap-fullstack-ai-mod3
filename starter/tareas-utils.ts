type Prioridad = 1 | 2 | 3;

type Tarea = {
	id: number,
	titulo: string,
	estado: "pendiente" | "en-curso" | "hecha",
	prioridad: number
};

// Complejidad: O(n) - El método `find` ha de recorrer todos los elementos, y por tanto en el peor de los casos puede estar al final de todo la tarea encontrada, además, no hace ningúna optimizaciónd e partición, sino que es secuencial
function buscarPorId(tareas: Tarea[], id: number): Tarea | null {
  return tareas.find((t) => t.id === id) ?? null;
}

// Complejidad: O(n) - Son dos for independientes, con lo cual 2n -> n anulando la ocnstante.
function contarPendientesYHechas(tareas: Tarea[]): {pendientes: number, hechas: number} {
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

// Complejidad: O(n) - Es un bucle simple sin ninguno anidado dentro.
function hayTitulosDuplicados(tareas: Tarea[]): boolean {
	const tareasCopy = [...tareas];
	const titulosEncontrados = new Set();
	while(tareasCopy.length>0) {
		const tareaPorVer = tareasCopy.pop();
		if (tareaPorVer === undefined) {
			return false;
		}
		const tituloPorVer: string | undefined = tareaPorVer.titulo;
		
		if(titulosEncontrados.has(tituloPorVer)) {
			return true;
		}
		titulosEncontrados.add(tituloPorVer);
		
	}
	return false;
}

// Complejidad: O(n log n) - Es la que da javascript de forma nativa el método y las más óptima
function ordenarPorPrioridad(tareas: Tarea[]): Tarea[] {
	return [...tareas].sort((a, b) => a.prioridad-b.prioridad);
}

export { buscarPorId, contarPendientesYHechas, hayTitulosDuplicados, ordenarPorPrioridad };


const tareas: Tarea[] = [
  { id: 101, titulo: "Diseñar el tablero", estado: "pendiente", prioridad: 2 },
  { id: 102, titulo: "Modelo de usuario", estado: "en-curso", prioridad: 1 },
  { id: 103, titulo: "Configurar linter", estado: "hecha", prioridad: 3 },
  { id: 104, titulo: "Pantalla de login", estado: "pendiente", prioridad: 1 },
  { id: 105, titulo: "API de comentarios", estado: "en-curso", prioridad: 2 },
];

console.log(ordenarPorPrioridad(tareas));