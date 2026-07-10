/**
 * THREE.JS SCENE
 * Netflix Premium - 3D Objects (Laptop, TV, Phone, Popcorn)
 */

(function() {
    'use strict';

    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.warn('Three.js library not loaded');
        return;
    }

    // DOM Elements
    const container = document.getElementById('threeContainer');
    if (!container) {
        console.warn('Three.js container not found');
        return;
    }

    // Configuration
    const CONFIG = {
        cameraZ: 8,
        rotationSpeed: 0.005,
        autoRotate: true,
        tiltIntensity: 0.5,
        glowIntensity: 0.3
    };

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null; // Transparent

    // Camera
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = CONFIG.cameraZ;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xff0000, 0.5);
    fillLight.position.set(-3, 0, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x0066ff, 0.3);
    rimLight.position.set(0, -5, -5);
    scene.add(rimLight);

    // Objects group
    const objectsGroup = new THREE.Group();
    scene.add(objectsGroup);

    // ============================================
    // CREATE LAPTOP
    // ============================================
    function createLaptop() {
        const group = new THREE.Group();

        // Base
        const baseGeo = new THREE.BoxGeometry(4.5, 0.15, 3);
        const baseMat = new THREE.MeshPhysicalMaterial({
            color: 0x1a1a1a,
            metalness: 0.7,
            roughness: 0.3,
            envMapIntensity: 1.0,
            clearcoat: 0.1
        });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.y = -0.75;
        base.castShadow = true;
        base.receiveShadow = true;
        group.add(base);

        // Screen
        const screenGeo = new THREE.BoxGeometry(4.2, 2.8, 0.05);
        const screenMat = new THREE.MeshPhysicalMaterial({
            color: 0x0a0a0a,
            metalness: 0.9,
            roughness: 0.1,
            envMapIntensity: 0.5,
            emissive: 0xE50914,
            emissiveIntensity: 0.05
        });
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.set(0, 0.95, -0.02);
        screen.castShadow = true;
        group.add(screen);

        // Screen glow
        const glowGeo = new THREE.PlaneGeometry(3.8, 2.4);
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0xE50914,
            transparent: true,
            opacity: 0.1,
            blending: THREE.AdditiveBlending
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        glow.position.set(0, 0.95, -0.01);
        group.add(glow);

        // Keyboard area
        const kbGeo = new THREE.BoxGeometry(4.0, 0.05, 2.0);
        const kbMat = new THREE.MeshPhysicalMaterial({
            color: 0x222222,
            metalness: 0.5,
            roughness: 0.5
        });
        const kb = new THREE.Mesh(kbGeo, kbMat);
        kb.position.set(0, -0.68, 0.3);
        group.add(kb);

        // Keys (simplified)
        for (let i = 0; i < 12; i++) {
            for (let j = 0; j < 4; j++) {
                const keyGeo = new THREE.BoxGeometry(0.25, 0.02, 0.2);
                const keyMat = new THREE.MeshPhysicalMaterial({
                    color: 0x333333,
                    metalness: 0.3,
                    roughness: 0.7
                });
                const key = new THREE.Mesh(keyGeo, keyMat);
                key.position.set(-1.6 + i * 0.3, -0.66, -0.2 + j * 0.3);
                group.add(key);
            }
        }

        // Logo
        const logoGeo = new THREE.CircleGeometry(0.15, 16);
        const logoMat = new THREE.MeshBasicMaterial({
            color: 0xE50914,
            transparent: true,
            opacity: 0.8
        });
        const logo = new THREE.Mesh(logoGeo, logoMat);
        logo.position.set(1.8, 0.95, -0.01);
        group.add(logo);

        // Adjust rotation
        group.rotation.x = -0.1;
        group.rotation.z = 0.05;

        return group;
    }

    // ============================================
    // CREATE TV
    // ============================================
    function createTV() {
        const group = new THREE.Group();

        // TV Body
        const bodyGeo = new THREE.BoxGeometry(2.0, 1.4, 0.08);
        const bodyMat = new THREE.MeshPhysicalMaterial({
            color: 0x111111,
            metalness: 0.8,
            roughness: 0.2,
            envMapIntensity: 0.5
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.castShadow = true;
        group.add(body);

        // Screen
        const screenGeo = new THREE.BoxGeometry(1.8, 1.2, 0.02);
        const screenMat = new THREE.MeshPhysicalMaterial({
            color: 0x0a0a0a,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0xE50914,
            emissiveIntensity: 0.1
        });
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.z = 0.05;
        group.add(screen);

        // Stand
        const standGeo = new THREE.BoxGeometry(0.6, 0.02, 0.4);
        const standMat = new THREE.MeshPhysicalMaterial({
            color: 0x222222,
            metalness: 0.7,
            roughness: 0.3
        });
        const stand = new THREE.Mesh(standGeo, standMat);
        stand.position.set(0, -0.72, 0);
        group.add(stand);

        // Stand base
        const baseGeo2 = new THREE.BoxGeometry(0.8, 0.02, 0.6);
        const baseMat2 = new THREE.MeshPhysicalMaterial({
            color: 0x1a1a1a,
            metalness: 0.7,
            roughness: 0.3
        });
        const base2 = new THREE.Mesh(baseGeo2, baseMat2);
        base2.position.set(0, -0.74, 0);
        group.add(base2);

        // Position
        group.position.set(2.2, 0.6, 0);
        group.rotation.y = -0.2;

        return group;
    }

    // ============================================
    // CREATE PHONE
    // ============================================
    function createPhone() {
        const group = new THREE.Group();

        // Phone body
        const bodyGeo2 = new THREE.BoxGeometry(0.6, 1.0, 0.04);
        const bodyMat2 = new THREE.MeshPhysicalMaterial({
            color: 0x1a1a1a,
            metalness: 0.9,
            roughness: 0.1,
            envMapIntensity: 1.0
        });
        const body2 = new THREE.Mesh(bodyGeo2, bodyMat2);
        body2.castShadow = true;
        group.add(body2);

        // Screen
        const screenGeo2 = new THREE.BoxGeometry(0.5, 0.85, 0.01);
        const screenMat2 = new THREE.MeshPhysicalMaterial({
            color: 0x0a0a0a,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0xE50914,
            emissiveIntensity: 0.15
        });
        const screen2 = new THREE.Mesh(screenGeo2, screenMat2);
        screen2.position.z = 0.025;
        group.add(screen2);

        // Camera bump
        const camGeo = new THREE.CircleGeometry(0.03, 8);
        const camMat = new THREE.MeshPhysicalMaterial({
            color: 0x333333,
            metalness: 0.8,
            roughness: 0.2
        });
        const cam = new THREE.Mesh(camGeo, camMat);
        cam.position.set(0, 0.43, 0.025);
        group.add(cam);

        // Position
        group.position.set(-2.0, -0.2, 0.8);
        group.rotation.x = 0.1;
        group.rotation.y = 0.3;

        return group;
    }

    // ============================================
    // CREATE POPCORN
    // ============================================
    function createPopcorn() {
        const group = new THREE.Group();

        // Box
        const boxGeo = new THREE.BoxGeometry(0.6, 0.8, 0.6);
        const boxMat = new THREE.MeshPhysicalMaterial({
            color: 0xE50914,
            metalness: 0.1,
            roughness: 0.8,
            emissive: 0xE50914,
            emissiveIntensity: 0.05
        });
        const box = new THREE.Mesh(boxGeo, boxMat);
        box.position.y = 0.4;
        box.castShadow = true;
        group.add(box);

        // Popcorn kernels
        const kernelMat = new THREE.MeshPhysicalMaterial({
            color: 0xFFD700,
            metalness: 0.1,
            roughness: 0.6,
            emissive: 0xFFD700,
            emissiveIntensity: 0.05
        });

        for (let i = 0; i < 20; i++) {
            const size = 0.05 + Math.random() * 0.1;
            const kernelGeo = new THREE.SphereGeometry(size, 6, 6);
            const kernel = new THREE.Mesh(kernelGeo, kernelMat);
            
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI * 0.5;
            const radius = 0.3 + Math.random() * 0.2;
            
            kernel.position.set(
                Math.cos(theta) * Math.sin(phi) * radius,
                0.7 + Math.random() * 0.3,
                Math.sin(theta) * Math.sin(phi) * radius
            );
            
            group.add(kernel);
        }

        // Position
        group.position.set(-1.8, -0.5, -1.0);
        group.rotation.x = 0.1;
        group.rotation.z = 0.1;
        group.scale.set(0.8, 0.8, 0.8);

        return group;
    }

    // ============================================
    // ADD ALL OBJECTS
    // ============================================
    const laptop = createLaptop();
    objectsGroup.add(laptop);

    const tv = createTV();
    objectsGroup.add(tv);

    const phone = createPhone();
    objectsGroup.add(phone);

    const popcorn = createPopcorn();
    objectsGroup.add(popcorn);

    // ============================================
    // MOUSE TILT
    // ============================================
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    function handleMouseMove(e) {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        targetRotationY = (x - 0.5) * CONFIG.tiltIntensity;
        targetRotationX = (y - 0.5) * CONFIG.tiltIntensity;
    }

    container.addEventListener('mousemove', handleMouseMove);

    // ============================================
    // ANIMATION LOOP
    // ============================================
    function animate() {
        requestAnimationFrame(animate);

        // Smooth tilt
        currentRotationX += (targetRotationX - currentRotationX) * 0.05;
        currentRotationY += (targetRotationY - currentRotationY) * 0.05;

        // Apply rotation
        objectsGroup.rotation.x = currentRotationX * 0.3;
        objectsGroup.rotation.y = currentRotationY * 0.3;

        // Auto rotation
        if (CONFIG.autoRotate) {
            objectsGroup.rotation.y += CONFIG.rotationSpeed;
        }

        // Float animation
        const time = Date.now() * 0.001;
        objectsGroup.position.y = Math.sin(time * 0.5) * 0.1;

        // Render
        renderer.render(scene, camera);
    }

    animate();

    // ============================================
    // RESIZE HANDLER
    // ============================================
    function handleResize() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    window.addEventListener('resize', handleResize);

    // ============================================
    // EXPOSE FOR DEBUGGING
    // ============================================
    window.threeScene = {
        scene,
        camera,
        renderer,
        objectsGroup,
        CONFIG
    };

    console.log('✅ Three.js scene initialized');
})();
