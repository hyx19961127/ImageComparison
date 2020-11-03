import React from "react";

import {Upload, Modal, Button,Card,message} from 'antd';
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import PropTypes from "prop-types";

class UploadImage extends React.Component {
  state = {
    imageUrl: null,
    previewVisible: false,
  };

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('请选择jpeg或者png');
    }
    return isJpgOrPng;
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      this.getBase64(info.file.originFileObj, imageUrl =>
        this.setImageUrl(imageUrl)
      );
    }
  };

  setImageUrl = (imageUrl)=>{
    if (this.props.setUploadImage){
      this.props.setUploadImage.call(this,imageUrl)
    }
    this.setState({
      imageUrl
    })
  }

  handleCancel = () => this.setState({previewVisible: false});

  handlePreview = () => {
    this.setState({
      previewVisible: true,
    });
  };

  getPreviewBtn = () => {
    if (!this.state.imageUrl) {
      return null;
    }
    return (
      <div className="upload-btn-cls">
        <Button type="dashed" onClick={this.handlePreview}>预览</Button>
        <Button type="dashed" onClick={this.onRemove}>删除</Button>
      </div>
    )
  }

  onRemove = () => {
    this.setState({imageUrl: null});
  }

  render () {

    const {pageTitle}  = this.props;

    return (
      <Card title={pageTitle || ''} hoverable className="upload-iamge-cls">
        <Upload
          listType="picture-card"
          onChange={this.handleChange}
          showUploadList={false}
          className="image-upload-cls"
          beforeUpload={this.beforeUpload}
        >
          {this.state.imageUrl ? <img src={this.state.imageUrl} className="upload-img-cls"/> :
            <PlusOutlined style={{fontSize: '30px'}}/>}
        </Upload>
        {this.getPreviewBtn()}
        <Modal
          visible={this.state.previewVisible}
          title="预览图片"
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{width: '100%'}} src={this.state.imageUrl}/>
        </Modal>
      </Card>
    );
  }
}

export default UploadImage;

UploadImage.propTypes = {
  pageTitle:PropTypes.string,
  setUploadImage:PropTypes.func
}
