let btnMenu = document.getElementById('btn-menu')
let menu = document.getElementById('menu-mobile')
let overlay = document.getElementById('overlay-menu')

btnMenu.addEventListener('click', ()=>{
    menu.classList.add('abrir-menu')
})

menu.addEventListener('click', ()=>{
    menu.classList.remove('abrir-menu')
})

overlay.addEventListener('click', ()=>{
    menu.classList.remove('abrir-menu')
})

window.addEventListener('pageshow', ()=>{
    let formulario = document.querySelector('.formulario form');

    if (formulario) {
        formulario.reset();
    }
})

// 👇 CÓDIGO ATUALIZADO PARA NAVEGAÇÃO E ENVIO PELO TECLADO 👇

const formContato = document.querySelector('.formulario form');
const camposInputs = Array.from(document.querySelectorAll('.formulario form input:not([type="hidden"]):not([type="submit"]), .formulario form textarea'));

camposInputs.forEach((campo, index) => {
    campo.addEventListener('keydown', (e) => {

        // --- NAVEGAÇÃO COM SETA PARA BAIXO ---
        if (e.key === 'ArrowDown' && campo.tagName !== 'TEXTAREA') {
            e.preventDefault();
            if (index < camposInputs.length - 1) {
                camposInputs[index + 1].focus();
            }
        }

        // --- NAVEGAÇÃO COM SETA PARA CIMA ---
        else if (e.key === 'ArrowUp') {
            if (campo.tagName === 'TEXTAREA') {
                if (campo.selectionStart === 0) {
                    e.preventDefault();
                    if (index > 0) camposInputs[index - 1].focus();
                }
            } else {
                e.preventDefault();
                if (index > 0) {
                    camposInputs[index - 1].focus();
                }
            }
        }

        // --- AÇÃO DO ENTER ---
        else if (e.key === 'Enter') {
            if (campo.tagName === 'TEXTAREA') {
                return;
            }

            e.preventDefault();

            if (formContato.checkValidity()) {
                formContato.submit();
            } else {
                if (index < camposInputs.length - 1) {
                    camposInputs[index + 1].focus();
                } else {
                    formContato.reportValidity();
                }
            }
        }
    });
});

// ===== CARROSSEL DE PROJETOS =====
const carrossel = document.getElementById('carrossel');

if (carrossel) {
    const trilho = document.getElementById('trilho');
    const cards = () => Array.from(trilho.children);
    const setaAnt = document.getElementById('seta-ant');
    const setaProx = document.getElementById('seta-prox');
    const areaBolinhas = document.getElementById('bolinhas');
    let paradas = 1;

    const passo = () => {
        const gap = parseFloat(getComputedStyle(trilho).columnGap) || 0;
        return cards()[0].offsetWidth + gap;
    };

    function montarBolinhas() {
        const visiveis = Math.max(1, Math.round(trilho.clientWidth / passo()));
        paradas = Math.max(1, cards().length - visiveis + 1);
        areaBolinhas.innerHTML = '';

        for (let i = 0; i < paradas; i++) {
            const b = document.createElement('button');
            b.type = 'button';
            b.setAttribute('aria-label', 'Ir para o projeto ' + (i + 1));
            b.addEventListener('click', () => {
                trilho.scrollTo({ left: i * passo(), behavior: 'smooth' });
            });
            areaBolinhas.appendChild(b);
        }
    }

    function atualizar() {
        const max = trilho.scrollWidth - trilho.clientWidth;
        const noFim = trilho.scrollLeft >= max - 4;

        carrossel.classList.toggle('tem-rolagem', max > 8);
        setaAnt.disabled = trilho.scrollLeft <= 4;
        setaProx.disabled = noFim;

        const ativa = noFim ? paradas - 1 : Math.min(paradas - 1, Math.round(trilho.scrollLeft / passo()));
        Array.from(areaBolinhas.children).forEach((b, i) => b.classList.toggle('ativa', i === ativa));
    }

    setaAnt.addEventListener('click', () => trilho.scrollBy({ left: -passo(), behavior: 'smooth' }));
    setaProx.addEventListener('click', () => trilho.scrollBy({ left: passo(), behavior: 'smooth' }));
    trilho.addEventListener('scroll', atualizar, { passive: true });

    window.addEventListener('resize', () => { montarBolinhas(); atualizar(); });
    window.addEventListener('load', () => { montarBolinhas(); atualizar(); });

    montarBolinhas();
    atualizar();
}