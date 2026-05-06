/**
 * ============================================
 * 3D SOLAR SYSTEM - VANILLA JAVASCRIPT VERSION
 * ============================================
 * 
 * A production-ready, immersive 3D solar system experience
 * Built with Three.js, GSAP, and vanilla JavaScript
 * 
 * Features:
 * - Realistic Sun with emissive glow & corona effects
 * - All 8 planets with accurate relative scales & orbits
 * - Smooth GSAP-powered camera transitions
 * - Interactive planet selection with click/hover
 * - Glassmorphism UI overlays with planet information
 * - Starfield background with thousands of stars
 * - Saturn's ring system
 * - Atmospheric effects on Earth, Venus, Mars
 * - Fully responsive design
 * - Optimized performance with requestAnimationFrame
 * 
 * @author Your Name
 * @version 2.0.0
 * @license MIT
 */

// ============================================
// IMPORTS (ES Modules)
// ============================================
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ============================================
// CONFIGURATION & DATA
// ============================================

/**
 * Comprehensive planet data configuration
 * Contains physical properties, visual settings, and informational facts
 * Scales are artistically adjusted for visualization purposes
 */
const PLANETS_DATA = [
    {
        id: 'mercury',
        name: 'Mercury',
        description: 'The smallest planet and closest to the Sun, Mercury is a rocky world with extreme temperature variations. Its surface is heavily cratered, resembling our Moon.',
        
        // Physical properties (scaled for visualization)
        radius: 0.38,
        distanceFromSun: 10,
        orbitalPeriod: 88,      // Earth days
        rotationPeriod: 1407.6, // Hours
        
        // Visual properties
        color: '#8c7853',
        hasAtmosphere: false,
        
        // Texture URLs (using placeholder colors if unavailable)
        textureMap: null,
        normalMap: null,
        
        moons: 0,
        facts: [
            { label: 'Distance from Sun', value: '57.9 million km' },
            { label: 'Mass', value: '3.30 × 10²³ kg' },
            { label: 'Orbital Period', value: '88 Earth days' },
            { label: 'Surface Temp', value: '-180°C to 430°C' }
        ]
    },
    {
        id: 'venus',
        name: 'Venus',
        description: 'Often called Earth\'s "sister planet" due to similar size, Venus has a thick toxic atmosphere that traps heat, making it the hottest planet in our solar system.',
        
        radius: 0.95,
        distanceFromSun: 15,
        orbitalPeriod: 225,
        rotationPeriod: -5832.5, // Negative = retrograde rotation
        
        color: '#e6c87a',
        hasAtmosphere: true,
        atmosphereColor: '#ffc649',
        
        moons: 0,
        facts: [
            { label: 'Distance from Sun', value: '108.2 million km' },
            { label: 'Mass', value: '4.87 × 10²⁴ kg' },
            { label: 'Orbital Period', value: '225 Earth days' },
            { label: 'Surface Temp', value: '465°C average' }
        ]
    },
    {
        id: 'earth',
        name: 'Earth',
        description: 'Our home planet—the only known world harboring life. Earth\'s liquid water, protective atmosphere, and magnetic field make it uniquely habitable.',
        
        radius: 1,
        distanceFromSun: 20,
        orbitalPeriod: 365.25,
        rotationPeriod: 24,
        
        color: '#4a90d9',
        hasAtmosphere: true,
        atmosphereColor: '#6eb5ff',
        
        moons: 1,
        facts: [
            { label: 'Distance from Sun', value: '149.6 million km' },
            { label: 'Mass', value: '5.97 × 10²⁴ kg' },
            { label: 'Orbital Period', value: '365.25 days' },
            { label: 'Surface Temp', value: '-89°C to 57°C' }
        ]
    },
    {
        id: 'mars',
        name: 'Mars',
        description: 'The Red Planet—Mars captivates us with its rusty hue, towering Olympus Mons volcano, and evidence of ancient water flows. A prime target for exploration.',
        
        radius: 0.53,
        distanceFromSun: 26,
        orbitalPeriod: 687,
        rotationPeriod: 24.6,
        
        color: '#c1440e',
        hasAtmosphere: true,
        atmosphereColor: '#ff9966',
        
        moons: 2,
        facts: [
            { label: 'Distance from Sun', value: '227.9 million km' },
            { label: 'Mass', value: '6.42 × 10²³ kg' },
            { label: 'Orbital Period', value: '687 Earth days' },
            { label: 'Surface Temp', value: '-125°C to 20°C' }
        ]
    },
    {
        id: 'jupiter',
        name: 'Jupiter',
        description: 'The king of planets—a gas giant so massive it could contain all other planets combined. Its Great Red Spot is a storm larger than Earth itself.',
        
        radius: 11.2,
        distanceFromSun: 38,
        orbitalPeriod: 4333,
        rotationPeriod: 9.9,
        
        color: '#d4a574',
        hasAtmosphere: false,
        
        moons: 95,
        facts: [
            { label: 'Distance from Sun', value: '778.5 million km' },
            { label: 'Mass', value: '1.90 × 10²⁷ kg' },
            { label: 'Orbital Period', value: '~11.9 Earth years' },
            { label: 'Notable Feature', value: 'Great Red Spot storm' }
        ]
    },
    {
        id: 'saturn',
        name: 'Saturn',
        description: 'Famous for its stunning ring system made of ice and rock particles, Saturn is a gas giant less dense than water—it would float in a giant cosmic bathtub!',
        
        radius: 9.45,
        distanceFromSun: 52,
        orbitalPeriod: 10759,
        rotationPeriod: 10.7,
        
        color: '#f4d59e',
        hasRings: true,
        hasAtmosphere: false,
        
        moons: 146,
        facts: [
            { label: 'Distance from Sun', value: '1.43 billion km' },
            { label: 'Mass', value: '5.68 × 10²⁶ kg' },
            { label: 'Orbital Period', value: '~29.5 Earth years' },
            { label: 'Ring Span', value: '282,000–482,000 km' }
        ]
    },
    {
        id: 'uranus',
        name: 'Uranus',
        description: 'An ice giant that rotates on its side, likely due to an ancient collision. Its blue-green color comes from methane in its atmosphere absorbing red light.',
        
        radius: 4,
        distanceFromSun: 66,
        orbitalPeriod: 30687,
        rotationPeriod: -17.2, // Retrograde
        
        color: '#72d5e3',
        hasAtmosphere: false,
        
        moons: 28,
        facts: [
            { label: 'Distance from Sun', value: '2.87 billion km' },
            { label: 'Mass', value: '8.68 × 10²⁵ kg' },
            { label: 'Orbital Period', value: '~84 Earth years' },
            { label: 'Axial Tilt', value: '97.77° (sideways)' }
        ]
    },
    {
        id: 'neptune',
        name: 'Neptune',
        description: 'The windiest planet with speeds reaching 2,100 km/h. This deep blue ice giant was discovered through mathematical predictions before being observed.',
        
        radius: 3.88,
        distanceFromSun: 80,
        orbitalPeriod: 60190,
        rotationPeriod: 16.1,
        
        color: '#3d5ef5',
        hasAtmosphere: false,
        
        moons: 16,
        facts: [
            { label: 'Distance from Sun', value: '4.5 billion km' },
            { label: 'Mass', value: '1.02 × 10²⁶ kg' },
            { label: 'Orbital Period', value: '~165 Earth years' },
            { label: 'Wind Speed', value: 'Up to 2,100 km/h' }
        ]
    }
];

