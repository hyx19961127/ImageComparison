import React from "react";
import UploadImage from "@/components/UploadImage";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {Card, Alert, Button, Table, Spin} from "antd";
import {headerInfoText} from "@/utils/common";
import {SyncOutlined} from "@ant-design/icons";
import {getColorResult, getContentAnalyse, getHashResult} from "@/utils/compressImg";
import {comparisonResultColumns} from "@/pages/ImageComparisonResult/ImageComparisonResult";
import DemoRadar from "@/components/DemoRadar";
import {isNotEmptyArray} from "@/utils/utils";

class ImageComparisonResult extends React.Component {

  state = {
    imageOne: null,
    imageTwo: null,
    loading: false,
    comparisonResult: [
      {
        contentResult: null,
        colorResult: null,
        hashResult: null
      }
    ],
    comparisonChartsRes:[{title:"ddd",value:0}],
  }

  constructor (props) {
    super(props);
  }

  setLoading = (loading) => {
    this.setState({loading})
  }

  setImageOne = (imageOne) => {
    this.setState({
      imageOne
    })
  }

  setImageTwo = (imageTwo) => {
    this.setState({
      imageTwo
    })
  }

  anaylseImageData = () => {

    this.setLoading(true);
    let hashResult = getHashResult(this.state.imageOne, this.state.imageTwo);
    let colorResult = getColorResult(this.state.imageOne, this.state.imageTwo);
    let contentResult = getContentAnalyse(this.state.imageOne, this.state.imageTwo);

    Promise.all([hashResult, colorResult, contentResult]).then(res => {
      this.setLoading(false);
      this.setComparisonResult(res);
    });
  }

  setComparisonResult = (res)=>{
    if (!isNotEmptyArray(res)){
      return;
    }
    let [hashResult,colorResult,contentResult] = res;
    let titleInfo = [...comparisonResultColumns];

    let result = {
      contentResult: contentResult || '',
      colorResult: colorResult || '',
      hashResult: hashResult || ''
    };

    titleInfo.forEach(ele=>{
      if (result[ele.key]){
        ele.value = result[ele.key];
      }else {
        ele.value = 0;
      }
    })

    this.setState({
      comparisonResult: [result],
      comparisonChartsRes:titleInfo,
    })
  }

  render () {

    let {imageOne, imageTwo, comparisonResult, comparisonChartsRes} = this.state;

    return (
      <PageHeaderWrapper>
        <Spin spinning={this.state.loading}>
          <Card>
            <Card.Grid style={{width:"100%"}} hoverable={false}>
              <Alert message={headerInfoText} type="info" showIcon/>
              <UploadImage setUploadImage={this.setImageOne} pageTitle="图像一"/>
              <UploadImage setUploadImage={this.setImageTwo} pageTitle="图像二"/>
              <Button className="analyse-btn" onClick={this.anaylseImageData} disabled={!(imageOne && imageTwo)}
                      type="primary" icon={<SyncOutlined/>}>开始分析</Button>
            </Card.Grid>
            <Card.Grid hoverable={false} className="anaylse-result-cls">
              <h2 className="table-result-title">分析结果</h2>
              <Table pagination={false} columns={comparisonResultColumns} dataSource={comparisonResult}/>
            </Card.Grid>
            <Card.Grid hoverable={false} className="anaylse-result-cls">
              <h2 className="table-result-title">分析图表</h2>
              <DemoRadar yField="value" xField="title" data={comparisonChartsRes} />
            </Card.Grid>
          </Card>
        </Spin>
      </PageHeaderWrapper>
    )
  }
}

export default ImageComparisonResult;
