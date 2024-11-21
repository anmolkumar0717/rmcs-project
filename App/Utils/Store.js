import create from "prompt-sync";
import { createStore } from "zustand/vanilla";
import chor_or_mantri from "../World/chor_or_mantri";

export const sizesStore = createStore(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
}));

export const appStateStore = createStore(() => ({
    physicsReady: false,
    assetsReady: false,
}));

export const ready = createStore(()=>({
    ready:false
}))
export const death=createStore(()=>({
    death:false

}))
export const death1=createStore(()=>({
    death1:false

}))

export const killer=createStore(()=>({
    killer:false
}))
export const sipahi_position = createStore(()=>({
    sipahi_position:null,
    angle:0

}))

export const playerinfo = createStore(()=>({
    Raja:null,
    Mantri:null,
    Chor:null,
    Sipahi:null
}))

export const score = createStore(()=>({
    raja_point:1000,
    mantri_points:800,
    sipahi_points:0,
    chor_points:0
}))

export const killed = createStore(()=>({
    pressed:false
}))


export const inputStore = createStore(() => ({
    forward: false,
    backward: false,
    left: false,
    right: false,
    kill: false,
}));