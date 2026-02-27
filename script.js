const SHEET_ID = "14PMjI0XH1l8NXptUGVGM8IK24vvHGPtMSpRhVX9Pcys";

const resumoURL = `https://opensheet.elk.sh/${SHEET_ID}/Resumo`;
const supervisoresURL = `https://opensheet.elk.sh/${SHEET_ID}/Supervisores`;
const metasURL = `https://opensheet.elk.sh/${SHEET_ID}/Metas`;

/* ============================= */
/* COR DO PERCENTUAL */
/* ============================= */

function classePercentual(valor) {
  const numero = parseFloat(valor);

  if (numero >= 80) return "percentual verde";
  if (numero >= 60) return "percentual amarelo";
  return "percentual vermelho";
}

/* ============================= */
/* FORMATA VALOR + PERCENTUAL */
/* ============================= */

function formatarComPercentual(valor, percentual) {
  return `
    ${valor}
    <span class="${classePercentual(percentual)}">
      ${percentual}
    </span>
  `;
}

/* ============================= */
/* RESUMO GERAL */
/* ============================= */

async function carregarResumo() {
  const response = await fetch(resumoURL);
  const data = await response.json();
  const r = data[0];

  document.getElementById("kg_salty").innerHTML =
    formatarComPercentual(r.kg_salty, r.perc_kg_salty);

  document.getElementById("kg_foods").innerHTML =
    formatarComPercentual(r.kg_foods, r.perc_kg_foods);

  document.getElementById("posit_salty").innerHTML =
    formatarComPercentual(r.posit_salty, r.perc_posit_salty);

  document.getElementById("posit_foods").innerHTML =
    formatarComPercentual(r.posit_foods, r.perc_posit_foods);

  document.getElementById("posit_mix_salty").innerHTML =
    formatarComPercentual(r.posit_mix_salty, r.perc_posit_mix_salty);

  document.getElementById("posit_mix_foods").innerHTML =
    formatarComPercentual(r.posit_mix_foods, r.perc_posit_mix_foods);

  document.getElementById("resultado_loja").innerHTML =
    formatarComPercentual(r.resultado_loja, r.perc_resultado_loja);
}

/* ============================= */
/* RENDER SUPERVISORES */
/* ============================= */

function renderCard(containerId, valorCampo, metaCampo, percCampo, data) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  let maiorPercentual = 0;
  let melhorNome = "";

  // Descobrir melhor supervisor
  data.forEach(item => {
    const perc = parseFloat(item[percCampo]);
    if (perc > maiorPercentual) {
      maiorPercentual = perc;
      melhorNome = item.Nome;
    }
  });

  // Renderizar lista
  data.forEach(item => {
    const linha = document.createElement("div");
    linha.classList.add("linha-supervisor");

    if (item.Nome === melhorNome) {
      linha.classList.add("melhor");
    }

    linha.innerHTML = `
      <div style="width:100%">
        <div style="font-weight:600; margin-bottom:2px;">
          ${item.Nome}
        </div>

        <div style="display:flex; justify-content:space-between; font-size:12px;">
          <span>Meta: ${item[metaCampo]}</span>
          <span>Real: ${item[valorCampo]}</span>
          <span class="${classePercentual(item[percCampo])}">
            ${item[percCampo]}
          </span>
        </div>
      </div>
    `;

    container.appendChild(linha);
  });
}

/* ============================= */
/* CARREGAR SUPERVISORES */
/* ============================= */

async function carregarSupervisores() {
  const response = await fetch(supervisoresURL);
  const data = await response.json();

  renderCard("Peso_Salty", "Meta_Peso_Salty", "perc_Peso_Salty", data);
  renderCard("peso_foods", "Peso_Foods", "Meta_Peso_Foods", "perc_Peso_Foods", data);
  renderCard("posit_salty_sup", "Posit_Salty", "Meta_Posit_Salty", "perc_Posit_Salty", data);
  renderCard("posit_foods_sup", "Posit_Foods", "Meta_Posit_Foods", "perc_Posit_Foods", data);
  renderCard("posit_mix_salty_sup", "Posit_Mix_Salty", "Meta_Posit_Mix_Salty", "perc_Posit_Mix_Salty", data);
  renderCard("posit_mix_foods_sup", "Posit_Mix_Foods", "Meta_Posit_Mix_Foods", "perc_Posit_Mix_Foods", data);
}

/* ============================= */
/* METAS GERAIS */
/* ============================= */

async function carregarMetas() {
  const response = await fetch(metasURL);
  const data = await response.json();

  if (!data.length) return;

  const m = data[0];

  document.getElementById("meta_peso_salty").innerText = m.meta_peso_salty;
  document.getElementById("meta_peso_foods").innerText = m.meta_peso_foods;
  document.getElementById("meta_posit_salty").innerText = m.meta_posit_salty;
  document.getElementById("meta_posit_foods").innerText = m.meta_posit_foods;
  document.getElementById("meta_mix_salty").innerText = m.meta_mix_salty;
  document.getElementById("meta_mix_foods").innerText = m.meta_mix_foods;
  document.getElementById("meta_pesquisa").innerText = m.meta_pesquisa;
}

/* ============================= */
/* INICIAR SISTEMA */
/* ============================= */

carregarResumo();
carregarSupervisores();
carregarMetas();




