import { typesetMath } from './theory.js';

export function renderQuiz(container, sim) {
    const questions = sim.quiz || [];
    container.innerHTML = '';

    if (questions.length === 0) {
        container.innerHTML = '<p class="muted">No quiz for this experiment yet.</p>';
        return;
    }

    const answered = new Set();
    let correct = 0;

    const score = document.createElement('div');
    score.className = 'quiz__score';
    const updateScore = () => {
        score.textContent = `Score: ${correct} / ${questions.length}`;
    };
    updateScore();
    container.appendChild(score);

    questions.forEach((item, qi) => {
        const card = document.createElement('div');
        card.className = 'quiz__card';

        const q = document.createElement('p');
        q.className = 'quiz__question';
        q.innerHTML = `<span class="quiz__num">${qi + 1}</span> ${item.q}`;
        card.appendChild(q);

        const opts = document.createElement('div');
        opts.className = 'quiz__options';

        const explain = document.createElement('p');
        explain.className = 'quiz__explain';
        explain.hidden = true;

        item.options.forEach((text, oi) => {
            const btn = document.createElement('button');
            btn.className = 'quiz__option';
            btn.textContent = text;
            btn.addEventListener('click', () => {
                if (answered.has(qi)) return;
                answered.add(qi);
                const isRight = oi === item.answer;
                if (isRight) correct++;
                updateScore();

                Array.from(opts.children).forEach((child, idx) => {
                    child.disabled = true;
                    if (idx === item.answer) child.classList.add('quiz__option--correct');
                    else if (idx === oi) child.classList.add('quiz__option--wrong');
                });

                explain.innerHTML = `<strong>${isRight ? 'Correct.' : 'Not quite.'}</strong> ${item.explain}`;
                explain.hidden = false;
                typesetMath(explain);
            });
            opts.appendChild(btn);
        });

        card.appendChild(opts);
        card.appendChild(explain);
        container.appendChild(card);
    });

    typesetMath(container);
}

export default renderQuiz;