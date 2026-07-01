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
            equations: [
                { label: 'Energy levels', tex: 'E_n = \\dfrac{n^2\\pi^2\\hbar^2}{2mL^2}' },
                { label: 'Evolution', tex: '\\psi(x,t)=\\sum_n c_n\\varphi_n(x)\\,e^{-iE_n t/\\hbar}' },
            ],
        };
    }

    get quiz() {
        return [
            {
                q: 'How does the energy of the nth level depend on the quantum number n?',
                options: ['Eₙ ∝ n', 'Eₙ ∝ n²', 'Eₙ ∝ √n', 'Eₙ ∝ 1/n'],
                answer: 1,
                explain: 'Eₙ = n²π²ℏ²/(2mL²): the energy grows as the square of the quantum number.',
            },
            {
                q: 'Why is the probability density of a single eigenstate called "stationary"?',
                options: [
                    'The particle is at rest.',
                    'Its time factor e^{−iEₙt/ℏ} has modulus 1, so |ψ|² is time-independent.',
                    'Energy is zero.',
                    'The well prevents any motion.',
                ],
                answer: 1,
                explain: 'A pure eigenstate only acquires a global phase of unit modules, leaving |ψ|² unchanged in time. Motion appears only when states of diffrent ennergy are superposed.',
            },
            {
                q: 'If you halve the width L of the well, the ground-state energy E₁…',
                options: ['halves', 'doubles', 'quadruples', 'is unchanged'],
                answer: 2,
                explain: 'Since Eₙ ∝ 1/L², halving L multiplies the energy by 4 — stronger confinement costs more energy.',
            },
        ];
    }

    get plots() {
        return [
            {
                id: 'expectation',
                title: 'Expectation (x)',
                type: 'time',
                xLabel: 't',
                yLabel: '⟨x⟩',
                window: 16,
                series: [{ key: 'meanX', name: '⟨x⟩', color: '#bf5af2' }],
            },
            {
                id: 'spectrum',
                title: 'Energy spectrum',
                type: 'histogram',
                xLabel: 'state n',
                yLabel: '|cₙ|²',
                series: [{ name: '|cₙ|²', color: '#bf5af2' }],
            },
        ];
    }

    setParam(key, value) {
        super.setParam(key, value);
        if (key === 'L') this._dirty = true;
    }

    reset() {
        this.t = 0;
        this._dirty = true;
    }

    _rebuild() {
        const L = this.params.L;
        const norm = Math.sqrt(2 / L);
        for (let i = 0; i < this.Nx; i++) {
            this._xs[i] = (i / (this.Nx - 1)) * L;
        }
        this._phi = [];
        for (let n = 1; n <= N_STATES; n++) {
            const row = new Float64Array(this.Nx);
            for (let i = 0; i < this.Nx; i++) {
                row[i] = norm * Math.sin((n * Math.PI * this._xs[i]) / L);
            }
            this._phi.push(row);
        }
        this._dirty = false;
    }

    _coeffs() {
        const raw = [this.params.c1, this.params.c2, this.params.c3, this.params.c4];
        const sumSq = raw.reduce((a, v) => a + v * v, 0) || 1;
        const inv = 1 / Math.sqrt(sumSq);
        return raw.map((v) => v * inv);
    }

    _energy(n) {
        const L = this.params.L;
        return (n * n * Math.PI * Math.PI);
    }

    _evaluate() {
        if (this._dirty) this._rebuild();
        const c = this._coeffs();
        const re = new Float64Array(this.Nx);
        const im = new Float64Array(this.Nx);
        for (let n = 0; n < N_STATES; n++) {
            if (c[n] === 0) continue;
            const phase = -this._energy(n + 1) * this.t;
            const cosP = Math.cos(phase);
            const sinP = Math.sin(phase);
            const phi = this._phi[n];
            const cn = c[n];
            for (let i = 0; i < this.Nx; i++) {
                const a = cn * phi[i];
                re[i] += a * cosP;
                im[i] += a * sinP;
            }
        }
        const prob = new Float64Array(this.Nx);
        const dx = this.params.L / (this.Nx - 1);
        let mean = 0;
        let total = 0;
        for (let i = 0; i < this.Nx; i++) {
            prob[i] = re[i] * re[i] + im[i] * im[i];
            mean += this._xs[i] * prob[i] * dx;
            total += prob[i] * dx;
        }
        return { re, im, prob, meanX: mean / (total || 1) };
    }

    step(dt) {
        this.t += dt * this.params.timeScale;
    }

    draw(ctx, view) {
        const { width: w, height: h } = view;
        const { re, im, prob } = this._evaluate();
        const L = this.params.L;

        const padX = w * 0.1;
        const padTop = h * 0.12;
        const baseY = h * 0.78;
        const midY = h * 0.42;
        const plotW = w - 2 * padX;
        const toX = (X) => padX + (x / L) * plotW;

        // infinite potential
        ctx.strokeStyle = 'rgba(245,245,247,0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padX, padTop);
        ctx.lineTo(padX, baseY);
        ctx.lineTo(w - padX, baseY);
        ctx.lineTo(w - padX, padTop);
        ctx.stroke();

        // real && imaginary parts
        if (this.params.showParts) {
            const sParts = (h * 0.16);
            this._curve(ctx, this._xs, re, toX, midY, -sParts, 'rgba(100,210,255,0.7)', 1.5);
            this._curve(ctx, this._xs, im, toX, midY, -sParts, 'rgba(255,159,10,0.7)', 1.5);
        }

        // probability  density (as a filled curve)
        let maxP = 1e-9;
        for (let i = 0; i < this.Nx;i++) if (prob[i] > maxP) maxP = prob[i];
        const sProb = (baseY - padTop) * 0.9 / maxP;
        ctx.beginPath();
        ctx.moveTo(toX(this._xs[0]), baseY);
        for (let i = 0; i < this.Nx; i++) {
            ctx.lineTo(toX(this._xs[i]), baseY - prob[i] * sProb);
        }
        ctx.lineTo(toX(this._xs[this.Nx - 1]), baseY);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, padTop, 0, baseY);
        grad.addColorStop(0, 'rgba(191,90,242,0.55)');
        grad.addColorStop(0, 'rgba(191,90,242,0.05)');
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = '#bf5af2';
        
    }
}