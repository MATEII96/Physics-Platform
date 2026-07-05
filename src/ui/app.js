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
            heading.className = 'catalog__group';
            heading.innerHTML = `<span class="catalog__dot" style="background:${group.color}"></span>${group.domain}`;
            frag.appendChild(heading);

            for (const Sim of group.items) {
                const item = document.createElement('button');
                item.className = 'catalog__item';
                item.dataset.id = Sim.meta.id;
                item.innerHTML = `
                    <span class="catalog__name">${Sim.meta.title}</span>
                    <span class="catalog__blurb">${Sim.meta.blurb}</span>`;
                item.addEventListener('click', () => { location.hash = `#/${Sim.meta.id}`; });
                frag.appendChild(item);
            }
        }
        this.dom.catalog.innerHTML = '';
        this.dom.catalog.appendChild(frag);
    }

    _routeFromHash() {
        const id = location.hash.replace(/^#\/?/, '');
        const Sim = getSimulationById(id) || SIMULATIONS[0];
        if (!this.sim || this.sim.constructor.meta.id !== Sim.meta.id) {
            this._select(Sim);
        }
    }

    _select(Sim) {
        this.sim = new Sim();
        this.sim.reset(this.view);
        this.history = [];

        const meta = Sim.meta;
        document.documentElement.style.setProperty('--sim-accent', meta.accent || '#0a84ff');
        document.title = `PhysiCraft — ${meta.title}`;
        this.dom.title.textContent = meta.title;
        this.dom.domain.textContent = meta.domain;
        this.dom.blurb.textContent = meta.blurb;

        for (const el of this.dom.catalog.querySelectorAll('.catalog__item')) {
            el.classList.toggle('catalog__item--active', el.dataset.id === meta.id);
        }

        this.controlsHandle = buildControls(this.dom.panels.controls, this.sim, (k, v) => this._onParam(k, v));
        renderTheory(this.dom.panels.theory, this.sim);
        renderQuiz(this.dom.panels.quiz, this.sim);
        this._buildPresets();
        this._buildPlots();
        this._setRunning(true);
    }

    _onParam(key, value) {
        if(!this.sim) return;
        this.sim.setParam(key, value);
        const rebuild = (this.sim.rebuildKeys || []).includes(key);
        if (rebuild) {
            this.sim.reset(this.view);
            this.history = [];
        }
    }

    _buildPresets() {
        const presets = this.sim.presets;
        const keys = Object.keys(presets);
        this.dom.preset.innerHTML = '<option value="">Presets…</options>';
        for (const key of keys) {
            const o = document.createElement('option');
            o.value = key;
            o.textContent = presets[key].label;
            this.dom.preset.appendChild(o);
        }
        this.dom.preset.disabled = keys.length === 0;
        this.dom.preset.onchange = () => {
            const name = this.dom.preset.value;
            if (!name) return;
            this.sim.applyPreset(name);
            this.sim.reset(this.view);
            this.history = [];
            this.controlsHandle.sync();
            this._setRunning(true);
        };
    }

    _wireTransport() {
        this.dom.btnPlay.addEventListener('click', () => this._setRunning(!this.running));
        this.dom.btnReset.addEventListener('click', () => {
            if (!this.sim) return;
            this.sim.reset(this.view);
            this.history = [];
            this._setRunning(true);
        });
    }

    _setRunning(on) {
        this.running = on;
        this.dom.btnPlay.textContent = on ? 'Pause' : 'Play';
        this.dom.btnPlay.classList.toggle('btn--primary', !on);
    }

    _wireTabs() {
        for (const tab of this.dom.tabs) {
            tab.addEventListener('click', () => {
                const name = tab.dataset.tab;
                for (const t of this.dom.tabs) t.classList.toggle('tab--active', t === tab);
                for (const [key, panel] of Object.entries(this.dom.panels)) {
                    panel.classList.toggle('panel-view--active', key === name);
                }
            });
        }
    }

    _buildPlots() {
        this.dom.plots.innerHTML = '';
        this.plots = [];
        for (const spec of this.sim.plots) {
            const card = document.createElement('div');
            card.className = 'plot-card';
            card.innerHTML = `<div class="plot-card__title">${spec.title}</div>`;
            const canvas = document.createElement('canvas');
            canvas.className = 'plot-card__canvas';
            card.appendChild(canvas);
            this.dom.plots.appendChild(card);
            this.plots.push({ spec, plot: new Plot(canvas, spec) });
        }
    }

    _renderPlots() {
        for (const { spec, plot } of this.plots) {
            if (spec.type === 'time' || spec.type === 'phase') {
                plot.render({ history: this.history });
            } else {
                const data = this.sim.plotData ? this.sim.plotData(spec.id, this.view) : null;
                plot.render({ data });
            }
        }
    }

    _resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.view = { width: rect.width, height: rect.height };
        this.canvas.width = Math.max(1, Math.round(rect.width * dpr));
        this.canvas.height = Math.max(1, Math.round(rect.height * dpr));
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        for (const { plot } of this.plots) plot.resize();
    }

    _loop(now) {
        const dt = Math.min((now - this._last) / 1000, 0.05);
        this._last = now;
        if (dt > 0) this.fps += (1 / dt - this.fps) * 0.08;

        if (this.sim) {
            if (this.running) {
                this.sim.step(dt, this.view);
                this.history.push(this.sim.sample());
                if (this.history.length > HISTORY_CAP) this.history.shift();
            }

            this.ctx.clearRect(0, 0, this.view.width, this.view.height);
            this.sim.draw(this.ctx, this.view);

            this.dom.hudFps.textContent = this.fps.toFixed(0);
            this.dom.hudTime.textContent = `${this.sim.t.toFixed(1)} s`;

            this._plotClock += dt;
            if (this._plotClock >= PLOT_INTERVAL) {
                this._plotClock = 0;
                this._renderPlots();
            }
        }

        requestAnimationFrame((t) => this._loop(t));
    }
}

export function bootstrap() {
    const app = new App();
    app.start();
}

export default App;