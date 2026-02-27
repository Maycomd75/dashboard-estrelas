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
/* RESUMO */
/* ============================= */

function atualizarCard(idValor, idPercentual, idBarra, valor, percentual) {
  const elValor = document.getElementById(idValor);
  const elPercent = document.getElementById(idPercentual);
  const elBarra = document.getElementById(idBarra);

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

    const resultado = document.getElementById("resultado_loja");
    if (resultado) resultado.innerText = valorSeguro(r.resultado_loja);

  } catch (error) {
    console.error("Erro ao carregar resumo:", error);
  }
}

/* ============================= */
/* RENDER PADRÃO */
/* ============================= */

function renderLista(containerId, dataFiltrada) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  const ordenado = [...dataFiltrada].sort((a, b) => {
    return numeroSeguro(b.Percentual) - numeroSeguro(a.Percentual);
  });

  const melhor = ordenado[0]?.Supervisor;

  ordenado.forEach(item => {

    const linha = document.createElement("div");
    linha.classList.add("linha-supervisor");

    if (item.Supervisor === melhor) {
      linha.classList.add("melhor");
    }

    linha.innerHTML = `
      <div style="width:100%">
        <div style="font-weight:600; margin-bottom:2px;">
          ${valorSeguro(item.Supervisor)}
        </div>

        <div style="display:flex; justify-content:space-between; font-size:12px;">
          <span>Meta: ${valorSeguro(item.Meta)}</span>
          <span>Real: ${valorSeguro(item.Real)}</span>
          <span class="${classePercentual(item.Percentual)}">
            ${valorSeguro(item.Percentual)}
          </span>
        </div>
      </div>
    `;

    container.appendChild(linha);
  });
}

/* ============================= */
/* SUPERVISORES + CANAIS */
/* ============================= */

async function carregarSupervisores() {
  try {
    const response = await fetch(supervisoresURL);
    const data = await response.json();
    if (!data.length) return;

    // FILTRA POR CANAL
    const canalOrganizado = data.filter(item => 
      item.Canal?.trim() === "Canal Organizado"
    );

    const pequenoVarejo = data.filter(item => 
      item.Canal?.trim() === "Pequeno Varejo"
    );

    renderLista("canal_organizado", canalOrganizado);
    renderLista("pequeno_varejo", pequenoVarejo);

  } catch (error) {
    console.error("Erro ao carregar supervisores:", error);
  }
}

/* ============================= */
/* METAS */
/* ============================= */

async function carregarMetas() {
  try {
    const response = await fetch(metasURL);
    const data = await response.json();
    if (!data.length) return;

    const m = data[0];

    const ids = [
      "meta_peso_salty",
      "meta_peso_foods",
      "meta_posit_salty",
      "meta_posit_foods",
      "meta_mix_salty",
      "meta_mix_foods",
      "meta_pesquisa"
    ];

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerText = valorSeguro(m[id]);
    });

  } catch (error) {
    console.error("Erro ao carregar metas:", error);
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
setInterval(iniciarPainel, 300000);
