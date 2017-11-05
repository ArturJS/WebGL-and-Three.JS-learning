import React, {Component} from 'react';
import * as THREE from 'three';
import Rx from 'rxjs/Rx';
import Hammer from 'hammerjs';
import RxCSS from 'rxcss';

import './RotatingCube.scss';


export default class RotatingCube extends Component {
  componentDidMount() {
    this.initScene();

    handleDrag(this.canvasRef).subscribe(([dx, dy]) => {
      this.updateScene({dx, dy});
    });

    handleZoom(this.canvasRef).subscribe((dZoom) => {
      this.updateScene({dZoom});
    });
  }

  setCanvasRef = (node) => {
    this.canvasRef = node;
  };

  initScene = () => {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({canvas: this.canvasRef, antialias: true});
    const light = new THREE.AmbientLight(0xffffff);
    const {width, height} = this.canvasRef;

    this.renderer.setSize(width, height);
    this.scene.add(light);

    this.camera = new THREE.PerspectiveCamera(
      70,
      width / height,
      0.01,
      10
    );

    this.camera.position.z = 1;
    this.scene.add(this.camera);

    this.box = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.3, 0.3),
      new THREE.MeshNormalMaterial()
    );

    this.box.name = 'box';
    this.scene.add(this.box);

    this.updateScene();
  };

  updateScene = ({dx = 0, dy = 0, dZoom = 0} = {}) => {
    this.box.rotation.x += dy;
    this.box.rotation.y += dx;
    const scale = this.box.scale.x + dZoom / 5;

    if (scale < 3 && scale > 0.5) {
      this.box.scale.x = this.box.scale.y = this.box.scale.z = scale;
    }
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return (
      <canvas
        className="rotating-cube"
        width="500"
        height="400"
        ref={this.setCanvasRef}/>
    );
  }
}

function handleDrag(domNode) {
  const hammerPan = new Hammer(domNode, {
    direction: Hammer.DIRECTION_ALL
  });

  hammerPan.get('pan').set({direction: Hammer.DIRECTION_ALL});

  const pan$ = Rx.Observable.fromEventPattern(h =>
    hammerPan.on('panstart panup pandown panmove panend', h)
  );

  const drag$ = drag(domNode, pan$);

  return drag$
    .scan(RxCSS.lerp(0.1))
    .map(p => [p.x, p.y]);
}


function drag(domNode, pan$) {
  return pan$.filter(e => e.type === 'panstart').switchMap(() => {
    const move$ = pan$
      .filter(e => e.type === 'panmove')
      .map(pm => {
        pm.preventDefault();
        return {
          x: pm.velocityX,
          y: pm.velocityY
        };
      })
      .takeUntil(pan$.filter(e => e.type === 'panend'));

    return move$;
  });
}

function handleZoom(domNode) {
  const wheel$ = Rx.Observable.fromEvent(domNode, 'wheel')
    .map((event) => {
      event.preventDefault();
      return -Math.sign(event.deltaY);
    });

  const hammerPinch = new Hammer(domNode, {
    direction: Hammer.DIRECTION_ALL
  });

  hammerPinch.get('pinch').set({
    direction: Hammer.DIRECTION_ALL,
    enable: true,
    threshold: 0,
    pointers: 0
  });

  let prevScale = 1;

  const pinch$ = Rx.Observable.fromEventPattern(h => {
    hammerPinch.on('pinch', h);
  })
    .map(e => {
      e.preventDefault();
      const dZoom = prevScale < e.scale ? 0.3 : -0.3;

      prevScale = e.scale;
      return dZoom;
    });

  return Rx.Observable.merge(wheel$, pinch$);
}
