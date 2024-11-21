import assetStore from '../Utils/AssetStore.js'
import { appStateStore } from '../Utils/Store.js'
import { ready } from '../Utils/Store.js'
import * as THREE from 'three';

export default class Preloader {
    constructor() {
        
        this.assetStore = assetStore
        
       
        this.overlay = document.querySelector('.overlay')
        this.loading = document.querySelector('.loading')
        this.startButton = document.querySelector('.start')
        this.loader = document.querySelector('.loader')

        this.assetStore.subscribe((state) =>{

            this.numberOfLoadedAssets = Object.keys(state.loadedAssets).length
            this.numberOfAssetsToLoad = state.assetsToLoad.length
            this.progress = this.numberOfLoadedAssets / this.numberOfAssetsToLoad
            this.progress = Math.trunc(this.progress * 100)
            document.getElementById('progressPercentage').innerHTML= this.progress

            if (this.progress === 100)
            {   
                appStateStore.setState({assetsReady: true})
                this.loading.classList.add('fade')
                this.loader.classList.add('fade')
                window.setTimeout(() => this.ready(), 1200)
                
                
                
            }
        })
        
    }

    ready() {
        let backgroundMusic;

        let listener = new THREE.AudioListener();
        this.loading.remove()

        this.startButton.style.display = 'inline'
        this.startButton.classList.add('fadeIn')

        this.startButton.addEventListener('click', () => {
            this.overlay.classList.add('fade')
            this.startButton.classList.add('fadeOut')

            window.setTimeout(() => {
                this.overlay.remove()
                this.startButton.remove()
            }, 2000)
            if (!backgroundMusic) {
                backgroundMusic = new THREE.Audio(listener);
                const audioLoader = new THREE.AudioLoader();
                audioLoader.load('/audios/bgm.mp3', function (buffer) {
                  backgroundMusic.setBuffer(buffer);
                  backgroundMusic.setLoop(true); // Keep the music looping
                  backgroundMusic.setVolume(0.5); // Set volume to a reasonable level
                  backgroundMusic.play(); // Start playing the music
                });
              }

            ready.setState({ready: true})
        },{once: true})
    }
}