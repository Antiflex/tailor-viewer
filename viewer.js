//viewer.js
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
        tiltFB: "Front/Back Tilt (Theta: ",
        tiltLR: "Left/Right Tilt (Phi: ",
        resetBtn: "Reset",
        resetTooltip: "Reset all sliders to default",
        changeColorTooltip: "Change color",
        toggleGroupTooltip: "Show / Hide group",
        toggleSingleTooltip: "Show / Hide measurement",
        toggleAllTooltip: "Show / Hide all",
        filterTooltip: "Filter Left / Right / Default",
        defaultFilter: "Default",
        leftOnly: "L Only",
        rightOnly: "R Only",
        leftShort: "L",
        rightShort: "R",
        leftTitle: "Left Side",
        rightTitle: "Right Side",
        originalTag: "Original",
        cloneTag: "Symmetric clone",
        defaultMarkerTooltip: "Click to reset this slider to default value",
        customMarkerTooltip: "Custom marker (click to apply)",
        fullscreenTooltip: "Toggle Fullscreen (F11 / Esc)",
        langTooltip: "Switch Language (EN / FR)",
        infoAvailable: "Description available",
        editableMeas: "Adjustable measurement"
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
        tiltFB: "Inclinaison Avant/Arri\u00e8re (Theta : ",
        tiltLR: "Inclinaison Gauche/Droite (Phi : ",
        resetBtn: "Reset",
        resetTooltip: "Revenir aux valeurs par d\u00e9faut",
        changeColorTooltip: "Changer la couleur",
        toggleGroupTooltip: "Afficher / Masquer le groupe",
        toggleSingleTooltip: "Afficher / Masquer la mesure",
        toggleAllTooltip: "Afficher / Masquer tout",
        filterTooltip: "Filtre Gauche / Droit / D\u00e9faut",
        defaultFilter: "D\u00e9faut",
        leftOnly: "L Seul",
        rightOnly: "R Seul",
        leftShort: "L",
        rightShort: "R",
        leftTitle: "C\u00f4t\u00e9 Gauche",
        rightTitle: "C\u00f4t\u00e9 Droit",
        originalTag: "Original",
        cloneTag: "Clone sym\u00e9trique",
        defaultMarkerTooltip: "Cliquer pour r\u00e9initialiser ce curseur \u00e0 sa valeur par d\u00e9faut",
        customMarkerTooltip: "Marqueur perso (cliquer pour appliquer)",
        fullscreenTooltip: "Plein \u00e9cran (F11 / \u00c9chap)",
        langTooltip: "Changer de langue (EN / FR)",
        infoAvailable: "Description disponible",
        editableMeas: "Mesure ajustable"
    }
};