/** Sun configuration data */
const SUN_DATA = {
    id: 'sun',
    name: 'Sun',
    description: 'Our star—a massive ball of hot plasma at the center of the solar system. It provides the energy that sustains life on Earth and governs the orbits of all celestial bodies.',
    radius: 5,
    color: '#FDB813',
    emissive: '#FDB813',
    emissiveIntensity: 2,
    moons: null,
    facts: [
        { label: 'Type', value: 'G-type main-sequence star' },
        { label: 'Mass', value: '1.989 × 10³⁰ kg' },
        { label: 'Surface Temp', value: '5,500°C' },
        { label: 'Age', value: '~4.6 billion years' },
        { label: 'Composition', value: '73% Hydrogen, 25% Helium' }
    ]
};

/** Global application state */
const AppState = {
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    clock: new THREE.Clock(),
    
    // Objects
    sun: null,
    sunGlow: null,
    planets: [],
    orbitLines: [],
    starfield: null,
    
    // Interaction state
    selectedPlanet: null,
    hoveredPlanet: null,
    isAnimating: false,
    isLoading: true,
    
    // Raycaster for mouse picking
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),
    
    // DOM element references
    elements: {}
};

// ============================================
// INITIALIZATION
// ============================================

/**
 * Main initialization function
 * Sets up the entire 3D scene, lighting, objects, and event listeners
 */
async function init() {
    try {
        // Cache DOM elements
        cacheDOMElements();
        
        // Update loading progress
        updateLoadingProgress(10, 'Creating scene...');
        
        // Initialize Three.js core components
        setupScene();
        setupCamera();
        setupRenderer();
        setupControls();
        setupLighting();
        
        // Create 3D objects
        updateLoadingProgress(30, 'Generating starfield...');
        createStarfield();
        
        updateLoadingProgress(50, 'Building the Sun...');
        createSun();
        
        updateLoadingProgress(70, 'Forming planets...');
        createPlanets();
        createOrbitLines();
        
        // Setup interactions
        setupEventListeners();
        buildNavigationUI();
        
        // Finalize
        updateLoadingProgress(100, 'Ready!');
        
        // Hide loading screen after brief delay
        setTimeout(() => {
            hideLoadingScreen();
            startAnimationLoop();
        }, 500);
        
        console.log('✅ Solar System initialized successfully');
        
    } catch (error) {
        console.error('❌ Error initializing Solar System:', error);
        updateLoadingProgress(0, 'Error loading. Please refresh.');
    }
}

