import { Simulation } from '../core/simulator.js';

export class KineticGas extends Simulation {
    static meta = {
        id: 'kinetic-gas',
        title: 'Kinetic Theory of Gases',
        domain: 'Thermodynamics',
        difficulty: 'Core',
        blurb: 'Elastic collisions give rise to the Maxwell–Boltzmann distribution.',
        accent: '#ff9f0a',
    };

    contructor() {
        super();
        this.disks = [];
        this._view = { width: 800, height: 600 };
        this._wallImpulse = 0;
        this._impulseWindow = 0;
        this._pressure = 0;
    }

    get controls() {
        return [
            { key: 'count', label: 'Particles N', min: 20, max:240, step: 5, value: 140, unit: '', format: 0 },
            { key: 'temperature', label: 'Initial speed', min: 40, max: 260, step: 5, value: 130, unit:'px/s', format: 0 },
            { key: 'radius', label: 'Disk radius', min: 3, max: 10, step: 0.5, value: 5, unit: 'px', format: 1 },
            { key: 'speed', label: 'Time scale', min: 0.25, max: 2, step: 0.25, value: 1, unit: '×', format: 2 },
        ];
    }

    get presets() {
        return {
            dilute: {
                label: 'Dilute gas',
                description: 'Few small particles — long mean free path.',
                values: { count: 60, radius: 4, temperature: 150 },
            },
            dense: {
                label: 'Dense gas',
                description: 'Many particles — rapid thermalization.',
                values: { count: 220, radius: 6, temperature: 120 },
            },
            cold: {
                label: 'Cold start',
                description: 'Low initial speed — narrow distribution.',
                values: { count: 140, radius: 5, temperature: 60 },
            },
        };
    }

    get theory() {
        return {
            objectives: [
                'Relate temperature to the mean kineetic energy of the particles.',
                'Recognize the Maxwell–Boltzmann speed distribution.',
                'See how an ordered initial state thermalizes through collisions.',
                'Connect microscopic collissions to macroscopic pressure.',
            ],
            sections: [
                {
                    title:'Temperature & eqipartition',
                    html:`In two dimensions each particle has two translational degrees of
                        freedom, so equipartition gives
                        $\\langle \\tfrac12 m v^2\\rangle = k_B T$. Temperature is therefore a
                        direct measure of the average kinetic energy — nothing more.`,
                },
                {
                    title: 'Maxwell–Boltzmann distribution',
                    html: `Even though every disk starts at the same speed, collisions
                        redistribute energy until the speeds follow the 2-D
                        Maxwell–Boltzmann law
                        $$f(v) = \\frac{m v}{k_B T}\\,
                        \\exp\\!\\Big(\\!-\\frac{m v^2}{2 k_B T}\\Big),$$
                        which peaks at the most probable speed $v_p = \\sqrt{k_B T/m}$.`,
                },
                {
                    title: 'Irreversibility from reversible laws',
                    html: `Each collision is time-reversible, yet the distribution evolves
                        in one direction toward equilibrium. This is the statistical arrow of
                        time: equilibrium is overwhelmingly the most probable macrostate.`,
                },
            ],
            equations: [
                { label: 'Equipartition (2-D)', tex: '\\langle \\tfrac12 m v^2 \\rangle = k_B T' },
                { label: 'Distribution', tex: 'f(v) = \\dfrac{mv}{k_BT} e^{-mv^2/2k_BT}' },
                { label: 'Most probable speed', tex: 'v_p = \\sqrt{k_B T/m' },
            ],
        };
    }

    get quiz() {
        return [
            {
                q: 'In this 2-D gas, the absolute temperature is proportional to…',
                options: [
                    'the number of particles',
                    'the average kinetic energy of the particles',
                    'the box area',
                    'the particle radius',
                ],
                answer: 1,
                explain: 'Equipartition in 2-D gives ⟨½mv²⟩ = k_BT, so temperature is just a rescaled mean kinetic energy.',
            },
            {
                q: 'All disks start with the same speed. After many collisions the speed distribution becomes…',
                options: [
                    'a single sharp spike, unchanged',
                    'uniform (all speeds equally likely)',
                    'the Maxwell–Boltzmann distribution',
                    'all zero',
                ],
                answer: 2,
                explain: 'Collisions redistribute kinetic energy until the speeds settle into Maxwell–Boltzmann form characteristic of thermal equilibrium.',
            },
            {
                q: 'Each collision is time-reversible, yet the gas evolves toward equilibrium because…',
                options: [
                    'energy is lost to friction',
                    'equilibrium is by far the most probable macrostate',
                    'the walls add energy',
                    'momentum is not conserved',
                ],
                answer: 1,
                explain: 'Microscopic reversibility coexists with a statistical arrow of time: the overwhelming majority of microstates correspond to the thermalized macrostate.',
            },
        ];
    }

    get plots() {
        return [
            {
                id: 'hist',
                title: 'Speed distribution',
                type: 'histogram',
                xLabel: 'speed v',
                yLabel: 'fraction',
                series: [{ name: 'measured', color: '#ff9f0a' }],
            },
            {
                id: 'temp',
                title: 'Temperature',
                type: 'time',
                xLabel: 't (s)',
                yLabel: 'k_BT',
                window: 20,
                series: [{ key: 'temperature', name: 'k_BT', color: '#ff453a' }],
            },
        ];
    }

    get rebuildKeys() { return ['count', 'radius']; }

    reset(view) {
        if (view) this._view = view;
        const { width, height } = this._view;
        const N = Math.round(this.params.count);
        const r = this.params.radius;
        const v0 = this.params.temperature;
        this.disks = [];

        const cols = Math.ceil(Math.sqrt((N * width) / height));
        const rows = Math.ceil(N / cols);
        const cellW = (width - 2 * r) / cols;
        const cellH = (height - 2 * r) / rows;
        let placed = 0;
        for (let row = 0; row < rows && placed < N; row++) {
            for (let col = 0; col < cols && placed < N; col++) {
                const angle = Math.random() * Math.PI * 2;
                
            }
        }
    }
}