import { createStore } from "zustand/vanilla";

const assetsToLoad = [
  {
    id: 'Raja_mantri_environment',
    path :'models/Raja_Mantri_chor_police_model.glb',
    type:'model'
  },
  {
    id: 'Avatar',
    path :'./models/sipahi.glb',
    type:'model'
  },
  {
    id:'Raja',
    path :'./models/raja.glb',
    type:'model'

  },
  {
    id:'mantri_or_chor',
    path:'./models/mantri-or-chor.glb',
    type:'model'
  },
  {
    id:'chor_or_mantri',
    path:'./models/chor_mantri.glb',
    type:'model'
  },
  {
    id:'extra_char',
    path:'./models/extra.glb',
    type:'model'
  }
];

const assetStore = createStore((set) => ({
  assetsToLoad,
  loadedAssets: {},
  addLoadedAsset: (asset, id) =>
    set((state) => ({
      loadedAssets: {
        ...state.loadedAssets,
        [id]: asset,
      },
    })),
}));

export default assetStore;
