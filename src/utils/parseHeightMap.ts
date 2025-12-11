// Lee mapas tipo FDF:
//  0 1 2 3
//  1 2 3 4
//  0 -1 -2 -3
//  1,0xFF0000 2,0x00FF00 ...
//
// De momento ignoramos el color y nos quedamos solo con la altura.

export function parseHeightMap(text: string): number[][] {
  // Dividimos en líneas, quitamos espacios y líneas vacías
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    throw new Error("Height map is empty");
  }

  const map: number[][] = [];

  for (const line of lines) {
    // Separar por espacios / tabs
    const rawTokens = line.split(/\s+/).filter(Boolean);

    if (rawTokens.length === 0) continue;

    const row: number[] = [];

    for (const token of rawTokens) {
      // token puede ser "3" o "3,0xFFFFFF"
      const [heightPart] = token.split(",");
      const value = Number(heightPart);

      if (Number.isNaN(value)) {
        console.warn(`Invalid height value "${token}" → ignoring`);
        continue;
      }

      row.push(value);
    }

    if (row.length > 0) {
      map.push(row);
    }
  }

  if (map.length === 0) {
    throw new Error("No valid rows in height map");
  }

  // Normalizar a rectángulo si alguna fila viene más corta/larga
  const maxWidth = Math.max(...map.map((row) => row.length));

  const normalized = map.map((row) => {
    if (row.length === maxWidth) return row;
    const padded = [...row];
    while (padded.length < maxWidth) {
      padded.push(0);
    }
    return padded;
  });

  return normalized;
}
