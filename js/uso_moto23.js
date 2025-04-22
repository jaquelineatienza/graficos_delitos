export function uso_moto23() {
  const width = 350;
  const height = 350;
  const radius = Math.min(width, height) / 2;

  const color = d3
    .scaleOrdinal()
    .domain(["Con moto", "Sin moto"])
    .range(["rgb(19, 138, 156)", "rgb(0, 165, 159)"]);

  const archivo = `js/delitos_2023.json`;

  d3.json(archivo).then((datos) => {
    const conteo = d3.rollups(
      datos,
      (v) => v.length,
      (d) => d["uso_moto"]
    );
    console.log("2022", conteo);
    const data = conteo
      .map(([clave, valor]) => ({ clave, valor }))
      .filter((d) => d.clave);

    const total = d3.sum(data, (d) => d.valor);

    d3.select("#grafico_moto23").html("");

    const svg = d3
      .select("#grafico_moto23")
      .append("svg")
      .attr("width", width)
      .attr("height", height + 40) // espacio extra para la leyenda
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie().value((d) => d.valor);
    const arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(radius - 10);

    const arcs = pie(data);

    svg
      .selectAll("path")
      .data(arcs)
      .join("path")
      .attr("d", arc)
      .attr("fill", (d) =>
        color(d.data.clave === "SI" ? "Con arma" : "Sin arma")
      )
      .attr("stroke", "white")
      .attr("stroke-width", 2);

    svg
      .selectAll("text")
      .data(arcs)
      .join("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "12px")
      .text((d) => {
        const porcentaje = ((d.data.valor / total) * 100).toFixed(1);
        return porcentaje > 2 ? `${porcentaje}%` : "";
      });

    const leyenda = d3
      .select("#grafico_arma svg")
      .append("g")
      .attr("transform", `translate(${width / 2 - 60}, ${height + 10})`);

    // const leyendas = [
    //   { texto: "sin moto", color: "rgb(0, 165, 159)" },
    //   { texto: "con moto", color: "rgb(19, 138, 156)" },
    // ];
    leyenda
      .selectAll("g")
      .data(leyendas)
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`)
      .each(function (d) {
        d3.select(this)
          .append("rect")
          .attr("width", 12)
          .attr("height", 12)
          .attr("fill", d.color);

        d3.select(this)
          .append("text")
          .attr("x", 16)
          .attr("y", 10)
          .text(d.texto)
          .style("font-size", "11px");
      });
  });
}
