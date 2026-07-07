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
        ctx.clearRect(0, 0, this.w, this.h);
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
        const dx = xmax - xmin || 1;
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
            const yy = ymin + (dy * i) / ticks;
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

    _renderTime(history) {
        if (history.length < 2) return;
        const now = history[history.length - 1].t;
        const win = this.spec.window || 10;
        const xmin = Math.max(0, now - win);
        const visible = history.filter((s) => s.t >= xmin);

        let ymin = Infinity;
        let ymax = -Infinity;
        for (const s of visible) {
            for (const ser of this.spec.series) {
                const v = s[ser.key];
                if (v == null || Number.isNaN(v)) continue;
                if (v < ymin) ymin = v;
                if (v > ymax) ymax = v;
            }
        }
        if (!Number.isFinite(ymin)) return;
        const pad = (ymax - ymin) * 0.1 || 1;
        ymin -= pad; ymax += pad;

        const { toX, toY } = this._frame(xmin, now, ymin, ymax);
        const { ctx } = this;
        for (const ser of this.spec.series) {
            ctx.strokeStyle = ser.color;
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            let started = false;
            for (const s of visible) {
                const v = s[ser.key];
                if (v == null || Number.isNaN(v)) continue;
                const px = toX(s.t);
                const py = toY(v);
                started ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
                started = true;
            }
            ctx.stroke();
        }
        this._legend();
    }

    _renderPhase(history) {
        if (history.length < 2) return;
        const ser = this.spec.series[0];
        let xmin = Infinity, xmax = -Infinity, ymin = Infinity, ymax = -Infinity;
        for (const s of history) {
            const x = s[ser.xKey];
            const y = s[ser.yKey];
            if (x < xmin) xmin = x; if (x > xmax) xmax = x;
            if (y < ymin) ymin = y; if (y > ymax) ymax = y;
        }
        const px = (xmax - xmin) * 0.1 || 1;
        const py = (ymax - ymin) * 0.1 || 1;
        const { toX, toY } = this._frame(xmin - px, xmax + px, ymin - py, ymax + py);
        const { ctx } = this;
        ctx.lineWidth = 1.2;
        const n = history.length;
        for (let i = 1; i < n; i++) {
            const a = history[i - 1];
            const b = history[i];
            ctx.strokeStyle = this._fade(ser.color, (i / n) * 0.9 + 0.1);
            ctx.beginPath();
            ctx.moveTo(toX(a[ser.xKey]), toY(a[ser.yKey]));
            ctx.lineTo(toX(b[ser.xKey]), toY(b[ser.yKey]));
            ctx.stroke();
        }
        // current point
        const last = history[n - 1];
        ctx.fillStyle = ser.color;
        ctx.beginPath();
        ctx.arc(toX(last[ser.xKey]), toY(last[ser.yKey]), 3, 0, Math.PI * 2);
        ctx.fill();
    }

    _renderProfile(data) {
        if (!data || !data.xs || data.xs.length < 2) return;
        const xs = data.xs;
        let ymin = Infinity, ymax = -Infinity;
        for (const ser of data.series) {
            for (const y of ser.ys) {
                if (y < ymin) ymin = y;
                if (y > ymax) ymax = y;
            }
        }
        const pad = (ymax - ymin) * 0.08 || 1;
        const { toX, toY } = this._frame(xs[0], xs[xs.length - 1], ymin - pad * 0.2, ymax + pad);
        const { ctx } = this;
        for (const ser of data.series) {
            ctx.strokeStyle = ser.color;
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            for (let i = 0; i < xs.length; i++) {
                const p = toX(xs[i]);
                const q = toY(ser.ys[i]);
                i === 0 ? ctx.moveTo(p, q) : ctx.lineTo(p, q);
            }
            ctx.stroke();
        }
    }

    _renderHistogram(data) {
        if (!data || !data.counts || data.counts.length === 0) return;
        const { edges, counts, curve, color } = data;
        const xmin = edges[0];
        const xmax = edges[edges.length - 1];
        let ymax = Math.max(...counts);
        if (curve) for (const p of curve) if (p.y > ymax) ymax = p.y;
        ymax = ymax * 1.15 || 1;

        const { toX, toY } = this._frame(xmin, xmax, 0, ymax);
        const { ctx } = this;
        ctx.fillStyle = this._fade(color, 0.55);
        for (let i = 0; i < counts.length; i++) {
            const x0 = toX(edges[i]);
            const x1 = toX(edges[i + 1]);
            const y0 = toY(0);
            const y1 = toY(counts[i]);
            ctx.fillRect(x0 + 0.5, y1, Math.max(1, x1 - x0 - 1), y0 - y1);
        }
        if (curve && curve.length > 1) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            for (let i = 0; i < curve.length; i++) {
                const px = toX(curve[i].x);
                const py = toY(curve[i].y);
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            }
            ctx.stroke();
        }
    }

    _legend() {
        const { ctx } = this;
        const r = this._rect();
        ctx.font = STYLE.font;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        let x = r.x0 + 6;
        const y = r.y0 + 8;
        for (const ser of this.spec.series) {
            if (!ser.name) continue;
            ctx.fillStyle = ser.color;
            ctx.fillRect(x, y - 3, 10, 3);
            ctx.fillStyle = STYLE.label;
            ctx.fillText(ser.name, x + 14, y);
            x += 14 + ctx.measureText(ser.name).width + 16;
        }
    }

    _fade(color, alpha) {
        if (color[0] !== '#') return color;
        const n = parseInt(color.slice(1), 16);
        const r = (n >> 16) & 255;
        const g = (n >> 8) & 255;
        const b = n & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
}

export default Plot;
