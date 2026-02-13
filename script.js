// ======================================================
// 1) CONTROLE GLOBAL
// ======================================================
let currentMapName = "salaPrincipal";
let isMenuOpen = false;                 // trava o player quando abrir o menu
let selectedCharacterKey = "manequim";  // personagem selecionado no menu
let debugEnabled = false;                // começa desligado

// ======================================================
// 2) CONFIG DE FUNDO E SPAWN POR MAPA
// ======================================================
const mapBackgrounds = {
  salaPrincipal: "img/map/sala-principal.png",
  salaJogos: "img/map/sala-jogos.png",
};

const mapSpawns = {
  salaPrincipal: { x: 200, y: 450 },
  salaJogos: { x: 520, y: 120 },
};

// ======================================================
// 3) DEFINIÇÃO DOS MAPAS (ESTRUTURAL)
// ======================================================
const maps = {
  salaPrincipal: {
    name: "Sala Principal",
    background: "img/map/sala-principal.png",
    width: 1100,
    height: 650,
    spawn: { x: 500, y: 420 },
    walls: [],
    furniture: [{ x: 425, y: 290, width: 250, height: 135 }],
    doors: [
      {
        id: "goToGameRoom",
        x: 520,
        y: 570,
        width: 60,
        height: 20,
        target: "salaJogos",
        spawnTarget: { x: 520, y: 480 },
      },
    ],
  },

  salaJogos: {
    name: "Sala de Jogos",
    background: "img/map/sala-jogos.png",
    width: 1100,
    height: 650,
    spawn: { x: 520, y: 100 },
    walls: [
      { x: 0, y: 0, width: 1100, height: 60 },
      { x: 0, y: 590, width: 1100, height: 60 },
      { x: 0, y: 0, width: 60, height: 650 },
      { x: 1040, y: 0, width: 60, height: 650 },
    ],
    furniture: [{ x: 425, y: 290, width: 250, height: 135 }],
    doors: [
      {
        id: "backToMain",
        x: 500,
        y: 0,
        width: 60,
        height: 20,
        target: "salaPrincipal",
        spawnTarget: { x: 100, y: 345 },
      },
    ],
  },
};

// ======================================================
// 4) ELEMENTOS HTML
// ======================================================
const world = document.getElementById("world");
const otherPlayers = {}; // { id: { el, avatarEl, nameEl } }

const player = document.getElementById("player");
const avatar = document.getElementById("avatar");
avatar.classList.add("manequim");

const nameLabel = document.querySelector("#player .name");

const characterMenu = document.getElementById("characterMenu");
const closeMenu = document.getElementById("closeMenu");
const previewAvatar = document.getElementById("previewAvatar");
const previewName = document.getElementById("previewName");
const nameInput = document.getElementById("nameInput");
const selectCharacterBtn = document.getElementById("selectCharacterBtn");

characterMenu.style.display = "none";

// ======================================================
// 5) PLAYER
// ======================================================
let posX = 200;
let posY = 450;

const speed = 5;
const joystickSpeedMultiplier = 0.015; // velocidade no joystick
const size = 96;

// ======================================================
// 6) SISTEMA DE PERSONAGENS
// ======================================================
const characters = {
  manequim: {
    frente: "img/avatar/manequim/avatar-inicial-frente-96x96.png",
    costas: "img/avatar/manequim/avatar-inicial-costa-96x96.png",
    esquerda: "img/avatar/manequim/avatar-inicial-esquerda-96x96.png",
    direita: "img/avatar/manequim/avatar-inicial-direita-96x96.png",
    emotes: {
      1: "img/avatar/manequim/avatar-inicial-emote1-96x96.png",
      sit: null
    },

  },

  chindu: {
    frente: "img/avatar/chindu/chindu-frente-96x96.png",
    costas: "img/avatar/chindu/chindu-costa-96x96.png",
    esquerda: "img/avatar/chindu/chindu-esquerda-96x96.png",
    direita: "img/avatar/chindu/chindu-direita-96x96.png",
    emotes: {
      1: "img/avatar/chindu/chindu-emote1-96x96.png",
      2: "img/avatar/chindu/chindu-emote2-96x96.png",
      3: "img/avatar/chindu/chindu-emote3-96x96.png",
      4: "img/avatar/chindu/chindu-emote4-96x96.png",
      sit: "img/avatar/chindu/chindu-sentado-96x96.png"
    },
  },

  milo: {
    frente: "img/avatar/milo/milo-frente-96x96.png",
    costas: "img/avatar/milo/milo-costa-96x96.png",
    esquerda: "img/avatar/milo/milo-esquerda-96x96.png",
    direita: "img/avatar/milo/milo-direita-96x96.png",
    emotes: {
      1: "img/avatar/milo/milo-emote1-96x96.png",
      2: "img/avatar/milo/milo-emote2-96x96.png",
      3: "img/avatar/milo/milo-emote3-96x96.png",
      4: "img/avatar/milo/milo-emote4-96x96.png",
      sit: "img/avatar/milo/milo-sentado-96x96.png"
    },
  },

  bigJonh: {
    frente: "img/avatar/bigJonh/bigJonh-frente-96x96.png",
    costas: "img/avatar/bigJonh/bigJonh-costa-96x96.png",
    esquerda: "img/avatar/bigJonh/bigJonh-esquerda-96x96.png",
    direita: "img/avatar/bigJonh/bigJonh-direita-96x96.png",
    emotes: {
      1: "img/avatar/bigJonh/bigJonh-emote1-96x96.png",
      2: "img/avatar/bigJonh/bigJonh-emote2-96x96.png",
      3: "img/avatar/bigJonh/bigJonh-emote3-96x96.png",
      4: "img/avatar/bigJonh/bigJonh-emote4-96x96.png",
      sit: "img/avatar/bigJonh/bigJonh-sentado-96x96.png"
    },
  },

  void: {
    frente: "img/avatar/void/void-frente-96x96.png",
    costas: "img/avatar/void/void-costa-96x96.png",
    esquerda: "img/avatar/void/void-esquerda-96x96.png",
    direita: "img/avatar/void/void-direita-96x96.png",
    emotes: {
      1: "img/avatar/void/void-emote1-96x96.png",
      2: "img/avatar/void/void-emote2-96x96.png",
      3: "img/avatar/void/void-emote3-96x96.png",
      4: "img/avatar/void/void-emote4-96x96.png",
      sit: "img/avatar/void/void-sentado-96x96.png"
    },
  },

  mimi: {
    frente: "img/avatar/mimi/mimi-frente-96x96.png",
    costas: "img/avatar/mimi/mimi-costa-96x96.png",
    esquerda: "img/avatar/mimi/mimi-esquerda-96x96.png",
    direita: "img/avatar/mimi/mimi-direita-96x96.png",
    emotes: {
      1: "img/avatar/mimi/mimi-emote1-96x96.png",
      2: "img/avatar/mimi/mimi-emote2-96x96.png",
      3: "img/avatar/mimi/mimi-emote3-96x96.png",
      4: "img/avatar/mimi/mimi-emote4-96x96.png",
      sit: "img/avatar/mimi/mimi-sentado-96x96.png"
    },
  },

  skatt: {
    frente: "img/avatar/skatt/skatt-frente-96x96.png",
    costas: "img/avatar/skatt/skatt-costa-96x96.png",
    esquerda: "img/avatar/skatt/skatt-esquerda-96x96.png",
    direita: "img/avatar/skatt/skatt-direita-96x96.png",
    emotes: {
      1: "img/avatar/skatt/skatt-emote1-96x96.png",
      2: "img/avatar/skatt/skatt-emote2-96x96.png",
      3: "img/avatar/skatt/skatt-emote3-96x96.png",
      4: "img/avatar/skatt/skatt-emote4-96x96.png",
      sit: "img/avatar/skatt/skatt-sentado-96x96.png"
    },
  },

  vodoll: {
    frente: "img/avatar/vodoll/vodoll-frente-96x96.png",
    costas: "img/avatar/vodoll/vodoll-costa-96x96.png",
    esquerda: "img/avatar/vodoll/vodoll-esquerda-96x96.png",
    direita: "img/avatar/vodoll/vodoll-direita-96x96.png",
    emotes: {
      1: "img/avatar/vodoll/vodoll-emote1-96x96.png",
      2: "img/avatar/vodoll/vodoll-emote2-96x96.png",
      3: "img/avatar/vodoll/vodoll-emote3-96x96.png",
      4: "img/avatar/vodoll/vodoll-emote4-96x96.png",
      sit: "img/avatar/vodoll/vodoll-sentado-96x96.png"
    },
  },


};