/**
 * Cache frequently used DOM elements for performance
 */
function cacheDOMElements() {
    AppState.elements = {
        container: document.getElementById('canvas-container'),
        loadingScreen: document.getElementById('loading-screen'),
        progressBar: document.getElementById('progress-bar'),
        loadingText: document.getElementById('loading-text'),
        navigation: document.getElementById('navigation-controls'),
        planetNavButtons: document.getElementById('planet-nav-buttons'),
        overlay: document.getElementById('planet-overlay'),
        overlayTitle: document.getElementById('overlay-title'),
        overlaySubtitle: document.getElementById('overlay-subtitle'),
        overlayDescription: document.getElementById('overlay-description'),
        overlayIcon: document.getElementById('overlay-icon'),
        overlayIconInner: document.getElementById('overlay-icon-inner'),
        overlayFacts: document.getElementById('overlay-facts'),
        closeButton: document.getElementById('close-overlay-btn'),
        backButton: document.getElementById('back-button'),
        instructionsHint: document.getElementById('instructions-hint')
    };
}

/**
 * Setup Three.js Scene
 */
function setupScene() {
    AppState.scene = new THREE.Scene();
    AppState.scene.background = new THREE.Color('#000008');
    AppState.scene.fog = new THREE.FogExp2('#000008', 0.002);
}

/**
 * Setup Perspective Camera
 */
function setupCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    AppState.camera = new THREE.PerspectiveCamera(
        60,           // Field of view
        aspect,       // Aspect ratio
        0.1,          // Near clipping plane
        1000          // Far clipping plane
    );
    
    // Initial overview position
    AppState.camera.position.set(0, 40, 80);
    AppState.camera.lookAt(0, 0, 0);
}

/**
 * Setup WebGL Renderer with optimizations
 */
function setupRenderer() {
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    
    AppState.renderer = renderer;
    AppState.elements.container.appendChild(renderer.domElement);
}

/**
 * Setup Orbit Controls
 */
function setupControls() {
    AppState.controls = new OrbitControls(AppState.camera, AppState.renderer.domElement);
    AppState.controls.enableDamping = true;
    AppState.controls.dampingFactor = 0.05;
    AppState.controls.minDistance = 15;
    AppState.controls.maxDistance = 200;
    AppState.controls.maxPolarAngle = Math.PI / 2 + 0.3;
    AppState.controls.enablePan = true;
    AppState.controls.panSpeed = 0.5;
    AppState.controls.rotateSpeed = 0.5;
    AppState.controls.zoomSpeed = 0.8;
}

/**
 * Setup Lighting (primarily from the Sun)
 */
function setupLighting() {
    // Ambient light (very subtle space ambient)
    const ambientLight = new THREE.AmbientLight(0x222233, 0.05);
    AppState.scene.add(ambientLight);
    
    // Hemisphere light for subtle sky/ground illumination
    const hemiLight = new THREE.HemisphereLight(0x444466, 0x111111, 0.02);
    AppState.scene.add(hemiLight);
}

// ============================================
// OBJECT CREATION FUNCTIONS
// ============================================

/**
 * Create procedural starfield background
 * Uses Points geometry for performance with 15,000+ stars
 */
