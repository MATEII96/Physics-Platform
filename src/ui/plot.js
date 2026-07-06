const STYLE = {
    axis: 'rgba(245,245,247,0.25)',
    grid: 'rgba(245,245,247,0.06)',
    label: 'rgba(245,245,247,0.55)',
    font: '11px ui-monospace, "SF Mono", Menlo, monospace',
    pad: { left: 38, right: 10, top: 20, bottom: 22 },
};

export class Plot {
    constructor(canvas, spec) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.spec = spec;
        this.resize();
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.w = rect.width;
        this.h = rect.height;
        this.canvas.width = Math.max(1, Math.round(rect.width * dpr));
        this.canvas.height = Math.max(1, Math.round(rect.height * dpr));
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    render({ history = [], data = null } = {}) {
        const { ctx } = this;
        ctx.clearRect(0, 0, this.w, this,h);
        switch (this.spec.type) {
            
        }
    }
}