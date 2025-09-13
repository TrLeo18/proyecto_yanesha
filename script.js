const saludos = [
    { es: "Buenos días", ya: "poetarey o  yethoy" },
    { es: "Buenas tardes", ya: "llerroy" },
    { es: "Buenas noches", ya: "tsapoy" },
    { es: "Hola", ya: "Shora" },
    { es: "Adiós", ya: "Jema" },
  ];
  
  const verbos = [
    { es: "Hablar", ya: "eñoreñets" },
    { es: "Comer", ya: "rreñets" },
    { es: "Vivir", ya: "womcheñets" },
    { es: "Trabajar", ya: "tarwaseñets" },
    { es: "Estudiar", ya: "eñotañteñets" },
    { es: "Pensar", ya: "Yopchapechen" },
    { es: "Dormir", ya: "Yomuen" },
    { es: "Jugar", ya: "Yellesheñechen" },
    { es: "Reír", ya: "Yescheta'" },
    { es: "Llorar", ya: "Yawena" },
    { es: "Cantar", ya: "Yesmorrecha'" },
    { es: "Correr", ya: "Yemaya'" },
  ];
  
  const frases = [
    { es: "Estoy bien", ya: "Womchayca" },
    { es: "Quédate en casa", ya: "Allá pecua pocoll" },
    { es: "¿Cómo se llama?", ya: "¿Eso' nesochena?" },
    { es: "¿Cómo está?", ya: "¿Womchapeta?" },
    { es: "¿A dónde va?", ya: "Awen Chesa'" }
  ];
  
  let selected = [];
  let rawScore = 0;
  const maxMatches = 3 + 5 + 1;
  let currentPhrase = null;
  
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  
  function renderPairs(data, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
  
    const colEs = document.createElement("div");
    const colYa = document.createElement("div");
    colEs.className = "column";
    colYa.className = "column";
  
    const indexed = data.map((it, idx) => ({ ...it, id: idx }));
  
    const leftList = shuffle(indexed);
    const rightList = shuffle(indexed);
  
    leftList.forEach(item => {
      const d = document.createElement("div");
      d.className = "block";
      d.textContent = item.es;
      d.dataset.pair = item.id;
      d.dataset.type = "es";
      d.addEventListener("click", () => selectBlock(d));
      colEs.appendChild(d);
    });
  
    rightList.forEach(item => {
      const d = document.createElement("div");
      d.className = "block";
      d.textContent = item.ya;
      d.dataset.pair = item.id;
      d.dataset.type = "ya";
      d.addEventListener("click", () => selectBlock(d));
      colYa.appendChild(d);
    });
  
    container.appendChild(colEs);
    container.appendChild(colYa);
  }
  
  function selectBlock(el) {
    if (el.classList.contains("correct")) return;
  
    if (el.classList.contains("selected")) {
      el.classList.remove("selected");
      selected = selected.filter(s => s !== el);
      return;
    }
  
    const sameType = selected.find(s => s.dataset.type === el.dataset.type);
    if (sameType) {
      sameType.classList.remove("selected");
      selected = selected.filter(s => s !== sameType);
    }
  
    el.classList.add("selected");
    selected.push(el);
  
    if (selected.length === 2) {
      const [a, b] = selected;
  
      if (a.dataset.pair === b.dataset.pair && a.dataset.type !== b.dataset.type) {
        a.classList.remove("selected");
        b.classList.remove("selected");
        a.classList.add("correct");
        b.classList.add("correct");
        a.style.pointerEvents = "none";
        b.style.pointerEvents = "none";
        rawScore++;
      } else {
        a.classList.add("incorrect");
        b.classList.add("incorrect");
        setTimeout(() => {
          a.classList.remove("incorrect");
          b.classList.remove("incorrect");
        }, 400);
  
        a.classList.remove("selected");
        b.classList.remove("selected");
      }
      selected = [];
    }
  }
  
  function nextStage(stage) {
    const current = document.getElementById(`etapa${stage}`);
    const warning = document.getElementById(`warning${stage}`);
    const blocks = current.querySelectorAll(".block");
  
    const allCorrect = blocks.length === 0 || [...blocks].every(b => b.classList.contains("correct"));
  
    if (!allCorrect) {
      warning.innerHTML = `Completa la etapa para continuar.<br>
        <span onclick="forceContinue(${stage})">¿Desea continuar de todos modos? </span>`;
      return;
    }
  
    warning.innerHTML = "";
    showSlide(stage + 1);
  }
  
  function forceContinue(stage) {
    const warning = document.getElementById(`warning${stage}`);
    warning.innerHTML = "";
    showSlide(stage + 1);
  }
  
  function finishQuiz() {
    const respuestaEl = document.getElementById("respuesta");
    const respuesta = respuestaEl ? respuestaEl.value.trim() : "";
  
    if (currentPhrase && respuesta.toLowerCase() === currentPhrase.ya.toLowerCase()) {
      rawScore++;
    }
  
    const finalScore = Math.round((rawScore / maxMatches) * 20);
  
    let mensaje = "";
    if (finalScore <= 5) mensaje = "Te falta aprender más del lenguaje...";
    else if (finalScore <= 12) mensaje = "Tienes conceptos básicos, pero necesitas practicar más.";
    else if (finalScore <= 17) mensaje = "Tienes un mayor conocimiento del idioma, pero aún puedes mejorar.";
    else mensaje = "¡Conoces el idioma a la perfección!";
  
    document.getElementById("puntaje").textContent = `Puntaje final: ${finalScore}/20`;
    document.getElementById("mensaje").textContent = mensaje;
  
    showSlide(4);
  }
  
  function showSlide(n) {
    document.querySelectorAll(".slide").forEach(s => s.classList.remove("active"));
  
    if (n === 3) {
      currentPhrase = frases[Math.floor(Math.random() * frases.length)];
      const fraseEl = document.getElementById("frase");
      fraseEl.innerHTML = `<b>Español:</b> ${currentPhrase.es} <br><b>Yanesha:</b> `;
      const inp = document.createElement("input");
      inp.type = "text";
      inp.id = "respuesta";
      inp.placeholder = "Escribe en Yanesha...";
      inp.style.border = "none";
      inp.style.borderBottom = "1px solid #000";
      inp.style.background = "transparent";
      inp.style.outline = "none";
      inp.style.minWidth = "140px";
      fraseEl.appendChild(inp);
      inp.focus();
    }
  
    if (n >= 1 && n <= 3) {
      document.getElementById(`etapa${n}`).classList.add("active");
    } else {
      document.getElementById("resultados").classList.add("active");
    }
  }
  
  window.onload = function() {
    const randomSaludos = shuffle(saludos).slice(0, 3);
    renderPairs(randomSaludos, "saludos");
  
    const randomVerbos = shuffle(verbos).slice(0, 5);
    renderPairs(randomVerbos, "verbos");
  };
  