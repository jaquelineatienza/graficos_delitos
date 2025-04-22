export function delitos_mes() {
  Promise.all([
    d3.json("./js/delitos_2022.json"),
    d3.json("./js/delitos_2023.json"),
  ]).then(([datos2022, datos2023]) => {
    datos2022.forEach((d) => (d.anio = "2022"));
    datos2023.forEach((d) => (d.anio = "2023"));

    const todos = [...datos2022, ...datos2023];

    // Agrupar por mes y año
    const agrupado = d3.rollups(
      todos,
      (v) => v.length,
      (d) => d.mes,
      (d) => d.anio
    );

    // Transformar datos
    let data = agrupado.map(([mes, conteos]) => {
      const obj = { mes };
      conteos.forEach(([anio, count]) => {
        obj[anio] = count;
      });
      obj.total = (obj["2022"] || 0) + (obj["2023"] || 0);
      return obj;
    });

    // Ordenar de menor a mayor para que el mayor quede abajo (último)
    data = data.sort((a, b) => a.total - b.total);

    const anios = ["2022", "2023"];
    const mes = data.map((d) => d.mes);

    const width = 900;
    const height = mes.length * 25 + 100;
    const margin = { top: 30, right: 40, bottom: 40, left: 180 };

    d3.select("#grafico").html("");

    const svg = d3
      .select("#grafico")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const y0 = d3
      .scaleBand()
      .domain(mes)
      .range([margin.top, height - margin.bottom])
      .paddingInner(0.2);

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
      .attr("transform", (d) => `translate(0, ${y0(d.mes)})`)
      .selectAll("rect")
      .data((d) => anios.map((a) => ({ anio: a, count: d[a] || 0 })))
      .join("rect")
      .attr("x", x(0))
      .attr("y", (d) => y1(d.anio))
      .attr("width", (d) => x(d.count) - x(0))
      .attr("height", y1.bandwidth())
      .attr("fill", (d) => color(d.anio));

    // Etiquetas de cantidad
    svg
      .append("g")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", (d) => `translate(0, ${y0(d.mes)})`)
      .selectAll("text")
      .data((d) => anios.map((a) => ({ anio: a, count: d[a] || 0 })))
      .join("text")
      .attr("x", (d) => x(d.count) + 3)
      .attr("y", (d) => y1(d.anio) + y1.bandwidth() / 2 + 4)
      .text((d) => d.count)
      .attr("fill", "#333");

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
      .style("font-size", "12px");

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
        .style("font-size", "9px");
    });
  });
}