let currentCharacter = characters.manequim;
let currentDirection = "frente";
let isEmoting = false;

// ======================================================
// 7) SPRITES (DIREÇÃO + EMOTES)
// ======================================================
function setAvatar(direction) {
  if (isEmoting) return;
  currentDirection = direction;
  avatar.src = currentCharacter[direction];
}

function playEmote(emoteNumber) {
  if (isEmoting) return;

  const emoteImg = currentCharacter.emotes[emoteNumber];
  if (!emoteImg) return;

  isEmoting = true;
  avatar.src = emoteImg;

  setTimeout(() => {
    isEmoting = false;
    setAvatar(currentDirection);
  }, 1200);
}

// ======================================================
// 8) PREVIEW DO MENU
// ======================================================
function updatePreview(characterKey) {
  previewAvatar.src = characters[characterKey].frente;
  previewName.textContent = characterKey;

  previewAvatar.classList.remove("manequim", "chindu", "milo", "bigJonh", "void", "mimi", "skatt", "vodoll");
  previewAvatar.classList.add(characterKey);
}

// ======================================================
// 9) ABRIR / FECHAR MENU
// ======================================================
function openCharacterMenu() {
  characterMenu.style.display = "block";
  isMenuOpen = true;

  updatePreview(selectedCharacterKey);
  nameInput.value = nameLabel.textContent;

  setTimeout(() => {
    nameInput.focus();
    nameInput.select();
  }, 0);
}

function closeCharacterMenu() {
  characterMenu.style.display = "none";
  isMenuOpen = false;
}

closeMenu.addEventListener("click", closeCharacterMenu);

// ======================================================
// 10) BOTÕES DE PERSONAGEM
// ======================================================
const characterButtonsEls = document.querySelectorAll("#characterMenu button[data-character]");

characterButtonsEls.forEach((button) => {
  const characterKey = button.dataset.character;

  button.addEventListener("mouseenter", () => updatePreview(characterKey));
  button.addEventListener("mouseleave", () => updatePreview(selectedCharacterKey));
  button.addEventListener("pointerdown", () => updatePreview(characterKey));

  button.addEventListener("click", () => {
    selectedCharacterKey = characterKey;

    characterButtonsEls.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");

    updatePreview(selectedCharacterKey);
  });
});

// ======================================================
// 11) APLICAR (NOME + PERSONAGEM)
// ======================================================
selectCharacterBtn.addEventListener("click", () => {
  const newName = nameInput.value.trim();

  if (!newName) {
    alert("Digite um nome válido!");
    return;
  }

  if (nameLabel) nameLabel.textContent = newName.slice(0, 16);

  currentCharacter = characters[selectedCharacterKey];

  avatar.classList.remove("manequim", "chindu", "milo", "bigJonh", "void", "mimi", "skatt", "vodoll");
  avatar.classList.add(selectedCharacterKey);

  setAvatar("frente");

  if (window.socket && window.socket.connected) {
    window.socket.emit("player:state", {
      x: posX,
      y: posY,
      dir: currentDirection,
      characterKey: selectedCharacterKey,
    });
  }


  // ✅ atualiza nome no servidor do chat
  if (typeof syncNameToServer === "function") syncNameToServer();

  closeCharacterMenu();
});

// ======================================================
// 12) TROCA DE MAPA
// ======================================================
function changeMap(mapName, spawnOverride = null) {
  currentMapName = mapName;

  const mapaImg = document.getElementById("mapa");
  if (mapaImg) mapaImg.src = mapBackgrounds[mapName];

  const map = maps[mapName];
  if (map) {
    world.style.backgroundImage = `url(${map.background})`;
    world.style.width = map.width + "px";
    world.style.height = map.height + "px";
  }

  if (spawnOverride) {
    posX = spawnOverride.x;
    posY = spawnOverride.y;
  } else {
    posX = mapSpawns[mapName].x;
    posY = mapSpawns[mapName].y;
  }

  player.style.left = posX + "px";
  player.style.top = posY + "px";

  // ✅ avisa o servidor que você mudou de sala (chat por sala)
  if (window.socket && window.socket.emit) {
    window.socket.emit("room:join", mapName);
  }
  // limpa players que eram da sala anterior (evita “fantasmas”)
  Object.keys(otherPlayers).forEach(removeOtherPlayer);

  // manda seu estado na nova sala
  if (window.socket && window.socket.connected) {
    window.socket.emit("player:state", {
      x: posX,
      y: posY,
      dir: currentDirection,
      characterKey: selectedCharacterKey,
    });
  }

  if (chatDock) chatDock.classList.add("closed");
  if (chatToggleBtn) chatToggleBtn.textContent = "Abrir";


  drawDebug();
}




