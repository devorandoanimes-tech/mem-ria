const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

/*
=========================================================
CONFIGURAÇÃO GROQ
=========================================================
*/

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

const GROQ_MODEL =
    process.env.GROQ_MODEL ||
    "openai/gpt-oss-20b";


/*
=========================================================
ARQUIVOS PÚBLICOS
=========================================================
*/

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


/*
=========================================================
SALAS E PERFIS
=========================================================
*/

const rooms = new Map();

const playerProfiles = new Map();


/*
=========================================================
TEMAS DE ASTRONOMIA
=========================================================
*/

const THEMES = [
    {
        theme: "☀️ Sol",
        icon: "☀️"
    },
    {
        theme: "🌙 Lua",
        icon: "🌙"
    },
    {
        theme: "🌍 Terra",
        icon: "🌍"
    },
    {
        theme: "🔴 Marte",
        icon: "🔴"
    },
    {
        theme: "🪐 Júpiter",
        icon: "🪐"
    },
    {
        theme: "💍 Saturno",
        icon: "💍"
    },
    {
        theme: "🔵 Urano",
        icon: "🔵"
    },
    {
        theme: "🌊 Netuno",
        icon: "🌊"
    },
    {
        theme: "⭐ Estrela",
        icon: "⭐"
    },
    {
        theme: "🌌 Galáxia",
        icon: "🌌"
    },
    {
        theme: "☄️ Cometa",
        icon: "☄️"
    },
    {
        theme: "🛰️ Satélite",
        icon: "🛰️"
    },
    {
        theme: "🚀 Foguete",
        icon: "🚀"
    },
    {
        theme: "👨‍🚀 Astronauta",
        icon: "👨‍🚀"
    },
    {
        theme: "🌑 Eclipse",
        icon: "🌑"
    },
    {
        theme: "🌠 Chuva de meteoros",
        icon: "🌠"
    },
    {
        theme: "🌈 Nebulosa",
        icon: "🌈"
    },
    {
        theme: "🕳️ Buraco negro",
        icon: "🕳️"
    },
    {
        theme: "🔭 Telescópio",
        icon: "🔭"
    },
    {
        theme: "🌟 Supernova",
        icon: "🌟"
    },
    {
        theme: "🧲 Magnetosfera",
        icon: "🧲"
    },
    {
        theme: "💫 Pulsar",
        icon: "💫"
    },
    {
        theme: "🌀 Quasar",
        icon: "🌀"
    },
    {
        theme: "🪨 Asteroide",
        icon: "🪨"
    },
    {
        theme: "🌕 Cratera",
        icon: "🌕"
    },
    {
        theme: "🌗 Fases da Lua",
        icon: "🌗"
    },
    {
        theme: "💫 Anéis planetários",
        icon: "💫"
    },
    {
        theme: "🌡️ Temperatura espacial",
        icon: "🌡️"
    },
    {
        theme: "☁️ Nuvem molecular",
        icon: "☁️"
    },
    {
        theme: "⚛️ Átomo",
        icon: "⚛️"
    },
    {
        theme: "💡 Ano-luz",
        icon: "💡"
    },
    {
        theme: "🕰️ Tempo cósmico",
        icon: "🕰️"
    },
    {
        theme: "📡 Radioastronomia",
        icon: "📡"
    },
    {
        theme: "🌞 Vento solar",
        icon: "🌞"
    },
    {
        theme: "🧭 Campo magnético",
        icon: "🧭"
    },
    {
        theme: "🔬 Espectroscopia",
        icon: "🔬"
    },
    {
        theme: "📐 Órbita",
        icon: "📐"
    },
    {
        theme: "🛰️ GPS",
        icon: "🛰️"
    },
    {
        theme: "🌎 Exoplaneta",
        icon: "🌎"
    },
    {
        theme: "🔋 Energia estelar",
        icon: "🔋"
    },
    {
        theme: "🌌 Via Láctea",
        icon: "🌌"
    }
];


/*
=========================================================
PERGUNTAS PRÉ-DEFINIDAS
=========================================================
*/

