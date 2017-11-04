import React, {Component} from 'react';
import * as THREE from 'three';

import './RotatingCube.scss';

export default class RotatingCube extends Component {
  componentDidMount() {
    this.initScene();
  }

  componentWillUnmount() {
    this.destroyScene();
  }

  setCanvasRef = (node) => {
    this.canvasRef = node;
  };

  initScene = () => {
    this.scene = new THREE.Scene();
    this.renderer = window.WebGLRenderingContext
      ? new THREE.WebGLRenderer({canvas: this.canvasRef, antialias: true})
      : new THREE.CanvasRenderer({canvas: this.canvasRef, antialias: true});
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
      new THREE.MeshNormalMaterial({color: 0xFF0000})
    );

    this.box.name = 'box';
    this.scene.add(this.box);

    this.updateScene();
  };

  updateScene = () => {
    this.box.rotation.x += 0.01;
    this.box.rotation.y += 0.01;
    this.box.rotation.z += 0.01;
    this.renderer.render(this.scene, this.camera);
    this.frameId = requestAnimationFrame(this.updateScene);
  };

  destroyScene = () => {
    cancelAnimationFrame(this.frameId);
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
