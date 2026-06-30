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
            
        }
    }
}