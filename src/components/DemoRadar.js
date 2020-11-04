import React from 'react';
import {Radar} from "@ant-design/charts";
import PropTypes from "prop-types";

const DemoRadar = (props) => {

  let {data,xField,yField,alias,} = props;
  debugger
  const config = {
    data,
    xField: xField,
    yField: yField,
    meta: { score: { alias: alias } },
    xAxis: {
      line: null,
      tickLine: null,
      grid: { line: { style: { lineDash: null } } },
    },
    height:300,
    point: {},
  };
  return <Radar {...config} />;
};

DemoRadar.propTypes = {
  data:PropTypes.array.isRequired,
  xField: PropTypes.string,
  yField: PropTypes.string,
  alias: PropTypes.string,
  height: PropTypes.number,
}

DemoRadar.defaultProps = {
  // data:[],
  xField:"x",
  yField:"y",
  alias:"相似",
  height:300
}

export default DemoRadar;
