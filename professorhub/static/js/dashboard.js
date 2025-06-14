// referencias
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

// toggle sidebar
toggleButton.addEventListener('click', () => {
    wrapper.classList.toggle('toggled');
});

iconClose.addEventListener('click', () => {
    wrapper.classList.toggle('toggled');
});

// mudar mes
btnMesAnterior.addEventListener('click', () => {
    date.setMonth(date.getMonth() - 1);
    construirCalendario();
});

btnMesPosterior.addEventListener('click', () => {
    date.setMonth(date.getMonth() + 1);
    construirCalendario();
});

// dias e as tarefas relacionadas
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

let dia_tarefas = tarefasPorDia();

const DIAS_SEMANA = {
    'Dom': 'D',
    'Seg': 'S',
    'Ter': 'T',
    'Qua': 'Q',
    'Qui': 'Q',
    'Sex': 'S',
    'Sáb': 'S',
};
const LABELS_DIAS = Object.keys(DIAS_SEMANA);


const STATUS = {
    'pendente': 'danger',
    'concluída': 'success',
    'em andamento': 'warning',
}

// primeiro dia do mes atual
const date = new Date();
const diaSemana = diaDaSemanaDoDia01();

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

        const dia = tarefa.prazo.getDate();

        if (!dia_tarefas.has(dia)) {
            dia_tarefas.set(dia, [tarefa]);
        } else {
            dia_tarefas.get(dia).push(tarefa);
        }
    }

    return dia_tarefas;
}


function construirCalendario() {
    const mesExtenso = date.toLocaleDateString('pt-BR', { month: 'long' });
    mesAtual.innerText = mesExtenso.toUpperCase();

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
    let ultimaData;

    let tr = document.createElement('tr');

    for (let i = 1; i <= DIAS_NO_MES; i++) {
        const td = document.createElement('td');

        const tarefas = dia_tarefas.get(i) || [];

        const tarefasAux = tarefas.filter(tarefa => tarefa.prazo.getMonth() === date.getMonth());
        let tarefasHtml = '';

        if (tarefasAux.length) {
            tarefasHtml = `<div class="badge bg-primary">...</div>`;

        }

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

    let i = 1;
    while (tr.children.length < 7) {
        const td = document.createElement('td');
        td.className = 'border';
        td.style.backgroundColor = '#ccc';
        td.innerHTML = `<div class="text-end fw-bold">${i}</div>`;
        tr.appendChild(td);
        i++;
        date.setDate(i);
    }

    if (tr.children.length > 0) {
        tbody.appendChild(tr);
    }

    labelDiasSemana.forEach(label => {
        label.innerText = DIAS_SEMANA[label.innerText];
    });
}

function calendarioDesktop() {
    console.log('calendarioDesktop');
    tbody.innerHTML = '';

    const diasMesAnterior = diasNoMes(date.getMonth(), date.getFullYear());
    console.log('diasMesAnterior:', diasMesAnterior);

    let comeco = diasMesAnterior - date.getDay() + 1;
    console.log('comeco:', comeco);

    let tr = document.createElement('tr');
    for (let i = 0; i < date.getDay(); i++) {
        const td = document.createElement('td');
        td.className = 'border';
        td.style.backgroundColor = '#ccc';
        td.innerHTML = `<div class="text-end fw-bold">${comeco}</div>`;
        tr.appendChild(td);
        comeco++;
    }

    for (let i = 1; i <= DIAS_NO_MES; i++) {
        date.setDate(i);

        const td = document.createElement('td');

        const tarefas = dia_tarefas.get(i) || [];

        const tarefasAux = tarefas.filter(tarefa => tarefa.prazo.getMonth() === date.getMonth());
        let tarefasHtml = '';

        if (tarefasAux.length) {
            tarefasHtml = tarefasAux.map(tarefa => `
                <div class="badge bg-${STATUS[tarefa.status]}">${tarefa.nome}</div>
            `).join('');

            tarefasAux.forEach(tarefa => {
                if (tarefa.prazo) ultimaDiaDaSemana = tarefa.prazo.getDay();
            });
        }

        td.className = 'border';
        td.innerHTML = `
            <div class="text-end fw-bold">${i}</div>
            <div class="tarefas-container">${tarefasHtml}</div>
        `;

        tr.appendChild(td);

        if (tr.children.length == 7) {
            tbody.appendChild(tr);
            tr = document.createElement('tr');
        }
    }

    let i = 1;
    while (tr.children.length < 7) {
        const td = document.createElement('td');
        td.className = 'border';
        td.style.backgroundColor = '#ccc';
        td.innerHTML = `<div class="text-end fw-bold">${i}</div>`;
        tr.appendChild(td);
        i++;
        date.setDate(i);
    }

    if (tr.children.length > 0) {
        tbody.appendChild(tr);
    }

    labelDiasSemana.forEach((label, index) => {
        label.innerText = LABELS_DIAS[index];
    });
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
    const tarefas = dia_tarefas.get(now.getDate()) || [];

    if (tarefas.length > 0) {
        for (const tarefa of tarefas) {

            if (tarefa.prazo.getMonth() === date.getMonth()) {

                tarefasParaHoje.innerHTML += `
                <div class="d-flex align-items-center">
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
    } else {
        tarefasParaHoje.innerHTML += `<div class="d-flex align-items-center">Não há tarefas para hoje.</div>`
    }
}

listartarefasParaEstaSemana();
function listartarefasParaEstaSemana() {
    const now = new Date();
    let tarefas = [];

    while (true) {
        if (now.getDay() == 6) break;

        now.setDate(now.getDate() + 1);
        const r = dia_tarefas.get(now.getDate());
        if (r) tarefas = [...tarefas, ...r];
    }

    if (tarefas.length > 0) {
        for (const tarefa of tarefas) {

            if (tarefa.prazo.getMonth() == date.getMonth()) {
                tarefasParaEstaSemana.innerHTML += `
                <div class="d-flex align-items-center">
                    <div
                        class="d-flex flex-column align-items-center me-3 border-end border-${STATUS[tarefa.status]} border-4 pe-4">
                        <div class="fs-2">${tarefa.prazo.getDate()}</div>
                        <div class>${tarefa.prazo.toLocaleDateString('pt-BR', { weekday: 'long' }).substring(0, 3).toUpperCase()}</div>
                    </div>
                    <div class="d-flex align-items-center justify-content-center">
                        ${tarefa.nome}
                    </div>
                </div>`;
            }
        }
    } else {
        tarefasParaEstaSemana.innerHTML += `<div class="d-flex align-items-center">Não há mais tarefas para esta semana.</div>`
    }
}


window.addEventListener('resize', () => {
    construirCalendario();
});