// ======================================================
// 13) HITBOX DO PLAYER
// ======================================================
function getPlayerHitbox() {
  return { x: posX + 28, y: posY + 60, width: 40, height: 28 };
}

function getPlayerCircle() {
  return { x: posX + 48, y: posY + 78, radius: 24 };
}

// ======================================================
// 14) VIEWPORT (CÂMERA)
// ======================================================
const worldWidth = 1100;
const worldHeight = 650;

let viewWidth = window.innerWidth;
let viewHeight = window.innerHeight;

function updateViewportSize() {
  viewWidth = window.innerWidth;
  viewHeight = window.innerHeight;
}

window.addEventListener("resize", updateViewportSize);
window.addEventListener("orientationchange", updateViewportSize);

// ======================================================
// 15) PORTAS - SALA PRINCIPAL (3) + SALA DE JOGOS (1)
// ======================================================
const doors = [
  { x: 100, y: 350, width: 60, height: 20, isOpen: false },
  { x: 520, y: 570, width: 60, height: 20, isOpen: false },
  { x: 940, y: 350, width: 60, height: 20, isOpen: false },
];

doors.forEach((door) => {
  door.interactionZone = {
    x: door.x - 20,
    y: door.y - 20,
    width: door.width + 40,
    height: door.height + 40,
  };
});

const salaJogosDoor = {
  ...maps.salaJogos.doors[0],
  x: 520,
  y: 120,
  isOpen: false,
};

salaJogosDoor.interactionZone = {
  x: salaJogosDoor.x - 20,
  y: salaJogosDoor.y - 20,
  width: salaJogosDoor.width + 40,
  height: salaJogosDoor.height + 40,
};

function getActiveDoors() {
  return currentMapName === "salaJogos" ? [salaJogosDoor] : doors;
}

// ======================================================
// 16) COLISÕES POR MAPA
// ======================================================
const mapCollisions = {
  salaPrincipal: {
    walls: [
      { x: 50, y: 0, width: 990, height: 50 },
      { x: 50, y: 20, width: 20, height: 580 },
      { x: 1030, y: 20, width: 20, height: 550 },
      { x: 50, y: 535, width: 430, height: 65 },
      { x: 620, y: 535, width: 430, height: 65 },
    ],
    furniture: [
      { x: 823, y: 90, width: 185, height: 100 },
      { x: 700, y: 60, width: 100, height: 120 },
      { x: 455, y: 60, width: 190, height: 120 },
      { x: 295, y: 60, width: 100, height: 120 },
    ],
  },

  salaJogos: {
    walls: [
      { x: 0, y: 0, width: 1100, height: 60 },
      { x: 0, y: 590, width: 1100, height: 60 },
      { x: 0, y: 0, width: 60, height: 650 },
      { x: 1040, y: 0, width: 60, height: 650 },
    ],
    furniture: [{ x: 425, y: 290, width: 250, height: 135 }],
  },
};

const roundCollisions = {
  salaPrincipal: [
    { x: 143, y: 143, radius: 55 },
    { x: 145, y: 510, radius: 55 },
    { x: 960, y: 510, radius: 55 },
  ],
};

const fireplaceInteraction = { x: 435, y: 60, width: 230, height: 160 };
const tableInteraction = { x: 550, y: 360, radius: 90 };
const tableCollision = { x: 550, y: 360, radiusX: 120, radiusY: 70 };
// ✅ INTERAÇÃO RETANGULAR — MESA DA SALA DE JOGOS
// ajuste x/y/width/height pra cobrir a mesa certinho
const gameTableInteractionRect = {
  x: 360,
  y: 235,
  width: 380,
  height: 220
};


// ======================================================
// (B) POSIÇÕES DOS ASSENTOS (AJUSTA DEPOIS)
// - x/y aqui é a POSIÇÃO DO PLAYER (top-left)
// ======================================================
const tableSeatsPositions = {
  GM: { x: 505, y: 170 }, // mestre (topo da mesa)
  P1: { x: 615, y: 170 },
  P2: { x: 695, y: 270 },
  P3: { x: 615, y: 350 },
  P4: { x: 505, y: 350 },
  P5: { x: 395, y: 350 },
  P6: { x: 315, y: 265 },
  P7: { x: 395, y: 170 }
};
const tableExitPosition = {
  x: 520,
  y: 420 // abaixo da mesa (fora da colisão)
};


