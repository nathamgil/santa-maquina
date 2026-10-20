/* =====================================================================
   Santa Máquina Tatuagem — configuração
   Único arquivo que precisa ser editado para o site sair do modo de
   demonstração e entrar no ar de verdade.
   Fonte: Instagram @santamaquina.tatuagem e @petercalaverastattoo
   (coletado em 20/10/2026). O que não estava lá está marcado A CONFIRMAR.
   ===================================================================== */

window.TV = {

  /* ---- Estúdio ------------------------------------------------------ */
  nome:       'Santa Máquina',
  slogan:     'Estúdio de tatuagem geek · Salvador',
  assinatura: 'Welcome to the dungeon',
  instagram:  'santamaquina.tatuagem',
  prefixoDemo: 'sm_',   // chaves da demo no navegador (agenda.js usa o mesmo prefixo)
  logo:       'fotos/logo.jpg',   // portal em pixel do estúdio: entra onde falta foto

  // WhatsApp de orçamentos da bio (abrir.link/gdPYK). O resumo do pedido vai para cá.
  whatsapp:        '5571988215058',
  whatsappVisivel: '(71) 98821-5058',

  // Endereço NÃO aparece no Instagram: A CONFIRMAR. Sem endereço, o site
  // mostra só "Salvador — BA" e não desenha mapa.
  endereco: {
    linha1: '',
    linha2: 'Salvador — BA',
    referencia: '',
    maps:   '',
    embed:  '',
    busca:  'Salvador - BA'
  },
  funcionamento: 'Atendimento com hora marcada',

  /* ---- Supabase ---------------------------------------------------
     Enquanto estes dois campos estiverem vazios, o site roda em MODO
     DEMONSTRAÇÃO: o pedido funciona de verdade na tela, mas fica guardado
     só no navegador de quem está olhando.

     Para ligar de verdade:
       1. supabase.com  ->  New project (região: South America / São Paulo)
       2. SQL Editor    ->  cole e rode db/schema.sql inteiro
       3. Settings > API -> copie "Project URL" e a chave "anon public"
       4. cole abaixo e suba pro GitHub
  ------------------------------------------------------------------ */
  supabaseUrl: '',
  supabaseKey: '',

  /* ---- Regras da agenda (espelham o db/schema.sql) ---------------- */
  regras: {
    passoMin:        30,
    antecedenciaMin: 30,
    janelaDias:      30,
    cancelamentoH:   2
  },

  // Com um artista só, "sem preferência" não faz sentido. Quando entrar o
  // segundo, true mostra a opção "O estúdio escolhe".
  semPreferencia: false,

  // Slots de "personagem bloqueado" na vitrine (estrutura pronta para mais artistas).
  slotsVazios: 2,

  /* ---- Expediente (0 = domingo) ------------------------------------
     PROVISÓRIO para a agenda da demo: segunda a sábado, 10h às 19h.
     O horário real NÃO aparece no Instagram (só "hora marcada"). A CONFIRMAR.
  ------------------------------------------------------------------ */
  expediente: {
    0: { aberto: false },
    1: { aberto: true, abre: '10:00', fecha: '19:00' },
    2: { aberto: true, abre: '10:00', fecha: '19:00' },
    3: { aberto: true, abre: '10:00', fecha: '19:00' },
    4: { aberto: true, abre: '10:00', fecha: '19:00' },
    5: { aberto: true, abre: '10:00', fecha: '19:00' },
    6: { aberto: true, abre: '10:00', fecha: '19:00' }
  },

  /* ---- Personagens (páginas artista.html?a=<slug>) -------------------
     Só o que está nas bios e nos posts.
     classe/nivel: o rótulo da ficha (o "Final boss" vem da bio do Peter).
     atributos: [nome, 0-100] — barras visuais tiradas da bio, não são nota.
     Para entrar outro artista: copie o bloco, troque os dados e diminua
     slotsVazios.
  ------------------------------------------------------------------ */
  artistas: [
    {
      slug: 'peter', nome: 'Peter Calaveras', apelido: 'Peter', instagram: 'petercalaverastattoo',
      whatsapp: '5571988215058',
      foto: 'fotos/peter-perfil.jpg', cor: 'roxo',
      oficio: 'Tatuador', classe: 'Final boss', nivel: 'LV MAX',
      linha: 'Tatuador · blackwork, contraste e autoral',
      estilos: ['Blackwork', 'Contraste', 'Autoral', 'Black & redwork', 'Caveiras e serpentes'],
      atributos: [['Blackwork', 100], ['Contraste', 100], ['Autoral', 100]],
      frase: 'Liberdade pela identidade.',
      bio: [
        'O "Final boss" da Santa Máquina, nas palavras da própria bio.',
        'Blackwork, contraste e desenho autoral.',
        'Caveiras, serpentes, machados e criaturas: preto pesado com vermelho de destaque.',
        'Está montando um álbum com desenhos autorais (flash) para tatuar.',
        '"A tatuagem nasce da sua identidade."'
      ],
      fotos: [
        { src: 'fotos/peter-1.jpg', alt: 'Caveira com serpente em verde vibrante no antebraço' },
        { src: 'fotos/peter-2.jpg', alt: 'Criatura com chamas em cores fortes na perna' },
        { src: 'fotos/peter-3.jpg', alt: 'Serpente em black & redwork na perna' },
        { src: 'fotos/peter-4.jpg', alt: 'Caveira com serpente em preto e vermelho' },
        { src: 'fotos/peter-5.jpg', alt: 'Machado bárbaro com caveira na nuca' },
        { src: 'fotos/peter-6.jpg', alt: 'Folha de desenhos autorais: punhais, caveiras e rosas' }
      ]
    }
  ],

  // Peças publicadas no perfil do estúdio (marca d'água da Santa Máquina).
  // Autoria de cada uma A CONFIRMAR: aparecem como "do estúdio".
  galeriaEstudio: [
    { src: 'fotos/estudio-1.jpg', alt: 'Anjo de asas abertas com "Nullum gratuitum prandium" nas costas' },
    { src: 'fotos/estudio-2.jpg', alt: 'Personagem de anime de chapéu de palha em preto e cinza no braço' },
    { src: 'fotos/estudio-3.jpg', alt: 'Caveira e ampulheta em preto e vermelho no antebraço' },
    { src: 'fotos/estudio-4.jpg', alt: 'Caveira com espinhos em blackwork na panturrilha' },
    { src: 'fotos/estudio-5.jpg', alt: 'Punhal com rosas vermelhas e as letras GNR' }
  ],

  // Nada tem preço fixo: tudo sai como "sob orçamento" (preco 0).
  // Durações A CONFIRMAR: servem só para reservar o tempo certo na agenda.
  servicosDemo: [
    { id:'orcamento',      nome:'Conversa de orçamento', descricao:'30 min com o artista para ver a ideia, o local e o tamanho, e fechar valor e data.', preco_centavos:0, a_partir_de:false, duracao_min:30,  categoria:'Missões de tatuagem' },
    { id:'flash',          nome:'Desenho autoral (flash)', descricao:'Escolha uma arte do álbum autoral do Peter.',                                      preco_centavos:0, a_partir_de:false, duracao_min:120, categoria:'Missões de tatuagem', apenas_barbeiro_id:'peter' },
    { id:'sessao-pequena', nome:'Sessão pequena',        descricao:'Peças menores, missão rápida.',                                                     preco_centavos:0, a_partir_de:false, duracao_min:120, categoria:'Missões de tatuagem' },
    { id:'sessao-media',   nome:'Sessão média',          descricao:'Antebraço, panturrilha, nuca: mais detalhe e contraste.',                          preco_centavos:0, a_partir_de:false, duracao_min:240, categoria:'Missões de tatuagem' },
    { id:'sessao-longa',   nome:'Sessão longa',          descricao:'Raid de boa parte do dia, para projetos grandes e fechamentos.',                   preco_centavos:0, a_partir_de:false, duracao_min:360, categoria:'Missões de tatuagem' },
    { id:'retoque',        nome:'Retoque',               descricao:'Para tattoo já cicatrizada que precisa de reforço.',                               preco_centavos:0, a_partir_de:false, duracao_min:60,  categoria:'Missões de tatuagem' }
  ],
  rotuloPreco: { 'Missões de tatuagem': 'Sob orçamento' },
  rotuloPedir: 'Começar missão com ',
  rotuloPedirCurto: 'Missão com ',
  rotuloGaleria: 'Inventário de ',

  /* ---- Estilos que aparecem no pedido de tatuagem --------------------
     Tirados da bio do Peter e do portfólio do estúdio. A CONFIRMAR.
  ------------------------------------------------------------------ */
  estilos: ['Blackwork', 'Black & redwork', 'Autoral', 'Geek / anime / games', 'Caveiras e criaturas', 'Colorido', 'Lettering', 'Trago meu desenho', 'Ainda não sei']
};

// o motor chama os profissionais de "barbeiros" (nome herdado, não aparece na tela)
window.TV.barbeirosDemo = window.TV.artistas.map(function (a) {
  return { id: a.slug, slug: a.slug, nome: a.nome, foto: a.foto, instagram: a.instagram,
           whatsapp: a.whatsapp, cargo: a.linha };
});
window.TV.artistaPor = function (chave) {
  return window.TV.artistas.filter(function (a) {
    return a.slug === chave || a.nome === chave || a.instagram === chave;
  })[0] || null;
};
window.TV.modoDemo = !(window.TV.supabaseUrl && window.TV.supabaseKey);
