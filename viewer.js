// viewer.js (Version Production)
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

const I18N = {
    fr: {
        loading: "Chargement du modèle...",
        errorPrefix: "Erreur : ",
        missingPaths: "Modèle ou données manquantes.",
        cannotReadJson: "Impossible de lire results.json",
        heightLabel: "Taille",
        changeColorTooltip: "Changer la couleur",
        toggleGroupTooltip: "Afficher / Masquer le groupe",
        toggleSingleTooltip: "Afficher / Masquer la mesure",
        leftShort: "G",
        rightShort: "D",
        leftTitle: "Côté Gauche",
        rightTitle: "Côté Droit",
        originalTag: "Original",
        cloneTag: "Clone symétrique",
        defaultMarkerTooltip: "Valeur par défaut",
        customMarkerTooltip: "Marqueur perso",
        rightClickDelete: "Clic droit pour supprimer"
    },
    en: {
        loading: "Loading model...",
        errorPrefix: "Error: ",
        missingPaths: "Missing model or data.",
        cannotReadJson: "Unable to read results.json",
        heightLabel: "Height",
        changeColorTooltip: "Change color",
        toggleGroupTooltip: "Show / Hide group",
        toggleSingleTooltip: "Show / Hide measurement",
        leftShort: "L",
        rightShort: "R",
        leftTitle: "Left Side",
        rightTitle: "Right Side",
        originalTag: "Original",
        cloneTag: "Symmetric clone",
        defaultMarkerTooltip: "Default value",
        customMarkerTooltip: "Custom marker",
        rightClickDelete: "Right-click to delete"
    }
};

class MeasurementViewer {
    constructor() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Nouvelle logique : on récupère juste le nom du modèle
        const modelName = urlParams.get('model');
        
        if (modelName) {
            this.objPath = `models/${modelName}.obj`;
            this.jsonPath = `measurements/${modelName}.json`;
        } else {
            // Rétrocompatibilité ou sécurité si l'URL utilise encore obj=... et json=...
            this.objPath = urlParams.get('obj');
            this.jsonPath = urlParams.get('json');
        }

        this.lang = urlParams.get('lang') || 'fr';
        this.theme = urlParams.get('theme') || 'dark';

        this.resultsData = null;
        this.activeMeasurements = [];
        this.selectedMeasurement = null;

        this.container = document.getElementById('canvas-container');
        this.canvasHud = document.getElementById('hud-canvas');
        this.ctx = this.canvasHud.getContext('2d');
        this.legendContent = document.getElementById('legend-content');
        
        this.controlsPanel = document.getElementById('controls-panel');
        this.sliderT = document.getElementById('slider-t');
        this.sliderTheta = document.getElementById('slider-theta');
        this.sliderPhi = document.getElementById('slider-phi');

        this.descPanel = document.createElement('div');
        this.descPanel.id = 'description-panel';
        this.descPanel.className = 'hidden';
        this.descPanel.style.position = 'absolute';
        this.descPanel.style.bottom = '20px';
        this.descPanel.style.left = '20px';
        this.descPanel.style.maxWidth = '320px';
        this.descPanel.style.padding = '15px';
        this.descPanel.style.backgroundColor = 'rgba(22, 24, 28, 0.9)';
        this.descPanel.style.border = '1px solid rgba(255, 215, 0, 0.4)';
        this.descPanel.style.borderRadius = '8px';
        this.descPanel.style.color = '#eee';
        this.descPanel.style.fontFamily = 'system-ui, -apple-system, sans-serif';
        this.descPanel.style.zIndex = '100';
        this.descPanel.style.backdropFilter = 'blur(10px)';
        this.descPanel.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
        this.descPanel.style.transition = 'bottom 0.2s ease-out';
        
