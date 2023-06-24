const hdrCabecalho = document.querySelector("header#cabecalho");
const btnAuto = document.querySelector("span#btnAuto");
const btnAdicionar = document.querySelector("span#btnAdicionar");
const btnGirar = document.querySelector("span#btnGirar");
const btnExpandir = document.querySelector("span#btnExpandir");
const btnsExcluir = document.getElementsByClassName("excluir");
let btnActive = false;
let expandido = false;
let qtdGiros = 0;
let cor_vermelho = "#f97171";

itens = {
};

function mensagemPainel(cor, mensagem) {
    const pMsg = document.querySelector("p.mensagem");

    if (cor) {
        pMsg.style = `color: ${cor};`;
        pMsg.innerHTML = mensagem;
    }
}

function shuffleArray(inputArray){
    return inputArray.sort(()=> Math.random() - 0.5);
}

function percTotal() {
    let total = 0;

    for (let i in itens) {
        if (parseFloat(itens[i].raridade)) {
            total += parseFloat(itens[i].raridade);
        }
    }

    return total;
}

async function atualizarTabela() {
    const tabelaItens = document.querySelector("table.tabela-itens").children[0];
    
    //tabelaItens.innerHTML = `<tr><th>Item</th><th>Raridade</th><th><span id="btnExpandir" class="botao icone"><img src="./img/icon_forward.png" style="width: 8px;"></span></th></tr>`;
    //expandido = false;

    while (tabelaItens.childElementCount > 1) {
        tabelaItens.removeChild(tabelaItens.lastElementChild);
    }

    for (let item in organizarItens()) {
        //itens = organizarItens();
        const newTr = document.createElement("tr");
        newTr.id = `item_${item}`;
    //console.log(organizarItens());
        newTr.className = getRarity(itens[item].raridade);
        newTr.innerHTML = `<td>${itens[item].nome}</td><td>${itens[item].raridade}%</td><td><span class="botao icone excluir ${expandido ? "" : "closed"}"></span></td>`;
        tabelaItens.appendChild(newTr);
    }

    for (let i = 0; i < btnsExcluir.length; i++) {
        let btnExcluir = btnsExcluir[i];
        btnExcluir.addEventListener("click", excluirItem);
    }

    /*for (const item in itens) {
        if (itens[item].nome && itens[item].raridade) {
            tabelaItens.innerHTML += `<tr class="${getRarity(itens[item].raridade)}"><td>${itens[item].nome}</td><td>${itens[item].raridade}%</td><td><span class="botao icone excluir closed"><img src="./img/icon_trash.png"></span></td></tr>`;
        }
    }*/
}

function autoAdicionar() {
    const numRaridade = document.querySelector("input#numRaridade");

    if (percTotal() >= 100) {
        mensagemPainel(cor_vermelho, "Chance máxima já atingida!");
        return;
    }
    
    numRaridade.value = Math.ceil((100 - percTotal()) * 10) / 10;
}

function adicionarItem() {
    const txtNome = document.querySelector("input#txtNome");
    const numRaridade = document.querySelector("input#numRaridade");
    mensagemPainel("#ffffff", "");

    if (txtNome.value && parseFloat(numRaridade.value) && parseFloat(numRaridade.value) > 0) {
        if ((percTotal() + parseFloat(numRaridade.value)) <= 100) {

            if (Object.keys(itens).length <= 0) {
                itens[0] = {nome: txtNome.value, raridade: parseFloat(numRaridade.value.search(/[.]/g) <= 0 ? numRaridade.value : numRaridade.value.slice(0, numRaridade.value.search(/[.]/g) + 2))};
            } else {
                for (let i in itens) {
                    if (!(itens[parseInt(i) + 1])) {
                        itens[parseInt(i) + 1] = {nome: txtNome.value, raridade: parseFloat(numRaridade.value.search(/[.]/g) <= 0 ? numRaridade.value : numRaridade.value.slice(0, numRaridade.value.search(/[.]/g) + 2))};
                        
                        break;
                    }
                }
            }
        } else {
            mensagemPainel(cor_vermelho, "O valor inserido excede o limite! (Não passe de 100%)");
        }
    } else {
        mensagemPainel(cor_vermelho, "Insira valores válidos!");
    }

    atualizarTabela();
    console.log(itens);
}
function sortear() {
    sorteio = [];

    for (const item in itens) {
        for (i=1; i <= (itens[item].raridade * 10); i++) {
            if (sorteio.length >= 1000) {
                break;
            }
            sorteio[sorteio.length <= 0 ? 0 : sorteio.length] = item;
        }
    }

    sorteio = shuffleArray(sorteio);
    return sorteio[Math.floor(Math.random() * 1000)];
}

