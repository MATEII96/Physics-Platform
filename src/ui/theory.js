export function typesetMath(el) {
    if (typeof window.renderMathInElement === 'function') {
        window.renderMathInElement(el, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false },
            ],
            throwOnError: false,
        });
    }
}

export function renderTheory(container, sim) {
    const theory = sim.theory;
    const meta = sim.constructor.meta;
    const parts = [];

    parts.push(`<div class="theory__lead">
        <span class="tag tag--domain">${meta.domain}</span>
        <span class="tag tag--level">${meta.difficulty}</span>
    </div>`);

    if (theory.objectives && theory.objectives.length) {
        parts.push('<h3 class="theory__h">Learning objectives</h3>');
        parts.push('<ul class="theory__objectives">');
        for (const o of theory.objectives) parts.push(`<li>${o}</li>`);
        parts.push('</ul>');
    }

    for (const section of theory.sections || []) {
        parts.push(`<h3 class="theory__h">${section.title}</h3>`);
        parts.push(`<p class="theory__body">${section.html}</p>`);
    }

    if (theory.equations && theory.equations.length) {
        parts.push('<h3 class="theory__h">Key equations</h3>');
        parts.push('<div class="equation-list">');
        for (const eq of theory.equations) {
            parts.push(`<div class="equation">
                <span class="equation__label">${eq.label}</span>
                <span class="equation__tex">$${eq.tex}$</span>
            </div>`);
        }
        parts.push('</div>');
    }

    container.innerHTML = parts.join('');
    typesetMath(container);
}

export default renderTheory;