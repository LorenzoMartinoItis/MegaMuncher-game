let gridSize = 20; // Dimensione della griglia
let playerSize = 1; // Dimensione iniziale del giocatore
let playerPos;
let buildings = []; // Lista degli edifici bianchi (mangiabili)
let obstacles = []; // Lista degli edifici rossi (non mangiabili)
let score = 0; // Punteggio
let time = 60; // Tempo
let gameOver = false; // Variabile per tenere traccia se il gioco è terminato
let gameEnded = false; // Variabile per tenere traccia se il gioco è finito
let contMangiati = 0; // Contatore degli edifici bianchi mangiati
let livello = null; // Livello selezionato
let homeScreen=true; // Variabile per tenere traccia se il gioco è nella home
let pausa = false; // Variabile per tenere traccia del menu di pausa
let bgColor; // Variabile che tiene conto del colore sfondo differenziato per ogni livello

/*
FUNZIONE floor()  --> arrotonda al numero intero più vicino

FUNZIONE rect()   --> x,y,width,height

FUNZIONE ellipse()--> x,y,width,height 

  playerPos.x * gridSize + gridSize / 2 calcola la coordinata x del centro dell'ellisse.
  playerPos.y * gridSize + gridSize / 2 calcola la coordinata y del centro dell'ellisse.
  gridSize * playerSize rappresenta sia la larghezza che l'altezza dell'ellisse.

*/

// Setup
function setup() {

  createCanvas(windowWidth, windowHeight);
  frameRate(60); // Frame al secondo
  textSize(20); // Dimensione del testo
  showLevelSelection(); // Funzione per mostrare la selezione del livello

}

// Funzione in loop
function draw() {

  if(!pausa){ // controllo la pausa

    if (homeScreen) { // if che controlla se deve visualizzare la schermata home

      background(220); // Sfondo nero
      textSize(50); // Dimensione del testo
      fill(0); // Testo bianco
      textAlign(CENTER, CENTER); // Posizione del testo (TITOLO VIDEOGAME)
      text("MEGAMUNCHER", width / 2, height / 2 - 50); // Scrivo il titolo del gioco
      textSize(30); // Dimensione del testo
      text("Press to enter", width / 2, height / 2 + 50); // Scrivo l'istruzione per iniziare

    } else {

      if (livello !== null) { // if che controlla se il livello è stato scelto

        if (livello === "Difficile") {

          bgColor = color(0); // Background nero per il livello "Difficile"

        } else if (livello === "Medio") {

          bgColor = color(100, 150, 255); // Background blu per il livello "Medio"

        } else {

          bgColor = color(220); // Background predefinito per gli altri livelli

        }

        background(bgColor); // Setto il background a seconda del livello

        if (!gameOver) { // if che controlla che il gioco non sia terminato

          if (livello === "Difficile") {

            fill(255); // Cambia il colore del cerchio del giocatore a bianco per il livello "difficile"

          } else if(livello === "Medio"){

            fill(0, 0, 0); // Cambia il colore del cerchio del giocatore a rosso per il livello "medio"

          }
          else{
            fill(0,51,153)// Cambia il colore del cerchio del giocatore a blu per il livello "facile"
          }

          ellipse(playerPos.x * gridSize + gridSize / 2, playerPos.y * gridSize + gridSize / 2, gridSize * playerSize, gridSize * playerSize); // Disegna il cerchio del giocatore

          // Disegna edifici e ostacoli
          for (let edificio of buildings) {

            if (edificio.color === "white") {

              fill(255);

            } else {

              fill(255, 0, 0);

            }

            rect(edificio.x * gridSize, edificio.y * gridSize, gridSize, gridSize); // Disegna l'edificio
          }

          fill(255, 0, 0); // Cambia il colore degli ostacoli a rosso

          for (let edificio of obstacles) {

            rect(edificio.x * gridSize, edificio.y * gridSize, gridSize, gridSize);

          }

          if (frameCount % 60 == 0 && time > 0) { // diminuire il tempo
            time--;
          }

          // Disegna l'area dedicata al punteggio e al tempo
          stroke(bgColor) // Usa lo stesso colore dello sfondo per i contorni
          fill(bgColor); // Usa lo stesso colore dello sfondo per il rettangolo
          rect(10, 10, 200, 100); // Rettangolo attorno allo score e al tempo
          stroke(0,0,0) // Setta nuovamente il colore dei contorni
          fill(255);
          text("Score: " + score, 60, 50);
          text("Time: " + time, 60, 80);

          if (time == 0) { // if che controlla che il tempo non sia terminato
            gameOver = true;
          }

          if (!gameOver) { // if che controlla che il gioco non sia terminato

            checkCollisions(); // funzione che controlla la collisione tra personaggio e edificio

            moveObstacles(); // Muovi gli ostacoli (rossi) ogni n secondi in base al livello

          }
        }

        if (gameOver) { // if che controlla che il gioco sia terminato
          // Settaggi per la scritta "game over"
          textSize(40);
          fill(255, 0, 0);
          rect(width / 3, height / 3, width / 3, height / 3);
          fill(255);
          text("Game Over", width / 2, height / 2); // Scrivo la scritta di fine gioco esattamente al centro dello schermo
          noLoop(); // Evita di continuare a far funzionare il gioco in sottofondo

        }

      } else { // Condizione alternativa se non è ancora stato selezionato il livello

        showLevelSelection(); // Funzione per mostrare la selezione del livello

      }
    }
  }else{

    showPauseMenu();

  }
}

