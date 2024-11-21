import * as THREE from "three";
import App from "../App.js";
import { death1 } from "../Utils/Store.js";
import { playerinfo } from "../Utils/Store.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

export default class mantri_or_chor_Controller {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.physics = this.app.world.physics;
    this.character = this.app.world.mantri_or_chor.instance;
    this.avatar2 = this.app.world.mantri_or_chor.avatar;
    this.fontLoader = new FontLoader();

    playerinfo.subscribe((state)=>{

      console.log(state.Mantri)

      let text = state.Mantri;
      text = text.toUpperCase()

    
      this.fontLoader.load(
        
        "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
        (font) => {
          const textGeometry = new TextGeometry(text, {
            font: font,
            size: 0.5,            
            height: 0.02,         
            curveSegments: 12,    
            bevelEnabled: true,
            bevelThickness: 0.02, 
            bevelSize: 0.02,      
            bevelOffset: 0,
            bevelSegments: 1,      
          });
  
          const textMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,   
            roughness: 0.5,
            metalness: 0.1,
          });
          
          const textMesh = new THREE.Mesh(textGeometry, textMaterial);
         
          textMesh.position.set(-(text.length)/6, 0.07, 0)
          
           
          
          this.character.add(textMesh);
        }
      );
      death1.subscribe((state) => {
        this.hasDied = state.death1; // Update death state
      });
  })

    this.autoMovementSpeed = 0.02; 
    this.autoDirection = new THREE.Vector3(-1, 0, 0); 

    // Add clock and physics-related variables
    this.clock = new THREE.Clock();
    this.previousElapsedTime = 0;
    this.movement1 = 1;

    // Initialize physics-related components
    this.instantiateController();

    // Initialize animations
    this.instantiatedAnimations();
  }

  // Physics initialization similar to the CharacterController
  instantiateController() {
    this.rigidBodyType = this.physics.rapier.RigidBodyDesc.kinematicPositionBased();
    this.rigidBody = this.physics.world.createRigidBody(this.rigidBodyType);

    this.colliderType = this.physics.rapier.ColliderDesc.cuboid(1, 2.5, 1);
    this.collider = this.physics.world.createCollider(this.colliderType, this.rigidBody);

    const worldPosition = this.character.getWorldPosition(new THREE.Vector3());
    const worldRotation = this.character.getWorldQuaternion(new THREE.Quaternion());
    this.rigidBody.setTranslation(worldPosition);
    this.rigidBody.setRotation(worldRotation);

    this.characterController = this.physics.world.createCharacterController(0.1);
    this.characterController.setApplyImpulsesToDynamicBodies(false);
    this.characterController.enableAutostep(2, 0.1, false);
    this.characterController.enableSnapToGround(0);
  }

  instantiatedAnimations() {
    const idle = this.avatar2.animations;
    console.log(idle);
    this.mixer = new THREE.AnimationMixer(this.avatar2.scene);

    this.animations = new Map();
    this.avatar2.animations.forEach((clip) => {
      this.animations.set(clip.name, this.mixer.clipAction(clip));
    });

    // Set the initial animation to 'idle' and play it
    this.currentAction = this.animations.get('idle');
    this.currentAction.play();
  }

  playAnimation(name) {
    if (this.currentAction === this.animations.get(name)) return; // If already playing, do nothing
    this.action = this.animations.get(name);
    if (!this.action) {
      console.warn(`Animation ${name} not found!`);
      return;
    }

    // Reset and play the new action
    this.action.reset();
    this.action.play();
    this.action.crossFadeFrom(this.currentAction, 0.4); 

   
    if (name === 'sit') {
      this.action.setLoop(THREE.LoopOnce); 
      this.action.clampWhenFinished = true;
      this.mixer.addEventListener('finished', (e) => {
        if (e.action === this.action) {
          this.playAnimation('idle'); 
        }
      });
    } else {
      this.action.setLoop(THREE.LoopRepeat); 
    }

   
    this.currentAction = this.action;
  }

  loop() {
    if (this.hasDied && this.currentAnimationIndex !== 3) {
      // Trigger death animation once
      setTimeout(() => this.playAnimation("death"), 700);
      
      this.currentAnimationIndex = 3;
      this.hasDied = false;
      setTimeout(() => this.scene.remove(this.character), 2500);
      
       // Reset death state after triggering
    }
    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = elapsedTime - this.previousElapsedTime;
    this.previousElapsedTime = elapsedTime;

    
    this.currentAnimationIndex = this.currentAnimationIndex || 0;
    this.character.position.x

    
    if (this.character.position.x >= -6.4 && this.currentAnimationIndex === 0) {
      
      const movement = this.autoDirection.clone().normalize().multiplyScalar(this.autoMovementSpeed);
      this.character.position.add(movement);
      this.playAnimation('walk');

      
      const targetRotation = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0,1),
        this.autoDirection.clone().normalize()
      );
      this.character.quaternion.slerp(targetRotation, 0.2);
      const movement1 = new THREE.Vector3().copy(this.autoDirection).multiplyScalar(this.autoMovementSpeed);
      movement1.y = -1;
  
      this.characterController.computeColliderMovement(this.collider, movement1);
      const newPosition = new THREE.Vector3()
        .copy(this.rigidBody.translation())
        .add(this.characterController.computedMovement());
  
      this.rigidBody.setNextKinematicTranslation(newPosition);
      this.character.position.lerp(this.rigidBody.translation(), 0.03);
      console.log(this.character.position.x)

      
      if (this.character.position.x === -6.402011929974366) {
        this.currentAnimationIndex = 1; 
      }

    } else if (this.currentAnimationIndex === 1) {
      this.character.rotation.y = Math.PI/2;
      this.playAnimation('stand_sit');

      
      this.movement1 = -1.1 + this.movement1;
      console.log(this.movement1)
      
      // -62.800000000000054
      if (this.movement1 === -50.70000000000004) {
        this.currentAnimationIndex = 2; // Move to the idle animation
      }

    } else if (this.currentAnimationIndex === 2) {
      this.playAnimation('sit_idle');
    }
   
    this.mixer.update(deltaTime);
  }
}
