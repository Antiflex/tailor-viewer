import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

const I18N = {
    en: {
        loading: "Loading 3D model...",
        errorPrefix: "Error: ",
        missingPaths: "Missing model or data.",
        cannotReadJson: "Cannot read results.json",
        modelNotFound: "Model not found. Loading default model...",
        criticalError: "Critical error: Default model not found.",
        measurementsTitle: "Measurements",
        adjustTitle: "Tailor Adjustment",
        highWaist: "High",
        lowWaist: "Low",
        tiltFB: "Front/Back Tilt",
        tiltLR: "Left/Right Tilt",
        resetBtn: "Reset",
        resetTooltip: "Reset all sliders to default",
        changeColorTooltip: "Change color",
        toggleGroupTooltip: "Show / Hide group",
        toggleSingleTooltip: "Show / Hide measurement",
        toggleAllTooltip: "Show / Hide all",
        filterTooltip: "Filter Left / Right / Default",
        defaultFilter: "Default",
        filterAll: "L / R",
        leftOnly: "L",
        rightOnly: "R",
        leftShort: "L",
        rightShort: "R",
        leftTitle: "Left Side",
        rightTitle: "Right Side",
        originalTag: "Original",
        cloneTag: "Symmetric clone",
        defaultMarkerTooltip: "Click to reset this slider",
        customMarkerTooltip: "Custom marker (click to apply)",
        fullscreenTooltip: "Toggle Fullscreen (F11 / Esc)",
        langTooltip: "Switch Language",
        infoAvailable: "Description available",
        editableMeas: "Adjustable measurement",
        helpTitle: "Viewer Controls",
        helpOrbit: "Left click & drag: Orbit view",
        helpPan: "Right click & drag: Pan view",
        helpSelect: "Click on legend: Select measurement",
        helpInfo: "Additional description available",
        helpEdit: "Measurement adjustable via sliders",
        valMax: "Maximum :",
        valMin: "Minimum :"
    },
    fr: {
        loading: "Chargement du mod\u00e8le...",
        errorPrefix: "Erreur : ",
        missingPaths: "Mod\u00e8le ou donn\u00e9es manquantes.",
        cannotReadJson: "Impossible de lire results.json",
        modelNotFound: "Mod\u00e8le introuvable. Chargement du mod\u00e8le par d\u00e9faut...",
        criticalError: "Erreur critique : Mod\u00e8le par d\u00e9faut introuvable.",
        measurementsTitle: "Mensurations",
        adjustTitle: "Ajustement Tailleur",
        highWaist: "Taille haute",
        lowWaist: "Taille basse",
        tiltFB: "Inclinaison AV/AR",
        tiltLR: "Inclinaison G/D",
        resetBtn: "Reset",
        resetTooltip: "Revenir aux valeurs par d\u00e9faut",
        changeColorTooltip: "Changer la couleur",
        toggleGroupTooltip: "Afficher / Masquer le groupe",
        toggleSingleTooltip: "Afficher / Masquer la mesure",
        toggleAllTooltip: "Afficher / Masquer tout",
        filterTooltip: "Filtre Gauche / Droit / D\u00e9faut",
        defaultFilter: "D\u00e9faut",
        filterAll: "G / D",
        leftOnly: "G",
        rightOnly: "D",
        leftShort: "G",
        rightShort: "D",
        leftTitle: "C\u00f4t\u00e9 Gauche",
        rightTitle: "C\u00f4t\u00e9 Droit",
        originalTag: "Original",
        cloneTag: "Clone sym\u00e9trique",
        defaultMarkerTooltip: "Cliquer pour r\u00e9initialiser",
        customMarkerTooltip: "Marqueur perso (cliquer pour appliquer)",
        fullscreenTooltip: "Plein \u00e9cran (F11 / \u00c9chap)",
        langTooltip: "Changer de langue",
        infoAvailable: "Description disponible",
        editableMeas: "Mesure ajustable",
        helpTitle: "Contr\u00f4les du Viewer",
        helpOrbit: "Clic gauche enfonc\u00e9 : Tourner la vue",
        helpPan: "Clic droit enfonc\u00e9 : D\u00e9placer la vue (Pan)",
        helpSelect: "Clic sur l\u00e9gende : S\u00e9lectionner la mesure",
        helpInfo: "Information additionnelle disponible",
        helpEdit: "Mesure ajustable via les curseurs",
        valMax: "Maximum :",
        valMin: "Minimum :"
    },
    es: {
        loading: "Cargando modelo...",
        errorPrefix: "Error: ",
        missingPaths: "Falta modelo o datos.",
        cannotReadJson: "No se puede leer results.json",
        modelNotFound: "Modelo no encontrado. Cargando predeterminado...",
        criticalError: "Error cr\u00edtico: Modelo predeterminado no encontrado.",
        measurementsTitle: "Medidas",
        adjustTitle: "Ajuste de Sastre",
        highWaist: "Cintura alta",
        lowWaist: "Cintura baja",
        tiltFB: "Inclinaci\u00f3n Ade/Atr",
        tiltLR: "Inclinaci\u00f3n Izq/Der",
        resetBtn: "Reset",
        resetTooltip: "Restablecer los valores",
        changeColorTooltip: "Cambiar color",
        toggleGroupTooltip: "Mostrar / Ocultar grupo",
        toggleSingleTooltip: "Mostrar / Ocultar medida",
        toggleAllTooltip: "Mostrar / Ocultar todo",
        filterTooltip: "Filtro Izquierdo / Derecho / Defecto",
        defaultFilter: "Defecto",
        filterAll: "I / D",
        leftOnly: "I",
        rightOnly: "D",
        leftShort: "I",
        rightShort: "D",
        leftTitle: "Lado Izquierdo",
        rightTitle: "Lado Derecho",
        originalTag: "Original",
        cloneTag: "Clon sim\u00e9trico",
        defaultMarkerTooltip: "Haga clic para restablecer",
        customMarkerTooltip: "Marcador (clic para aplicar)",
        fullscreenTooltip: "Pantalla completa (F11 / Esc)",
        langTooltip: "Cambiar idioma",
        infoAvailable: "Descripci\u00f3n disponible",
        editableMeas: "Medida ajustable",
        helpTitle: "Controles del Visor",
        helpOrbit: "Clic izquierdo presionado: Girar vista",
        helpPan: "Clic derecho presionado: Mover vista",
        helpSelect: "Clic en leyenda: Seleccionar medida",
        helpInfo: "Informaci\u00f3n adicional disponible",
        helpEdit: "Medida ajustable mediante controles deslizantes",
        valMax: "M\u00e1ximo :",
        valMin: "M\u00ednimo :"
    },
    de: {
        loading: "Modell wird geladen...",
        errorPrefix: "Fehler: ",
        missingPaths: "Fehlendes Modell oder Daten.",
        cannotReadJson: "results.json kann nicht gelesen werden",
        modelNotFound: "Modell nicht gefunden. Standardmodell wird geladen...",
        criticalError: "Kritischer Fehler: Standardmodell nicht gefunden.",
        measurementsTitle: "Messungen",
        adjustTitle: "Schneideranpassung",
        highWaist: "Hohe Taille",
        lowWaist: "Tiefe Taille",
        tiltFB: "Neigung Vor/Zur\u00fcck",
        tiltLR: "Neigung Links/Rechts",
        resetBtn: "Reset",
        resetTooltip: "Werte zur\u00fccksetzen",
        changeColorTooltip: "Farbe \u00e4ndern",
        toggleGroupTooltip: "Gruppe umschalten",
        toggleSingleTooltip: "Messung umschalten",
        toggleAllTooltip: "Alle umschalten",
        filterTooltip: "Filter Links / Rechts / Standard",
        defaultFilter: "Standard",
        filterAll: "L / R",
        leftOnly: "L",
        rightOnly: "R",
        leftShort: "L",
        rightShort: "R",
        leftTitle: "Linke Seite",
        rightTitle: "Rechte Seite",
        originalTag: "Original",
        cloneTag: "Symmetrischer Klon",
        defaultMarkerTooltip: "Klicken, um zur\u00fcckzusetzen",
        customMarkerTooltip: "Eigener Marker (klicken zum Anwenden)",
        fullscreenTooltip: "Vollbild (F11 / Esc)",
        langTooltip: "Sprache \u00e4ndern",
        infoAvailable: "Beschreibung verf\u00fcgbar",
        editableMeas: "Anpassbare Messung",
        helpTitle: "Ansichtssteuerung",
        helpOrbit: "Linksklick halten: Ansicht drehen",
        helpPan: "Rechtsklick halten: Ansicht verschieben",
        helpSelect: "Klick auf Legende: Messung ausw\u00e4hlen",
        helpInfo: "Zus\u00e4tzliche Beschreibung verf\u00fcgbar",
        helpEdit: "Messung \u00fcber Schieberegler anpassbar",
        valMax: "Maximum :",
        valMin: "Minimum :"
    }
};

