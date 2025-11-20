

class NASAGlobe3D {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.earth = null;
        this.satellites = [];
        this.controls = null;
        this.animationId = null;
        this.isActive = false;

        // Satellite data with real orbital parameters
        this.satelliteData = {
            terra: {
                name: "MODIS Terra",
                altitude: 705, // km
                inclination: 98.2, // degrees
                period: 98.9, // minutes
                color: 0x00d4ff,
                mission: "Morning overpass ~10:30 AM local time. MODIS instrument provides daily global coverage for atmospheric monitoring.",
                instruments: ["MODIS", "ASTER", "CERES", "MISR", "MOPITT"],
                launch_date: "1999-12-18",
                status: "Operational"
            },
            aqua: {
                name: "MODIS Aqua", 
                altitude: 705,
                inclination: 98.2,
                period: 98.9,
                color: 0x4169e1,
                mission: "Afternoon overpass ~1:30 PM local time. Complements Terra for twice-daily global coverage.",
                instruments: ["MODIS", "AIRS", "AMSU-A", "CERES", "AMSR-E"],
                launch_date: "2002-05-04",
                status: "Operational"
            },
            landsat8: {
                name: "Landsat 8",
                altitude: 705,
                inclination: 98.2,
                period: 99,
                color: 0x32cd32,
                mission: "16-day repeat cycle covering all of Earth. Provides detailed land surface imagery.",
                instruments: ["OLI", "TIRS"],
                launch_date: "2013-02-11", 
                status: "Operational"
            },
            landsat9: {
                name: "Landsat 9",
                altitude: 705,
                inclination: 98.2,
                period: 99,
                color: 0x228b22,
                mission: "Continues Landsat program with enhanced sensors. Works with Landsat 8 for 8-day revisit.",
                instruments: ["OLI-2", "TIRS-2"],
                launch_date: "2021-09-27",
                status: "Operational"
            },
            iss: {
                name: "International Space Station",
                altitude: 408,
                inclination: 51.6,
                period: 93,
                color: 0xffd700,
                mission: "Crewed research laboratory with Earth observation capabilities. Multiple daily passes over populated areas.",
                instruments: ["Various research modules", "Earth observation cameras", "Astronaut photography"],
                launch_date: "1998-11-20",
                status: "Operational"
            }
        };

