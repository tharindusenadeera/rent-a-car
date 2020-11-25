import React from "react";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTooltip } from "victory";
import { isMobile } from "react-device-detect";

const getValue = maxValue => {
  let adjustedValue = 0;
  let gap = [
    0.2,
    0.5,
    1,
    2,
    5,
    10,
    20,
    50,
    100,
    200,
    500,
    1000,
    2000,
    5000,
    10000,
    20000,
    50000,
    100000,
    500000
  ];
  for (let i = 0; i < gap.length; i++) {
    if (Math.ceil(maxValue / gap[i]) <= 5) {
      adjustedValue = gap[i] * Math.ceil(maxValue / gap[i]);
      break;
    }
  }
  return adjustedValue;
};

const Chart = props => {
  let tickFormat = [];
  if (props.selectOption === 3) {
    tickFormat = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
  } else if (props.selectOption === 2) {
    tickFormat = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
  } else {
    tickFormat = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  }

  let maxValue = Math.max.apply(
    Math,
    props.data.map(function(item) {
      return item.earning;
    })
  );

  return (
    <div className="Prof_earnchart">
      <VictoryChart
        minDomain={{ y: 0 }}
        maxDomain={{ y: maxValue ? getValue(maxValue) : 100 }}
        // maxDomain={{ y: props.maxValue }}
        domainPadding={16}
        height={200}
        width={isMobile ? 380 : 400}
        padding={isMobile ? 42 : 28}
        animate={{ duration: 3000, easing: "bounce" }}
      >
        <VictoryAxis
          tickFormat={tickFormat}
          style={{
            tickLabels: {
              padding: 10,
              fontSize: 5
            }
          }}
        />

        <VictoryAxis
          dependentAxis
          tickFormat={y => `$ ${y}`}
          offsetX={isMobile ? 45 : 30}
          padding={{ top: 0 }}
          style={{
            tickLabels: {
              fontSize: 5
            }
          }}
        />

        <VictoryBar
          data={props.data}
          x="xAxisLable"
          y="earning"
          style={{
            data: { fill: "#FC642D", width: isMobile ? 14 : 5 }
          }}
          labelComponent={
            <VictoryTooltip
              width={isMobile ? 45 : 28}
              height={isMobile ? 15 : 10}
              cornerRadius={d => (d.x > 6 ? 0 : 2)}
              pointerLength={d => (d.y > 0 ? 5 : 2)}
              flyoutStyle={{
                stroke: d => (d.x === 1 ? "black" : "#E2E2E2"),
                strokeWidth: 0.5,
                fill: "white",
                fontSize: 18
              }}
              style={{
                fontSize: isMobile ? 7 : 5,
                fontWeight: 500,
                fontFamily: "Arial"
              }}
            />
          }
          events={[
            {
              /* chart hover color */
              target: "data",
              eventHandlers: {
                onMouseOver: () => {
                  return [
                    {
                      target: "data",
                      mutation: () => ({
                        style: {
                          fill: "#00C07F",
                          width: isMobile ? 13 : 4
                        }
                      })
                    },
                    {
                      target: "labels",
                      mutation: () => ({ active: true })
                    }
                  ];
                },
                onMouseOut: () => {
                  return [
                    {
                      target: "data",
                      mutation: () => {}
                    },
                    {
                      target: "labels",
                      mutation: () => ({ active: false })
                    }
                  ];
                }
              }
            }
          ]}
        />
      </VictoryChart>
    </div>
  );
};
export default Chart;
