export function delitos_subtipo() {
  Promise.all([
    d3.json("/js/delitos_2022.json"),
    d3.json("/js/delitos_2023.json"),
  ]).then(([datos2022, datos2023]) => {
    datos2022.forEach((d) => (d.anio = "2022"));
    datos2023.forEach((d) => (d.anio = "2023"));

    const todos = [...datos2022, ...datos2023];
    console.log(todos);
    const agrupado = d3.rollups(
      todos,
      (v) => v.length,
      (d) => d.subtipo,
      (d) => d.anio
    );

    let data = agrupado.map(([subtipo, conteos]) => {
      const obj = { subtipo };
      conteos.forEach(([anio, count]) => {
        obj[anio] = count;
      });
      obj.total = (obj["2022"] || 0) + (obj["2023"] || 0);
      return obj;
    });
    console.log(data);
    data = data
      .sort((a, b) => b.total - a.total)
      .slice(0, 15)
      .reverse();

    const anios = ["2022", "2023"];
    const subtipo = data.map((d) => d.subtipo);

    const width = 900;
    const height = subtipo.length * 35 + 100; // ajustado para más espacio
    const margin = { top: 30, right: 40, bottom: 40, left: 180 };

    d3.select("#grafico").html("");

    const svg = d3
      .select("#grafico")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const y0 = d3
      .scaleBand()
      .domain(subtipo)
      .range([margin.top, height - margin.bottom])
      .paddingInner(0.05); // barras más gruesas

    const y1 = d3
      .scaleBand()
      .domain(anios)
      .range([0, y0.bandwidth()])
      .padding(0.05);

    const x = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (d) => Math.max(d["2022"] || 0, d["2023"] || 0)),
      ])
      .nice()
      .range([margin.left, width - margin.right]);

    const color = d3
      .scaleOrdinal()
      .domain(anios)
      .range(["rgb(19, 138, 156)", "rgb(0, 165, 159)"]);

    // Dibujar barras
    svg
      .append("g")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", (d) => `translate(0, ${y0(d.subtipo)})`)
      .selectAll("rect")
      .data((d) => anios.map((a) => ({ anio: a, count: d[a] || 0 })))
      .join("rect")
      .attr("x", x(0))
      .attr("y", (d) => y1(d.anio))
      .attr("width", (d) => x(d.count) - x(0))
      .attr("height", y1.bandwidth())
      .attr("fill", (d) => color(d.anio));

    // Etiquetas con cantidad (más lejos y legibles)
    svg
      .append("g")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", (d) => `translate(0, ${y0(d.subtipo)})`)
      .selectAll("text")
      .data((d) => anios.map((a) => ({ anio: a, count: d[a] || 0 })))
      .join("text")
      .attr("x", (d) => x(d.count) + 10) // separado de la barra
      .attr("y", (d) => y1(d.anio) + y1.bandwidth() / 2 + 4)
      .text((d) => d.count)
      .attr("fill", "#333")
      .style("font-size", "12px");

    // Eje X
    svg
      .append("g")
      .attr("transform", `translate(0,${margin.top - 10})`)
      .call(d3.axisTop(x));

    // Eje Y
    svg
      .append("g")
      .attr("transform", `translate(${margin.left - 10},0)`)
      .call(d3.axisLeft(y0).tickSize(0))
      .selectAll("text")
      .style("font-size", "10px");

    // Leyenda
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 150}, ${margin.top})`);

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
        .style("font-size", "11px");
    });
  });
}