const LOCAL_QUESTIONS = [

    {
        tema: "☀️ Sol",
        pergunta: "Qual é a estrela localizada no centro do Sistema Solar?",
        opcoes: [
            "Sol",
            "Sirius",
            "Betelgeuse",
            "Vega"
        ],
        resposta: 0,
        dificuldade: 1,
        peso: 5
    },

    {
        tema: "🌙 Lua",
        pergunta: "Qual é o satélite natural da Terra?",
        opcoes: [
            "Lua",
            "Marte",
            "Europa",
            "Titã"
        ],
        resposta: 0,
        dificuldade: 1,
        peso: 5
    },

    {
        tema: "🌍 Terra",
        pergunta: "Qual planeta é conhecido por possuir grandes quantidades de água líquida em sua superfície?",
        opcoes: [
            "Terra",
            "Mercúrio",
            "Urano",
            "Júpiter"
        ],
        resposta: 0,
        dificuldade: 1,
        peso: 5
    },

    {
        tema: "🔴 Marte",
        pergunta: "Qual planeta é conhecido como Planeta Vermelho?",
        opcoes: [
            "Vênus",
            "Marte",
            "Netuno",
            "Saturno"
        ],
        resposta: 1,
        dificuldade: 1,
        peso: 5
    },

    {
        tema: "🪐 Júpiter",
        pergunta: "Qual é o maior planeta do Sistema Solar?",
        opcoes: [
            "Terra",
            "Saturno",
            "Júpiter",
            "Netuno"
        ],
        resposta: 2,
        dificuldade: 1,
        peso: 5
    },

    {
        tema: "💍 Saturno",
        pergunta: "Qual planeta é famoso por possuir um sistema de anéis muito visível?",
        opcoes: [
            "Marte",
            "Saturno",
            "Mercúrio",
            "Terra"
        ],
        resposta: 1,
        dificuldade: 1,
        peso: 5
    },

    {
        tema: "🔵 Urano",
        pergunta: "Qual planeta possui um eixo de rotação extremamente inclinado, parecendo girar de lado?",
        opcoes: [
            "Urano",
            "Marte",
            "Júpiter",
            "Mercúrio"
        ],
        resposta: 0,
        dificuldade: 3,
        peso: 4
    },

    {
        tema: "🌊 Netuno",
        pergunta: "Qual é o planeta mais distante do Sol entre os oito planetas do Sistema Solar?",
        opcoes: [
            "Saturno",
            "Urano",
            "Netuno",
            "Marte"
        ],
        resposta: 2,
        dificuldade: 2,
        peso: 4
    },

    {
        tema: "⭐ Estrela",
        pergunta: "O que diferencia uma estrela de um planeta?",
        opcoes: [
            "Uma estrela produz sua própria luz",
            "Uma estrela sempre possui anéis",
            "Uma estrela sempre possui água",
            "Uma estrela sempre orbita a Terra"
        ],
        resposta: 0,
        dificuldade: 2,
        peso: 4
    },

    {
        tema: "🌌 Galáxia",
        pergunta: "Em qual galáxia está localizado o Sistema Solar?",
        opcoes: [
            "Andrômeda",
            "Via Láctea",
            "Galáxia do Triângulo",
            "Grande Nuvem de Magalhães"
        ],
        resposta: 1,
        dificuldade: 1,
        peso: 5
    },

    {
        tema: "☄️ Cometa",
        pergunta: "A cauda de um cometa geralmente está relacionada a quê?",
        opcoes: [
            "Gelo e poeira liberados pela aproximação do Sol",
            "Rochas produzidas pela Terra",
            "Água líquida",
            "Anéis de Saturno"
        ],
        resposta: 0,
        dificuldade: 3,
        peso: 4
    },

    {
        tema: "🛰️ Satélite",
        pergunta: "O que é um satélite natural?",
        opcoes: [
            "Um corpo que orbita outro corpo celeste",
            "Uma estrela muito pequena",
            "Um tipo de foguete",
            "Uma estação espacial"
        ],
        resposta: 0,
        dificuldade: 2,
        peso: 4
    },

    {
        tema: "🚀 Foguete",
        pergunta: "O que permite que um foguete seja impulsionado para o espaço?",
        opcoes: [
            "Empuxo produzido pela expulsão de gases",
            "A luz da Lua",
            "O campo magnético da Terra",
            "A rotação da Terra"
        ],
        resposta: 0,
        dificuldade: 2,
        peso: 4
    },

    {
        tema: "👨‍🚀 Astronauta",
        pergunta: "O que um astronauta pode realizar durante uma missão espacial?",
        opcoes: [
            "Experimentos e atividades operacionais",
            "Controlar o clima da Terra",
            "Alterar a órbita da Lua",
            "Criar estrelas"
        ],
        resposta: 0,
        dificuldade: 2,
        peso: 4
    },

    {
        tema: "🌑 Eclipse",
        pergunta: "Em um eclipse solar, qual corpo fica entre a Terra e o Sol?",
        opcoes: [
            "Marte",
            "Lua",
            "Júpiter",
            "Saturno"
        ],
        resposta: 1,
        dificuldade: 2,
        peso: 5
    },

    {
        tema: "🌠 Chuva de meteoros",
        pergunta: "Uma chuva de meteoros pode acontecer quando a Terra atravessa uma região contendo muitos fragmentos espaciais?",
        opcoes: [
            "Sim",
            "Não",
            "Somente em Marte",
            "Somente durante eclipses"
        ],
        resposta: 0,
        dificuldade: 2,
        peso: 4
    },

    {
        tema: "🌈 Nebulosa",
        pergunta: "O que é uma nebulosa?",
        opcoes: [
            "Uma grande região de gás e poeira no espaço",
            "Um planeta gasoso",
            "Uma lua congelada",
            "Um tipo de cometa"
        ],
        resposta: 0,
        dificuldade: 2,
        peso: 4
    },

    {
        tema: "🕳️ Buraco negro",
        pergunta: "Por que um buraco negro é chamado dessa forma?",
        opcoes: [
            "Porque sua gravidade é tão intensa que nem a luz escapa de seu horizonte de eventos",
            "Porque ele é literalmente um buraco vazio",
            "Porque ele não possui matéria",
            "Porque ele produz luz negra"
        ],
        resposta: 0,
        dificuldade: 4,
        peso: 3
    },

    {
        tema: "🔭 Telescópio",
        pergunta: "Para que serve um telescópio astronômico?",
        opcoes: [
            "Observar e estudar objetos celestes",
            "Produzir estrelas",
            "Criar planetas",
            "Alterar a gravidade"
        ],
        resposta: 0,
        dificuldade: 1,
        peso: 5
    },

    {
        tema: "🌟 Supernova",
        pergunta: "O que é uma supernova?",
        opcoes: [
            "Uma explosão extremamente energética associada a certos estágios finais de estrelas",
            "Uma lua de Júpiter",
            "Uma chuva de meteoros",
            "Uma região da Terra"
        ],
        resposta: 0,
        dificuldade: 4,
        peso: 3
    },

    {
        tema: "💫 Pulsar",
        pergunta: "O que é um pulsar?",
        opcoes: [
            "Uma estrela de nêutrons que emite pulsos regulares de radiação",
            "Um planeta com anéis",
            "Um cometa muito brilhante",
            "Uma galáxia pequena"
        ],
        resposta: 0,
        dificuldade: 4,
        peso: 3
    },

    {
        tema: "🪨 Asteroide",
        pergunta: "O que é um asteroide?",
        opcoes: [
            "Um corpo rochoso ou metálico que orbita o Sol",
            "Uma estrela pequena",
            "Uma nuvem de gás",
            "Um satélite artificial"
        ],
        resposta: 0,
        dificuldade: 2,
        peso: 4
    },

    {
        tema: "🌕 Cratera",
        pergunta: "O que pode causar uma cratera de impacto na superfície de um corpo celeste?",
        opcoes: [
            "A colisão de um objeto espacial",
            "A luz do Sol",
            "O vento solar sozinho",
            "Uma eclipse"
        ],
        resposta: 0,
        dificuldade: 2,
        peso: 4
    },

    {
        tema: "🌗 Fases da Lua",
        pergunta: "As fases da Lua acontecem principalmente por causa de quê?",
        opcoes: [
            "Da posição relativa entre Sol, Terra e Lua",
            "Da mudança de tamanho da Lua",
            "Da mudança de cor da Lua",
            "Do vento solar"
        ],
        resposta: 0,
        dificuldade: 2,
        peso: 5
    },

    {
        tema: "💫 Anéis planetários",
        pergunta: "Qual planeta é especialmente conhecido por seus anéis?",
        opcoes: [
            "Saturno",
            "Mercúrio",
            "Terra",
            "Marte"
        ],
        resposta: 0,
        dificuldade: 1,
        peso: 5
    },

    {
        tema: "💡 Ano-luz",
        pergunta: "O que é um ano-luz?",
        opcoes: [
            "Uma unidade de distância",
            "Uma unidade de massa",
            "Uma unidade de temperatura",
            "Uma unidade de tempo usada em relógios"
        ],
        resposta: 0,
        dificuldade: 2,
        peso: 5
    },

    {
        tema: "📐 Órbita",
        pergunta: "O que é a órbita de um planeta?",
        opcoes: [
            "O caminho que ele percorre ao redor de outro corpo",
            "Sua temperatura média",
            "Seu tamanho",
            "Sua atmosfera"
        ],
        resposta: 0,
        dificuldade: 1,
        peso: 5
    },

    {
        tema: "🌎 Exoplaneta",
        pergunta: "O que é um exoplaneta?",
        opcoes: [
            "Um planeta que orbita uma estrela fora do nosso Sistema Solar",
            "Uma lua da Terra",
            "Um asteroide próximo ao Sol",
            "Uma estrela muito pequena"
        ],
        resposta: 0,
        dificuldade: 2,
        peso: 5
    },

    {
        tema: "🌌 Via Láctea",
        pergunta: "A Via Láctea é o quê?",
        opcoes: [
            "Uma galáxia",
            "Um planeta",
            "Uma estrela",
            "Uma nebulosa"
        ],
        resposta: 0,
        dificuldade: 1,
        peso: 5
    }
];


