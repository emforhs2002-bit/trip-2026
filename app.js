/* 시드니에서 멜버른까지 — 렌더러
 * trip.js(일정) · photos.js(사진) · map.js(해안선)를 읽어 페이지를 만든다.
 */
(() => {
  "use strict";
  const T = window.TRIP, P = window.PHOTOS, M = window.MAP, PL = window.PLACES;
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ── 아이콘 (24px 선 아이콘) ───────────────── */
  const ICONS = {
    plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
    hotel: '<path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 4v6"/><path d="M2 18h20"/>',
    train: '<path d="M8 3.1V7a4 4 0 0 0 8 0V3.1"/><path d="m9 15-1-1"/><path d="m15 15 1-1"/><path d="M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z"/><path d="m8 19-2 3"/><path d="m16 19 2 3"/>',
    walk: '<circle cx="13.5" cy="4" r="2"/><path d="M13 8.5 10.5 13l3 3v5"/><path d="M10.5 13 8.5 21"/><path d="M8 11.5l3-3.2 2.5.4 2 3 3 1"/>',
    ferry: '<path d="M2 20c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0"/><path d="M4.5 17 3 12h18l-1.5 5"/><path d="M6 12V8h12v4"/><path d="M12 4v4"/><path d="M9 10h.01M12 10h.01M15 10h.01"/>',
    car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
    food: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    coffee: '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M6 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/>',
    camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3.5"/>',
    market: '<path d="M4 10v10h16V10"/><path d="M2 10 4 4h16l2 6z"/><path d="M9 20v-5h6v5"/><path d="M2 10c0 1.7 1.3 3 3.3 3S8.7 11.7 8.7 10c0 1.7 1.3 3 3.3 3s3.3-1.3 3.3-3c0 1.7 1.4 3 3.4 3S22 11.7 22 10"/>',
    shop: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    koala: '<circle cx="12" cy="13.5" r="6.5"/><circle cx="5.2" cy="7.5" r="3.2"/><circle cx="18.8" cy="7.5" r="3.2"/><path d="M12 12.5c-1.2 0-1.8 1.2-1.8 2.3 0 1.2.8 2.2 1.8 2.2s1.8-1 1.8-2.2c0-1.1-.6-2.3-1.8-2.3z"/><path d="M9 11.5h.01M15 11.5h.01"/>',
    penguin: '<path d="M12 3c-3 0-4.5 3-4.5 7 0 4-2 6.5-2 9.5h13c0-3-2-5.5-2-9.5 0-4-1.5-7-4.5-7z"/><path d="M10.5 6.5h.01"/><path d="M12.5 7.5l2 .8-2 .8"/><path d="M9 19.5v2M15 19.5v2"/>',
    mountain: '<path d="M8 3l4 8 5-5 5 15H2z"/><path d="M4.1 15.6 8 11l2.3 2"/>',
    cable: '<path d="M2 3.5 22 7"/><path d="M12 5.3V10"/><rect x="6.5" y="10" width="11" height="10" rx="2"/><path d="M6.5 14.5h11"/><path d="M12 10v4.5"/>',
    beach: '<path d="M2 20.5c2 1 4 1 6 0s4-1 6 0 4 1 6 0"/><path d="M13.5 4.2a8 8 0 0 1 7.4 8.3L4.6 8.4a8 8 0 0 1 8.9-4.2z"/><path d="m12.7 10.4-2.9 7.9"/>',
    bridge: '<path d="M2 18h20"/><path d="M2 13c3.5-6.5 16.5-6.5 20 0"/><path d="M5 18v-7.2M19 18v-7.2"/><path d="M8.5 18V9.2M12 18V8.6M15.5 18V9.2"/>',
    building: '<path d="M3 21h18"/><path d="M5 21V10M9.7 21V10M14.3 21V10M19 21V10"/><path d="M2 10l10-6 10 6z"/>',
    library: '<path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2z"/><path d="M22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/>',
    sunset: '<path d="M12 10V2"/><path d="m4.9 10.9 1.4 1.4"/><path d="M2 18h2M20 18h2"/><path d="m17.7 12.3 1.4-1.4"/><path d="M22 22H2"/><path d="M16 18a4 4 0 0 0-8 0"/><path d="m16 6-4 4-4-4"/>',
    night: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    flag: '<path d="M4 22V4"/><path d="M4 4h13l-2.5 4.5L17 13H4"/>',
    pin: '<path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
    temple: '<path d="M12 2v2.5"/><path d="M5 7.5h14l-2.5-3h-9z"/><path d="M7 7.5V11h10V7.5"/><path d="M3.5 14h17L18 11H6z"/><path d="M6 14v7h12v-7"/><path d="M3 21h18"/><path d="M10.5 21v-4h3v4"/>',
    arrow: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
    out: '<path d="M7 17 17 7"/><path d="M8 7h9v9"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
  };
  const ic = (n) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ICONS.pin}</svg>`;

  const REGION = {
    sydney: "시드니", mountain: "블루마운틴", coast: "남동 해안", ocean: "그레이트오션로드",
    melbourne: "멜버른", saigon: "호치민 경유", home: "귀국",
  };
  const DOW_EN = { 월: "MON", 화: "TUE", 수: "WED", 목: "THU", 금: "FRI", 토: "SAT", 일: "SUN" };

  /* ── 사진 ─────────────────────────────────── */
  function img(id, sizes, eager) {
    const p = P[id];
    if (!p) return "";
    const sw = Math.round(p.w / 2);
    return `<img src="img/${id}-S.webp" srcset="img/${id}-S.webp ${sw}w, img/${id}-L.webp ${p.w}w" sizes="${sizes}"
      width="${p.w}" height="${p.h}" alt="${esc(p.name)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  }

  /* ── 지도 ─────────────────────────────────── */
  const pr = ([lat, lon]) => [(lon - M.lon0) * M.kx, (M.lat0 - lat) * M.ky];
  function smooth(pts) {
    if (pts.length < 2) return "";
    let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const k = 8; // 6이면 표준 캣멀-롬, 클수록 덜 부푼다
      const c1 = [p1[0] + (p2[0] - p0[0]) / k, p1[1] + (p2[1] - p0[1]) / k];
      const c2 = [p2[0] - (p3[0] - p1[0]) / k, p2[1] - (p3[1] - p1[1]) / k];
      d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
  }
  const BORDER = [[-37.505, 149.976], [-36.8, 148.2], [-36.19, 147.89], [-36.08, 146.92], [-35.92, 145.65], [-36.13, 144.75], [-35.34, 143.56], [-34.6, 142.7], [-34.0, 141.0]];
  const STAYS = ["syd", "chatswood", "nowra", "traralgon", "apollo", "melb"];
  const MAP_LABELS = [
    ["syd", "시드니", "r"], ["katoomba", "블루마운틴", "l"], ["nowra", "나우라", "r"], ["eden", "에덴", "r"],
    ["lakes", "레이크스 엔트런스", "b"], ["traralgon", "트랄라곤", "t"], ["melb", "멜버른", "t"],
    ["apollo", "아폴로 베이", "b"], ["apostles", "12사도", "l"], ["phillip", "필립아일랜드", "r"],
  ];
  const WATER = [[151.1, -36.6, "TASMAN SEA", "sea"], [147.9, -38.95, "BASS STRAIT", "sea"], [147.3, -34.55, "NEW SOUTH WALES", "state"], [144.4, -36.95, "VICTORIA", "state"]];

  function mapHTML(focusDay) {
    const days = T.days.filter((d) => d.path);
    let vb = [0, 0, M.w, M.h];
    if (focusDay) {
      const pts = focusDay.path.map(pr);
      let x0 = Math.min(...pts.map((p) => p[0])), x1 = Math.max(...pts.map((p) => p[0]));
      let y0 = Math.min(...pts.map((p) => p[1])), y1 = Math.max(...pts.map((p) => p[1]));
      let w = Math.max(x1 - x0 + 110, 240), h = Math.max(y1 - y0 + 90, w * 0.62);
      w = Math.max(w, h / 0.62);
      vb = [(x0 + x1) / 2 - w / 2, (y0 + y1) / 2 - h / 2, w, h];
    }
    const pct = (x, y) => `left:${(((x - vb[0]) / vb[2]) * 100).toFixed(2)}%;top:${(((y - vb[1]) / vb[3]) * 100).toFixed(2)}%`;
    const segs = days.map((d) => {
      const dd = smooth(d.path.map(pr));
      const dim = focusDay && d !== focusDay ? " dim" : "";
      return `<g class="r-${d.region}"><path class="m-seg-bg" d="${dd}"/><path class="m-seg${dim}" d="${dd}"/></g>`;
    });
    if (focusDay) { // 선택한 날의 구간이 맨 위에 오도록
      const i = days.indexOf(focusDay);
      segs.push(segs.splice(i, 1)[0]);
    }
    const labelIds = focusDay ? focusDay.route : MAP_LABELS.map((l) => l[0]);
    const labels = [];
    const dots = [];
    const seen = new Set();
    labelIds.forEach((id) => {
      if (seen.has(id) || !PL[id]) return;
      seen.add(id);
      const [x, y] = pr([PL[id].lat, PL[id].lon]);
      const def = MAP_LABELS.find((l) => l[0] === id);
      const side = (focusDay && PL[id].side) || (def ? def[2] : "r");
      const name = def && !focusDay ? def[1] : PL[id].name;
      dots.push(`<span class="md${STAYS.includes(id) ? " stay" : ""}" style="${pct(x, y)}"></span>`);
      labels.push(`<span class="ml ${side}" style="${pct(x, y)}">${esc(name)}</span>`);
    });
    const water = focusDay ? "" : WATER.map(([lon, lat, t, c]) => {
      const [x, y] = pr([lat, lon]);
      return `<span class="mw ${c}" style="${pct(x, y)}">${t}</span>`;
    }).join("");
    const ratio = `${vb[2].toFixed(1)} / ${vb[3].toFixed(1)}`;
    const sw = (focusDay ? 1.6 : 1.2);
    return `<div class="mapc" style="aspect-ratio:${ratio}">
      <svg viewBox="${vb.map((v) => v.toFixed(1)).join(" ")}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path class="m-land" d="${M.land}" vector-effect="non-scaling-stroke" style="stroke-width:${sw}"/>
        <path class="m-border" d="${smooth(BORDER.map(pr))}" vector-effect="non-scaling-stroke"/>
        ${segs.join("")}
      </svg>${water}${dots.join("")}${labels.join("")}</div>`;
  }

  /* ── 페이지 조각 ──────────────────────────── */
  const pages = [];
  const add = (id, label, region, html, cls = "") => pages.push({ id, label, region, html: `<section class="page r-${region} ${cls}" id="${id}" aria-label="${esc(label)}">${html}</section>` });

  // 표지
  add("cover", "표지", "sydney", `
    <figure class="cover-photo">${img(T.coverPhoto, "100vw", true)}</figure>
    <div class="cover-body">
      <div class="gsign">
        <p class="cover-kicker">${esc(T.kicker)}</p>
        <div class="gsign-roads"><span class="shield">A32</span><span class="shield">A1</span><span class="shield">M1</span><span class="shield">B100</span></div>
        <h1 class="cover-title">시드니에서<br>멜버른까지</h1>
        <div class="cover-arrow"><span class="num">${esc(T.period)}</span>${ic("arrow")}</div>
        <div class="cover-meta"><span>11일</span><span>·</span><span>${esc(T.party)}</span><span>·</span><span>렌터카 해안 종주</span></div>
      </div>
      <p class="cover-tag">${esc(T.tagline)}</p>
      <button class="cover-go" data-go="1">넘겨서 일정 보기 ${ic("arrow")}</button>
    </div>`, "cover");

  // 한눈에
  const regionsUsed = [...new Set(T.days.map((d) => d.region))];
  add("overview", "지도", "sydney", `<div class="wrap">
    <p class="eyebrow">Route · 11 days</p>
    <h2 class="h-page">한눈에 보는 11일</h2>
    <p class="lead">시드니에서 블루마운틴을 넘고 남쪽 해안을 따라 내려가 멜버른까지. 마지막 이틀은 호치민을 거쳐 인천으로 돌아온다.</p>
    <div class="overview-grid">
      <div class="map-box">${mapHTML(null)}
        <div class="map-legend">${regionsUsed.filter((r) => !["saigon", "home"].includes(r)).map((r) => `<span class="r-${r}"><i></i>${REGION[r]}</span>`).join("")}<span><b class="md-key"></b>숙박지</span></div>
      </div>
      <ol class="day-index">${T.days.map((d, i) => `<li class="r-${d.region}"><button data-go="${i + 2}">
        <span class="di-no">D${d.n}<small>${d.date}</small></span>
        <span class="di-title">${esc(d.title)}<span class="di-stay">${esc(d.stay)}</span></span>${ic("arrow").replace("<svg", '<svg class="di-arrow"')}</button></li>`).join("")}</ol>
    </div></div>`);

  // 날짜별
  const PILL = { "바로 가기": "go", "시간 남으면": "maybe", "줄 길면 패스": "skip", "저녁 후보": "dinner", "예약 완료": "booked" };
  const moveIcon = (s) => /도보/.test(s) && !/트램|메트로|경전철|버스/.test(s) ? "walk" : /페리/.test(s) ? "ferry" : /메트로|전철|경전철|트램|버스|대중교통/.test(s) ? "train" : "car";
  const [monthOf, dayOf] = [(d) => d.date.split(".")[0], (d) => d.date.split(".")[1]];

  T.days.forEach((d) => {
    const photos = d.photos.filter((id) => P[id]);
    const heroP = P[d.hero];
    const stats = `<div class="gsign">
      ${d.roads ? `<div class="gsign-roads">${d.roads.map(([no, nm]) => `<span class="road"><span class="shield">${no}</span>${esc(nm)}</span>`).join("")}</div>` : ""}
      <dl class="gsign-rows">${d.stats.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl></div>`;
    const route = `<ol class="route">${d.highlights.map(([t, i, n]) => `<li><span class="ic">${ic(i)}</span><span class="t">${esc(t)}</span><span class="n">${esc(n)}</span></li>`).join("")}</ol>`;
    const mosaic = photos.length ? `<section class="sec"><h3 class="sec-h">미리 보는 풍경</h3><div class="mosaic">${photos.map((id, k) =>
      `<figure>${img(id, k === 0 ? "(min-width:1000px) 640px, 100vw" : "(min-width:1000px) 320px, 50vw")}<figcaption>${esc(P[id].name)}</figcaption></figure>`).join("")}</div></section>` : "";
    const mini = d.path && d.path.length > 2 ? `<section class="sec"><h3 class="sec-h">오늘 달리는 길 <small>대략적인 경로</small></h3><div class="minimap">${mapHTML(d)}</div></section>` : "";
    const feat = d.feature ? `<section class="sec"><div class="feature"><h4>${esc(d.feature.title)}</h4><p class="sub">${esc(d.feature.sub)}</p>
      <ol class="steps">${d.feature.steps.map(([i, t, s], k) => `<li><div class="top"><span class="no">${k + 1}</span>${esc(t)}${ic(i)}</div><p>${esc(s)}</p></li>`).join("")}</ol>
      ${d.feature.foot ? `<p class="foot">${esc(d.feature.foot)}</p>` : ""}</div></section>` : "";
    const eats = d.eats.length ? `<section class="sec"><h3 class="sec-h">근처에서 골라 가기 <small>누르면 지도</small></h3><ul class="eats">${d.eats.map(([k, n, m, w, u]) =>
      `<li><a href="${esc(u)}" target="_blank" rel="noopener"><span class="pill ${PILL[k] || "maybe"}">${esc(k)}</span><span class="e-name">${esc(n)} <span class="e-menu">· ${esc(m)}</span></span>${ic("out").replace("<svg", '<svg class="out"')}<span class="e-when">${esc(w)}</span></a></li>`).join("")}</ul></section>` : "";
    const notes = d.notes.length ? `<section class="sec"><h3 class="sec-h">기억할 것</h3><ul class="notes">${d.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul></section>` : "";
    const sched = `<section class="sec"><details class="sched"><summary>상세 시간표 <small>${d.schedule.filter((r) => r[0] !== "→").length}개 일정</small>${ic("down")}</summary><ol class="tt">${d.schedule.map(([t, w, tip]) => t === "→"
      ? `<li class="mv"><span class="tm">${ic(moveIcon(w + tip))}</span><span class="wh">${esc(w)}</span><span class="tp">${esc(tip)}</span></li>`
      : `<li><span class="tm">${esc(t)}</span><span class="wh">${esc(w)}</span><span class="tp">${esc(tip)}</span></li>`).join("")}</ol></details></section>`;
    const links = d.links ? `<section class="sec"><h3 class="sec-h">공식 안내</h3><div class="links">${d.links.map(([t, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}${ic("out")}</a>`).join("")}</div></section>` : "";

    add(`day${d.n}`, `D${d.n}`, d.region, `<article class="day">
      <div class="day-photo">${img(d.hero, "(min-width:1000px) 44vw, 100vw")}
        <div class="day-sign"><span class="d"><small>DAY</small>${String(d.n).padStart(2, "0")}</span><span class="dt">${d.date} ${DOW_EN[d.dow]}</span><span class="rg">${REGION[d.region]}</span></div>
        ${d.badge ? `<span class="badge-team">${esc(d.badge)}</span>` : ""}
        ${heroP ? `<span class="photo-cap">${esc(heroP.name)}</span>` : ""}
      </div>
      <div class="day-body">
        <p class="eyebrow">${monthOf(d)}월 ${dayOf(d)}일 ${d.dow}요일</p>
        <h2 class="day-title">${esc(d.title)}</h2>
        <p class="stay">${ic("hotel")}<span>오늘 밤 · <b>${esc(d.stay)}</b></span></p>
        <div class="day-top">${d.warn ? `<div class="warn"><span class="diamond"><span>!</span></span>${esc(d.warn)}</div>` : ""}${stats}</div>
        <section class="sec"><h3 class="sec-h">오늘의 동선 <small>핵심 ${d.highlights.length}곳</small></h3>${route}</section>
        ${mosaic}${mini}${feat}${eats}${notes}${sched}${links}
      </div></article>`);
  });

  // 숙소
  add("stays", "숙소", "home", `<div class="wrap">
    <p class="eyebrow">Stays</p><h2 class="h-page">숙소만 한눈에</h2>
    <p class="lead">시드니부터 아폴로 베이까지는 예약 완료. 멜버른만 아직 예약 전이다.</p>
    <ul class="stays">${T.stays.map(([dt, nm, ad, memo, st]) => `<li>
      <div class="sd"><span class="dates">${esc(dt)}</span><span class="status ${st}">${st === "done" ? "예약 완료" : "예약 전"}</span></div>
      <h3>${esc(nm)}</h3><span class="addr">${esc(ad)}</span><span class="memo">${esc(memo)}</span>
      <a class="maplink" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(ad)}" target="_blank" rel="noopener">${ic("pin")}지도에서 보기</a></li>`).join("")}</ul></div>`);

  // 준비
  const groups = [...new Set(T.checklist.map((c) => c[0]))];
  add("prep", "준비", "home", `<div class="wrap">
    <p class="eyebrow">Before you go</p><h2 class="h-page">출발 전 체크리스트</h2>
    <p class="lead">체크한 항목은 이 기기에 저장된다.</p>
    ${groups.map((g) => `<div class="check-group"><h3><span class="shield">${g.replace("순위", "")}</span>${g}</h3><ul class="checks">${T.checklist.map((c, i) => c[0] !== g ? "" :
      `<li><label><input type="checkbox" data-ck="${i}"><span class="k">${esc(c[1])}</span><span class="x">${esc(c[2])}</span></label></li>`).join("")}</ul></div>`).join("")}
    <section class="sec"><h3 class="sec-h">날짜별로 꼭 기억할 것</h3><ul class="remember">${T.remember.map(([d, t]) => `<li><span class="num">${esc(d)}</span><span>${esc(t)}</span></li>`).join("")}</ul></section>
    <section class="sec"><div class="warn"><span class="diamond"><span>!</span></span>${esc(T.finalCheck)}</div></section>
  </div>`);

  // 출처
  add("credits", "출처", "home", `<div class="wrap">
    <p class="eyebrow">Credits</p><h2 class="h-page">사진과 자료 출처</h2>
    <p class="lead">사진은 모두 위키미디어 공용의 자유 라이선스 사진이다. 지도는 Natural Earth(퍼블릭 도메인), 글꼴은 Pretendard·Hahmlet·Overpass(SIL OFL), 아이콘 일부는 Lucide(ISC).</p>
    <section class="sec"><ul class="credits">${Object.values(P).map((p) => `<li><b>${esc(p.name)}</b> — ${esc(p.artist || "작가 미상")} · ${esc(p.license)} · <a href="${esc(p.page)}" target="_blank" rel="noopener">원본</a></li>`).join("")}</ul></section>
  </div>`);

  /* ── 조립 ─────────────────────────────────── */
  const pager = $("#pager"), chips = $("#chips"), bar = $(".bar"), prog = $("#progress");
  pager.innerHTML = pages.map((p) => p.html).join("");
  chips.innerHTML = pages.map((p, i) => `<button class="chip r-${p.region}" data-go="${i}">${/^D\d/.test(p.label) ? `<b>${p.label}</b>` : p.label}</button>`).join("");
  const chipEls = [...chips.children];
  const n = pages.length;
  let cur = -1;

  function setActive(i) {
    if (i === cur) return;
    cur = i;
    chipEls.forEach((c, k) => c.setAttribute("aria-current", k === i ? "true" : "false"));
    const c = chipEls[i];
    chips.scrollTo({ left: c.offsetLeft - chips.offsetLeft - chips.clientWidth / 2 + c.clientWidth / 2, behavior: "smooth" });
    const r = "r-" + pages[i].region;
    bar.className = "bar " + r;
    prog.parentElement.className = "progress " + r;
    prog.style.width = `${((i + 1) / n) * 100}%`;
    $("#prev").disabled = i === 0;
    $("#next").disabled = i === n - 1;
    history.replaceState(null, "", "#" + pages[i].id);
  }
  function go(i, smoothScroll = true) {
    i = Math.max(0, Math.min(n - 1, i));
    pager.scrollTo({ left: i * pager.clientWidth, behavior: smoothScroll ? "smooth" : "instant" });
    setActive(i);
  }
  let ticking = false;
  pager.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; setActive(Math.round(pager.scrollLeft / pager.clientWidth)); });
  }, { passive: true });
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-go]");
    if (b) go(+b.dataset.go);
  });
  $("#prev").onclick = () => go(cur - 1);
  $("#next").onclick = () => go(cur + 1);
  document.addEventListener("keydown", (e) => {
    if (e.target.closest("input, textarea") || e.altKey || e.metaKey || e.ctrlKey) return;
    if (e.key === "ArrowRight") { e.preventDefault(); go(cur + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(cur - 1); }
  });
  addEventListener("resize", () => go(cur, false));
  addEventListener("hashchange", () => {
    const i = pages.findIndex((p) => "#" + p.id === location.hash);
    if (i >= 0 && i !== cur) go(i);
  });
  const start = Math.max(0, pages.findIndex((p) => "#" + p.id === location.hash));
  requestAnimationFrame(() => go(start, false));

  /* 체크리스트 저장 (이 기기에만) */
  const KEY = "syd-mel-2026-check";
  let saved = [];
  try { saved = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (_) { /* 저장소 차단 */ }
  document.querySelectorAll("[data-ck]").forEach((el) => {
    el.checked = saved.includes(+el.dataset.ck);
    el.addEventListener("change", () => {
      const on = [...document.querySelectorAll("[data-ck]:checked")].map((x) => +x.dataset.ck);
      try { localStorage.setItem(KEY, JSON.stringify(on)); } catch (_) { /* 무시 */ }
    });
  });

  /* 오프라인 저장 (https 또는 로컬에서만 동작) */
  function toast(msg) {
    const t = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "status");
    t.textContent = msg;
    document.body.append(t);
    setTimeout(() => t.classList.add("hide"), 4200);
    setTimeout(() => t.remove(), 5000);
  }
  if ("serviceWorker" in navigator && !/[?&]dev\b/.test(location.search) && (location.protocol === "https:" || location.hostname === "127.0.0.1" || location.hostname === "localhost")) {
    navigator.serviceWorker.register("sw.js").then(() => navigator.serviceWorker.ready).then(() => {
      let told = false;
      try { told = localStorage.getItem("syd-mel-offline") === "1"; localStorage.setItem("syd-mel-offline", "1"); } catch (_) { /* 무시 */ }
      if (!told) toast("오프라인 저장 완료 — 이제 인터넷이 끊겨도 이 가이드가 열려요");
    }).catch(() => { /* 등록 실패 시 온라인 전용으로 동작 */ });
  }

  /* 인쇄할 땐 시간표를 모두 펼친다 */
  addEventListener("beforeprint", () => document.querySelectorAll("details.sched").forEach((d) => (d.open = true)));
})();