function getRarity(rarity) {
    if (rarity <= 0.5) {
        return "r_mythical";
    } else if (rarity <= 1) {
        return "r_legendary";
    } else if (rarity <= 5) {
        return "r_epic";
    } else if (rarity <= 30) {
        return "r_rare";
    } else {
        return "r_common";
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function girar() {
    const iFrame = document.querySelector("iframe.frame-roleta");
    const listaRoleta = iFrame.contentWindow.document.querySelector("ul#lista-itens");
    const girou = hdrCabecalho.querySelector("h1 span");


    if (btnActive == true) {
        return;
    }

    if (Object.keys(itens).length <= 0) {
        mensagemPainel(cor_vermelho, "Adicione algum item!");
        return;
    }

    if (percTotal() < 100 || percTotal() > 100) {
        mensagemPainel(cor_vermelho, "O total deve ser 100%!");
        return;
    }

    btnActive = true;

    qtdGiros++;
    girou.innerHTML = qtdGiros;

    btnGirar.className += " girando";
    
    mensagemPainel("#ffffff", "");
    listaRoleta.className = "";
    await sleep(100);
    /*tempInner = listaRoleta.innerHTML;
    listaRoleta.innerHTML = "";
    listaRoleta.innerHTML = tempInner;*/

    for (let i = 0; i < 10; i++) {
        let result = sortear();
        listaRoleta.children[i].children[0].className = ` ${getRarity(itens[result].raridade)}`;
        listaRoleta.children[i].children[0].innerHTML = itens[result].nome;
    }

    listaRoleta.className = "scroll";
    await sleep(3000);//listaRoleta.className.slice(6);
    //listaRoleta.children[9].children[0].scrollIntoView({behavior: 'smooth'}, true);
    
    btnGirar.className = btnGirar.className.slice(0, -8);
    btnActive = false;
}

function expandir() {
    if (btnsExcluir.length == 0) {return;};
    
    for (let i = 0; i < btnsExcluir.length; i++) {
        let btnExcluir = btnsExcluir[i];
        let classeBtnExcluir = btnExcluir.className;
        if (!expandido) {
            let searched = classeBtnExcluir.search(" closed");
            
            btnExcluir.className = searched ? btnExcluir.className.slice(0, searched) : btnExcluir.className;
        } else {
            btnExcluir.className += " closed";
        }
    }
    expandido = !expandido;
}

function getMenor(tabela, attr) {
    let first = true;
    let menor = false;
    
    for (let i in tabela) {//(let i = 0; i < Object.keys(tabela).length; i++) {
        if (menor === false || tabela[i][attr] < tabela[menor][attr] || Object.keys(tabela).length == 1) {
            menor = parseInt(i);
        }
    }

    return menor;
}

function organizarItens() {
    /*let sortedItens = itens.sort(
        (i1, i2) => (i1.raridade < i2.raridade) ? 1 : (i1.raridade > i2.raridade) ? -1 : 0
    );*/
    let tempItens = {...itens};
    let sortedItens = {};

    for (let i in itens) {
        let menor = getMenor(tempItens, "raridade");
        console.log("Menor: " + menor);
        sortedItens[Object.keys(sortedItens).length <= 0 ? 0 : Object.keys(sortedItens).length] = tempItens[menor];

        delete tempItens[menor];
    }
    itens = sortedItens;

    return sortedItens;
}

function excluirItem(param) {
    let idItem = param.target.parentElement.parentElement.id;

    delete itens[idItem.slice(5, idItem.length)];
console.log("Item sendo excluído: nº" + (idItem.slice(5, idItem.length)));
console.log(itens);
    atualizarTabela();
}

btnAuto.addEventListener("click", autoAdicionar);
btnAdicionar.addEventListener("click", adicionarItem);
btnGirar.addEventListener("click", girar);
btnExpandir.addEventListener("click", expandir);
