const SHEET_ID = "14PMjI0XH1l8NXptUGVGM8IK24vvHGPtMSpRhVX9Pcys";

const resumoURL = `https://opensheet.elk.sh/${SHEET_ID}/Resumo`;
const supervisoresURL = `https://opensheet.elk.sh/${SHEET_ID}/Supervisores`;
const metasURL = `https://opensheet.elk.sh/${SHEET_ID}/Metas`;

/* ============================= */
/* FUNÇÕES SEGURAS */
/* ============================= */

function valorSeguro(valor, padrao = "0") {
  return valor ?? padrao;
}

function numeroSeguro(valor) {
  const numero = parseFloat(
    (valor || "0").toString().replace("%", "").replace(",", ".")
  );
  return isNaN(numero) ? 0 : numero;
}

/* ============================= */
/* COR DO PERCENTUAL */
/* ============================= */

function classePercentual(valor) {
  const numero = numeroSeguro(valor);

  if (numero >= 100) return "percentual verde";
  if (numero >= 80) return "percentual amarelo";
  return "percentual vermelho";
}

/* ============================= */
/* ATUALIZA CARD RESUMO */
/* ============================= */

function atualizarCard(idValor, idPercentual, idBarra, valor, percentual) {

  const elValor = document.getElementById(idValor);
  const elPercent = idPercentual ? document.getElementById(idPercentual) : null;
  const elBarra = idBarra ? document.getElementById(idBarra) : null;

  if (elValor) elValor.innerText = valorSeguro(valor);

  if (elPercent) {
    elPercent.innerText = valorSeguro(percentual, "0%");
    elPercent.className = classePercentual(percentual);
  }

  if (elBarra) {
    const numero = numeroSeguro(percentual);
    elBarra.style.width = numero + "%";
    elBarra.className = classePercentual(percentual);
  }
}

/* ============================= */
/* RESUMO */
/* ============================= */

async function carregarResumo() {
  try {
    const response = await fetch(resumoURL);
    const data = await response.json();
    if (!data.length) return;

    const r = data[0];

    atualizarCard("kg_salty", "percent_kg_salty", "barra_kg_salty", r.kg_salty, r.perc_kg_salty);
    atualizarCard("kg_foods", "percent_kg_foods", "barra_kg_foods", r.kg_foods, r.perc_kg_foods);
    atualizarCard("posit_salty", "percent_posit_salty", "barra_posit_salty", r.posit_salty, r.perc_posit_salty);
    atualizarCard("posit_foods", "percent_posit_foods", "barra_posit_foods", r.posit_foods, r.perc_posit_foods);
    atualizarCard("posit_mix_salty", "percent_mix_salty", "barra_mix_salty", r.posit_mix_salty, r.perc_posit_mix_salty);
    atualizarCard("posit_mix_foods", "percent_mix_foods", "barra_mix_foods", r.posit_mix_foods, r.perc_posit_mix_foods);

    // Resultado Loja (sem barra)
    atualizarCard("resultado_loja", null, null, r.resultado_loja, null);

  } catch (error) {
    console.error("Erro ao carregar resumo:", error);
  }
}

/* ============================= */
/* RENDER SUPERVISORES */
/* ============================= */

function renderCard(containerId, valorCampo, metaCampo, percCampo, data) {

  const container = document.getElementById(containerId);
  if (!container || !data.length) return;

  container.innerHTML = "";

  const dadosOrdenados = [...data].sort((a, b) => {
    return numeroSeguro(b[percCampo]) - numeroSeguro(a[percCampo]);
  });

  const melhorNome = dadosOrdenados[0]?.Nome;

  dadosOrdenados.forEach(item => {

    const linha = document.createElement("div");
    linha.classList.add("linha-supervisor");

    if (item.Nome === melhorNome) {
      linha.classList.add("melhor");
    }

    linha.innerHTML = `
      <div style="width:100%">
        <div style="font-weight:600; margin-bottom:4px;">
          ${valorSeguro(item.Nome, "Sem Nome")}
        </div>
        <div style="display:flex; justify-content:space-between; font-size:13px;">
          <span>Meta: ${valorSeguro(item[metaCampo], "0")}</span>
          <span>Real: ${valorSeguro(item[valorCampo], "0")}</span>
          <span class="${classePercentual(item[percCampo])}">
            ${valorSeguro(item[percCampo], "0%")}
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
  try {
    const response = await fetch(supervisoresURL);
    const data = await response.json();
    if (!data.length) return;

    renderCard("peso_salty", "Peso_Salty", "Meta_Salty", "perc_Peso_Salty", data);
    renderCard("peso_foods", "Peso_Foods", "Meta_Foods", "perc_Peso_Foods", data);
    renderCard("posit_salty_sup", "Posit_Salty", "Meta_Posit_Salty", "perc_Posit_Salty", data);
    renderCard("posit_foods_sup", "Posit_Foods", "Meta_Posit_Foods", "perc_Posit_Foods", data);
    renderCard("posit_mix_salty_sup", "Posit_Mix_Salty", "Meta_Mix_Salty", "perc_Posit_Mix_Salty", data);
    renderCard("posit_mix_foods_sup", "Posit_Mix_Foods", "Meta_Mix_Foods", "perc_Posit_Mix_Foods", data);

  } catch (error) {
    console.error("Erro ao carregar supervisores:", error);
  }
}


/* ============================= */
/* INICIAR */
/* ============================= */

async function iniciarPainel() {
  await carregarResumo();
  await carregarSupervisores();
  await carregarMetas();
}

iniciarPainel();

/* Atualiza a cada 5 minutos */
setInterval(iniciarPainel, 300000);

