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
            
        ]
    }
}