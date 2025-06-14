// Referências DOM
const mesAtual = document.getElementById('mes-atual');
const toggleButton = document.getElementById('menu-toggle');
const wrapper = document.getElementById('wrapper');
const tbody = document.querySelector('#table-calendar tbody');
const tarefasParaHoje = document.getElementById('tarefasParaHoje');
const tarefasParaEstaSemana = document.getElementById('tarefasParaEstaSemana');
const iconClose = document.getElementById('icon-close');
const select = document.querySelector('select');
const labelDiasSemana = document.querySelectorAll('.label-dia-semana');
const btnMesAnterior = document.getElementById('mes-anterior');
const btnMesPosterior = document.getElementById('mes-posterior');

// Sidebar toggle
toggleButton.addEventListener('click', () => wrapper.classList.toggle('toggled'));
iconClose.addEventListener('click', () => wrapper.classList.toggle('toggled'));

// Configurações fixas
const STATUS = {
    'pendente': 'danger',
    'concluída': 'success',
    'em andamento': 'warning',
};

const DIAS_SEMANA = {
    'Dom': 'D', 'Seg': 'S', 'Ter': 'T', 'Qua': 'Q', 'Qui': 'Q', 'Sex': 'S', 'Sáb': 'S',
};

const LABELS_DIAS = Object.keys(DIAS_SEMANA);
const date = new Date();

// Dados de tarefas (mock)
const TAREFAS_API = [
    {
        nome: 'Corrigir os trabalhos do 2º bimestre',
        prazo: new Date(2025, 5, 14),
        status: 'em andamento',
        disciplina: 'Desenvolvimento Web II'
    },
    {
        nome: 'Revisar conteúdo de Banco de Dados I para a prova',
        prazo: new Date(2025, 5, 19),
        status: 'pendente',
        disciplina: 'Banco de Dados I'
    },
    {
        nome: 'Finalizar relatório do projeto de Gestão de Projetos',
        prazo: new Date(2025, 5, 21),
        status: 'concluída',
        disciplina: 'Gestão de Projetos'
    },
    {
        nome: 'Revisar slides para apresentação de Tópicos especiais',
        prazo: new Date(2025, 5, 20),
        status: 'pendente',
        disciplina: 'Tópicos especiais'
    },
    {
        nome: 'Preparar exercícios para aula de Desenvolvimento Web II',
        prazo: new Date(2025, 5, 22),
        status: 'em andamento',
        disciplina: 'Desenvolvimento Web II'
    },
    {
        nome: 'Revisar consultas SQL para Banco de Dados I',
        prazo: new Date(2025, 5, 23),
        status: 'pendente',
        disciplina: 'Banco de Dados I'
    },
    {
        nome: 'Ajustar cronograma do projeto de Gestão de Projetos',
        prazo: new Date(2025, 5, 24),
        status: 'em andamento',
        disciplina: 'Gestão de Projetos'
    },
    {
        nome: 'Finalizar o estudo de tecnologias abordadas em Tópicos especiais',
        prazo: new Date(2025, 5, 25),
        status: 'concluída',
        disciplina: 'Tópicos especiais'
    },
    {
        nome: 'Organizar material didático para Desenvolvimento Web II',
        prazo: new Date(2025, 5, 26),
        status: 'pendente',
        disciplina: 'Desenvolvimento Web II'
    },
    {
        nome: 'Estudar conceito de normalização em Banco de Dados I',
        prazo: new Date(2025, 5, 27),
        status: 'concluída',
        disciplina: 'Banco de Dados I'
    },
    {
        nome: 'Mês anterior',
        prazo: new Date(2025, 4, 27),
        status: 'concluída',
        disciplina: 'Banco de Dados I'
    },
    {
        nome: 'Mês posterior',
        prazo: new Date(2025, 6, 27),
        status: 'concluída',
        disciplina: 'Banco de Dados I'
    }
];

function diasNoMes(mes, ano) {
    return new Date(ano, mes + 1, 0).getDate();
}

function diaDaSemanaDoDia01() {
    const temp = new Date(date);
    temp.setDate(1);
    return temp.getDay();
}

function tarefasPorDia() {
    const selectValue = select?.value || "Todas";
    const mapa = new Map();

    for (const tarefa of TAREFAS_API) {
        if (selectValue !== "Todas" && tarefa.disciplina !== selectValue) continue;
        const dia = tarefa.prazo.getDate();

        if (!mapa.has(dia)) mapa.set(dia, []);
        if (date.getMonth() === tarefa.prazo.getMonth()) {
            mapa.get(dia).push(tarefa);
        }
    }

    return mapa;
}

function construirCalendario() {
    dia_tarefas = tarefasPorDia();
    tbody.innerHTML = '';
    tarefasParaHoje.innerHTML = '';
    tarefasParaEstaSemana.innerHTML = '';

    listarTarefasParaHoje();
    listartarefasParaEstaSemana();

    mesAtual.innerText = date.toLocaleDateString('pt-BR', { month: 'long' }).toUpperCase();

    const ehMobile = window.innerWidth < 576;
    (ehMobile ? calendarioMobile : calendarioDesktop)();
}

