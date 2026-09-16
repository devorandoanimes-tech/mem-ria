const socket = io();

let roomCode = null;
let selectedMode = "easy";
let localPlayerId = null;
let currentRoom = null;
let profileId = null;
let quizOpen = false;

const screens = [
    "menu",
    "create",
    "join",
    "waiting",
    "game",
    "result"
];

function getProfileId() {
    let id = localStorage.getItem("memoriaCosmicaProfileId");

    if (!id) {
        id =
            "player-" +
            crypto.randomUUID();

        localStorage.setItem(
            "memoriaCosmicaProfileId",
            id
        );
    }

    return id;
}

profileId = getProfileId();

function showScreen(id) {
    screens.forEach(screen => {
        document
            .getElementById(screen)
            .classList.add("hidden");
    });

    document
        .getElementById(id)
        .classList.remove("hidden");
}

function showCreate() {
    showScreen("create");
}

function showJoin() {
    showScreen("join");
}

function backToMenu() {
    showScreen("menu");
}

function selectMode(mode) {
    selectedMode = mode;

    document
        .getElementById("easyMode")
        .classList.remove("selected");

    document
        .getElementById("impossibleMode")
        .classList.remove("selected");

    if (mode === "easy") {
        document
            .getElementById("easyMode")
            .classList.add("selected");
    } else {
        document
            .getElementById("impossibleMode")
            .classList.add("selected");
    }
}

function createRoom() {
    const name =
        document
            .getElementById("createName")
            .value
            .trim();

    if (!name) {
        showMessage("Digite seu nome.");
        return;
    }

    socket.emit(
        "createRoom",
        {
            name,
            mode: selectedMode,
            profileId
        }
    );
}

function joinRoom() {
    const name =
        document
            .getElementById("joinName")
            .value
            .trim();

    const code =
        document
            .getElementById("roomCode")
            .value
            .trim()
            .toUpperCase();

    if (!name) {
        showMessage("Digite seu nome.");
        return;
    }

    if (code.length !== 5) {
        showMessage("Digite um código válido.");
        return;
    }

    socket.emit(
        "joinRoom",
        {
            code,
            name,
            profileId
        }
    );
}

socket.on(
    "roomCreated",
    data => {
        roomCode = data.code;
        localPlayerId = data.playerId;

        document
            .getElementById("displayCode")
            .textContent = roomCode;

        showScreen("waiting");
    }
);

socket.on(
    "roomUpdate",
    room => {
        currentRoom = room;
        roomCode = room.code;

        if (!room.gameStarted) {
            document
                .getElementById("displayCode")
                .textContent = room.code;

            updateWaitingRoom(room);

            if (room.gameFinished) {
                showResult(room);
            } else {
                showScreen("waiting");
            }

            return;
        }

        updateGame(room);

        if (room.gameFinished) {
            showResult(room);
        } else {
            showScreen("game");
        }
    }
);

function updateWaitingRoom(room) {
    const playersElement =
        document.getElementById("players");

    playersElement.innerHTML = "";

    room.players.forEach(
        (player, index) => {
            const div =
                document.createElement("div");

            div.textContent =
                `${index + 1}. ${player.name} ${
                    player.ready
                        ? "✅"
                        : "⏳"
                }`;

            playersElement.appendChild(div);
        }
    );

    const readyButton =
        document.getElementById("readyButton");

    if (room.players.length < 2) {
        document
            .getElementById("waitingMessage")
            .textContent =
            "Aguardando o segundo jogador...";

        readyButton.disabled = true;
    } else {
        const local =
            room.players.find(
                player =>
                    player.id === socket.id
            );

        document
            .getElementById("waitingMessage")
            .textContent =
            "Os dois jogadores precisam clicar em COMEÇAR.";

        readyButton.disabled = false;

        readyButton.textContent =
            local && local.ready
                ? "CANCELAR"
                : "COMEÇAR";
    }
}

function toggleReady() {
    socket.emit("setReady");
}

function updateGame(room) {
    const localIndex =
        room.players.findIndex(
            player =>
                player.id === socket.id
        );

    const opponentIndex =
        localIndex === 0 ? 1 : 0;

    const local =
        room.players[localIndex];

    const opponent =
        room.players[opponentIndex];

    if (local) {
        document
            .getElementById("localName")
            .textContent =
            local.name;

        document
            .getElementById("localScore")
            .textContent =
            local.score;
    }

    if (opponent) {
        document
            .getElementById("opponentName")
            .textContent =
            opponent.name;

        document
            .getElementById("opponentScore")
            .textContent =
            opponent.score;
    }

    const total =
        room.cards.length;

    const remaining =
        room.cards.filter(
            card =>
                !card.matched
        ).length;

    document
        .getElementById("cardCounter")
        .textContent =
        `CARTAS NA MESA: ${remaining}/${total}`;

    if (room.pendingQuiz) {
        document
            .getElementById("turnText")
            .textContent =
            "🧠 RESPONDA O QUIZ";
    } else if (room.turn === localIndex) {
        document
            .getElementById("turnText")
            .textContent =
            "🎯 SUA VEZ";
    } else {
        document
            .getElementById("turnText")
            .textContent =
            "⏳ VEZ DO OUTRO JOGADOR";
    }

    renderBoard(room);
}