function createStarfield() {
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 15000;
    
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    
    for (let i = 0; i < starCount; i++) {
        // Random position on sphere surface
        const radius = 300 + Math.random() * 200;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
        
        // Color variation (white to blue-ish)
        const colorChoice = Math.random();
        if (colorChoice > 0.95) {
            // Blue stars
            colors[i * 3] = 0.6 + Math.random() * 0.2;
            colors[i * 3 + 1] = 0.7 + Math.random() * 0.2;
            colors[i * 3 + 2] = 1.0;
        } else if (colorChoice > 0.9) {
            // Yellow/orange stars
            colors[i * 3] = 1.0;
            colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
            colors[i * 3 + 2] = 0.5 + Math.random() * 0.2;
        } else {
            // White stars
            const brightness = 0.8 + Math.random() * 0.2;
            colors[i * 3] = brightness;
            colors[i * 3 + 1] = brightness;
            colors[i * 3 + 2] = brightness;
        }
        
        // Size variation
        sizes[i] = Math.random() * 2 + 0.5;
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Custom shader material for better-looking stars
    const starsMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            pixelRatio: { value: AppState.renderer.getPixelRatio() }
        },
        vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform float pixelRatio;
            
            void main() {
                vColor = color;
                
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                
                // Twinkle effect
                float twinkle = sin(time * 2.0 + position.x * 0.01) * 0.3 + 0.7;
                
                gl_PointSize = size * pixelRatio * twinkle * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            
            void main() {
                // Circular point shape
                vec2 center = gl_PointCoord - 0.5;
                float dist = length(center);
                
                if (dist > 0.5) discard;
                
                // Soft edge falloff
                float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
                
                gl_FragColor = vec4(vColor, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    AppState.starfield = new THREE.Points(starsGeometry, starsMaterial);
    AppState.scene.add(AppState.starfield);
}

/**
 * Create the Sun with emissive glow and corona effects
 */
function createSun() {
    const sunGroup = new THREE.Group();
    sunGroup.userData = { type: 'sun', data: SUN_DATA };
    
    // Main sun sphere
    const sunGeometry = new THREE.SphereGeometry(SUN_DATA.radius, 64, 64);
    const sunMaterial = new THREE.MeshStandardMaterial({
        color: SUN_DATA.color,
        emissive: SUN_DATA.emissive,
        emissiveIntensity: 2,
        roughness: 0.2,
        metalness: 0.1,
        toneMapped: false
    });
    
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunGroup.add(sunMesh);
    AppState.sun = sunMesh;
    
    // Corona/glow effect (custom shader)
    const coronaGeometry = new THREE.SphereGeometry(SUN_DATA.radius * 1.4, 32, 32);
    const coronaMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Color(SUN_DATA.color) }
        },
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            void main() {
                vNormal = normalize(normalMatrix * normal);
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color;
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            void main() {
                // Fresnel effect for corona glow
                float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                
                // Pulsing animation
                float pulse = sin(time * 1.5) * 0.15 + 0.85;
                
                // Add some noise-like variation
                float variation = sin(vPosition.x * 5.0 + time) * cos(vPosition.y * 5.0 + time) * 0.1;
                
                vec3 glow = color * intensity * pulse * (1.0 + variation);
                gl_FragColor = vec4(glow, intensity * 0.6);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        depthWrite: false
    });
    
    const coronaMesh = new THREE.Mesh(coronaGeometry, coronaMaterial);
    sunGroup.add(coronaMesh);
    AppState.sunGlow = coronaMesh;
    
    // Outer glow layer
    const outerGlowGeometry = new THREE.SphereGeometry(SUN_DATA.radius * 1.8, 32, 32);
    const outerGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFA500,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.BackSide
    });
    
    const outerGlowMesh = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
    sunGroup.add(outerGlowMesh);
    
    // Point light emanating from sun
    const sunLight = new THREE.PointLight(0xFFF5E0, 250, 300, 1.5);
    sunLight.castShadow = false;
    sunGroup.add(sunLight);
    
    // Secondary softer light
    const secondaryLight = new THREE.PointLight(0xFFE4B5, 80, 150, 2);
    sunGroup.add(secondaryLight);
    
    AppState.scene.add(sunGroup);
}

/**
 * Create all planets based on PLANETS_DATA configuration
 */
function createPlanets() {
    PLANETS_DATA.forEach((planetData, index) => {
        const planetGroup = createPlanet(planetData, index);
        AppState.planets.push({
            data: planetData,
            mesh: planetGroup,
            angle: Math.random() * Math.PI * 2, // Random starting position
            orbitSpeed: (365 / planetData.orbitalPeriod) * 0.5,
            rotationSpeed: (24 / Math.abs(planetData.rotationPeriod)) * 0.5
        });
        
        AppState.scene.add(planetGroup);
    });
}

/**
 * Create individual planet with optional atmosphere and rings
 * @param {Object} data - Planet configuration data
 * @param {number} index - Index in the planets array
 * @returns {THREE.Group} Planet group containing all meshes
 */
function createPlanet(data, index) {
    const group = new THREE.Group();
    group.userData = { type: 'planet', data: data };
    
    // Calculate display radius (minimum visibility threshold)
    const displayRadius = Math.max(data.radius * 0.35, 0.45);
    
    // Main planet sphere
    const geometry = new THREE.SphereGeometry(displayRadius, 64, 64);
    const material = new THREE.MeshStandardMaterial({
        color: data.color,
        roughness: 0.75,
        metalness: 0.08,
        emissive: data.color,
        emissiveIntensity: 0
    });
    
    const planetMesh = new THREE.Mesh(geometry, material);
    planetMesh.userData.isPlanet = true;
    planetMesh.userData.planetData = data;
    group.add(planetMesh);
    
    // Atmospheric glow effect (for Earth, Venus, Mars)
    if (data.hasAtmosphere && data.atmosphereColor) {
        const atmosphereGeometry = new THREE.SphereGeometry(displayRadius * 1.12, 32, 32);
        const atmosphereMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(data.atmosphereColor) }
            },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                    gl_FragColor = vec4(color, intensity * 0.4);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            depthWrite: false
        });
        
        const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        group.add(atmosphereMesh);
    }
    
    // Saturn's rings
    if (data.hasRings) {
        const innerRadius = displayRadius * 1.4;
        const outerRadius = displayRadius * 2.3;
        const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
        
        // Adjust UVs for proper texture mapping
        const pos = ringGeometry.attributes.position;
        const uv = ringGeometry.attributes.uv;
        const v3 = new THREE.Vector3();
        
        for (let i = 0; i < pos.count; i++) {
            v3.fromBufferAttribute(pos, i);
            const distance = v3.length();
            uv.setXY(i, (distance - innerRadius) / (outerRadius - innerRadius), 0.5);
        }
        
        const ringMaterial = new THREE.MeshStandardMaterial({
            color: 0xC9B896,
            roughness: 0.85,
            metalness: 0.1,
            transparent: true,
            opacity: 0.85,
            side: THREE.DoubleSide
        });
        
        const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
        ringMesh.rotation.x = Math.PI / 2.2; // Tilt the rings
        group.add(ringMesh);
    }
    
    return group;
}

