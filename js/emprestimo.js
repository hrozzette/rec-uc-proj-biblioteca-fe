const serverURL = `http://localhost:3333/api/emprestimos`;

async function listarEmprestimos() {
    const respostaAPI = await fetch(`${serverURL}`);

    if (!respostaAPI.ok){
        console.error('Erro na requisição:', respostaAPI.status, await respostaAPI.text());

        return;
    }

    const jsonEmprestimos = await respostaAPI.json();

    return jsonEmprestimos;
}

async function montarTabelaEmprestimos() {
    const listaDeEmprestimos = await listarEmprestimos();

    const tbody = document.querySelector('tbody');

    tbody.innerHTML = '';

    listaDeEmprestimos.forEach(emprestimo => {
        const tr = document.createElement('tr');
        
        tr.innerHTML =`
            <td>${emprestimo.idEmprestimo}</td>
            <td>${emprestimo.nomeAluno}</td>
            <td>${emprestimo.tituloLivro}</td>
            <td>${new Date(emprestimo.dataEmprestimo).toLocaleDateString()}</td>
            <td>${new Date(emprestimo.dataDevolucao).toLocaleDateString()}</td>
            <td>${emprestimo.statusEmprestimo ? emprestimo.statusEmprestimo : '-'}</td>
            <td>
                   <img src='/assets/editar.svg' alt='Editar aluno' class='btn-edit' />
                   <img src='/assets/deletar.svg' alt='Excluir aluno' class='btn-delete' />
            </td>
        `;

        tbody.appendChild(tr);

        tr.querySelector('.btn-edit').addEventListener('click', () => alert('editar'));
        tr.querySelector('.btn-delete').addEventListener('click', () => {removerEmprestimo(emprestimo)});

    });
}

async function removerEmprestimo(emprestimo) {
    const confirmacao = confirm(`Deseja mesmo remover o emprestimo: Aluno: ${emprestimo.nomeAluno}, Livro: ${emprestimo.tituloLivro}?`);

    try {
        if (confirmacao) {
            const respostaAPI = await fetch(`${serverURL}/${emprestimo.idEmprestimo}`, {
                method: 'DELETE'
            });

            if (!respostaAPI.ok) {
                alert('Erro ao remover emprestimo.');

                console.error('Erro na requisição: ', respostaAPI.status, await respostaAPI.text());

                return;
            }

            alert('Emprestimo removido com sucesso!');

            window.location.reload();
        } else {
            return;
        }
    } catch (error) {
        console.error('Erro ao fazer requisição.');
        return;
    }
}

function definirDatasAutomaticas() {
    const hoje = new Date();
    const dataDevolucao = new Date();
    dataDevolucao.setDate(hoje.getDate() + 30);

    function formatarData(data) {
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
    }

    document.getElementById('data-emprestimo').value = formatarData(hoje);
    document.getElementById('data-devolucao').value = formatarData(dataDevolucao);
}