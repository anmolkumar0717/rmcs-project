import * as THREE from "three";
import assetStore from "../Utils/AssetStore.js";
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

import App from "../App.js";

export default class Environment {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.physics = this.app.world.physics;
    this.assetStore = assetStore.getState()
    this.game_model = this.assetStore.loadedAssets.Raja_mantri_environment
    console.log(this.game_model.scene)

    this.loadEnvironment();
    this.loadModel()

  }

  loadEnvironment() {

    let x=-0.5193747282028198
    let  y = 2.3032186031341553
    let z= -8.901130676269531

    const width = 2;
    const height = 2;
    const intensity = 10;
    const rectLight = new THREE.RectAreaLight( 0x00fffe, intensity,  width+7, height+1 );
    rectLight.position.set( x, y+4, z+1 );
    rectLight.rotation.x = 80
    this.scene.add( rectLight )

    // const rectLightHelper11 = new RectAreaLightHelper( rectLight);
    // rectLight.add( rectLightHelper11 );

    x=-0.5193747282028198
    y = 2.3032186031341553
    z= -8.901130676269531

    const rectLight12 = new THREE.RectAreaLight( 0xFFCA00, intensity+10,  width, height-1 );
    rectLight12.position.set( x+0.1, y-0.2 , z-0.4 );
    rectLight12.rotation.x = 80
    this.scene.add( rectLight12 )

    // const rectLightHelper112 = new RectAreaLightHelper( rectLight12);
    // rectLight.add( rectLightHelper112 );



    x=-6.141053199768066
    y=1.9287455081939697
    z=-0.5653620958328247

    const rectLight1 = new THREE.RectAreaLight( 0xfffa36, intensity-2,  width, height+15 );
    rectLight1.position.set( x, y+1, z+5 );
    rectLight1.rotation.x = 80
    this.scene.add( rectLight1)
    // const rectLightHelper1 = new RectAreaLightHelper( rectLight1);
    // rectLight1.add( rectLightHelper1 );

    
    x=5.244718074798584
    y=1.9287455081939697
    z=-0.6055753231048584

    const rectLight2 = new THREE.RectAreaLight( 0xfffa36, intensity-2,  width, height+9 );
    rectLight2.position.set( x, y+1, z+5);
    rectLight2.rotation.x = 80
    this.scene.add(rectLight2)

    

    x=-19.461397171020508
    y=5.27796745300293
    z=-11.128677368164062

    const rectLight3 = new THREE.RectAreaLight( 0x00fffe, intensity,  width, height+9 );
    rectLight3.position.set( x+2, y, z );
    rectLight3.rotation.x = 80
    this.scene.add(rectLight3)
    // const rectLightHelper = new RectAreaLightHelper( rectLight3);
    // rectLight3.add( rectLightHelper );




    // this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    // this.directionalLight.position.set(10, 10, 10);
    // this.directionalLight.castShadow = true;
    // const dir = new THREE.DirectionalLightHelper( this.directionalLight);
    // dir.add( this.directionalLight );
    // this.scene.add(this.directionalLight);
    
    // this.game_model.scene.children[9].receiveShadow = true;
  }

  loadModel(){
    // console.log()
    this.game_model.scene.position.y-=3
    this.physics.add(this.game_model.scene.children[0],"fixed", "cuboid")
    this.physics.add(this.game_model.scene.children[10],"fixed", "cuboid")
    this.physics.add(this.game_model.scene.children[0].children[0],"fixed", "trimesh")
    // this.physics.add(this.game_model.scene.children[0].children[2],"fixed", "trimesh")
    this.physics.add(this.game_model.scene.children[5],"fixed", "cuboid")
    this.physics.add(this.game_model.scene.children[6],"fixed", "cuboid")
    this.physics.add(this.game_model.scene.children[5].children[1],"fixed", "cuboid")
    this.physics.add(this.game_model.scene.children[5].children[2],"fixed", "cuboid")
    this.physics.add(this.game_model.scene.children[6].children[2],"fixed", "cuboid")
    this.physics.add(this.game_model.scene.children[6].children[1],"fixed", "cuboid")
    this.physics.add(this.game_model.scene.children[5].children[10],"fixed", "cuboid")
    this.physics.add(this.game_model.scene.children[6].children[10],"fixed", "cuboid")
    this.physics.add(this.game_model.scene.children[0].children[4],"fixed", "cuboid")

    this.scene.add(this.game_model.scene)

  }

}