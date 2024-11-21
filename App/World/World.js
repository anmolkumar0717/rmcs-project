import { killer } from "../Utils/Store.js";
import App from "../App.js";
import Physics from "./Physics.js";
import Environment from "./Environment.js";
import Character from "./Character.js";
import CharacterController from "./CharacterController.js";
import AnimationController from "./AnimationController.js";
import { appStateStore } from "../Utils/Store.js";
import Other_char from "./other_char.js";
import other_char_controler from "./other_char_controler.js"
import mantri_or_chor from "./mantri_or_chor_char.js";
import mantri_or_chor_Controller from "./mantri_or_chor_controller.js";
import chor_or_mantri_Controller from "./chor_or_mantri_controller.js";
import chor_or_mantri from "./chor_or_mantri.js"; 
import extra_char from "./extra_char.js";
import extra_char_controller from "./extra_char_controller.js";
import { ready } from "../Utils/Store.js";
import name_input from "../UI/name_input.js";

export default class World {
  constructor() {
    this.ready1 = false
    this.button_go = document.querySelector('.cool-button1')
    this.app = new App();
    this.scene = this.app.scene;
    

    
    this.physics = new Physics();
    

    // create world classes
    const unsub = appStateStore.subscribe((state) => {
      if (state.physicsReady && state.assetsReady) {
        
        this.character = new Character();
        this.Other_char = new Other_char();
        this.mantri_or_chor = new mantri_or_chor();
        this.chor_or_mantri = new chor_or_mantri();
        this.extra_char = new extra_char();

        this.characterController = new CharacterController();
        
        this.environment = new Environment();
        ready.subscribe((state)=>{
          this.name_input = new name_input()
          
        })
        this.other_char_controler = new other_char_controler();
        this.mantri_or_chor_Controller = new mantri_or_chor_Controller();
        this.chor_or_mantri_Controller = new chor_or_mantri_Controller()
        this.animationController = new AnimationController();
        this.extra_char_controller = new extra_char_controller();
        

        unsub();
      }
    });

    this.button_go.addEventListener('click',()=>{
      this.ready1 = true

      this.div = document.querySelector('.container1')
      this.div.classList.add('fadeIn')

    })
    


    this.loop()


    
  }

  loop(deltaTime, elapsedTime) {
    this.physics.loop();
    killer.subscribe((state)=>{
      this.killer = state.killer
    })
    if (this.ready1){
      
      if(this.other_char_controler) this.other_char_controler.loop();
      if(this.characterController) {this.characterController.loop();}
      if(this.mantri_or_chor_Controller)this.mantri_or_chor_Controller.loop();
      if(this.chor_or_mantri_Controller) this.chor_or_mantri_Controller.loop()
      if(this.animationController) this.animationController.loop(deltaTime);
      if(this.extra_char_controller && this.killer){this.extra_char_controller.loop()}
    }
  }
}
