
export const imageWidth = 200;
const maxColorNumber = 256;

/**
 * @param {imageSrc,imageWidth}
 * 获取 图片数据
 * @return {Promise}
 */
export function compressImage(imageSrc,imgWid) {
    if (!imageSrc){
        return
    }

    return new Promise(function(resolve,reject){
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        let img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            canvas.width = imgWid;
            canvas.height = imgWid;
            ctx.drawImage(img,0,0,imgWid,imgWid)
            let data = ctx.getImageData(0,0,imgWid,imgWid)
            resolve(data);
        }
        img.src = imageSrc;
        // resolve(img);
        // addImageToDom(img,imgWid);
    });
}
/**
 * @param {img,imageWidth}
 * 将图片放入dom节点
 */
export function addImageToDom(img,imgWid){
    let body = document.body;
    if (imgWid){
        img.width = imgWid;
        img.height = imgWid;
    }
    body.append(img)
}
/**
 * @param {data}
 * 创建一个新的图片
 * @return {Image}
 */
export function createNewImage(imageData,width = 200) {
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = width;

    let ctx = canvas.getContext('2d');
    let wid = width ? width : Math.sqrt(imageData.length/4);
    let image = ctx.createImageData(wid,wid);
    imageData.forEach((ele,index)=>{
        image.data[index] = ele;
    })
    ctx.putImageData(image,0,0)
    let img = new Image();
    img.width = wid;
    img.height = wid;
    img.crossOrigin="Anonymous"
    img.src = canvas.toDataURL('image/png');
    return img
}

/**
 * @param {data}
 * 创建一个灰色图片
 * @return {Image}
 */
