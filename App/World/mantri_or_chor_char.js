import * as THREE from "three";
import assetStore from "../Utils/AssetStore.js";

import App from "../App.js";
export default class mantri_or_chor {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.physics = this.app.world.physics;
    this.assetStore = assetStore.getState()
    this.avatar = this.assetStore.loadedAssets.mantri_or_chor
    console.log(this.avatar)

    this.instantiateCharacter();
  }

  instantiateCharacter() {
    // create character and add to scene
    const geometry = new THREE.BoxGeometry(0.5, 5, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      wireframe: true,
      visible: false,
    });
    this.instance = new THREE.Mesh(geometry, material);
    this.instance.position.set(-2, 0, -1.4);
    this.instance.rotation.y=(Math.PI)/2
    this.scene.add(this.instance);

    // add avatar to character
    const avatar = this.avatar.scene
    avatar.position.y = -2.5
    avatar.scale.setScalar(1.3)
    this.instance.add(avatar)

  }
}