        this.init();
    }

    async init() {
        try {
            // Load Three.js if not already loaded
            if (typeof THREE === 'undefined') {
                await this.loadThreeJS();
            }

            this.createScene();
            this.createEarth();
            this.createSatellites();
            this.createControls();
            this.createUI();

            console.log('🌍 3D NASA Globe initialized successfully');
        } catch (error) {
            console.error('🌍 Globe initialization error:', error);
            this.showFallbackMessage();
        }
    }

    async loadThreeJS() {
        return new Promise((resolve, reject) => {
            // Create script element for Three.js
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            script.onload = () => {
                // Load OrbitControls
                const controlsScript = document.createElement('script');
                controlsScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
                controlsScript.onload = resolve;
                controlsScript.onerror = reject;
                document.head.appendChild(controlsScript);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    createScene() {
        const width = this.container.clientWidth;
        const height = Math.min(500, width * 0.6);

        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000011);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
        this.camera.position.set(0, 0, 3);

        // Renderer setup  
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.container.appendChild(this.renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // Stars background
        this.createStarField();
    }

    createStarField() {
        const starGeometry = new THREE.BufferGeometry();
        const starVertices = [];

        for (let i = 0; i < 10000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starVertices.push(x, y, z);
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 2,
            sizeAttenuation: false
        });

        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
    }

    createEarth() {
        const earthGeometry = new THREE.SphereGeometry(1, 64, 64);

        // Create earth material with day/night textures
        const earthMaterial = new THREE.MeshPhongMaterial({
            map: this.createEarthTexture(),
            bumpMap: this.createBumpTexture(),
            bumpScale: 0.02,
            shininess: 0.1
        });

        this.earth = new THREE.Mesh(earthGeometry, earthMaterial);
        this.earth.castShadow = true;
        this.earth.receiveShadow = true;
        this.scene.add(this.earth);

        // Add atmosphere glow
        this.createAtmosphere();

        // Add India highlight
        this.highlightIndia();
    }

    createEarthTexture() {
        // Create a simple earth texture using canvas
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        // Ocean color
        const gradient = ctx.createLinearGradient(0, 0, 0, 256);
        gradient.addColorStop(0, '#4A90E2');
        gradient.addColorStop(0.3, '#2E5C8A');
        gradient.addColorStop(0.7, '#1A4480');
        gradient.addColorStop(1, '#0D2F5F');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 256);

        // Add continents (simplified)
        ctx.fillStyle = '#2E7D32';

        // North America
        ctx.fillRect(50, 60, 80, 40);
        ctx.fillRect(70, 100, 60, 30);

        // South America  
        ctx.fillRect(90, 140, 40, 80);

        // Europe/Asia
        ctx.fillRect(200, 50, 200, 60);
        ctx.fillRect(220, 110, 150, 40);

        // Africa
        ctx.fillRect(180, 100, 60, 100);

        // Australia
        ctx.fillRect(350, 170, 50, 30);

        // India highlight
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(260, 110, 20, 30);

        return new THREE.CanvasTexture(canvas);
    }

    createBumpTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        // Create height map for continents
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 512, 256);

        ctx.fillStyle = '#808080';
        // Same continent shapes as main texture
        ctx.fillRect(50, 60, 80, 40);
        ctx.fillRect(70, 100, 60, 30);
        ctx.fillRect(90, 140, 40, 80);
        ctx.fillRect(200, 50, 200, 60);
        ctx.fillRect(220, 110, 150, 40);
        ctx.fillRect(180, 100, 60, 100);
        ctx.fillRect(350, 170, 50, 30);
        ctx.fillRect(260, 110, 20, 30);

        return new THREE.CanvasTexture(canvas);
    }

    createAtmosphere() {
        const atmosphereGeometry = new THREE.SphereGeometry(1.02, 64, 64);
        const atmosphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x4A90E2,
            transparent: true,
            opacity: 0.15,
            side: THREE.BackSide
        });

        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        this.scene.add(atmosphere);
    }

    highlightIndia() {
        // Create a subtle highlight over India region
        const indiaGeometry = new THREE.RingGeometry(0.05, 0.08, 8);
        const indiaMaterial = new THREE.MeshBasicMaterial({
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide
        });

        const indiaHighlight = new THREE.Mesh(indiaGeometry, indiaMaterial);

        // Position over India (approximate)
        const phi = (90 - 20) * Math.PI / 180; // 20°N latitude
        const theta = (77 - 180) * Math.PI / 180; // 77°E longitude

        indiaHighlight.position.set(
            Math.sin(phi) * Math.cos(theta) * 1.01,
            Math.cos(phi) * 1.01,
            Math.sin(phi) * Math.sin(theta) * 1.01
        );

        indiaHighlight.lookAt(0, 0, 0);
        this.scene.add(indiaHighlight);
    }

    createSatellites() {
        Object.entries(this.satelliteData).forEach(([key, satData]) => {
            const satellite = this.createSatellite(key, satData);
            this.satellites.push(satellite);
            this.scene.add(satellite.group);
        });
    }

    createSatellite(id, data) {
        const group = new THREE.Group();

        // Satellite body
        const bodyGeometry = new THREE.BoxGeometry(0.02, 0.02, 0.03);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: data.color });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);

        // Solar panels
        const panelGeometry = new THREE.PlaneGeometry(0.04, 0.02);
        const panelMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x1a1a2e,
            transparent: true,
            opacity: 0.8
        });

        const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial);
        leftPanel.position.x = -0.03;
        const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial);
        rightPanel.position.x = 0.03;

        group.add(body);
        group.add(leftPanel);
        group.add(rightPanel);

        // Create orbital path
        const orbitRadius = 1 + (data.altitude / 6371); // Earth radius ~6371km
        const orbitGeometry = new THREE.RingGeometry(orbitRadius - 0.001, orbitRadius + 0.001, 64);
        const orbitMaterial = new THREE.MeshBasicMaterial({
            color: data.color,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });

        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        orbit.rotation.z = data.inclination * Math.PI / 180;

        // Create satellite label
        const labelDiv = document.createElement('div');
        labelDiv.className = 'satellite-label';
        labelDiv.textContent = data.name;
        labelDiv.style.display = 'none';
        document.body.appendChild(labelDiv);

        return {
            id,
            group,
            body,
            orbit,
            data,
            labelDiv,
            angle: Math.random() * Math.PI * 2,
            orbitRadius,
            speed: (2 * Math.PI) / (data.period * 60) // radians per second
        };
    }

    createControls() {
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.maxDistance = 5;
            this.controls.minDistance = 1.5;
        }
    }

    createUI() {
        const ui = document.createElement('div');
        ui.className = 'globe-ui';
        ui.innerHTML = `
            <div class="globe-controls">
                <button class="globe-btn" id="toggle-orbits">🛰️ Toggle Orbits</button>
                <button class="globe-btn" id="toggle-labels">🏷️ Labels</button>
                <button class="globe-btn" id="focus-india">🇮🇳 Focus India</button>
                <button class="globe-btn" id="auto-rotate">🔄 Auto Rotate</button>
            </div>
            <div class="satellite-info" id="satellite-info" style="display: none;">
                <h4 id="sat-name">Satellite Name</h4>
                <p id="sat-mission">Mission details...</p>
                <div class="sat-details">
                    <div><strong>Instruments:</strong> <span id="sat-instruments">-</span></div>
                    <div><strong>Launch Date:</strong> <span id="sat-launch">-</span></div>
                    <div><strong>Altitude:</strong> <span id="sat-altitude">-</span> km</div>
                    <div><strong>Orbit Period:</strong> <span id="sat-period">-</span> min</div>
                    <div><strong>Status:</strong> <span id="sat-status">-</span></div>
                </div>
            </div>
        `;

        this.container.appendChild(ui);
        this.bindUIEvents();
    }

    bindUIEvents() {
        let showOrbits = true;
        let showLabels = false;
        let autoRotate = false;

        document.getElementById('toggle-orbits').onclick = () => {
            showOrbits = !showOrbits;
            this.satellites.forEach(sat => {
                sat.orbit.visible = showOrbits;
                this.scene.add(sat.orbit);
            });
        };

        document.getElementById('toggle-labels').onclick = () => {
            showLabels = !showLabels;
            this.satellites.forEach(sat => {
                sat.labelDiv.style.display = showLabels ? 'block' : 'none';
            });
        };

        document.getElementById('focus-india').onclick = () => {
            if (this.controls) {
                // Focus camera on India region
                this.controls.target.set(0.3, 0.2, 0.3);
                this.camera.position.set(1.5, 1, 2);
                this.controls.update();
            }
        };

        document.getElementById('auto-rotate').onclick = () => {
            autoRotate = !autoRotate;
            if (this.controls) {
                this.controls.autoRotate = autoRotate;
                this.controls.autoRotateSpeed = 0.5;
            }
        };

        // Satellite click detection
        this.renderer.domElement.onclick = (event) => {
            this.handleSatelliteClick(event);
        };

        // Initially show orbits
        this.satellites.forEach(sat => {
            this.scene.add(sat.orbit);
        });
    }

    handleSatelliteClick(event) {
        const mouse = new THREE.Vector2();
        const rect = this.renderer.domElement.getBoundingClientRect();

        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        const satelliteMeshes = this.satellites.map(sat => sat.body);
        const intersects = raycaster.intersectObjects(satelliteMeshes);

        if (intersects.length > 0) {
            const clickedSat = this.satellites.find(sat => sat.body === intersects[0].object);
            if (clickedSat) {
                this.showSatelliteInfo(clickedSat);
            }
        } else {
            this.hideSatelliteInfo();
        }
    }

    showSatelliteInfo(satellite) {
        const info = document.getElementById('satellite-info');
        const data = satellite.data;

        document.getElementById('sat-name').textContent = data.name;
        document.getElementById('sat-mission').textContent = data.mission;
        document.getElementById('sat-instruments').textContent = data.instruments.join(', ');
        document.getElementById('sat-launch').textContent = data.launch_date;
        document.getElementById('sat-altitude').textContent = data.altitude;
        document.getElementById('sat-period').textContent = data.period;
        document.getElementById('sat-status').textContent = data.status;

        info.style.display = 'block';
        info.style.animation = 'slideIn 0.3s ease-out';
    }

    hideSatelliteInfo() {
        const info = document.getElementById('satellite-info');
        info.style.display = 'none';
    }

    updateSatellitePositions() {
        const currentTime = Date.now() * 0.001; // seconds

        this.satellites.forEach(satellite => {
            // Update orbital position
            satellite.angle += satellite.speed * 0.016; // ~60fps

            const x = Math.cos(satellite.angle) * satellite.orbitRadius;
            const z = Math.sin(satellite.angle) * satellite.orbitRadius;
            const y = Math.sin(satellite.angle * 0.1) * 0.1; // Slight vertical variation

            satellite.group.position.set(x, y, z);

            // Update label position
            const screenPosition = this.getScreenPosition(satellite.group.position);
            if (screenPosition) {
                satellite.labelDiv.style.left = screenPosition.x + 'px';
                satellite.labelDiv.style.top = screenPosition.y + 'px';
            }
        });
    }

    getScreenPosition(position) {
        const vector = position.clone();
        vector.project(this.camera);

        const rect = this.renderer.domElement.getBoundingClientRect();
        return {
            x: rect.left + (vector.x + 1) * rect.width / 2,
            y: rect.top + (-vector.y + 1) * rect.height / 2
        };
    }

    animate() {
        if (!this.isActive) return;

        this.animationId = requestAnimationFrame(() => this.animate());

        // Rotate Earth
        if (this.earth) {
            this.earth.rotation.y += 0.001;
        }

        // Update satellite positions
        this.updateSatellitePositions();

        // Update controls
        if (this.controls) {
            this.controls.update();
        }

        // Render scene
        this.renderer.render(this.scene, this.camera);
    }

    start() {
        if (!this.isActive) {
            this.isActive = true;
            this.animate();
            console.log('🌍 3D Globe animation started');
        }
    }

    stop() {
        if (this.isActive) {
            this.isActive = false;
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }
            console.log('🌍 3D Globe animation stopped');
        }
    }

    resize() {
        if (!this.renderer || !this.camera) return;

        const width = this.container.clientWidth;
        const height = Math.min(500, width * 0.6);

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    showFallbackMessage() {
        this.container.innerHTML = `
            <div class="globe-fallback">
                <div class="fallback-content">
                    <h3>🌍 3D NASA Globe</h3>
                    <p>Unable to load 3D visualization. This could be due to:</p>
                    <ul>
                        <li>Limited device capabilities</li>
                        <li>Network connectivity issues</li>
                        <li>Browser compatibility</li>
                    </ul>
                    <p><strong>Satellite Information:</strong></p>
                    <div class="satellite-grid">
                        ${Object.entries(this.satelliteData).map(([key, data]) => `
                            <div class="satellite-card">
                                <h4>${data.name}</h4>
                                <p><strong>Mission:</strong> ${data.mission}</p>
                                <p><strong>Altitude:</strong> ${data.altitude} km</p>
                                <p><strong>Status:</strong> ${data.status}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    destroy() {
        this.stop();

        // Clean up labels
        this.satellites.forEach(sat => {
            if (sat.labelDiv && sat.labelDiv.parentNode) {
                sat.labelDiv.parentNode.removeChild(sat.labelDiv);
            }
        });

        // Clean up Three.js objects
        if (this.renderer) {
            this.renderer.dispose();
        }

        // Clear container
        if (this.container) {
            this.container.innerHTML = '';
        }

        console.log('🌍 3D Globe destroyed');
    }
}

// CSS for 3D Globe
const globeCSS = `
.globe-ui {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    pointer-events: none;
}

.globe-controls {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 10px;
}

.globe-btn {
    background: rgba(0, 212, 255, 0.1);
    border: 1px solid rgba(0, 212, 255, 0.3);
    color: var(--aurora-cyan);
    padding: 8px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    pointer-events: all;
    font-family: 'Orbitron', monospace;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.globe-btn:hover {
    background: rgba(0, 212, 255, 0.2);
    border-color: var(--aurora-cyan);
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
}

.satellite-info {
    background: var(--glass-gradient);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(0, 212, 255, 0.3);
    border-radius: 12px;
    padding: 16px;
    max-width: 300px;
    color: var(--venus-white);
    pointer-events: all;
    font-size: 12px;
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
}

.satellite-info h4 {
    color: var(--aurora-cyan);
    margin: 0 0 8px 0;
    font-family: 'Orbitron', monospace;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.satellite-info p {
    margin: 0 0 12px 0;
    line-height: 1.4;
    color: var(--lunar-silver);
}

.sat-details div {
    margin: 6px 0;
    display: flex;
    justify-content: space-between;
}

.sat-details strong {
    color: var(--aurora-cyan);
    font-family: 'Orbitron', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.satellite-label {
    position: absolute;
    background: rgba(0, 0, 0, 0.8);
    color: var(--aurora-cyan);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 600;
    pointer-events: none;
    z-index: 1000;
    font-family: 'Orbitron', monospace;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.globe-fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    background: var(--glass-gradient);
    border-radius: var(--border-radius-lg);
    border: 1px solid rgba(0, 212, 255, 0.3);
}

.fallback-content {
    text-align: center;
    max-width: 500px;
    padding: 20px;
    color: var(--venus-white);
}

.fallback-content h3 {
    color: var(--aurora-cyan);
    margin-bottom: 16px;
    font-family: 'Orbitron', monospace;
}

.fallback-content ul {
    text-align: left;
    margin: 12px 0;
    color: var(--lunar-silver);
}

.satellite-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
    margin-top: 16px;
}

.satellite-card {
    background: rgba(0, 212, 255, 0.1);
    border: 1px solid rgba(0, 212, 255, 0.3);
    border-radius: 8px;
    padding: 12px;
    text-align: left;
}

.satellite-card h4 {
    color: var(--aurora-cyan);
    margin: 0 0 8px 0;
    font-size: 14px;
    font-family: 'Orbitron', monospace;
}

.satellite-card p {
    margin: 4px 0;
    font-size: 11px;
    color: var(--lunar-silver);
}

@keyframes slideIn {
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@media (max-width: 768px) {
    .globe-controls {
        flex-direction: column;
        align-items: stretch;
    }

    .globe-btn {
        margin: 2px 0;
    }

    .satellite-info {
        font-size: 11px;
        padding: 12px;
        max-width: 250px;
    }

    .satellite-grid {
        grid-template-columns: 1fr;
    }
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = globeCSS;
document.head.appendChild(style);

// Export for global use
if (typeof window !== 'undefined') {
    window.NASAGlobe3D = NASAGlobe3D;
}
