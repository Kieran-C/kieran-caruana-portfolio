import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { gsap } from 'gsap';

export default class SceneSetup {
    scene
    camera
    renderer
    private fov: number;
    private nearPlane: number;
    private farPlane: number;
    private canvasId: string;
    clock
    stats
    controls
    ambientLight
    directionalLight

    constructor(canvasId: string) {
        this.scene = undefined;
        this.camera = undefined;
        this.renderer = undefined;

        this.fov = 90;
        this.nearPlane = 1;
        this.farPlane = 1000;
        this.canvasId = canvasId;

        this.clock = undefined;
        this.stats = undefined;
        this.controls = undefined;

        this.ambientLight = undefined;
        this.directionalLight = undefined;
    }

    initialize() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            this.fov,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
        this.camera.position.set(0, 150, 350);

        const canvas = document.getElementById(this.canvasId) as HTMLCanvasElement | null;
        if (!canvas) {
            throw new Error(`Canvas element with id '${this.canvasId}' not found`);
        }
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.stats = Stats();
        document.body.appendChild(this.stats.dom);

        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        this.ambientLight.castShadow = true;
        this.scene.add(this.ambientLight);

        this.directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        this.directionalLight.position.set(0, 32, 64);
        this.scene.add(this.directionalLight);

        window.addEventListener('resize', () => this.onWindowResize(), false);

        this.introAnimation();

        const zoomButton = document.getElementById('zoomButton');
        if (zoomButton) {
            zoomButton.addEventListener('click', () => this.zoomInOnScreen());
        }
    }

    introAnimation() {
        const duration = 5; // duration of the animation in seconds
        const targetPosition = { x: 0, y: 150, z: 350 };
        const startPosition = { x: 500, y: 200, z: 0 };

        gsap.fromTo(this.camera.position, startPosition, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: duration,
            ease: 'power1.inOut',
            onUpdate: () => {
                this.camera.lookAt(this.scene.position);
            }
        });
    }

    zoomInOnScreen() {
        const duration = 2; // duration of the zoom-in animation in seconds
        const targetPosition = { x: 0, y: 135, z: 200 }; // Adjust the target position to zoom in on the screen

        this.controls.enabled = false;

        gsap.to(this.camera.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: duration,
            ease: 'power1.inOut',
            onUpdate: () => {
                this.camera.lookAt(new THREE.Vector3(0, 150, 0)); // Look at the same height as the camera
            },
        });

        gsap.to(this.camera.rotation, {
            x: 0,
            y: 0,
            z: 0,
            duration: duration,
            ease: 'power1.inOut',
            onUpdate: () => {
                this.camera.updateProjectionMatrix(); // Update the camera projection matrix during the animation
            },
        });
    }

    animate() {
        window.requestAnimationFrame(this.animate.bind(this));
        this.render();
        this.stats.update();
        if (this.controls.enabled){
            this.controls.update();
        }
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}