export function createGrayImage(imageData,threshold = 0,width = 0) {
    let newData = new Array(imageData.length)
    for (let i = 0; i < imageData.length; i += 4) {
        let gray = ~~((imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3)
        //灰度图片rgb为灰
        if(threshold){
            gray = gray > threshold ? 255:0;
        }
        newData[i] = gray;//红色
        newData[i + 1] = gray;//绿色
        newData[i + 2] = gray;//蓝色

        newData[i + 3] = 255;//透明度
    }
    if (width){
        // addImageToDom(createNewImage(newData,width),imageWidth);
      return createNewImage(newData,width);
    }else {
      return createNewImage(newData);
        // addImageToDom(createNewImage(newData));
    }
}

/**
 * @param {data}
 * 将图片数据压缩成一个8X8的数据
 * @return {Array}
 */
export function compressImageData(data) {
    let size =  Math.floor((data.length/4)/(8*8));
    let resData = [];
    for (let i = 0 ; i < data.length ;i += 4 * size){
        let r = 0,g= 0,b=0,a=0;
        for (let  j = i; j < 4 * size + i ;j += 4){
            r += data[j];
            g += data[j + 1];
            b += data[j + 2];
            a += data[j + 3]
        }
        resData.push(parseInt(r/size));
        resData.push(parseInt(g/size));
        resData.push(parseInt(b/size));
        resData.push(parseInt(a/size));
    }
    console.log(resData)
    return resData
}

/**
 * @param {data}压缩后的数据
 * 获取哈希数据
 * @return {Array}
 */
export function getHashData(data) {
    let grayList = [];
    for (let i = 0;i < data.length ;i += 4){
        grayList.push(data[i]);
    }
    let average = grayList.reduce((pre,cur)=>pre + cur,0)/(data.length/4);
    let res = grayList.map((ele)=>ele >= average?1:0);
    console.log(res)
    return res;
}

/**
 * @param {imageSrc,imageWidth}
 * 获取压缩的哈希数据
 * @return {Array}
 */
export async function getImageData(imgSrc,imgWid){
    let res = await compressImage(imgSrc,imgWid);
    let data = res.data;
    createGrayImage(data);
    let comData = compressImageData(data);
    let compressData = getHashData(comData);
    return compressData;
}

/**
 * @param {Array,Array}
 * 计算汉明距离
 * @return {float}
 */
export function caculateHanMimgDistance(data1,data2){
    let distance = 0;
    data1.forEach((ele,index)=>{
        if (data2[index] !== ele){
            distance ++;
        }
    });
    return (data1.length - distance)/data1.length;
}

/**
 * @param {imageData}
 * 将数据分堆
 * @return {Array}
 */
export function heapByColor(imageData){
      let colorRange = maxColorNumber/4;
      let colorHeap =  imageData.map(item=>Math.ceil((item + 1)/colorRange - 1));
      let colorMem = new Array(64).fill(0);
      for (let i = 0 ; i < colorHeap.length ; i += 4){
          let r = colorHeap[i];
          let g = colorHeap[i + 1];
          let b = colorHeap[i + 2];
          let res = r * Math.pow(4,2) + g * 4 + b;
          colorMem[res] ++
      }
      console.log(colorMem)
      return colorMem;
}

/**
 * @param {Array,Array}
 * 采用余弦相似性
 * @return {float}
 */
export function calculateCosResult(colorData1,colorData2){
    let colorData = 0;
    for (let i = 0 ; i < colorData1.length;i++){
        colorData +=  colorData1[i] * colorData2[i]
    }
    let colorD1 = colorData1.reduce((pre,cur)=>pre + Math.pow(cur,2),0);
    let colorD2 = colorData2.reduce((pre,cur)=>pre + Math.pow(cur,2),0);
    return colorData /(Math.sqrt(colorD1) * Math.sqrt(colorD2))
}

/**
 * @param {src,wid}
 * 颜色特征法处理数据
 * @return {imageData}
 */
export async function getImageColorInfo(src,wid){
    let imageData =  await compressImage(src,wid)
    return heapByColor(imageData.data);
}
/**
 * @param {imageData}
 * 内容特征法。将图片处理更加立体的颜色
 */
export function getColorWeightData(imageData,width){
    let newImageData = new Array(imageData.length);
    for (let i = 0 ; i < imageData.length ; i +=4){
        //由于颜色权重不同，所以采用0.3 0.59 0.11来处理颜色
        let gray = ~~(imageData[i] * 0.299 + 0.587 * imageData[i + 1] + 0.114 * imageData[i + 2]);
        newImageData[i] = gray;
        newImageData[i + 1] = gray;
        newImageData[i + 2] = gray;
        newImageData[i + 3] = 255;
    }
    // addImageToDom(createNewImage(newImageData,width),200);
    return newImageData;
}

/**
 * @param {src,wid}
 * 内容特征法
 * 获取阙值
 * @return {number}
 */
export function getDataByOtsuMethod(grayData){
    let ptr = 0
    let histData = Array(256).fill(0)
    let total = grayData.length

    while (ptr < total) {
        let h = 0xFF & grayData[ptr++]
        histData[h]++
    }

    let sum = 0
    for (let i = 0; i < 256; i++) {
        sum += i * histData[i]
    }

    let wB = 0
    let wF = 0
    let sumB = 0
    let varMax = 0
    let threshold = 0

    for (let t = 0; t < 256; t++) {
        wB += histData[t]
        if (wB === 0) continue
        wF = total - wB
        if (wF === 0) break

        sumB += t * histData[t]

        let mB = sumB / wB
        let mF = (sum - sumB) / wF

        let varBetween = wB * wF * (mB - mF) ** 2

        if (varBetween > varMax) {
            varMax = varBetween
            threshold = t
        }
    }

    return threshold
}

/**
 * @param {grayData,threshold}
 * 内容特征法
 * return {Array}
 */
export function calculateOtsuMatrix(grayData, threshold){
    let resArr = new Array(grayData.length/4)
    for (let i = 0,j = 0; i < grayData.length;i += 4,j++){
            resArr[j] = Number(grayData[i] > threshold);
    }
    return resArr;
}
/**
 * @param {src,wid}
 * 内容特征法
 */
export async function analyseImageData(src,wid,calculate = true){
    let res = await compressImage(src,wid);
    let data = res.data;
    let grayData = getColorWeightData(data,wid);
    if (calculate){
        let res = getDataByOtsuMethod(grayData);
        createGrayImage(grayData,res,wid)
        return calculateOtsuMatrix(grayData,res);
    }
}

export async function getHashResult(url1,url2){
  let res1 = await getImageData(url1,imageWidth);
  let res2 = await getImageData(url2,imageWidth);
  let compareResult = caculateHanMimgDistance(res1,res2);
  return compareResult;
}


export async function getColorResult(url1,url2){
  let resColor1 = await getImageColorInfo(url1,200);
  let resColor2 = await getImageColorInfo(url2,200);
  let colorResult = calculateCosResult(resColor1,resColor2)
  return colorResult;
}

export async function getContentAnalyse(url1,url2){
  let resContent1 = await analyseImageData(url1,200);
  let resContent2 = await analyseImageData(url2,200);
  let compareContResult = caculateHanMimgDistance(resContent1,resContent2);
  return compareContResult
}

async function getDifferentResult(){
    //hash方法
    // let res1 = await getImageData('./testImg.jpg',200);
    // let res2 = await getImageData('./testImg_2.jpg',200);
    // let compareResult = caculateHanMimgDistance(res1,res2);
    // console.log('compressResult: ' + compareResult)
    //
    // //颜色特征
    // let resColor1 = await getImageColorInfo('./testImg.jpg',200);
    // let resColor2 = await getImageColorInfo('./testImg_2.jpg',200);
    // let colorResult = calculateCosResult(resColor1,resColor2)
    // console.log('colorFeatureResult: ' + colorResult);
    //
    // //内容分析法
    // let resContent1 = await analyseImageData('./testImg.jpg',200);
    // let resContent2 = await analyseImageData('./testImg_2.jpg',200);
    // let compareContResult = caculateHanMimgDistance(resContent1,resContent2);
    // console.log('compressContentResult: ' + compareContResult)

}

getDifferentResult();
