const serverURL = `http://localhost:3333/api/alunos`;

async function listarAlunos() {
    const respostaAPI = await fetch(`${serverURL}`);

    if (!respostaAPI.ok){
        console.error('Erro na requisição:', respostaAPI.status, await respostaAPI.text());

        return;
    }

    const jsonAlunos = await respostaAPI.json();

    return jsonAlunos;
}

async function montarTabelaAlunos() {
    const listaDeAlunos = await listarAlunos();

    const tbody = document.querySelector('tbody');

    tbody.innerHTML = '';

    listaDeAlunos.forEach(aluno => {
        const tr = document.createElement('tr');
        
        tr.innerHTML =`
            <td>${aluno.idAluno}</td>
            <td>${aluno.ra}</td>
            <td>${aluno.nome}</td>
            <td>${aluno.sobrenome}</td>
            <td>${aluno.dataNascimento ? new Date(aluno.dataNascimento).toLocaleDateString() : '-'}</td>
            <td>${aluno.endereco ? aluno.endereco : '-'}</td>
            <td>${aluno.email ? aluno.email : '-'}</td>
            <td>${aluno.celular}</td>
            <td>
                   <img src='/assets/editar.svg' alt='Editar aluno' class='btn-edit' />
                   <img src='/assets/deletar.svg' alt='Excluir aluno' class='btn-delete' />
            </td>
        `;

        tbody.appendChild(tr);

        tr.querySelector('.btn-edit').addEventListener('click', () => {window.location.href = `../../pages/aluno/atualizacao-aluno.html?idAluno=${aluno.idAluno}`});
        tr.querySelector('.btn-delete').addEventListener('click', () => {removerLivro(aluno)});

    });
}

async function enviarFormularioCadastro(event) {
    event.preventDefault();

    const aluno = {
        nome: document.getElementById('nome-aluno').value,
        sobrenome: document.getElementById('sobrenome-aluno').value,
        dataNascimento: document.getElementById('data-nascimento').value || null,
        endereco: document.getElementById('endereco-aluno').value,
        email: document.getElementById('email-aluno').value,
        celular: document.getElementById('celular-aluno').value
    }

    try {
        const respostaAPI = await fetch(`${serverURL}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(aluno)
        });

        if (!respostaAPI.ok) {
            alert('Erro ao cadastrar aluno.');

            throw new Error('Erro ao fazer requisição à API.');
        }

        alert('Aluno cadastrado com sucesso!');

        window.location.href = '../../pages/aluno/lista-aluno.html';
    } catch (error) {
        console.error('Erro ao fazer requisição.');
        return;
    }
}

async function removerLivro(aluno) {
    const confirmacao = confirm(`Deseja mesmo remover o aluno: ${aluno.nome} ${aluno.sobrenome}?`);

    try {
        if (confirmacao) {
            const respostaAPI = await fetch(`${serverURL}/${aluno.idAluno}`, {
                method: 'DELETE'
            });

            if (!respostaAPI.ok) {
                alert('Erro ao remover aluno.');

                console.error('Erro na requisição: ', respostaAPI.status, await respostaAPI.text());

                return;
            }

            alert('Aluno removido com sucesso!');

            window.location.reload();
        } else {
            return;
        }
    } catch (error) {
        console.error('Erro ao fazer requisição.');
        return;
    }
}

async function buscarAluno() {
    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);

    const idAluno = urlParams.get('idAluno');

    try {
        const respostaAPI = await fetch(`${serverURL}/${idAluno}`);

        if (!respostaAPI.ok) {
            alert('Erro ao buscar aluno.');

            console.error('Erro na requisição: ', respostaAPI.status, await respostaAPI.text());
        }

        const aluno = await respostaAPI.json();

        preencherFormularioAtualizacao(aluno);
    } catch (error) {
        alert('Erro ao buscar informações do aluno.');

        console.error(`Erro ao buscar informações do aluno. ${error}`);

        return;
    }
}

function preencherFormularioAtualizacao(aluno) {
    document.getElementById('id-aluno').value = aluno.idAluno;
    document.getElementById('nome-aluno').value = aluno.nome;
    document.getElementById('sobrenome-aluno').value = aluno.sobrenome;
    document.getElementById('data-nascimento').value = aluno.dataNascimento ? new Date(aluno.dataNascimento).toISOString().split('T')[0] : null;
    document.getElementById('endereco-aluno').value = aluno.endereco;
    document.getElementById('email-aluno').value = aluno.email;
    document.getElementById('celular-aluno').value = aluno.celular;
}

async function enviarFormularioAtualizacao(event) {
    event.preventDefault();

    const aluno = {
        idAluno: document.getElementById('id-aluno').value,
        nome: document.getElementById('nome-aluno').value,
        sobrenome: document.getElementById('sobrenome-aluno').value,
        dataNascimento: document.getElementById('data-nascimento').value || null,
        endereco: document.getElementById('endereco-aluno').value,
        email: document.getElementById('email-aluno').value,
        celular: document.getElementById('celular-aluno').value
    };

    try {
        const respostaAPI = await fetch(`${serverURL}/${aluno.idAluno}`, {
            method: 'PUT', 
            headers: {
                'Content-type': 'application/json' 
            },
            body: JSON.stringify(aluno) 
        });

        if (!respostaAPI.ok) {
            alert('Erro ao atualizar aluno.');

            console.error('Erro na requisição:', respostaAPI.status, await respostaAPI.text());
        }

        alert('Aluno atualizado com sucesso!');

        window.location.href = '../../pages/aluno/lista-aluno.html';
    } catch (error) {
        console.error('Erro ao fazer requisição.');
        return;
    }
}