// referencias
const mesAtual = document.getElementById('mes-atual');
const toggleButton = document.getElementById('menu-toggle');
const wrapper = document.getElementById('wrapper');
const tbody = document.querySelector('#table-calendar tbody');
const tarefasParaHoje = document.getElementById('tarefasParaHoje');
const tarefasParaEstaSemana = document.getElementById('tarefasParaEstaSemana');
const iconClose = document.getElementById('icon-close');
const select = document.querySelector('select');

// toggle sidebar
toggleButton.addEventListener('click', () => {
    wrapper.classList.toggle('toggled');
});

iconClose.addEventListener('click', () => {
    wrapper.classList.toggle('toggled');
});

// dias e as tarefas relacionadas
const TAREFAS_API = [
    {
        nome: 'Corrigir os trabalhos do 2º bimestre',
        dia: new Date(2025, 5, 13),
        prazo: new Date(2025, 5, 17),
        status: 'em andamento',
        disciplina: 'Desenvolvimento Web II'
    },
    {
        nome: 'Revisar conteúdo de Banco de Dados I para a prova',
        dia: new Date(2025, 5, 14),
        prazo: new Date(2025, 5, 19),
        status: 'pendente',
        disciplina: 'Banco de Dados I'
    },
    {
        nome: 'Finalizar relatório do projeto de Gestão de Projetos',
        dia: new Date(2025, 5, 15),
        prazo: new Date(2025, 5, 21),
        status: 'concluída',
        disciplina: 'Gestão de Projetos'
    },
    {
        nome: 'Revisar slides para apresentação de Tópicos especiais',
        dia: new Date(2025, 5, 16),
        prazo: new Date(2025, 5, 20),
        status: 'pendente',
        disciplina: 'Tópicos especiais'
    },
    {
        nome: 'Preparar exercícios para aula de Desenvolvimento Web II',
        dia: new Date(2025, 5, 17),
        prazo: new Date(2025, 5, 22),
        status: 'em andamento',
        disciplina: 'Desenvolvimento Web II'
    },
    {
        nome: 'Revisar consultas SQL para Banco de Dados I',
        dia: new Date(2025, 5, 18),
        prazo: new Date(2025, 5, 23),
        status: 'pendente',
        disciplina: 'Banco de Dados I'
    },
    {
        nome: 'Ajustar cronograma do projeto de Gestão de Projetos',
        dia: new Date(2025, 5, 19),
        prazo: new Date(2025, 5, 24),
        status: 'em andamento',
        disciplina: 'Gestão de Projetos'
    },
    {
        nome: 'Finalizar o estudo de tecnologias abordadas em Tópicos especiais',
        dia: new Date(2025, 5, 20),
        prazo: new Date(2025, 5, 25),
        status: 'concluída',
        disciplina: 'Tópicos especiais'
    },
    {
        nome: 'Organizar material didático para Desenvolvimento Web II',
        dia: new Date(2025, 5, 21),
        prazo: new Date(2025, 5, 26),
        status: 'pendente',
        disciplina: 'Desenvolvimento Web II'
    },
    {
        nome: 'Estudar conceito de normalização em Banco de Dados I',
        dia: new Date(2025, 5, 22),
        prazo: new Date(2025, 5, 27),
        status: 'concluída',
        disciplina: 'Banco de Dados I'
    }
];

let dia_tarefas = tarefasPorDia();

const STATUS = {
    'pendente': 'danger',
    'concluída': 'success',
    'em andamento': 'warning',
}

// primeiro dia do mes atual
const date = new Date();
const diaSemana = diaDaSemanaDoDia01();

const mesExtenso = date.toLocaleDateString('pt-BR', { month: 'long' });
mesAtual.innerText = mesExtenso.toUpperCase();

// construir calendario
const DIAS_NO_MES = diasNoMes(date.getMonth(), date.getFullYear());
construirCalendario();


// funcoes
function diasNoMes(mes, ano) {
    return new Date(ano, mes + 1, 0).getDate();
}

function diaDaSemanaDoDia01() {
    date.setDate(1);
    date.toLocaleDateString('pt-BR', { weekday: 'long' });
}

