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

        // const boxGeometry = new THREE.BoxGeometry(8, 8, 8);
        // const boxMaterial = new THREE.MeshNormalMaterial();
        // const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        // test.scene.add(boxMesh);

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

        const animate = () => {
            // if (loadedModel) {
            //     loadedModel.scene.rotation.x += 0.01;
            //     loadedModel.scene.rotation.y += 0.01;
            //     loadedModel.scene.rotation.z += 0.01;
            // }
            requestAnimationFrame(animate);
        };
        animate();
    }, []);

    return (
        <div>
            <canvas id="myThreeJsCanvas" />
        </div>
    );
}

export default ModelLoader;