// ======================================================
// 17) FUNÇÕES DE COLISÃO
// ======================================================
function isCollision(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function isCircleCollision(circleA, circleB) {
  const dx = circleA.x - circleB.x;
  const dy = circleA.y - circleB.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < circleA.radius + circleB.radius;
}

function isEllipseRectCollision(ellipse, rect) {
  const rectCenterX = rect.x + rect.width / 2;
  const rectCenterY = rect.y + rect.height / 2;

  const dx = (rectCenterX - ellipse.x) / ellipse.radiusX;
  const dy = (rectCenterY - ellipse.y) / ellipse.radiusY;

  return dx * dx + dy * dy <= 1;
}
function isCircleRectCollision(circle, rect) {
  const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
  const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

  const dx = circle.x - closestX;
  const dy = circle.y - closestY;

  return (dx * dx + dy * dy) < (circle.radius * circle.radius);
}


// ======================================================
// 18) MOVIMENTO DO PLAYER
// ======================================================
function movePlayer(dx, dy) {
  if (isSeated) return;

  const next = { x: posX + dx + 28, y: posY + dy + 60, width: 40, height: 28 };

  const currentWalls = mapCollisions[currentMapName].walls;
  const currentFurniture = mapCollisions[currentMapName].furniture;

  for (let w of currentWalls) if (isCollision(next, w)) return;
  for (let f of currentFurniture) if (isCollision(next, f)) return;

  if (roundCollisions[currentMapName]) {
    const playerCircle = { x: next.x + next.width / 2, y: next.y + next.height / 2, radius: 30 };
    for (let obj of roundCollisions[currentMapName]) {
      if (isCircleCollision(playerCircle, obj)) return;
    }
  }

  if (currentMapName === "salaPrincipal") {
    if (isEllipseRectCollision(tableCollision, next)) return;
  }

  const activeDoors = getActiveDoors();
  for (let d of activeDoors) if (!d.isOpen && isCollision(next, d)) return;

  // ✅ andou de verdade
  posX += dx;
  posY += dy;

  // ✅ manda estado pro servidor (AGORA NO LUGAR CERTO)
  if (window.socket && window.socket.connected) {
    window.socket.emit("player:state", {
      x: posX,
      y: posY,
      dir: currentDirection,
      characterKey: selectedCharacterKey,
    });
  }
}

// ======================================================
// 19) INTERAÇÃO COM PORTA (E / AÇÃO)
// ======================================================
function interactDoor() {
  const playerBox = getPlayerHitbox();

  if (currentMapName === "salaJogos") {
    if (isCollision(playerBox, salaJogosDoor.interactionZone)) {
      changeMap("salaPrincipal", salaJogosDoor.spawnTarget);
    }
    return;
  }

  doors.forEach((door, index) => {
    if (isCollision(playerBox, door.interactionZone)) {
      if (index === 1) door.isOpen = true;

      if (index === 0) {
        if (currentMapName === "salaPrincipal") changeMap("salaJogos");
        else changeMap("salaPrincipal");
      }
    }
  });
}

// ======================================================
// 20) UI — MENSAGENS (E)
// ======================================================
const doorMessage = document.createElement("div");
doorMessage.innerText = "Pressione E para abrir";
doorMessage.style.position = "absolute";
doorMessage.style.padding = "6px 10px";
doorMessage.style.background = "rgba(0,0,0,0.7)";
doorMessage.style.color = "yellow";
doorMessage.style.borderRadius = "6px";
doorMessage.style.display = "none";
doorMessage.style.pointerEvents = "none";
world.appendChild(doorMessage);

const fireplaceMessage = document.createElement("div");
fireplaceMessage.innerText = "🔥 Bem-vindo à Broken Mirror RPG";
fireplaceMessage.style.position = "absolute";
fireplaceMessage.style.padding = "8px 14px";
fireplaceMessage.style.background = "rgba(0,0,0,0.7)";
fireplaceMessage.style.color = "#ffcc66";
fireplaceMessage.style.borderRadius = "8px";
fireplaceMessage.style.display = "none";
fireplaceMessage.style.pointerEvents = "none";
fireplaceMessage.style.fontSize = "14px";
world.appendChild(fireplaceMessage);

const tableMessage = document.createElement("div");
tableMessage.innerText = "Pressione E para escolher personagem";
tableMessage.style.position = "absolute";
tableMessage.style.padding = "8px 14px";
tableMessage.style.background = "rgba(0,0,0,0.75)";
tableMessage.style.color = "#7CFC00";
tableMessage.style.borderRadius = "8px";
tableMessage.style.display = "none";
tableMessage.style.pointerEvents = "none";
tableMessage.style.fontSize = "14px";
world.appendChild(tableMessage);

// ======================================================
// UI — MENSAGEM DA MESA (SALA DE JOGOS)
// ======================================================
const gameTableMessage = document.createElement("div");
gameTableMessage.innerText = "Aperte E para escolher um lugar na mesa";
gameTableMessage.style.position = "absolute";
gameTableMessage.style.padding = "8px 14px";
gameTableMessage.style.background = "rgba(0,0,0,0.75)";
gameTableMessage.style.color = "#00E5FF";
gameTableMessage.style.borderRadius = "8px";
gameTableMessage.style.display = "none";
gameTableMessage.style.pointerEvents = "none";
gameTableMessage.style.fontSize = "14px";
world.appendChild(gameTableMessage);


function updateFireplaceMessage() {
  if (currentMapName !== "salaPrincipal") {
    fireplaceMessage.style.display = "none";
    return;
  }

  const playerBox = getPlayerHitbox();
  if (isCollision(playerBox, fireplaceInteraction)) {
    fireplaceMessage.style.left = fireplaceInteraction.x + 30 + "px";
    fireplaceMessage.style.top = fireplaceInteraction.y - 30 + "px";
    fireplaceMessage.style.display = "block";
  } else {
    fireplaceMessage.style.display = "none";
  }
}

function updateDoorMessage() {
  const playerBox = getPlayerHitbox();
  let show = false;

  const activeDoors = getActiveDoors();
  activeDoors.forEach((door) => {
    if (!door.isOpen && isCollision(playerBox, door.interactionZone)) {
      doorMessage.style.left = door.x + "px";
      doorMessage.style.top = door.y - 30 + "px";
      show = true;
    }
  });

  doorMessage.style.display = show ? "block" : "none";
}

function updateTableMessage() {
  if (currentMapName !== "salaPrincipal") {
    tableMessage.style.display = "none";
    return;
  }

  const playerCircle = getPlayerCircle();
  if (isCircleCollision(playerCircle, tableInteraction)) {
    tableMessage.style.left = tableInteraction.x - 110 + "px";
    tableMessage.style.top = tableInteraction.y - 110 + "px";
    tableMessage.style.display = "block";
  } else {
    tableMessage.style.display = "none";
  }
}

// ======================================================
// (NOVO) Mensagem da mesa da Sala de Jogos
// ======================================================
function updateGameTableMessage() {
  if (currentMapName !== "salaJogos") {
    gameTableMessage.style.display = "none";
    return;
  }

  const playerCircle = getPlayerCircle();

  if (isCircleRectCollision(playerCircle, gameTableInteractionRect)) {
    gameTableMessage.style.left = (gameTableInteractionRect.x + 10) + "px";
    gameTableMessage.style.top = (gameTableInteractionRect.y - 40) + "px";
    gameTableMessage.style.display = "block";
  } else {
    gameTableMessage.style.display = "none";
  }

}

function openSeatMenu() {
  alert("Abrir menu de lugares (em breve)");
}

// ======================================================
// 21) CONTROLES TECLADO
// ======================================================
document.addEventListener("keydown", (e) => {
  const key = (e.key || "").toLowerCase();

  if (isMenuOpen) {
    if (key === "escape") {
      if (tablePanel && tablePanel.style.display === "block") closeTablePanelFn();
      if (characterMenu && characterMenu.style.display === "block") closeCharacterMenu();
    }
    return;
  }

  // Debug
  if (e.key === "F1") { e.preventDefault(); toggleDebug(); return; }

  // Dado
  if (e.key === "F2") { const roll = Math.floor(Math.random() * 20) + 1; animateD20(roll); return; }

  // Emotes (usa e.code, pode ficar igual)
  if (!isSeated) {
    const k = e.code;
    if (k === "Digit1" || k === "Numpad1") { e.preventDefault(); playEmote(1); return; }
    if (k === "Digit2" || k === "Numpad2") { e.preventDefault(); playEmote(2); return; }
    if (k === "Digit3" || k === "Numpad3") { e.preventDefault(); playEmote(3); return; }
    if (k === "Digit4" || k === "Numpad4") { e.preventDefault(); playEmote(4); return; }
  }

  // Movimento (agora com key normalizado)
  if (key === "w" || e.key === "ArrowUp") { movePlayer(0, -speed); setAvatar("costas"); }
  if (key === "s" || e.key === "ArrowDown") { movePlayer(0, speed); setAvatar("frente"); }
  if (key === "a" || e.key === "ArrowLeft") { movePlayer(-speed, 0); setAvatar("esquerda"); }
  if (key === "d" || e.key === "ArrowRight") { movePlayer(speed, 0); setAvatar("direita"); }

  if (key === "e") {
    e.preventDefault();
    const playerCircle = getPlayerCircle();
    if (currentMapName === "salaPrincipal" && isCircleCollision(playerCircle, tableInteraction)) { e.preventDefault(); openCharacterMenu(); return; }
    if (currentMapName === "salaJogos" && isCircleRectCollision(playerCircle, gameTableInteractionRect)) { e.preventDefault(); openTablePanel(); return; }
    interactDoor();
  }

  player.style.left = posX + "px";
  player.style.top = posY + "px";
});

// ✅ FECHOU O EVENTO AQUI


// ======================================================
// 22) DEBUG VISUAL
// ======================================================
function createBox(o, color) {
  const el = document.createElement("div");
  el.className = "debug";
  el.style.position = "absolute";
  el.style.left = o.x + "px";
  el.style.top = o.y + "px";
  el.style.width = o.width + "px";
  el.style.height = o.height + "px";
  el.style.background = color;
  el.style.pointerEvents = "none";
  el.style.zIndex = 9999;
  world.appendChild(el);
}

function createCircle(c, color) {
  const el = document.createElement("div");
  el.className = "debug";
  el.style.position = "absolute";
  el.style.left = c.x - c.radius + "px";
  el.style.top = c.y - c.radius + "px";
  el.style.width = c.radius * 2 + "px";
  el.style.height = c.radius * 2 + "px";
  el.style.borderRadius = "50%";
  el.style.background = color;
  el.style.pointerEvents = "none";
  el.style.zIndex = 9999;
  world.appendChild(el);
}

function createEllipse(e, color) {
  const el = document.createElement("div");
  el.className = "debug";
  el.style.position = "absolute";
  el.style.left = e.x - e.radiusX + "px";
  el.style.top = e.y - e.radiusY + "px";
  el.style.width = e.radiusX * 2 + "px";
  el.style.height = e.radiusY * 2 + "px";
  el.style.borderRadius = "50%";
  el.style.background = color;
  el.style.pointerEvents = "none";
  el.style.zIndex = 9999;
  world.appendChild(el);
}

function drawDebug() {
  world.querySelectorAll(".debug").forEach((e) => e.remove());
  if (!debugEnabled) return;

  mapCollisions[currentMapName].walls.forEach((w) => createBox(w, "rgba(0,0,255,0.4)"));
  mapCollisions[currentMapName].furniture.forEach((f) => createBox(f, "rgba(139,69,19,0.4)"));

  const activeDoors = getActiveDoors();
  activeDoors.forEach((d) => createBox(d, "rgba(255,255,0,0.4)"));
  activeDoors.forEach((d) => createBox(d.interactionZone, "rgba(0,255,0,0.3)"));

  if (currentMapName === "salaPrincipal") {
    createBox(fireplaceInteraction, "rgba(255,0,0,0.3)");
    createEllipse(tableCollision, "rgba(255,0,0,0.4)");
    createCircle(tableInteraction, "rgba(0,255,0,0.3)");
  }

  if (currentMapName === "salaJogos") {
    createBox(gameTableInteractionRect, "rgba(0,200,255,0.25)");
  }



  if (roundCollisions[currentMapName]) {
    roundCollisions[currentMapName].forEach((c) => createCircle(c, "rgba(0,255,255,0.4)"));
  }
}

function toggleDebug() {
  debugEnabled = !debugEnabled;
  drawDebug();
}

// ======================================================
// 23) INICIALIZAÇÃO
// ======================================================
function loadMap(mapKey) {
  currentMapName = mapKey;

  const map = maps[mapKey];

  world.style.backgroundImage = `url(${map.background})`;
  world.style.width = map.width + "px";
  world.style.height = map.height + "px";

  posX = map.spawn.x;
  posY = map.spawn.y;

  player.style.left = posX + "px";
  player.style.top = posY + "px";

  drawDebug();
  setAvatar("frente");
}

loadMap("salaPrincipal");

// ======================================================
// 24) GAME LOOP (CÂMERA)
// ======================================================
function gameLoop() {
  updateDoorMessage();
  updateFireplaceMessage();
  updateTableMessage();
  updateGameTableMessage();


  const playerCenterX = posX + size / 2;
  const playerCenterY = posY + size / 2;

  const camX = Math.max(0, Math.min(worldWidth - viewWidth, playerCenterX - viewWidth / 2));
  const camY = Math.max(0, Math.min(worldHeight - viewHeight, playerCenterY - viewHeight / 2));

  world.style.transform = `translate(${-camX}px, ${-camY}px)`;

  requestAnimationFrame(gameLoop);
}

gameLoop();

// ======================================================
// 25) MOBILE CONTROLS (JOYSTICK + AÇÃO)
// ======================================================
(function mobileControls() {
  const joystickBase = document.getElementById("joystickBase");
  const joystickStick = document.getElementById("joystickStick");
  const actionBtn = document.getElementById("actionBtn");

  if (!joystickBase || !joystickStick) {
    console.warn("Joystick não encontrado no HTML.");
    return;
  }

  joystickBase.style.touchAction = "none";
  joystickStick.style.touchAction = "none";
  if (actionBtn) actionBtn.style.touchAction = "none";

  const DEADZONE = 8;
  const MAX_DIST = 40;
  const INTERVAL = 16;

  let dragging = false;
  let pointerId = null;
  let dx = 0;
  let dy = 0;
  let loop = null;

  function startLoop() {
    if (loop) return;

    loop = setInterval(() => {
      if (!dragging) return;
      if (isMenuOpen) return;

      const dist = Math.hypot(dx, dy);
      if (dist < DEADZONE) return;

      const nx = dx / MAX_DIST;
      const ny = dy / MAX_DIST;

      const moveX = nx * speed;
      const moveY = ny * speed;

      movePlayer(
        dx * speed * joystickSpeedMultiplier,
        dy * speed * joystickSpeedMultiplier
      );

      if (Math.abs(moveX) > Math.abs(moveY)) {
        setAvatar(moveX > 0 ? "direita" : "esquerda");
      } else {
        setAvatar(moveY > 0 ? "frente" : "costas");
      }

      player.style.left = posX + "px";
      player.style.top = posY + "px";
    }, INTERVAL);
  }

  function stopLoop() {
    if (loop) {
      clearInterval(loop);
      loop = null;
    }
  }

  function setStickVisual(x, y) {
    joystickStick.style.transform = `translate(${x}px, ${y}px)`;
  }

  joystickBase.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    dragging = true;
    pointerId = e.pointerId;
    joystickBase.setPointerCapture(pointerId);
    startLoop();
  });

  joystickBase.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    if (e.pointerId !== pointerId) return;

    const rect = joystickBase.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let localDx = e.clientX - centerX;
    let localDy = e.clientY - centerY;

    const dist = Math.hypot(localDx, localDy);
    if (dist > MAX_DIST) {
      const ratio = MAX_DIST / dist;
      localDx *= ratio;
      localDy *= ratio;
    }

    dx = localDx;
    dy = localDy;

    setStickVisual(dx, dy);
  });

  function resetJoystick() {
    dragging = false;
    pointerId = null;
    dx = 0;
    dy = 0;
    setStickVisual(0, 0);
    stopLoop();
  }

  joystickBase.addEventListener("pointerup", (e) => {
    if (e.pointerId !== pointerId) return;
    resetJoystick();
  });

  joystickBase.addEventListener("pointercancel", resetJoystick);
  joystickBase.addEventListener("pointerleave", () => {
    if (dragging) resetJoystick();
  });

  // Botão Ação = mesma lógica do "E"
  if (actionBtn) {
    actionBtn.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      if (isMenuOpen) return;

      const playerCircle = getPlayerCircle();

      // ✅ Sala Principal: menu personagem
      if (currentMapName === "salaPrincipal" && isCircleCollision(playerCircle, tableInteraction)) {
        openCharacterMenu();
        return;
      }

      // ✅ Sala de Jogos: abrir painel da mesa
      if (currentMapName === "salaJogos" && isCircleRectCollision(playerCircle, gameTableInteractionRect)) {
        openTablePanel();
        return;
      }

      // ✅ senão, tenta porta
      interactDoor();
    });
  }

})();

