import * as THREE from 'three';

window.bindEvent = function ({scene, camera, mesh, type,callback,element=window}) {

  let mouse = new THREE.Vector2();  //Êó±êÆÁÄ»ÏòÁ¿
  let raycaster = new THREE.Raycaster();  //Ö¸ÏòÀØÉä
  function dealEvent(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    let x, y;
    if (event.type === "touchend") {
      x = event.changedTouches[0].clientX;
      y = event.changedTouches[0].clientY;
    } else {
      x = event.clientX;
      y = event.clientY;
    }

    mouse.x = ( x / window.innerWidth ) * 2 - 1;
    mouse.y = -( y / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    /*½»»ãµã¶ÔÏñ*/

    // div.innerHTML = mouse.x + "y:-->" + mouse.y;
    let intersects = raycaster.intersectObjects([mesh]);

    //console.log("intersects.length:--->>>",intersects.length);
    if (intersects.length > 0) {
      callback && callback(mesh);
    }
  }

  switch (type) {
    case "click":
      //  window.addEventListener("click", dealEvent, false);
      element.addEventListener("touchend", dealEvent, false);
      break;
    case "mousemove":
      element.addEventListener("mousemove", dealEvent, false);
      break;
  }
}

export default bindEvent;
