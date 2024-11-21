import * as THREE from 'three'
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { sizesStore } from './Utils/Store.js';


import App from './App.js'

export default class Camera{
    constructor() 
    {
        this.app = new App()
        this.canvas = this.app.canvas

        this.sizesStore = sizesStore
        this.sizes = this.sizesStore.getState()

        this.setInstance()
        this.setControls()
        this.setResizeLister()
    }

    setInstance() 
    {
        this.instance = new THREE.PerspectiveCamera(
            20,
            this.sizes.width / this.sizes.height,
            1,
            2000
          );
         
          this.instance.position.z = 55
          this.instance.position.y = 15
          this.instance.position.x = 25

    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas);
        this.controls.enableDamping = true;

    }

    setResizeLister() {
        this.sizesStore.subscribe((sizes)=>{
            this.instance.aspect = sizes.width / sizes.height
            this.instance.updateProjectionMatrix()
        })
    }

    loop() 
    {
        this.controls.update()
        this.characterController = this.app.world.characterController?.rigidBody
        if (this.characterController) {
            // Get character's position and rotation
            const characterPosition = this.characterController.translation();
            const characterRotation = this.characterController.rotation();
        
            // Define the offset to create a 45-degree angle with the Y-axis
            const distance = 55; // Distance from the character
            const angle = Math.PI / 7; // 45 degrees in radians
        
            // Calculate the camera's X, Y, Z offsets
            const cameraOffset = new THREE.Vector3(
                25,                    // X remains the same
                distance * Math.sin(angle), // Y component
                distance * Math.cos(angle)  // Z component
            );
        
            // Apply character's rotation to the offset and adjust for position
            cameraOffset.applyQuaternion(characterRotation).add(characterPosition);
        
            // Target should focus directly on the character's position
            const targetOffset = new THREE.Vector3(0, 0, 0).add(characterPosition);
        
            // Smoothly interpolate the camera's position and controls' target
            this.instance.position.lerp(cameraOffset, 0.1); // Camera moves to maintain the angle
            this.controls.target.lerp(targetOffset, 0.1);   // Keeps focus on the character
        }
        
    }
}