// ======================================================
// 26) EMOTES MOBILE
// ======================================================
const emoteButtons = document.querySelectorAll("#emoteBar .emoteBtn");
emoteButtons.forEach((btn) => {
  btn.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    if (isMenuOpen) return;

    const n = Number(btn.dataset.emote);
    playEmote(n);
  });
});

// ======================================================
// 27) TOGGLE EMOTES MOBILE
// ======================================================
const toggleEmotesBtn = document.getElementById("toggleEmotesBtn");
const emoteBar = document.getElementById("emoteBar");

if (toggleEmotesBtn && emoteBar) {
  toggleEmotesBtn.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    if (isMenuOpen) return;

    emoteBar.classList.toggle("open");
  });
}

// ======================================================
// (C) SISTEMA DA MESA RPG — SALA DE JOGOS
// ======================================================

// 2) Estado da mesa (local, depois a gente faz online)
const tableState = {
  locked: false,              // se true, ninguém levanta sem o mestre
  gmSeat: "GM",               // id do assento do mestre
  turnSeat: null,             // quem está com a vez (ex: "P3")
  seats: {                    // ocupação
    GM: null,
    P1: null, P2: null, P3: null, P4: null, P5: null, P6: null, P7: null
  }
};

// 3) Seu estado (quem você é na mesa)
const myTableState = {
  mySeat: null,               // ex: "P2" ou "GM"
};

