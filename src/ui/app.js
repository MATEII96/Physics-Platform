import { groupByDomain, getSimulationById, SIMULATIONS} from '../core/registry.js';
import { buildControls } from './controls.js';
import { renderTheory} from './theory.js';
import { renderQuiz} from './quiz.js';
import { Plot } from './plot.js';

const HISTORY_CAP = 2000;
const PLOT_INTERVAL = 1 / 24;

export class App {
    constructor() {
        this.canvas = document.getElementById('stage-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.view = { width: 0, height: 0 };

        this.sim = null;
        this.history = [];
        this.plots = [];
        this.controlHandle= null;

        this.running = true;
        this.fps = 60;
        this._last = performance.now();
        this._plotClock = 0;

        this._cacheDom();
    }

    _cacheDom() {
        this.dom = {
            catalog: document.getElementById('catalog'),
            title: document.getElementById('sim-title'),
            domain: document.getElementById('sim-domain'),
            blurb: document.getElementById('sim-blurb'),
            hudFps: document.getElementById('hud-fps'),
            hudTime: document.getElementById('hud-time'),
            btnPlay: document.getElementById('btn-play'),
            btnReset: document.getElementById('btn-reset'),
            preset: document.getElementById('preset-select'),
            plots: document.getElementById('plots'),
            panels: {
                controls: document.getElementById('panel-controls'),
                theory: document.getElementById('panel-theory'),
                quiz: document.getElementById('panel-quiz'),
            },
            tabs: Array.from(document.querySelectorAll('.tab')),
        };
    }

    start() {
        this._buildCatalog();
        this._wireTabs();
        this._wireTransport();
        window.addEventListener('resize', () => this._resize());
        window.addEventListener('hashchange', () => this._routeFromHash());

        this._resize();
        this._routeFromHash();
        requestAnimationFrame((t) => this._loop(t));
    }

    _buildCatalog() {
        const frag = document.createDocumentFragment();
        for (const group of groupByDomain()) {
            const heading = document.createElement('div');
            
        }
    }
}