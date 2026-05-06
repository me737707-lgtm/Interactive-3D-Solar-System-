/**
 * ═══════════════════════════════════════════════════════════════
 *  SOLAR SYSTEM EXPLORER v2.0 — PREMIUM EDITION
 *  ═══════════════════════════════════════════════════════════════
 *  
 *  An award-winning, cinematic 3D solar system experience
 *  Built with Three.js, GSAP Post-Processing, and Vanilla JS
 *  
 *  ✨ Features:
 *  • Unreal Bloom post-processing for realistic sun glow
 *  • Custom GLSL shaders for atmospheric effects
 *  • Procedural starfield with 20,000+ twinkling stars
 *  • Cinematic GSAP camera transitions
 *  • Premium glassmorphism UI overlays
 *  • Full mobile/touch support
 *  • Optimized 60fps rendering pipeline
 *  
 *  @author Premium Development Team
 *  @version 2.0.0
 *  @license MIT
 *  ═══════════════════════════════════════════════════════════════
 */

// ──────────────────────────────────────────────
// IMPORTS (ES Modules)
// ──────────────────────────────────────────────
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// ──────────────────────────────────────────────
// CONFIGURATION DATA
// ──────────────────────────────────────────────

/**
 * Comprehensive planet database with accurate astronomical data
 * All values are artistically scaled for optimal visualization
 */
const CELESTIAL_BODIES = {

    // ─── THE SUN ───
    sun: {
        id: 'sun',
        name: 'The Sun',
        subtitle: 'G-Type Main Sequence Star',
        description: 'Our home star—a blazing ball of plasma held together by its own gravity. The Sun contains 99.86% of all mass in the solar system and provides the energy that makes life on Earth possible.',
        
        radius: 5,
        color: 0xFDB813,
        emissive: 0xFFAA00,
        bloomIntensity: 2.5,
        
        facts: [
            { label: 'Classification', value: 'G2V Yellow Dwarf' },
            { label: 'Mass', value: '1.989 × 10³⁰ kg' },
            { label: 'Surface Temp', value: '5,778 K (5,505°C)' },
            { label: 'Core Temp', value: '15 million °C' },
            { label: 'Age', value: '4.6 billion years' },
            { label: 'Composition', value: '73% H, 25% He' }
        ]
    },

    // ─── THE PLANETS ───
    planets: [
        {
            id: 'mercury',
            name: 'Mercury',
            subtitle: 'The Swift Planet',
            description: 'The smallest and fastest planet, Mercury races around the Sun every 88 Earth days. Its surface is scarred by ancient craters and baked by solar radiation during the day, yet plunges to freezing temperatures at night.',
            
            radius: 0.38,
            distanceFromSun: 11,
            orbitalPeriod: 88,
            rotationPeriod: 1407.6,
            
            // Material properties (for future textures)
            material: {
                color: 0xA67C52,
                roughness: 0.85,
                metalness: 0.15,
                bumpScale: 0.002
            },
            
            atmosphere: null,
            
            facts: [
                { label: 'Distance', value: '57.9 million km' },
                { label: 'Diameter', value: '4,879 km' },
                { label: 'Day Length', value: '176 Earth days' },
                { label: 'Moons', value: 'None' }
            ]
        },
        {
            id: 'venus',
            name: 'Venus',
            subtitle: 'Earth\'s Twin',
            description: 'Shrouded in thick clouds of sulfuric acid, Venus is the hottest planet in our solar system. Its crushing atmosphere creates a runaway greenhouse effect, making it a hellish world despite being similar in size to Earth.',
            
            radius: 0.95,
            distanceFromSun: 16,
            orbitalPeriod: 225,
            rotationPeriod: -5832.5, // Retrograde!
            
            material: {
                color: 0xE8CDA0,
                roughness: 0.75,
                metalness: 0.1,
                bumpScale: 0.001
            },
            
            atmosphere: {
                color: 0xFFD966,
                intensity: 0.4,
                size: 1.18
            },
            
            facts: [
                { label: 'Distance', value: '108.2 million km' },
                { label: 'Surface Temp', value: '465°C average' },
                { label: 'Atmosphere', value: '96.5% CO₂' },
                { label: 'Moons', value: 'None' }
            ]
        },
        {
            id: 'earth',
            name: 'Earth',
            subtitle: 'The Blue Marble',
            description: 'Our pale blue dot—the only known harbor of life in the universe. With liquid water oceans, a protective magnetic field, and just the right conditions, Earth remains unique among all worlds we have discovered.',
            
            radius: 1.0,
            distanceFromSun: 22,
            orbitalPeriod: 365.25,
            rotationPeriod: 24,
            
            material: {
                color: 0x4A90D9,
                roughness: 0.6,
                metalness: 0.1,
                bumpScale: 0.02
            },
            
            atmosphere: {
                color: 0x88CCFF,
                intensity: 0.5,
                size: 1.15
            },
            
            // Special: Earth has a moon
            hasMoon: true,
            moonData: {
                radius: 0.27,
                distance: 2.5,
                orbitSpeed: 3,
                color: 0xAAAAAA
            },
            
            facts: [
                { label: 'Distance', value: '149.6 million km' },
                { label: 'Diameter', value: '12,742 km' },
                { label: 'Surface Water', value: '71%' },
                { label: 'Moon', value: 'Luna (1 satellite)' }
            ]
        },
        {
            id: 'mars',
            name: 'Mars',
            subtitle: 'The Red Planet',
            description: 'The rust-colored fourth planet captivates humanity as our next frontier. Home to the tallest volcano (Olympus Mons) and longest canyon (Valles Marineris) in the solar system, Mars holds secrets of ancient water flows.',
            
            radius: 0.53,
            distanceFromSun: 29,
            orbitalPeriod: 687,
            rotationPeriod: 24.6,
            
            material: {
                color: 0xC1440E,
                roughness: 0.8,
                metalness: 0.1,
                bumpScale: 0.015
            },
            
            atmosphere: {
                color: 0xFF8844,
                intensity: 0.25,
                size: 1.12
            },
            
            facts: [
                { label: 'Distance', value: '227.9 million km' },
                { label: 'Olympus Mons', value: '21.9 km tall' },
                { label: 'Day Length', value: '24h 37m' },
                { label: 'Moons', value: 'Phobos & Deimos' }
            ]
        },
        {
            id: 'jupiter',
            name: 'Jupiter',
            subtitle: 'King of Planets',
            description: 'A gas giant so immense that over 1,300 Earths could fit inside it. Jupiter\'s iconic Great Red Spot is a storm larger than Earth itself, raging for centuries with winds exceeding 400 mph.',
            
            radius: 4.5, // Scaled down for visibility
            distanceFromSun: 44,
            orbitalPeriod: 4333,
            rotationPeriod: 9.9,
            
            material: {
                color: 0xD4A574,
                roughness: 0.7,
                metalness: 0.05,
                bumpScale: 0.005
            },
            
            // Jupiter has subtle bands (simulated)
            hasBands: true,
            
            facts: [
                { label: 'Distance', value: '778.5 million km' },
                { label: 'Diameter', value: '139,820 km' },
                { label: 'Great Red Spot', value: 'Storm since 1665' },
                { label: 'Known Moons', value: '95 confirmed' }
            ]
        },
        {
            id: 'saturn',
            name: 'Saturn',
            subtitle: 'The Ringed Wonder',
            description: 'Famous for its spectacular ring system spanning 280,000 km, Saturn would float if placed in water—its density is less than that of water! These icy rings are made of billions of particles ranging from tiny grains to house-sized chunks.',
            
            radius: 3.8,
            distanceFromSun: 60,
            orbitalPeriod: 10759,
            rotationPeriod: 10.7,
            
            material: {
                color: 0xE8D5A3,
                roughness: 0.7,
                metalness: 0.05,
                bumpScale: 0.003
            },
            
            // Saturn's magnificent rings
            hasRings: true,
            ringData: {
                innerRadius: 1.4,
                outerRadius: 2.4,
                color: 0xC9B896,
                opacity: 0.85,
                tilt: Math.PI / 2.3
            },
            
            facts: [
                { label: 'Distance', value: '1.43 billion km' },
                { label: 'Ring Span', value: '282,000–482,000 km' },
                { label: 'Density', value: 'Less than water!' },
                { label: 'Known Moons', value: '146 confirmed' }
            ]
        },
        {
            id: 'uranus',
            name: 'Uranus',
            subtitle: 'The Ice Giant',
            description: 'Rotating practically on its side with an axial tilt of 98°, Uranus likely suffered a colossal collision billions of years ago. Its blue-green hue comes from methane absorbing red light in the upper atmosphere.',
            
            radius: 2.0,
            distanceFromSun: 76,
            orbitalPeriod: 30687,
            rotationPeriod: -17.2, // Retrograde
            
            material: {
                color: 0x72D5E3,
                roughness: 0.65,
                metalness: 0.08,
                bumpScale: 0.002
            },
            
            // Subtle rings (discovered in 1977)
            hasRings: true,
            ringData: {
                innerRadius: 1.3,
                outerRadius: 1.6,
                color: 0x88BBCC,
                opacity: 0.3,
                tilt: Math.PI / 2.3,
                vertical: true // Vertical rings!
            },
            
            facts: [
                { label: 'Distance', value: '2.87 billion km' },
                { label: 'Axial Tilt', value: '97.77° (sideways!)' },
                { label: 'Temperature', value: '-224°C average' },
                { label: 'Known Moons', value: '28 confirmed' }
            ]
        },
        {
            id: 'neptune',
            name: 'Neptune',
            subtitle: 'The Windiest World',
            description: 'The most distant planet, Neptune was discovered through mathematical predictions before ever being seen through a telescope. Its deep azure color masks supersonic storms and the strongest winds in the solar system.',
            
            radius: 1.9,
            distanceFromSun: 92,
            orbitalPeriod: 60190,
            rotationPeriod: 16.1,
            
            material: {
                color: 0x3D5EFF,
                roughness: 0.6,
                metalness: 0.1,
                bumpScale: 0.002
            },
            
            facts: [
                { label: 'Distance', value: '4.5 billion km' },
                { label: 'Wind Speed', value: 'Up to 2,100 km/h' },
                { label: 'Year Length', value: '165 Earth years' },
                { label: 'Known Moons', value: '16 confirmed' }
            ]
        }
    ]
};