// ✅ A mesa agora vem do servidor
let serverTableState = null;

// acha em qual assento EU estou, olhando o estado do servidor
function findMySeatFromState() {
  if (!serverTableState) return null;
  const myId = getPlayerId();
  for (const [seat, occ] of Object.entries(serverTableState.seats)) {
    if (occ === myId) return seat;
  }
  return null;
}

// 4) Elementos do painel
const tablePanel = document.getElementById("tablePanel");
const seatsGrid = document.getElementById("seatsGrid");
const closeTablePanel = document.getElementById("closeTablePanel");
const mySeatLabel = document.getElementById("mySeatLabel");
const gmLabel = document.getElementById("gmLabel");
const leaveSeatBtn = document.getElementById("leaveSeatBtn");
const rollD20Btn = document.getElementById("rollD20Btn");
const diceResultEl = document.getElementById("diceResult");

const gmArea = document.getElementById("gmArea");
const lockTableBtn = document.getElementById("lockTableBtn");
const unlockTableBtn = document.getElementById("unlockTableBtn");
const turnSelect = document.getElementById("turnSelect");
const grantTurnBtn = document.getElementById("grantTurnBtn");
const forceKickBtn = document.getElementById("forceKickBtn");

// ======================================================
// (C1) FUNÇÕES ÚTEIS
// ======================================================
function isNearGameTable() {
  if (currentMapName !== "salaJogos") return false;
  const circle = getPlayerCircle();
  return isCircleRectCollision(circle, gameTableInteractionRect);
}


function openTablePanel() {
  tablePanel.style.display = "block";
  isMenuOpen = true; // reaproveita a trava do movimento
  renderTableUI();
}

function closeTablePanelFn() {
  tablePanel.style.display = "none";
  isMenuOpen = false;
}

function isGM() {
  return myTableState.mySeat === "GM";
}

function getPlayerId() {
  return (window.socket && window.socket.id) ? window.socket.id : "no-socket";
}



