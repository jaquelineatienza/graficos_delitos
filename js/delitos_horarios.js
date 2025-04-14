export function delitos_horario() {
  Promise.all([
    d3.json("./js/delitos_2022.json"),
    d3.json("./js/delitos_2023.json"),
  ]).then(([datos2022, datos2023]) => {
    // Añadir campo año
    datos2022.forEach((d) => (d.anio = "2022"));
    datos2023.forEach((d) => (d.anio = "2023"));

    const todos = [...datos2022, ...datos2023];

    // Agrupar por hora y año
    const conteoPorHoraYAnio = d3.rollups(
      todos,
      (v) => v.length,
      (d) => +d.franja_horaria,
      (d) => d.anio
    );

    // Transformar a estructura más útil
    const data = conteoPorHoraYAnio.map(([hora, valores]) => {
      const obj = { hora };
      valores.forEach(([anio, count]) => {
        obj[anio] = count;
      });
      return obj;
    });

    const anios = ["2022", "2023"];
    const width = 850;
    const height = 400;
    const margin = { top: 30, right: 30, bottom: 40, left: 40 };

    const svg = d3
      .select("#grafico2")
      .html("")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const x0 = d3
      .scaleBand()
      .domain(data.map((d) => d.hora))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const x1 = d3
      .scaleBand()
      .domain(anios)
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (d) => Math.max(d["2022"] || 0, d["2023"] || 0)),
      ])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const color = d3
      .scaleOrdinal()
      .domain(anios)
      .range(["rgb(19, 138, 156)", "rgb(0, 165, 159)"]); // Azul y verde

    // Dibujar barras
    svg
      .append("g")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", (d) => `translate(${x0(d.hora)},0)`)
      .selectAll("rect")
      .data((d) => anios.map((a) => ({ anio: a, count: d[a] || 0 })))
      .join("rect")
      .attr("x", (d) => x1(d.anio))
      .attr("y", (d) => y(d.count))
      .attr("width", x1.bandwidth())
      .attr("height", (d) => y(0) - y(d.count))
      .attr("fill", (d) => color(d.anio));

    // Eje X
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(x0)
          .tickFormat((d) => `${d}:00`)
          .tickSizeOuter(0)
      );

    // Eje Y
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Etiquetas sobre las barras
    svg
      .append("g")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", (d) => `translate(${x0(d.hora)},0)`)
      .selectAll("text")
      .data((d) => anios.map((a) => ({ anio: a, count: d[a] || 0 })))
      .join("text")
      .attr("x", (d) => x1(d.anio) + x1.bandwidth() / 2)
      .attr("y", (d) => y(d.count) - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .text((d) => d.count);

    // Leyenda
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 130}, ${margin.top})`);

    anios.forEach((a, i) => {
      const g = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
      g.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", color(a));
      g.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .text(a)
        .style("font-size", "12px");
    });
  });
}