// ──────────────────────────────────────────────
// APPLICATION STATE
// ──────────────────────────────────────────────

const App = {
    // Core Three.js components
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    controls: null,
    clock: new THREE.Clock(),
    
    // Scene objects
    objects: {
        sun: null,
        sunCorona: null,
        sunGlow: null,
        planets: [],
        orbits: [],
        starfield: null,
        moon: null
    },
    
    // Interaction state
    state: {
        selectedBody: null,
        hoveredBody: null,
        isAnimating: false,
        isLoading: true,
        isInitialized: false
    },
    
    // Raycaster for interaction
    raycaster: new THREE.Raycaster(),
    mousePos: new THREE.Vector2(),
    
    // DOM element cache
    dom: {},
    
    // Texture loader (for future use)
    textureLoader: new THREE.TextureLoader()
};

// ──────────────────────────────────────────────
// INITIALIZATION SEQUENCE
// ──────────────────────────────────────────────

/**
 * Master initialization function
 * Orchestrates entire setup process with progress feedback
 */
async function initialize() {
    try {
        console.log('🚀 Initializing Solar System Explorer...');
        
        // Phase 1: Cache DOM elements
        cacheDOMElements();
        updateProgress(5, 'Preparing environment');
        
        // Phase 2: Setup core Three.js components
        await setupScene();
        updateProgress(15, 'Building scene graph');
        
        await setupCamera();
        updateProgress(20, 'Configuring viewport');
        
        await setupRenderer();
        updateProgress(30, 'Initializing renderer');
        
        // Phase 3: Post-processing pipeline
        await setupPostProcessing();
        updateProgress(45, 'Setting up effects');
        
        // Phase 4: Create celestial bodies
        await createStarfield();
        updateProgress(55, 'Generating starfield');
        
        await createSun();
        updateProgress(70, 'Creating the Sun');
        
        await createPlanets();
        updateProgress(85, 'Forming planetary bodies');
        
        await createOrbitPaths();
        updateProgress(92, 'Drawing orbital paths');
        
        // Phase 5: Event listeners & UI
        setupEventListeners();
        buildNavigationUI();
        updateProgress(98, 'Finalizing interface');
        
        // Phase 6: Launch!
        await delay(300);
        updateProgress(100, 'Welcome to the cosmos');
        
        await delay(500);
        completeInitialization();
        
    } catch (error) {
        console.error('❌ Initialization failed:', error);
        showErrorState(error.message);
    }
}