const SVG_EYE_OPEN = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
const SVG_EYE_CLOSED = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
const SVG_FULLSCREEN_ENTER = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>`;
const SVG_FULLSCREEN_EXIT = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>`;

class MeasurementViewer {
    constructor() {
        const urlParams = new URLSearchParams(window.location.search);
        
        const modelName = urlParams.get('model');
        if (modelName) {
            this.currentModelName = modelName;
            this.objPath = `models/${modelName}.obj`;
            this.jsonPath = `measurements/${modelName}.json`;
        } else {
            this.objPath = urlParams.get('obj');
            this.jsonPath = urlParams.get('json');
            this.currentModelName = this.objPath || '';
        }

        this.availableLangs = Object.keys(I18N);
        const reqLang = urlParams.get('lang') || 'en';
        this.lang = this.availableLangs.includes(reqLang) ? reqLang : 'en';
        this.theme = urlParams.get('theme') || 'dark';

        this.resultsData = null;
        this.templateMap = new Map();
        this.activeMeasurements = [];
        this.selectedMeasurement = null;
        this.hoveredSprite = null;

        this.container = document.getElementById('canvas-container');
        this.canvasHud = document.getElementById('hud-canvas');
        this.ctx = this.canvasHud.getContext('2d');
        this.legendContent = document.getElementById('legend-content');
        
        this.controlsPanel = document.getElementById('controls-panel');
        this.sliderT = document.getElementById('slider-t');
        this.sliderTheta = document.getElementById('slider-theta');
        this.sliderPhi = document.getElementById('slider-phi');

        this.setupTopLeftUI();
        this.setupMergedBottomLeftPanel();

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        
        this.avatarGroup = new THREE.Group();
        this.measurementsGroup = new THREE.Group();
        
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.pointerDownPos = new THREE.Vector2();
    }

    t(key) {
        const dict = I18N[this.lang] || I18N.en;
        return dict[key] || I18N.en[key] || key;
    }

    setupTopLeftUI() {
        this.langBtn = document.getElementById('btn-lang-switch');
        this.fullscreenBtn = document.getElementById('btn-fullscreen-toggle');
        this.identityBadge = document.getElementById('model-identity-badge');

        this.updateLangButtonLabel();
        this.updateModelIdentityDisplay(this.currentModelName);

        if (this.langBtn) {
            this.langBtn.addEventListener('click', () => {
                const currentIndex = this.availableLangs.indexOf(this.lang);
                this.lang = this.availableLangs[(currentIndex + 1) % this.availableLangs.length];
                document.documentElement.lang = this.lang;
                this.updateLangButtonLabel();
                this.applyLanguageToDOM();
            });
        }

        if (this.fullscreenBtn) {
            this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }

        document.addEventListener('fullscreenchange', () => {
            if (this.fullscreenBtn) {
                this.fullscreenBtn.innerHTML = document.fullscreenElement ? SVG_FULLSCREEN_EXIT : SVG_FULLSCREEN_ENTER;
            }
        });

        // Gestion du panneau d'aide
        const helpBtn = document.getElementById('btn-help-toggle');
        const helpModal = document.getElementById('help-modal');
        if (helpBtn && helpModal) {
            helpBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                helpModal.classList.toggle('hidden');
            });
            
