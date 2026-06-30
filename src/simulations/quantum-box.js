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
        
    }
}