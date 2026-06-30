import { Simulation } from '../core/simulation.js';

// num. of basic states
const N_STATES = 4;

export class QuantumBox extends Simulation {
    static meta = {
        id: 'quantum-box',
        title: 'Particle in a Box',
        domain: 'Quantum',
        difficulty: 'Advanced',
        blurb: 'Energy quantization and the time evolution of a superposition.',
        accent: '#bf5af2',
    };

    constructor() {
        super();
        this.Nx = 280;
        this._xs = new Float64Array(this.Nx);
        this._phi = [];
        this._dirty = true;
    }

    get controls() {
        return [
            { key: 'L', label: 'Well width L', min: 1, max: 4, step: 0.1, value: 2, unit: '', format: 1 },
            { key: 'c1', label: '|c₁| state n=1', min: 0, max: 1, step: 0.05, value: 1, unit: '', format: 2 },
            { key: 'c2', label: '|c₂| state n=2', min: 0, max: 1, step: 0.05, value: 0.9, unit: '', format: 2 },
            { key: 'c3', label: '|c₃| state n=3', min: 0, max: 1, step: 0.05, value: 0, unit: '', format: 2 },
            { key: 'c4', label: '|c₄| state n=4', min: 0, max: 1, step: 0.05, value: 0, unit: '', format: 2 },
            { key: 'timeScale', label: 'Time scale', min: 0.05, max: 1.5, step: 0.05, value: 0.4, unit: '×', format: 2 },
            { key: 'showParts', label: 'Show Re/Im', type: 'toggle', value: true },
        ];
    }

    get presets() {
        return {
            stationary: {
                label: 'Ground state',
                description: 'Pure n=1 eigenstate — |ψ|² is stationary in time.',
                values: { c1: 1, c2: 0, c3: 0, c4: 0 },
            },
            sloshing: {
                label: 'Two-state beat',
                desccription: 'Equal mix of n=1 and n=2 — the density sloshes side to side.',
                values: { c1: 1, c2: 1, c3: 0, c4: 0 },
            },
            packet: {
                label: 'Localized packet',
                description: 'Several states combine into a more particle-like lump.',
                values: { c1: 1, c2: 1, c3: 0.8, c4: 0.5 },
            },
        };
    }

    get theory() {
        return {
            objectives: [
                'State the boundary conditions of the infinite square well.',
                'Identify the quantized energies Eₙ ∝ n².',
                'Understand a wavefunction as a superposition of eigenstates.',
                'Explain why a single eigenstate is "stationary".',
            ],
            sections: [
                {
                    title: 'Eigenstates',
                    html: `Inside the well the time-independent Schrödinger equation
                        $-\\dfrac{\\hbar^2}{2m}\\psi'' = E\\psi$ with $\\psi(0)=\\psi(L)=0$
                        gives the eigenfunctions
                        $$\\varphi_n(x) = \\sqrt{\\tfrac{2}{L}}\\,\\sin\\!\\Big(\\tfrac{n\\pi x}{L}\\Big),
                        \\qquad n = 1, 2, 3, \\ dots$$`,
                },
                {
                    title: 'Quantized energy',
                    html: `Only discrete energies are allowed,
                        $$E_n = \\frac{n^2\\pi^2\\hbar^2}{2mL^2}.$$
                        Energy scales as $n^2$ and as $1/L^2$ — squeeze the box and the
                        levels fly apart, the hallmark of quantum confident.`,
                },
                {
                    title: 'Time evolution',
                    html: `A general state evolves as
                        $\\psi(x,t)=\\sum_n c_n\\varphi_n(x)e^{-iE_n t/\\hbar}$. A single
                        eigenstate only picks up a phase, so $|\\psi|^2$ is
                        <em>stationary</em>. A superposition of states with diffrent $E_n$
                        beats at frequencies %(E_n-E_m)/\\hbar$, making the probability
                        density move.`
                },
            ],
            
        }
    }
}