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

    get theory() {
        return {
            objectives: [
                'Recognize the double pendulum as a low-dimenisonal chaotic system.',
                'Connect the Lagrangian to the coupled equations of motion.',
                'Observe enery conservation as a check on the numerical integrator.',
                'See sensitive dependence on initial conditions in phase space.',
            ],
            sections: [
                {
                    title: 'Lagrangian',
                    html: `The kinetic and potencial energies give the Lagrangian
                        $$L = T - V,\\quad T = \\tfrac12 m_1 L_1^2\\dot\\theta_1^2
                        + \\tfrac12 m_2\\big(L_1^2\\dot\\theta_1^2 + L_2^2\\dot\\theta_2^2
                        + 2L_1L_2\\dot\\theta_1\\dot\\theta_2\\cos(\\theta_1-\\theta_2\\big),$$
                        with $V = -(m_1+m_2)gL_1\\cos\\theta_1 - m_2 g L_2\\cos\\theta_2$.`,
                },
                {
                    title: 'Ecuations of motion',
                    html: `Applying the Euler–Lagrange equations yields two coupled
                        second-order ODEs for the angular accelerations
                        $\\ddot\\theta_1,\\ddot\\theta_2$. They are nonlinear through the
                        $\\cos(\\theta_1-\\theta_2)$ coupling, which is precisely what makes
                        the motion chaotic for large amplitudes.`,
                },
                {
                    title: 'Chaos & conservation',
                    html: `The system is <em>deterministic</em> yet <em>unpredictable</em>:
                        nearby initial conditions diverge exponentially (positive Lyapunov
                        exponent). With no fricion the total energy
                        $E = T + V$ is conserved — watch the energy plot stay flat, a sign
                        the RK4 integrator is faithful.`,
                },
            ],
            equations: [
                { label: 'Total energy', text: 'E = T + V = \\text{const}' },
            ],
        };
    }

    get quiz() {
        return [
            {
                q: 'Why is the double pendulum considered chaotic rather than merely complicated?',
                options: [
                    'It has many moving parts.',
                    'Nearby initial conditions diverge exponentialyy over time.',
                    'It loses energy unpredictably to friction.',
                    'Its motion is random and non-deterministic.',
                ],
                answer: 1,
                explain: 'Chaos is sensitive dependence on initial conditions — a positive Lyapunov exponent — even though the dynamics are fully deterministic and energy-conserving.',
            },
            {
                q: 'In the ideal (frictionless) model, the total mechanical energy should…',
                options: [
                    'increase as the motion becomes chaotic',
                    'decay exponentially',
                    'remain constant',
                    'oscillate with the driving frequency',
                ],
                answer: 2,
                expalin: 'With no dissipation and no driving, energy E = T + V is a conserved quantity. Visible drift on the plot would indicate integrator error.',
            },
            {
                q: 'What makes the equations of motion nonlinear?',
                options: [
                    'The gravitational term g',
                    'The coupling term cos(θ₁ − θ₂)',
                    'The use of two masses',
                    'The Runge–Kutta integrator',
                ],
                answer: 1,
                explain: 'The trigonometric coupling between the two angles is the source of nonlinearity, and therefore of the chaotic behaivor at large amplitude.',
            },
        ];
    }

    get plots() {
        return [
            {
                id: 'angles',
                title: 'Angles vs time',
                type: 'time',
                xLabel: 't (s)',
                yLabel: 'θ (rad)',
                window: 12,
                series: [
                    { key: 'theta1', name: 'θ₁', color: '#0a84ff' },
                    { key: 'theta2', name: 'θ₂', color: '#ff9f0a' },
                ],
            },
            {
                id: 'phase',
                title: 'Phase space (bob 2)',
                type: 'phase',
                xLabel: 'θ₂',
                yLabel: 'ω₂',
                series: [{ xKey: 'theta2', yKey: 'omega2', name:'θ₂–ω₂', color: '#5ee5ce6' }],
            },
            {
                id: 'energy',
                title: 'Total enery',
                type: 'time',
                xLabel: 't (s)',
                yLabel: 'E (J)',
                window: 12,
                series: [{ key: 'energy', name: 'E', color: '#30d158' }],
            },
        ];
    }

    get rebuildKeys() { return ['theta1', 'theta2']; }

    reset() {
        const { theta1, theta2 } = this.params;
        const toRoad = Math.PI / 180;
        this.state = [theta1 * toRoad, 0, theta2 * toRoad, 0];
        this.t = 0;
        this.trail.length = 0;
        this.energy0 = this._energy(this.state);
    }

    _derivatives(s) {
        const { L1, L2, m1, m2, g } = this.params;
        const [th1, w1, th2, w2] = s;
        const d = th1 - th2;
        const d = th1 - th2;
        const sinD = Math.sin(d);
        const cosD = Math.cos(d);
        const den = 2 * m1 + m2 - m2 * Math.cos(2 * d);

        const a1 =
            (-g * (2 * m1 + m2) * Math.sin(th1) -
                m2 * g * Math.sin(th1 - 2 * th2) -
                2 * sinD * m2 * (w2 * w2 * L2 + w1 * w1 * L1 * cosD)) /
            (L1 * den);
            
        const a2 = 
            (2 * sinD *
                (w1 * w1 * L1 * (m1 + m2) +
                    g * (m1 + m2) * Math.cos(th1) +
                    w2 * w2 * L2 * m2 * cosD)) /
            (L2 * den);

        return [w1, a1, w2, a2];
    }

    _energy(s) {
        const { L1, L2, m1, m2, g } = this.params;
        const [th1, w1, th2, w2] = s;
        const v1sq = L1 * L1 * w1 * w1;
        const v2sq = 
            L1 * L1 * w1 * w1 +
            L2 * L2 * w2 * w2 +
            2 * L1 * L2 * w1 * w2 * Math.cos(th1 - th2);
        const T = 0.5 * m1 * v1sq + 0.5 * m2 * v2sq;
        const y1 = -L1 * Math.cos(th1);
        const y2 = y1 - L2 * Math.cos(th2);
        const V = m1 * g * y1 + m2 * g * y2;
        return T + V;
    }

    _rk4(s, h) {
        const add = (a, b, f) => a.map((v, i) => b[i] * f);
        const k1 = this._derivatives(s);
        const k2 = this._derivatives(add(s, k1, h / 2));
        const k3 = this._derivatives(add(s, k2, h / 2));
        const k4 = this._derivatives(add(s, k3, h));
        return s.map((v, i) => v + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
    }

    step(dt) {
        const scaled = dt * this.params.speed;
        const h = 1 / 600;
        let remaining = Math.min(scaled, 0.1);
        while (remaining > 1e-9) {
            const step = Math.min(h, remaining);
            this.state = this._rk4(this.state, step);
            remaining -= step;
            this.t += step;
        }
    }

    draw(ctx, view) {
        const { width: w, height: h } = view;
        const { L1, L2 } = this.params;
        const [th1, , th2] = this.state;

        const pivotX = w / 2;
        const pivotY = h * 0.32;
        const scale = (Math.min(w, h) * 0.34) / (L1 + L2);

        const x1 = pivotX + scale * L1 * Math.sin(th1);
        const y1 = pivotY + scale * L1 * Math.cos(th1);
        const x2 = x1 + scale * L2 * Math.sin(th2);
        const y2 = y1 + scale * L2 * Math.cos(th2);

        if (this.params.trail) {
            this.trail.push({x: x2, y: y2});
            if (this.trail.length > 900) this.trail.shift();
            ctx.lineWidth = 1.5;
            for (let i = 1; i < this.trail.length; i++) {
                const a = this.trail[i - 1];
                const b = this.trail[i];
                ctx.strokeStyle = `rgba(94, 92, 230, ${(i / this.trail.length) * 0.6})`;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }

        ctx.strokeStyle = 'rgba(245, 245, 247, 0.85)';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(pivotX, pivotY);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        this._dot(ctx, pivotX, pivotY, 5, '#6e6e73');
        this._dot(ctx, x1, y1, 8 + this.params.m1 * 2, '#0a84ff');
        this._dot(ctx, x2, y2, 8 + this.params.m2 * 2, '#ff9f0a');
    }

    _dot(ctx, x, y, r, color) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    simple() {
        const [th1, w1, th2, w2] = this.state;
        return {
            t: this.t,
            theta1: th1,
            theta2: th2,
            omega1: w1,
            omega2: w2,
            energy: this._energy(this.state),
        };
    }
}

export default DoublePendulum;