/**
 * Create orbital path lines for each planet
 */
function createOrbitLines() {
    PLANETS_DATA.forEach((planetData) => {
        const points = [];
        const segments = 128;
        
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            points.push(new THREE.Vector3(
                Math.cos(angle) * planetData.distanceFromSun,
                0,
                Math.sin(angle) * planetData.distanceFromSun
            ));
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: planetData.color,
            transparent: true,
            opacity: 0.08
        });
        
        const orbitLine = new THREE.Line(geometry, material);
        AppState.orbitLines.push({ line: orbitLine, data: planetData });
        AppState.scene.add(orbitLine);
    });
}

// ============================================
// EVENT LISTENERS & INTERACTIONS
// ============================================

/**
 * Setup all event listeners for interactivity
 */
function setupEventListeners() {
    const renderer = AppState.renderer;
    const container = AppState.elements.container;
    
    // Mouse move for hover detection
    renderer.domElement.addEventListener('mousemove', onMouseMove, false);
    
    // Click for planet selection
    renderer.domElement.addEventListener('click', onClick, false);
    
    // Touch events for mobile
    renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: false });
    renderer.domElement.addEventListener('touchend', onTouchEnd, false);
    
    // Window resize
    window.addEventListener('resize', handleResize, false);
    
    // UI button events
    AppState.elements.closeButton.addEventListener('click', resetToOverview);
    AppState.elements.backButton.addEventListener('click', resetToOverview);
}

/**
 * Handle mouse movement for hover effects
 * @param {MouseEvent} event - Mouse event object
 */
function onMouseMove(event) {
    if (AppState.isAnimating || AppState.selectedPlanet) return;
    
    // Calculate normalized device coordinates
    const rect = AppState.renderer.domElement.getBoundingClientRect();
    AppState.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    AppState.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Raycast to find hovered planet
    checkPlanetHover();
}

/**
 * Handle click events for planet selection
 * @param {MouseEvent} event - Click event object
 */
function onClick(event) {
    if (AppState.isAnimating) return;
    
    // Check if clicking on a planet
    const intersectedPlanet = getIntersectedPlanet();
    
    if (intersectedPlanet) {
        focusOnPlanet(intersectedPlanet.data);
    } else if (!event.target.closest('#planet-overlay')) {
        // Click on empty space - could optionally deselect here
    }
}

/**
 * Handle touch start for mobile
 * @param {TouchEvent} event - Touch event object
 */
function onTouchStart(event) {
    if (event.touches.length === 1) {
        const touch = event.touches[0];
        const rect = AppState.renderer.domElement.getBoundingClientRect();
        AppState.mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        AppState.mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
    }
}

/**
 * Handle touch end for mobile selection
 * @param {TouchEvent} event - Touch event object
 */
function onTouchEnd(event) {
    if (AppState.isAnimating || event.changedTouches.length !== 1) return;
    
    // Small delay to distinguish tap from drag
    setTimeout(() => {
        const intersectedPlanet = getIntersectedPlanet();
        if (intersectedPlanet) {
            focusOnPlanet(intersectedPlanet.data);
        }
    }, 150);
}

/**
 * Get the planet currently under the cursor/raycaster
 * @returns {Object|null} Planet data or null
 */
function getIntersectedPlanet() {
    AppState.raycaster.setFromCamera(AppState.mouse, AppState.camera);
    
    // Collect all planet meshes
    const planetMeshes = [];
    AppState.planets.forEach(p => {
        p.mesh.traverse(child => {
            if (child.isMesh && child.userData.isPlanet) {
                planetMeshes.push(child);
            }
        });
    });
    
    // Also add sun
    if (AppState.sun) {
        planetMeshes.push(AppState.sun);
    }
    
    const intersects = AppState.raycaster.intersectObjects(planetMeshes, false);
    
    if (intersects.length > 0) {
        const hitObject = intersects[0].object;
        if (hitObject.userData.planetData) {
            return hitObject.userData.planetData;
        } else if (hitObject.parent?.userData?.data) {
            return hitObject.parent.userData.data;
        } else if (hitObject.parent?.parent?.userData?.data) {
            return hitObject.parent.parent.userData.data;
        }
    }
    
    return null;
}

