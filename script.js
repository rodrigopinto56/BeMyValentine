const scene1 = document.getElementById("scene1");
const scene2 = document.getElementById("scene2");
const openLetterBtn = document.getElementById("openLetterBtn");
const backBtn = document.getElementById("backBtn");
const confettiBtn = document.getElementById("confettiBtn");
const saveBtn = document.getElementById("saveBtn");
const finalModal = document.getElementById("finalModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const finalMessage = document.getElementById("finalMessage");
const todayEl = document.getElementById("today");

todayEl.textContent = new Date().toLocaleDateString("es-MX", {
  weekday: "long", year: "numeric", month: "short", day: "numeric"
});

// Personaliza aquí rápido (opcional)
document.getElementById("herName").textContent = "Luna";  // <- cambia por el nombre real
document.getElementById("myName").textContent = "Angel";   // <- tu nombre

openLetterBtn.addEventListener("click", () => {
  scene1.classList.add("hidden");
  scene2.classList.remove("hidden");
});

backBtn.addEventListener("click", () => {
  scene2.classList.add("hidden");
  scene1.classList.remove("hidden");
});

// Confetti simple (sin librerías)
const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");
let confetti = [];
let animId = null;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function rand(min, max){ return Math.random() * (max - min) + min; }

function launchConfetti() {
  confetti = Array.from({ length: 220 }, () => ({
    x: rand(0, canvas.width),
    y: rand(-canvas.height, 0),
    r: rand(2, 6),
    vx: rand(-1.2, 1.2),
    vy: rand(2, 5),
    rot: rand(0, Math.PI * 2),
    vr: rand(-0.1, 0.1),
    // sin colores fijos: hsl aleatorio
    hue: Math.floor(rand(0, 360))
  }));

  if (animId) cancelAnimationFrame(animId);
  const start = performance.now();

  function tick(t) {
    const elapsed = t - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confetti.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;

      // wrap
      if (p.y > canvas.height + 20) p.y = -20;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = `hsl(${p.hue} 90% 60%)`;
      ctx.fillRect(-p.r, -p.r, p.r * 2.2, p.r * 1.4);
      ctx.restore();
    });

    if (elapsed < 2600) animId = requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  animId = requestAnimationFrame(tick);
}

confettiBtn.addEventListener("click", () => {
  launchConfetti();

  if ("vibrate" in navigator) {
    navigator.vibrate([120, 60, 120, 60, 220]);
  }

  finalMessage.textContent = `Te amo nos veremos de nuevo pronto... Aqui esta tu mundo para ti siempre.`;
  finalModal.classList.remove("hidden");
});
closeModalBtn.addEventListener("click", () => {
  finalModal.classList.add("hidden");
});

// Cerrar si toca fuera de la caja
finalModal.addEventListener("click", (e) => {
  if (e.target === finalModal) finalModal.classList.add("hidden");
});

saveBtn.addEventListener("click", () => {
  const her = document.getElementById("herName").textContent;
  const me = document.getElementById("myName").textContent;

  // Toma TODO el texto de la carta (solo el contenido de la columna de texto)
  const letterText = document.querySelector(".paper__text").innerText.trim();

  const content =
`Carta para: ${her}
De: ${me}
Fecha: ${new Date().toLocaleDateString("es-MX")}

${letterText}
`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `Carta_para_${her}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);

  // mini vibración al guardar
  if ("vibrate" in navigator) navigator.vibrate(60);
});