/*
=========================================================
UTILIDADES
=========================================================
*/

function shuffle(array) {

    const copy = [...array];

    for (
        let i = copy.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            copy[i],
            copy[j]
        ] = [
            copy[j],
            copy[i]
        ];

    }

    return copy;
}


function weightedRandom(items) {

    const total =
        items.reduce(
            (sum, item) =>
                sum + (item.peso || 1),
            0
        );

    let random =
        Math.random() * total;

    for (const item of items) {

        random -=
            item.peso || 1;

        if (random <= 0) {
            return item;
        }

    }

    return items[
        items.length - 1
    ];
}


function generateRoomCode() {

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";

    do {

        code = "";

        for (
            let i = 0;
            i < 5;
            i++
        ) {

            code +=
                characters[
                    Math.floor(
                        Math.random() *
                        characters.length
                    )
                ];

        }

    } while (
        rooms.has(code)
    );

    return code;
}


/*
=========================================================
PERFIL DO JOGADOR
=========================================================
*/

function getProfile(socketId) {

    if (
        !playerProfiles.has(socketId)
    ) {

        playerProfiles.set(
            socketId,
            {
                totalCorrect: 0,
                totalWrong: 0,
                streak: 0,
                bestStreak: 0,
                themes: {}
            }
        );

    }

    return playerProfiles.get(
        socketId
    );
}