            // Ferme le modal si clic à l'extérieur
            document.addEventListener('pointerdown', (e) => {
                if (!helpModal.classList.contains('hidden') && !helpModal.contains(e.target) && !helpBtn.contains(e.target)) {
                    helpModal.classList.add('hidden');
                }
            });
        }
    }

    updateLangButtonLabel() {
        if (!this.langBtn) return;
        const htmlParts = this.availableLangs.map(l => {
            if (l === this.lang) return `<span style="color:#ff9900;">${l.toUpperCase()}</span>`;
            return `<span style="opacity:0.6;">${l.toUpperCase()}</span>`;
        });
        this.langBtn.innerHTML = htmlParts.join(' <span style="opacity:0.4;">&nbsp;|&nbsp;</span> ');
    }

    updateModelIdentityDisplay(rawModelString) {
        if (!this.identityBadge || !rawModelString) return;
        const clean = rawModelString.replace(/^.*[\\/]/, '').replace(/\.[^/.]+$/, '');
        const match = clean.match(/^(.+)_(man|woman)_(\d+)$/i);
        if (match) {
            let rawType = match[1].split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
            if (rawType.toLowerCase() === 'obese') rawType = 'Plus Size';
            const rawGender = match[2].charAt(0).toUpperCase() + match[2].slice(1).toLowerCase();
            const rawHeight = match[3];
            this.identityBadge.textContent = `${rawType} ${rawGender} - ${rawHeight} cm`;
            this.identityBadge.style.display = 'block';
        } else {
            this.identityBadge.textContent = clean.replace(/_/g, ' ');
            this.identityBadge.style.display = clean ? 'block' : 'none';
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => console.warn(err));
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }

    setupMergedBottomLeftPanel() {
        if (!this.controlsPanel) return;

        this.editSectionLayout = this.controlsPanel.querySelector('.sliders-layout');

        this.descSection = document.createElement('div');
        this.descSection.id = 'merged-desc-section';
        this.descSection.style.display = 'none';
        this.descSection.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
                <span style="color: #ff9900; font-weight: bold; border: 2px solid #ff9900; border-radius: 50%; width: 16px; height: 16px; display: inline-flex; justify-content: center; align-items: center; font-size: 11px; flex-shrink: 0;">i</span>
                <strong id="desc-panel-title" style="font-size: 14px; color: #ff9900;"></strong>
            </div>
            <div id="desc-panel-content" style="font-size: 13px; line-height: 1.45; color: #ddd;"></div>
        `;

        this.mergedDivider = document.createElement('hr');
        this.mergedDivider.id = 'merged-desc-divider';
        this.mergedDivider.style.border = '0';
        this.mergedDivider.style.height = '1px';
        this.mergedDivider.style.background = 'rgba(255, 255, 255, 0.12)';
        this.mergedDivider.style.margin = '12px 0';
        this.mergedDivider.style.display = 'none';

        this.controlsPanel.insertBefore(this.mergedDivider, this.controlsPanel.firstChild);
        this.controlsPanel.insertBefore(this.descSection, this.mergedDivider);
    }

    getLocalizedName(rawKey, data) {
        if (data && data.name && typeof data.name === 'object') {
            return data.name[this.lang] || data.name.en || rawKey.replace(/_/g, ' ');
        }
        return rawKey.replace(/_/g, ' ');
    }

    getLocalizedDesc(data) {
        if (!data || !data.description) return "";
        if (typeof data.description === 'object') {
            return (data.description[this.lang] || data.description.en || "").trim();
        }
        return String(data.description).trim();
    }

    applyLanguageToDOM() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            el.textContent = this.t(el.getAttribute('data-i18n'));
        });
        
        document.querySelectorAll('[title]').forEach(el => {
            if (el.hasAttribute('data-i18n-title')) {
                el.title = this.t(el.getAttribute('data-i18n-title'));
            }
        });

        if (this.controlsPanel) {
            const btnReset = document.getElementById('btn-reset-slider');
            if (btnReset) btnReset.title = this.t('resetTooltip');
            
            const hGroups = this.controlsPanel.querySelectorAll('.horiz-group .slider-label');
            if (hGroups.length >= 2) {
                const curTh = this.sliderTheta ? parseFloat(this.sliderTheta.value) : 0;
                const curPh = this.sliderPhi ? parseFloat(this.sliderPhi.value) : 0;
                hGroups[0].innerHTML = `<span data-i18n="tiltFB">${this.t('tiltFB')}</span> (Theta: <strong id="label-val-theta" style="color: var(--accent);">${curTh > 0 ? '+' : ''}${curTh.toFixed(1)}°</strong>)`;
                hGroups[1].innerHTML = `<span data-i18n="tiltLR">${this.t('tiltLR')}</span> (Phi: <strong id="label-val-phi" style="color: var(--accent);">${curPh > 0 ? '+' : ''}${curPh.toFixed(1)}°</strong>)`;
            }
        }

        if (this.sideToggleBtn && this.sideToggleStates) {
            this.updateSideToggleStates();
            this.sideToggleBtn.textContent = this.sideToggleStates[this.currentFilterStateIndex].text;
            this.sideToggleBtn.title = this.t('filterTooltip');
        }

        this.activeMeasurements.forEach(mObj => {
            if (mObj.nameSpan) {
                // UTILISATION CORRECTE DE pair_group
                const templateKey = mObj.rawData.pair_group || mObj.id;
                mObj.nameSpan.textContent = this.getLocalizedName(templateKey, mObj.rawData);
            }
            // TRADUCTION DES BOUTONS L/R LORS DU CHANGEMENT DE LANGUE
            if (mObj.roundBtn && mObj.sideKey) {
                mObj.roundBtn.textContent = mObj.sideKey === 'LEFT' ? this.t('leftShort') : this.t('rightShort');
            }
        });

        if (this.selectedMeasurement) {
            this.updateMergedPanelContent(this.selectedMeasurement);
            this.renderMarkers(this.selectedMeasurement);
        }
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
            await this.loadData(this.objPath, this.jsonPath);
        } catch (error) {
            console.warn("Requested model failed, loading fallback model...", error);
            
            const toRemove = [...this.avatarGroup.children, ...this.measurementsGroup.children];
            toRemove.forEach(c => {
                if (c.geometry) c.geometry.dispose();
                if (c.material) {
                    if (Array.isArray(c.material)) c.material.forEach(m => m.dispose());
                    else c.material.dispose();
                }
                if (c.parent) c.parent.remove(c);
            });
            this.activeMeasurements = [];
            this.legendContent.innerHTML = '';

            try {
                this.currentModelName = 'average_man_182';
                this.updateModelIdentityDisplay(this.currentModelName);
                await this.loadData('models/average_man_182.obj', 'measurements/average_man_182.json');
            } catch (fallbackError) {
                const errEl = document.getElementById('loading-text');
                if (errEl) errEl.textContent = this.t('criticalError');
                return;
            }
        }

        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.style.display = 'none', 500);
        }
        
        this.applyLanguageToDOM();
        this.animate();
    }

    frameModelFullHeight() {
        this.avatarGroup.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(this.avatarGroup);
        if (box.isEmpty()) return;

        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        const marginPx = 19;
        const viewHeight = Math.max(window.innerHeight, 200);
        const usableHeightFraction = Math.max(0.5, (viewHeight - 2 * marginPx) / viewHeight);

        const halfFovRad = THREE.MathUtils.degToRad(this.camera.fov * 0.5);
        const distanceToFitY = (size.y * 0.5) / (Math.tan(halfFovRad) * usableHeightFraction);
        const finalDistance = distanceToFitY + size.z * 0.22;

        this.controls.target.set(center.x, center.y, center.z);
        this.camera.position.set(center.x, center.y, center.z + finalDistance);
        this.camera.near = Math.max(0.01, finalDistance * 0.05);
        this.camera.far = Math.max(50, finalDistance * 10);
        this.camera.updateProjectionMatrix();
        this.controls.update();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.scene.background = new THREE.Color('#1F2123');
    }

    setupScene() {
        this.camera.position.set(0, 1.0, 2.6);
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

        window.addEventListener('keydown', (e) => {
            if (e.key === 'F11') {
                e.preventDefault();
                this.toggleFullscreen();
            } else if (e.key === 'Escape' && document.fullscreenElement && document.exitFullscreen) {
                document.exitFullscreen();
            }
        });

        this.renderer.domElement.addEventListener('pointermove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const spriteObjects = [];
            this.activeMeasurements.forEach(m => {
                if (m.isVisible && m.iconGroup) {
                    m.iconGroup.children.forEach(s => {
                        if (s !== m.lengthSprite && s.visible) spriteObjects.push(s);
                    });
                }
            });

            const intersects = this.raycaster.intersectObjects(spriteObjects, false);
            let hitSprite = intersects.length > 0 ? intersects[0].object : null;

            if (this.hoveredSprite && this.hoveredSprite !== hitSprite) {
                this.hoveredSprite.scale.copy(this.hoveredSprite.userData.originalScale);
                document.body.style.cursor = 'default';
                this.hoveredSprite = null;
            }

            if (hitSprite) {
                this.hoveredSprite = hitSprite;
                hitSprite.scale.copy(hitSprite.userData.originalScale).multiplyScalar(1.15);
                document.body.style.cursor = 'pointer';
            }
        });

        this.renderer.domElement.addEventListener('pointerdown', (e) => {
            if (e.button !== 0) return;
            this.pointerDownPos.set(e.clientX, e.clientY);
        });

        this.renderer.domElement.addEventListener('pointerup', (e) => {
            if (e.button !== 0) return;
            const distance = this.pointerDownPos.distanceTo(new THREE.Vector2(e.clientX, e.clientY));
            if (distance > 5) return; 

            const selectableObjects = [];
            this.activeMeasurements.forEach(m => {
                if (m.isVisible) {
                    selectableObjects.push(m.tube);
                    if (m.iconGroup) {
                        m.iconGroup.children.forEach(s => {
                            if (s !== m.lengthSprite && s.visible) {
                                selectableObjects.push(s);
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

        if (this.sliderT) this.sliderT.addEventListener('input', updateFromSliders);
        if (this.sliderTheta) this.sliderTheta.addEventListener('input', updateFromSliders);
        if (this.sliderPhi) this.sliderPhi.addEventListener('input', updateFromSliders);

        const btnReset = document.getElementById('btn-reset-slider');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                if (this.selectedMeasurement) this.resetToDefaultGrid(this.selectedMeasurement);
            });
        }
    }

    updateSideToggleStates() {
        const lblL = this.t('leftShort');
        const lblR = this.t('rightShort');
        this.sideToggleStates = [
            { text: this.t('defaultFilter'), filter: 'DEFAULT' },
            { text: this.t('filterAll'), filter: 'ALL' },
            { text: this.t('leftOnly'), filter: 'LEFT' },
            { text: this.t('rightOnly'), filter: 'RIGHT' }
        ];
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
        
        this.sideToggleBtn = sideToggle;
        this.currentFilterStateIndex = 0;
        this.updateSideToggleStates();
        sideToggle.textContent = this.sideToggleStates[this.currentFilterStateIndex].text;

        sideToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.currentFilterStateIndex = (this.currentFilterStateIndex + 1) % this.sideToggleStates.length;
            sideToggle.textContent = this.sideToggleStates[this.currentFilterStateIndex].text;
            const filter = this.sideToggleStates[this.currentFilterStateIndex].filter;

            this.activeMeasurements.forEach(mObj => {
                const side = mObj.rawData.side || 'SINGLE';
                if (side === 'SINGLE') return;

                let shouldBeVisible = false;
                if (filter === 'ALL') shouldBeVisible = true;
                else if (filter === 'LEFT') shouldBeVisible = (side === 'LEFT');
                else if (filter === 'RIGHT') shouldBeVisible = (side === 'RIGHT');
                else if (filter === 'DEFAULT') shouldBeVisible = !mObj.rawData.is_clone;
                
                if (mObj.setSideChecked && mObj.isChecked !== shouldBeVisible) {
                    mObj.setSideChecked(shouldBeVisible);
                }
            });
        });
        container.appendChild(sideToggle);

        const eyeToggle = document.createElement('div');
        eyeToggle.className = 'visibility-toggle';
        eyeToggle.style.cursor = 'pointer';
        eyeToggle.innerHTML = SVG_EYE_OPEN;

        let globalAllVisible = true;
        eyeToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            globalAllVisible = !globalAllVisible;
            eyeToggle.classList.toggle('off', !globalAllVisible);
            eyeToggle.innerHTML = globalAllVisible ? SVG_EYE_OPEN : SVG_EYE_CLOSED;
            
            const legendItems = document.querySelectorAll('#legend-content .legend-item');
            legendItems.forEach(item => {
                if (item._forceVisibility) {
                    item._forceVisibility(globalAllVisible);
                }
            });
        });
        container.appendChild(eyeToggle);
    }

    async loadData(objPath, jsonPath) {
        const [templateRes, modelRes] = await Promise.all([
            fetch('./master_measurements_template.json').catch(() => null),
            fetch(jsonPath)
        ]);

        if (templateRes && templateRes.ok) {
            const templateData = await templateRes.json();
            templateData.measurements.forEach(m => this.templateMap.set(m.id, m));
        }
        
        const data = await modelRes.json();
        
        for (const [name, measData] of Object.entries(data.measurements_results)) {
            // CORRECTION DU BUG DE TRADUCTION G/D :
            // measData.pair_group contient toujours l'ID original (ex: "Tour de manche")
            const templateKey = measData.pair_group || name;
            const tpl = this.templateMap.get(templateKey);
            if (tpl) {
                measData.name = tpl.name;
                measData.description = tpl.description;
                if (tpl.slicer_parameters) measData.template_params = tpl.slicer_parameters;
            }
        }

        this.resultsData = data;
        
        if (data.height_overridden && data.global_scale) {
            const s = data.global_scale;
            this.avatarGroup.scale.set(s, s, s);
        }

        await new Promise((resolve, reject) => {
            new OBJLoader().load(objPath, (object) => {
                const matBody = new THREE.MeshStandardMaterial({ color: 0x6c6c6c, roughness: 0.6, metalness: 0.2, side: THREE.DoubleSide });
                object.traverse((child) => { if (child.isMesh) child.material = matBody; });
                this.avatarGroup.add(object);
                resolve();
            }, undefined, reject);
        });

        this.frameModelFullHeight();

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
        let points = data.path_3d.map(p => new THREE.Vector3(p[0], p[1], p[2]));
        
        let hexColor = data.type === 'tape' ? 0x00ffcc : (data.type === 'slicer' ? 0xffaa00 : 0xcc33ff);
        if(!data.type) hexColor = 0xff3333;
        const cssColor = '#' + hexColor.toString(16).padStart(6, '0');
        
        let isClosed = data.is_closed_loop || data.is_closed || data.type === 'slicer';
        if (points.length > 2) {
            const dist = points[0].distanceTo(points[points.length - 1]);
            if (dist < 0.04) isClosed = true;
            if (isClosed && dist < 0.02) points.pop();
        }

        const curve = new THREE.CatmullRomCurve3(points, isClosed, 'catmullrom', 0);
        const radius = (data.type === 'plumb' || data.type === 'caliper') ? 0.002 : 0.0035;
        const haloRadius = (data.type === 'plumb' || data.type === 'caliper') ? 0.005 : 0.007;

        const defaultVisible = data.default_visible !== false;

        const tubeGeo = new THREE.TubeGeometry(curve, points.length * 4, radius, 8, isClosed);
        const tubeMesh = new THREE.Mesh(tubeGeo, new THREE.MeshBasicMaterial({ color: hexColor, depthTest: true, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4, side: THREE.DoubleSide }));
        tubeMesh.renderOrder = 1; tubeMesh.visible = defaultVisible;
        this.measurementsGroup.add(tubeMesh);

        const haloMesh = new THREE.Mesh(new THREE.TubeGeometry(curve, points.length * 4, haloRadius, 8, isClosed), new THREE.MeshBasicMaterial({ color: hexColor, transparent: true, opacity: 0.35, depthTest: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
        haloMesh.visible = false; haloMesh.renderOrder = 2;
        this.measurementsGroup.add(haloMesh);

        let ghostMin = null, ghostMax = null;
        if (data.path_min && data.path_min.length >= 2) {
            const minPts = data.path_min.map(p => new THREE.Vector3(p[0], p[1], p[2]));
            if (minPts.length > 2 && minPts[0].distanceTo(minPts[minPts.length - 1]) < 0.005) minPts.pop();
            ghostMin = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(minPts, isClosed, 'catmullrom', 0), minPts.length * 4, 0.0015, 8, isClosed), new THREE.MeshBasicMaterial({ color: 0x4ea8de, transparent: true, opacity: 0.4, depthTest: true }));
            ghostMin.visible = false;
            this.measurementsGroup.add(ghostMin);
        }

        if (data.path_max && data.path_max.length >= 2) {
            const maxPts = data.path_max.map(p => new THREE.Vector3(p[0], p[1], p[2]));
            if (maxPts.length > 2 && maxPts[0].distanceTo(maxPts[maxPts.length - 1]) < 0.005) maxPts.pop();
            ghostMax = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(maxPts, isClosed, 'catmullrom', 0), maxPts.length * 4, 0.0015, 8, isClosed), new THREE.MeshBasicMaterial({ color: 0xff4444, transparent: true, opacity: 0.4, depthTest: true }));
            ghostMax.visible = false;
            this.measurementsGroup.add(ghostMax);
        }

        const anchorObj = new THREE.Object3D();
        anchorObj.position.copy(points[0]);

        const iconGroup = new THREE.Group();
        let currentX = 0.0;
        
        const addSprite = (sprite, width) => {
            sprite.position.set(currentX + width / 2, -0.05, 0); 
            iconGroup.add(sprite);
            currentX += width + 0.01;
        };

        if (this.getLocalizedDesc(data) !== "") addSprite(this.createIconSprite('info'), 0.050);
        if (data.ui_grid && data.ui_grid.length > 0) addSprite(this.createIconSprite('grid'), 0.100);
        
        const lengthSprite = this.createIconSprite('text', data.value_cm.toFixed(1) + ' cm');
        addSprite(lengthSprite, 0.120);
        lengthSprite.visible = false; 
        
        iconGroup.position.x = 0.02; 
        iconGroup.visible = defaultVisible;
        anchorObj.add(iconGroup);
        
        this.measurementsGroup.add(anchorObj);

        return {
            id: name, groupKey: name, anchor3D: anchorObj, iconGroup: iconGroup, lengthSprite: lengthSprite,
            color: cssColor, tube: tubeMesh, halo: haloMesh, ghostMin: ghostMin, ghostMax: ghostMax,
            isVisible: defaultVisible, isSelected: false, rawData: data, gridEngine: this.buildGridEngine(data)
        };
    }

    createIconSprite(type, text = '') {
        const canvas = document.createElement('canvas');
        canvas.width = (type === 'text' || type === 'grid') ? 256 : 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        if (type === 'info') {
            ctx.fillStyle = '#282828';
            ctx.beginPath(); ctx.arc(64, 64, 56, 0, 2 * Math.PI); ctx.fill();
            ctx.lineWidth = 6; ctx.strokeStyle = '#ff9900'; ctx.stroke();
            ctx.fillStyle = '#ff9900'; ctx.font = 'bold 70px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('i', 64, 66);
        } else if (type === 'grid') {
            ctx.fillStyle = '#282828';
            ctx.beginPath(); 
            if (ctx.roundRect) ctx.roundRect(8, 16, 240, 96, 20); else ctx.rect(8, 16, 240, 96);
            ctx.fill();
            ctx.lineWidth = 6; ctx.strokeStyle = '#4ea8de'; ctx.stroke();
            ctx.fillStyle = '#4ea8de'; ctx.font = 'bold 46px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('EDIT', 128, 66);
        } else if (type === 'text') {
            ctx.fillStyle = 'rgba(40, 40, 40, 0.9)';
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(10, 25, 236, 78, 16); else ctx.rect(10, 25, 236, 78);
            ctx.fill();
            ctx.lineWidth = 4; ctx.strokeStyle = '#4ea8de'; ctx.stroke();
            ctx.fillStyle = '#ffffff'; ctx.font = 'bold 44px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(text, 128, 64);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthTest: false, transparent: true, opacity: 0.95 }));
        
        if (type === 'text') sprite.scale.set(0.120, 0.060, 0.060);
        else if (type === 'grid') sprite.scale.set(0.100, 0.050, 0.050); 
        else sprite.scale.set(0.050, 0.050, 0.050); 
        
        sprite.renderOrder = 1000;
        sprite.userData.originalScale = sprite.scale.clone();
        return sprite;
    }

    createSingleMeasurementVisual(name, data) {
        const mObj = this.build3DTubeForMeasurement(name, data);
        if (!mObj) return;

        const div = document.createElement('div');
        div.className = 'legend-item';
        div.style.borderLeftColor = mObj.color;
        
        const hasGrid = data.ui_grid && data.ui_grid.length > 0;
        const descText = this.getLocalizedDesc(data);
        const displayName = this.getLocalizedName(name, data);

        div.innerHTML = `
            <div class="leg-col-name">
                <span class="legend-name">${displayName}</span>
                ${descText ? `<span class="info-icon" style="color:#ffd700; border:1px solid #ffd700; border-radius:50%; width:14px; height:14px; font-size:10px; font-weight:bold; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0;" title="${this.t('infoAvailable')}">i</span>` : ''}
                ${hasGrid ? `<span title="${this.t('editableMeas')}" style="background:rgba(78,168,222,0.15); color:#4ea8de; padding:1px 4px; border-radius:3px; font-size:9px; font-weight:bold; border:1px solid #4ea8de; flex-shrink:0;">EDIT</span>` : ''}
            </div>
            <div class="leg-col-lr"></div>
            <div class="leg-col-val legend-value">${data.value_cm.toFixed(1)} cm</div>
            <div class="leg-col-eye visibility-toggle ${!mObj.isVisible ? 'off' : ''}" title="${this.t('toggleSingleTooltip')}">${mObj.isVisible ? SVG_EYE_OPEN : SVG_EYE_CLOSED}</div>
            <input type="color" class="color-picker" value="${mObj.color}" style="position:absolute; left:-16px; top:0; width:16px; height:100%; opacity:0; cursor:pointer; pointer-events:none;">
        `;
        this.legendContent.appendChild(div);

        mObj.domElement = div; mObj.hudTargetElement = div;
        mObj.nameSpan = div.querySelector('.legend-name');
        mObj.valueSpan = div.querySelector('.legend-value');

        const eyeIcon = div.querySelector('.visibility-toggle');
        const colorPicker = div.querySelector('.color-picker');

        div._forceVisibility = (forceState) => { if (mObj.isVisible !== forceState) eyeIcon.click(); };

        colorPicker.addEventListener('click', (e) => e.stopPropagation());
        colorPicker.addEventListener('input', (e) => {
            mObj.color = e.target.value; div.style.borderLeftColor = mObj.color; 
            mObj.tube.material.color.set(mObj.color); mObj.halo.material.color.set(mObj.color);
        });

        eyeIcon.addEventListener('click', (e) => {
            e.stopPropagation(); mObj.isVisible = !mObj.isVisible;
            mObj.tube.visible = mObj.isVisible; mObj.halo.visible = (mObj.isVisible && mObj.isSelected);
            if (mObj.iconGroup) mObj.iconGroup.visible = mObj.isVisible;
            if (mObj.ghostMin) mObj.ghostMin.visible = (mObj.isVisible && mObj.isSelected);
            if (mObj.ghostMax) mObj.ghostMax.visible = (mObj.isVisible && mObj.isSelected);
            
            eyeIcon.classList.toggle('off', !mObj.isVisible);
            eyeIcon.innerHTML = mObj.isVisible ? SVG_EYE_OPEN : SVG_EYE_CLOSED;
            div.classList.toggle('hidden-item', !mObj.isVisible);
        });

        div.addEventListener('click', () => this.selectMeasurement(mObj));
        this.activeMeasurements.push(mObj);
    }

    createPairedMeasurementVisuals(groupName, items) {
        const builtItems = {};
        items.forEach(entry => {
            const mObj = this.build3DTubeForMeasurement(entry.name, entry.data);
            if (mObj) { mObj.groupKey = groupName; mObj.isChecked = mObj.isVisible; builtItems[entry.data.side || 'LEFT'] = mObj; }
        });

        const firstObj = builtItems['LEFT'] || builtItems['RIGHT'];
        if (!firstObj) return;

        let groupMasterVisible = true;
        const div = document.createElement('div');
        div.className = 'legend-item paired-legend-item';
        div.style.borderLeftColor = firstObj.color;

        const hasGrid = firstObj.rawData.ui_grid && firstObj.rawData.ui_grid.length > 0;
        const descText = this.getLocalizedDesc(firstObj.rawData);
        const displayName = this.getLocalizedName(groupName, firstObj.rawData);

        div.innerHTML = `
            <div class="leg-col-name">
                <span class="legend-name">${displayName}</span>
                ${descText ? `<span class="info-icon" style="color:#ff9900; border:1px solid #ff9900; border-radius:50%; width:14px; height:14px; font-size:10px; font-weight:bold; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0;" title="${this.t('infoAvailable')}">i</span>` : ''}
                ${hasGrid ? `<span style="background:rgba(78,168,222,0.15); color:#4ea8de; padding:1px 4px; border-radius:3px; font-size:9px; font-weight:bold; border:1px solid #4ea8de; flex-shrink:0;">EDIT</span>` : ''}
            </div>
            <div class="leg-col-lr lr-inline-container"></div>
            <div class="leg-col-val legend-value">${firstObj.rawData.value_cm.toFixed(1)} cm</div>
            <div class="leg-col-eye visibility-toggle" title="${this.t('toggleGroupTooltip')}">${SVG_EYE_OPEN}</div>
            <input type="color" class="color-picker" value="${firstObj.color}" style="position:absolute; left:-16px; top:0; width:16px; height:100%; opacity:0; cursor:pointer; pointer-events:none;">
        `;
        this.legendContent.appendChild(div);

        const sidesContainer = div.querySelector('.lr-inline-container');
        const colorPicker = div.querySelector('.color-picker');
        const eyeIcon = div.querySelector('.visibility-toggle');
        const valSpan = div.querySelector('.legend-value');

        const syncGroupVisibility = () => {
            const anyChecked = Object.values(builtItems).some(x => x.isChecked);
            const effectiveMaster = groupMasterVisible && anyChecked;

            eyeIcon.classList.toggle('off', !effectiveMaster);
            eyeIcon.innerHTML = effectiveMaster ? SVG_EYE_OPEN : SVG_EYE_CLOSED;
            div.classList.toggle('hidden-item', !effectiveMaster);

            Object.values(builtItems).forEach(mObj => {
                mObj.isVisible = groupMasterVisible && mObj.isChecked;
                mObj.tube.visible = mObj.isVisible;
                mObj.halo.visible = (mObj.isVisible && mObj.isSelected);
                if (mObj.iconGroup) mObj.iconGroup.visible = mObj.isVisible;
                if (mObj.ghostMin) mObj.ghostMin.visible = (mObj.isVisible && mObj.isSelected);
                if (mObj.ghostMax) mObj.ghostMax.visible = (mObj.isVisible && mObj.isSelected);
                if (mObj.roundBtn) mObj.roundBtn.classList.toggle('checked', mObj.isChecked);
            });
        };

        div._forceVisibility = (forceState) => { if (groupMasterVisible !== forceState) eyeIcon.click(); };

        colorPicker.addEventListener('click', (e) => e.stopPropagation());
        colorPicker.addEventListener('input', (e) => {
            div.style.borderLeftColor = e.target.value;
            Object.values(builtItems).forEach(mObj => {
                mObj.color = e.target.value;
                mObj.tube.material.color.set(e.target.value);
                mObj.halo.material.color.set(e.target.value);
            });
        });

        eyeIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            groupMasterVisible = !groupMasterVisible;
            if (groupMasterVisible && !Object.values(builtItems).some(x => x.isChecked)) {
                firstObj.isChecked = true;
            }
            syncGroupVisibility();
        });

        ['LEFT', 'RIGHT'].forEach(key => {
            const mObj = builtItems[key];
            if (!mObj) return;

            // SAUVEGARDE DE LA CLÉ DE CÔTÉ POUR LA TRADUCTION DYNAMIQUE
            mObj.sideKey = key;

            const roundBtn = document.createElement('button');
            roundBtn.className = `lr-round-btn ${mObj.isChecked ? 'checked' : ''}`;
            roundBtn.textContent = key === 'LEFT' ? this.t('leftShort') : this.t('rightShort');
            sidesContainer.appendChild(roundBtn);

            mObj.domElement = div; mObj.nameSpan = div.querySelector('.legend-name'); mObj.roundBtn = roundBtn; mObj.hudTargetElement = roundBtn;

            roundBtn.addEventListener('click', (e) => {
                e.stopPropagation(); mObj.isChecked = !mObj.isChecked;
                if (mObj.isChecked && !groupMasterVisible) groupMasterVisible = true;
                syncGroupVisibility();
                if(mObj.isChecked) { valSpan.textContent = mObj.rawData.value_cm.toFixed(1) + ' cm'; this.selectMeasurement(mObj); }
            });

            mObj.setSideChecked = (state) => {
                mObj.isChecked = state;
                if (mObj.isChecked && !groupMasterVisible) groupMasterVisible = true;
                syncGroupVisibility();
            };

            this.activeMeasurements.push(mObj);
        });

        div.addEventListener('click', () => {
            const target = Object.values(builtItems).find(x => x.isVisible) || firstObj;
            if(target) { valSpan.textContent = target.rawData.value_cm.toFixed(1) + ' cm'; this.selectMeasurement(target); }
        });

        syncGroupVisibility();
    }

    updateMergedPanelContent(targetObj) {
        if (!this.controlsPanel) return;

        const hasGrid = Boolean(targetObj.gridEngine);
        const descText = this.getLocalizedDesc(targetObj.rawData);
        const hasGhosts = Boolean(targetObj.ghostMin || targetObj.ghostMax);
        const hasInfo = (descText !== "" || hasGhosts);

        if (!hasInfo && !hasGrid) {
            this.controlsPanel.classList.add('hidden');
            return;
        }

        this.controlsPanel.classList.remove('hidden');

        if (hasInfo && this.descSection) {
            this.descSection.style.display = 'block';
            const titleEl = this.descSection.querySelector('#desc-panel-title');
            if (titleEl) {
                // UTILISATION CORRECTE DE pair_group POUR LA TRADUCTION
                titleEl.textContent = this.getLocalizedName(targetObj.groupKey || targetObj.id, targetObj.rawData);
            }
            const contentEl = this.descSection.querySelector('#desc-panel-content');
            if (contentEl) {
                let htmlContent = "";
                if (descText !== "") {
                    htmlContent += `<div>${descText}</div>`;
                }
                if (hasGhosts) {
                    const marginAndBorder = descText !== "" ? 'margin-top: 10px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1);' : '';
                    htmlContent += `<div style="${marginAndBorder} font-size: 12px; color: #ccc; display: flex; flex-direction: column; gap: 6px;">`;
                    if (targetObj.ghostMax && targetObj.rawData.value_max_cm) {
                        htmlContent += `<div style="display: flex; align-items: center; gap: 8px;"><div style="width: 18px; height: 4px; background: rgba(255, 68, 68, 0.8); border-radius: 2px; flex-shrink: 0;"></div><span>${this.t('valMax')} <strong style="color: #fff;">${targetObj.rawData.value_max_cm.toFixed(1)} cm</strong></span></div>`;
                    }
                    if (targetObj.ghostMin && targetObj.rawData.value_min_cm) {
                        htmlContent += `<div style="display: flex; align-items: center; gap: 8px;"><div style="width: 18px; height: 4px; background: rgba(78, 168, 222, 0.8); border-radius: 2px; flex-shrink: 0;"></div><span>${this.t('valMin')} <strong style="color: #fff;">${targetObj.rawData.value_min_cm.toFixed(1)} cm</strong></span></div>`;
                    }
                    htmlContent += `</div>`;
                }
                contentEl.innerHTML = htmlContent;
            }
        } else if (this.descSection) {
            this.descSection.style.display = 'none';
        }

        if (this.mergedDivider) {
            this.mergedDivider.style.display = (hasInfo && hasGrid) ? 'block' : 'none';
        }

        if (hasGrid && this.editSectionLayout) {
            this.editSectionLayout.style.display = 'flex';
            this.controlsPanel.querySelector('.controls-header').style.display = 'flex';
            this.configureSlidersRange(targetObj);
            this.renderMarkers(targetObj);

            const curT = targetObj.currentT !== undefined ? targetObj.currentT : targetObj.rawData.default_t;
            const curTh = targetObj.currentTheta !== undefined ? targetObj.currentTheta : targetObj.rawData.default_theta;
            const curPh = targetObj.currentPhi !== undefined ? targetObj.currentPhi : targetObj.rawData.default_phi;

            if (this.sliderT) this.sliderT.value = curT;
            if (this.sliderTheta) this.sliderTheta.value = curTh;
            if (this.sliderPhi) this.sliderPhi.value = curPh;

            const lblTh = document.getElementById('label-val-theta');
            const lblPh = document.getElementById('label-val-phi');
            if (lblTh) lblTh.textContent = `${curTh > 0 ? '+' : ''}${parseFloat(curTh).toFixed(1)}°`;
            if (lblPh) lblPh.textContent = `${curPh > 0 ? '+' : ''}${parseFloat(curPh).toFixed(1)}°`;
        } else if (this.editSectionLayout) {
            this.editSectionLayout.style.display = 'none';
            this.controlsPanel.querySelector('.controls-header').style.display = 'none';
        }
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
        if (toggledOn && targetObj) {
            this.updateMergedPanelContent(targetObj);
        } else if (this.controlsPanel) {
            this.controlsPanel.classList.add('hidden');
        }
    }

    applySelectionState(item) {
        if (!item.domElement) return;
        const picker = item.domElement.querySelector('.color-picker');
        const anySiblingSelected = this.activeMeasurements.some(m => m.domElement === item.domElement && m.isSelected);

        if (item.isSelected) {
            item.domElement.classList.add('selected');
            item.tube.material.depthTest = false;
            item.tube.renderOrder = 999;
            if (item.isVisible) item.halo.visible = true;
            if (item.isVisible && item.lengthSprite) item.lengthSprite.visible = true;
            if (item.ghostMin) item.ghostMin.visible = item.isVisible;
            if (item.ghostMax) item.ghostMax.visible = item.isVisible;
            if (picker) picker.style.pointerEvents = 'auto';
        } else {
            if (!anySiblingSelected) {
                item.domElement.classList.remove('selected');
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
            t_set.add(node.t); th_set.add(node.theta_deg); ph_set.add(node.phi_deg);
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
            map, t_arr, th_arr, ph_arr,
            minT: t_arr[0], maxT: t_arr[t_arr.length-1], minTh, maxTh, minPh, maxPh,
            customMarkers: data.customMarkers || []
        };
    }

    getBounds(val, arr) {
        if (arr.length === 1) return [arr[0], arr[0], 0];
        if (val <= arr[0]) return [arr[0], arr[1], 0];
        if (val >= arr[arr.length-1]) return [arr[arr.length-2], arr[arr.length-1], 1];
        for (let i=0; i<arr.length-1; i++) {
            if (val >= arr[i] && val <= arr[i+1]) {
                return [arr[i], arr[i+1], (val - arr[i]) / (arr[i+1] - arr[i])];
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
            total += Math.sqrt((p2[0]-p1[0])**2 + (p2[1]-p1[1])**2 + (p2[2]-p1[2])**2);
        }
        return total * 100.0;
    }

    trilinearInterpolate(eng, t, th, ph) {
        const [t0, t1, rt] = this.getBounds(t, eng.t_arr);
        const [th0, th1, rth] = this.getBounds(th, eng.th_arr);
        const [ph0, ph1, rph] = this.getBounds(ph, eng.ph_arr);
        
        const getVal = (t_v, th_v, ph_v) => {
            return eng.map.get(`${t_v}_${th_v}_${ph_v}`) || eng.map.values().next().value;
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

        let points = result.path_3d.map(p => new THREE.Vector3(p[0], p[1], p[2]));
        
        let isClosed = item.rawData.is_closed_loop === true || item.rawData.is_closed === true || item.rawData.type === 'slicer';
        if (points.length > 2) {
            const dist = points[0].distanceTo(points[points.length - 1]);
            if (dist < 0.04) isClosed = true;
            if (isClosed && dist < 0.02) points.pop();
        }

        const curve = new THREE.CatmullRomCurve3(points, isClosed, 'catmullrom', 0);
        
        const newGeo = new THREE.TubeGeometry(curve, points.length * 4, 0.0035, 8, isClosed);
        const newHalo = new THREE.TubeGeometry(curve, points.length * 4, 0.007, 8, isClosed);
        
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

    renderMarkers(item) {
        if (!item.gridEngine) return;
        const eng = item.gridEngine;

        const toPercent = (val, min, max) => {
            if (Math.abs(max - min) < 1e-6) return 50;
            return ((val - min) / (max - min)) * 100;
        };
        const getOffsetStyle = (pct) => `calc(${pct}% + ${7 - (pct / 100) * 14}px)`;

        ['t', 'theta', 'phi'].forEach(axis => {
            const container = document.getElementById(`markers-container-${axis}`);
            if (!container) return;
            container.innerHTML = '';

            const isVert = axis === 't';
            const className = isVert ? 'vertical-m' : 'horizontal-m';
            const styleProp = isVert ? 'bottom' : 'left';

            let defVal = 0, minV = 0, maxV = 1;
            if (axis === 't') { defVal = item.rawData.default_t; minV = eng.minT; maxV = eng.maxT; }
            if (axis === 'theta') { defVal = item.rawData.default_theta; minV = eng.minTh; maxV = eng.maxTh; }
            if (axis === 'phi') { defVal = item.rawData.default_phi; minV = eng.minPh; maxV = eng.maxPh; }
            
            const defPct = toPercent(defVal, minV, maxV);
            const defMarker = document.createElement('div');
            defMarker.className = `marker default-marker ${className}`;
            defMarker.style[styleProp] = getOffsetStyle(defPct);
            defMarker.title = `${this.t('defaultMarkerTooltip')} (${defVal})`;
            defMarker.innerHTML = '↺';
            
            defMarker.addEventListener('click', () => {
                if (axis === 't') this.sliderT.value = defVal;
                if (axis === 'theta') this.sliderTheta.value = defVal;
                if (axis === 'phi') this.sliderPhi.value = defVal;
                this.sliderT.dispatchEvent(new Event('input'));
            });
            container.appendChild(defMarker);

            if (eng.customMarkers) {
                eng.customMarkers.forEach((m) => {
                    const cMarker = document.createElement('div');
                    cMarker.className = `marker custom-marker ${className}`;
                    let mVal = m.t;
                    if (axis === 'theta') mVal = m.th;
                    if (axis === 'phi') mVal = m.ph;
                    
                    const pct = toPercent(mVal, minV, maxV);
                    cMarker.style[styleProp] = getOffsetStyle(pct);
                    cMarker.title = `${this.t('customMarkerTooltip')} (${mVal.toFixed(1)})`;
                    
                    cMarker.addEventListener('click', () => {
                        this.sliderT.value = m.t;
                        this.sliderTheta.value = m.th;
                        this.sliderPhi.value = m.ph;
                        this.sliderT.dispatchEvent(new Event('input'));
                    });
                    
                    container.appendChild(cMarker);
                });
            }
        });
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

new MeasurementViewer().init();