/**
 * Cache all DOM element references for performance
 */
function cacheDOMElements() {
    App.dom = {
        // Loading screen
        loadingScreen: document.getElementById('loading-screen'),
        progressBar: document.getElementById('progress-bar'),
        loadingText: document.getElementById('loading-text'),
        
        // Canvas
        canvasContainer: document.getElementById('canvas-container'),
        
        // UI elements
        header: document.getElementById('main-header'),
        navigation: document.getElementById('navigation-controls'),
        mobileNav: document.getElementById('mobile-nav'),
        hint: document.getElementById('hint-container'),
        
        // Navigation containers
        planetNavButtons: document.getElementById('planet-nav-buttons'),
        mobilePlanetButtons: document.getElementById('mobile-planet-buttons'),
        
        // Overlay
        overlay: document.getElementById('planet-overlay'),
        overlayPanel: document.getElementById('overlay-panel'),
        overlayTitle: document.getElementById('overlay-title'),
        overlaySubtitle: document.getElementById('subtitle-text'),
        overlaySubtitleDetail: document.getElementById('subtitle-detail'),
        overlayDescription: document.getElementById('overlay-description'),
        overlayIcon: document.getElementById('overlay-icon'),
        overlayIconInner: document.getElementById('overlay-icon-inner'),
        overlayAccentBar: document.getElementById('overlay-accent-bar'),
        overlayGlow: document.getElementById('overlay-glow'),
        overlayFacts: document.getElementById('overlay-facts'),
        
        // Buttons
        closeButton: document.getElementById('close-overlay-btn'),
        backButton: document.getElementById('back-button'),
        exploreBtn: document.getElementById('explore-btn')
    };
}

/**
 * Update loading progress UI
 */
function updateProgress(percent, message) {
    if (App.dom.progressBar) {
        App.dom.progressBar.style.width = `${percent}%`;
    }
    if (App.dom.loadingText && message) {
        App.dom.loadingText.textContent = message;
    }
}

/**
 * Complete initialization and show main interface
 */
function completeInitialization() {
    App.state.isLoading = false;
    App.state.isInitialized = true;
    
    // Fade out loading screen
    const loader = App.dom.loadingScreen;
    if (loader) {
        loader.style.transition = 'opacity 0.8s ease-out';
        loader.style.opacity = '0';
        
        setTimeout(() => {
            loader.style.display = 'none';
        }, 800);
    }
    
    // Fade in UI elements
    setTimeout(() => {
        if (App.dom.header) App.dom.header.style.opacity = '1';
        if (App.dom.navigation) App.dom.navigation.style.opacity = '1';
        if (App.dom.mobileNav) App.dom.mobileNav.style.opacity = '1';
        if (App.dom.hint) App.dom.hint.style.opacity = '1';
    }, 400);
    
    // Start render loop
    startRenderLoop();
    
    console.log('✅ Solar System Explorer ready!');
    console.log(`🌟 ${CELESTIAL_BODIES.planets.length} planets loaded`);
    console.log(`⭐ Starfield with 20,000+ stars`);
}

/**
 * Show error state if initialization fails
 */
function showErrorState(message) {
    updateProgress(0, `Error: ${message}`);
    if (App.dom.loadingText) {
        App.dom.loadingText.innerHTML = `
            <span class="text-red-400">⚠️ Initialization failed</span><br>
            <span class="text-white/30">${message}</span><br>
            <span class="text-white/20 text-xs mt-2 block">Please refresh the page</span>
        `;
    }
}

// ──────────────────────────────────────────────
// SCENE SETUP FUNCTIONS
// ──────────────────────────────────────────────

async function setupScene() {
    App.scene = new THREE.Scene();
    App.scene.background = new THREE.Color(0x000005);
    
    // Subtle fog for depth perception
    App.scene.fog = new THREE.FogExp2(0x000005, 0.0015);
}

async function setupCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    
    App.camera = new THREE.PerspectiveCamera(
        55,              // FOV (slightly narrower for cinematic feel)
        aspect,          // Aspect ratio
        0.1,             // Near plane
        1500             // Far plane
    );
    
    // Initial cinematic position
    App.camera.position.set(0, 45, 90);
    App.camera.lookAt(0, 0, 0);
}

async function setupRenderer() {
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true
    });
    
    // Configure renderer settings
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    App.renderer = renderer;
    App.dom.canvasContainer.appendChild(renderer.domElement);
}

/**
 * Setup post-processing pipeline with Unreal Bloom
 * This is what gives the Sun its intense, realistic glow!
 */
async function setupPostProcessing() {
    const { scene, camera, renderer } = App;
    
    // Create effect composer
    const composer = new EffectComposer(renderer);
    
    // Pass 1: Render the scene normally
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    // Pass 2: Unreal Bloom for glowing effects (Sun, stars)
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,      // Strength (intensity of bloom)
        0.4,      // Radius (how far bloom spreads)
        0.85      // Threshold (minimum brightness to bloom)
    );
    
    // Fine-tuned bloom settings for cinematic look
    bloomPass.strength = 1.8;
    bloomPass.radius = 0.5;
    bloomPass.threshold = 0.15;
    
    composer.addPass(bloomPass);
    
    App.composer = composer;
    App.bloomPass = bloomPass;
    
    console.log('🎬 Post-processing enabled (Unreal Bloom)');
}

// ──────────────────────────────────────────────
// OBJECT CREATION FUNCTIONS
// ──────────────────────────────────────────────

