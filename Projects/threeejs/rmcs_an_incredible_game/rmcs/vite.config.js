import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";


export default {
    build: {
      outDir: 'dist', // Ensure this is set to 'dist' or whatever output directory you prefer
    },
    plugins: [
        wasm(),
        topLevelAwait()
      ]
      
}