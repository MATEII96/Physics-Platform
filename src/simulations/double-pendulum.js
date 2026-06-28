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
            
        ]
    }
}