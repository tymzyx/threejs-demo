<template>
  <div />
</template>

<script>
  import * as THREE from 'three';

  export default {
    data() {
      return {}
    },

    methods: {
      init() {
        /*index.js  3d部分*/
        let cameraFov = 100; //相机视角
        let cameraDistance = 0;

        let initLookAtZ = 100; //进入场景时看的位置z,用于调节相机进入动画的视角变化曲率

        let useWidth = 2500;
        let originWidth = 8000;

        let cylinderR = useWidth / (2 * Math.PI); //圆柱体场景的半径
        let cylinderH = 668;// 625;          //圆柱体场景的高度
        let planeR = cylinderR - 10;  //平面放置的半径
        let arrowR = planeR - 10;     //箭头半径
        let scaleRatio = useWidth / originWidth; //图片缩放比例

        let camera;
        let scene;
        let renderer;
        let group;
        let cy;
        let startPosY = 4000;
        let div = createDiv();

        let textureLoader = new THREE.TextureLoader();

        let canvasCont = document.getElementById("canvasCont");

        let backSrc = require(`@/src/assets/images/ct-test.jpg`);
        let arrowSrc = require(`@/src/assets/images/arrow.png`);
        let tvSnowSrc1 = require(`@/src/assets/images/tv-snow1.png`);
        let tvSnowSrc2 = require(`@/src/assets/images/tv-snow2.png`);
        let clockSrc1 = require(`@/src/assets/images/clock1.png`);
        let clockSrc2 = require(`@/src/assets/images/clock2.png`);

      }
    }
  }
</script>

<style lang="less">

</style>
