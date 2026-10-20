/* =====================================================================
   Peças da vitrine (capa e página do profissional) — não depende do motor.
   - cards da equipe (levam para artista.html?a=<slug>)
   - "Pedir orçamento com ...": abre o pedido já com o profissional escolhido
   - galeria (portfólio) com foto ampliada e navegação entre fotos
   - página do profissional: retrato, bio, especialidades, galeria
   Profissional sem foto usa o logo do estúdio; sem portfólio, entra
   um aviso discreto de "portfólio chegando".
   ===================================================================== */
(function () {
  'use strict';

  var CFG = window.TV;
  var LOGO = CFG.logo || 'fotos/logo.jpg';
  function $(s) { return document.querySelector(s); }
  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }
  function chama(a) { return a.apelido || a.nome; }
  function linkAgendar(a) { return 'index.html?artista=' + encodeURIComponent(a.slug) + '#agendar'; }
  function linkDossie(a) { return 'artista.html?a=' + encodeURIComponent(a.slug); }
  // @ que vale para contato: o do profissional ou, se o perfil dele não é confiável, o do estúdio
  function arrobaDe(a) { return a.direct || a.instagram || CFG.instagram; }

  var ano = $('#ano');
  if (ano) ano.textContent = new Date().getFullYear();
  if (CFG.modoDemo && $('#faixa-demo')) $('#faixa-demo').hidden = false;

  /* ---- ficha de personagem: retrato, classe, atributos, "selecionar" ---- */
  function cartaz(a, noDossie) {
    var c = el('article', 'ficha' + (a.foto ? '' : ' sem-foto'));
    var quadro = noDossie ? el('div', 'ficha-link') : el('a', 'ficha-link');
    if (!noDossie) { quadro.href = linkDossie(a); quadro.setAttribute('aria-label', 'Abrir a ficha de ' + a.nome); }
    var topo = el('span', 'ficha-topo');
    topo.appendChild(el('span', 'ficha-lv', a.nivel || 'LV ??'));
    topo.appendChild(el('span', 'ficha-classe', a.classe || a.oficio || 'Tatuador'));
    quadro.appendChild(topo);
    var foto = el('span', 'ficha-foto');
    var im = el('img');
    im.src = a.foto || LOGO;
    im.alt = a.foto ? 'Retrato de ' + a.nome : 'Portal da ' + CFG.nome;
    foto.appendChild(im);
    quadro.appendChild(foto);
    quadro.appendChild(el(noDossie ? 'span' : 'h3', 'ficha-nome', a.nome));
    if (a.atributos) {
      var ul = el('span', 'ficha-attrs');
      a.atributos.forEach(function (x) {
        var li = el('span', 'ficha-attr');
        li.appendChild(el('span', 'attr-nome', x[0]));
        var barra = el('span', 'attr-barra'); barra.style.setProperty('--v', x[1]);
        li.appendChild(barra);
        ul.appendChild(li);
      });
      quadro.appendChild(ul);
    }
    c.appendChild(quadro);
    var acoes = el('div', 'ficha-acoes');
    var emb = el('a', 'btn btn-start', 'Selecionar ' + chama(a));
    emb.href = linkAgendar(a);
    emb.setAttribute('data-embarcar', a.slug);
    acoes.appendChild(emb);
    if (!noDossie) {
      var dos = el('a', 'btn btn-linha', 'Ver ficha');
      dos.href = linkDossie(a);
      acoes.appendChild(dos);
    }
    c.appendChild(acoes);
    return c;
  }
  // slot de personagem bloqueado: a estrutura já espera mais artistas
  function slotVazio() {
    var c = el('article', 'ficha ficha-bloqueada');
    c.setAttribute('aria-label', 'Personagem bloqueado');
    var q = el('div', 'ficha-link');
    var topo = el('span', 'ficha-topo');
    topo.appendChild(el('span', 'ficha-lv', 'LV ??'));
    topo.appendChild(el('span', 'ficha-classe', 'Bloqueado'));
    q.appendChild(topo);
    q.appendChild(el('span', 'ficha-foto ficha-interroga', '?'));
    q.appendChild(el('span', 'ficha-nome', 'Novo aventureiro'));
    q.appendChild(el('span', 'ficha-txt', 'Este slot é liberado quando outro artista entrar na party.'));
    c.appendChild(q);
    return c;
  }
  var equipe = $('#lista-equipe');
  if (equipe) CFG.artistas.forEach(function (a) { equipe.appendChild(cartaz(a)); });
  if (equipe) for (var v = 0; v < (CFG.slotsVazios || 0); v++) equipe.appendChild(slotVazio());

  /* ---- "Quero tatuar" / "Quero um piercing" / "Pedir orçamento com ...":
     na capa, escolhe o profissional no pedido sem recarregar a página.
     Se o motor ainda não carregou, o próprio link (?artista=slug) resolve. ---- */
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('[data-embarcar]');
    if (!a || !$('#agendar-app') || !CFG.agendarCom || !CFG.barbeirosCarregados) return;
    ev.preventDefault();
    CFG.agendarCom(a.getAttribute('data-embarcar'));
    $('#agendar').scrollIntoView({ behavior: 'smooth' });
  });

  /* ---- link com âncora (?artista=peter#agendar): a página cresce depois de
     montar equipe, mural e pedido, então a rolagem do navegador erra o alvo ---- */
  window.addEventListener('load', function () {
    var alvo = location.hash.length > 1 && document.getElementById(location.hash.slice(1));
    if (alvo) setTimeout(function () { alvo.scrollIntoView(); }, 150);
  });

  /* ---- galeria + foto ampliada (setas e teclado passam as fotos) ---- */
  var lupa = null, serie = [], pos = 0;
  function mostra(i) {
    pos = (i + serie.length) % serie.length;
    var f = serie[pos];
    lupa.querySelector('.lupa-leg').textContent = f.alt;
    lupa.querySelector('.lupa-conta').textContent = (pos + 1) + ' / ' + serie.length;
    var im = lupa.querySelector('img');
    im.src = f.src; im.alt = f.alt;
  }
  function amplia(fotos, i) {
    if (!lupa) {
      lupa = el('dialog', 'lupa');
      var topo = el('div', 'lupa-topo');
      topo.appendChild(el('span', 'lupa-conta'));
      var x = el('button', 'btn btn-linha mini', 'Fechar');
      x.type = 'button';
      x.addEventListener('click', function () { lupa.close(); });
      topo.appendChild(x);
      lupa.appendChild(topo);
      var palco = el('div', 'lupa-palco');
      var ant = el('button', 'lupa-seta lupa-ant', '\u2039'); ant.type = 'button'; ant.setAttribute('aria-label', 'Foto anterior');
      var prox = el('button', 'lupa-seta lupa-prox', '\u203A'); prox.type = 'button'; prox.setAttribute('aria-label', 'Próxima foto');
      ant.addEventListener('click', function () { mostra(pos - 1); });
      prox.addEventListener('click', function () { mostra(pos + 1); });
      palco.appendChild(ant); palco.appendChild(el('img')); palco.appendChild(prox);
      lupa.appendChild(palco);
      lupa.appendChild(el('p', 'lupa-leg'));
      lupa.addEventListener('click', function (ev) { if (ev.target === lupa) lupa.close(); });
      lupa.addEventListener('keydown', function (ev) {
        if (ev.key === 'ArrowLeft') mostra(pos - 1);
        if (ev.key === 'ArrowRight') mostra(pos + 1);
      });
      document.body.appendChild(lupa);
    }
    serie = fotos;
    lupa.classList.toggle('lupa-uma', fotos.length < 2);
    mostra(i);
    if (lupa.showModal) lupa.showModal(); else window.open(fotos[i].src, '_blank');
  }
  function mural(alvo, fotos) {
    fotos.forEach(function (f, i) {
      var fig = el('figure');
      var b = el('button', 'foto-btn');
      b.type = 'button';
      b.setAttribute('aria-label', 'Ampliar: ' + f.alt);
      var im = el('img'); im.src = f.src; im.alt = f.alt; im.loading = 'lazy';
      if (f.pos) im.style.objectPosition = f.pos;
      b.appendChild(im);
      b.addEventListener('click', function () { amplia(fotos, i); });
      fig.appendChild(b);
      fig.appendChild(el('figcaption', null, f.alt));
      alvo.appendChild(fig);
    });
  }
  // capa: uma amostra das peças de quem tem portfólio
  var amostra = $('#mural-capa');
  if (amostra) {
    var todas = [];
    CFG.artistas.forEach(function (a) { if (!a.perfuracao) todas = todas.concat(a.fotos || []); });
    mural(amostra, todas.slice(0, +amostra.getAttribute('data-max') || 8));
  }
  // peças do perfil do estúdio
  var doEstudio = $('#mural-estudio');
  if (doEstudio && CFG.galeriaEstudio) mural(doEstudio, CFG.galeriaEstudio);
  // galeria de um profissional em qualquer página: <div data-galeria="slug">
  Array.prototype.forEach.call(document.querySelectorAll('[data-galeria]'), function (g) {
    var dono = CFG.artistaPor(g.getAttribute('data-galeria'));
    if (dono) mural(g, (dono.fotos || []).slice(0, +g.getAttribute('data-max') || 99));
  });

  /* ---- botão flutuante some quando o pedido já está na tela ---- */
  /* (e também enquanto os dois caminhos da capa estão visíveis) */
  var flutua = $('.flutua'), agendar = $('#agendar');
  if (flutua) {
    var aVista = {};
    // no topo a capa já tem o próprio botão: o flutuante só entra depois da primeira tela
    var atualiza = function () {
      flutua.hidden = window.scrollY < window.innerHeight * 0.8 ||
        Object.keys(aVista).some(function (k) { return aVista[k]; });
    };
    if ('IntersectionObserver' in window) {
      var olheiro = new IntersectionObserver(function (es) {
        es.forEach(function (e) { aVista[e.target.id || 'capa'] = e.isIntersecting; });
        atualiza();
      }, { threshold: 0.05 });
      if (agendar) olheiro.observe(agendar);
      if ($('.caminhos')) olheiro.observe($('.caminhos'));
    }
    window.addEventListener('scroll', atualiza, { passive: true });
    atualiza();
  }

  /* ---- mapa ---- */
  var mapa = $('#mapa');
  if (mapa && CFG.endereco.embed) {
    var ifr = el('iframe');
    ifr.src = CFG.endereco.embed; ifr.loading = 'lazy'; ifr.title = 'Mapa: ' + CFG.endereco.busca;
    ifr.referrerPolicy = 'no-referrer-when-downgrade';
    mapa.appendChild(ifr);
  }

  /* ---- página do profissional ---- */
  var pagina = $('#artista-pagina');
  if (!pagina) return;
  var slug = new URLSearchParams(location.search).get('a') || (location.hash.match(/^#\/([\w-]+)/) || [])[1];
  var a = slug && CFG.artistaPor(slug);
  if (!a) {
    $('#art-nao-achei').hidden = false;
    return;
  }
  var piercing = !!a.perfuracao;
  var temFotos = !!(a.fotos && a.fotos.length);
  document.title = a.nome + ' · ' + CFG.nome;

  $('#art-cartaz').appendChild(cartaz(a, true));
  $('#art-nome').textContent = a.nome;
  var arroba = $('#art-arroba');
  arroba.textContent = (a.direct ? 'Contato pelo @' : '@') + arrobaDe(a);
  arroba.href = 'https://www.instagram.com/' + arrobaDe(a) + '/';
  $('#art-linha').textContent = a.linha;
  if (a.frase) { $('#art-frase').textContent = '“' + a.frase + '”'; $('#art-frase').hidden = false; }
  if (a.bio && a.bio.length) {
    var bio = $('#art-bio');
    a.bio.forEach(function (l) { bio.appendChild(el('li', null, l)); });
    $('#art-sobre').hidden = false;
  }
  var est = $('#art-estilos');
  (a.estilos || []).forEach(function (e) { est.appendChild(el('span', null, e)); });

  var rotulo = piercing ? 'Agendar piercing com ' + chama(a) : (CFG.rotuloPedir || 'Pedir orçamento com ') + chama(a);
  var pedir = $('#art-pedir');
  pedir.textContent = rotulo;
  pedir.href = linkAgendar(a);
  var pedir2 = $('#art-pedir-2');
  if (pedir2) { pedir2.textContent = rotulo; pedir2.href = pedir.href; }
  var fl = $('#art-flutua');
  if (fl) { fl.href = pedir.href; fl.textContent = piercing ? 'Agendar com ' + chama(a) : (CFG.rotuloPedirCurto || 'Orçamento com ') + chama(a); }

  if (a.linkOrcamento) {
    var lo = el('a', 'btn btn-linha', 'Link de orçamento da bio');
    lo.href = a.linkOrcamento; lo.target = '_blank'; lo.rel = 'noopener';
    $('#art-extras').appendChild(lo);
  }
  var sg = $('#art-seguidores');
  if (sg && a.seguidores) { sg.textContent = a.seguidores + ' seguidores no Instagram'; sg.hidden = false; }
  // piercing: regiões e joias que dá para escolher no pedido
  var pc = $('#art-piercing');
  if (pc && piercing && CFG.piercing) {
    CFG.piercing.regioes.forEach(function (r) { $('#art-regioes').appendChild(el('span', null, r)); });
    CFG.piercing.joias.forEach(function (r) { $('#art-joias').appendChild(el('span', null, r)); });
    pc.hidden = false;
  }
  // atributos (ficha de personagem), quando o config traz
  var at = $('#art-atributos');
  if (at && a.atributos) {
    a.atributos.forEach(function (x) {
      var li = el('li');
      li.appendChild(el('span', 'attr-nome', x[0]));
      var barra = el('span', 'attr-barra'); barra.style.setProperty('--v', x[1]);
      li.appendChild(barra);
      at.appendChild(li);
    });
    at.hidden = false;
  }
  if (a.whatsapp) {
    var z = el('a', 'btn btn-zap', 'WhatsApp ' + (a.whatsappVisivel || ''));
    z.href = 'https://wa.me/' + a.whatsapp; z.target = '_blank'; z.rel = 'noopener';
    $('#art-extras').appendChild(z);
  }

  $('#art-port-titulo').textContent = (piercing ? 'Joias e projetos de ' : (CFG.rotuloGaleria || 'Galeria de ')) + chama(a);
  var mais = $('#art-mais');
  if (temFotos) {
    mural($('#art-portfolio'), a.fotos);
    mais.href = 'https://www.instagram.com/' + arrobaDe(a) + '/';
    mais.textContent = 'Ver mais no @' + arrobaDe(a);
  } else {
    // sem portfólio ainda: aviso discreto no lugar do mural
    $('#art-portfolio').hidden = true;
    mais.hidden = true;
    var vazio = $('#art-sem-fotos');
    vazio.querySelector('img').src = LOGO;
    vazio.querySelector('p').textContent = 'As peças de ' + chama(a) + ' entram aqui em breve. Enquanto isso, é só chamar o estúdio no Direct.';
    var dm = vazio.querySelector('a');
    dm.href = 'https://ig.me/m/' + arrobaDe(a);
    dm.textContent = 'Chamar @' + arrobaDe(a);
    vazio.hidden = false;
  }

  var outros = $('#lista-outros');
  CFG.artistas.forEach(function (o) { if (o.slug !== a.slug) outros.appendChild(cartaz(o)); });

  // compartilhar a página (link direto do profissional)
  var comp = $('#art-compartilhar'), saida = $('#art-compartilhado');
  comp.addEventListener('click', function () {
    var url = location.origin + location.pathname + '?a=' + a.slug;
    if (navigator.share) {
      navigator.share({ title: a.nome + ' · ' + CFG.nome, url: url }).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () { saida.textContent = 'Link copiado.'; },
        function () { saida.textContent = url; });
    } else { saida.textContent = url; }
  });
  pagina.hidden = false;
})();