        this.descPanel.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
                <span style="color: #ffd700; font-weight: bold; border: 2px solid #ffd700; border-radius: 50%; width: 18px; height: 18px; display: inline-flex; justify-content: center; align-items: center; font-size: 12px;">i</span>
                <strong id="desc-panel-title" style="font-size: 14px; color: #ffd700; text-transform: capitalize;"></strong>
            </div>
            <div id="desc-panel-content" style="font-size: 13.5px; line-height: 1.4; color: #ddd;"></div>
        `;
        document.body.appendChild(this.descPanel);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        this.avatarGroup = new THREE.Group();
        this.measurementsGroup = new THREE.Group();
        
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.pointerDownPos = new THREE.Vector2();
    }

    t(key) {
        const dict = I18N[this.lang] || I18N.fr;
        return dict[key] || I18N.fr[key] || key;
    }

    async init() {
        this.applyTheme();
        this.setupScene();
        this.setupLights();
        this.setupControls();
        this.setupEvents();
        this.setupSliderEvents();

        try {
            if (!this.objPath || !this.jsonPath) throw new Error(this.t('missingPaths'));

            await this.loadAvatar(this.objPath);
            await this.loadMeasurements(this.jsonPath);

            const overlay = document.getElementById('loading-overlay');
            if (overlay) {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.style.display = 'none', 500);
            }
            this.animate();
        } catch (error) {
            const errEl = document.getElementById('loading-text');
            if (errEl) errEl.textContent = this.t('errorPrefix') + error.message;
        }
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        setTimeout(() => {
            const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#16181c';
            this.scene.background = new THREE.Color(bgColor);
        }, 50);
    }

    setupScene() {
        this.camera.position.set(0, 1.2, 3.5);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        this.measurementsGroup.rotation.x = -Math.PI / 2;
        this.scene.add(this.avatarGroup);
        this.scene.add(this.measurementsGroup);
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
        dirLight.position.set(2, 3, 2); 
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.9);
        fillLight.position.set(-2, 0, -2);
        this.scene.add(ambientLight, dirLight, fillLight);
    }

    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 1.0, 0); 
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
    }

    setupEvents() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        this.renderer.domElement.addEventListener('pointerdown', (e) => {
            if (e.button !== 0) return;
            this.pointerDownPos.set(e.clientX, e.clientY);
        });

        this.renderer.domElement.addEventListener('pointerup', (e) => {
            if (e.button !== 0) return;
            const distance = this.pointerDownPos.distanceTo(new THREE.Vector2(e.clientX, e.clientY));
            if (distance > 5) return; 

            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            this.raycaster.setFromCamera(this.mouse, this.camera);

            const selectableObjects = [];
            this.activeMeasurements.forEach(m => {
                if (m.isVisible) {
                    selectableObjects.push(m.tube);
                    if (m.iconGroup) {
                        m.iconGroup.children.forEach(sprite => {
                            if (sprite !== m.lengthSprite && sprite.visible) {
                                selectableObjects.push(sprite);
                            }
                        });
                    }
                }
            });

            const intersects = this.raycaster.intersectObjects(selectableObjects, false);

            if (intersects.length > 0) {
                const hitObj = intersects[0].object;
                const matchedItem = this.activeMeasurements.find(m => 
                    m.tube === hitObj || 
                    (m.iconGroup && m.iconGroup.children.includes(hitObj))
                );
                if (matchedItem) this.selectMeasurement(matchedItem);
            } else {
                this.selectMeasurement(null);
            }
        });
    }

    setupSliderEvents() {
        const updateFromSliders = () => {
            if (!this.selectedMeasurement || !this.selectedMeasurement.gridEngine) return;
            
            const t_val = parseFloat(this.sliderT.value);
            const th_val = parseFloat(this.sliderTheta.value);
            const ph_val = parseFloat(this.sliderPhi.value);
            
            const lblTh = document.getElementById('label-val-theta');
            const lblPh = document.getElementById('label-val-phi');
            if (lblTh) lblTh.textContent = `${th_val > 0 ? '+' : ''}${th_val.toFixed(1)}°`;
            if (lblPh) lblPh.textContent = `${ph_val > 0 ? '+' : ''}${ph_val.toFixed(1)}°`;
            
            this.applyInterpolatedMeasurement(this.selectedMeasurement, t_val, th_val, ph_val);
        };

        if(this.sliderT) this.sliderT.addEventListener('input', updateFromSliders);
        if(this.sliderTheta) this.sliderTheta.addEventListener('input', updateFromSliders);
        if(this.sliderPhi) this.sliderPhi.addEventListener('input', updateFromSliders);

        const btnReset = document.getElementById('btn-reset-slider');
        if(btnReset) {
            btnReset.addEventListener('click', () => {
                if (this.selectedMeasurement) this.resetToDefaultGrid(this.selectedMeasurement);
            });
        }
    }

    loadAvatar(path) {
        return new Promise((resolve, reject) => {
            const loader = new OBJLoader();
            const matBody = new THREE.MeshStandardMaterial({ 
                color: 0x6c6c6c, roughness: 0.6, metalness: 0.2, side: THREE.DoubleSide 
            });
            
            loader.load(path, (object) => {
                object.traverse((child) => { if (child.isMesh) child.material = matBody; });
                this.avatarGroup.add(object);
                resolve();
            }, undefined, reject);
        });
    }

    setupHeaderToggles() {
        const header = document.querySelector('.legend-header');
        if (!header) return;
        if (document.getElementById('header-toggles-container')) return;

        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.justifyContent = 'space-between';

        const container = document.createElement('div');
        container.id = 'header-toggles-container';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.gap = '12px';
        container.style.marginLeft = 'auto'; 
        
        header.appendChild(container);

        const sideToggle = document.createElement('div');
        sideToggle.title = 'Filtre Gauche / Droit / Défaut';
        sideToggle.style.cursor = 'pointer';
        sideToggle.style.fontWeight = 'bold';
        sideToggle.style.fontSize = '11px';
        sideToggle.style.background = 'rgba(78, 168, 222, 0.15)';
        sideToggle.style.color = '#4ea8de';
        sideToggle.style.border = '1px solid #4ea8de';
        sideToggle.style.padding = '3px 8px';
        sideToggle.style.borderRadius = '4px';
        sideToggle.style.userSelect = 'none';
        sideToggle.style.transition = 'background 0.2s';
        
        const lblL = this.t('leftShort');
        const lblR = this.t('rightShort');
        const states = [
            { text: `Défaut`, filter: 'DEFAULT' },
            { text: `${lblL} / ${lblR}`, filter: 'ALL' },
            { text: `${lblL} Seul`, filter: 'LEFT' },
            { text: `${lblR} Seul`, filter: 'RIGHT' }
        ];
        let currentState = 0;
        sideToggle.textContent = states[currentState].text;

        sideToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            currentState = (currentState + 1) % states.length;
            sideToggle.textContent = states[currentState].text;
            const filter = states[currentState].filter;

            this.activeMeasurements.forEach(mObj => {
                const side = mObj.rawData.side || 'SINGLE';
                if (side === 'SINGLE') return;

                let shouldBeVisible = false;
                if (filter === 'ALL') shouldBeVisible = true;
                else if (filter === 'LEFT') shouldBeVisible = (side === 'LEFT');
                else if (filter === 'RIGHT') shouldBeVisible = (side === 'RIGHT');
                else if (filter === 'DEFAULT') shouldBeVisible = !mObj.rawData.is_clone;
                
                if (mObj.checkboxEl && mObj.checkboxEl.checked !== shouldBeVisible) {
                    mObj.checkboxEl.checked = shouldBeVisible;
                    mObj.checkboxEl.dispatchEvent(new Event('change'));
                }
            });
        });
        container.appendChild(sideToggle);

        const eyeToggle = document.createElement('div');
        eyeToggle.title = 'Afficher / Masquer tout';
        eyeToggle.style.cursor = 'pointer';
        eyeToggle.innerHTML = '👁️';

        let globalAllVisible = true;
        eyeToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            globalAllVisible = !globalAllVisible;
            eyeToggle.classList.toggle('off', !globalAllVisible);
            
            const legendItems = document.querySelectorAll('#legend-content .legend-item');
            legendItems.forEach(item => {
                if (item._forceVisibility) {
                    item._forceVisibility(globalAllVisible);
                }
            });
        });
        container.appendChild(eyeToggle);
    }

    async loadMeasurements(path) {
        const response = await fetch(path);
        if (!response.ok) throw new Error(this.t('cannotReadJson'));
        const data = await response.json();
        this.resultsData = data;
        
        if (data.height_overridden && data.global_scale) {
            const s = data.global_scale;
            this.avatarGroup.scale.set(s, s, s);
        }

        const groups = new Map();
        for (const [name, measData] of Object.entries(data.measurements_results)) {
            const gKey = measData.pair_group || name;
            if (!groups.has(gKey)) groups.set(gKey, []);
            groups.get(gKey).push({ name, data: measData });
        }

        for (const [groupName, items] of groups.entries()) {
            if (items.length === 1 && (!items[0].data.side || items[0].data.side === "SINGLE")) {
                this.createSingleMeasurementVisual(items[0].name, items[0].data);
            } else {
                this.createPairedMeasurementVisuals(groupName, items);
            }
        }
        this.setupHeaderToggles();
    }

    build3DTubeForMeasurement(name, data) {
        if (!data.path_3d || data.path_3d.length < 2) return null;
        
        const points = data.path_3d.map(p => new THREE.Vector3(p[0], p[1], p[2]));
        
        let hexColor = 0xff3333;
        if (data.type === 'tape') hexColor = 0x00ffcc;
        if (data.type === 'slicer') hexColor = 0xffaa00;
        if (data.type === 'plumb' || data.type === 'caliper') hexColor = 0xcc33ff;
        const cssColor = '#' + hexColor.toString(16).padStart(6, '0');
        
        let isClosed = false;
        if (data.type === 'slicer') isClosed = true;
        if (points.length > 2 && points[0].distanceTo(points[points.length - 1]) < 0.005) {
            isClosed = true;
            points.pop(); 
        }

        const curve = new THREE.CatmullRomCurve3(points, isClosed, 'catmullrom', 0);
        
        let radius = 0.0035;
        let haloRadius = 0.007;
        if (data.type === 'plumb' || data.type === 'caliper') {
            radius = 0.002;
            haloRadius = 0.005;
        }

        const tubeGeo = new THREE.TubeGeometry(curve, points.length * 4, radius, 8, isClosed);
        const haloGeo = new THREE.TubeGeometry(curve, points.length * 4, haloRadius, 8, isClosed);

        const defaultVisible = data.default_visible !== undefined ? data.default_visible : true;

        const materialLine = new THREE.MeshBasicMaterial({ 
            color: hexColor, 
            depthTest: true, 
            polygonOffset: true, 
            polygonOffsetFactor: -4, 
            polygonOffsetUnits: -4, 
            side: THREE.DoubleSide 
        });

        const tubeMesh = new THREE.Mesh(tubeGeo, materialLine);
        tubeMesh.renderOrder = 1;
        tubeMesh.visible = defaultVisible;
        this.measurementsGroup.add(tubeMesh);

        const haloMesh = new THREE.Mesh(haloGeo, new THREE.MeshBasicMaterial({ 
            color: hexColor, transparent: true, opacity: 0.35, depthTest: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide 
        }));
        haloMesh.visible = false;
        haloMesh.renderOrder = 2;
        this.measurementsGroup.add(haloMesh);

        let ghostMin = null;
        let ghostMax = null;

        if (data.path_min && data.path_min.length >= 2) {
            const minPts = data.path_min.map(p => new THREE.Vector3(p[0], p[1], p[2]));
            if (minPts.length > 2 && minPts[0].distanceTo(minPts[minPts.length - 1]) < 0.005) minPts.pop();
            const minCurve = new THREE.CatmullRomCurve3(minPts, isClosed, 'catmullrom', 0);
            const minGeo = new THREE.TubeGeometry(minCurve, minPts.length * 4, 0.0015, 8, isClosed);
            const minMat = new THREE.MeshBasicMaterial({ color: 0x4ea8de, transparent: true, opacity: 0.4, depthTest: true });
            ghostMin = new THREE.Mesh(minGeo, minMat);
            ghostMin.visible = false;
            ghostMin.renderOrder = 1;
            this.measurementsGroup.add(ghostMin);
        }

        if (data.path_max && data.path_max.length >= 2) {
            const maxPts = data.path_max.map(p => new THREE.Vector3(p[0], p[1], p[2]));
            if (maxPts.length > 2 && maxPts[0].distanceTo(maxPts[maxPts.length - 1]) < 0.005) maxPts.pop();
            const maxCurve = new THREE.CatmullRomCurve3(maxPts, isClosed, 'catmullrom', 0);
            const maxGeo = new THREE.TubeGeometry(maxCurve, maxPts.length * 4, 0.0015, 8, isClosed);
            const maxMat = new THREE.MeshBasicMaterial({ color: 0xff4444, transparent: true, opacity: 0.4, depthTest: true });
            ghostMax = new THREE.Mesh(maxGeo, maxMat);
            ghostMax.visible = false;
            ghostMax.renderOrder = 1;
            this.measurementsGroup.add(ghostMax);
        }

        const anchorObj = new THREE.Object3D();
        anchorObj.position.set(...data.label_anchor);

        const iconGroup = new THREE.Group();
        let spriteOffsetX = 0.0;
        iconGroup.position.x += 0.042; 

        if (data.description && data.description.trim() !== "") {
            const infoSprite = this.createIconSprite('info');
            infoSprite.position.set(spriteOffsetX, 0.02, 0);
            iconGroup.add(infoSprite);
            spriteOffsetX += 0.06; 
        }
        
        if (data.ui_grid && data.ui_grid.length > 0) {
            const gridSprite = this.createIconSprite('grid');
            gridSprite.position.set(spriteOffsetX, 0.02, 0);
            iconGroup.add(gridSprite);
            spriteOffsetX += 0.06;
        }
        
        const lengthSprite = this.createIconSprite('text', data.value_cm.toFixed(1) + ' cm');
        lengthSprite.position.set(spriteOffsetX + 0.035, 0.02, 0);
        lengthSprite.visible = false; 
        iconGroup.add(lengthSprite);
        
        iconGroup.visible = defaultVisible;
        anchorObj.add(iconGroup);

        this.measurementsGroup.add(anchorObj);

        return {
            id: name,
            anchor3D: anchorObj,
            iconGroup: iconGroup,
            lengthSprite: lengthSprite,
            color: cssColor,
            tube: tubeMesh,
            halo: haloMesh,
            ghostMin: ghostMin,
            ghostMax: ghostMax,
            isVisible: defaultVisible,
            isSelected: false,
            rawData: data,
            gridEngine: this.buildGridEngine(data)
        };
    }

    createIconSprite(type, text = '') {
        const canvas = document.createElement('canvas');
        canvas.width = type === 'text' ? 256 : 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        if (type === 'info') {
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(64, 64, 58, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.lineWidth = 6;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();

            ctx.fillStyle = '#000000';
            ctx.font = 'bold 70px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('i', 64, 66);
        } else if (type === 'grid') {
            ctx.fillStyle = 'rgba(78, 168, 222, 0.95)';
            ctx.beginPath();
            ctx.rect(14, 14, 100, 50);
            ctx.fill();
            
            ctx.lineWidth = 6;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('EDIT', 64, 40);
        } else if (type === 'text') {
            ctx.fillStyle = 'rgba(22, 24, 28, 0.9)';
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(10, 25, 236, 78, 16);
            } else {
                ctx.rect(10, 25, 236, 78);
            }
            ctx.fill();
            
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#4ea8de';
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 44px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, 128, 64);
        }

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ 
            map: texture, 
            depthTest: false,
            transparent: true,
            opacity: 0.95
        });
        
        const sprite = new THREE.Sprite(material);
        if (type === 'text') {
            sprite.scale.set(0.120, 0.060, 0.060);
        } else {
            sprite.scale.set(0.050, 0.050, 0.050);
        }
        sprite.renderOrder = 1000;
        return sprite;
    }

    createSingleMeasurementVisual(name, data) {
        const mObj = this.build3DTubeForMeasurement(name, data);
        if (!mObj) return;

        const div = document.createElement('div');
        div.className = 'legend-item';
        div.style.position = 'relative'; 
        div.style.borderLeftColor = mObj.color;
        
        const hasGrid = data.ui_grid && data.ui_grid.length > 0;
        const descText = data.description || "";

        div.innerHTML = `
            <div class="color-hint" style="position: absolute; left: -8px; top: 50%; transform: translate(-50%, -50%); width: 14px; height: 14px; background: rgba(0,0,0,0.65); border: 1px solid rgba(255,255,255,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; pointer-events: none; z-index: 2;">
                <span style="font-size: 8px; line-height: 1;">🎨</span>
            </div>
            <input type="color" class="color-picker" value="${mObj.color}" title="${this.t('changeColorTooltip')}" style="position: absolute; left: -16px; top: 0; width: 16px; height: 100%; opacity: 0; cursor: pointer; pointer-events: none; z-index: 3;">
            
