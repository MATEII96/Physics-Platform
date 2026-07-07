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

        if (type === 'toggle') {
            const label = document.createElement('label');
            label.className = 'control__label control__label--inline';
            const text = document.createElement('span');
            text.textContent = spec.label;
            const sw = document.createElement('input');
            sw.type = 'checkbox';
            sw.className = 'switch';
            sw.checked = Boolean(sim.params[spec.key]);
            sw.addEventListener('change', () => onChange(spec.key, sw.checked));
            label.appendChild(text);
            label.appendChild(sw);
            row.appendChild(label);
            syncers.push(() => { sw.checked = Boolean(sim.params[spec.key]); });
            container.appendChild(row);
            continue;
        }

        if (type === 'select') {
            const label = document.createElement('label');
            label.className = 'control__label';
            label.textContent = spec.label;
            const sel = document.createElement('select');
            sel.className = 'select';
            for (const opt of spec.options || []) {
                const o = document.createElement('option');
                o.value = String(opt.value);
                o.textContent = opt.label;
                sel.appendChild(o);
            }
            sel.value = String(sim.params[spec.key]);
            sel.addEventListener('change', () => onChange(spec.key, sel.value));
            row.appendChild(label);
            row.appendChild(sel);
            syncers.push(() => { sel.value = String(sim.params[spec.key]); });
            container.appendChild(row);
            continue;
        }

        const label = document.createElement('label');
        label.className = 'control__label';
        label.htmlFor = `ctl-${spec.key}`;
        const name= document.createElement('span');
        name.innerHTML = spec.label;
        const badge = document.createElement('span');
        badge.className = 'control__value';
        badge.textContent = formatValue(sim.params[spec.key], spec);
        label.appendChild(name);
        label.appendChild(badge);

        const input = document.createElement('input');
        input.type = 'range';
        input.className = 'slider';
        input.id = `ctl-${spec.key}`;
        input.min = String(spec.min);
        input.max = String(spec.max);
        input.step = String(spec.step);
        input.value = String(sim.params[spec.key]);
        input.addEventListener('input', () => {
            const v = Number(input.value);
            badge.textContent = formatValue(v, spec);
            onChange(spec.key, v);
        });

        row.appendChild(label);
        row.appendChild(input);
        syncers.push(() => {
            input.value = String(sim.params[spec.key]);
            badge.textContent = formatValue(sim.params[spec.key], spec);
        });
        container.appendChild(row);
    }

    return { sync: () => syncers.forEach((fn) => fn()) };
}

export default buildControls;