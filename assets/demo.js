/* =====================================================================
   Santa Máquina — dados de EXEMPLO do modo demonstração (site e painel).
   Só roda com o Supabase desligado. Todos os clientes são fictícios e
   marcados "(exemplo)". Os valores em R$ também são fictícios: servem para
   mostrar o funil, não são tabela do estúdio.
   As "referências" usam fotos da pasta fotos/.
   Carrega depois de config.js e antes de agenda.js / admin.js.
   ===================================================================== */
(function () {
  'use strict';
  var CFG = window.TV;
  if (!CFG || !CFG.modoDemo) return;
  // prefixo das chaves do navegador: o mesmo que o motor (agenda.js) usa
  var PFX = CFG.prefixoDemo || 'dv_';
  var VERSAO = PFX + 'santa_semeado_v1';
  try { if (localStorage.getItem(VERSAO)) return; } catch (e) { return; }

  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function aberto(d) { var e = (CFG.expediente || {})[d.getDay()]; return e ? !!e.aberto : d.getDay() !== 0; }
  // dia a partir de hoje; dia fechado (domingo) pula para o próximo dia aberto
  function dia(off) {
    var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + off);
    for (var i = 0; i < 7 && !aberto(d); i++) d.setDate(d.getDate() + (off < 0 ? -1 : 1));
    return iso(d);
  }
  // próximo dia aberto a partir de uma data ISO (passo +1 ou -1)
  function outroDia(s, passo) {
    var p = s.split('-'), d = new Date(+p[0], +p[1] - 1, +p[2], 12);
    do { d.setDate(d.getDate() + passo); } while (!aberto(d));
    return iso(d);
  }
  function criado(off, h) { var d = new Date(); d.setDate(d.getDate() + off); d.setHours(h || 10, 17, 0, 0); return d.toISOString(); }
  function min(t) { var p = t.split(':'); return (+p[0]) * 60 + (+p[1]); }
  function hora(m) { return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }

  // nomes e durações de reserva, caso o config ainda não traga o serviço
  var SERV = {
    'orcamento':         { nome: 'Conversa de orçamento',  duracao_min: 30 },
    'sessao-pequena':    { nome: 'Sessão pequena',         duracao_min: 120 },
    'sessao-media':      { nome: 'Sessão média',           duracao_min: 240 },
    'sessao-longa':      { nome: 'Sessão longa',           duracao_min: 360 },
    'cobertura':         { nome: 'Avaliação de cobertura', duracao_min: 30 },
    'retoque':           { nome: 'Retoque',                duracao_min: 60 },
    'perfuracao':        { nome: 'Perfuração',             duracao_min: 30 },
    'projeto-auricular': { nome: 'Projeto auricular',      duracao_min: 60 }
  };
  (CFG.servicosDemo || []).forEach(function (s) { SERV[s.id] = s; });
  var NOME = { peter: 'Peter Calaveras' };
  (CFG.artistas || []).forEach(function (a) { NOME[a.slug] = a.nome; });

  function tattoo(estilo, local, tam, ideia, extra) {
    return ['Estilo: ' + estilo, 'Local: ' + local, 'Tamanho: ' + tam]
      .concat(extra || [], ['Ideia: ' + ideia]).join('\n');
  }
  function furo(texto) { return 'Perfuração: ' + texto; }

  // [profissional, serviço, dia, início, cliente, etapa, obs, anexos, valor, sinal, sinal pago, criado há n dias]
  var L = [
    /* ---- Peter Calaveras: tatuagem ---- */
    ['peter', 'orcamento',      dia(1),  '10:00', 'Caio S.',     'novo',      tattoo('Black & redwork', 'Antebraço', '10 a 20 cm', 'Caveira com serpente em preto e vermelho', ['Primeira tattoo: Não', 'Referência geek: Não']), ['fotos/peter-4.jpg'], 0, 0, false, 0],
    ['peter', 'flash',          dia(2),  '14:00', 'Yasmin R.',   'novo',      tattoo('Autoral', 'Panturrilha', '10 a 20 cm', 'Quero o punhal com rosas da folha de flash', ['Primeira tattoo: Sim']), ['fotos/peter-6.jpg'], 0, 0, false, -1],
    ['peter', 'orcamento',      dia(3),  '11:00', 'Thiago M.',   'novo',      tattoo('Geek / anime / games', 'Braço', '10 a 20 cm', 'Personagem de anime em preto e cinza, com fundo de ondas', ['Referência geek: Anime']), [], 0, 0, false, -1],
    ['peter', 'sessao-media',   dia(4),  '10:00', 'Rafael P.',   'conversa',  tattoo('Blackwork', 'Pescoço / nuca', '10 a 20 cm', 'Machado bárbaro na nuca, preto pesado'), ['fotos/peter-5.jpg'], 0, 0, false, -2],
    ['peter', 'orcamento',      dia(2),  '17:00', 'Lívia N.',    'conversa',  tattoo('Geek / anime / games', 'Antebraço', '5 a 10 cm', 'Espada e escudo de pixel do meu jogo favorito', ['Referência geek: Game']), [], 0, 0, false, -3],
    ['peter', 'sessao-longa',   dia(6),  '10:00', 'Henrique A.', 'orcado',    tattoo('Blackwork', 'Costas', 'Mais de 20 cm', 'Anjo de asas abertas com frase em latim nas costas'), ['fotos/estudio-1.jpg'], 180000, 40000, false, -5],
    ['peter', 'sessao-media',   dia(5),  '14:00', 'Bruna T.',    'orcado',    tattoo('Caveiras e criaturas', 'Perna / panturrilha', '10 a 20 cm', 'Caveira com espinhos em blackwork'), ['fotos/estudio-4.jpg'], 85000, 20000, false, -6],
    ['peter', 'sessao-pequena', dia(0),  '15:00', 'Diego F.',    'marcado',   tattoo('Autoral', 'Antebraço', '5 a 10 cm', 'Flash de adaga com estrelas'), [], 40000, 10000, true, -7],
    ['peter', 'sessao-longa',   dia(4),  '10:00', 'Mateus L.',   'marcado',   tattoo('Colorido', 'Perna / panturrilha', 'Mais de 20 cm', 'Criatura com chamas, cores fortes'), ['fotos/peter-2.jpg'], 200000, 50000, true, -9],
    ['peter', 'retoque',        dia(3),  '16:00', 'Ana C.',      'marcado',   tattoo('Black & redwork', 'Antebraço', '10 a 20 cm', 'Retoque do vermelho da serpente'), [], 0, 0, false, -4],
    ['peter', 'sessao-media',   dia(-5), '10:00', 'Paulo R.',    'concluido', tattoo('Black & redwork', 'Antebraço', '10 a 20 cm', 'Caveira e ampulheta em preto e vermelho'), [], 90000, 20000, true, -14],
    ['peter', 'flash',          dia(-8), '13:00', 'Nanda G.',    'concluido', tattoo('Autoral', 'Braço', '10 a 20 cm', 'Flash de rosa com punhal'), [], 50000, 10000, true, -16],
    ['peter', 'orcamento',      dia(-2), '15:00', 'Igor V.',     'recusado',  tattoo('Colorido', 'Costas', 'Fechamento (braço, perna ou costas)', 'Costas fechadas coloridas, mas só posso no domingo'), [], 0, 0, false, -5]
  ];
  // só entra quem está na equipe do config
  L = L.filter(function (x) { return !CFG.artistas || !CFG.artistas.length || CFG.artistas.some(function (a) { return a.slug === x[0]; }); });

  var ocupado = {};
  var lista = L.map(function (x, i) {
    var s = SERV[x[1]] || { nome: x[1], duracao_min: 60 };
    var status = x[5] === 'concluido' ? 'concluido' : x[5] === 'recusado' ? 'cancelado' : 'confirmado';
    // se dois exemplos caírem no mesmo horário (dia fechado empurra a data), o segundo muda de dia
    var ini = min(x[3]), fimMin = ini + s.duracao_min, d = x[2], hoje = iso(new Date());
    if (status === 'confirmado') {
      for (var t = 0; t < 14; t++) {
        var livre = !(ocupado[x[0] + d] || []).some(function (o) { return ini < o[1] && fimMin > o[0]; });
        if (livre) break;
        d = outroDia(d, d < hoje ? -1 : 1);
      }
      (ocupado[x[0] + d] = ocupado[x[0] + d] || []).push([ini, fimMin]);
    }
    return {
      codigo: 'EX' + String(1001 + i), barbeiro_id: x[0], barbeiro: NOME[x[0]] || x[0],
      servico: s.nome, preco_centavos: 0, nome: x[4] + ' (exemplo)',
      telefone: '719000000' + String(10 + i), dia: d, inicio: hora(ini), fim: hora(fimMin),
      obs: x[6], status: status, anexos: x[7], exemplo: true,
      etapa: x[5], valor_centavos: x[8], sinal_centavos: x[9], sinal_pago: x[10], criado_em: criado(x[11])
    };
  });
  var bloqueios = [
    { id: 'b1', barbeiro_id: 'peter', data: dia(12), hora_inicio: '00:00', hora_fim: '23:59', motivo: 'Convenção (exemplo)' }
  ];
  try {
    localStorage.setItem(PFX + 'agendamentos_demo', JSON.stringify(lista));
    localStorage.setItem(PFX + 'bloqueios_demo', JSON.stringify(bloqueios));
    localStorage.removeItem(PFX + 'artistas_demo');
    localStorage.setItem(PFX + 'demo_semeado_v1', '1');   // o motor não semeia por cima
    localStorage.setItem(VERSAO, '1');
  } catch (e) {}
})();
