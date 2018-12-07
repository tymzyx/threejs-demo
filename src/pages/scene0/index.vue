<template>
  <div ref="canvasCont"/>
</template>

<script>
  import * as THREE from 'three';
  import bindEvent from '@/utils/eventBinder.js';

  const TWEEN = require('../../utils/tween.js');

  export default {
    data() {
      return {}
    },

    mounted() {
      this.init();
    },

    methods: {
      init() {
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

        let textureLoader = new THREE.TextureLoader();

        let canvasCont = this.$refs.canvasCont;

        let backSrc = require(`../../assets/images/ct-test.jpg`);
        let arrowSrc = require(`../../assets/images/arrow.png`);
        let tvSnowSrc1 = require(`../../assets/images/tv-snow1.png`);
        let tvSnowSrc2 = require(`../../assets/images/tv-snow2.png`);
        let clockSrc1 = require(`../../assets/images/clock1.png`);
        let clockSrc2 = require(`../../assets/images/clock2.png`);

        //初始化场景
        function initScene() {

          camera = new THREE.PerspectiveCamera(cameraFov, window.innerWidth / window.innerHeight, 0.1, 100000);
          scene = new THREE.Scene();
          renderer = new THREE.WebGLRenderer();
          //let control = new THREE.OrbitControls(camera);
          renderer.antialias = true;
          renderer.setSize(window.innerWidth, window.innerHeight);
          renderer.setPixelRatio(window.devicePixelRatio);
          renderer.setClearColor(0xc9c557);
          canvasCont.appendChild(renderer.domElement);

          group = new THREE.Group();
          scene.add(group);

          camera.position.z = cameraDistance;
          camera.lookAt(scene.position);
          scene.add(camera);

          cy = createCylinder();
          createLights(cy);
          scene.add(cy);

          createHelper();

          function createHelper() {
            let axes = new THREE.AxesHelper(100);
            scene.add(axes);
          }

          function createLights(target) {
            let am = new THREE.AmbientLight(0xffffff);
            scene.add(am);
            let directionL = new THREE.DirectionalLight(0xffffff);
            directionL.target = target;
            // scene.add(directionL);
          }


          //  var control = new THREE.OrbitControls(camera)

          //创建场景
          function createCylinder() {

            /*      let top = new THREE.MeshLambertMaterial({
             map: new THREE.TextureLoader().load('t.jpg')
             });
             top.side = THREE.BackSide;

             let bottom = new THREE.MeshLambertMaterial({
             map: new THREE.TextureLoader().load('b.jpg')
             });
             bottom.side = THREE.BackSide;*/

            let cyM = new THREE.MeshLambertMaterial({
              map: new THREE.TextureLoader().load(backSrc)
            });
            cyM.side = THREE.DoubleSide;
            //cyM.magFilter = THREE.LinearMipMapLinearFilter;

            let ms = new THREE.MeshFaceMaterial([cyM, undefined/*bottom*/, undefined /*top*/]);
            ms.side = THREE.FrontSide;

            let cy = new THREE.CylinderBufferGeometry(cylinderR, cylinderR, cylinderH, 200, 200);//1273
            //console.log("cy", cy);
            return new THREE.Mesh(cy, ms);
          }

          initKeyFrames();
          let keyFramer = refreshKeyFrames(50, 1000);

          function rend() {
            renderer.render(scene, camera);
            requestAnimationFrame(rend);
            keyFramer(Date.now());
            TWEEN.update();
          }

          addPlanes();

          /*  hide(document.getElementsByTagName("canvas")[0]);
           setCameraIn();*/

          into3DScene();
          setMoveCameraEvent();
          rend();
        }

        //显示元素
        function show(ele) {
          ele.style.display = "block";
        }

        function hide(ele) {
          ele.style.display = "none";
        }

        //createMesh
        function createPlane(l, r, planeR, { posY, width, height, s, v, texture, opacity }) {
          l *= scaleRatio;
          posY *= scaleRatio;
          width *= scaleRatio;
          height *= scaleRatio;

          //console.log(l, r, posY, width, height, s, v, texture);
          let pg = new THREE.PlaneBufferGeometry(width, height, s, v);
          let pm = new THREE.MeshLambertMaterial({
            //color: 0xff0000,
            transparent: true,
            opacity: opacity || 0,
            side: THREE.DoubleSide,
            // alphaTest: 0.5,
            // blending: THREE.NormalBlending
          });

          if (texture) {
            pm.map = texture;
          }
          let pMesh = new THREE.Mesh(pg, pm);
          pMesh.position.set(Math.sin(l / r) * planeR, posY, -Math.cos(l / r) * planeR);
          pMesh.lookAt(new THREE.Vector3(0, posY, 0)); //设置平面朝向
          return pMesh;
        }

        let clock1, clock2, tv1, tv2;
        let clockPlane, tvPlane;

        function initKeyFrames() {

          let tvData = {
            l: 139,
            posY: 152,
            width: 354,
            height: 288,
            url1: tvSnowSrc1,
            url2: tvSnowSrc2
          };
          let clockData = {
            l: 2850,
            posY: 578,
            width: 158,
            height: 158,
            url1: clockSrc1,
            url2: clockSrc2
          };

          tv1 = textureLoader.load(tvData.url1);
          tv2 = textureLoader.load(tvData.url2);
          clock1 = textureLoader.load(clockData.url1);
          clock2 = textureLoader.load(clockData.url2);

          scene.add(tvPlane = createPlane(tvData.l, cylinderR, planeR, {
            posY: tvData.posY,
            width: tvData.width,
            height: tvData.height,
            s: 2,
            v: 2,
            texture: tv1,
            opacity: 1,
          }));

          scene.add(clockPlane = createPlane(clockData.l, cylinderR, planeR, {
            posY: clockData.posY,
            width: clockData.width,
            height: clockData.height,
            s: 2,
            v: 2,
            texture: clock1,
            opacity: 1,
          }));
        }


        function refreshKeyFrames(tvTimeGap, clockTimeGap) {
          let tvIndex = 0;
          let clockIndex = 0;
          let tvArr = [tv1, tv2];
          let clockArr = [clock1, clock2];
          let tvStart = Date.now();
          let clockStart = Date.now();
          return function (time) {
            let tvTimePass = time - tvStart;
            if (tvTimePass >= clockTimeGap) { //到达执行动画间隔
              clockPlane.material.map = clockArr[tvIndex];
              clockPlane.material.needsUpdate = true;
              tvStart = time;
              if (++tvIndex === 2) {
                tvIndex = 0;
              }
            }
            let clockTimePass = time - clockStart;
            if (clockTimePass >= tvTimeGap) {

              tvPlane.material.map = tvArr[clockIndex];
              tvPlane.material.needsUpdate = true;
              if (++clockIndex === 2) {
                clockIndex = 0;
              }
              clockStart = time;
            }
          }

        }


        //添加可点击部分
        function addPlanes() {


          let arrowPicWidth = 110, arrowPicHeight = 146;
          let arrowTexture = textureLoader.load(arrowSrc);

          let dataArr = [
            //电视中点分界 left 8
            { l: -507, posY: -325, width: 280, height: 180, texture: null }, //捕获点击的平面
            { l: -507, posY: -325, texture: arrowTexture }, //动态指示箭头
            //2
            { l: -1189, posY: -408, width: 278, height: 161, texture: null },
            { l: -1189, posY: -408, texture: arrowTexture },
            //3
            { l: -1661, posY: 421, width: 196, height: 108, texture: null },
            { l: -1661, posY: 421, texture: arrowTexture },//textureLoader.load(arrowSrc)
            //4
            { l: -3242, posY: -108, width: 180, height: 180, texture: null },
            { l: -3242, posY: -108, texture: arrowTexture },

            //right 12
            { l: 201, posY: -318, width: 194, height: 194, texture: null },
            { l: 201, posY: -318, texture: arrowTexture },

            //2
            { l: 261, posY: -584, width: 226, height: 144, texture: null },
            { l: 261, posY: -584, texture: arrowTexture },
            //3
            { l: 1245, posY: -318, width: 300, height: 150, texture: null },
            { l: 1245, posY: -318, texture: arrowTexture },

            //4
            { l: 2598, posY: -210, width: 376, height: 274, texture: null },
            { l: 2598, posY: -210, texture: arrowTexture },

            //5
            { l: 2962, posY: -634, width: 392, height: 175, texture: null },
            { l: 2962, posY: -634, texture: arrowTexture },

            //6
            { l: 3116, posY: 167, width: 332, height: 421, texture: null },
            { l: 3116, posY: 167, texture: arrowTexture },

          ];
          let meshArr = [];
          let arrowArr = [];
          dataArr.forEach((e, index) => {
              if (index % 2 === 0) {
                let planeMesh = createPlane(e.l, cylinderR, planeR, {
                  posY: e.posY,
                  width: e.width,
                  height: e.height,
                  s: 2,
                  v: 2,
                  texture: e.texture
                });
                planeMesh.listIndex = index / 2;
                meshArr.push(planeMesh);
                scene.add(planeMesh);
              }
              else {
                let arrowMesh = createPlane(e.l, cylinderR, arrowR, {
                  posY: e.posY,
                  width: arrowPicWidth,
                  height: arrowPicHeight,
                  s: 2,
                  v: 2,
                  texture: e.texture
                });
                arrowArr.push(arrowMesh);
                scene.add(arrowMesh)
              }
            }
          );

          createClicker(meshArr);
          setOpacityAnimation(arrowArr, 1000);
        }

        //创建可点击面
        function createClicker(meshArr) {
          meshArr.forEach((e) => {
            bindEvent({
                element: document.getElementsByTagName("canvas")[0],
                scene, camera, mesh: e, type: "click", callback: function (mesh) {
                  mesh.material.transparent = true;
                  //mesh.material.opacity = 0.5;
                  //alert(mesh.name);
                  typeof mesh.listIndex === 'number' && ListV.dealSelectObject(mesh.listIndex);
                }
              }
            );
          });
        }

        //设置可点击面显示隐藏动画
        function setOpacityAnimation(meshArr, time = 2000) {

          let opacityObj = { opacity: 0 };
          let tween = new TWEEN.Tween(opacityObj).to({ opacity: 0 }, time / 2);
          tween.easing(TWEEN.Easing.Sinusoidal.InOut);
          tween.onUpdate(function () {
            meshArr.forEach((e) => {
              e.material.opacity = this.opacity;
            })
          });
          tween.onComplete(function () {

          });
          tween.start();

          let tween1 = new TWEEN.Tween(opacityObj).to({ opacity: 1 }, time / 2);
          tween1.easing(TWEEN.Easing.Sinusoidal.InOut);
          tween1.onUpdate(function () {
            meshArr.forEach((e) => {
              e.material.opacity = this.opacity;
            })
          });
          tween1.onComplete(function () {

          });
          tween.chain(tween1);
          tween1.chain(tween);
        }

        //进入场景
        function into3DScene() {
          camera.position.set(0, 0, -cameraDistance);
          camera.lookAt(0, 0, initLookAtZ);
          camera.rotation.z = Math.PI / 2;

        }

        //设置相机旋转视角 y=3000 z=0  到 y=0 z=cameraDistance;
        function cameraIntoScene(callback) {
          let tween1 = new TWEEN.Tween({ y: 3000, z: 0 }).to({ y: 0, z: -cameraDistance }, 2000);
          tween1.easing(TWEEN.Easing.Sinusoidal.InOut);
          tween1.onUpdate(function () {
            camera.position.set(0, this.y, this.z);
            camera.lookAt(0, 0, initLookAtZ);
          });
          tween1.onComplete(function () {
            callback && callback();
          });
          tween1.start();
        }

        //cameraIn
        function setCameraIn() {
          camera.position.y = startPosY;
          camera.lookAt(scene.position);
          show(document.getElementsByTagName("canvas")[0]);
          setTimeout(function () {
            //cameraIntoScene(setMoveCameraEvent); //调整视角后绑定事件
          }, 1000);
        }

        //设置陀螺仪旋转
        function setMoveCameraEvent() {
          //三种情况 touch旋转  陀螺仪旋转连接touch旋转   touch旋转连接陀螺仪旋转
          let cameraInitAngle = Math.PI / 2; //相机的初角度，位于xy平面,相对xy平面水平方向90度角
          let xAngleInit,
            yAngleInit,
            zAngleInit;

          let touchEnd = true, rsetYInit = false;

          //设备旋转时移动相机
          let yRotate, xRotate, zRotate;
          let touchStartAngle, touchEndAngle;
          let orientationStartAngle = touchStartAngle = touchEndAngle = cameraInitAngle;

          let startX, endX, moveLength, moveAngle = 0;
          let startY;
          let alphaAngle, transposePhone = false;

          function parseToRad(angle) {
            return angle * Math.PI / 180;
          }


          let lastYRotate = 0;
          let timeGap = 0;
          let OrStartTime, OrEndTime = Date.now();
          let lastAlpha;
          let tranOrStartAngle = false;
          window.addEventListener("deviceorientation", function (e) {

            function getPhoneTransposeAngle(angle) {
              return (180 + angle) % 360
            }

            camera.rotation.z = Math.PI / 2; //设置相机的旋转
            if (typeof yAngleInit === "undefined") {
              yAngleInit = e.alpha;
              //xAngleInit = e.beta;
              //zAngleInit = e.gamma;
            }
            //touch状态则返回
            if (!touchEnd) {
              return;
            }
            //重新初始旋转初始值
            if (rsetYInit) {
              yAngleInit = transposePhone ? getPhoneTransposeAngle(e.alpha) : e.alpha;
              rsetYInit = false;
            }

            // div.innerHTML = "beta:-->" + e.beta + " " + "<br/>e.alpha:-->" + e.alpha + "<br/>e.gamma:-->" + e.gamma;
            OrStartTime = Date.now();
            let angleGap = Math.abs(e.alpha - lastAlpha);
            //防止手机横屏前后翻转时角度突变
            // div.innerHTML = e.alpha;
            if (angleGap > 20 && (angleGap < 350) && OrStartTime - OrEndTime > 300) {
              transposePhone = !transposePhone;
              OrEndTime = Date.now();
              return;
            }

            //跳动状态 转动角和起始角
            alphaAngle = transposePhone ? getPhoneTransposeAngle(e.alpha) : e.alpha;
            /*      if (Math.abs(yRotate - lastYRotate) > 1 && OrStartTime - OrEndTime < 50) {
             // OrEndTime = Date.now();
             // return;
             alphaAngle = 360 - e.alpha;
             div.innerHTML = e.alpha;
             }*/


            touchStartAngle = yRotate = parseToRad(alphaAngle - yAngleInit) + orientationStartAngle;
            //camera.rotation.set(0, yRotate, 0);
            camera.position.z = -cameraDistance * Math.sin(yRotate);
            camera.position.x = cameraDistance * Math.cos(yRotate);
            //camera.lookAt(scene.position);


            /*    if (Math.abs(yRotate - lastYRotate) > 1 && OrStartTime - OrEndTime < 50) {
             // OrEndTime = Date.now();
             // return;

             div.innerHTML = e.alpha;
             }
             */

            camera.rotation.set(0, yRotate, Math.PI / 2);
            lastAlpha = e.alpha;

            //div.innerHTML = "cameraZ:-->" + camera.rotation.z + "<br/>e.alpha:-->" + e.alpha + "<br/>yRotate-->" + yRotate;
            // div.innerHTML += "<br/>z:-->" + camera.position.z + "<br/>x:-->" + camera.position.x;
          }, false);

          //控制滑屏旋转
          //let angleLength = window.innerWidth * 3;
          let angleLength = window.innerHeight * 3;
          canvasCont.getElementsByTagName("canvas")[0].addEventListener("touchstart", function (e) {

            // console.log(" console.log(touchStartAngle)--->>>>", touchStartAngle);
            touchEnd = false;
            //startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;

            //触屏旋转
            if (yRotate === cameraInitAngle) { //如果不支持旋转陀螺仪 e.alpha 一直等于0
              touchStartAngle = touchEndAngle;
            }
            //脱落仪旋转和触屏旋转的连连接 初始化touchEndAngle
            touchEndAngle = touchStartAngle;

            e.preventDefault();
          });
          //设置camera相机的圆环位置 同时lookAt 场景原点
          canvasCont.getElementsByTagName("canvas")[0].addEventListener("touchmove", function (e) {

            //endX = e.changedTouches[0].clientX; //竖屏显示
            //moveLength = endX - startX;
            moveLength = e.changedTouches[0].clientY - startY;

            touchEndAngle = orientationStartAngle = moveAngle = ((moveLength / angleLength) * 360) * Math.PI / 180 + touchStartAngle;
            //camera.rotation.y = moveAngle;
            camera.position.z = -cameraDistance * Math.sin(moveAngle);
            camera.position.x = cameraDistance * Math.cos(moveAngle);

            camera.rotation.set(0, moveAngle, Math.PI / 2);
            // camera.lookAt(scene.position); //camera rotation角度自行改变
            // console.log("camera.position", camera.position);
            //div.innerHTML = `touch orientationStartAngle-->${moveAngle}<br/>turn yRotate${yRotate}`
            e.preventDefault(); //阻止苹果页面滑动默认事件
            // e.returnValue = false;
          });
          canvasCont.getElementsByTagName("canvas")[0].addEventListener("touchend", function (e) {
            touchEnd = true;
            rsetYInit = true;
            touchStartAngle = touchEndAngle; //触屏旋转的情况 初始化开始旋转的角度
            orientationStartAngle = touchEndAngle;
          });

          //  andriod 页面滑动默认事假
          /*  window.ontouchmove = function (e) {
           e.preventDefault();
           };*/

        }

        //设置横屏显示效果
        function setHShow() {
          camera.rotation.z = Math.PI / 2;
        }

        initScene();
      }
    }
  }
</script>

<style lang="less" scoped>
  .canvas-box {
    width: 100vw;
    height: 600px;
  }
</style>