// Built-in translation fallback for standard tailoring measurement names
const MEAS_NAME_DICT = {
    "tour de poitrine": { fr: "Tour de poitrine", en: "Chest Girth" },
    "tour de ceinture": { fr: "Tour de ceinture", en: "Waistband Girth" },
    "tour de cou": { fr: "Tour de cou", en: "Neck Girth" },
    "tour d'emmanchure": { fr: "Tour d'emmanchure", en: "Armscye Girth" },
    "tour de poignet": { fr: "Tour de poignet", en: "Wrist Girth" },
    "tour de mollet": { fr: "Tour de mollet", en: "Calf Girth" },
    "largeur du dos": { fr: "Largeur du dos", en: "Cross Back Width" },
    "aplomb epaule-poitrine-bassin": { fr: "Aplomb \u00e9paule-poitrine-bassin", en: "Shoulder-Chest-Pelvis Plumb" },
    "aplomb \u00e9paule-poitrine-bassin": { fr: "Aplomb \u00e9paule-poitrine-bassin", en: "Shoulder-Chest-Pelvis Plumb" },
    "largeur d'\u00e9paules": { fr: "Largeur d'\u00e9paules", en: "Shoulder Width" },
    "largeur d'epaules": { fr: "Largeur d'\u00e9paules", en: "Shoulder Width" },
    "longueur de manche": { fr: "Longueur de manche", en: "Sleeve Length" },
    "tour de bras": { fr: "Tour de bras", en: "Upper Arm Girth" },
    "tour de hanches": { fr: "Tour de hanches", en: "Hip Girth" },
    "demi-longueur d'\u00e9paule": { fr: "Demi-longueur d'\u00e9paule", en: "Half Shoulder Length" },
    "demi-longueur d'epaule": { fr: "Demi-longueur d'\u00e9paule", en: "Half Shoulder Length" },
    "aplomb cervicale c7-sol": { fr: "Aplomb cervicale C7-sol", en: "C7-to-Floor Plumb" },
    "longueur de jambe int\u00e9rieure": { fr: "Longueur de jambe int\u00e9rieure", en: "Inseam Length" },
    "longueur de jambe interieure": { fr: "Longueur de jambe int\u00e9rieure", en: "Inseam Length" },
    "longueur de jambe ext\u00e9rieure": { fr: "Longueur de jambe ext\u00e9rieure", en: "Outseam Length" },
    "longueur de jambe exterieure": { fr: "Longueur de jambe ext\u00e9rieure", en: "Outseam Length" },
    "tour de taille": { fr: "Tour de taille", en: "Waist Girth" }
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

        // Point 6: English by default
        this.lang = urlParams.get('lang') || 'en';
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

        this.injectCustomStyles();
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

    injectCustomStyles() {
        if (document.getElementById('tailor-injected-styles')) return;
        const style = document.createElement('style');
        style.id = 'tailor-injected-styles';
        style.textContent = `
            :root {
                --bg: #1F2123 !important;
                --bg-grad: none !important;
            }
            body, #loading-overlay {
                background: #1F2123 !important;
            }
            /* Point 8: Widen right panel and compact items to fit on 1 line without scrollbar */
            #right-panel {
                width: 430px !important;
                max-width: calc(100vw - 40px);
            }
            #legend-content {
                padding: 8px 10px !important;
            }
            .legend-item {
                margin-bottom: 5px !important;
                padding: 7px 12px !important;
            }
            .visibility-toggle {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                color: #e6e8ec;
                opacity: 0.75;
                transition: opacity 0.2s;
            }
            .visibility-toggle:hover {
                opacity: 1;
            }
            .visibility-toggle.off {
                opacity: 0.35;
            }
            /* Points 11 & 12: Round grey L/R buttons and tight spacing */
            .lr-inline-container {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .lr-side-unit {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 2px 5px;
                border-radius: 6px;
                border: 1px solid transparent;
                transition: all 0.15s;
                cursor: pointer;
            }
            .lr-side-unit:hover {
                background: rgba(255, 255, 255, 0.06);
            }
            .lr-side-unit.active-edit {
                background: rgba(78, 168, 222, 0.2);
                border-color: var(--accent);
            }
            .lr-side-unit.side-hidden {
                opacity: 0.35;
            }
            .lr-round-btn {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #5a6069;
                color: #ffffff;
                border: 1px solid rgba(255, 255, 255, 0.2);
                font-size: 10px;
                font-weight: 700;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                padding: 0;
                line-height: 1;
                flex-shrink: 0;
                transition: background 0.15s, transform 0.1s;
            }
            .lr-round-btn:hover {
                transform: scale(1.08);
                background: #737a85;
            }
            .lr-round-btn.checked {
                background: #6c737d;
                box-shadow: inset 0 0 0 1px rgba(255,255,255,0.4);
            }
            .lr-val-span {
                font-size: 13px;
                white-space: nowrap;
            }
            /* Points 4, 6, 7: Top-left bar */
            #top-left-bar {
                position: absolute;
                top: 20px;
                left: 20px;
                z-index: 30;
                display: flex;
                flex-direction: column;
                gap: 8px;
                pointer-events: auto;
            }
            .top-left-Controls {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .top-ui-btn {
                background: rgba(22, 24, 28, 0.85);
                border: 1px solid rgba(255, 255, 255, 0.15);
                color: #e6e8ec;
                border-radius: 8px;
                padding: 6px 11px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                backdrop-filter: blur(8px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.25);
                transition: background 0.2s, border-color 0.2s;
            }
            .top-ui-btn:hover {
                background: rgba(255, 255, 255, 0.12);
                border-color: rgba(255, 255, 255, 0.3);
            }
            #model-identity-badge {
                background: rgba(22, 24, 28, 0.85);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                padding: 6px 12px;
                font-size: 13px;
                font-weight: 600;
                color: #e6e8ec;
                backdrop-filter: blur(8px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.25);
                white-space: nowrap;
            }
            /* Point 15: Merged Info + Adjustment panel with thin orange/gold border */
            #controls-panel {
                background: rgba(22, 24, 28, 0.92) !important;
                border: 1px solid rgba(255, 180, 0, 0.55) !important;
                border-radius: 10px !important;
                padding: 15px !important;
                width: 380px !important;
                max-width: calc(100vw - 40px);
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 15px rgba(0,0,0,0.35) !important;
            }
            #merged-desc-divider {
                border: 0;
                height: 1px;
                background: rgba(255, 255, 255, 0.12);
                margin: 12px 0;
            }
            /* Point 16: Default reset marker placed BELOW the horizontal slider track */
            .slider-track-wrapper.horiz {
                height: 32px !important;
                padding-bottom: 6px;
            }
            .marker.horizontal-m {
                top: auto !important;
                bottom: 0px !important;
                width: 4px !important;
                height: 10px !important;
                border-radius: 2px;
                z-index: 15;
            }
            .marker.vertical-m {
                left: auto !important;
                right: 0px !important;
                width: 10px !important;
                height: 4px !important;
                border-radius: 2px;
                z-index: 15;
            }
            .marker.default-marker {
                background: #4ea8de !important;
                box-shadow: 0 0 4px rgba(78, 168, 222, 0.8);
            }
        `;
        document.head.appendChild(style);
    }

    setupTopLeftUI() {
        let bar = document.getElementById('top-left-bar');
        if (!bar) {
            bar = document.createElement('div');
            bar.id = 'top-left-bar';
            bar.innerHTML = `
                <div class="top-left-Controls">
                    <button id="btn-lang-switch" class="top-ui-btn" title="${this.t('langTooltip')}"></button>
                    <button id="btn-fullscreen-toggle" class="top-ui-btn" title="${this.t('fullscreenTooltip')}">
                        ${SVG_FULLSCREEN_ENTER}
                    </button>
                </div>
                <div id="model-identity-badge"></div>
            `;
            document.body.appendChild(bar);
        }

        this.langBtn = document.getElementById('btn-lang-switch');
        this.fullscreenBtn = document.getElementById('btn-fullscreen-toggle');
        this.identityBadge = document.getElementById('model-identity-badge');

        this.updateLangButtonLabel();
        this.updateModelIdentityDisplay(this.currentModelName);

        if (this.langBtn) {
            this.langBtn.addEventListener('click', () => {
                this.lang = this.lang === 'en' ? 'fr' : 'en';
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
    }

    updateLangButtonLabel() {
        if (!this.langBtn) return;
        if (this.lang === 'en') {
            this.langBtn.innerHTML = `<span style="color:#ffd700;">EN</span> <span style="opacity:0.4;">|</span> <span style="opacity:0.6;">FR</span>`;
        } else {
            this.langBtn.innerHTML = `<span style="opacity:0.6;">EN</span> <span style="opacity:0.4;">|</span> <span style="color:#ffd700;">FR</span>`;
        }
    }

    // Point 7: Format model identity as "Type Gender - Height cm"
    updateModelIdentityDisplay(rawModelString) {
        if (!this.identityBadge || !rawModelString) return;
        const clean = rawModelString.replace(/^.*[\\/]/, '').replace(/\.[^/.]+$/, '');
        const match = clean.match(/^(.+)_(man|woman)_(\d+)$/i);
        if (match) {
            const rawType = match[1].split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
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
            document.documentElement.requestFullscreen().catch(err => {
                console.warn("Fullscreen request failed:", err);
            });
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }

    // Point 15: Merge Info panel and Edit controls inside #controls-panel
    setupMergedBottomLeftPanel() {
        if (!this.controlsPanel) return;

        // Wrap existing children of #controls-panel into #merged-edit-section
        this.editSection = document.createElement('div');
        this.editSection.id = 'merged-edit-section';
        while (this.controlsPanel.firstChild) {
            this.editSection.appendChild(this.controlsPanel.firstChild);
        }

        // Create Info section at the top of #controls-panel
        this.descSection = document.createElement('div');
        this.descSection.id = 'merged-desc-section';
        this.descSection.style.display = 'none';
        this.descSection.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
                <span style="color: #ffd700; font-weight: bold; border: 2px solid #ffd700; border-radius: 50%; width: 18px; height: 18px; display: inline-flex; justify-content: center; align-items: center; font-size: 12px; flex-shrink: 0;">i</span>
                <strong id="desc-panel-title" style="font-size: 14px; color: #ffd700;"></strong>
            </div>
            <div id="desc-panel-content" style="font-size: 13px; line-height: 1.45; color: #ddd;"></div>
        `;

        // Create subtle grey horizontal separator
        this.mergedDivider = document.createElement('hr');
        this.mergedDivider.id = 'merged-desc-divider';
        this.mergedDivider.style.display = 'none';

        this.controlsPanel.appendChild(this.descSection);
        this.controlsPanel.appendChild(this.mergedDivider);
        this.controlsPanel.appendChild(this.editSection);
    }

    getLocalizedName(rawKey, data) {
        if (data && data.name && typeof data.name === 'object') {
            return data.name[this.lang] || data.name.en || data.name.fr || rawKey.replace(/_/g, ' ');
        }
        const baseKey = (data && typeof data.name === 'string' ? data.name : rawKey).replace(/_/g, ' ').trim();
        const lookup = MEAS_NAME_DICT[baseKey.toLowerCase()];
        if (lookup) {
            return lookup[this.lang] || lookup.en || baseKey;
        }
        return baseKey;
    }

    getLocalizedDesc(data) {
        if (!data || !data.description) return "";
        if (typeof data.description === 'object') {
            return (data.description[this.lang] || data.description.en || data.description.fr || "").trim();
        }
        return String(data.description).trim();
    }

    applyLanguageToDOM() {
        const titleEl = document.querySelector('.legend-header h2');
        if (titleEl) titleEl.textContent = this.t('measurementsTitle');

        const adjustHeaderEl = this.editSection ? this.editSection.querySelector('.controls-header h4') : null;
        if (adjustHeaderEl) adjustHeaderEl.textContent = this.t('adjustTitle');

        const btnReset = document.getElementById('btn-reset-slider');
        if (btnReset) {
            btnReset.textContent = `\u21ba ${this.t('resetBtn')}`;
            btnReset.title = this.t('resetTooltip');
        }

        if (this.editSection) {
            const vLabels = this.editSection.querySelectorAll('.vertical-slider-container .slider-label');
            if (vLabels.length >= 2) {
                vLabels[0].textContent = this.t('highWaist');
                vLabels[1].textContent = this.t('lowWaist');
            }
            const hGroups = this.editSection.querySelectorAll('.horiz-group .slider-label');
            if (hGroups.length >= 2) {
                const curTh = this.sliderTheta ? parseFloat(this.sliderTheta.value) : 0;
                const curPh = this.sliderPhi ? parseFloat(this.sliderPhi.value) : 0;
                hGroups[0].innerHTML = `${this.t('tiltFB')}<strong id="label-val-theta" style="color: var(--accent);">${curTh > 0 ? '+' : ''}${curTh.toFixed(1)}\u00b0</strong>)`;
                hGroups[1].innerHTML = `${this.t('tiltLR')}<strong id="label-val-phi" style="color: var(--accent);">${curPh > 0 ? '+' : ''}${curPh.toFixed(1)}\u00b0</strong>)`;
            }
        }

        if (this.sideToggleBtn && this.sideToggleStates) {
            this.updateSideToggleStates();
            this.sideToggleBtn.textContent = this.sideToggleStates[this.currentFilterStateIndex].text;
            this.sideToggleBtn.title = this.t('filterTooltip');
        }

        // Update measurement names in legend
        this.activeMeasurements.forEach(mObj => {
            if (mObj.nameSpan) {
                mObj.nameSpan.textContent = this.getLocalizedName(mObj.groupKey || mObj.id, mObj.rawData);
            }
        });

        // Refresh open description/adjustment panel if a measurement is selected
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
        this.applyLanguageToDOM();

        const loadData = async (obj, json) => {
            await this.loadAvatar(obj);
            await this.loadMeasurements(json);
            this.frameModelFullHeight();
        };

        try {
            if (!this.objPath || !this.jsonPath) throw new Error(this.t('missingPaths'));
            await loadData(this.objPath, this.jsonPath);
        } catch (error) {
            console.warn("Requested model failed, loading fallback model...", error);
            this.showToast(this.t('modelNotFound'), true);
            
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
                await loadData('models/average_man_182.obj', 'measurements/average_man_182.json');
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
        this.animate();
    }

    // Point 3: Fit 3D model to full viewport height with ~0.5 cm top and bottom margin
    frameModelFullHeight() {
        this.avatarGroup.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(this.avatarGroup);
        if (box.isEmpty()) return;

        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        // 0.5 cm at standard 96 DPI is ~19 pixels top and 19 pixels bottom
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

    showToast(message, isError = false) {
        const toast = document.createElement('div');
        toast.style.position = 'absolute';
        toast.style.top = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.padding = '12px 24px';
        toast.style.background = isError ? 'rgba(220, 53, 69, 0.95)' : 'rgba(78, 168, 222, 0.95)';
        toast.style.color = '#fff';
        toast.style.borderRadius = '8px';
        toast.style.fontFamily = 'system-ui, -apple-system, sans-serif';
        toast.style.fontSize = '14px';
        toast.style.fontWeight = 'bold';
        toast.style.zIndex = '9999';
        toast.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
        toast.style.backdropFilter = 'blur(10px)';
        toast.style.transition = 'opacity 0.3s ease-in-out';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        // Point 1: Solid #1F2123 background
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

        // Point 4: F11 and Escape keyboard shortcuts for fullscreen
        window.addEventListener('keydown', (e) => {
            if (e.key === 'F11') {
                e.preventDefault();
                this.toggleFullscreen();
            } else if (e.key === 'Escape' && document.fullscreenElement && document.exitFullscreen) {
                document.exitFullscreen();
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
            if (lblTh) lblTh.textContent = `${th_val > 0 ? '+' : ''}${th_val.toFixed(1)}\u00b0`;
            if (lblPh) lblPh.textContent = `${ph_val > 0 ? '+' : ''}${ph_val.toFixed(1)}\u00b0`;
            
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

    updateSideToggleStates() {
        const lblL = this.t('leftShort');
        const lblR = this.t('rightShort');
        this.sideToggleStates = [
            { text: this.t('defaultFilter'), filter: 'DEFAULT' },
            { text: `${lblL} / ${lblR}`, filter: 'ALL' },
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
        sideToggle.title = this.t('filterTooltip');
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

        // Point 10: SVG Eye icon for global visibility
        const eyeToggle = document.createElement('div');
        eyeToggle.className = 'visibility-toggle';
        eyeToggle.title = this.t('toggleAllTooltip');
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
        
        let isClosed = data.is_closed_loop === true || data.is_closed === true;
        if (data.type === 'slicer') isClosed = true;
        
        if (points.length > 2) {
            const dist = points[0].distanceTo(points[points.length - 1]);
            if (dist < 0.04) {
                isClosed = true;
            }
            if (isClosed && dist < 0.02) {
                points.pop(); 
            }
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

        if (this.getLocalizedDesc(data) !== "") {
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
            groupKey: name,
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
        const descText = this.getLocalizedDesc(data);
        const displayName = this.getLocalizedName(name, data);

        div.innerHTML = `
            <div class="color-hint" style="position: absolute; left: -8px; top: 50%; transform: translate(-50%, -50%); width: 14px; height: 14px; background: rgba(0,0,0,0.65); border: 1px solid rgba(255,255,255,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; pointer-events: none; z-index: 2;">
                <span style="font-size: 8px; line-height: 1;">&#127912;</span>
            </div>
            <input type="color" class="color-picker" value="${mObj.color}" title="${this.t('changeColorTooltip')}" style="position: absolute; left: -16px; top: 0; width: 16px; height: 100%; opacity: 0; cursor: pointer; pointer-events: none; z-index: 3;">
            
            <div class="legend-info" style="width: 100%; display: flex; flex-direction: column;">
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <div style="display: flex; align-items: center; gap: 6px; min-width: 0;">
                        <span class="legend-name" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 13px;">${displayName}</span>
                        ${descText ? `<span class="info-icon" style="color: #ffd700; font-weight: bold; border: 1.5px solid #ffd700; border-radius: 50%; width: 14px; height: 14px; display: inline-flex; justify-content: center; align-items: center; font-size: 10px; cursor: help; flex-shrink: 0;" title="${this.t('infoAvailable')}">i</span>` : ''}
                        ${hasGrid ? `<span title="${this.t('editableMeas')}" style="background: rgba(78, 168, 222, 0.15); color: #4ea8de; padding: 1px 4px; border-radius: 3px; font-size: 9px; border: 1px solid #4ea8de; letter-spacing: 0.5px; font-weight: bold; white-space: nowrap; flex-shrink: 0;">EDIT</span>` : ''}
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px; margin-left: auto; padding-left: 8px; flex-shrink: 0;">
                        <span class="legend-value" style="white-space: nowrap; font-size: 13px;">${data.value_cm.toFixed(1)} cm</span>
                        <div class="visibility-toggle ${!mObj.isVisible ? 'off' : ''}" title="${this.t('toggleSingleTooltip')}" style="cursor: pointer; flex-shrink: 0;">
                            ${mObj.isVisible ? SVG_EYE_OPEN : SVG_EYE_CLOSED}
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.legendContent.appendChild(div);

        mObj.domElement = div;
        mObj.hudTargetElement = div;
        mObj.nameSpan = div.querySelector('.legend-name');
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
            eyeIcon.innerHTML = mObj.isVisible ? SVG_EYE_OPEN : SVG_EYE_CLOSED;
            div.classList.toggle('hidden-item', !mObj.isVisible);
        });

        div.addEventListener('click', () => this.selectMeasurement(mObj));
        this.activeMeasurements.push(mObj);
    }

    // Points 8, 10, 11, 12: Paired measurement on a single compact line with round grey L/R buttons
    createPairedMeasurementVisuals(groupName, items) {
        const builtItems = {};
        items.forEach(entry => {
            const mObj = this.build3DTubeForMeasurement(entry.name, entry.data);
            if (mObj) {
                mObj.groupKey = groupName;
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
        const descText = this.getLocalizedDesc(firstObj.rawData);
        const displayName = this.getLocalizedName(groupName, firstObj.rawData);

        div.innerHTML = `
            <div class="color-hint" style="position: absolute; left: -8px; top: 50%; transform: translate(-50%, -50%); width: 14px; height: 14px; background: rgba(0,0,0,0.65); border: 1px solid rgba(255,255,255,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; pointer-events: none; z-index: 2;">
                <span style="font-size: 8px; line-height: 1;">&#127912;</span>
            </div>
            <input type="color" class="color-picker" value="${firstObj.color}" title="${this.t('changeColorTooltip')}" style="position: absolute; left: -16px; top: 0; width: 16px; height: 100%; opacity: 0; cursor: pointer; pointer-events: none; z-index: 3;">
            
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; gap: 8px;">
                <div style="display: flex; align-items: center; gap: 6px; min-width: 0;">
                    <span class="legend-name" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 13px;">${displayName}</span>
                    ${descText ? `<span class="info-icon" style="color: #ffd700; font-weight: bold; border: 1.5px solid #ffd700; border-radius: 50%; width: 14px; height: 14px; display: inline-flex; justify-content: center; align-items: center; font-size: 10px; cursor: help; flex-shrink: 0;" title="${this.t('infoAvailable')}">i</span>` : ''}
                    ${hasGrid ? `<span title="${this.t('editableMeas')}" style="background: rgba(78, 168, 222, 0.15); color: #4ea8de; padding: 1px 4px; border-radius: 3px; font-size: 9px; border: 1px solid #4ea8de; letter-spacing: 0.5px; font-weight: bold; white-space: nowrap; flex-shrink: 0;">EDIT</span>` : ''}
                </div>
                
                <div style="display: flex; align-items: center; gap: 8px; margin-left: auto; flex-shrink: 0;">
                    <div class="lr-inline-container"></div>
                    <div class="visibility-toggle" title="${this.t('toggleGroupTooltip')}" style="cursor: pointer; flex-shrink: 0;">
                        ${SVG_EYE_OPEN}
                    </div>
                </div>
            </div>
        `;
        this.legendContent.appendChild(div);

        const sidesContainer = div.querySelector('.lr-inline-container');
        const colorPicker = div.querySelector('.color-picker');
        const eyeIcon = div.querySelector('.visibility-toggle');
        const nameSpan = div.querySelector('.legend-name');

        div._forceVisibility = (forceState) => {
            if (groupMasterVisible !== forceState) {
                eyeIcon.click();
            }
        };

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
                
                if (mObj.sidePill) {
                    mObj.sidePill.classList.toggle('side-hidden', !mObj.isChecked);
                }
                if (mObj.roundBtn) {
                    mObj.roundBtn.classList.toggle('checked', mObj.isChecked);
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
            }
            syncGroupVisibility();
        });

        [
            { key: 'LEFT', shortLabel: 'L', titleKey: 'leftTitle' },
            { key: 'RIGHT', shortLabel: 'R', titleKey: 'rightTitle' }
        ].forEach(sideCfg => {
            const mObj = builtItems[sideCfg.key];
            if (!mObj) return;

            const statusTag = mObj.rawData.is_clone ? this.t('cloneTag') : this.t('originalTag');
            const unit = document.createElement('div');
            unit.className = `lr-side-unit ${!mObj.isChecked ? 'side-hidden' : ''}`;
            unit.title = `${this.t(sideCfg.titleKey)} (${statusTag})`;
            unit.innerHTML = `
                <button type="button" class="lr-round-btn ${mObj.isChecked ? 'checked' : ''}">${sideCfg.shortLabel}</button>
                <span class="lr-val-span">${mObj.rawData.value_cm.toFixed(1)} cm</span>
            `;
            sidesContainer.appendChild(unit);

            const roundBtn = unit.querySelector('.lr-round-btn');

            mObj.domElement = div;
            mObj.nameSpan = nameSpan;
            mObj.sidePill = unit;
            mObj.roundBtn = roundBtn;
            mObj.hudTargetElement = unit;
            mObj.valueSpan = unit.querySelector('.lr-val-span');

            mObj.setSideChecked = (state) => {
                mObj.isChecked = state;
                if (mObj.isChecked && !groupMasterVisible) {
                    groupMasterVisible = true;
                }
                syncGroupVisibility();
            };

            // Clicking the round L/R button toggles visibility of that side
            roundBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                mObj.setSideChecked(!mObj.isChecked);
            });

            // Clicking the measurement value selects this side for inspection/adjustment
            unit.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!mObj.isChecked || !groupMasterVisible) {
                    mObj.setSideChecked(true);
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

        // 1. Info Section
        if (hasInfo && this.descSection) {
            this.descSection.style.display = 'block';
            const titleEl = this.descSection.querySelector('#desc-panel-title');
            if (titleEl) {
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
        } else if (this.descSection) {
            this.descSection.style.display = 'none';
        }

        // 2. Subtle Grey Divider when BOTH Info and Edit are visible
        if (this.mergedDivider) {
            this.mergedDivider.style.display = (hasInfo && hasGrid) ? 'block' : 'none';
        }

        // 3. Edit Section
        if (hasGrid && this.editSection) {
            this.editSection.style.display = 'block';
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
            if (lblTh) lblTh.textContent = `${curTh > 0 ? '+' : ''}${parseFloat(curTh).toFixed(1)}\u00b0`;
            if (lblPh) lblPh.textContent = `${curPh > 0 ? '+' : ''}${parseFloat(curPh).toFixed(1)}\u00b0`;
        } else if (this.editSection) {
            this.editSection.style.display = 'none';
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
            minPh, maxPh,
            customMarkers: data.customMarkers || []
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
        
        let isClosed = item.rawData.is_closed_loop === true || item.rawData.is_closed === true;
        if (item.rawData.type === 'slicer') isClosed = true;
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

    // Point 16: Render default reset markers below horizontal sliders with clear tooltip
    renderMarkers(item) {
        if (!item.gridEngine) return;
        const eng = item.gridEngine;

        const toPercent = (val, min, max) => {
            if (Math.abs(max - min) < 1e-6) return 50;
            return ((val - min) / (max - min)) * 100;
        };

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
            defMarker.style[styleProp] = `${defPct}%`;
            defMarker.title = `${this.t('defaultMarkerTooltip')} (${defVal})`;
            
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
                    cMarker.style[styleProp] = `${pct}%`;
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

const app = new MeasurementViewer();
app.init();