/**
 * Check and apply hover effects on planets
 */
function checkPlanetHover() {
    const intersectedPlanet = getIntersectedPlanet();
    
    // Reset previous hover state
    if (AppState.hoveredPlanet && AppState.hoveredPlanet !== intersectedPlanet) {
        resetPlanetHover(AppState.hoveredPlanet);
    }
    
    // Apply new hover state
    if (intersectedPlanet && !AppState.selectedPlanet) {
        applyPlanetHover(intersectedPlanet);
        AppState.hoveredPlanet = intersectedPlanet;
        AppState.renderer.domElement.style.cursor = 'pointer';
    } else if (!intersectedPlanet) {
        AppState.hoveredPlanet = null;
        AppState.renderer.domElement.style.cursor = 'grab';
    }
}

/**
 * Apply hover visual effects to a planet
 * @param {Object} planetData - Planet configuration data
 */
function applyPlanetHover(planetData) {
    const planetObj = AppState.planets.find(p => p.data.id === planetData.id);
    if (!planetObj) return;
    
    // Scale up slightly
    gsap.to(planetObj.mesh.scale, {
        x: 1.1,
        y: 1.1,
        z: 1.1,
        duration: 0.3,
        ease: 'power2.out'
    });
    
    // Increase emissive intensity
    planetObj.mesh.traverse(child => {
        if (child.isMesh && child.material && child.userData.isPlanet) {
            child.material.emissiveIntensity = 0.3;
        }
    });
    
    // Highlight orbit line
    highlightOrbitLine(planetData.id, true);
}

/**
 * Reset hover visual effects on a planet
 * @param {Object} planetData - Planet configuration data
 */
function resetPlanetHover(planetData) {
    const planetObj = AppState.planets.find(p => p.data.id === planetData.id);
    if (!planetObj) return;
    
    // Reset scale
    gsap.to(planetObj.mesh.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.3,
        ease: 'power2.out'
    });
    
    // Reset emissive
    planetObj.mesh.traverse(child => {
        if (child.isMesh && child.material && child.userData.isPlanet) {
            child.material.emissiveIntensity = 0;
        }
    });
    
    // Unhighlight orbit line
    highlightOrbitLine(planetData.id, false);
}

/**
 * Highlight or unhighlight an orbit line
 * @param {string} planetId - Planet identifier
 * @param {boolean} highlight - Whether to highlight
 */
function highlightOrbitLine(planetId, highlight) {
    const orbitObj = AppState.orbitLines.find(o => o.data.id === planetId);
    if (orbitObj) {
        gsap.to(orbitObj.line.material, {
            opacity: highlight ? 0.35 : 0.08,
            duration: 0.3
        });
    }
}

// ============================================
// CAMERA ANIMATIONS (GSAP)
// ============================================

/**
 * Focus camera on a specific planet with smooth GSAP animation
 * @param {Object} targetData - Target planet or sun data
 */
function focusOnPlanet(targetData) {
    if (AppState.isAnimating) return;
    if (AppState.selectedPlanet === targetData) return;
    
    AppState.isAnimating = true;
    AppState.selectedPlanet = targetData;
    
    // Disable orbit controls during animation
    AppState.controls.enabled = false;
    
    // Calculate target position
    let targetLookAt, distanceMultiplier;
    
    if (targetData.id === 'sun') {
        targetLookAt = new THREE.Vector3(0, 0, 0);
        distanceMultiplier = SUN_DATA.radius * 4;
    } else {
        targetLookAt = new THREE.Vector3(targetData.distanceFromSun, 0, 0);
        distanceMultiplier = Math.max(targetData.radius * 4, 10);
    }
    
    // Position camera at an offset angle
    const currentPos = AppState.camera.position.clone();
    const targetPos = new THREE.Vector3(
        (targetData.distanceFromSun || 0) + distanceMultiplier,
        targetData.radius * 2.5 + 3,
        (targetData.distanceFromSun || 0) + distanceMultiplier * 0.6
    );
    
    // Animate camera position
    gsap.to(AppState.camera.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 2,
        ease: 'power3.inOut',
        onUpdate: () => {
            AppState.camera.lookAt(targetLookAt);
        },
        onComplete: () => {
            AppState.isAnimating = false;
            // Keep looking at target during focused state
            AppState.controls.target.copy(targetLookAt);
            AppState.controls.update();
        }
    });
    
    // Show info overlay
    showPlanetOverlay(targetData);
    
    // Highlight selected planet's orbit
    if (targetData.id !== 'sun') {
        highlightOrbitLine(targetData.id, true);
    }
    
    // Update navigation UI
    updateNavigationActiveState(targetData.id);
}