function renderBoard(room) {
    const board =
        document.getElementById("board");

    board.innerHTML = "";

    room.cards.forEach(card => {
        const cardElement =
            document.createElement("div");

        cardElement.className = "card";

        if (card.revealed) {
            cardElement.classList.add("revealed");
        }

        if (card.matched) {
            cardElement.classList.add("matched");
        }

        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-back">
                    🌌
                </div>

                <div class="card-front">
                    ${escapeHtml(card.theme)}
                </div>
            </div>
        `;

        cardElement.onclick = () => {
            const localIndex =
                room.players.findIndex(
                    player =>
                        player.id === socket.id
                );

            if (room.pendingQuiz) {
                showMessage(
                    "Responda o quiz primeiro."
                );
                return;
            }

            if (
                room.turn !== localIndex
            ) {
                showMessage(
                    "Não é seu turno."
                );
                return;
            }

            if (
                card.revealed ||
                card.matched
            ) {
                return;
            }

            socket.emit(
                "selectCard",
                card.id
            );
        };

        board.appendChild(cardElement);
    });
}

socket.on(
    "quiz",
    data => {
        quizOpen = true;

        document
            .getElementById("quizTheme")
            .textContent =
            `🧠 ${data.theme}`;

        document
            .getElementById("quizQuestion")
            .textContent =
            data.quiz.question;

        const options =
            document.getElementById(
                "quizOptions"
            );

        options.innerHTML = "";

        let status =
            document.getElementById(
                "quizStatus"
            );

        if (!status) {
            status =
                document.createElement("p");

            status.id = "quizStatus";
            status.style.marginTop = "12px";

            options.parentElement.appendChild(
                status
            );
        }

        status.textContent =
            `Dificuldade: ${data.quiz.difficulty || "?"}/5 — os dois jogadores podem responder.`;

        data.quiz.options.forEach(
            (option, index) => {
                const button =
                    document.createElement("button");

                button.className =
                    "quiz-option";

                button.textContent =
                    `${String.fromCharCode(
                        65 + index
                    )}) ${option}`;

                button.onclick = () => {
                    if (button.disabled) {
                        return;
                    }

                    Array.from(
                        options.querySelectorAll("button")
                    ).forEach(
                        btn => {
                            btn.disabled = true;
                        }
                    );

                    socket.emit(
                        "answerQuiz",
                        {
                            answer: index
                        }
                    );

                    status.textContent =
                        "Resposta enviada. Aguardando resultado...";
                };

                options.appendChild(button);
            }
        );

        document
            .getElementById("quiz")
            .classList.remove("hidden");
    }
);

socket.on(
    "quizAnswer",
    data => {
        if (data.correct) {
            showMessage(
                `✅ ${data.playerName} acertou o quiz!`
            );
        } else {
            showMessage(
                `❌ ${data.playerName} errou. O outro jogador ainda pode responder.`
            );
        }
    }
);

socket.on(
    "quizResult",
    data => {
        quizOpen = false;

        document
            .getElementById("quiz")
            .classList.add("hidden");

        if (data.correct) {
            showMessage(
                `🏆 ${data.playerName} conquistou ${data.cardsWon} cartas!`
            );
        } else if (data.allPlayersWrong) {
            showMessage(
                "❌ Os dois erraram. O par voltou para a mesa."
            );
        }
    }
);

socket.on(
    "pairMiss",
    () => {
        showMessage(
            "❌ Não formou um par."
        );
    }
);

socket.on(
    "gameFinished",
    () => {
        if (currentRoom) {
            showResult(currentRoom);
        }
    }
);

function showResult(room) {
    const players =
        [...room.players];

    const scores =
        players.map(
            player => player.score
        );

    const isTie =
        scores.length === 2 &&
        scores[0] === scores[1];

    const winnerText =
        document.getElementById(
            "winnerText"
        );

    if (isTie) {
        winnerText.textContent =
            "🤝 EMPATE!";
    } else {
        const winner =
            [...players].sort(
                (a, b) =>
                    b.score - a.score
            )[0];

        winnerText.textContent =
            `🏆 Vencedor: ${winner.name}`;
    }

    const scoresElement =
        document.getElementById(
            "finalScores"
        );

    const sorted =
        [...players].sort(
            (a, b) =>
                b.score - a.score
        );

    scoresElement.innerHTML =
        sorted
            .map(
                (player, index) => {
                    let position;

                    if (isTie) {
                        position = "🤝";
                    } else if (index === 0) {
                        position = "🥇";
                    } else {
                        position = "🥈";
                    }

                    return `
                        <p>
                            ${position}
                            ${escapeHtml(player.name)}:
                            ${player.score} cartas
                        </p>
                    `;
                }
            )
            .join("");

    showScreen("result");
}

function requestRematch() {
    showMessage(
        "Revanche solicitada. Aguarde o outro jogador."
    );

    socket.emit("rematch");
}

function leaveRoom() {
    socket.emit("leaveRoom");

    showScreen("menu");

    roomCode = null;
    currentRoom = null;
    quizOpen = false;
}

socket.on(
    "roomClosed",
    () => {
        document
            .getElementById("quiz")
            .classList.add("hidden");

        showMessage(
            "A sala foi encerrada."
        );

        setTimeout(
            () => showScreen("menu"),
            1500
        );
    }
);

socket.on(
    "playerDisconnected",
    () => {
        document
            .getElementById("quiz")
            .classList.add("hidden");

        showMessage(
            "O outro jogador saiu da partida."
        );

        setTimeout(
            () => showScreen("menu"),
            2000
        );
    }
);

socket.on(
    "errorMessage",
    message => {
        showMessage(message);
    }
);

function showMessage(text) {
    const message =
        document.getElementById(
            "message"
        );

    message.textContent = text;

    message.classList.remove(
        "hidden"
    );

    setTimeout(
        () => {
            message.classList.add(
                "hidden"
            );
        },
        2500
    );
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
