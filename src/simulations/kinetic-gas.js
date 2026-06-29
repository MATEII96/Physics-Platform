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
            
        ]
    }
}