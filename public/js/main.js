window.addEventListener('DOMContentLoaded', e => {
    updateLista();


});

const mapCheckboxs = () => {
    document.querySelectorAll('.complete-checkbox').forEach(item => {

        item.addEventListener('click', async e => {
            const id = e.target.parentNode.parentNode.id;
            let classes = e.target.parentNode.parentNode.childNodes[3].className.replace('completed', '').trim();

            const completed = e.target.checked;

            const res = await updateListaCompra(id, completed);

            if (res.response === 'success') {
                if (completed) {
                    e.target.parentNode.parentNode.childNodes[3].className = 'text-container completed';
                } else {
                    e.target.parentNode.parentNode.childNodes[3].className = 'text-container classes';
                }
            }
        });
    });
}

const updateLista = () => {
    fetch('http://localhost:3000/get-all')
        .then(res => res.json())
        .then(data => {
            if (data.response === 'success') {
                const listaCompra = data.list;
                document.querySelector('#listaCompras').innerHTML = '';

                listaCompra.forEach(producto => {
                    document.querySelector('#listaCompras').innerHTML += `<div class="listaCompra" id="${producto._id}">
                        <div class="checkbox-container">
                        <input type="checkbox" class="complete-checkbox" ${(producto.completed === true) ? 'checked' : ''}/>
                        </div> 
                        <div class="text-container ${(producto.completed === true) ? 'completed' : ''}">
                            ${producto.text}
                        </div>
                        <div class="actions-container">
                            <a href="/delete/${producto._id}"> X </a>
                        </div>
                    </div>`
                });

                mapCheckboxs();
            }
        })
        .catch(err => {
            console.log(err);
        });
}

const updateListaCompra = async (id, completed) => {
    const res = await fetch('http://localhost:3000/complete/' + id + '/' + completed)
        .then(res => res.json());

    return res;
}

document.querySelector('#formulario').addEventListener('submit', e => {
    e.preventDefault();

    const text = document.querySelector('#text').value;
    if (text === '') return false;

    fetch('http://localhost:3000/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text })
    })
        .then(res => res.json())
        .then(data => {
            if (data.response === 'success') {
                updateLista();
                document.querySelector('#text').value = '';
            }
        });
});