            <div class="legend-info" style="width: 100%; display: flex; flex-direction: column;">
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="legend-name" style="white-space: nowrap;">${name.replace(/_/g, ' ')}</span>
                        ${descText ? `<span class="info-icon" style="color: #ffd700; font-weight: bold; border: 1.5px solid #ffd700; border-radius: 50%; width: 14px; height: 14px; display: inline-flex; justify-content: center; align-items: center; font-size: 10px; cursor: help; flex-shrink: 0;" title="Description disponible">i</span>` : ''}
                        ${hasGrid ? `<span title="Mesure ajustable" style="background: rgba(78, 168, 222, 0.15); color: #4ea8de; padding: 2px 5px; border-radius: 3px; font-size: 9px; border: 1px solid #4ea8de; letter-spacing: 0.5px; font-weight: bold; white-space: nowrap; flex-shrink: 0;">🎛️ EDIT</span>` : ''}
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px; margin-left: auto; padding-left: 10px;">
                        <span class="legend-value" style="white-space: nowrap;">${data.value_cm.toFixed(1)} cm</span>
                        <div class="visibility-toggle" title="${this.t('toggleSingleTooltip')}" style="cursor: pointer; flex-shrink: 0;">👁️</div>
                    </div>
                </div>
            </div>
        `;
        this.legendContent.appendChild(div);

        mObj.domElement = div;
        mObj.hudTargetElement = div;
        mObj.valueSpan = div.querySelector('.legend-value');

        const eyeIcon = div.querySelector('.visibility-toggle');
        const colorPicker = div.querySelector('.color-picker');

        div._forceVisibility = (forceState) => {
            if (mObj.isVisible !== forceState) {
                eyeIcon.click(); 
            }
        };

        colorPicker.addEventListener('click', (e) => e.stopPropagation());
        colorPicker.addEventListener('input', (e) => {
            const newColor = e.target.value;
            mObj.color = newColor;
            div.style.borderLeftColor = newColor; 
            mObj.tube.material.color.set(newColor);
            mObj.halo.material.color.set(newColor);
        });

        eyeIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            mObj.isVisible = !mObj.isVisible;
            mObj.tube.visible = mObj.isVisible;
            mObj.halo.visible = (mObj.isVisible && mObj.isSelected);
            if (mObj.iconGroup) mObj.iconGroup.visible = mObj.isVisible;
            if (mObj.ghostMin) mObj.ghostMin.visible = (mObj.isVisible && mObj.isSelected);
            if (mObj.ghostMax) mObj.ghostMax.visible = (mObj.isVisible && mObj.isSelected);
            
            eyeIcon.classList.toggle('off', !mObj.isVisible);
            div.classList.toggle('hidden-item', !mObj.isVisible);
        });

        div.addEventListener('click', () => this.selectMeasurement(mObj));
        this.activeMeasurements.push(mObj);
    }

    createPairedMeasurementVisuals(groupName, items) {
        const builtItems = {};
        items.forEach(entry => {
            const mObj = this.build3DTubeForMeasurement(entry.name, entry.data);
            if (mObj) {
                mObj.isChecked = mObj.isVisible;
                builtItems[entry.data.side || 'LEFT'] = mObj;
            }
        });

        const firstObj = builtItems['LEFT'] || builtItems['RIGHT'];
        if (!firstObj) return;

        let groupMasterVisible = true;

        const div = document.createElement('div');
        div.className = 'legend-item paired-legend-item';
        div.style.position = 'relative';
        div.style.borderLeftColor = firstObj.color;

        const hasGrid = firstObj.rawData.ui_grid && firstObj.rawData.ui_grid.length > 0;
        const descText = firstObj.rawData.description || "";

        div.innerHTML = `
            <div class="color-hint" style="position: absolute; left: -8px; top: 50%; transform: translate(-50%, -50%); width: 14px; height: 14px; background: rgba(0,0,0,0.65); border: 1px solid rgba(255,255,255,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; pointer-events: none; z-index: 2;">
                <span style="font-size: 8px; line-height: 1;">🎨</span>
            </div>
            <input type="color" class="color-picker" value="${firstObj.color}" title="${this.t('changeColorTooltip')}" style="position: absolute; left: -16px; top: 0; width: 16px; height: 100%; opacity: 0; cursor: pointer; pointer-events: none; z-index: 3;">
            