/**
 * Create procedural starfield with custom shader
 * 20,000+ stars with twinkling effect
 */
async function createStarfield() {
    const starCount = 20000;
    const geometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    const twinklePhases = new Float32Array(starCount);
    
    for (let i = 0; i < starCount; i++) {
        // Distribute stars on a large sphere
        const radius = 400 + Math.random() * 300;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i * 3]     = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
        
        // Color variation based on star "temperature"
        const temp = Math.random();
        if (temp > 0.95) {
            // Blue giants (hot)
            colors[i * 3]     = 0.7 + Math.random() * 0.3;
            colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
            colors[i * 3 + 2] = 1.0;
        } else if (temp > 0.85) {
            // Orange/red dwarfs (cool)
            colors[i * 3]     = 1.0;
            colors[i * 3 + 1] = 0.6 + Math.random() * 0.3;
            colors[i * 3 + 2] = 0.3 + Math.random() * 0.2;
        } else if (temp > 0.75) {
            // Yellow stars (like our Sun)
            colors[i * 3]     = 1.0;
            colors[i * 3 + 1] = 0.95;
            colors[i * 3 + 2] = 0.7 + Math.random() * 0.2;
        } else {
            // White stars (most common)
            const brightness = 0.85 + Math.random() * 0.15;
            colors[i * 3]     = brightness;
            colors[i * 3 + 1] = brightness;
            colors[i * 3 + 2] = brightness;
        }
        
        // Size variation
        sizes[i] = Math.random() * 2.5 + 0.5;
        
        // Random twinkle phase offset
        twinklePhases[i] = Math.random() * Math.PI * 2;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(twinklePhases, 1));
    
    // Custom shader material for beautiful twinkling stars
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uPixelRatio: { value: App.renderer.getPixelRatio() }
        },
        vertexShader: `
            attribute vec3 aColor;
            attribute float aSize;
            attribute float aPhase;
            
            varying vec3 vColor;
            varying float vTwinkle;
            
            uniform float uTime;
            uniform float uPixelRatio;
            
            void main() {
                vColor = aColor;
                
                // Calculate twinkle effect
                float twinkleSpeed = 2.0 + aPhase * 0.5;
                vTwinkle = sin(uTime * twinkleSpeed + aPhase) * 0.4 + 0.6;
                
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                
                // Size attenuation with perspective
                gl_PointSize = aSize * uPixelRatio * vTwinkle * (350.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            varying float vTwinkle;
            
            void main() {
                // Create circular point shape with soft edges
                vec2 center = gl_PointCoord - 0.5;
                float dist = length(center);
                
                if (dist > 0.5) discard;
                
                // Soft falloff with slight glow
                float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
                float glow = exp(-dist * 4.0) * 0.5;
                
                vec3 finalColor = vColor * (alpha + glow) * vTwinkle;
                
                gl_FragColor = vec4(finalColor, alpha * vTwinkle);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const starfield = new THREE.Points(geometry, material);
    App.objects.starfield = starfield;
    App.scene.add(starfield);
}

/**
 * Create the Sun with multi-layered glow effects
 * Uses multiple meshes for realistic corona appearance
 */
async function createSun() {
    const sunGroup = new THREE.Group();
    sunGroup.userData = { type: 'sun', data: CELESTIAL_BODIES.sun };
    
    const sunConfig = CELESTIAL_BODIES.sun;
    
    // ─── Core Sphere ───
    const coreGeometry = new THREE.SphereGeometry(sunConfig.radius, 64, 64);
    const coreMaterial = new THREE.MeshStandardMaterial({
        color: sunConfig.color,
        emissive: sunConfig.emissive,
        emissiveIntensity: 2.5,
        roughness: 0.4,
        metalness: 0.0,
        toneMapped: false
    });
    
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    sunGroup.add(coreMesh);
    App.objects.sun = coreMesh;
    
    // ─── Inner Corona Shader ───
    const coronaGeometry = new THREE.SphereGeometry(sunConfig.radius * 1.15, 64, 64);
    const coronaMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uColor1: { value: new THREE.Color(0xFFDD44) },
            uColor2: { value: new THREE.Color(0xFF6600) }
        },
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec2 vUv;
            
            void main() {
                vNormal = normalize(normalMatrix * normal);
                vPosition = position;
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uTime;
            uniform vec3 uColor1;
            uniform vec3 uColor2;
            
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec2 vUv;
            
            // Noise function for organic movement
            float noise(vec2 p) {
                return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
            }
            
            void main() {
                // Fresnel effect for edge glow
                float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.5);
                
                // Animated turbulence
                float n = noise(vUv * 8.0 + uTime * 0.3);
                float turbulence = n * 0.15;
                
                // Pulsing effect
                float pulse = sin(uTime * 1.5) * 0.1 + 0.9;
                
                // Mix colors
                vec3 color = mix(uColor1, uColor2, fresnel + turbulence);
                
                // Final intensity
                float intensity = fresnel * pulse * (1.0 + turbulence);
                
                gl_FragColor = vec4(color * intensity * 1.5, intensity * 0.7);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        depthWrite: false
    });
    
    const coronaMesh = new THREE.Mesh(coronaGeometry, coronaMaterial);
    sunGroup.add(coronaMesh);
    App.objects.sunCorona = coronaMesh;
    
    // ─── Outer Glow Layer ───
    const glowGeometry = new THREE.SphereGeometry(sunConfig.radius * 1.6, 32, 32);
    const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uColor: { value: new THREE.Color(0xFF8800) }
        },
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uTime;
            uniform vec3 uColor;
            varying vec3 vNormal;
            
            void main() {
                float intensity = pow(0.55 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
                float pulse = sin(uTime * 0.8) * 0.15 + 0.85;
                gl_FragColor = vec4(uColor * intensity * pulse, intensity * 0.35);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        depthWrite: false
    });
    
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    sunGroup.add(glowMesh);
    App.objects.sunGlow = glowMesh;
    
    // ─── Point Light (illuminates planets) ───
    const sunLight = new THREE.PointLight(0xFFF5E0, 3, 500, 1.5);
    sunLight.castShadow = false;
    sunGroup.add(sunLight);
    
    // Secondary ambient contribution
    const ambientLight = new THREE.PointLight(0xFFE4B5, 0.8, 200, 2);
    sunGroup.add(ambientLight);
    
    App.scene.add(sunGroup);
}

/**
 * Create all planets with their materials, atmospheres, and special features
 */
async function createPlanets() {
    const planets = CELESTIAL_BODIES.planets;
    
    planets.forEach((config, index) => {
        const planetGroup = buildPlanet(config);
        
        // Store reference with animation data
        App.objects.planets.push({
            group: planetGroup,
            config: config,
            angle: Math.random() * Math.PI * 2, // Random starting angle
            orbitSpeed: (365 / config.orbitalPeriod) * 0.4,
            rotationSpeed: (24 / Math.abs(config.rotationPeriod)) * 0.3,
            rotationDirection: config.rotationPeriod < 0 ? -1 : 1
        });
        
        App.scene.add(planetGroup);
    });
}

/**
 * Build individual planet mesh with all features
 */
function buildPlanet(config) {
    const group = new THREE.Group();
    group.userData = { type: 'planet', data: config };
    
    // Calculate display radius (ensure visibility)
    const displayRadius = Math.max(config.radius * 0.4, 0.5);
    
    // ─── Main Planet Mesh ───
    const geometry = new THREE.SphereGeometry(displayRadius, 64, 64);
    const mat = config.material || {};
    
    const material = new THREE.MeshStandardMaterial({
        color: mat.color || 0xffffff,
        roughness: mat.roughness !== undefined ? mat.roughness : 0.7,
        metalness: mat.metalness !== undefined ? mat.metalness : 0.1,
        emissive: mat.color || 0xffffff,
        emissiveIntensity: 0
    });
    
    const planetMesh = new THREE.Mesh(geometry, material);
    planetMesh.userData.isInteractive = true;
    planetMesh.userData.bodyData = config;
    group.add(planetMesh);
    
    // ─── Atmospheric Glow (if applicable) ───
    if (config.atmosphere) {
        const atmosGeom = new THREE.SphereGeometry(displayRadius * config.atmosphere.size, 48, 48);
        const atmosMat = new THREE.ShaderMaterial({
            uniforms: {
                uColor: { value: new THREE.Color(config.atmosphere.color) },
                uIntensity: { value: config.atmosphere.intensity }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vViewDir;
                
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vec4 worldPos = modelMatrix * vec4(position, 1.0);
                    vViewDir = normalize(cameraPosition - worldPos.xyz);
                    gl_Position = projectionMatrix * viewMatrix * worldPos;
                }
            `,
            fragmentShader: `
                uniform vec3 uColor;
                uniform float uIntensity;
                
                varying vec3 vNormal;
                varying vec3 vViewDir;
                
                void main() {
                    float fresnel = 1.0 - max(dot(vNormal, vViewDir), 0.0);
                    float alpha = pow(fresnel, 3.0) * uIntensity;
                    gl_FragColor = vec4(uColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.FrontSide,
            depthWrite: false
        });
        
        const atmosMesh = new THREE.Mesh(atmosGeom, atmosMat);
        group.add(atmosMesh);
    }
    
    // ─── Saturn/Uranus Rings ───
    if (config.hasRings && config.ringData) {
        const ring = config.ringData;
        const ringGeometry = new THREE.RingGeometry(
            displayRadius * ring.innerRadius,
            displayRadius * ring.outerRadius,
            128,
            1
        );
        
        // Adjust UV mapping for proper texture application later
        const pos = ringGeometry.attributes.position;
        const uv = ringGeometry.attributes.uv;
        const v3 = new THREE.Vector3();
        
        for (let i = 0; i < pos.count; i++) {
            v3.fromBufferAttribute(pos, i);
            const dist = v3.length();
            uv.setXY(i, (dist - displayRadius * ring.innerRadius) / 
                     (displayRadius * (ring.outerRadius - ring.innerRadius)), 0.5);
        }
        
        const ringMaterial = new THREE.MeshStandardMaterial({
            color: ring.color,
            roughness: 0.8,
            metalness: 0.2,
            transparent: true,
            opacity: ring.opacity,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        
        const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
        ringMesh.rotation.x = ring.tilt;
        
        // Uranus has vertical-ish rings
        if (ring.vertical) {
            ringMesh.rotation.z = Math.PI / 2;
        }
        
        group.add(ringMesh);
    }
    
    // ─── Earth's Moon ───
    if (config.hasMoon && config.moonData) {
        const moon = config.moonData;
        const moonGeom = new THREE.SphereGeometry(moon.radius, 32, 32);
        const moonMat = new THREE.MeshStandardMaterial({
            color: moon.color,
            roughness: 0.9,
            metalness: 0.0
        });
        
        const moonMesh = new THREE.Mesh(moonGeom, moonMat);
        moonMesh.userData.isMoon = true;
        
        // Moon orbits around Earth
        const moonPivot = new THREE.Object3D();
        moonPivot.add(moonMesh);
        moonMesh.position.x = moon.distance;
        
        group.add(moonPivot);
        App.objects.moon = { pivot: moonPivot, mesh: moonMesh, config: moon };
    }
    
    return group;
}

/**
 * Create elegant orbital path lines for each planet
 */
async function createOrbitPaths() {
    CELESTIAL_BODIES.planets.forEach((config) => {
        const points = [];
        const segments = 180; // High resolution curves
        
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            points.push(new THREE.Vector3(
                Math.cos(angle) * config.distanceFromSun,
                0,
                Math.sin(angle) * config.distanceFromSun
            ));
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        // Subtle, elegant orbit line
        const material = new THREE.LineBasicMaterial({
            color: config.material?.color || 0xffffff,
            transparent: true,
            opacity: 0.06,
            linewidth: 1
        });
        
        const orbitLine = new THREE.Line(geometry, material);
        
        App.objects.orbits.push({
            line: orbitLine,
            config: config,
            baseOpacity: 0.06
        });
        
        App.scene.add(orbitLine);
    });
}

// ──────────────────────────────────────────────
// EVENT HANDLING & INTERACTION
// ──────────────────────────────────────────────

function setupEventListeners() {
    const canvas = App.renderer.domElement;
    
    // Mouse events
    canvas.addEventListener('mousemove', onMouseMove, { passive: true });
    canvas.addEventListener('click', onClick, { passive: true });
    
    // Touch events
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd, { passive: true });
    
    // Window resize
    window.addEventListener('resize', handleResize, { passive: true });
    
    // UI buttons
    App.dom.closeButton?.addEventListener('click', resetToOverview);
    App.dom.backButton?.addEventListener('click', resetToOverview);
    App.dom.exploreBtn?.addEventListener('click', () => {
        // Could add zoom-in functionality here
        console.log('Explore clicked');
    });
}

function onMouseMove(event) {
    if (App.state.isAnimating || App.state.selectedBody) return;
    
    const rect = App.renderer.domElement.getBoundingClientRect();
    App.mousePos.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    App.mousePos.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    checkHover();
}

function onClick(event) {
    if (App.state.isAnimating) return;
    
    const hit = getIntersectedBody();
    
    if (hit) {
        focusOnBody(hit);
    }
}

function onTouchStart(event) {
    if (event.touches.length === 1) {
        const touch = event.touches[0];
        const rect = App.renderer.domElement.getBoundingClientRect();
        App.mousePos.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        App.mousePos.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
    }
}

function onTouchEnd(event) {
    if (App.state.isAnimating || event.changedTouches.length !== 1) return;
    
    // Distinguish tap from drag
    setTimeout(() => {
        const hit = getIntersectedBody();
        if (hit) focusOnBody(hit);
    }, 150);
}

/**
 * Raycast to find intersected celestial body
 */
function getIntersectedBody() {
    App.raycaster.setFromCamera(App.mousePos, App.camera);
    
    // Collect interactive meshes
    const targets = [];
    
    // Add sun
    if (App.objects.sun) targets.push(App.objects.sun);
    
    // Add planets
    App.objects.planets.forEach(p => {
        p.group.traverse(child => {
            if (child.isMesh && child.userData.isInteractive) {
                targets.push(child);
            }
        });
    });
    
    const intersects = App.raycaster.intersectObjects(targets, false);
    
    if (intersects.length > 0) {
        const obj = intersects[0].object;
        return obj.userData.bodyData || obj.parent?.userData?.data || null;
    }
    
    return null;
}

/**
 * Handle hover state changes
 */
function checkHover() {
    const hit = getIntersectedBody();
    
    // Reset previous hover
    if (App.state.hoveredBody && App.state.hoveredBody !== hit) {
        setHoverEffect(App.state.hoveredBody, false);
    }
    
    // Apply new hover
    if (hit && !App.state.selectedBody) {
        setHoverEffect(hit, true);
        App.renderer.domElement.style.cursor = 'pointer';
    } else {
        App.renderer.domElement.style.cursor = 'grab';
        App.state.hoveredBody = null;
    }
    
    App.state.hoveredBody = hit;
}

/**
 * Apply or remove hover visual effects
 */
function setHoverEffect(bodyData, isHovered) {
    const planetObj = App.objects.planets.find(p => p.config.id === bodyData.id);
    if (!planetObj) return;
    
    const targetScale = isHovered ? 1.12 : 1;
    const targetEmissive = isHovered ? 0.25 : 0;
    
    gsap.to(planetObj.group.scale, {
        x: targetScale,
        y: targetScale,
        z: targetScale,
        duration: 0.4,
        ease: 'power2.out'
    });
    
    // Update emissive on main mesh
    planetObj.group.traverse(child => {
        if (child.isMesh && child.userData.isInteractive && child.material) {
            gsap.to(child.material, {
                emissiveIntensity: targetEmissive,
                duration: 0.3
            });
        }
    });
    
    // Highlight orbit line
    highlightOrbit(bodyData.id, isHovered ? 0.25 : 0.06);
}

/**
 * Highlight/unhighlight an orbit path
 */
function highlightOrbit(planetId, opacity) {
    const orbit = App.objects.orbits.find(o => o.config.id === planetId);
    if (orbit) {
        gsap.to(orbit.line.material, {
            opacity: opacity,
            duration: 0.3
        });
    }
}

// ──────────────────────────────────────────────
// CAMERA ANIMATIONS (GSAP CINEMATIC)
// ──────────────────────────────────────────────

/**
 * Cinematic camera flight to focus on a celestial body
 * Uses GSAP power3.inOut easing for smooth, professional feel
 */
function focusOnBody(bodyData) {
    if (App.state.isAnimating) return;
    if (App.state.selectedBody === bodyData) return;
    
    App.state.isAnimating = true;
    App.state.selectedBody = bodyData;
    
    // Disable controls during animation
    App.controls.enabled = false;
    
    // Calculate target parameters
    let targetPosition, lookAtTarget, distance;
    
    if (bodyData.id === 'sun') {
        // Focus on Sun
        lookAtTarget = new THREE.Vector3(0, 0, 0);
        distance = CELESTIAL_BODIES.sun.radius * 5;
        targetPosition = new THREE.Vector3(distance, distance * 0.6, distance * 0.5);
    } else {
        // Focus on planet
        const planetObj = App.objects.planets.find(p => p.config.id === bodyData.id);
        const pos = planetObj ? planetObj.group.position.clone() : 
                    new THREE.Vector3(bodyData.distanceFromSun, 0, 0);
        
        lookAtTarget = pos;
        distance = Math.max(bodyData.radius * 5, 12);
        
        // Offset camera at an interesting angle
        targetPosition = new THREE.Vector3(
            pos.x + distance,
            bodyData.radius * 3 + 4,
            pos.z + distance * 0.4
        );
    }
    
    // ─── Cinematic Camera Animation ───
    const timeline = gsap.timeline({
        onComplete: () => {
            App.state.isAnimating = false;
            App.controls.target.copy(lookAtTarget);
            App.controls.update();
        }
    });
    
    // Animate camera position
    timeline.to(App.camera.position, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: 2.2,
        ease: 'power3.inOut'
    }, 0);
    
    // Simultaneously animate look direction
    timeline.to({}, {
        duration: 2.2,
        ease: 'power3.inOut',
        onUpdate: function() {
            App.camera.lookAt(lookAtTarget);
        }
    }, 0);
    
    // Show UI overlay
    showOverlay(bodyData);
    
    // Update navigation state
    setActiveNavButton(bodyData.id);
    
    // Highlight orbit
    if (bodyData.id !== 'sun') {
        highlightOrbit(bodyData.id, 0.35);
    }
    
    // Hide hint
    if (App.dom.hint) {
        App.dom.hint.style.opacity = '0';
    }
}

/**
 * Reset camera back to solar system overview
 */
function resetToOverview() {
    if (App.state.isAnimating) return;
    if (!App.state.selectedBody) return;
    
    App.state.isAnimating = true;
    const previousSelection = App.state.selectedBody;
    App.state.selectedBody = null;
    
    App.controls.enabled = false;
    
    // Target overview position
    const targetPos = new THREE.Vector3(0, 45, 90);
    const targetLookAt = new THREE.Vector3(0, 0, 0);
    
    // Animate back
    const timeline = gsap.timeline({
        onComplete: () => {
            App.state.isAnimating = false;
            App.controls.enabled = true;
            App.controls.target.set(0, 0, 0);
            App.controls.update();
        }
    });
    
    timeline.to(App.camera.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 2.5,
        ease: 'power2.inOut'
    }, 0);
    
    timeline.to({}, {
        duration: 2.5,
        ease: 'power2.inOut',
        onUpdate: function() {
            App.camera.lookAt(targetLookAt);
        }
    }, 0);
    
    // Hide overlay
    hideOverlay();
    
    // Reset orbit highlight
    if (previousSelection.id !== 'sun') {
        highlightOrbit(previousSelection.id, 0.06);
    }
    
    // Reset planet scale
    if (previousSelection.id !== 'sun') {
        const planetObj = App.objects.planets.find(p => p.config.id === previousSelection.id);
        if (planetObj) {
            gsap.to(planetObj.group.scale, {
                x: 1, y: 1, z: 1,
                duration: 0.6,
                ease: 'power2.out'
            });
        }
    }
    
    // Clear navigation state
    setActiveNavButton(null);
    
    // Show hint again
    setTimeout(() => {
        if (!App.state.selectedBody && App.dom.hint) {
            App.dom.hint.style.opacity = '1';
        }
    }, 600);
}

// ──────────────────────────────────────────────
// UI MANAGEMENT
// ──────────────────────────────────────────────

/**
 * Build navigation buttons for both desktop and mobile
 */
function buildNavigationUI() {
    const desktopContainer = App.dom.planetNavButtons;
    const mobileContainer = App.dom.mobilePlanetButtons;
    
    CELESTIAL_BODIES.planets.forEach((planet, index) => {
        // Desktop button
        const desktopBtn = createNavButton(planet, 'desktop');
        desktopContainer.appendChild(desktopBtn);
        
        // Mobile button
        const mobileBtn = createNavButton(planet, 'mobile');
        mobileContainer.appendChild(mobileBtn);
        
        // Staggered entrance animation
        gsap.from([desktopBtn, mobileBtn], {
            opacity: 0,
            x: 20,
            duration: 0.4,
            delay: 1.4 + index * 0.06,
            ease: 'power2.out'
        });
    });
}

/**
 * Create individual navigation button element
 */
function createNavButton(data, variant) {
    const btn = document.createElement('button');
    btn.className = variant === 'desktop' 
        ? 'nav-btn group relative w-11 h-11 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] transition-all duration-300'
        : 'nav-btn-mobile shrink-0 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-white/40 hover:text-white hover:bg-white/[0.06] transition-all text-[10px]';
    
    btn.dataset.target = data.id;
    btn.title = data.name;
    
    const dotColor = data.material?.color ? '#' + data.material.color.toString(16).padStart(6, '0') : '#ffffff';
    
    if (variant === 'desktop') {
        btn.innerHTML = `
            <span class="nav-dot w-5 h-5 rounded-full shadow-md transition-transform duration-300" 
                  style="background: ${dotColor}; box-shadow: 0 0 10px ${dotColor}44"></span>
            <span class="nav-tooltip absolute right-full mr-3 px-2.5 py-1.5 rounded-lg bg-black/80 backdrop-blur-sm text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
                ${data.name}
            </span>
        `;
    } else {
        btn.innerHTML = `
            <span class="w-3 h-3 rounded-full" style="background: ${dotColor}"></span>
            <span class="font-medium">${data.name}</span>
        `;
    }
    
    btn.addEventListener('click', () => focusOnBody(data));
    
    return btn;
}

/**
 * Set active state on navigation button
 */
function setActiveNavButton(id) {
    document.querySelectorAll('.nav-btn, .nav-btn-mobile').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.target === id);
    });
}

/**
 * Show the information overlay with beautiful animation
 */
function showOverlay(bodyData) {
    const el = App.dom;
    const isSun = bodyData.id === 'sun';
    const data = isSun ? CELESTIAL_BODIES.sun : bodyData;
    
    // Populate content
    el.overlayTitle.textContent = data.name;
    el.overlaySubtitle.textContent = data.subtitle || '';
    el.overlaySubtitleDetail.textContent = isSun ? 'Star' : `${data.facts?.find(f => f.label === 'Moons')?.value || 'Planet'}`;
    el.overlayDescription.textContent = data.description;
    
    // Accent color
    const accentColor = isSun ? '#FDB813' : (
        data.material?.color ? '#' + data.material.color.toString(16).padStart(6, '0') : '#ffffff'
    );
    
    // Style icon
    el.overlayIcon.style.background = `linear-gradient(135deg, ${accentColor}22, ${accentColor}08)`;
    el.overlayIcon.style.borderColor = `${accentColor}33`;
    el.overlayIconInner.style.background = `radial-gradient(circle at 30% 30%, ${accentColor}, ${adjustColor(accentColor, -30)})`;
    el.overlayIconInner.style.boxShadow = `0 0 20px ${accentColor}66`;
    
    // Accent bar
    el.overlayAccentBar.style.background = `linear-gradient(to right, transparent, ${accentColor}, transparent)`;
    
    // Glow effect
    el.overlayGlow.style.background = accentColor;
    
    // Build facts grid
    el.overlayFacts.innerHTML = '';
    if (data.facts) {
        data.facts.forEach((fact, idx) => {
            const card = document.createElement('div');
            card.className = 'fact-card';
            card.style.transitionDelay = `${idx * 0.06}s`;
            card.innerHTML = `
                <div class="fact-label">${fact.label}</div>
                <div class="fact-value">${fact.value}</div>
            `;
            el.overlayFacts.appendChild(card);
            
            // Trigger animation
            requestAnimationFrame(() => {
                setTimeout(() => card.classList.add('visible'), 50 + idx * 60);
            });
        });
    }
    
    // Show overlay
    el.overlay.classList.add('visible');
}

/**
 * Hide the overlay with animation
 */
function hideOverlay() {
    const el = App.dom;
    el.overlay.classList.remove('visible');
}

/**
 * Adjust hex color brightness helper
 */
function adjustColor(hex, amount) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// ──────────────────────────────────────────────
// RENDER LOOP
// ──────────────────────────────────────────────

/**
 * Start the main animation/render loop
 * Optimized for smooth 60fps performance
 */
function startRenderLoop() {
    
    /**
     * Main frame callback - called every animation frame
     */
    function tick() {
        requestAnimationFrame(tick);
        
        const elapsed = App.clock.getElapsedTime();
        const delta = App.clock.getDelta();
        
        // ─── Update Starfield ───
        if (App.objects.starfield?.material.uniforms) {
            App.objects.starfield.material.uniforms.uTime.value = elapsed;
        }
        
        // Very slow rotation for immersion
        if (App.objects.starfield) {
            App.objects.starfield.rotation.y = elapsed * 0.003;
        }
        
        // ─── Update Sun ───
        if (App.objects.sun) {
            App.objects.sun.rotation.y = elapsed * 0.08;
        }
        
        // Update sun shader uniforms
        [App.objects.sunCorona, App.objects.sunGlow].forEach(mesh => {
            if (mesh?.material.uniforms?.uTime) {
                mesh.material.uniforms.uTime.value = elapsed;
            }
        });
        
        // ─── Update Planets ───
        App.objects.planets.forEach(planet => {
            // Orbital motion
            planet.angle += planet.orbitSpeed * 0.008;
            planet.group.position.x = Math.cos(planet.angle) * planet.config.distanceFromSun;
            planet.group.position.z = Math.sin(planet.angle) * planet.config.distanceFromSun;
            
            // Self-rotation
            const mainMesh = planet.group.children[0];
            if (mainMesh) {
                mainMesh.rotation.y += planet.rotationSpeed * 0.008 * planet.rotationDirection;
            }
            
            // Moon orbit (Earth only currently)
            if (planet.config.hasMoon && App.objects.moon) {
                App.objects.moon.pivot.rotation.y += App.objects.moon.config.orbitSpeed * 0.008;
            }
        });
        
        // ─── Camera follow when focused ───
        if (App.state.selectedBody && !App.state.isAnimating) {
            let targetLookAt;
            
            if (App.state.selectedBody.id === 'sun') {
                targetLookAt = new THREE.Vector3(0, 0, 0);
            } else {
                const planetObj = App.objects.planets.find(
                    p => p.config.id === App.state.selectedBody.id
                );
                if (planetObj) {
                    targetLookAt = planetObj.group.position.clone();
                }
            }
            
            if (targetLookAt) {
                // Smooth lerp controls target
                App.controls.target.lerp(targetLookAt, 0.04);
            }
        }
        
        // ─── Update Controls ───
        App.controls.update();
        
        // ─── Render with Post-Processing ───
        if (App.composer) {
            App.composer.render();
        } else {
            App.renderer.render(App.scene, App.camera);
        }
    }
    
    // Start the loop
    tick();
    
    console.log('🎬 Render loop started (60fps target)');
}

// ──────────────────────────────────────────────
// RESIZE HANDLER
// ──────────────────────────────────────────────

/**
 * Handle window resize events with debouncing
 */
function handleResize() {
    clearTimeout(handleResize._debounce);
    handleResize._debounce = setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Update camera
        App.camera.aspect = width / height;
        App.camera.updateProjectionMatrix();
        
        // Update renderer
        App.renderer.setSize(width, height);
        App.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Update composer
        if (App.composer) {
            App.composer.setSize(width, height);
        }
        
        // Update bloom pass resolution
        if (App.bloomPass) {
            App.bloomPass.resolution.set(width, height);
        }
        
        // Update starfield pixel ratio
        if (App.objects.starfield?.material.uniforms?.uPixelRatio) {
            App.objects.starfield.material.uniforms.uPixelRatio.value = App.renderer.getPixelRatio();
        }
        
    }, 150); // 150ms debounce
}

// ──────────────────────────────────────────────
// UTILITY FUNCTIONS
// ──────────────────────────────────────────────

/**
 * Simple delay utility
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ──────────────────────────────────────────────
// APPLICATION ENTRY POINT
// ──────────────────────────────────────────────

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

// Console branding
console.log(`
%c╔══════════════════════════════════════════════════╗
║                                                  ║
║   🌌  SOLAR SYSTEM EXPLORER v2.0                 ║
║      Premium Edition                              ║
║                                                  ║
║   ─────────────────────────────────              ║
║   ✦ Three.js + Post-Processing                   ║
║   ✦ Unreal Bloom Effects                         ║
║   ✦ Custom GLSL Shaders                          ║
║   ✦ GSAP Cinematic Animations                    ║
║   ✦ Premium Glassmorphism UI                     ║
║   ─────────────────────────────────              ║
║                                                  ║
║   Click any planet to explore!                   ║
╚══════════════════════════════════════════════════╝`, 
'color: #FDB813; font-weight: bold; background: #000; padding: 10px;'
);
