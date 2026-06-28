import { DoublePendulum } from '../simulations/double-pendulum.js';
import { WaveInterference} from '../simulations//wave-interference.js';
import { QuantomBox } from '../simulations/quantum-box.js';
import { KineticGas } from '../simulations/kinetic-gas.js';

export const SIMULATIONS = [
    DoublePendulum,
    WaveInterference,
    QuantumBox,
    KineticGas,
];

export const DOMAINS = [
    { name: 'Mechanics', color: '#0a84ff' },
    { name: 'Waves & EM', color: '#64d2ff' },
    { name: 'Quantum', color: '#bf5af2' },
    { name: 'Thermodynamics', color: '#ff9f0a' },
];

export function getSimulationById(id) {
    return SIMULATIONS.find((Sim) => Sim.meta.id === id) || null;
}

export function groupByDomain() {
    
}