const STORAGE_KEY = 'finspan_v2';
const MAX = 5;
const ROWS = [
    { key: 'week1', label: 'Week 1 Achievement' },
    { key: 'week2', label: 'Week 2 Achievement' },
    { key: 'week3', label: 'Week 3 Achievement' },
    { key: 'gameEnd', label: '"GAME END" points (yellow)' },
    { key: 'fish', label: 'Points printed on visible fish' },
    { key: 'eggs', label: 'Eggs (1 point each)' },
    { key: 'young', label: 'Young (1 point each)' },
    { key: 'schools', label: 'Schools (6 points each)' },
    { key: 'consumed', label: 'Consumed fish (1 point each)' },
];
let n;

let saveT;
function debouncedSave() {
    clearTimeout(saveT);
    saveT = setTimeout(save, 600);
}

// State
let state = load();

function defaultState() {
    return Array.from({ length: MAX }, (_, i) => ({
        name: `Player ${i + 1}`,
        ...Object.fromEntries(ROWS.map(r => [r.key, 0]))
    }));
}

function load() {
    try {
        const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (Array.isArray(s) && s.length === MAX) return s;
    } catch (e) { }
    return defaultState();
}

function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function isPortrait() {
    return window.innerHeight > window.innerWidth;
}

function visibleCount() {
    return isPortrait() ? 2 : MAX;
}

function total(p) {
    return ROWS.reduce((s, r) => s + (Number(state[p][r.key]) || 0), 0);
}

function render() {
    n = visibleCount();

    // Header
    let h = '<tr>';
    h += `<th><button class="reset-btn" id="resetBtn">Reset Scores</button></th>`;
    for (let i = 0; i < MAX; i++) {
        const hidden = i >= n ? ' class="hidden-col"' : '';
        h += `<th${hidden}><input type="text" class="name-input" data-p="${i}" value="${esc(state[i].name)}" placeholder="Player ${i + 1}"></th>`;
    }
    h += '</tr>';
    document.getElementById('thead').innerHTML = h;

    // Body
    let b = '';
    for (const row of ROWS) {
        b += '<tr>';
        b += `<td>${row.label}</td>`;
        for (let i = 0; i < MAX; i++) {
            const hidden = i >= n ? ' class="hidden-col"' : '';
            b += `<td${hidden}><input type="text" inputmode="numeric" onfocus="this.select()" data-p="${i}" data-k="${row.key}" value="${state[i][row.key] || 0}"></td>`;
        }
        b += '</tr>';
    }
    document.getElementById('tbody').innerHTML = b;

    // Footer
    let f = '<tr>';
    f += '<td>Total Points</td>';
    for (let i = 0; i < MAX; i++) {
        const hidden = i >= n ? ' class="hidden-col"' : '';
        f += `<td${hidden}>${total(i)}</td>`;
    }
    f += '</tr>';
    document.getElementById('tfoot').innerHTML = f;

    // Events
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (!confirm('Reset all scores? Names will be kept.')) return;
        state.forEach(p => ROWS.forEach(r => p[r.key] = 0));
        save(); render();
    });

    document.querySelectorAll('input[inputmode="numeric"]').forEach(inp => {
        inp.addEventListener('input', () => {
            const p = +inp.dataset.p, k = inp.dataset.k;
            state[p][k] = parseInt(inp.value) || 0;
            debouncedSave();
            const cells = document.querySelectorAll('#tfoot td');
            let col = 1;
            for (let i = 0; i < MAX; i++) {
                if (i >= n) continue;
                cells[col].textContent = total(i);
                col++;
            }
        });
    });

    document.querySelectorAll('input.name-input').forEach(inp => {
        inp.addEventListener('input', () => {
            state[+inp.dataset.p].name = inp.value;
            save();
        });
    });
}

function esc(s) {
    return String(s).replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

let resizeT;
window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(render, 80);
});
window.addEventListener('orientationchange', () => setTimeout(render, 80));

render();