function registerCorrect(
    profileId,
    theme
) {

    const profile =
        getProfile(profileId);

    profile.totalCorrect++;

    profile.streak++;

    if (
        profile.streak >
        profile.bestStreak
    ) {

        profile.bestStreak =
            profile.streak;

    }

    if (
        !profile.themes[theme]
    ) {

        profile.themes[theme] = {
            acertos: 0,
            erros: 0
        };

    }

    profile.themes[
        theme
    ].acertos++;
}


function registerWrong(
    profileId,
    theme
) {

    const profile =
        getProfile(profileId);

    profile.totalWrong++;

    profile.streak = 0;

    if (
        !profile.themes[theme]
    ) {

        profile.themes[theme] = {
            acertos: 0,
            erros: 0
        };

    }

    profile.themes[
        theme
    ].erros++;
}


function getDifficulty(
    profileId,
    theme
) {

    const profile =
        getProfile(profileId);

    const history =
        profile.themes[theme];

    if (!history) {
        return 2;
    }

    const correct =
        history.acertos;

    const wrong =
        history.erros;

    if (
        wrong > correct
    ) {

        return 1;

    }

    if (
        correct >=
        wrong + 3
    ) {

        return 4;

    }

    if (
        correct >= 6
    ) {

        return 5;

    }

    return 3;
}


/*
=========================================================
FALLBACK PARA TEMAS SEM PERGUNTA LOCAL
=========================================================
*/

function createFallbackQuestion(
    theme
) {

    return {
        tema: theme,
        pergunta:
            `Qual alternativa está diretamente relacionada ao tema "${theme}"?`,
        opcoes: [
            `É um tema estudado pela astronomia`,
            "É uma receita culinária",
            "É um tipo de esporte",
            "É um instrumento musical"
        ],
        resposta: 0,
        dificuldade: 1,
        peso: 1
    };
}


/*
=========================================================
GERAÇÃO DE PERGUNTA COM GROQ
=========================================================
*/

