
import * as d3 from "d3";
import { useEffect } from 'react';

const CreateGraph = ({ setStoreMarketData
}) => {


  const SubmitApi = async () => {
    d3.select("svg").remove()

    //read the data from api response
    const parseTime = d3.timeParse("%Y-%m-%d"),
      formatDate = d3.timeFormat("%b %d");
    let list = setStoreMarketData
    list.map((d) => {
      d.day = parseTime(d.day);
    });

    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 20, bottom: 50, left: 70 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // add X axis and Y axis
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    x.domain(d3.extent(list, (d) => { return d.day; }));
    y.domain([0, d3.max(list, (d) => { return d.high; })]).nice();

    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickFormat(formatDate))
      .style("font", "14px times");

    svg.append("g")
      .call(d3.axisLeft(y))
      .style("font", "14px times");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("market rates (USD)");

    svg
      .append("text")
      .attr("class", "x label")
      .attr("y", height + 40)
      .attr("x", width / 2)
      .style("text-anchor", "middle")
      .text("Days");

    svg
      .append("text")
      .attr("class", "title")
      .attr("x", width / 2)
      .attr("y", 0 - margin.top / 2)
      .attr("text-anchor", "middle")
      .text("Market rates");

    // add the Line to the graph based on market rates

    const high = d3.line()
      .x((d) => { return x(d.day); })
      .y((d) => { return y(d.high); });

    const low = d3.line()
      .x((d) => { return x(d.day); })
      .y((d) => { return y(d.low); });

    const mean = d3.line()
      .x((d) => { return x(d.day); })
      .y((d) => { return y(d.mean); });

    svg.append("path")
      .data([list])
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 2.5)
      .attr("d", high);

    svg.append("path")
      .data([list])
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 2.5)
      .attr("d", low);

    svg.append("path")
      .data([list])
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2.5)
      .attr("d", mean)

  }

  useEffect(() => {

    SubmitApi()
  }, [SubmitApi])

  return (

    <div style={{ marginLeft: '20px' }}>
      <ul>
        <li style={{ color: 'red' }}>
          High
        </li>
        <li style={{ color: 'blue' }}>
          Average
        </li>
        <li style={{ color: 'green' }}>
          Low
        </li>
      </ul>
    </div>


  )
}

export default (CreateGraph);