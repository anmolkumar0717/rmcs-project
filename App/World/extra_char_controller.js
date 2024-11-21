import * as THREE from "three";
import App from "../App.js";
import { sipahi_position } from "../Utils/Store.js";

export default class extra_char_controller {
  constructor() {
    sipahi_position.subscribe((state)=>{
      this.position = state.sipahi_position
      // console.log(this.position)
    })

    this.app = new App();
    this.scene = this.app.scene;
    this.physics = this.app.world.physics;
    this.character = this.app.world.extra_char.instance;
    this.sipahi = this.app.world.character.instance;
    this.avatar2 = this.app.world.extra_char.avatar;

    this.autoMovementSpeed = 0.02; 
    this.autoDirection = new THREE.Vector3(-1, 0, 0.5);

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
    this.action.crossFadeFrom(this.currentAction, 0.7); 

   
    if (name === 'kill') {
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

    
    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = elapsedTime - this.previousElapsedTime;
    this.previousElapsedTime = elapsedTime;

    
    this.currentAnimationIndex = this.currentAnimationIndex || 0;
    
    if (this.character.position.x >= this.position+2 && this.currentAnimationIndex === 0) {
      
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
      

      
      if (this.character.position.x > this.position+1.9 && this.character.position.x <this.position+2.2) {
        setTimeout(() => this.playAnimation('kill'), 1500);
        setTimeout(() => this.scene.remove(this.sipahi), 3000);
        setTimeout(() => this.playAnimation('win'), 4000);
        
      }


    } else if (this.currentAnimationIndex === 1) {
      // this.character.rotation.y = Math.PI/2;
      this.playAnimation('kill');

      
      this.movement1 = -1.1 + this.movement1;
      console.log("Movement", this.movement1);

      if (this.movement1 === -55.100000000000044) {
        this.currentAnimationIndex = 2; // Move to the idle animation
      }

    } else if (this.currentAnimationIndex === 2) {
      this.playAnimation('idle');
    }
   
    this.mixer.update(deltaTime);
  }
}
