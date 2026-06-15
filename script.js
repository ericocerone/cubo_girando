/**@type {HTMLCanvasElement} */
const c = document.getElementById("myCanvas")
const ctx = c.getContext("2d")

const width = 600
const height = 400
c.width = width
c.height = height
const step = 100 // Vamos considerar que 100 equivale a 1 unidade
const cx = width/2
const cy = height/2

// Variável que vai alimentar o giro do cubo
let anguloGlobal = 0;

/**
 * O MOTOR GRÁFICO 3D -> ISOMÉTRICO
 * Agora recebe o ângulo e aplica a rotação antes da isometria.
 */
function converterCoordenadas(x, y, z, anguloGraus) {
    // 1. Converte o ângulo de graus para radianos
    const rad = anguloGraus * Math.PI / 180;

    // 2. Rotaciona as coordenadas XY (girando o objeto em torno de Z)
    const xRot = (x * Math.cos(rad)) - (y * Math.sin(rad));
    const yRot = (x * Math.sin(rad)) + (y * Math.cos(rad));

    // 3. Aplica a Projeção Isométrica 2:1
    const xIso = xRot - yRot;
    const yIso = ((xRot + yRot) / 2) - z;

    // 4. Converte para coordenadas da tela
    return {
        x: cx + (xIso * step),
        y: cy - (yIso * step)
    };
}

function desenharCuboAnimado() {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "green";
	
    // Usamos d (distância) de 0.5 para que o lado total do cubo continue sendo 1
    const d = 0.5;
	
    // --- 1. BASE DO CUBO (Z = 0) --- Repare que passamos a variável 'anguloGlobal' para girar os vértices
    let b1 = converterCoordenadas(-d, -d, 0.5, anguloGlobal);
    let b2 = converterCoordenadas( d, -d, 0.5, anguloGlobal);
    let b3 = converterCoordenadas( d,  d, 0.5, anguloGlobal);
    let b4 = converterCoordenadas(-d,  d, 0.5, anguloGlobal);
	
	// Desenhando as linhas que conectam os pontos b1, b2, b3 e b4
    ctx.moveTo(b1.x, b1.y); ctx.lineTo(b2.x, b2.y); ctx.lineTo(b3.x, b3.y); ctx.lineTo(b4.x, b4.y); ctx.lineTo(b1.x, b1.y); // Fecha a base

	// --- 2. TOPO DO CUBO (Z = 1) ---
    let t1 = converterCoordenadas(-d, -d, -0.5, anguloGlobal);
    let t2 = converterCoordenadas( d, -d, -0.5, anguloGlobal);
    let t3 = converterCoordenadas( d,  d, -0.5, anguloGlobal);
    let t4 = converterCoordenadas(-d,  d, -0.5, anguloGlobal);
	
	// Desenhando as linhas que conectam os pontos t1, t2, t3 e t4
    ctx.moveTo(t1.x, t1.y); ctx.lineTo(t2.x, t2.y); ctx.lineTo(t3.x, t3.y); ctx.lineTo(t4.x, t4.y); ctx.lineTo(t1.x, t1.y); // Fecha o topo
    
	// --- 3. PILASTRAS (Conectando a Base ao Topo) ---
    ctx.moveTo(b1.x, b1.y); ctx.lineTo(t1.x, t1.y); 
    ctx.moveTo(b2.x, b2.y); ctx.lineTo(t2.x, t2.y); 
    ctx.moveTo(b3.x, b3.y); ctx.lineTo(t3.x, t3.y); 
    ctx.moveTo(b4.x, b4.y); ctx.lineTo(t4.x, t4.y); 

    ctx.stroke();
}

/**
 * O LOOP DE RENDERIZAÇÃO
 */
function animar() {
    // 1. Limpa a tela inteira a cada frame para não borrar [cite: 102]
    ctx.clearRect(0, 0, width, height); 

    // 2. Desenha o quadro atual
    desenharCuboAnimado();

    // 3. Aumenta o ângulo para o próximo quadro
    anguloGlobal += 1; 

    // 4. Pede para o navegador avisar quando for a hora de desenhar de novo 
    requestAnimationFrame(animar); 
}

// Dá a partida no motor!
animar();