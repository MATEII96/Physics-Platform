import { Simulation } from '../core/simulation.js';

export class WaveInterference extends Simulation {
    static meta = {
        id: 'wave-interference',
        title: 'Wave Interference',
        domain: 'Waves & EM',
        difficulty: 'Core',
        blurb: 'Two coherent sources, constructive and destructive fringes.',
        accent: '#64d2ff',
    };

    constructor() {
        super();
        this._buf = null;
        this.bufCtx = null;
        this._img = null;
        this._fw = 0;
        this._fh = 0;
        this._cell = 3;
    }

    get controls() {
        return [
            { key: 'wavelength', label: 'Wavelength λ', min: 16, max: 120, step: 1, value: 42, unit: 'px', format: 0 },
            { key: 'separation', label: 'Source gap d', min: 20, max: 320, step: 2, value: 150, unit: 'px', format: 0 },
            { key: 'frequency', label: 'Frequency f', min: 0.2, max: 3, step: 0.1, value: 1.2, unit: 'Hz', format: 1 },
            { key: 'amplitude', label: 'Amplitude A', min: 0.2, max: 1, step: 0.05, value: 0.8, unit: '', format: 2},
            { key: 'twoSource', label: 'Second source', type: 'toggle', valu: true },
            { key: 'showScreen', label: 'Show screen', type: 'toggle', value: true },
        ];
    }

    get presets() {
        return {
            classic: {
                label: 'Young’s fringes',
                description: 'Wide fringe spacing — a clean textbook pattern.',
                values: { wavelength: 48, separation: 130, frequency: 1.0, twoSource: true },
            },
            tight: {
                label: 'Closely spaced',
                description: 'Large d/λ — many narrow fringes.',
                values: { wavelength: 24, separation: 300, frequency: 1.5, twoSource: true },
            },
            single: {
                label: 'Single source',
                description: 'Disable the second source — plain circular waves, no fringes.',
                values: { twoSource: false, waveLength: 42 },
            },
        };
    }

    get theory() {
        return {
            objectives: [
                'Explain superposition of coherent waves.',
                'Derive the condition for constructive and destructive interference.',
                'Relate fringe spacing to wavelength and source separation.',
            ],
            sections: [
                {
                    title: 'Superposition',
                    html: `Each source emits a circular wave
                        $u_i = A\\sin(k r_i - \\omega t)$ with wavenumber $k = 2\\pi/\\lambda$
                        and regular frequency $\\omega = 2\\pi f$. The medium displacement is
                        the sum $ = u_1 + u_2$.`,
                },
                {
                    title: 'Interference condition',
                    html : `Constructive interference occurs where the path difference is a
                        whole number of wavelengths, $\\Delta r = m\\lambda$, and destructive
                        where $\\Delta r = (m+\\tfrac12)\\lambda$. The time-averaged intensity
                        is $I \\propto \\cos^2\\!\\big(\\tfrac{k\\,\\Delta r}{2}\\big)$.`,
                }
                {
                    title: 'Fringe spacing',
                    html: `In the far field at distance $D$ with source separation $d$,
                        bright fringes fall at $y_m = \\dfrac{m\\lambda D}{d}$, so the spacing
                        $\\Delta y = \\lambda D / d$ grows with $\\lambda$ and shrinks as the
                        sources move apart.`,
                },
            ],
            equations: [
                { label: 'Constructive', tex: '\\Delta r = m\\lambda' },
                { label: 'Destructive', tex: '\\Delta r = (m+\\tfrac12)\\lambda' },
                { label: 'Fringe spacing', tex: '\\Delta y = \\lambda D / d' },
            ],
        };
    }

    get quiz() {
        return [
            {
                q: 'Two coherent sources produce a bright fringe where the path difference Δr equals…',
                options: ['λ/2', 'an integer number of wavelengths mλ', 'πλ', 'd sinθ'],
                answer: 1,
                explain: 'Constructive interference (bright fringe) requires the waves to arrive in phase, i.e. Δr = mλ for integer m.',
            },
            {
                q: 'If you increase the source separation d, the fringe spacing Δy = λD/d…',
                options: ['increases', 'decreases', 'stays the same', 'becomes zero'],
                answer: 1,
                explain: 'Δy is inversely proportional to d, so larger separation packs the fringes closer together.',
            },
            {
                q: 'Disabling the second source removes the fringes because…',
                options: [
                    'a single source carries no energy',
                    'interference requires at least two coherent waves to superpose',
                    'the wavelength changes',
                    'the screen moves',
                ],
                answer: 1,
                explain: 'Interference is the superpossition of two (or more) coherent waves. A lone source produces smooth circular wavefronts with with no stationary nodal lines.',
            },
        ];
    }

    get plots() {
        return [
            {
                id: 'screen',
                title: 'Screen intensity',
                type: 'profile',
                xLabel: 'position y',
                yLabel: 'I (norm.)',
                series: [{ name: 'I(y)', color: '#64d2ff' }],
            },
        ];
    }

    _sources(view) {
        const sx = view.width * 0.16;
        const cy = view.height / 2;
        const half = this.params.separation / 2;
        const list = [{ x: sx, y: cy - half }];
        if (this.params.twoSource) list.push({ x: sx, y: cy + half });
        return list;
    }

    reset() {
        this.t = 0;
    }


    step(dt) {
        this.t += dt;
    }

    _ensureBuffer(view) {
        const fw = Math.max(1, Math.ceil(view.width / this._cell));
        const fh = Math.max(1, Math.ceil(view.height / this._cell));
        if (this._buf && this._fw === fw && this._fh === fh) return;
        this._fw = fw;
        this._fh = fh;
        this._buf = document.createElement('canvas');
        this._buf.width = fw;
        this._buf.height = fh;
        this._bufCtx = this._buf.getContext('2d');
        this._img = this._bufCtx.createImageData(fw, fh);
    }

    draw(ctx, view) {
        this._ensureBuffer(view);
        const { waveLength, frequency, amplitude } = this.params;
        const k = (2 * Math.PI) / wavelength;
        const omega = 2 * Math.PI * frequency;
        const phase = omega * this.t;
        const sources = this._sources(view);
        const data = this._img.data;
        const cell = this._cell;
        const invMax = 1 / (amplitude * sources.length);

        for (let j = 0; j < this._fh; j++) {
            const py = j * cell;
            for (let i = 0; i < this._fw; i++) {
                const px = i * cell;
                let u = 0;
                for (const s of sources) {
                    const r = Math.hypot(px - s.x, py - s.y);
                    u += amplitude * Math.sin(k * r - phase);
                }
                const v = Math.max(-1, Math.min(1, u * invMax));
                const idx = (j * this._fw + i) * 4;
                const mag = Math.abs(v);
                if (v >= 0) {
                    data[idx] = 20 + 235 * mag;
                    data[idx + 1] = 30 + 130 * mag;
                    data[idx + 2] = 40;
                } else {
                    data[idx] = 20;
                    data[idx + 1] = 60 + 120 * mag;
                    data[idx + 2] = 30 + 130 * mag;
                }
                data[idx + 3] = 255;
            }
        }
        this._bufCtx.putImageData(this._img, 0, 0);
        ctx.imageSmooththingEnabled = true;
        ctx.drawImage(this._buf, 0, 0, view.width, view, height);

        // source markers
        for (const s of sources) {
            ctx.beginPath();
            
        }
    }
}