---
title: WebRTC系列[1]手把手教你实现一个浏览器拍照室Demo
date: 2018-11-13 23:44
tags:
- 博客园
- JavaScript
- WebRTC
---

博客迁移 [原博客园链接](https://www.cnblogs.com/peerless1029/p/9955640.html)

#### 1.WebRTC开发背景
由于业务需求，需要在项目中实现实时音视频通话功能，之前基于浏览器开发的Web项目要进行音视频通话，需要安装flash插件才能实现或者使用C/S客户端进行通信。随着互联网技术的驱动下，在很多场景下需要进行音视频通信，在生活中我们现在使用电话越来越少，使用微信和视频越来越多。在一些行业也需要进行音视频实时通信，如：在线教育，远程医疗，保险理赔等等。有了WebRTC，可以开发一些好的网页应用，<!--more-->使得音视频通话越来越简单，无需安装任何插件，只需打开网页，就能实现音视频通话，方然也能实现消息收发，文件收发等等，下面，根据自己平时的项目开发与，对WebRTC就行一个简单的理解与概述，最终实现一个简单的拍照室Demo。

#### 2.WebRTC历史和概述
WebRTC是“网络实时通信”（Web Real Time Communication）的缩写。它最初是为了解决浏览器上视频通话而提出的，即两个浏览器之间直接进行视频和音频的通信，不经过服务器。后来发展到除了音频和视频，还可以传输文字和其他数据。2010年5月，Google以6820万美元收购VoIP软件开发商Global IP Solutions的GIPS引擎，并改为名为“WebRTC”。WebRTC使用GIPS引擎，实现了基于网页的视频会议，并支持722，PCM，ILBC，ISAC等编码，同时使用谷歌自家的VP8视频解码器；同时支持RTP/SRTP传输等。Google是WebRTC的主要支持者和开发者，它推动了WebRTC标准的确立。

WebRTC是一门年轻的技术，从2011推出到2017年，一直发展的不温不火。根据一段时间的开发，个人认为主要原因有：各个浏览器的支持兼容程度和在互联网环境下点对点能够连接的成功率。从2017年苹果公司宣布iOS11的Safari浏览器支持WebRTC，一些云通信产品例如腾讯云通信和网易云通信也是基于WebRTC上进行封装二次开发，也间接的说明了WebRTC发展会越来越好。
![webRTC.png](https://i.loli.net/2019/10/20/ZhkzxleM2JjbduO.png)
![webRTC2.png](https://i.loli.net/2019/10/20/esLPuF9Of4j7nRB.png)
#### 3.基本概念的了解
为了简化开发，WebRTC在浏览器中API集成了大量的技术，解决了一些繁重的问题，如捕捉摄像头和麦克风，处理音视频流，传输层等等。

![webRTC3.png](https://i.loli.net/2019/10/20/HXkPIy5VrnJUTqQ.png)
- 捕捉摄像头和麦克风

    建立通信平台第一步要检测用户设备的摄像头和麦克风权限，先检测设备的可用性，然后在获取用户授权并与设备建立连接，最后获取一段数据流。

- 音频与视频的编解码

    在互联网要发送一段音视频数据，技术优化了网络数据，数据尺寸也还是很大，所以要对数据在发送端编码，然后在接收端解码。WebRTC内置的几种编解码器包括：H.264,Opcus,iSAC,VP8。作为前端开发的我，最这些编解码技术当然不是很了解。幸运的是，当两个浏览器回话时，会综合两端情况选择最优的编解码器。

- 传输层

    主要处理数据丢包，数据包排序以及建立用户之间的连接问题

- 会话管理

    通常来说就是信令（Signaling），负责在浏览器中建立并管理多个连接。

#### 4.获取用户媒体
创建一个基于WebRTC的通信平台，首先要通过用户的网络摄像头和麦克风获取实时的视频和音频流，可以通过调用浏览器的getUserMedia API来实现。
~~~html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>获取媒体流</title>
</head>
<body>
<div id="app">
  <h1>获取媒体流</h1>
  <video autoplay></video>
</div>
<script>
  function hasUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
  }

  if (hasUserMedia()) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    navigator.getUserMedia({video: true, audio: false}, function (stream) {
      console.log(stream);
      var video = document.querySelector('video');
      video.src=window.URL.createObjectURL(stream);
    }, function (err) {
      console.log(err);
    });
  } else {
    alert("Sorry, your browser does not support getUserMedia.");
  }
</script>
</body>
</html>
~~~
![webRTC4.png](https://i.loli.net/2019/10/20/yfltDkYZ81xg3uH.png)

是否打开使用摄像头权限

![webRTC5.png](https://i.loli.net/2019/10/20/VEmhG5YNkbFU3IH.png)

_注意：打开摄像头后获取到的视频流展示在Video标签中，video标签需要加上autoplay属性视频才可以播放，在调试中可以把getUserMedia方法参数中的audio设置为：false，避免杂音太大，同理，把video设置为false只能听到自己说话而没有画面，可以代替普通电话使用。_
#### 5.限制视频流
我们可以通过设置参数来控制视频和音频是否使用，除此之外，我们可以传入一个对象做更复杂的限制，如分辨率，视频宽高比等等。

~~~javascript
navigator.getUserMedia({video: {
        width: 320,
        /*height:240,*/
        aspectRatio:1.77
      }, audio: false}, function (stream) {
      console.log(stream);
      var video = document.querySelector('video');
      video.src=window.URL.createObjectURL(stream);
    }, function (err) {
      console.log(err);
    });
~~~
![webRTC6.png](https://i.loli.net/2019/10/20/OwFIAEMzVqG7dsr.png)
可以根据自己业务需求来设置固定的宽高或分辨率等等。
#### 6.完成一个拍照室Demo
通过调用摄像头获取到的视频流以及H5的canvas标签我们可以完成一个简易的拍照功能。

增加一个拍照按钮以及一个canvas,修改后的整个页面代码如下：
~~~html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>获取媒体流</title>
</head>
<body>
<div id="app">
  <h1>获取媒体流</h1>
  <video id="video" autoplay></video>
  <button type="button" onclick="capture()">点击拍照</button>
  <canvas id="canvas" width="320" height="240"></canvas>
</div>
<script>
  function hasUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
  }

  if (hasUserMedia()) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    navigator.getUserMedia({video: {
        width: 320,
        height:240,
      }, audio: false}, function (stream) {
      console.log(stream);
      var video = document.querySelector('video');
      video.src=window.URL.createObjectURL(stream);
    }, function (err) {
      console.log(err);
    });
  } else {
    alert("Sorry, your browser does not support getUserMedia.");
  }

  function capture(){
    console.log('capture...');
    var cxt=document.getElementById('canvas').getContext('2d');
    var video=document.getElementById('video');
    cxt.drawImage(video,0,0);
  }
</script>
</body>
</html>
~~~
![webRTC7.png](https://i.loli.net/2019/10/20/uYdzGLW3DRhXVBZ.png)
现在单击一个点击拍照按钮，可以捕捉视频的某一帧并同时绘制到canvas上，加上canvas功能本来就很强大，后期对照片的旋转，剪裁，滤镜也都是可以实现的。

延伸：现在很多WebApp上要实时上传证件功能，我们通过这种WebRTC+canvas也是可以实现的，而且是浏览器直接调的硬件拍照，有没有很溜。
#### 7.开发中遇到的问题
在直接用http打开本地服务器页面是调用不了摄像头的，浏览器的限制认为http下是不安全的，但是可以用127.0.0.1或者localhost来代替本机ip。网页部署到服务器时也得使用https协议来返回页面，否则，无法调用摄像头。

![webRTC8.png](https://i.loli.net/2019/10/20/oB8LYHOfFqebG5m.png)

###### 以上简单的介绍了WebRTC的发展历史以及一些基本概念，让大家对其有个初步的了解，最后通过调用摄像头完成一个拍照室的Demo。后续文章再详细的写如何通过WebRTC来实现点对点通信，相信WebRTC功能会越来越强大，这只是第一步。
参考资料：
《Learning WebRTC 中文版》　
[《WebRTC-JavaScript 标准参考教程（alpha） 阮一峰》](http://javascript.ruanyifeng.com/htmlapi/webrtc.html#toc3)
[WebRTC百科](https://baike.baidu.com/item/WebRTC/5522744?fr=aladdin)
_转载请注明出处，谢谢。_