// ======================================================
// (C2) RENDER DO PAINEL
// ======================================================
function renderTableUI() {
  if (!serverTableState) {
    // ainda não chegou do servidor
    mySeatLabel.textContent = myTableState.mySeat || "nenhum";
    gmLabel.textContent = "carregando...";
    seatsGrid.innerHTML = "";
    return;
  }

  const table = serverTableState;
  // labels
  mySeatLabel.textContent = myTableState.mySeat || "nenhum";
  const gmName = table.seats.GM || "ninguém";
  gmLabel.textContent = gmName;

  // mostra área do mestre só se você for o mestre
  gmArea.style.display = isGM() ? "block" : "none";

  // botão rolar dado só se for a sua vez
  const mySeat = myTableState.mySeat;
  const canRoll = mySeat && table.turnSeat === mySeat;
  rollD20Btn.disabled = !canRoll;

  // monta grid de assentos
  seatsGrid.innerHTML = "";

  const seatOrder = ["GM", "P1", "P2", "P3", "P4", "P5", "P6", "P7"];

  seatOrder.forEach(seatId => {
    const btn = document.createElement("button");
    btn.className = "seatBtn";

    const occupant = table.seats[seatId];
    const label = occupant ? `${seatId}\n(${occupant})` : `${seatId}\n(vazio)`;

    btn.textContent = label;

    if (occupant) btn.classList.add("occupied");
    if (myTableState.mySeat === seatId) btn.classList.add("me");
    if (seatId === "GM") btn.classList.add("gm");

    btn.addEventListener("click", () => handleSeatClick(seatId));
    seatsGrid.appendChild(btn);
  });

  // preenche select de turno (mestre escolhe quem joga)
  if (turnSelect) {
    turnSelect.innerHTML = "";
    ["P1", "P2", "P3", "P4", "P5", "P6", "P7"].forEach(p => {
      const opt = document.createElement("option");
      opt.value = p;
      opt.textContent = p;
      turnSelect.appendChild(opt);
    });
  }
}
// ======================================================
// (C) ESTADO: SENTADO / EM PÉ
// ======================================================
let isSeated = false;

// pega o sprite sentado do personagem atual
function getSitSprite() {
  const key = selectedCharacterKey; // personagem selecionado no menu
  const sit = characters[key]?.emotes?.sit;
  return sit || null; // se não tiver (manequim), retorna null
}

function sitOnSeat(seatId) {
  const pos = tableSeatsPositions[seatId];
  if (!pos) return;

  // trava movimento
  isSeated = true;

  // teleporta para o assento
  posX = pos.x;
  posY = pos.y;
  player.style.left = posX + "px";
  player.style.top = posY + "px";

  // troca sprite para sentado (se existir)
  const sitSprite = getSitSprite();
  if (sitSprite) {
    isEmoting = true;       // trava troca de direção
    avatar.src = sitSprite; // mostra sentado
  } else {
    // manequim sem sentado: só não troca sprite (por enquanto)
    isEmoting = false;
  }
}

function standUp() {
  isSeated = false;
  isEmoting = false;

  // 🔓 move o player para fora da colisão da mesa
  posX = tableExitPosition.x;
  posY = tableExitPosition.y;

  player.style.left = posX + "px";
  player.style.top = posY + "px";

  setAvatar("frente");
}



// ======================================================
// (C3) CLICOU EM UM ASSENTO
// ======================================================
function handleSeatClick(seatId) {
  if (!socket || !socket.connected) return;

  // se já está sentado e clicou em outro assento -> não deixa
  if (myTableState.mySeat && myTableState.mySeat !== seatId) {
    alert("Você já está sentado. Levante antes para trocar de lugar.");
    return;
  }

  // ✅ pede pro servidor sentar
  socket.emit("table:seat", { seatId, room: currentMapName });
}


// ======================================================
// (C4) LEVANTAR
// ======================================================
leaveSeatBtn.addEventListener("click", () => {
  if (!socket || !socket.connected) return;

  // ✅ pede pro servidor levantar
  socket.emit("table:leave", { room: currentMapName });

  // fecha painel
  closeTablePanelFn();
});



// ======================================================
// (C5) DADO D20 COM GIF (ROLAGEM BONITA)
// ======================================================
let diceRolling = false;

const diceOverlay = document.getElementById("diceOverlay");
const diceGif = document.getElementById("diceGif");
const diceFinal = document.getElementById("diceFinal");

function showDiceOverlay() {
  if (!diceOverlay) return;
  diceOverlay.classList.remove("diceHidden");
}

function hideDiceOverlay() {
  if (!diceOverlay) return;
  diceOverlay.classList.add("diceHidden");
}

function animateD20(finalValue) {
  if (!diceResultEl) return;

  diceRolling = true;
  if (rollD20Btn) rollD20Btn.disabled = true;

  // mostra overlay
  showDiceOverlay();

  // garante que o GIF "reinicie" (truque: troca src rapidinho)
  if (diceGif) {
    const src = diceGif.src;
    diceGif.src = "";
    diceGif.src = src;
  }

  // enquanto rola, deixa "-" no painel e no overlay
  diceResultEl.textContent = "-";
  if (diceFinal) diceFinal.textContent = "...";

  const durationMs = 1200;

  setTimeout(() => {
    // resultado final
    diceResultEl.textContent = finalValue;
    if (diceFinal) diceFinal.textContent = finalValue;

    diceRolling = false;

    // reabilita botão se ainda for sua vez
    const canRoll = myTableState.mySeat && tableState.turnSeat === myTableState.mySeat;
    if (rollD20Btn) rollD20Btn.disabled = !canRoll;

    // esconde overlay depois de mostrar o resultado um pouco
    setTimeout(() => {
      hideDiceOverlay();
    }, 700);
  }, durationMs);
}



// ======================================================
// (C6) FUNÇÕES DO MESTRE
// ======================================================
lockTableBtn.addEventListener("click", () => {
  if (!isGM()) return;
  table.locked = true;
  alert("Mesa travada! Players não podem levantar.");
  renderTableUI();
});

unlockTableBtn.addEventListener("click", () => {
  if (!isGM()) return;
  table.locked = false;
  alert("Mesa destravada! Players podem levantar.");
  renderTableUI();
});

grantTurnBtn.addEventListener("click", () => {
  if (!isGM()) return;

  const seat = turnSelect.value;

  // só libera se tiver alguém sentado naquele lugar
  if (!tableState.seats[seat]) {
    alert("Esse assento está vazio.");
    return;
  }

  tableState.turnSeat = seat;
  diceResultEl.textContent = "-";
  alert(`Vez liberada para ${seat}!`);
  renderTableUI();
});

forceKickBtn.addEventListener("click", () => {
  if (!isGM()) return;

  const seat = turnSelect.value;
  if (!tableState.seats[seat]) {
    alert("Esse assento já está vazio.");
    return;
  }

  // remove o player daquele assento
  tableState.seats[seat] = null;

  // se era a vez dele, tira a vez
  if (tableState.turnSeat === seat) {
    tableState.turnSeat = null;
  }

  alert(`${seat} foi removido do assento.`);
  renderTableUI();
});

// ======================================================
// (C7) ABRIR/FECHAR PAINEL
// ======================================================
closeTablePanel.addEventListener("click", closeTablePanelFn);

// ======================================================
// (D) CHAT ONLINE (Socket.IO) — TEXTO
// ======================================================
const SERVER_URL = "https://broken-mirror-server.onrender.com";

// elementos do chat
const chatDock = document.getElementById("chatDock");
const chatToggleBtn = document.getElementById("chatToggleBtn");
const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");

