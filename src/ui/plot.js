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
            case 'phase': this._renderPhase(history); break;
            case 'profile': this._renderProfile(data); break;
            case 'histogram': this._renderHistogram(data); break;
            case 'time':
            default: this._renderTime(history); break;
        }
    }

    _rect() {
        const p = STYLE.pad;
        return {
            x0: p.left,
            y0: p.top,
            x1: this.w - p.right,
            y1: this.h - p.bottom,
            w: this.w - p.left - p.right,
            h: this.h - p.top - p.bottom,
        };
    }

    _frame(xmin, xmax, ymin, ymax) {
        const { ctx } = this;
        const r = this._rect();
        const dx = ymax - xmin || 1;
        const dy = ymax - ymin || 1;
        const toX = (x) => r.x0 + ((x - xmin) / dx) * r.w;
        const toY = (y) => r.y1 - ((y - ymin) / dy) * r.h;

        // gridlines
        ctx.strokeStyle = STYLE.grid;
        ctx.lineWidth = 1;
        ctx.fillStyle = STYLE.label;
        ctx.font = STYLE.font;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        const ticks = 4;
        for (let i = 0; i <= ticks; i++) {
            const yy = ymin + (dy * 1) / ticks;
            const py = toY(yy);
            ctx.beginPath();
            ctx.moveTo(r.x0, py);
            ctx.lineTo(r.x1, py);
            ctx.stroke();
            ctx.fillText(this._fmt(yy), r.x0 - 5, py);
        }

        // axis frame
        ctx.strokeStyle = STYLE.axis;
        ctx.strokeRect(r.x0, r.y0, r.w, r.h);

        // axis titles
        ctx.fillStyle = STYLE.label;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        if (this.spec.xLabel) ctx.fillText(this.spec.xLabel, r.x0 + r.w / 2, this.h - 4);

        return { toX, toY, r };
    }

    _fmt(v) {
        if (v === 0) return '0';
        const a = Math.abs(v);
        if (a >= 1000 || a < 0.01) return v.toExponential(0);
        return v.toFixed(a < 1 ? 2 : a < 10 ? 1 : 0);
    }

    
}