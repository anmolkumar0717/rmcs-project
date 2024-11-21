import * as THREE from "three";
import { killer } from "../Utils/Store.js";
import InputController from "../UI/InputController.js";
import App from "../App.js";
import { inputStore } from "../Utils/Store.js";
import { death } from "../Utils/Store.js";
import { death1 } from "../Utils/Store.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { playerinfo } from "../Utils/Store.js";
import { sipahi_position } from "../Utils/Store.js";
import { score } from "../Utils/Store.js";

export default class CharacterController {
  constructor() {
    this.app = new App();
    this.random = Math.round(Math.random());
    this.scene = this.app.scene;
    this.fontLoader = new FontLoader();
    this.inputController = new InputController();
    this.extra = this.app.world.extra_char_controller;
    this.physics = this.app.world.physics;
    this.character = this.app.world.character.instance;
    this.autoMovementSpeed = 0.01; // Speed for automatic movement
    this.autoDirection = new THREE.Vector3(0, 0, 1);
    this.div = document.querySelector(".div-kill");
    this.count = 0;
    this.windiv = document.querySelector(".win")
    this.losediv = document.querySelector(".lose")
    this.score_button = document.querySelector(".score1")
    this.score_button1 = document.querySelector(".score")
    this.scoretable = document.querySelector(".scorekadiv")
    this.replay = document.querySelector(".score11")

    playerinfo.subscribe((state) => {
      console.log(state.Sipahi);

      this.sipahi = state.Sipahi;
      this.chor = state.Chor;
      this.mantri = state.Mantri;
      this.raja = state.Raja;

      this.text = this.sipahi.toUpperCase();

      this.fontLoader.load(
        "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
        (font) => {
          const textGeometry = new TextGeometry(this.text, {
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

          textMesh.rotation.y = -Math.PI / 2;
          textMesh.position.set(0, 0.07, -(this.text.length) / 6);

          this.character.add(textMesh);
        }
      );
    });

    inputStore.subscribe((state) => {
      this.forward = state.forward;
      this.backward = state.backward;
      this.left = state.left;
      this.right = state.right;
      this.kill = state.kill;
    });

    this.instantiateController();
  }

  instantiateController() {
    this.rigidBodyType =
      this.physics.rapier.RigidBodyDesc.kinematicPositionBased();
    this.rigidBody = this.physics.world.createRigidBody(this.rigidBodyType);

    this.colliderType = this.physics.rapier.ColliderDesc.cuboid(1, 2.5, 1);
    this.collider = this.physics.world.createCollider(
      this.colliderType,
      this.rigidBody
    );

    const worldPosition = this.character.getWorldPosition(new THREE.Vector3());
    const worldRotation = this.character.getWorldQuaternion(
      new THREE.Quaternion()
    );
    this.rigidBody.setTranslation(worldPosition);
    this.rigidBody.setRotation(worldRotation);

    this.characterController = this.physics.world.createCharacterController(
      0.01
    );
    this.characterController.setApplyImpulsesToDynamicBodies(true);
    this.characterController.enableAutostep(2, 0.1, false);
    this.characterController.enableSnapToGround(0);
  }

  loop() {
    this.angle;
    const chor = this.chor;
    const mantri = this.mantri;

    const movement = new THREE.Vector3();
    if (this.forward) {
      movement.z -= 0.01;
    }
    if (this.backward) {
      movement.z += 0.01;
    }
    if (this.left) {
      movement.x -= 0.01;
    }
    if (this.right) {
      movement.x += 0.01;
    }

    if (movement.length() !== 0) {
      this.angle = Math.atan2(movement.x, movement.z) + Math.PI / 2;
      const characterRotation = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        this.angle
      );
      this.character.quaternion.slerp(characterRotation, 0.2);
    }

    movement.normalize().multiplyScalar(0.1);
    movement.y = -1;

    this.characterController.computeColliderMovement(this.collider, movement);
    const newPosition = new THREE.Vector3()
      .copy(this.rigidBody.translation())
      .add(this.characterController.computedMovement());

    this.rigidBody.setNextKinematicTranslation(newPosition);
    this.character.position.lerp(this.rigidBody.translation(), 0.2);

    if (
      this.character.position.x > -4.465 &&
      this.character.position.x < -4.463
    ) {
      if (this.angle === 0) {
        this.div.classList.add("kill-info");
        if (this.kill) {
          this.div.classList.add("fadeIn");

          if (this.count === 0) {
            setTimeout(() => inputStore.setState({ kill: false }), 1100);
            death.setState({ death: true });

            this.inputController.stopListening();
            if (this.random === 0) {
              console.log("nailed it ");
              playerinfo.subscribe((state) => {
                this.mantri = state.Mantri;
                this.chor = state.Chor;
                this.raja = state.Raja;
                this.sipahi = state.Sipahi;
              });
              const tableBody = document.querySelector("#data-table tbody");
              const row = document.createElement("tr");
              row.innerHTML = `
                    <td>${this.raja}</td>
                    <td>${this.sipahi}</td>
                    <td>${this.mantri}</td>
                    <td>${this.chor}</td>
                   `;
              tableBody.appendChild(row);
              const row2= document.createElement("tr");
              row2.innerHTML = `
                    <td>${1000}</td>
                    <td>${500}</td>
                    <td>${800}</td>
                    <td>${"000"}</td>
                   `;
              tableBody.appendChild(row2);
              
              
              setTimeout(() => this.windiv.classList.add("container2"), 1900);
              this.score_button1.addEventListener("click",()=>{
                this.scoretable.classList.add("scoretable")
                this.windiv.classList.remove("container2")
              })
              this.replay.addEventListener("click",()=>{
                location.reload(true);
              })
              
            }
             else {
              killer.setState({ killer: true });
              sipahi_position.setState({
                sipahi_position: this.character.position.x,
              });
              playerinfo.setState({ Mantri: chor });
              playerinfo.setState({ Chor: mantri });
              score.setState({ sipahi_points: 0 });
              score.setState({ chor_points: 500 });
              const tableBody = document.querySelector("#data-table tbody");
              const row = document.createElement("tr");
              row.innerHTML = `
                    <td>${this.raja}</td>
                    <td>${this.sipahi}</td>
                    <td>${this.mantri}</td>
                    <td>${this.chor}</td>
                   `;
              tableBody.appendChild(row);
              let row21= document.createElement("tr");
              row2.innerHTML = `
                    <td>${1000}</td>
                    <td>${"000"}</td>
                    <td>${800}</td>
                    <td>${500}</td>
                   `;
              tableBody.appendChild(row21);
              const row2= document.createElement("tr");
              
              setTimeout(() => this.losediv.classList.add("container2"), 1900);
              this.score_button.addEventListener("click",()=>{
                this.scoretable.classList.add("scoretable")
                this.losediv.classList.remove("container2")
              })
              this.replay.addEventListener("click",()=>{
                location.reload(true);
              })
            }
          }
          this.count += 1;
        }
      } else {
        this.div.classList.remove("kill-info");
      }
    } else if (
      this.character.position.x > -4.415 &&
      this.character.position.x < -4.412
    ) {
      if (this.angle === 0) {
        this.div.classList.add("kill-info1");
        if (this.kill) {
          this.div.classList.add("fadeIn");

          if (this.count === 0) {
            setTimeout(() => inputStore.setState({ kill: false }), 1100);
            death1.setState({ death1: true });

            this.inputController.stopListening();
            if (this.random === 0) {
              console.log("nailed it ");
              playerinfo.setState({ Mantri: chor });
              playerinfo.setState({ Chor: mantri });
              score.setState({ sipahi_points: 0 });
              score.setState({ chor_points: 500 });
              playerinfo.subscribe((state) => {
                this.mantri = state.Mantri;
                this.chor = state.Chor;
                this.raja = state.Raja;
                this.sipahi = state.Sipahi;
              });
              const tableBody = document.querySelector("#data-table tbody");
              const row1= document.createElement("tr");
              row1.innerHTML = `
                    <td>${this.raja}</td>
                    <td>${this.sipahi}</td>
                    <td>${this.mantri}</td>
                    <td>${this.chor}</td>
                   `;
              tableBody.appendChild(row1);
              const row2= document.createElement("tr");
              row2.innerHTML = `
                    <td>${1000}</td>
                    <td>${500}</td>
                    <td>${800}</td>
                    <td>${"000"}</td>
                   `;
              tableBody.appendChild(row2);

              setTimeout(() => this.windiv.classList.add("container2"), 1900);
              this.score_button1.addEventListener("click",()=>{
                this.scoretable.classList.add("scoretable")
                this.windiv.classList.remove("container2")
              })
              this.replay.addEventListener("click",()=>{
                location.reload(true);
              })
              
            }
             else {
              killer.setState({ killer: true });
              sipahi_position.setState({
                sipahi_position: this.character.position.x,
              });
              score.setState({ sipahi_points: 500 });
              score.setState({ chor_points: 0 });
              playerinfo.subscribe((state) => {
                this.mantri = state.Mantri;
                this.chor = state.Chor;
                this.raja = state.Raja;
                this.sipahi = state.Sipahi;
              });
              const tableBody = document.querySelector("#data-table tbody");
              const row = document.createElement("tr");
              row.innerHTML = `
                    <td>${this.raja}</td>
                    <td>${this.sipahi}</td>
                    <td>${this.mantri}</td>
                    <td>${this.chor}</td>
                   `;
              tableBody.appendChild(row);
              const row2= document.createElement("tr");
              row2.innerHTML = `
                    <td>${1000}</td>
                    <td>${"000"}</td>
                    <td>${800}</td>
                    <td>${500}</td>
                   `;
              tableBody.appendChild(row2);
              
              setTimeout(() => this.losediv.classList.add("container2"), 1900);
              this.score_button.addEventListener("click",()=>{
                this.scoretable.classList.add("scoretable")
                this.losediv.classList.remove("container2")
              })
              this.replay.addEventListener("click",()=>{
                location.reload(true);
              })

            }
          }
          this.count += 1;
        }
      } else {
        this.div.classList.remove("kill-info1");
      }
    } else {
      this.div.classList.remove("kill-info");
      this.div.classList.remove("kill-info1");
    }
  }
}