/**
 * Reset camera back to solar system overview
 */
function resetToOverview() {
    if (AppState.isAnimating) return;
    if (!AppState.selectedPlanet) return;
    
    AppState.isAnimating = true;
    
    // Store reference to previously selected planet
    const previousSelection = AppState.selectedPlanet;
    AppState.selectedPlanet = null;
    
    // Disable controls during animation
    AppState.controls.enabled = false;
    
    // Target overview position
    const targetPos = new THREE.Vector3(0, 40, 80);
    const targetLookAt = new THREE.Vector3(0, 0, 0);
    
    // Animate camera back
    gsap.to(AppState.camera.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 2.5,
        ease: 'power2.inOut',
        onUpdate: () => {
            AppState.camera.lookAt(targetLookAt);
        },
        onComplete: () => {
            AppState.isAnimating = false;
            AppState.controls.enabled = true;
            AppState.controls.target.set(0, 0, 0);
            AppState.controls.update();
        }
    });
    
    // Hide overlay
    hidePlanetOverlay();
    
    // Reset orbit line highlight
    if (previousSelection.id !== 'sun') {
        highlightOrbitLine(previousSelection.id, false);
    }
    
    // Reset planet scale if it was selected
    if (previousSelection.id !== 'sun') {
        const planetObj = AppState.planets.find(p => p.data.id === previousSelection.id);
        if (planetObj) {
            gsap.to(planetObj.mesh.scale, {
                x: 1, y: 1, z: 1,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    }
    
    // Update navigation UI
    updateNavigationActiveState(null);
}

// ============================================
// UI MANAGEMENT
// ============================================

/**
 * Build navigation buttons dynamically from planet data
 */
function buildNavigationUI() {
    const container = AppState.elements.planetNavButtons;
    
    PLANETS_DATA.forEach((planet, index) => {
        const button = document.createElement('button');
        button.className = 'nav-btn group relative flex items-center gap-2 px-3 py-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-95';
        button.dataset.target = planet.id;
        button.innerHTML = `
            <span class="w-3 h-3 rounded-full shrink-0 nav-dot" style="background-color: ${planet.color}"></span>
            <span class="hidden sm:inline text-xs font-medium whitespace-nowrap">${planet.name}</span>
        `;
        
        button.addEventListener('click', () => {
            focusOnPlanet(planet);
        });
        
        container.appendChild(button);
        
        // Staggered animation delay
        gsap.from(button, {
            opacity: 0,
            y: -10,
            duration: 0.3,
            delay: 1.2 + index * 0.05,
            ease: 'power2.out'
        });
    });
}

/**
 * Update which navigation button appears active
 * @param {string|null} activeId - ID of active planet/sun, or null
 */
function updateNavigationActiveState(activeId) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.target === activeId);
    });
}

/**
 * Show the planet information overlay
 * @param {Object} data - Planet or sun data to display
 */
function showPlanetOverlay(data) {
    const el = AppState.elements;
    const isSun = data.id === 'sun';
    
    // Set content
    el.overlayTitle.textContent = data.name;
    el.overlayDescription.textContent = data.description;
    
    // Subtitle (moons count or type)
    if (isSun) {
        el.overlaySubtitle.textContent = 'G-type Main Sequence Star';
    } else {
        el.overlaySubtitle.textContent = data.moons > 0 
            ? `${data.moons} Moon${data.moons > 1 ? 's' : ''}` 
            : 'No natural satellites';
    }
    
    // Icon styling
    const iconColor = data.color || SUN_DATA.color;
    el.overlayIcon.style.backgroundColor = `${iconColor}22`;
    el.overlayIcon.style.boxShadow = `0 0 30px ${iconColor}44`;
    el.overlayIconInner.style.backgroundColor = iconColor;
    
    // Build facts grid
    el.overlayFacts.innerHTML = '';
    data.facts.forEach((fact, index) => {
        const factCard = document.createElement('div');
        factCard.className = 'fact-card bg-white/5 rounded-lg p-3 border border-white/10';
        factCard.style.animationDelay = `${index * 0.08}s`;
        factCard.innerHTML = `
            <p class="text-white/50 text-xs uppercase tracking-wider mb-1">${fact.label}</p>
            <p class="text-white font-semibold text-sm">${fact.value}</p>
        `;
        el.overlayFacts.appendChild(factCard);
    });
    
    // Show overlay with animation
    el.overlay.classList.add('visible');
    
    // Hide instructions hint
    el.instructionsHint.style.opacity = '0';
}

/**
 * Hide the planet information overlay
 */
function hidePlanetOverlay() {
    AppState.elements.overlay.classList.remove('visible');
    
    // Show instructions hint again after delay
    setTimeout(() => {
        if (!AppState.selectedPlanet) {
            AppState.elements.instructionsHint.style.opacity = '1';
        }
    }, 500);
}

