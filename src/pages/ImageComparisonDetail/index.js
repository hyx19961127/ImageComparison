import React from "react";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {Alert, Button, Card} from "antd";
import {headerInfoText} from "@/utils/common";
import UploadImage from "@/components/UploadImage";
import {SyncOutlined} from "@ant-design/icons";

class ImageComparisonDetail extends React.Component{


  state = {
    imageOne: null,
    imageTwo: null
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

  render () {
    return (
      <PageHeaderWrapper>
        <Card>
          <div>
            <Alert message={headerInfoText} type="info" showIcon/>
            <UploadImage setUploadImage={this.setImageOne} pageTitle="图像一"/>
            <UploadImage setUploadImage={this.setImageTwo} pageTitle="图像二"/>
            <Button className="analyse-btn" type="primary" icon={<SyncOutlined/>}>开始分析</Button>
          </div>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default ImageComparisonDetail;
