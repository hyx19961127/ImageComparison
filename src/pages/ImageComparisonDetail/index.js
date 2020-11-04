import React from "react";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {Alert, Button, Card, Spin, Empty, Image} from "antd";
import {headerInfoText} from "@/utils/common";
import UploadImage from "@/components/UploadImage";
import {SyncOutlined} from "@ant-design/icons";
import {
  compressImage,
  createGrayImage,
  createNewImageSrc,
  getColorWeightData, getDataByOtsuMethod
} from "@/utils/compressImg";

const imageInfoDef = {
  imageRes: {
    title: "原图",
  },
  greyRes: {
    title: "灰度图像"
  },
  compressRes: {
    title: "色彩对比图",
  }
}

class ImageComparisonDetail extends React.Component {


  state = {
    imageOne: null,
    loading: false,
    detailResult: [],
    imageInfo: null
  }

  setImageOne = (imageOne) => {
    this.setState({
      imageOne
    })
  }

  dealImage = () => {
    let compressRes = compressImage(this.state.imageOne)

    compressRes.then(res => {
      let grayData = getColorWeightData(res.data);
      let resD = getDataByOtsuMethod(grayData);
      let colorRes = createGrayImage(grayData,resD,200,true)

      let greyImageRes = createGrayImage(res.data, 0, 200, true);
      imageInfoDef.compressRes.img = colorRes;
      imageInfoDef.imageRes.img = res.data;
      imageInfoDef.greyRes.img = greyImageRes;
      this.setState({imageInfo: imageInfoDef})
    })

  }

  anaylseImageDetail = () => {
    if (!this.state.imageInfo) {
      return <Empty/>
    }
    let data = this.state.imageInfo;
    let resArr = [];
    for (let item in data) {
      let ele = data[item];
      resArr.push(
        <div className="image-result-cls">
          <h4>{ele.title}</h4>
          <Image src={createNewImageSrc(ele.img)}/>
        </div>
      )
    }
    return resArr;
  }

  render () {
    let {imageOne} = this.state;

    return (
      <PageHeaderWrapper>
        <Spin spinning={this.state.loading}>
          <Card>
            <Card.Grid style={{width: "100%"}} hoverable={false}>
              <Alert message={headerInfoText} type="info" showIcon/>
              <UploadImage setUploadImage={this.setImageOne} pageTitle="图像一"/>
              <Button className="analyse-btn" type="primary" onClick={this.dealImage} icon={<SyncOutlined/>}
                      disabled={!(imageOne)}>开始分析</Button>
            </Card.Grid>
            <Card.Grid hoverable={false} style={{width: "100%"}}>
              <h2 className="table-result-title">图像处理结果</h2>
              {this.anaylseImageDetail()}
            </Card.Grid>
          </Card>
        </Spin>
      </PageHeaderWrapper>
    )
  }
}

export default ImageComparisonDetail;
