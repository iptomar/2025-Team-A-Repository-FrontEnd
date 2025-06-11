export function verificarHorario(manchas, toast) {
  // Filtra só manchas com horário e dia válidos
  const manchasValidas = manchas.filter(
    m => m.horaInicio !== "00:00:00" && m.dia !== "0001-01-01"
  );

  // Mais de 8 horas num dia ---
  const minutosPorDia = {};
  manchasValidas.forEach(m => {
    minutosPorDia[m.dia] = (minutosPorDia[m.dia] || 0) + m.numSlots * 30;
  });
  const diasMais8Horas = Object.entries(minutosPorDia)
    .filter(([_, minutos]) => minutos > 480)
    .map(([dia, minutos]) => ({
      Dia: dia,
      TotalMinutos: minutos
    }));

  if (diasMais8Horas.length > 0) {
    const dias = diasMais8Horas
      .map(d => `(${(d.TotalMinutos/60).toFixed(1)}h)`)
      .join(", ");
    toast.warn(`Existem dias com mais de 8 horas de aulas: ${dias}`);
  }

  // Ter pelo menos 1h de almoço entre as 12h e as 14h ---
  const diasSemAlmoco = [];
  const manchasPorDia = manchasValidas.reduce((acc, m) => {
    acc[m.dia] = acc[m.dia] || [];
    acc[m.dia].push(m);
    return acc;
  }, {});

  Object.entries(manchasPorDia).forEach(([dia, manchasDia]) => {
    const almocoInicio = 12 * 60;
    const almocoFim = 14 * 60;
    const ocupados = Array(120).fill(false);

    manchasDia.forEach(m => {
      const [h, min] = m.horaInicio.split(":").map(Number);
      const inicio = h * 60 + min;
      const fim = inicio + m.numSlots * 30;
      const start = Math.max(inicio, almocoInicio);
      const end = Math.min(fim, almocoFim);
      for (let t = start; t < end; t++) {
        if (t >= almocoInicio && t < almocoFim) {
          ocupados[t - almocoInicio] = true;
        }
      }
    });

    let livres = 0;
    let temAlmoco = false;
    for (let i = 0; i < ocupados.length; i++) {
      if (!ocupados[i]) {
        livres++;
        if (livres >= 60) {
          temAlmoco = true;
          break;
        }
      } else {
        livres = 0;
      }
    }
    if (!temAlmoco) diasSemAlmoco.push(dia);
  });

  if (diasSemAlmoco.length > 0) {
    toast.warn(`Existem dias em que o docente não tem pelo menos 1h de almoço entre as 12h e as 14h`);
  }
}