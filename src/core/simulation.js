export class Simulation {
    static meta = {
        id: 'base',
        title: 'United Experiment',
        domain: 'General',
        difficulty: 'Core',
        blurb: '',
    };

    constructor() {
        this.params = {};
        this.t = 0;
        for (const c of this.controls) {
            if (c.type !== 'button' && c.value !== undefined) {
                this.params[c.key] = c.value;
            }
        }
    }

    get controls() { return []; }
    get presets() { return {}; }
    get theory() { return { objectives: [], sections: [] }; }
    get quiz() { return []; }
    get plots() { return []; }
    get rebuildKeys() { return []; }
    reset(_view) {}
    step(_dt) {}
    draw(_ctx, _view) {}
    sample() { return { t: this.t }; }
    setParam(key, value) {
        this.params[key] = value;
    }
    applyPreset(name) {
        const preset = this.presets[name];
        if (!preset) return;
        for (const [key, value] of Object.entries(preset.values)) {
            this.setParam(key, value);
        }
    }
}

export default Simulation;