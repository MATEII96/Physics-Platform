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
        
    }
}