const serverURL = `http://localhost:3333/api/livros`;

async function listarLivros() {
    const respostaAPI = await fetch(`${serverURL}`);

    if (!respostaAPI.ok){
        console.error('Erro na requisição:', respostaAPI.status, await respostaAPI.text());

        return;
    }

    const jsonLivros = await respostaAPI.json();

    return jsonLivros;
}

async function montarTabelaLivros() {
    const listaDeLivros = await listarLivros();

    const tbody = document.querySelector('tbody');

    tbody.innerHTML = '';

    listaDeLivros.forEach(livro => {
        const tr = document.createElement('tr');
        
        tr.innerHTML =`
            <td>${livro.idLivro}</td>
            <td>${livro.titulo}</td>
            <td>${livro.autor}</td>
            <td>${livro.editora}</td>
            <td>${livro.anoPublicacao ? livro.anoPublicacao : '-'}</td>
            <td>${livro.isbn ? livro.isbn : '-'}</td>
            <td>${livro.quantTotal}</td>
            <td>${livro.quantDisponivel}</td>
            <td>${livro.valorAquisicao ? `R$ ${livro.valorAquisicao}` : '-'}</td>
            <td>${livro.statusLivroEmprestado ? livro.statusLivroEmprestado : '-'}</td>
            <td>
                   <img src='/assets/editar.svg' alt='Editar aluno' class='btn-edit' />
                   <img src='/assets/deletar.svg' alt='Excluir aluno' class='btn-delete' />
            </td>
        `;

        tbody.appendChild(tr);

        tr.querySelector('.btn-edit').addEventListener('click', () => {window.location.href = `../../pages/livro/atualizacao-livro.html?idLivro=${livro.idLivro}`});
        tr.querySelector('.btn-delete').addEventListener('click', () => {removerLivro(livro)});

    });
}

async function enviarFormularioCadastro(event) {
    event.preventDefault();

    const livro = {
        titulo: document.getElementById('titulo-livro').value,
        autor: document.getElementById('autor-livro').value,
        editora: document.getElementById('editora-livro').value,
        anoPublicacao: document.getElementById('ano-publicacao-livro').value,
        isbn: document.getElementById('isbn-livro').value,
        quantTotal: document.getElementById('quantidade-total-livro').value,
        quantDisponivel: document.getElementById('quantidade-disponivel-livro').value,
        valorAquisicao: document.getElementById('valor-aquisicao-livro').value || null,
        statusLivroEmprestado: document.getElementById('status-livro-emprestado').value
    }

    try {
        const respostaAPI = await fetch(`${serverURL}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(livro)
        });

        if (!respostaAPI.ok) {
            alert('Erro ao cadastrar livro.');

            throw new Error('Erro ao fazer requisição à API.');
        }

        alert('Livro cadastrado com sucesso!');

        window.location.href = '../../pages/livro/lista-livro.html';
    } catch (error) {
        console.error('Erro ao fazer requisição.');
        return;
    }
}

async function removerLivro(livro) {
    const confirmacao = confirm(`Deseja mesmo remover o livro: ${livro.titulo}?`);

    try {
        if (confirmacao) {
            const respostaAPI = await fetch(`${serverURL}/${livro.idLivro}`, {
                method: 'DELETE'
            });

            if (!respostaAPI.ok) {
                alert('Erro ao remover livro.');

                console.error('Erro na requisição: ', respostaAPI.status, await respostaAPI.text());

                return;
            }

            alert('Livro removido com sucesso!');

            window.location.reload();
        } else {
            return;
        }
    } catch (error) {
        console.error('Erro ao fazer requisição.');
        return;
    }
}

async function buscarLivro() {
    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);

    const idLivro = urlParams.get('idLivro');

    try {
        const respostaAPI = await fetch(`${serverURL}/${idLivro}`);

        if (!respostaAPI.ok) {
            alert('Erro ao buscar livro.');

            console.error('Erro na requisição: ', respostaAPI.status, await respostaAPI.text());
        }

        const livro = await respostaAPI.json();

        preencherFormularioAtualizacao(livro);
    } catch (error) {
        alert('Erro ao buscar informações do livro.');

        console.error(`Erro ao buscar informações do livro. ${error}`);

        return;
    }
}

function preencherFormularioAtualizacao(livro) {
    document.getElementById('id-livro').value = livro.idLivro;
    document.getElementById('titulo-livro').value = livro.titulo;
    document.getElementById('autor-livro').value = livro.autor;
    document.getElementById('editora-livro').value = livro.editora;
    document.getElementById('ano-publicacao-livro').value = livro.anoPublicacao;
    document.getElementById('isbn-livro').value = livro.isbn;
    document.getElementById('quantidade-total-livro').value = livro.quantTotal;
    document.getElementById('quantidade-disponivel-livro').value = livro.quantDisponivel;
    document.getElementById('valor-aquisicao-livro').value = livro.valorAquisicao;
    document.getElementById('status-livro-emprestado').value = livro.statusLivroEmprestado;
}

async function enviarFormularioAtualizacao(event) {
    event.preventDefault();

    const livro = {
        idLivro: document.getElementById('id-livro').value,
        titulo: document.getElementById('titulo-livro').value,
        autor: document.getElementById('autor-livro').value,
        editora: document.getElementById('editora-livro').value,
        anoPublicacao: document.getElementById('ano-publicacao-livro').value,
        isbn: document.getElementById('isbn-livro').value,
        quantTotal: document.getElementById('quantidade-total-livro').value,
        quantDisponivel: document.getElementById('quantidade-disponivel-livro').value,
        valorAquisicao: document.getElementById('valor-aquisicao-livro').value || null,
        statusLivroEmprestado: document.getElementById('status-livro-emprestado').value
    };

    try {
        const respostaAPI = await fetch(`${serverURL}/${livro.idLivro}`, {
            method: 'PUT', 
            headers: {
                'Content-type': 'application/json' 
            },
            body: JSON.stringify(livro) 
        });

        if (!respostaAPI.ok) {
            alert('Erro ao atualizar livro.');

            console.error('Erro na requisição:', respostaAPI.status, await respostaAPI.text());
        }

        alert('Livro atualizado com sucesso!');

        window.location.href = '../../pages/livro/lista-livro.html';
    } catch (error) {
        console.error('Erro ao fazer requisição.');
        return;
    }
}