// ============================================
// LOADING SCREEN MANAGEMENT
// ============================================

/**
 * Update loading progress bar and text
 * @param {number} progress - Progress percentage (0-100)
 * @param {string} text - Status message to display
 */
function updateLoadingProgress(progress, text) {
    AppState.elements.progressBar.style.width = `${progress}%`;
    AppState.elements.loadingText.textContent = text;
}

/**
 * Hide the loading screen with fade out animation
 */
function hideLoadingScreen() {
    AppState.isLoading = false;
    
    // Fade out loading screen
    AppState.elements.loadingScreen.style.opacity = '0';
    
    setTimeout(() => {
        AppState.elements.loadingScreen.style.display = 'none';
        
        // Show other UI elements
        AppState.elements.navigation.style.opacity = '1';
        AppState.elements.instructionsHint.style.opacity = '1';
    }, 500);
}

// ============================================
// ANIMATION LOOP
// ============================================

/**
 * Start the main render loop using requestAnimationFrame
 * Optimized for smooth 60fps performance
 */
function startAnimationLoop() {
    /**
     * Main animation frame callback
     * Called recursively via requestAnimationFrame
     */
    function animate() {
        requestAnimationFrame(animate);
        
        const elapsedTime = AppState.clock.getElapsedTime();
        const delta = AppState.clock.getDelta();
        
        // Update starfield shader time uniform (for twinkling)
        if (AppState.starfield && AppState.starfield.material.uniforms) {
            AppState.starfield.material.uniforms.time.value = elapsedTime;
        }
        
        // Slowly rotate starfield for immersion
        if (AppState.starfield) {
            AppState.starfield.rotation.y = elapsedTime * 0.005;
        }
        
        // Animate Sun
        if (AppState.sun) {
            AppState.sun.rotation.y = elapsedTime * 0.05;
        }
        
        // Update Sun corona shader
        if (AppState.sunGlow && AppState.sunGlow.material.uniforms) {
            AppState.sunGlow.material.uniforms.time.value = elapsedTime;
        }
        
        // Animate Planets (orbit and rotation)
        AppState.planets.forEach(planet => {
            // Orbital motion around the sun
            planet.angle += planet.orbitSpeed * 0.01;
            planet.mesh.position.x = Math.cos(planet.angle) * planet.data.distanceFromSun;
            planet.mesh.position.z = Math.sin(planet.angle) * planet.data.distanceFromSun;
            
            // Self-rotation
            const direction = planet.data.rotationPeriod < 0 ? -1 : 1;
            planet.mesh.children[0].rotation.y += planet.rotationSpeed * 0.01 * direction;
        });
        
        // If focused on a planet, keep camera looking at it
        if (AppState.selectedPlanet && !AppState.isAnimating) {
            let lookTarget;
            if (AppState.selectedPlanet.id === 'sun') {
                lookTarget = new THREE.Vector3(0, 0, 0);
            } else {
                const planetObj = AppState.planets.find(p => p.data.id === AppState.selectedPlanet.id);
                if (planetObj) {
                    lookTarget = planetObj.mesh.position.clone();
                }
            }
            
            if (lookTarget) {
                AppState.controls.target.lerp(lookTarget, 0.05);
            }
        }
        
        // Update OrbitControls (for damping)
        AppState.controls.update();
        
        // Render the scene
        AppState.renderer.render(AppState.scene, AppState.camera);
    }
    
    // Start the loop
    animate();
    
    console.log('🎬 Animation loop started');
}

// ============================================
// RESIZE HANDLING
// ============================================

/**
 * Handle browser window resize events
 * Updates camera aspect ratio and renderer size
 * Debounced for performance
 */
function handleResize() {
    // Debounce resize handling
    clearTimeout(handleResize.timeoutId);
    handleResize.timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Update camera
        AppState.camera.aspect = width / height;
        AppState.camera.updateProjectionMatrix();
        
        // Update renderer
        AppState.renderer.setSize(width, height);
        AppState.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Update starfield shader if exists
        if (AppState.starfield && AppState.starfield.material.uniforms) {
            AppState.starfield.material.uniforms.pixelRatio.value = AppState.renderer.getPixelRatio();
        }
        
    }, 100); // 100ms debounce
}

// ============================================
// APPLICATION ENTRY POINT
// ============================================

/**
 * Initialize the application when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Log startup info
console.log(`
╔══════════════════════════════════════════╗
║                                          ║
║   🌌 3D SOLAR SYSTEM EXPLORER            ║
║   Vanilla JS Edition                     ║
║                                          ║
║   Powered by:                            ║
║   • Three.js (3D Rendering)              ║
║   • GSAP (Animations)                    ║
║   • Tailwind CSS (Styling)               ║
║                                          ║
║   Click on planets to explore!           ║
╚══════════════════════════════════════════╝
`);