async function generateAIQuestion(
    theme,
    difficulty,
    profileId
) {

    if (!GROQ_API_KEY) {

        return null;
    }


    const profile =
        getProfile(profileId);

    const themeHistory =
        profile.themes[theme] || {
            acertos: 0,
            erros: 0
        };


    const prompt = `
Crie uma questão de múltipla escolha sobre astronomia.

Tema:
${theme}

Dificuldade desejada:
${difficulty} de 5.

Histórico aproximado do jogador nesse tema:
Acertos: ${themeHistory.acertos}
Erros: ${themeHistory.erros}

A questão deve:
- estar correta cientificamente;
- estar em português do Brasil;
- ter exatamente 4 alternativas;
- ter exatamente uma alternativa correta;
- não depender de notícias atuais;
- não usar pegadinhas;
- variar em relação a perguntas muito comuns;
- respeitar a dificuldade solicitada.

Responda SOMENTE com JSON válido neste formato:

{
  "pergunta": "texto",
  "opcoes": [
    "alternativa 1",
    "alternativa 2",
    "alternativa 3",
    "alternativa 4"
  ],
  "resposta": 0,
  "dificuldade": 3
}

O campo "resposta" deve ser um número de 0 a 3.
`;


    try {

        const response =
            await fetch(
                "https://api.groq.com/openai/v1/chat/completions",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${GROQ_API_KEY}`
                    },

                    body:
                        JSON.stringify({
                            model:
                                GROQ_MODEL,

                            messages: [
                                {
                                    role:
                                        "system",

                                    content:
                                        "Você é um gerador de questões de astronomia. Responda somente JSON válido."
                                },

                                {
                                    role:
                                        "user",

                                    content:
                                        prompt
                                }
                            ],

                            temperature:
                                0.8,

                            max_completion_tokens:
                                500
                        })
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Erro Groq:",
                response.status,
                errorText
            );

            return null;
        }


        const data =
            await response.json();


        let content =
            data
                ?.choices?.[0]
                ?.message
                ?.content;


        if (
            typeof content !==
            "string"
        ) {

            return null;
        }


        content =
            content
                .replace(
                    /```json/gi,
                    ""
                )
                .replace(
                    /```/g,
                    ""
                )
                .trim();


        const question =
            JSON.parse(
                content
            );


        if (
            !question.pergunta ||
            !Array.isArray(
                question.opcoes
            ) ||
            question.opcoes.length !== 4 ||
            typeof question.resposta !==
                "number"
        ) {

            return null;
        }


        if (
            question.resposta < 0 ||
            question.resposta > 3
        ) {

            return null;
        }


        return {
            tema: theme,

            pergunta:
                question.pergunta,

            opcoes:
                question.opcoes,

            resposta:
                question.resposta,

            dificuldade:
                Number(
                    question.dificuldade
                ) || difficulty,

            origem: "IA"
        };

    } catch (error) {

        console.error(
            "Falha ao gerar pergunta com Groq:",
            error.message
        );

        return null;
    }
}


/*
=========================================================
ESCOLHA DA PERGUNTA
=========================================================
*/

async function createQuestion(
    theme,
    profileId
) {

    const difficulty =
        getDifficulty(
            profileId,
            theme
        );


    /*
     * IA tem peso maior.
     */

    const useAI =
        GROQ_API_KEY &&
        Math.random() < 0.8;


    if (useAI) {

        const aiQuestion =
            await generateAIQuestion(
                theme,
                difficulty,
                profileId
            );

        if (aiQuestion) {

            return aiQuestion;

        }

    }


    /*
     * Procura perguntas locais
     * do mesmo tema.
     */

    const localQuestions =
        LOCAL_QUESTIONS.filter(
            question =>
                question.tema === theme
        );


    if (
        localQuestions.length > 0
    ) {

        /*
         * Dá preferência à dificuldade
         * mais próxima do jogador.
         */

        const sorted =
            [...localQuestions].sort(
                (a, b) =>
                    Math.abs(
                        a.dificuldade -
                        difficulty
                    ) -
                    Math.abs(
                        b.dificuldade -
                        difficulty
                    )
            );


        /*
         * Mantém algum fator de
         * aleatoriedade entre as
         * perguntas próximas.
         */

        const candidates =
            sorted.slice(
                0,
                Math.min(
                    3,
                    sorted.length
                )
            );


        return weightedRandom(
            candidates
        );

    }


    return createFallbackQuestion(
        theme
    );
}


/*
=========================================================
CARTAS
=========================================================
*/

function createCards(mode) {

    const pairCount =
        mode === "impossible"
            ? 41
            : 16;


    const selectedThemes =
        shuffle(
            THEMES
        ).slice(
            0,
            pairCount
        );


    const cards = [];


    selectedThemes.forEach(
        (themeData, index) => {

            const pairId =
                `pair-${index + 1}`;


            cards.push({

                id:
                    `${pairId}-a`,

                pairId,

                theme:
                    themeData.theme,

                icon:
                    themeData.icon,

                matched:
                    false,

                revealed:
                    false

            });


            cards.push({

                id:
                    `${pairId}-b`,

                pairId,

                theme:
                    themeData.theme,

                icon:
                    themeData.icon,

                matched:
                    false,

                revealed:
                    false

            });

        }
    );


    return shuffle(
        cards
    );
}


/*
=========================================================
EMBARALHAR APENAS AS CARTAS NÃO ENCONTRADAS
=========================================================
*/

function reshuffleUnmatched(
    room
) {

    const unmatched =
        room.cards.filter(
            card =>
                !card.matched
        );


    const matched =
        room.cards.filter(
            card =>
                card.matched
        );


    const shuffled =
        shuffle(
            unmatched
        );


    room.cards = [
        ...matched,
        ...shuffled
    ];
}


/*
=========================================================
ESTADO PÚBLICO DA SALA
=========================================================
*/

function publicRoom(
    room
) {

    return {

        code:
            room.code,

        mode:
            room.mode,

        gameStarted:
            room.gameStarted,

        gameFinished:
            room.gameFinished,

        turn:
            room.turn,

        currentPlayerIndex:
            room.turn,

        currentPlayerId:
            room.players[room.turn]?.id || null,

        players:
            room.players.map(
                player => ({
                    id:
                        player.id,

                    name:
                        player.name,

                    score:
                        player.score,

                    ready:
                        player.ready
                })
            ),

        cards:
            room.cards.map(
                card => ({
                    id:
                        card.id,

                    pairId:
                        card.pairId,

                    theme:
                        card.theme,

                    icon:
                        card.icon,

                    matched:
                        card.matched,

                    revealed:
                        card.revealed
                })
            )

    };
}


/*
=========================================================
ATUALIZAR SALA
=========================================================
*/

function broadcastRoom(
    room
) {

    io.to(room.code).emit(
        "roomUpdate",
        publicRoom(room)
    );
}


/*
=========================================================
FINALIZAR PARTIDA
=========================================================
*/

function checkGameFinished(
    room
) {

    const finished =
        room.cards.every(
            card =>
                card.matched
        );


    if (!finished) {
        return false;
    }


    room.gameFinished =
        true;

    room.pendingQuiz =
        null;


    io.to(room.code).emit(
        "gameFinished",
        publicRoom(room)
    );


    broadcastRoom(
        room
    );


    return true;
}


/*
=========================================================
INICIAR PARTIDA
=========================================================
*/

function startGame(
    room
) {

    room.gameStarted =
        true;

    room.gameFinished =
        false;

    room.turn = 0;

    room.cards =
        createCards(
            room.mode
        );

    room.pendingQuiz =
        null;

    room.rematchVotes =
        new Set();


    for (
        const player of room.players
    ) {

        player.score = 0;
        player.ready = false;

    }


    io.to(room.code).emit(
        "gameStarted",
        publicRoom(room)
    );


    broadcastRoom(
        room
    );
}


/*
=========================================================
SOCKET.IO
=========================================================
*/

io.on(
    "connection",
    socket => {

        console.log(
            "Jogador conectado:",
            socket.id
        );


        /*
        =============================================
        CRIAR SALA
        =============================================
        */

        socket.on(
            "createRoom",
            data => {

                const name =
                    String(
                        data?.name || ""
                    )
                    .trim()
                    .slice(
                        0,
                        20
                    );


                const mode =
                    data?.mode ===
                    "impossible"
                        ? "impossible"
                        : "easy";

                const profileId =
                    String(
                        data?.profileId || ""
                    ).trim().slice(0, 100);


                if (!name) {

                    socket.emit(
                        "errorMessage",
                        "Digite seu nome."
                    );

                    return;
                }


                const code =
                    generateRoomCode();


                const room = {

                    code,

                    mode,

                    players: [
                        {
                            id:
                                socket.id,

                            name,

                            profileId,

                            score: 0,

                            ready: false
                        }
                    ],

                    cards: [],

                    turn: 0,

                    gameStarted:
                        false,

                    gameFinished:
                        false,

                    pendingQuiz:
                        null,

                    rematchVotes:
                        new Set()

                };


                rooms.set(
                    code,
                    room
                );


                socket.join(
                    code
                );


                getProfile(
                    profileId
                );


                socket.emit(
                    "roomCreated",
                    {
                        code,

                        playerId:
                            socket.id
                    }
                );


                broadcastRoom(
                    room
                );

            }
        );


        /*
        =============================================
        ENTRAR NA SALA
        =============================================
        */

        socket.on(
            "joinRoom",
            data => {

                const code =
                    String(
                        data?.code || ""
                    )
                    .trim()
                    .toUpperCase();


                const name =
                    String(
                        data?.name || ""
                    )
                    .trim()
                    .slice(
                        0,
                        20
                    );

                const profileId =
                    String(
                        data?.profileId || ""
                    ).trim().slice(0, 100);


                const room =
                    rooms.get(
                        code
                    );


                if (!room) {

                    socket.emit(
                        "errorMessage",
                        "Sala não encontrada."
                    );

                    return;
                }


                if (
                    room.players.length >= 2
                ) {

                    socket.emit(
                        "errorMessage",
                        "Essa sala já está cheia."
                    );

                    return;
                }


                if (
                    room.gameStarted
                ) {

                    socket.emit(
                        "errorMessage",
                        "A partida já começou."
                    );

                    return;
                }


                if (!name) {

                    socket.emit(
                        "errorMessage",
                        "Digite seu nome."
                    );

                    return;
                }


                room.players.push({

                    id:
                        socket.id,

                    name,

                    profileId,

                    score: 0,

                    ready: false

                });


                socket.join(
                    code
                );


                getProfile(
                    profileId
                );


                socket.emit(
                    "roomJoined",
                    {
                        code,

                        playerId:
                            socket.id
                    }
                );


                broadcastRoom(
                    room
                );

            }
        );


        /*
        =============================================
        PRONTO
        =============================================
        */

        socket.on(
            "setReady",
            () => {

                const room =
                    findRoomBySocket(
                        socket.id
                    );


                if (!room) {
                    return;
                }


                if (
                    room.gameStarted
                ) {
                    return;
                }


                const player =
                    room.players.find(
                        p =>
                            p.id ===
                            socket.id
                    );


                if (!player) {
                    return;
                }


                player.ready =
                    !player.ready;


                broadcastRoom(
                    room
                );


                if (
                    room.players.length ===
                        2 &&
                    room.players.every(
                        p =>
                            p.ready
                    )
                ) {

                    startGame(
                        room
                    );

                }

            }
        );


        /*
        =============================================
        SELECIONAR CARTA
        =============================================
        */

        socket.on(
            "selectCard",
            async data => {

                const room =
                    findRoomBySocket(
                        socket.id
                    );


                if (!room) {
                    return;
                }


                if (
                    !room.gameStarted ||
                    room.gameFinished
                ) {
                    return;
                }


                if (
                    room.pendingQuiz
                ) {
                    return;
                }


                const playerIndex =
                    room.players.findIndex(
                        p =>
                            p.id ===
                            socket.id
                    );


                if (
                    playerIndex !==
                    room.turn
                ) {
                    return;
                }


                const cardId =
                    typeof data ===
                    "string"
                        ? data
                        : data?.cardId ??
                          (
                              Number.isInteger(
                                  data?.index
                              )
                                  ? room.cards[
                                      data.index
                                    ]?.id
                                  : null
                          );


                const card =
                    room.cards.find(
                        c =>
                            c.id ===
                            cardId
                    );


                if (!card) {
                    return;
                }


                if (
                    card.matched ||
                    card.revealed
                ) {
                    return;
                }


                const firstCard =
                    room.cards.find(
                        c =>
                            c.revealed &&
                            !c.matched
                    );


                if (
                    firstCard &&
                    firstCard.id ===
                    card.id
                ) {
                    return;
                }


                card.revealed =
                    true;


                if (!firstCard) {

                    broadcastRoom(
                        room
                    );

                    return;
                }


                broadcastRoom(
                    room
                );


                // Se as duas cartas não formam um par,
                // não há quiz: a tentativa falha e o turno passa.
                if (
                    firstCard.pairId !==
                    card.pairId
                ) {

                    setTimeout(
                        () => {

                            if (
                                !rooms.has(
                                    room.code
                                ) ||
                                room.gameFinished
                            ) {
                                return;
                            }

                            for (
                                const id of [
                                    firstCard.id,
                                    card.id
                                ]
                            ) {

                                const found =
                                    room.cards.find(
                                        c =>
                                            c.id ===
                                            id
                                    );

                                if (found) {
                                    found.revealed =
                                        false;
                                }

                            }

                            room.turn =
                                room.turn === 0
                                    ? 1
                                    : 0;

                            if (
                                room.mode ===
                                "impossible"
                            ) {
                                reshuffleUnmatched(
                                    room
                                );
                            }

                            io.to(
                                room.code
                            ).emit(
                                "pairMismatch"
                            );

                            broadcastRoom(
                                room
                            );

                        },
                        700
                    );

                    return;
                }


                const player =
                    room.players[playerIndex];


                const quiz =
                    await createQuestion(
                        card.theme,
                        player.profileId
                    );


                if (
                    !rooms.has(
                        room.code
                    ) ||
                    room.gameFinished
                ) {
                    return;
                }


                room.pendingQuiz = {

                    cardIds: [
                        firstCard.id,
                        card.id
                    ],

                    pairId:
                        card.pairId,

                    theme:
                        card.theme,

                    quiz,

                    answers:
                        new Map(),

                    token:
                        `${Date.now()}-${Math.random().toString(36).slice(2)}`,

                    startedBy:
                        socket.id

                };


                io.to(
                    room.code
                ).emit(
                    "quiz",
                    {
                        theme:
                            card.theme,

                        quiz: {
                            question:
                                quiz.pergunta,

                            options:
                                quiz.opcoes,

                            difficulty:
                                quiz.dificuldade
                        }
                    }
                );

            }
        );



        /*
        =============================================
        RESPONDER QUIZ
        =============================================
        */

        socket.on(
            "answerQuiz",
            data => {

                const room =
                    findRoomBySocket(
                        socket.id
                    );


                if (!room) {
                    return;
                }


                const pending =
                    room.pendingQuiz;


                if (!pending) {
                    return;
                }


                if (
                    data?.token &&
                    data.token !==
                    pending.token
                ) {
                    return;
                }


                const playerIndex =
                    room.players.findIndex(
                        p =>
                            p.id ===
                            socket.id
                    );


                if (
                    playerIndex === -1
                ) {
                    return;
                }


                const player =
                    room.players[playerIndex];


                if (
                    pending.answers.has(
                        socket.id
                    )
                ) {
                    return;
                }


                const answer =
                    Number(data?.answer);


                const isCorrect =
                    Number.isInteger(answer) &&
                    answer ===
                    pending.quiz.resposta;


                pending.answers.set(
                    socket.id,
                    isCorrect
                );


                if (isCorrect) {

                    registerCorrect(
                        player.profileId,
                        pending.theme
                    );


                    for (
                        const id of
                        pending.cardIds
                    ) {

                        const card =
                            room.cards.find(
                                c =>
                                    c.id ===
                                    id
                            );

                        if (card) {
                            card.matched =
                                true;

                            card.revealed =
                                true;
                        }

                    }


                    player.score += 2;


                    // Quem acertou assume o turno.
                    room.turn =
                        playerIndex;


                    io.to(
                        room.code
                    ).emit(
                        "quizResult",
                        {
                            correct:
                                true,

                            winner:
                                player.name,

                            winnerId:
                                socket.id,

                            theme:
                                pending.theme
                        }
                    );


                    room.pendingQuiz =
                        null;


                    if (
                        room.mode ===
                        "impossible"
                    ) {

                        reshuffleUnmatched(
                            room
                        );

                    }


                    if (
                        checkGameFinished(
                            room
                        )
                    ) {
                        return;
                    }


                    broadcastRoom(
                        room
                    );


                    return;
                }


                registerWrong(
                    player.profileId,
                    pending.theme
                );


                io.to(
                    room.code
                ).emit(
                    "quizResult",
                    {
                        correct:
                            false,

                        wrongPlayer:
                            player.name,

                        wrongPlayerId:
                            socket.id,

                        theme:
                            pending.theme
                    }
                );


                const allPlayersAnswered =
                    room.players.every(
                        p =>
                            pending.answers.has(
                                p.id
                            )
                    );


                if (
                    !allPlayersAnswered
                ) {
                    return;
                }


                for (
                    const id of
                    pending.cardIds
                ) {

                    const card =
                        room.cards.find(
                            c =>
                                c.id ===
                                id
                        );

                    if (card) {
                        card.revealed =
                            false;
                    }

                }


                room.pendingQuiz =
                    null;


                room.turn =
                    room.turn === 0
                        ? 1
                        : 0;


                if (
                    room.mode ===
                    "impossible"
                ) {

                    reshuffleUnmatched(
                        room
                    );

                }


                broadcastRoom(
                    room
                );

            }
        );


        /*
        =============================================
        REVANCHE
        =============================================
        */

        const handleRematch = () => {

            const room =
                findRoomBySocket(
                    socket.id
                );


            if (!room) {
                return;
            }


            if (
                !room.gameFinished
            ) {
                return;
            }


            room.rematchVotes.add(
                socket.id
            );


            if (
                room.rematchVotes.size <
                2
            ) {

                io.to(
                    room.code
                ).emit(
                    "rematchWaiting",
                    {
                        waiting: true
                    }
                );

                return;
            }


            room.rematchVotes =
                new Set();


            startGame(
                room
            );


            io.to(
                room.code
            ).emit(
                "rematchStarted",
                publicRoom(room)
            );

        };


        socket.on(
            "rematch",
            handleRematch
        );


        socket.on(
            "requestRematch",
            handleRematch
        );


        /*
        =============================================
        SAIR DA SALA
        =============================================
        */

        socket.on(
            "leaveRoom",
            () => {

                removePlayer(
                    socket
                );

            }
        );


        /*
        =============================================
        DESCONECTAR
        =============================================
        */

        socket.on(
            "disconnect",
            () => {

                console.log(
                    "Jogador desconectado:",
                    socket.id
                );


                removePlayer(
                    socket
                );

            }
        );

    }
);


/*
=========================================================
ENCONTRAR SALA DO JOGADOR
=========================================================
*/

function findRoomBySocket(
    socketId
) {

    for (
        const room of
        rooms.values()
    ) {

        if (
            room.players.some(
                player =>
                    player.id ===
                    socketId
            )
        ) {

            return room;

        }

    }

    return null;
}


/*
=========================================================
REMOVER JOGADOR
=========================================================
*/

function removePlayer(
    socket
) {

    const room =
        findRoomBySocket(
            socket.id
        );


    if (!room) {
        return;
    }


    const playerIndex =
        room.players.findIndex(
            player =>
                player.id ===
                socket.id
        );


    if (
        playerIndex === -1
    ) {
        return;
    }


    room.players.splice(
        playerIndex,
        1
    );


    /*
     * Se alguém sair, a sala é encerrada.
     * Isso mantém o sistema simples enquanto
     * ainda não temos banco de dados.
     */

    io.to(
        room.code
    ).emit(
        "playerDisconnected"
    );


    io.to(
        room.code
    ).emit(
        "roomClosed"
    );


    rooms.delete(
        room.code
    );

}


/*
=========================================================
HEALTH CHECK
=========================================================
*/

app.get(
    "/health",
    (req, res) => {

        res.json({
            ok: true,

            ai:
                Boolean(
                    GROQ_API_KEY
                ),

            model:
                GROQ_MODEL,

            rooms:
                rooms.size
        });

    }
);


/*
=========================================================
INICIAR SERVIDOR
=========================================================
*/

server.listen(
    PORT,
    () => {

        console.log(
            `Servidor rodando na porta ${PORT}`
        );

        console.log(
            `Groq configurado: ${
                GROQ_API_KEY
                    ? "SIM"
                    : "NÃO"
            }`
        );

        console.log(
            `Modelo: ${GROQ_MODEL}`
        );

    }
);