function tarefasPorDia() {
    const selectValue = select?.value || "Todas"; // Garante um valor padrão

    const dia_tarefas = new Map();

    for (const tarefa of TAREFAS_API) {
        // Se uma disciplina for selecionada (e não for "Todas"), filtra
        if (selectValue !== "Todas" && tarefa.disciplina !== selectValue) {
            continue;
        }

        const dia = tarefa.dia.getDate();

        if (!dia_tarefas.has(dia)) {
            dia_tarefas.set(dia, [tarefa]);
        } else {
            dia_tarefas.get(dia).push(tarefa);
        }
    }

    return dia_tarefas;
}



function construirCalendario() {
    const ehMobile = window.innerWidth < 576;

    const calendario = {
        false: calendarioDesktop,
        true: calendarioMobile
    }
    calendario[ehMobile]();
}

function calendarioMobile() {
    console.log('calendarioMobile');
    tbody.innerHTML = '';

    let tr = document.createElement('tr');

    for (let i = 1; i <= DIAS_NO_MES; i++) {
        const td = document.createElement('td');

        const tarefas = dia_tarefas.get(i) || [];

        const tarefasHtml = `<div class="badge bg-primary">...</div>`;

        td.className = 'border';
        td.innerHTML = `
            <div class="text-end fw-bold">${i}</div>
            <div class="tarefas-container">${tarefas.length > 0 ? tarefasHtml : ''}</div>
        `;

        tr.appendChild(td);

        if (i % 7 === 0) {
            tbody.appendChild(tr);
            tr = document.createElement('tr');
        }
    }

    if (tr.children.length > 0) {
        tbody.appendChild(tr);
    }
}

function calendarioDesktop() {
    console.log('calendarioDesktop');
    tbody.innerHTML = '';

    let tr = document.createElement('tr');

    for (let i = 1; i <= DIAS_NO_MES; i++) {
        const td = document.createElement('td');

        const tarefas = dia_tarefas.get(i) || [];

        const tarefasHtml = tarefas.map(tarefa => `
            <div class="badge bg-${STATUS[tarefa.status]}">${tarefa.nome}</div>
        `).join('');

        td.className = 'border';
        td.innerHTML = `
            <div class="text-end fw-bold">${i}</div>
            <div class="tarefas-container">${tarefasHtml}</div>
        `;

        tr.appendChild(td);

        if (i % 7 === 0) {
            tbody.appendChild(tr);
            tr = document.createElement('tr');
        }
    }

    if (tr.children.length > 0) {
        tbody.appendChild(tr);
    }
}

// select disciplinas
select.addEventListener('change', () => {
    for (const tarefa of dia_tarefas) {
        dia_tarefas.delete(tarefa[0]);
    }
    dia_tarefas = tarefasPorDia()
    construirCalendario();
});

listarTarefasParaHoje();
function listarTarefasParaHoje() {
    const now = new Date();
    const tarefas = dia_tarefas.get(now.getDate());
    for (const tarefa of tarefas) {
        tarefasParaHoje.innerHTML += `<div class="d-flex align-items-center">
            <div
                class="d-flex flex-column align-items-center me-3 border-end border-${STATUS[tarefa.status]} border-4 pe-4">
                <div class="fs-2">${now.getDate()}</div>
                <div class>${now.toLocaleDateString('pt-BR', { weekday: 'long' }).substring(0, 3).toUpperCase()}</div>
            </div>
            <div class="d-flex align-items-center justify-content-center">
                ${tarefa.nome}
            </div>
        </div>`;
    }
}

listartarefasParaEstaSemana();
function listartarefasParaEstaSemana() {
    const now = new Date();
    let tarefas = [];

    while (true) {
        now.setDate(now.getDate() + 1);
        const r = dia_tarefas.get(now.getDate());
        if (r) tarefas = [...tarefas, ...r];
        console.log(tarefas.length);

        if (now.getDay() == 6) break;
    }

    for (const tarefa of tarefas) {
        tarefasParaEstaSemana.innerHTML += `<div class="d-flex align-items-center">
            <div
                class="d-flex flex-column align-items-center me-3 border-end border-${STATUS[tarefa.status]} border-4 pe-4">
                <div class="fs-2">${tarefa.dia.getDate()}</div>
                <div class>${tarefa.dia.toLocaleDateString('pt-BR', { weekday: 'long' }).substring(0, 3).toUpperCase()}</div>
            </div>
            <div class="d-flex align-items-center justify-content-center">
                ${tarefa.nome}
            </div>
        </div>`;
    }
}


window.addEventListener('resize', () => {
    construirCalendario();
});


