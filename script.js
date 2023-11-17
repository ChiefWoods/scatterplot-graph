function createDate(time) {
  const splitTime = time.split(':')
  return new Date(0, 0, 0, 0, splitTime[0], splitTime[1])
}

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(dataset => {
    const width = 920;
    const height = 600;
    const padding = 45;
    const xOffset = 30;
    const purple = d3.schemePurples[9][3];

    const time = dataset.map(item => createDate(item.Time))

    time.unshift(new Date(0, 0, 0, 0, time[0].getMinutes(), time[0].getSeconds() - 30))
    time.push(new Date(0, 0, 0, 0, time[time.length - 1].getMinutes(), time[time.length - 1].getSeconds() + 30))

    const years = dataset.map(item => item.Year)

    const xScale = d3.scaleLinear()
      .domain([d3.min(years) - 1, d3.max(years) + 1])
      .range([padding, width - padding])

    const yScale = d3.scaleTime()
      .domain(d3.extent(time))
      .range([padding, height - padding])

    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.format('d'))

    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d3.timeFormat('%M:%S'))

    // Title
    d3.select('main')
      .append('h1')
      .text('Doping in Professional Bicycle Racing')
      .attr('id', 'title')
      .style('font-size', '3rem')
      .style('font-family', 'sans-serif')
      .style('font-weight', 400)

    // Subtitle
    d3.select('main')
      .append('p')
      .text("35 Fastest times up Alpe d'Huez")
      .style('font-size', '2rem')
      .style('font-family', 'sans-serif')

    // Main SVG
    const svg = d3.select('main')
      .append('svg')
      .style('width', width)
      .style('height', height)

    // Time in Minutes
    svg.append('text')
      .text('Time in Minutes')
      .attr('x', height * -0.35)
      .attr('y', padding - 20)
      .attr('transform', 'rotate(-90)')
      .style('font-size', '1.8rem')
      .style('font-family', 'sans-serif')

    // x-axis
    svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(${xOffset}, ${height - padding})`)
      .call(xAxis)

    // y-axis
    svg.append('g')
      .attr('id', 'y-axis')
      .attr('transform', `translate(${padding + xOffset}, 0)`)
      .call(yAxis)

    // Legend
    const legendTexts = [
      'No doping allegations',
      'Riders with doping allegations'
    ]

    const legend = svg.append('g')
      .attr('id', 'legend')

    const legendLabels = legend.selectAll('g')
      .data(legendTexts)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${width - 50}, ${height / 2 + i * 22 - 20})`)

    legendLabels.append('text')
      .text(d => d)
      .style('font-size', '1rem')
      .style('font-family', 'sans-serif')
      .style('text-anchor', 'end')

    legendLabels.append('rect')
      .attr('x', 10)
      .attr('y', -13)
      .style('width', 18)
      .style('height', 18)
      .style('fill', (d, i) => d3.schemeSet1[i])

    // Tooltip
    const tooltip = d3.select('main')
      .append('div')
      .attr('id', 'tooltip')
      .style('visibility', 'hidden')
      .style('position', 'absolute')
      .style('background-color', purple)
      .style('padding', '10px')
      .style('font-size', '1.2rem')
      .style('font-family', 'sans-serif')
      .style('border-radius', '8px')

    // Dot
    svg.selectAll('.dot')
      .data(dataset)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('data-xvalue', d => d.Year)
      .attr('data-yvalue', d => createDate(d.Time).toISOString())
      .attr('cx', d => xScale(d.Year) + xOffset)
      .attr('cy', d => yScale(createDate(d.Time)))
      .attr('r', 6)
      .style('fill', d => d.Doping ? d3.schemeSet1[1] : d3.schemeSet1[0])
      .style('stroke', 'black')
      .style('stroke-width', '1px')
      .style('opacity', 0.8)
      .on('mouseover', (e, d) => {
        tooltip.style('visibility', 'visible')

        tooltip.html(`${d.Name}: ${d.Nationality}<br>Year: ${d.Year}, Time: ${d.Time}${d.Doping ? '<br><br>' + d.Doping : ''}`)
          .attr('data-year', d.Year)
      })
      .on('mousemove', e => {
        tooltip.style('left', `${e.pageX + 10}px`)
          .style('top', `${e.pageY + 10}px`)
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden')
      })
  }).catch(error => console.error(error))
