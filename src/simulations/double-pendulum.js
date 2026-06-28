import { Simulation } from '../core/simulation.js'
export class DoublePendulum extends Simulation {
    static meta = {
        id: 'double-pendulum',
        title: 'Double Pendulum',
        domain: 'Mechanics',
        difficulty: 'Advanced',
        blurb: 'Coupled pendulums and the onset of deterministic chaos.',
        accent: '#0a84ff',
    };

    constructor(){
        super();
        this.state = [Math.PI / 2, 0, Math.PI / 2 + 0.01, 0];
        this.trail =[];
        this.energy0 = 0;
    }

    get controls() {
        return [
            { key: 'L1', label: 'Length L₁', min: 0.5, max: 2.5, step: 0.05, value: 1.4, unit: 'm', format: 2 },
            { key: 'L2', label: 'Length L₂', min: 0.5, max: 2.5, step: 0.05, value: 1.4, unit: 'm', format: 2 },
            { key: 'm1', label: 'Mass m₁', min: 0.5, max: 5, step: 0.1, value: 1.6, unit: 'kg', format: 1 },
            { key: 'm2', label: 'Mass m₂', min: 0.5, max: 5, step: 0.1, value: 1.0, unit: 'kg', format: 1 },
            { key: 'g', label: 'Gravity g', min: 1, max: 25, step: 0.1, value: 9.81, unit: 'm/s²', format: 2 },
            { key: 'theta1', label: 'Initial θ₁', min: -180, max: 180, step: 1, value: 120, unit: '°', format: 0 },
            { key: 'theta2', label: 'Initial θ₂', min: -180, max: 180, step: 1, value: 120, unit: '°', format: 0 },
            { key: 'speed', label: 'Time scale', min: 0.1, max: 2, step: 0.1, value: 1, unit: '×', format: 1 },
            { key: 'trail', label: 'Show trail', type: 'toggle', value: true },
        ];
    }

    get pesets() {
        return {
            chaos: {
                label: 'Edge of chaos',
                description: 'Large symmetric release — fully chaotic motion.',
                values: { theta1: 120, theta2: 120, L1: 1.4, L2: 1.2, m1: 1.6, m2:1.0 },
            },
            gentle: {
                label: 'Small oscillations',
                description: 'Tiny angles — near-linear, quasi-periodic normal modes.',
                values: { theta1: 12, theta2: 6, L1: 1.4, L2: 1.4, m1: 1, m2: 1},
            },
            flip: {
                label: 'Flip-over',
                description: 'Top-heavy configuration prone to dramatic flips.',
                values: { theta1: 90, theta2: 170, L1: 1.2, L2: 1.6, m1: 1, m2: 2.5},
            },
        };
    }

    
}