// conecta no servidor
window.socket = io(SERVER_URL, { transports: ["websocket"] });
const socket = window.socket;


// // abre/fecha dock
if (chatToggleBtn) {
  chatToggleBtn.addEventListener("click", () => {
    const closed = chatDock.classList.toggle("closed");
    chatToggleBtn.textContent = closed ? "Abrir" : "Fechar";

    if (!closed) {
      // ✅ abriu o chat -> trava movimento
      isMenuOpen = true;
      setTimeout(() => chatInput?.focus(), 50);
    } else {
      // ✅ fechou o chat -> libera movimento
      isMenuOpen = false;
      chatInput?.blur();
    }
  });
}


// render mensagem
function addChatMessage({ name, msg, ts }) {
  if (!chatMessages) return;

  const el = document.createElement("div");
  el.className = "chatMsg";

  const time = ts ? new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
  el.innerHTML = `
    <div class="meta">${name || "player"} • ${time}</div>
    <div class="text"></div>
  `;

  // evita injetar HTML
  el.querySelector(".text").textContent = msg || "";

  chatMessages.appendChild(el);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// envia mensagem
if (chatForm) {
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!chatInput) return;

    const text = chatInput.value.trim();
    if (!text) return;

    socket.emit("chat:send", { msg: text });
    chatInput.value = "";
  });
}

// quando conectar, manda seu nome e entra na sala atual
socket.on("connect", () => {
  const myName = nameLabel ? nameLabel.textContent : "player";
  socket.emit("player:setName", myName);

  // entra na sala atual (salaPrincipal ou salaJogos)
  socket.emit("room:join", currentMapName);
});
socket.on("players:list", (list) => {
  // ✅ remove todos os outros players antigos da tela
  Object.keys(otherPlayers).forEach(id => removeOtherPlayer(id));

  // lista inicial da sala
  list.forEach(p => {
    if (p.id === socket.id) return;
    updateOtherPlayer(p);
  });
});

socket.on("player:joined", (p) => {
  if (p.id === socket.id) return;
  updateOtherPlayer(p);
});

socket.on("player:moved", (p) => {
  if (p.id === socket.id) return;
  updateOtherPlayer(p);
});

socket.on("player:update", (p) => {
  if (p.id === socket.id) return;
  updateOtherPlayer(p);
});

socket.on("player:left", (id) => {
  removeOtherPlayer(id);
});


// recebe mensagens
socket.on("chat:msg", (payload) => {
  addChatMessage(payload);
});

// ======================================================
// MESA ONLINE (recebe do servidor)
// ======================================================
socket.on("table:state", (state) => {
  serverTableState = state;
  myTableState.mySeat = findMySeatFromState();
  renderTableUI();
});

// servidor confirmou que VOCÊ sentou
socket.on("table:youSat", ({ seatId }) => {
  sitOnSeat(seatId);

  // opcional: avisar que está sentado pros outros (se seu server suportar)
  socket.emit("player:state", {
    x: posX,
    y: posY,
    dir: currentDirection,
    characterKey: selectedCharacterKey,
    seated: true,
    seatId
  });
});

// servidor confirmou que VOCÊ levantou
socket.on("table:youStood", () => {
  standUp();

  socket.emit("player:state", {
    x: posX,
    y: posY,
    dir: currentDirection,
    characterKey: selectedCharacterKey,
    seated: false,
    seatId: null
  });
});


// quando você muda seu nome no menu, atualiza no servidor também
function syncNameToServer() {
  const myName = nameLabel ? nameLabel.textContent : "player";
  socket.emit("player:setName", myName);
}

// ======================================================
// (D1) ATALHOS DO CHAT (PC): Enter abre, Esc fecha
// ======================================================
document.addEventListener("keydown", (e) => {
  const isClosed = chatDock?.classList.contains("closed");
  const focusIsInput = document.activeElement === chatInput;

  // ✅ ENTER abre o chat (quando fechado)
  if (e.key === "Enter" && isClosed && !focusIsInput) {
    e.preventDefault();
    chatDock.classList.remove("closed");
    chatToggleBtn.textContent = "Fechar";
    isMenuOpen = true; // ✅ trava movimento
    setTimeout(() => chatInput?.focus(), 50);
    return;
  }

  // ✅ ESC fecha o chat (quando aberto)
  if (e.key === "Escape" && !isClosed) {
    e.preventDefault();
    chatDock.classList.add("closed");
    chatToggleBtn.textContent = "Abrir";
    isMenuOpen = false; // ✅ libera movimento
    chatInput?.blur();
    return;
  }

  // ✅ se o chat estiver aberto, não deixa o resto do jogo pegar teclas
  if (!isClosed) return;

  // ✅ se outro menu estiver aberto, mantém a regra antiga
  if (isMenuOpen) return;
});

function createOtherPlayer(p) {
  if (otherPlayers[p.id]) return;

  const el = document.createElement("div");
  el.className = "otherPlayer";
  el.style.position = "absolute";
  el.style.width = "96px";
  el.style.height = "96px";
  el.style.left = (p.x || 0) + "px";
  el.style.top = (p.y || 0) + "px";
  el.style.pointerEvents = "none";

  const name = document.createElement("div");
  name.className = "name";
  name.textContent = p.name || "player";

  const img = document.createElement("img");
  img.className = "avatar";

  // aplica a classe do personagem pro neon funcionar
  img.classList.add(p.characterKey || "manequim");

  img.draggable = false;

  // sprite inicial
  const ch = characters[p.characterKey] || characters.manequim;
  img.src = ch[p.dir] || ch.frente;

  el.appendChild(name);
  el.appendChild(img);
  world.appendChild(el);

  otherPlayers[p.id] = { el, img, name };
}

function updateOtherPlayer(p) {
  if (!p || !p.id) return;
  if (!otherPlayers[p.id]) createOtherPlayer(p);

  const obj = otherPlayers[p.id];
  obj.img.classList.remove("manequim", "chindu", "milo", "bigJonh", "void", "mimi", "skatt", "vodoll");
  obj.img.classList.add(p.characterKey || "manequim");
  obj.el.style.left = (p.x || 0) + "px";
  obj.el.style.top = (p.y || 0) + "px";
  obj.name.textContent = p.name || "player";

  const ch = characters[p.characterKey] || characters.manequim;
  obj.img.src = ch[p.dir] || ch.frente;
}

function removeOtherPlayer(id) {
  const obj = otherPlayers[id];
  if (!obj) return;
  obj.el.remove();
  delete otherPlayers[id];
}


