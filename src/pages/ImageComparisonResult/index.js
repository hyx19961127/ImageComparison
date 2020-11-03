import React from "react";
import UploadImage from "@/components/UploadImage";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {Card, Alert, Button, Table, Spin} from "antd";
import {headerInfoText} from "@/utils/common";
import {SyncOutlined} from "@ant-design/icons";
import {getColorResult, getContentAnalyse, getHashData, getHashResult} from "@/utils/compressImg";
import {comparisonResultColumns} from "@/pages/ImageComparisonResult/ImageComparisonResult";

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
    ]
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
      this.setState({
        comparisonResult: [{
          contentResult: res[2],
          colorResult: res[1],
          hashResult: res[0]
        }]
      })
    });
  }

  render () {

    let {imageOne, imageTwo, comparisonResult} = this.state;

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
            <Card.Grid hoverable={false} style={{width:"50%"}}>
              <Table pagination={false} columns={comparisonResultColumns} dataSource={comparisonResult}/>
            </Card.Grid>
            <Card.Grid hoverable={false} style={{width:"50%"}}>
            </Card.Grid>
          </Card>
        </Spin>
      </PageHeaderWrapper>
    )
  }
}

export default ImageComparisonResult;
