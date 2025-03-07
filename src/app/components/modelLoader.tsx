'use client';

import { useEffect } from 'react';
import * as THREE from 'three';
import { GLTF, GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

import SceneInit from './sceneSetup';

function ModelLoader() {
    useEffect(() => {
        const canvas = new SceneInit('myThreeJsCanvas');
        canvas.initialize();
        canvas.animate();

        let loadedModel: GLTF;
        const glftLoader = new GLTFLoader();
        glftLoader.load('/models/kieranPC.glb', (gltfScene) => {
            loadedModel = gltfScene;
            // console.log(loadedModel);

            // Set frustumCulled to false for all objects
            gltfScene.scene.traverse((object) => {
                object.frustumCulled = false;
            });

            gltfScene.scene.rotation.y = -Math.PI / 2;
            gltfScene.scene.position.y = 3;
            gltfScene.scene.scale.set(10, 10, 10);
            canvas.scene.add(gltfScene.scene);
        });
    }, []);

    return (
        <div>
            <button id="zoomButton" style={{ marginLeft: '200px' }}>Zoom In</button>
            <canvas id="myThreeJsCanvas" />
        </div>
    );
}

export default ModelLoader;