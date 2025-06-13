// referencias
const mesAtual = document.getElementById('mes-atual');
const toggleButton = document.getElementById('menu-toggle');
const wrapper = document.getElementById('wrapper');
const tbody = document.querySelector('#table-calendar tbody');
const tarefasParaHoje = document.getElementById('tarefasParaHoje');
const tarefasParaEstaSemana = document.getElementById('tarefasParaEstaSemana');

// toggle sidebar
toggleButton.addEventListener('click', () => {
    wrapper.classList.toggle('toggled');
});

// dias e as tarefas relacionadas
const TAREFAS_API = [
    {
        nome: 'Corrigir os trabalhos do 2º bimestre',
        dia: new Date(2025, 5, 13),
        prazo: new Date(2025, 5, 17),
        status: 'pendente'
    },
    {
        nome: 'Planejar aula sobre Revolução Francesa',
        dia: new Date(2025, 5, 14),
        prazo: new Date(2025, 5, 16),
        status: 'em andamento'
    },
    {
        nome: 'Corrigir exercícios da turma 1B',
        dia: new Date(2025, 5, 14),
        prazo: new Date(2025, 5, 15),
        status: 'pendente'
    },
    {
        nome: 'Lançar notas da turma 3A',
        dia: new Date(2025, 5, 15),
        prazo: new Date(2025, 5, 18),
        status: 'pendente'
    },
    {
        nome: 'Corrigir prova de Matemática',
        dia: new Date(2025, 5, 15),
        prazo: new Date(2025, 5, 17),
        status: 'pendente'
    },
    {
        nome: 'Criar formulário para avaliação diagnóstica',
        dia: new Date(2025, 5, 16),
        prazo: new Date(2025, 5, 20),
        status: 'concluída'
    },
    {
        nome: 'Preparar slides da aula de biologia',
        dia: new Date(2025, 5, 16),
        prazo: new Date(2025, 5, 18),
        status: 'em andamento'
    },
    {
        nome: 'Revisar conteúdo para prova final',
        dia: new Date(2025, 5, 17),
        prazo: new Date(2025, 5, 21),
        status: 'em andamento'
    },
    {
        nome: 'Aplicar prova simulada',
        dia: new Date(2025, 5, 17),
        prazo: new Date(2025, 5, 17),
        status: 'pendente'
    },
    {
        nome: 'Atualizar plano de aula no sistema',
        dia: new Date(2025, 5, 18),
        prazo: new Date(2025, 5, 22),
        status: 'pendente'
    },
    {
        nome: 'Participar de reunião pedagógica',
        dia: new Date(2025, 5, 19),
        prazo: new Date(2025, 5, 19),
        status: 'concluída'
    },
    {
        nome: 'Organizar material para aula prática',
        dia: new Date(2025, 5, 19),
        prazo: new Date(2025, 5, 20),
        status: 'em andamento'
    }
];

const dia_tarefas = tarefasDoDia();

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

function tarefasDoDia() {
    let dia_tarefas = new Map();
    for (const tarefa of TAREFAS_API) {
        const dia = tarefa.dia.getDate();

        if (!dia_tarefas.has(dia)) {
            dia_tarefas.set(dia, [tarefa]);
        } else {
            const tarefasDoMesmoDia = dia_tarefas.get(dia);
            dia_tarefas.set(dia, [...tarefasDoMesmoDia, tarefa]);
        }
    }
    return dia_tarefas;
}


function construirCalendario() {
    const mobile = window.innerWidth < 576;
    console.log(mobile ? 'MOBILE' : 'PC');
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

listarTarefasParaHoje();
function listarTarefasParaHoje() {
    const now = new Date();
    const tarefas = dia_tarefas.get(now.getDate());
    for (const tarefa of tarefas) {
        tarefasParaHoje.innerHTML += `<div class="d-flex align-items-center">
            <div
                class="d-flex flex-column align-items-center me-3 border-end border-${STATUS[tarefa.status]} border-4 pe-4">
                <div class="fs-2">${now.getDate()}</div>
                <div class>${now.toLocaleDateString('pt-BR', {weekday: 'long'}).substring(0, 3).toUpperCase()}</div>
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
        now.setDate(now.getDate()+1);
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
                <div class>${tarefa.dia.toLocaleDateString('pt-BR', {weekday: 'long'}).substring(0, 3).toUpperCase()}</div>
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

  