function showPauseMenu() {
  background(0, 0, 0, 200); // Sfondo semi-trasparente
  fill(255); // Testo bianco
  textSize(50); // Dimensione del testo
  text("PAUSA", width / 2, height / 2 - 100); // Scrivo la scritta "PAUSA"
  textSize(30); // Dimensione del testo

  // Pulsanti per "Esci" e "Ricomincia"
  fill(100, 200, 255); // Esci
  rect(width / 2 - 100, height / 2, 200, 50);
  fill(255);
  text("Esci", width / 2, height / 2 + 25);

  fill(200, 200, 100); // Ricomincia
  rect(width / 2 - 100, height / 2 + 60, 200, 50);
  fill(255);
  text("Ricomincia", width / 2, height / 2 + 85);
}

function keyPressed() {
  if (keyCode === ESCAPE) {
    pausa = !pausa;
  }
}

// Funzione che mostra la scelta tra livelli
function showLevelSelection() {

  background(220);
  fill(0);
  textAlign(CENTER, CENTER);
  text("Seleziona il livello:", width / 2, height / 4);

  // Pulsanti per selezionare i livelli
  fill(100, 200, 255); // Facile
  rect(width / 4 - 100, height / 2, 200, 50);
  fill(255);
  text("Facile", width / 4, height / 2 + 25);

  fill(200, 200, 100); // Medio
  rect(width / 2 - 100, height / 2, 200, 50);
  fill(255);
  text("Medio", width / 2, height / 2 + 25);

  fill(255, 100, 100); // Difficile
  rect(3 * width / 4 - 100, height / 2, 200, 50);
  fill(255);
  text("Difficile", 3 * width / 4, height / 2 + 25);

}

function mouseClicked() {

  if (livello === null) { // if che controlla che il livello non sia gia stato scelto

    if (mouseY > height / 2 && mouseY < height / 2 + 50) {

      if (mouseX > width / 4 - 100 && mouseX < width / 4 + 100) {

        livello = "Facile";

      } else if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100) {

        livello = "Medio";

      } else if (mouseX > 3 * width / 4 - 100 && mouseX < 3 * width / 4 + 100) {

        livello = "Difficile";

      }

      if (livello !== null) {

        initializeGame(livello);

      }

    }
  }
}

// Funzione che genera i livelli
function initializeGame(level) {
  score = 0;
  if (level === "Facile") {

    gridSize = 20;
    spawnBuildingsandObstacles(5,7);
    time = 90;

  } else if (level === "Medio") {

    gridSize = 15;
    spawnBuildingsandObstacles(7,10);
    time = 60;

  } else if (level === "Difficile") {

    gridSize = 10;
    spawnBuildingsandObstacles(10,12);
    time = 45;

  }

  playerPos = createVector(floor(random(width / gridSize)), floor(random(height / gridSize)));
}

