function formatValue(value, spec) {
    const num = spec.format != null ? Number(value).toFixed(spec.format) : String(value);
    return spec.unit ? `${num} ${spec.unit}` : num;
}

export function buildControls(container, sim, onChange) {
    container.innerHTML = '';
    const syncers = [];

    for (const spec of sim.controls) {
        const type = spec.type || 'range';
        const row = document.createElement('div');
        row.className = 'control';

        if (type === 'button') {
            const btn = document.createElement('button');
            btn.className = 'btn btn--ghost';
            btn.textContent = spec.label;
            btn.addEventListener('click', () => spec.action && spec.action(sim));
            row.appendChild(btn);
            container.appendChild(row);
            continue;
        }

        
    }
}