function calendarioMobile() {
    let tr = document.createElement('tr');

    for (let i = 1; i <= diasNoMes(date.getMonth(), date.getFullYear()); i++) {
        const td = document.createElement('td');
        const tarefas = dia_tarefas.get(i) || [];

        td.className = 'border';
        td.innerHTML = `
            <div class="text-end fw-bold">${i}</div>
            <div class="tarefas-container">${tarefas.length ? '<div class="badge bg-primary">...</div>' : ''}</div>
        `;
        tr.appendChild(td);

        if (tr.children.length === 7) {
            tbody.appendChild(tr);
            tr = document.createElement('tr');
        }
    }
    if (tr.children.length > 0) tbody.appendChild(tr);

    labelDiasSemana.forEach(label => {
        label.innerText = DIAS_SEMANA[label.innerText];
    });
}

function calendarioDesktop() {
    let tr = document.createElement('tr');
    const primeiroDiaSemana = diaDaSemanaDoDia01();

    // Dias anteriores
    let diaAnterior = diasNoMes(date.getMonth() - 1, date.getFullYear()) - primeiroDiaSemana + 1;
    for (let i = 0; i < primeiroDiaSemana; i++) {
        const td = document.createElement('td');
        td.className = 'border bg-secondary-subtle';
        td.innerHTML = `<div class="text-end fw-bold">${diaAnterior++}</div>`;
        tr.appendChild(td);
    }

    const totalDias = diasNoMes(date.getMonth(), date.getFullYear());
    for (let i = 1; i <= totalDias; i++) {
        const td = document.createElement('td');
        const tarefas = dia_tarefas.get(i) || [];

        const tarefasHtml = tarefas.map(tarefa => `
            <div class="badge bg-${STATUS[tarefa.status]} text-truncate">${tarefa.nome}</div>
        `).join('');

        td.className = 'border';
        td.innerHTML = `
            <div class="text-end fw-bold">${i}</div>
            <div class="tarefas-container">${tarefasHtml}</div>
        `;

        tr.appendChild(td);
        if (tr.children.length === 7) {
            tbody.appendChild(tr);
            tr = document.createElement('tr');
        }
    }

    let diaPosterior = 1;
    while (tr.children.length < 7) {
        const td = document.createElement('td');
        td.className = 'border bg-secondary-subtle';
        td.innerHTML = `<div class="text-end fw-bold">${diaPosterior++}</div>`;
        tr.appendChild(td);
    }
    tbody.appendChild(tr);

    labelDiasSemana.forEach((label, index) => {
        label.innerText = LABELS_DIAS[index];
    });
}

function listarTarefasParaHoje() {
    const now = new Date();
    const tarefas = dia_tarefas.get(now.getDate()) || [];

    if (tarefas.length) {
        tarefas.forEach(tarefa => {
            if (tarefa.prazo.getMonth() === date.getMonth()) {
                tarefasParaHoje.innerHTML += `
                    <div class="d-flex align-items-center">
                        <div class="d-flex flex-column align-items-center me-3 border-end border-${STATUS[tarefa.status]} border-4 pe-4">
                            <div class="fs-2">${now.getDate()}</div>
                            <div>${now.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase()}</div>
                        </div>
                        <div>${tarefa.nome}</div>
                    </div>
                `;
            }
        });
    } else {
        tarefasParaHoje.innerHTML = '<div>Não há tarefas para hoje.</div>';
    }
}

function listartarefasParaEstaSemana() {
    const now = new Date();
    const fimSemana = new Date(now);
    fimSemana.setDate(now.getDate() + (6 - now.getDay()));

    const tarefas = [];

    for (const [dia, lista] of dia_tarefas.entries()) {
        lista.forEach(tarefa => {
            const prazo = tarefa.prazo;
            if (prazo >= now && prazo <= fimSemana && prazo.getMonth() === date.getMonth()) {
                tarefas.push(tarefa);
            }
        });
    }

    if (tarefas.length) {
        tarefas.forEach(tarefa => {
            tarefasParaEstaSemana.innerHTML += `
                <div class="d-flex align-items-center">
                    <div class="d-flex flex-column align-items-center me-3 border-end border-${STATUS[tarefa.status]} border-4 pe-4">
                        <div class="fs-2">${tarefa.prazo.getDate()}</div>
                        <div>${tarefa.prazo.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase()}</div>
                    </div>
                    <div>${tarefa.nome}</div>
                </div>
            `;
        });
    } else {
        tarefasParaEstaSemana.innerHTML = '<div>Não há mais tarefas para esta semana.</div>';
    }
}

// Mudança de mês
btnMesAnterior.addEventListener('click', () => {
    date.setMonth(date.getMonth() - 1);
    construirCalendario();
});

btnMesPosterior.addEventListener('click', () => {
    date.setMonth(date.getMonth() + 1);
    construirCalendario();
});

// Filtro de disciplina
select.addEventListener('change', () => construirCalendario());

// Redimensionamento de tela
window.addEventListener('resize', () => construirCalendario());

// Inicialização
let dia_tarefas = tarefasPorDia();
construirCalendario();