// Funzione che muove il personaggio seguendo il mouse
function mouseMoved() {

  if (!pausa && livello !== null) { // if che controlla che il livello sia gia stato scelto 

    let x = floor(mouseX / gridSize);
    let y = floor(mouseY / gridSize);
    playerPos.set(x, y);

  }

}


// Funzione che spawna gli edifici
function spawnBuildingsandObstacles(numBuildings, numObstacles) {

  for (let i = 0; i < numBuildings; i++) {

    let building = createVector(floor(random(width / gridSize)), floor(random(height / gridSize)));
    building.color = "white";
    buildings.push(building); // Aggiunge l'edifico appena generato all'array di edifici

  }

  for (let i = 0; i < numObstacles; i++) {

    let obstacle = createVector(floor(random(width / gridSize)), floor(random(height / gridSize)));
    obstacles.push(obstacle); // Aggiunge l'ostacolo generato all'array di ostacoli

  }

}

// Funzione che muove gli ostacoli
function moveObstacles() {
  if(!pausa){
    let obstacleSpeed; // Velocità di movimento degli ostacoli
    
    // Imposta la velocità di movimento degli ostacoli in base al livello di difficoltà
    if (livello === "Facile") {

      obstacleSpeed = 60; // Movimento ogni 1 secondo

    } else if (livello === "Medio") {

      obstacleSpeed = 30; // Movimento ogni 0.5 secondi
      
    } else if (livello === "Difficile") {

      obstacleSpeed = 15; // Movimento ogni 0.25 secondi

    }
    
    for (let obstacle of obstacles) {

      // Movimento orizzontale degli ostacoli
      if (frameCount % obstacleSpeed === 0) {

        obstacle.x = (obstacle.x + random(10)) % (width / gridSize);

      }
    }
  }
}

// Funzione che controlla la collisione tra personaggio e edificio
function checkCollisions() {

  for (let i = buildings.length - 1; i >= 0; i--) {

    let building = buildings[i];
    let playerCenterX = playerPos.x * gridSize + gridSize / 2;
    let playerCenterY = playerPos.y * gridSize + gridSize / 2;
    let buildingCenterX = building.x * gridSize + gridSize / 2;
    let buildingCenterY = building.y * gridSize + gridSize / 2;
    let distance = dist(playerCenterX, playerCenterY, buildingCenterX, buildingCenterY);

    if (distance < gridSize * playerSize / 2) {

      if (building.color === "white") {

        contMangiati++;
      }

      if (building.color === "white" || playerSize >= 3) {

        playerSize += 0.1; // Aumenta la dimensione del personaggio
        score++; // Aumenta lo score
        buildings.splice(i, 1); // Rimuove l'edificio dalla lista dei buildings
        spawnBuildingsandObstacles(1,0); // Crea un nuovo edificio

      }
    }
  }
  
  for (let obstacle of obstacles) { // Controlla la collisione tra personaggio e ostacolo
    if (playerPos.x === obstacle.x && playerPos.y === obstacle.y) {
      gameOver = true;
    }
  }
}

// Funzione che controlla la pressione del mouse nella schermata home
function mousePressed() {
  if (pausa) {
    // Controllo per il pulsante "Esci"
    if (mouseY > height / 2 && mouseY < height / 2 + 50) {
      if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100) {
        // Esce dal gioco
        livello = null;
        homeScreen = true;
        pausa = false;
      }
    }
    // Controllo per il pulsante "Ricomincia"
    else if (mouseY > height / 2 + 60 && mouseY < height / 2 + 110) {
      if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100) {
        // Ricomincia il gioco
        pausa = false;
        playerSize=1;
        for(let i = 0; i < buildings.length; i++) {
          buildings.length = 0;
        }
        initializeGame(livello);
      }
    }
  } else if (homeScreen) {
    homeScreen = false;
  }
}