            <div style="width: 100%; display: flex; flex-direction: column; gap: 6px;">
                <div class="paired-header" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="legend-name" style="white-space: nowrap;">${groupName.replace(/_/g, ' ')}</span>
                        ${descText ? `<span class="info-icon" style="color: #ffd700; font-weight: bold; border: 1.5px solid #ffd700; border-radius: 50%; width: 14px; height: 14px; display: inline-flex; justify-content: center; align-items: center; font-size: 10px; cursor: help; flex-shrink: 0;" title="Description disponible">i</span>` : ''}
                        ${hasGrid ? `<span title="Mesure ajustable" style="background: rgba(78, 168, 222, 0.15); color: #4ea8de; padding: 2px 5px; border-radius: 3px; font-size: 9px; border: 1px solid #4ea8de; letter-spacing: 0.5px; font-weight: bold; white-space: nowrap; flex-shrink: 0;">🎛️ EDIT</span>` : ''}
                    </div>
                    <div class="visibility-toggle" title="${this.t('toggleGroupTooltip')}" style="cursor: pointer; margin-left: auto; padding-left: 10px; flex-shrink: 0;">👁️</div>
                </div>
                
                <div class="paired-sides-row"></div>
            </div>
        `;
        this.legendContent.appendChild(div);

        const sidesRow = div.querySelector('.paired-sides-row');
        const colorPicker = div.querySelector('.color-picker');
        const eyeIcon = div.querySelector('.visibility-toggle');

        div._forceVisibility = (forceState) => {
            if (groupMasterVisible !== forceState) {
                eyeIcon.click();
            }
        };

        const syncGroupVisibility = () => {
            const anyChecked = Object.values(builtItems).some(x => x.isChecked);
            const effectiveMaster = groupMasterVisible && anyChecked;

            eyeIcon.classList.toggle('off', !effectiveMaster);
            div.classList.toggle('hidden-item', !effectiveMaster);

            Object.values(builtItems).forEach(mObj => {
                mObj.isVisible = groupMasterVisible && mObj.isChecked;
                mObj.tube.visible = mObj.isVisible;
                mObj.halo.visible = (mObj.isVisible && mObj.isSelected);
                if (mObj.iconGroup) mObj.iconGroup.visible = mObj.isVisible;
                if (mObj.ghostMin) mObj.ghostMin.visible = (mObj.isVisible && mObj.isSelected);
                if (mObj.ghostMax) mObj.ghostMax.visible = (mObj.isVisible && mObj.isSelected);
                
                if (mObj.sidePill) {
                    mObj.sidePill.classList.toggle('side-hidden', !mObj.isChecked);
                }
            });
        };

        colorPicker.addEventListener('click', (e) => e.stopPropagation());
        colorPicker.addEventListener('input', (e) => {
            const newColor = e.target.value;
            div.style.borderLeftColor = newColor;
            Object.values(builtItems).forEach(mObj => {
                mObj.color = newColor;
                mObj.tube.material.color.set(newColor);
                mObj.halo.material.color.set(newColor);
            });
        });

        eyeIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            groupMasterVisible = !groupMasterVisible;
            
            if (groupMasterVisible && !Object.values(builtItems).some(x => x.isChecked)) {
                firstObj.isChecked = true;
                if (firstObj.checkboxEl) firstObj.checkboxEl.checked = true;
            }
            syncGroupVisibility();
        });

        [
            { key: 'LEFT', shortLabel: this.t('leftShort'), title: this.t('leftTitle') },
            { key: 'RIGHT', shortLabel: this.t('rightShort'), title: this.t('rightTitle') }
        ].forEach(sideCfg => {
            const mObj = builtItems[sideCfg.key];
            if (!mObj) return;

            const statusTag = mObj.rawData.is_clone ? this.t('cloneTag') : this.t('originalTag');
            const pill = document.createElement('div');
            pill.className = `side-pill ${!mObj.isChecked ? 'side-hidden' : ''}`;
            pill.title = `${sideCfg.title} (${statusTag})`;
            pill.innerHTML = `
                <label class="side-check-label">
                    <input type="checkbox" ${mObj.isChecked ? 'checked' : ''}>
                    <strong>${sideCfg.shortLabel}</strong>
                </label>
                <span class="side-value">${mObj.rawData.value_cm.toFixed(1)} cm</span>
            `;
            sidesRow.appendChild(pill);

            const checkbox = pill.querySelector('input[type="checkbox"]');
            const labelEl = pill.querySelector('.side-check-label');

            mObj.domElement = div;
            mObj.sidePill = pill;
            mObj.checkboxEl = checkbox;
            mObj.hudTargetElement = pill;
            mObj.valueSpan = pill.querySelector('.side-value');

            labelEl.addEventListener('click', (e) => e.stopPropagation());

            checkbox.addEventListener('change', (e) => {
                mObj.isChecked = e.target.checked;
                if (mObj.isChecked && !groupMasterVisible) {
                    groupMasterVisible = true;
                }
                syncGroupVisibility();
            });

            pill.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!mObj.isChecked || !groupMasterVisible) {
                    mObj.isChecked = true;
                    checkbox.checked = true;
                    groupMasterVisible = true;
                    syncGroupVisibility();
                }
                this.selectMeasurement(mObj);
            });

            this.activeMeasurements.push(mObj);
        });

        div.addEventListener('click', () => {
            const target = Object.values(builtItems).find(x => x.isVisible) || firstObj;
            this.selectMeasurement(target);
        });

        syncGroupVisibility();
    }

    selectMeasurement(targetObj) {
        let toggledOn = false;

        for (const item of this.activeMeasurements) {
            if (item === targetObj) {
                item.isSelected = !item.isSelected;
                toggledOn = item.isSelected;
            } else {
                item.isSelected = false;
            }
        }

        for (const item of this.activeMeasurements) {
            this.applySelectionState(item);
        }

        this.selectedMeasurement = toggledOn ? targetObj : null;

        if (this.descPanel) {
            this.descPanel.style.display = 'none';
            this.descPanel.classList.add('hidden');
        }
        if (this.controlsPanel) {
            this.controlsPanel.classList.add('hidden');
        }

        if (toggledOn && targetObj) {
            let controlsVisible = false;
            
            if (targetObj.gridEngine) {
                this.controlsPanel.classList.remove('hidden');
                this.configureSlidersRange(targetObj);

                const curT = targetObj.currentT !== undefined ? targetObj.currentT : targetObj.rawData.default_t;
                const curTh = targetObj.currentTheta !== undefined ? targetObj.currentTheta : targetObj.rawData.default_theta;
                const curPh = targetObj.currentPhi !== undefined ? targetObj.currentPhi : targetObj.rawData.default_phi;

                if(this.sliderT) this.sliderT.value = curT;
                if(this.sliderTheta) this.sliderTheta.value = curTh;
                if(this.sliderPhi) this.sliderPhi.value = curPh;

                const lblTh = document.getElementById('label-val-theta');
                const lblPh = document.getElementById('label-val-phi');
                if (lblTh) lblTh.textContent = `${curTh > 0 ? '+' : ''}${parseFloat(curTh).toFixed(1)}°`;
                if (lblPh) lblPh.textContent = `${curPh > 0 ? '+' : ''}${parseFloat(curPh).toFixed(1)}°`;
                
                controlsVisible = true;
            }
            
            const descText = targetObj.rawData.description ? targetObj.rawData.description.trim() : "";
            const hasGhosts = targetObj.ghostMin || targetObj.ghostMax;

            if (descText !== "" || hasGhosts) {
                if (this.descPanel) {
                    this.descPanel.style.display = 'block';
                    this.descPanel.classList.remove('hidden');
                    
                    const titleEl = this.descPanel.querySelector('#desc-panel-title');
                    if (titleEl) titleEl.textContent = targetObj.id.replace(/_/g, ' ');
                    
                    const contentEl = this.descPanel.querySelector('#desc-panel-content');
                    if (contentEl) {
                        let htmlContent = "";
                        
                        if (descText !== "") {
                            htmlContent += `<div>${descText}</div>`;
                        }
                        
                        if (hasGhosts) {
                            const marginAndBorder = descText !== "" ? 'margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1);' : '';
                            htmlContent += `<div style="${marginAndBorder} font-size: 12px; color: #ccc; display: flex; flex-direction: column; gap: 8px;">`;
                            
                            if (targetObj.ghostMax && targetObj.rawData.value_max_cm) {
                                htmlContent += `
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <div style="width: 18px; height: 4px; background: rgba(255, 68, 68, 0.8); border-radius: 2px; flex-shrink: 0;"></div>
                                        <span>Maximum : <strong style="color: #fff;">${targetObj.rawData.value_max_cm.toFixed(1)} cm</strong></span>
                                    </div>`;
                            }
                            
                            if (targetObj.ghostMin && targetObj.rawData.value_min_cm) {
                                htmlContent += `
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <div style="width: 18px; height: 4px; background: rgba(78, 168, 222, 0.8); border-radius: 2px; flex-shrink: 0;"></div>
                                        <span>Minimum : <strong style="color: #fff;">${targetObj.rawData.value_min_cm.toFixed(1)} cm</strong></span>
                                    </div>`;
                            }
                            
                            htmlContent += `</div>`;
                        }
                        
                        contentEl.innerHTML = htmlContent;
                    }
                    
                    setTimeout(() => {
                        if (controlsVisible && !this.controlsPanel.classList.contains('hidden')) {
                            const rect = this.controlsPanel.getBoundingClientRect();
                            const offset = window.innerHeight - rect.top + 15; 
                            this.descPanel.style.bottom = `${offset}px`;
                        } else {
                            this.descPanel.style.bottom = '20px';
                        }
                    }, 10);
                }
            }
        }
    }

    applySelectionState(item) {
        const hint = item.domElement.querySelector('.color-hint');
        const picker = item.domElement.querySelector('.color-picker');

        const anySiblingSelected = this.activeMeasurements.some(
            m => m.domElement === item.domElement && m.isSelected
        );

        if (item.sidePill) {
            item.sidePill.classList.toggle('active-edit', item.isSelected);
        }

        if (item.isSelected) {
            item.domElement.classList.add('selected');
            item.tube.material.depthTest = false;
            item.tube.renderOrder = 999;
            if (item.isVisible) item.halo.visible = true;
            if (item.isVisible && item.lengthSprite) item.lengthSprite.visible = true;
            if (item.ghostMin) item.ghostMin.visible = item.isVisible;
            if (item.ghostMax) item.ghostMax.visible = item.isVisible;
            
            if (hint) hint.style.opacity = '1';
            if (picker) picker.style.pointerEvents = 'auto';

        } else {
            if (!anySiblingSelected) {
                item.domElement.classList.remove('selected');
                if (hint) hint.style.opacity = '0';
                if (picker) picker.style.pointerEvents = 'none';
            }
            item.tube.material.depthTest = true;
            item.tube.renderOrder = 1;
            item.halo.visible = false;
            if (item.lengthSprite) item.lengthSprite.visible = false;
            if (item.ghostMin) item.ghostMin.visible = false;
            if (item.ghostMax) item.ghostMax.visible = false;
        }
    }

    buildGridEngine(data) {
        const gridData = data.ui_grid;
        if (!gridData || gridData.length === 0) return null;
        
        const t_set = new Set(), th_set = new Set(), ph_set = new Set();
        const map = new Map();
        
        gridData.forEach(node => {
            t_set.add(node.t);
            th_set.add(node.theta_deg);
            ph_set.add(node.phi_deg);
            map.set(`${node.t}_${node.theta_deg}_${node.phi_deg}`, node);
        });

        const t_arr = Array.from(t_set).sort((a,b)=>a-b);
        const th_arr = Array.from(th_set).sort((a,b)=>a-b);
        const ph_arr = Array.from(ph_set).sort((a,b)=>a-b);

        const minTh = data.theta_limit_deg !== undefined ? -Math.abs(data.theta_limit_deg) : th_arr[0];
        const maxTh = data.theta_limit_deg !== undefined ?  Math.abs(data.theta_limit_deg) : th_arr[th_arr.length-1];
        const minPh = data.phi_limit_deg !== undefined ? -Math.abs(data.phi_limit_deg) : ph_arr[0];
        const maxPh = data.phi_limit_deg !== undefined ?  Math.abs(data.phi_limit_deg) : ph_arr[ph_arr.length-1];

        return {
            map,
            t_arr, th_arr, ph_arr,
            minT: t_arr[0], maxT: t_arr[t_arr.length-1],
            minTh, maxTh,
            minPh, maxPh
        };
    }

    getBounds(val, arr) {
        if (arr.length === 1) return [arr[0], arr[0], 0];
        if (val <= arr[0]) return [arr[0], arr[1], 0];
        if (val >= arr[arr.length-1]) return [arr[arr.length-2], arr[arr.length-1], 1];
        
        for (let i=0; i<arr.length-1; i++) {
            if (val >= arr[i] && val <= arr[i+1]) {
                const ratio = (val - arr[i]) / (arr[i+1] - arr[i]);
                return [arr[i], arr[i+1], ratio];
            }
        }
        return [arr[0], arr[0], 0];
    }

    lerp(a, b, w) { return a + w * (b - a); }

    computeLoopPerimeterCm(points3D) {
        if (!points3D || points3D.length < 3) return 0.0;
        let total = 0.0;
        for (let i = 0; i < points3D.length; i++) {
            const p1 = points3D[i];
            const p2 = points3D[(i + 1) % points3D.length];
            const dx = p2[0] - p1[0];
            const dy = p2[1] - p1[1];
            const dz = p2[2] - p1[2];
            total += Math.sqrt(dx * dx + dy * dy + dz * dz);
        }
        return total * 100.0;
    }

    trilinearInterpolate(eng, t, th, ph) {
        const [t0, t1, rt] = this.getBounds(t, eng.t_arr);
        const [th0, th1, rth] = this.getBounds(th, eng.th_arr);
        const [ph0, ph1, rph] = this.getBounds(ph, eng.ph_arr);
        
        const getVal = (t_v, th_v, ph_v) => {
            const key = `${t_v}_${th_v}_${ph_v}`;
            return eng.map.get(key) || eng.map.values().next().value;
        };

        const c000 = getVal(t0, th0, ph0); const c100 = getVal(t1, th0, ph0);
        const c010 = getVal(t0, th1, ph0); const c110 = getVal(t1, th1, ph0);
        const c001 = getVal(t0, th0, ph1); const c101 = getVal(t1, th0, ph1);
        const c011 = getVal(t0, th1, ph1); const c111 = getVal(t1, th1, ph1);

        const interpolateArray2D = (arrName, index, coord) => {
            const lerpBil = (v00, v10, v01, v11, rx, ry) => this.lerp(this.lerp(v00, v10, rx), this.lerp(v01, v11, rx), ry);
            const bil0 = lerpBil(c000[arrName][index][coord], c100[arrName][index][coord], c010[arrName][index][coord], c110[arrName][index][coord], rt, rth);
            const bil1 = lerpBil(c001[arrName][index][coord], c101[arrName][index][coord], c011[arrName][index][coord], c111[arrName][index][coord], rt, rth);
            return this.lerp(bil0, bil1, rph);
        };

        const numPoints = c000.path_3d.length;
        const newPath = [];
        for (let i = 0; i < numPoints; i++) {
            newPath.push([
                interpolateArray2D('path_3d', i, 0),
                interpolateArray2D('path_3d', i, 1),
                interpolateArray2D('path_3d', i, 2)
            ]);
        }

        return {
            value_cm: this.computeLoopPerimeterCm(newPath),
            path_3d: newPath
        };
    }

    applyInterpolatedMeasurement(item, t, th, ph) {
        if (!item.gridEngine) return;

        item.currentT = t;
        item.currentTheta = th;
        item.currentPhi = ph;

        const result = this.trilinearInterpolate(item.gridEngine, t, th, ph);
        
        item.currentPath3D = result.path_3d;

        if (item.valueSpan) {
            item.valueSpan.textContent = result.value_cm.toFixed(1) + ' cm';
        }

        if (item.lengthSprite) {
            const newSprite = this.createIconSprite('text', result.value_cm.toFixed(1) + ' cm');
            item.lengthSprite.material.map.dispose();
            item.lengthSprite.material.dispose();
            item.lengthSprite.material = newSprite.material;
        }

        const points = result.path_3d.map(p => new THREE.Vector3(p[0], p[1], p[2]));
        const curve = new THREE.CatmullRomCurve3(points, true, 'catmullrom', 0);
        
        const newGeo = new THREE.TubeGeometry(curve, points.length * 4, 0.0035, 8, true);
        const newHalo = new THREE.TubeGeometry(curve, points.length * 4, 0.007, 8, true);
        
        item.tube.geometry.dispose();
        item.halo.geometry.dispose();
        
        item.tube.geometry = newGeo;
        item.halo.geometry = newHalo;

        item.anchor3D.position.copy(points[0]);
    }

    configureSlidersRange(item) {
        const eng = item.gridEngine;
        if (!eng || !this.sliderT) return;

        this.sliderT.min = eng.minT;
        this.sliderT.max = eng.maxT;
        this.sliderT.step = (eng.maxT - eng.minT) / 200 || 0.001;

        this.sliderTheta.min = eng.minTh;
        this.sliderTheta.max = eng.maxTh;
        this.sliderTheta.step = (eng.maxTh - eng.minTh) / 200 || 0.1;

        this.sliderPhi.min = eng.minPh;
        this.sliderPhi.max = eng.maxPh;
        this.sliderPhi.step = (eng.maxPh - eng.minPh) / 200 || 0.1;
    }

    resetToDefaultGrid(item) {
        if (!item.rawData.ui_grid || !item.gridEngine || !this.sliderT) return;
        this.configureSlidersRange(item);

        this.sliderT.value = item.rawData.default_t;
        this.sliderTheta.value = item.rawData.default_theta;
        this.sliderPhi.value = item.rawData.default_phi;

        this.sliderT.dispatchEvent(new Event('input'));
    }

    drawHUD() {
        this.canvasHud.width = window.innerWidth; 
        this.canvasHud.height = window.innerHeight;
        this.ctx.clearRect(0, 0, this.canvasHud.width, this.canvasHud.height);

        for (const item of this.activeMeasurements) {
            if (!item.isVisible) continue;
            
            const worldPos = new THREE.Vector3();
            item.anchor3D.getWorldPosition(worldPos);
            worldPos.project(this.camera);
            if (worldPos.z > 1) continue; 

            const startX = (worldPos.x * 0.5 + 0.5) * this.canvasHud.width;
            const startY = (-worldPos.y * 0.5 + 0.5) * this.canvasHud.height;
            const rect = item.domElement.getBoundingClientRect();
            const targetRect = item.hudTargetElement ? item.hudTargetElement.getBoundingClientRect() : rect;
            const endX = rect.left - 10; 
            const endY = targetRect.top + targetRect.height / 2; 

            this.ctx.beginPath(); 
            this.ctx.moveTo(startX, startY);
            const cpX = startX + Math.abs(endX - startX) * 0.5;
            this.ctx.bezierCurveTo(cpX, startY, cpX, endY, endX, endY);
            
            const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#4ea8de';
            this.ctx.strokeStyle = item.isSelected ? accentColor : item.color;
            this.ctx.lineWidth = item.isSelected ? 2.5 : 1.5;
            this.ctx.globalAlpha = item.isSelected ? 0.9 : 0.4;
            this.ctx.stroke();

            this.ctx.beginPath(); 
            this.ctx.arc(startX, startY, item.isSelected ? 5 : 3.5, 0, 2 * Math.PI);
            this.ctx.fillStyle = item.isSelected ? accentColor : item.color;
            this.ctx.globalAlpha = item.isSelected ? 1.0 : 0.8; 
            this.ctx.fill();

            this.ctx.beginPath(); 
            this.ctx.arc(endX, endY, item.isSelected ? 4 : 3, 0, 2 * Math.PI); 
            this.ctx.fill();
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate()); 
        this.controls.update();
        this.renderer.render(this.scene, this.camera); 
        this.drawHUD(); 
    }
}

const app = new MeasurementViewer();
app.init();