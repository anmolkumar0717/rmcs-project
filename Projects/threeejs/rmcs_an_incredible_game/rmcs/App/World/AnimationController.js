import * as THREE from 'three';

import App from '../App';
import { inputStore } from '../Utils/Store';

export default class AnimationController {
    constructor() {
        this.app = new App();
        this.scene = this.app.scene;
        this.avatar = this.app.world.character.avatar;
        this.character = this.app.world.character;

        inputStore.subscribe((input) => this.onInput(input))

        this.instantiatedAnimations()
    }

    instantiatedAnimations() {
        const idle = this.avatar.animations
        // console.log(idle)
        this.mixer = new THREE.AnimationMixer(this.avatar.scene)


        this.animations = new Map()
        this.avatar.animations.forEach((clip) => {
            this.animations.set(clip.name, this.mixer.clipAction(clip))
        })

        this.currentAction = this.animations.get('idle')
        this.currentAction.play()
    }

    playAnimation(name) {
        if (this.currentAction === this.animations.get(name)) return
        const action = this.animations.get(name)
        action.reset()
        action.play()
        action.crossFadeFrom(this.currentAction, 0.4)

        this.currentAction = action
    }

    onInput(input) {
        if(
            input.forward ||
            input.backward ||
            input.left ||
            input.right
        ) {
            this.playAnimation('run')
        }
        else if(input.kill)
        {
            this.playAnimation('kick')
            console.log(this.character)

        }
        else {
            this.playAnimation('idle')

        }
    }

    loop(deltaTime) {
        this.mixer.update(deltaTime)
    } 

}