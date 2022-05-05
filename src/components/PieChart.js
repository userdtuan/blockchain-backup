import React, { PureComponent } from "react";
import ReactEcharts from "echarts-for-react";

class Pie extends PureComponent {
  // getOption = () => ({
  //   title: {
  //     text: 'Referer of a Website',
  //     subtext: '',
  //     left: 'center'
  //   },
  //   tooltip: {
  //     trigger: 'item'
  //   },
  //   legend: {
  //     orient: 'vertical',
  //     left: 'left'
  //   },
  //   series: [
  //     {
  //       name: 'Voting count',
  //       type: 'pie',
  //       radius: '70%',
  //       data: [
  //         { value: this.props.chartVal, name: 'Donald Trump'},
  //         { value: 735, name: 'Joe Biden' },
  //         { value: 580, name: 'Hedari Clinton' },
  //         { value: 484, name: 'Barack Obama' }
  //       ],
  //       emphasis: {
  //         itemStyle: {
  //           shadowBlur: 10,
  //           shadowOffsetX: 0,
  //           shadowColor: 'rgba(0, 0, 0, 0.5)'
  //         }
  //       }
  //     }
  //   ]
  // });

getOption = () => ({
    title: {
      text: this.props.currentElect.description,
      subtext: '',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Voting count',
        type: 'pie',
        radius: '70%',
        data: this.props.formedArr,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  });

  render() {
    //   console.log(this.props)
    return (
      <ReactEcharts
        option={this.getOption()}
        style={{ height: "400px", width: "100%" }}
      />
    );
  }
}
export default Pie;
