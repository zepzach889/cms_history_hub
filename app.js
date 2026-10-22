/* History Day Hub app code. You normally do not need to edit this file.
   Settings live in config.js. */
/* ===================== LESSONS ===================== */
const LESSONS = {
  1:{ learn:["A strong topic passes four tests: you care about it, it has a clear innovation that caused change, it's narrow enough, and you can find sources.","Narrow a big idea by adding a <strong>where</strong>, a <strong>when</strong>, and a <strong>what exactly</strong>.","Show change over time: Before → Innovation → After → So What?","Can you find 3 primary sources in about 30 minutes? If not, try your #2 idea.","<strong>No generative AI</strong> (like ChatGPT) for any part of your project, including topic ideas. See the Rules tab for what's allowed."],
      checks:["Brainstorm at least 4 ideas and pick a top 3","Narrow your topic with a funnel (where, when, what)","Fill in the theme connection","Find 3 primary sources","Choose a category and decide solo or group"], tools:["funnel","theme"] },
  2:{ learn:["Start with background (secondary) sources: textbook, encyclopedia, library books, museum or university websites.","Take short notes in your own words. Always write down the source first.","Fact questions (who, what, when, where) have one answer. Thinking questions (why, how) need evidence.","Your focus questions should be thinking questions. Pick one BIG question for your whole project."],
      checks:["Take notes from at least 2 background sources","Write the title and author for each source","Use your own words in your notes","Write 3–5 focus questions that start with why or how","Write one BIG question for your whole project"], tools:["questions"] },
  3:{ learn:["Primary sources were made during the time you're studying. Secondary sources were made later by someone studying it.","A translation of an old document still counts as primary.","Judge every source: Who made it? When? Why? Can I trust it?","Cite in MLA style. Annotations explain what the source is and how you used it."],
      checks:["List at least 8 sources","Include at least 3 primary sources","Follow the MLA patterns for each citation","Write an annotation in your own words for each source","Ask the 4 questions about your sources"], tools:["sort","cite"] },
  4:{ learn:["One idea per note card. Write the source number and page. Use quotation marks for exact words.","Tag notes B (Before), I (Innovation), or A (After), then sort them into an evidence map.","A thesis is an argument, not a topic or a fact. It names the innovation, the time and place, and the change."],
      checks:["Take research notes with source numbers and B/I/A tags","Fill in your evidence map with at least 2 pieces of evidence per section","Write at least two drafts of your thesis","Check your thesis with the Step 3 checklist"], tools:["notes","map","thesis"] },
  5:{ learn:["Every category tells the same story: Title, Thesis, Before, Innovation, After, So What?","Plan what the audience will see or hear in every section, not just the words.","Lock in your category and use its planner for the layout, site map, storyboard, scene plan, or outline."],
      checks:["Choose your final category and a title","Complete your project outline with evidence and visuals for every section","Fill in the planning pages in your category planner","Fill in your word or time budget"], tools:["count"] },
  6:{ learn:["A complete draft has every part, from start to finish. It doesn't have to be perfect.","Process paper (500 words max, no quotes or images) answers five questions: how you chose your topic and how it fits the theme, how you researched, how you created your project, your historical argument, and why your topic is significant.","Final bibliography: primary and secondary sources in separate lists, alphabetical, with annotations."],
      checks:["Finish every section of your project","Complete the final build checklist for your category","Make your title page","Write a full process paper draft (500 words or less)","Finish your annotated bibliography"], tools:["count","cite"] },
};

/* ===================== STORAGE ===================== */
const KEY = "nhd-hub-" + CONFIG.year;
let S = {};
try { S = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch(e) { S = {}; }
function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e) {} }
const get = (k, d) => (S[k] !== undefined ? S[k] : d);
const set = (k, v) => { S[k] = v; save(); };

/* ===================== HELPERS ===================== */
const $ = (s, r=document) => r.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const D = s => { const [y,m,d] = s.split("-").map(Number); return new Date(y, m-1, d); };
const today = () => { const t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); };
const fmt = (s, o={weekday:"long", month:"long", day:"numeric"}) => D(s).toLocaleDateString("en-US", o);
const daysUntil = s => Math.round((D(s) - today()) / 86400000);
function toast(msg){ const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast._t); toast._t = setTimeout(()=>t.classList.remove("show"), 1800); }
async function copyText(text, html){
  try {
    if (html && window.ClipboardItem) {
      await navigator.clipboard.write([new ClipboardItem({"text/html": new Blob([html],{type:"text/html"}), "text/plain": new Blob([text],{type:"text/plain"})})]);
    } else { await navigator.clipboard.writeText(text); }
    toast("Copied! Paste it into your Google Doc.");
  } catch(e) {
    const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); toast("Copied! Paste it into your Google Doc."); } catch(_) { toast("Copy didn't work. Select the text and copy it yourself."); }
    ta.remove();
  }
}

/* ===================== NAV + THEME ===================== */
function go(id){
  document.querySelectorAll("main > section").forEach(s => s.hidden = s.id !== id);
  document.querySelectorAll("nav button").forEach(b => b.setAttribute("aria-current", b.dataset.go === id ? "page" : "false"));
  try { history.replaceState(null, "", "#" + id); } catch(e) {}
  if (id === "mywork") renderMyWork();
  window.scrollTo(0,0);
}
document.querySelectorAll("nav button").forEach(b => b.addEventListener("click", () => go(b.dataset.go)));
(function theme(){
  const t = get("theme", null); if (t) document.documentElement.dataset.theme = t;
  $("#themeBtn").addEventListener("click", () => {
    const cur = document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const nxt = cur === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nxt; set("theme", nxt);
  });
})();

/* ===================== THIS WEEK ===================== */
function nextCheckpoint(){
  const done = get("stamps", {});
  return CONFIG.checkpoints.find(c => daysUntil(c.due) >= 0 && !done[c.n]) || CONFIG.checkpoints.find(c => daysUntil(c.due) >= 0) || null;
}
function currentWeek(){
  const t = today(); let cur = null;
  for (const w of CONFIG.weeks) { if (D(w.start) <= t) cur = w; }
  if (cur && (t - D(cur.start)) / 86400000 > 6) return null;
  return cur;
}
function renderStamps(){
  const done = get("stamps", {}); const nxt = nextCheckpoint();
  $("#stamps").innerHTML = CONFIG.checkpoints.map(c => `
    <button class="stamp ${done[c.n] ? "done" : ""} ${nxt && nxt.n === c.n && !done[c.n] ? "next" : ""}" data-n="${c.n}"
      aria-pressed="${!!done[c.n]}" aria-label="Checkpoint ${c.n}, ${esc(c.name)}, due ${fmt(c.due,{month:"short",day:"numeric"})}${done[c.n] ? ", finished" : ""}">
      <span class="ring"><span>${done[c.n] ? "✓" : c.n}</span></span>
      <span class="label">${esc(c.short)}</span>
      <span class="due">${fmt(c.due,{month:"short",day:"numeric"})}</span>
    </button>`).join("");
  $("#stamps").querySelectorAll(".stamp").forEach(b => b.addEventListener("click", () => {
    const d = get("stamps", {}); d[b.dataset.n] = !d[b.dataset.n]; set("stamps", d);
    renderStamps(); renderWeek(); renderCheckpoints();
    if (d[b.dataset.n]) toast(`Checkpoint ${b.dataset.n} stamped!`);
  }));
}
function renderWeek(){
  $("#announce").innerHTML = CONFIG.announcement ? `<div class="note"><strong>Announcement:</strong> ${esc(CONFIG.announcement)}</div>` : "";
  const t = today(); const nxt = nextCheckpoint(); const final = CONFIG.checkpoints[CONFIG.checkpoints.length-1];
  let html;
  if (t < D(CONFIG.startDate)) {
    html = `<h3>Coming soon</h3><p class="big-due">History Day starts ${fmt(CONFIG.startDate)}</p><p>Start thinking: what are you curious about in history? Anything counts.</p>`;
  } else if (!nxt) {
    html = `<h3>Drafts are in. Now make it better!</h3>
      <ul class="clean"><li><strong>February:</strong> get feedback and track it in your Feedback Log.</li><li><strong>Late Feb or early March:</strong> school showcase.</li><li><strong>March:</strong> final polish and state registration.</li><li><strong>April:</strong> Oregon History Day state contest.</li></ul>`;
  } else {
    const n = daysUntil(nxt.due);
    const when = n === 0 ? "Due today!" : n === 1 ? "Due tomorrow" : `Due in ${n} days`;
    const late = CONFIG.checkpoints.filter(c => daysUntil(c.due) < 0 && !get("stamps",{})[c.n]);
    html = `<h3>Next checkpoint</h3>
      <p class="big-due">${nxt.n}. ${esc(nxt.name)}</p>
      <p><strong>${when}</strong> (${fmt(nxt.due)}). Use ${esc(nxt.part)} of your workbook.</p>
      <div class="row"><button class="btn" data-open-cp="${nxt.n}">Open checkpoint ${nxt.n}</button>
      ${CONFIG.classroomLink ? `<a class="btn ghost" href="${esc(CONFIG.classroomLink)}" target="_blank" rel="noopener">Google Classroom</a>` : ""}</div>
      ${late.length ? `<div class="note warn" style="margin:1rem 0 0"><strong>Catch up:</strong> Checkpoint ${late.map(c=>c.n).join(" and ")} ${late.length>1?"are":"is"} past due and not stamped yet. Turn ${late.length>1?"them":"it"} in as soon as you can. Falling more than 2 checkpoints behind affects state eligibility.</div>` : ""}`;
  }
  $("#nextPanel").innerHTML = html;
  const w = currentWeek() || (t < D(CONFIG.startDate) ? CONFIG.weeks[0] : null);
  $("#labPanel").innerHTML = w ? `<h3>${t < D(CONFIG.startDate) ? "Coming up" : "This week"}</h3>
      <p class="muted" style="margin-bottom:.2rem">${t < D(CONFIG.startDate) ? "First week:" : "Week of"} ${fmt(w.start,{month:"long",day:"numeric"})}</p>
      <p><strong>Monday lab:</strong> ${esc(w.lab)}</p>
      <p><strong>Your job:</strong> ${esc(w.job)}</p>
      ${w.pages ? `<div class="note" style="margin:0"><strong>Can't make lab?</strong> Read these workbook pages instead: ${esc(w.pages)}.</div>` : ""}`
    : `<h3>This week</h3><p>No lab scheduled this week. Keep working on your project and use the Tools tab when you need help.</p>`;
  $("#nextPanel").querySelectorAll("[data-open-cp]").forEach(b => b.addEventListener("click", () => { go("checkpoints"); const d = document.getElementById("cp"+b.dataset.openCp); if (d) { d.open = true; d.scrollIntoView({block:"start"}); } }));
}

/* ===================== CHECKPOINTS ===================== */
const TOOLNAMES = { funnel:"Topic Funnel", theme:"Theme Connection", questions:"Question Upgrader", sort:"Primary or Secondary?", cite:"Citation Builder", notes:"Note Cards", map:"Evidence Map", thesis:"Thesis Builder", count:"Word and Time Counter" };
function renderCheckpoints(){
  const done = get("stamps", {}); const chk = get("cpchecks", {});
  $("#cpList").innerHTML = CONFIG.checkpoints.map(c => {
    const L = LESSONS[c.n];
    return `<details class="cp ${done[c.n] ? "isdone" : ""}" id="cp${c.n}">
      <summary><span class="cpnum">${done[c.n] ? "✓" : c.n}</span><span><span class="cptitle">${esc(c.name)}</span><br><span class="muted">Due ${fmt(c.due)} · ${esc(c.part)}</span></span></summary>
      <div class="cpbody">
        <h3>Quick lesson</h3><ul class="clean">${L.learn.map(x=>`<li>${x}</li>`).join("")}</ul>
        <h3>Self-check</h3>
        <div class="checks">${L.checks.map((x,i)=>`<label><input type="checkbox" data-cp="${c.n}" data-i="${i}" ${chk[c.n+"-"+i] ? "checked" : ""}> ${esc(x)}</label>`).join("")}</div>
        <h3 style="margin-top:.8rem">Helpful tools</h3>
        <div class="row">${L.tools.map(t=>`<button class="btn ghost small" data-tool="${t}">${TOOLNAMES[t]}</button>`).join("")}</div>
        <h3 style="margin-top:1rem">Turn it in</h3>
        <p>Turn in your ${esc(c.part)} checkpoint page${CONFIG.classroomLink ? ` on <a href="${esc(CONFIG.classroomLink)}" target="_blank" rel="noopener">Google Classroom</a>` : " on Google Classroom"} or on paper. Then come back and stamp your passport!</p>
      </div></details>`;
  }).join("");
  $("#cpList").querySelectorAll("input[type=checkbox]").forEach(cb => cb.addEventListener("change", () => {
    const c = get("cpchecks", {}); c[cb.dataset.cp+"-"+cb.dataset.i] = cb.checked; set("cpchecks", c);
  }));
  $("#cpList").querySelectorAll("[data-tool]").forEach(b => b.addEventListener("click", () => { go("tools"); openTool(b.dataset.tool); }));
}

/* ===================== TOOLS ===================== */
const TOOLS = {};
function openTool(id){
  set("lastTool", id);
  $("#toolNav").querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b.dataset.t === id));
  $("#toolArea").innerHTML = "";
  TOOLS[id]($("#toolArea"));
}
function bindFields(root, key, onChange){
  const data = get(key, {});
  root.querySelectorAll("[data-f]").forEach(el => {
    if (data[el.dataset.f] !== undefined) { if (el.type === "checkbox") el.checked = data[el.dataset.f]; else el.value = data[el.dataset.f]; }
    el.addEventListener("input", () => { const d = get(key, {}); d[el.dataset.f] = el.type === "checkbox" ? el.checked : el.value; set(key, d); onChange && onChange(); });
  });
  onChange && onChange();
}

/* --- Topic Funnel --- */
TOOLS.funnel = (el) => {
  el.innerHTML = `<div class="grid2"><div class="panel">
    <h3>Topic Funnel</h3><p class="muted">Start big, then add a where, a when, and a what exactly.</p>
    <div class="field"><label for="f1">Big idea</label><input type="text" id="f1" data-f="big" placeholder="Example: money"></div>
    <div class="field"><label for="f2">Narrower</label><input type="text" id="f2" data-f="n1" placeholder="Example: money in China"></div>
    <div class="field"><label for="f3">Narrower</label><input type="text" id="f3" data-f="n2" placeholder="Example: the invention of paper money in China"></div>
    <div class="field"><label for="f4">Focused topic</label><textarea id="f4" data-f="focus" placeholder="Example: How the Song dynasty's paper money changed trade in China, 1000s–1100s"></textarea></div>
    <div class="checks"><label><input type="checkbox" data-f="where"> My focused topic has a <strong>where</strong></label><label><input type="checkbox" data-f="when"> It has a <strong>when</strong></label><label><input type="checkbox" data-f="what"> It has a <strong>what exactly</strong></label></div>
    </div><div><div class="funnel" id="fv"></div><button class="btn" id="fcopy">Copy my funnel</button></div></div>`;
  const draw = () => { const d = get("funnel", {}); $("#fv").innerHTML = [d.big,d.n1,d.n2,d.focus].map((x,i)=>`<div>${esc(x) || `<span class="muted">${["Big idea","Narrower","Narrower","Focused topic"][i]}</span>`}</div>`).join(""); };
  bindFields(el, "funnel", draw);
  $("#fcopy").onclick = () => { const d = get("funnel", {}); copyText(`MY TOPIC FUNNEL\nBig idea: ${d.big||""}\nNarrower: ${d.n1||""}\nNarrower: ${d.n2||""}\nFocused topic: ${d.focus||""}`); };
};

/* --- Theme Connection --- */
TOOLS.theme = (el) => {
  const parts = [["before","Before","What was life like before? What problem did people have?"],["innov","The Innovation","What was new? Who created or spread it?"],["after","After","What changed, in the short term and the long term?"],["sowhat","So What?","Why does this matter in history? Why should people today care?"]];
  el.innerHTML = `<div class="panel"><h3>Theme Connection</h3><p class="muted">Write your best guess now. You'll fill in details as you research.</p>
    <div class="field"><label for="tt">My focused topic</label><input type="text" id="tt" data-f="topic"></div>
    ${parts.map(([k,l,h])=>`<div class="field"><label for="th-${k}">${l}</label><div class="hint">${h}</div><textarea id="th-${k}" data-f="${k}"></textarea></div>`).join("")}
    <button class="btn" id="tcopy">Copy my theme connection</button></div>`;
  bindFields(el, "theme");
  $("#tcopy").onclick = () => { const d = get("theme", {}); copyText(`THEME CONNECTION\nTopic: ${d.topic||""}\n` + parts.map(([k,l])=>`${l}: ${d[k]||""}`).join("\n")); };
};

/* --- Question Upgrader (rule-based, no AI) --- */
TOOLS.questions = (el) => {
  el.innerHTML = `<div class="grid2"><div class="panel">
    <h3>Question Upgrader</h3><p class="muted">Type a question. The tool checks how it starts and gives you ideas. <strong>You</strong> do the upgrading.</p>
    <div class="field"><label for="q1">My question</label><input type="text" id="q1" placeholder="Example: When was paper money invented?"></div>
    <div id="qfb"></div>
    <div class="field"><label for="q2">My upgraded question</label><input type="text" id="q2" placeholder="Rewrite it here using a question starter"></div>
    <button class="btn" id="qsave">Save to my focus questions</button></div>
    <div class="panel"><h3>My focus questions</h3><ol class="savedlist" id="qlist"></ol>
    <div class="field"><label for="qbig">My BIG question</label><textarea id="qbig" placeholder="The one question your whole project answers"></textarea></div>
    <button class="btn ghost" id="qcopy">Copy my questions</button></div></div>`;
  const starters = `<ul class="clean"><li>Why did ___ happen?</li><li>How did ___ change ___?</li><li>What problems did ___ solve? What new problems did it create?</li><li>Who benefited from ___? Who was hurt by it?</li><li>How did ___ influence people or ideas that came later?</li></ul>`;
  const check = () => {
    const q = $("#q1").value.trim().toLowerCase(); const fb = $("#qfb");
    if (!q) { fb.innerHTML = ""; return; }
    const first = q.split(/\s+/)[0]; const two = q.split(/\s+/).slice(0,2).join(" ");
    const change = /\b(change|changed|impact|influence|influenced|affect|affected|effect|led to|lead to)\b/.test(q);
    if (/^how (many|much|long|old|big|far)$/.test(two) || ["when","who","what","where","which","did","was","were","is","are","does"].includes(first)) {
      fb.innerHTML = `<div class="feedback try"><strong>That's a fact question.</strong> It probably has one short answer you can look up. Fact questions are great for background! For a focus question, try one of these starters:${starters}</div>`;
    } else if (first === "why" || first === "how") {
      fb.innerHTML = `<div class="feedback ok"><strong>That's a thinking question.</strong> ${change ? "It even connects to change. That's right on theme!" : "Can you connect it to <em>change</em>, <em>impact</em>, or <em>influence</em>? That ties it to the theme."}</div>`;
    } else {
      fb.innerHTML = `<div class="feedback try"><strong>Hmm, try starting with <em>why</em> or <em>how</em>.</strong> Those make thinking questions.${starters}</div>`;
    }
  };
  $("#q1").addEventListener("input", check);
  const list = () => { const qs = get("questions", []); $("#qlist").innerHTML = qs.length ? qs.map((q,i)=>`<li>${esc(q)} <button class="btn ghost small" data-del="${i}" aria-label="Remove question">Remove</button></li>`).join("") : `<p class="muted">Your saved questions show up here. Aim for 3–5.</p>`;
    $("#qlist").querySelectorAll("[data-del]").forEach(b => b.onclick = () => { const qs = get("questions", []); qs.splice(+b.dataset.del,1); set("questions", qs); list(); }); };
  $("#qsave").onclick = () => { const v = $("#q2").value.trim() || $("#q1").value.trim(); if (!v) return toast("Type a question first."); const qs = get("questions", []); qs.push(v); set("questions", qs); $("#q1").value = ""; $("#q2").value = ""; $("#qfb").innerHTML = ""; list(); toast("Saved!"); };
  $("#qbig").value = get("bigq", ""); $("#qbig").addEventListener("input", e => set("bigq", e.target.value));
  $("#qcopy").onclick = () => copyText(`MY FOCUS QUESTIONS\n${get("questions",[]).map((q,i)=>`${i+1}. ${q}`).join("\n")}\n\nMY BIG QUESTION\n${get("bigq","")}`);
  list();
};

/* --- Primary or Secondary? --- */
TOOLS.sort = (el) => {
  const items = [
    ["Hammurabi's law code, carved on a stone pillar around 1750 BCE","P","It was made during the time of ancient Babylon."],
    ["A 2018 encyclopedia article about ancient Babylon","S","It was written thousands of years later by someone studying the past."],
    ["A letter written by a Roman soldier in Britain around 100 CE","P","A person who lived then wrote it."],
    ["A TV documentary about how the pyramids were built","S","It was made recently to explain the past."],
    ["A clay pot made in ancient Greece","P","Artifacts made at the time are primary sources."],
    ["Your social studies textbook","S","Textbooks explain the past. They're secondary."],
    ["Ibn Battuta's travel journal from the 1300s, translated into English","P","A translation still counts as primary. The words come from the 1300s."],
    ["A museum website's article explaining a Ming dynasty vase","S","Tricky! The vase is primary, but the article about it was written recently."],
    ["A world map drawn in 1507","P","It shows what mapmakers believed in 1507."],
    ["A historian's book about the Silk Road, published in 2015","S","It was written long after, by someone studying the past."],
  ];
  const ans = get("sortAns", {});
  el.innerHTML = `<div class="panel"><h3>Primary or Secondary?</h3><p class="muted">Ask: <strong>when</strong> was it made, and <strong>who</strong> made it? Tap P or S.</p>
    <div id="sl">${items.map(([t],i)=>`<div class="sortitem"><span>${i+1}. ${esc(t)}</span><span class="ps" data-i="${i}"><button data-a="P">P</button> <button data-a="S">S</button></span><span class="why" id="why${i}"></span></div>`).join("")}</div>
    <p id="score" style="margin-top:.8rem;font-weight:700"></p><button class="btn ghost small" id="sreset">Start over</button></div>`;
  const paint = () => { let right = 0, tried = 0;
    items.forEach(([,a,why],i) => { const box = el.querySelector(`.ps[data-i="${i}"]`); const pick = get("sortAns",{})[i];
      box.querySelectorAll("button").forEach(b => { b.className = ""; if (pick && b.dataset.a === pick) b.className = pick === a ? "right" : "wrong"; });
      $("#why"+i).textContent = pick ? (pick === a ? "✓ " : "Not quite. ") + why : "";
      if (pick) { tried++; if (pick === a) right++; } });
    $("#score").textContent = tried ? `${right} out of ${tried} correct so far` : ""; };
  el.querySelectorAll(".ps button").forEach(b => b.onclick = () => { const a = get("sortAns", {}); a[b.parentElement.dataset.i] = b.dataset.a; set("sortAns", a); paint(); });
  $("#sreset").onclick = () => { set("sortAns", {}); paint(); };
  paint();
};

/* --- Citation Builder (MLA) --- */
const CITE = {
  book: { label:"Book", fields:[["last","Author last name"],["first","Author first name"],["title","Book title"],["trans","Translator (if any)"],["pub","Publisher"],["year","Year published"]],
    make:f=>[f.last?`${f.last}${f.first?", "+f.first:""}. `:"", ["i",f.title], f.title?". ":"", f.trans?`Translated by ${f.trans}, `:"", f.pub?`${f.pub}, `:"", f.year?`${f.year}.`:""] },
  website: { label:"Website or online article", fields:[["last","Author last name (if listed)"],["first","Author first name"],["page","Page or article title"],["site","Website name"],["date","Date published (if listed)"],["url","URL"],["acc","Date you looked at it","acc"]],
    make:f=>[f.last?`${f.last}${f.first?", "+f.first:""}. `:"", f.page?`"${f.page}." `:"", ["i",f.site], f.site?", ":"", f.date?`${f.date}, `:"", f.url?`${f.url}. `:"", f.acc?`Accessed ${f.acc}.`:""] },
  image: { label:"Image or artifact on a museum website", fields:[["title","Title or description of the object"],["year","Year it was made"],["museum","Museum name"],["city","City"],["site","Website name"],["url","URL"]],
    make:f=>[["i",f.title], f.title?". ":"", f.year?`${f.year}, `:"", f.museum?`${f.museum}, `:"", f.city?`${f.city}. `:"", ["i",f.site], f.site?", ":"", f.url?`${f.url}.`:""] },
  doc: { label:"Historical document online", fields:[["author","Author (if known)"],["title","Title of the document"],["year","Year it was written"],["coll","Collection or website name"],["url","URL"],["acc","Date you looked at it","acc"]],
    make:f=>[f.author?`${f.author}. `:"", f.title?`"${f.title}." `:"", f.year?`${f.year}. `:"", ["i",f.coll], f.coll?", ":"", f.url?`${f.url}. `:"", f.acc?`Accessed ${f.acc}.`:""] },
  video: { label:"Online video", fields:[["title","Video title"],["site","Website name (like YouTube)"],["by","Uploaded by"],["date","Date uploaded"],["url","URL"]],
    make:f=>[f.title?`"${f.title}." `:"", ["i",f.site], f.site?", ":"", f.by?`uploaded by ${f.by}, `:"", f.date?`${f.date}, `:"", f.url?`${f.url}.`:""] },
  interview: { label:"Interview you did", fields:[["last","Person's last name"],["first","Person's first name"],["you","Your name"],["date","Date of interview"]],
    make:f=>[f.last?`${f.last}${f.first?", "+f.first:""}. `:"", "Interview. ", f.you?`Conducted by ${f.you}, `:"", f.date?`${f.date}.`:""] },
  ency: { label:"Encyclopedia entry", fields:[["entry","Entry title"],["ency","Encyclopedia name"],["pub","Publisher"],["url","Year or URL"],["acc","Date you looked at it","acc"]],
    make:f=>[f.entry?`"${f.entry}." `:"", ["i",f.ency], f.ency?", ":"", f.pub?`${f.pub}, `:"", f.url?`${f.url}. `:"", f.acc?`Accessed ${f.acc}.`:""] },
};
function mlaToday(){ const d = new Date(); const m = ["Jan.","Feb.","Mar.","Apr.","May","June","July","Aug.","Sept.","Oct.","Nov.","Dec."][d.getMonth()]; return `${d.getDate()} ${m} ${d.getFullYear()}`; }
function citeParts(type, f){ return CITE[type].make(f).filter(p => Array.isArray(p) ? p[1] : p); }
const citeHTML = parts => parts.map(p => Array.isArray(p) ? `<i>${esc(p[1])}</i>` : esc(p)).join("").replace(/\s+$/,"").replace(/,$/, ".");
const citeText = parts => parts.map(p => Array.isArray(p) ? p[1] : p).join("").trim().replace(/,$/, ".");

/* ----- Bibliography helpers (shared by tools and My Work) ----- */
const uid = () => Math.random().toString(36).slice(2, 10);
function nextCode(all, ps){ const nums = all.filter(c => c.ps === ps && c.code).map(c => parseInt(c.code.slice(1), 10) || 0); return ps + ((nums.length ? Math.max(...nums) : 0) + 1); }
function bibAll(){
  const a = get("bib", []); let changed = false;
  a.forEach(c => { if (!c.id) { c.id = "b" + uid(); changed = true; } if (!c.code) { c.code = nextCode(a, c.ps); changed = true; } if (c.ann === undefined) { c.ann = ""; changed = true; } });
  if (changed) set("bib", a);
  return a;
}
const sortKey = c => c.text.replace(/^["“]/, "").toLowerCase();
const bibGroup = ps => bibAll().filter(c => c.ps === ps).sort((a,b) => sortKey(a).localeCompare(sortKey(b)));
const shortCite = c => { const t = c.text.replace(/["“”]/g, ""); return t.length > 48 ? t.slice(0, 46) + "…" : t; };
function bibText(){
  const g = ps => bibGroup(ps).map(c => c.text + (c.ann ? `\n    ${c.ann}` : "")).join("\n");
  return `PRIMARY SOURCES\n${g("P")}\n\nSECONDARY SOURCES\n${g("S")}`;
}
function bibHTML(){
  const g = ps => bibGroup(ps).map(c => `<p style="margin-left:.5in;text-indent:-.5in">${c.html}</p>` + (c.ann ? `<p style="margin-left:.5in">${esc(c.ann)}</p>` : "")).join("");
  return `<p><b>Primary Sources</b></p>${g("P")}<p><b>Secondary Sources</b></p>${g("S")}`;
}
function renderBib(box, onChange){
  const sec = (ps, name) => { const list = bibGroup(ps);
    return `<h4 style="margin:.8rem 0 .3rem">${name} (${list.length})</h4>` + (list.length ? list.map(c => `
      <div class="bibentry" data-id="${c.id}">
        <div class="citation"><span class="code">${esc(c.code)}</span> ${c.html}</div>
        <label class="sr" for="ann-${c.id}">Annotation for ${esc(c.code)}</label>
        <textarea id="ann-${c.id}" class="ann" data-ann="${c.id}" placeholder="Annotation: what is this source, and how did it help you? (2–3 sentences)">${esc(c.ann)}</textarea>
        <div class="row"><button class="btn ghost small" data-flip="${c.id}">Move to ${ps === "P" ? "secondary" : "primary"}</button><button class="btn ghost small" data-del="${c.id}">Remove</button></div>
      </div>`).join("") : `<p class="muted">None yet.</p>`); };
  box.innerHTML = sec("P", "Primary sources") + sec("S", "Secondary sources");
  box.querySelectorAll("[data-ann]").forEach(t => t.addEventListener("input", () => { const a = bibAll(); const c = a.find(x => x.id === t.dataset.ann); if (c) { c.ann = t.value; set("bib", a); } }));
  box.querySelectorAll("[data-flip]").forEach(b => b.onclick = () => { const a = bibAll(); const c = a.find(x => x.id === b.dataset.flip); if (c) { c.ps = c.ps === "P" ? "S" : "P"; c.code = nextCode(a.filter(x => x !== c), c.ps); set("bib", a); } renderBib(box, onChange); onChange && onChange(); });
  box.querySelectorAll("[data-del]").forEach(b => b.onclick = () => { const a = bibAll().filter(x => x.id !== b.dataset.del); set("bib", a); renderBib(box, onChange); onChange && onChange(); toast("Removed."); });
}

TOOLS.cite = (el) => {
  const type = get("citeType", "book");
  el.innerHTML = `<div class="grid2"><div class="panel"><h3>Citation Builder (MLA)</h3>
    <div class="field"><label for="ctype">Type of source</label><select id="ctype">${Object.entries(CITE).map(([k,v])=>`<option value="${k}" ${k===type?"selected":""}>${v.label}</option>`).join("")}</select></div>
    <div id="cfields"></div>
    <div class="field"><label for="cps">Primary or secondary?</label><select id="cps"><option value="S">Secondary</option><option value="P">Primary</option></select></div>
    <p><strong>Your citation:</strong></p><div class="result citation" id="cout"></div>
    <div class="field"><label for="cann">Annotation (you can add this later)</label><textarea id="cann" placeholder="What is this source, and how did it help you?"></textarea></div>
    <div class="row"><button class="btn" id="cadd">Add to my bibliography</button><button class="btn ghost" id="ccopy1">Copy this citation</button></div></div>
    <div class="panel"><h3>My working bibliography</h3><p class="muted" style="font-size:.92rem">Every source gets a code (like P1 or S3). Use it on your note cards. This list is also in the <button class="linkbtn" data-go-mywork>My Work</button> tab.</p>
    <div id="cbib"></div><button class="btn ghost" id="ccopy">Copy my bibliography</button></div></div>`;
  let f = {};
  const empty = `<span class="muted">Fill in the boxes. Leave a box blank if you can't find that information.</span>`;
  const out = () => { const p = citeParts($("#ctype").value, f); $("#cout").innerHTML = p.length ? citeHTML(p) : empty; };
  const drawFields = () => { const t = $("#ctype").value; f = {};
    $("#cfields").innerHTML = CITE[t].fields.map(([k,l,x])=>`<div class="field"><label for="cf-${k}">${l}</label><input type="text" id="cf-${k}" data-k="${k}" ${x==="acc"?`value="${mlaToday()}"`:""}></div>`).join("");
    $("#cfields").querySelectorAll("input").forEach(i => { f[i.dataset.k] = i.value.trim(); i.addEventListener("input", () => { f[i.dataset.k] = i.value.trim(); out(); }); });
    out(); };
  $("#ctype").onchange = () => { set("citeType", $("#ctype").value); drawFields(); };
  $("#cadd").onclick = () => { const p = citeParts($("#ctype").value, f); if (!p.length) return toast("Fill in some boxes first.");
    const a = bibAll(); const ps = $("#cps").value; const code = nextCode(a, ps);
    a.push({ id: "b" + uid(), code, html: citeHTML(p), text: citeText(p), ps, ann: $("#cann").value.trim() }); set("bib", a);
    $("#cann").value = ""; renderBib($("#cbib")); toast(`Saved as source ${code}!`); drawFields(); };
  $("#ccopy1").onclick = () => { const p = citeParts($("#ctype").value, f); if (p.length) copyText(citeText(p), `<p>${citeHTML(p)}</p>`); };
  $("#ccopy").onclick = () => copyText(bibText(), bibHTML());
  el.querySelector("[data-go-mywork]").onclick = () => go("mywork");
  drawFields(); renderBib($("#cbib"));
};

/* --- Note Cards --- */
const TAGS = { B:"Before", I:"Innovation", A:"After" };
const cardsAll = () => get("cards", []);
function cardSource(c){
  if (c.src) { const s = bibAll().find(x => x.id === c.src); return s ? s : null; }
  return null;
}
function cardSrcLabel(c){ const s = cardSource(c); if (s) return s.code; if (c.src) return "(removed source)"; return c.srcText || "No source yet"; }
function cardNoteHTML(c){ return c.quote ? `“${esc(c.note)}”` : esc(c.note); }
function cardHTML(c, opts = {}){
  return `<div class="notecard ${c.star ? "starred" : ""}">
    <div class="nc-top"><span class="tagchip t${c.tag}">${c.tag} · ${TAGS[c.tag]}</span><span class="muted">Source ${esc(cardSrcLabel(c))}${c.page ? `, p. ${esc(c.page)}` : ""}</span></div>
    <p class="nc-note">${cardNoteHTML(c)}</p>
    <div class="row"><button class="btn ghost small" data-star="${c.id}" aria-pressed="${!!c.star}">${c.star ? "★ In evidence map" : "☆ Use in evidence map"}</button>${opts.noDelete ? "" : `<button class="btn ghost small" data-delcard="${c.id}">Delete</button>`}</div>
  </div>`;
}
function bindCardButtons(root, redraw){
  root.querySelectorAll("[data-star]").forEach(b => b.onclick = () => { const a = cardsAll(); const c = a.find(x => x.id === b.dataset.star); if (c) { c.star = !c.star; set("cards", a); } redraw(); });
  root.querySelectorAll("[data-delcard]").forEach(b => b.onclick = () => { set("cards", cardsAll().filter(x => x.id !== b.dataset.delcard)); redraw(); toast("Card deleted."); });
}
function cardsText(){
  return "MY NOTE CARDS\n" + ["B","I","A"].map(t => `\n${TAGS[t].toUpperCase()}\n` + cardsAll().filter(c => c.tag === t).map(c => `- [${cardSrcLabel(c)}${c.page ? ", p. " + c.page : ""}] ${c.quote ? `"${c.note}"` : c.note}`).join("\n")).join("\n");
}
TOOLS.notes = (el) => {
  const opts = () => { const b = bibAll(); return `<option value="">Pick a source...</option>` + ["P","S"].map(ps => bibGroup(ps).map(c => `<option value="${c.id}">${esc(c.code)}: ${esc(shortCite(c))}</option>`).join("")).join("") + `<option value="__other">Not in my bibliography yet</option>`; };
  el.innerHTML = `<div class="grid2"><div class="panel"><h3>New note card</h3>
    <p class="muted">One idea per card. Use your own words, or check the box if you copy exact words.</p>
    <div class="field"><label for="ns">Source</label><select id="ns">${opts()}</select><div class="hint" id="nshint"></div></div>
    <div class="field" id="nsotherwrap" hidden><label for="nsother">Source (title or author)</label><input type="text" id="nsother"></div>
    <div class="field"><label for="np">Page (if there is one)</label><input type="text" id="np" style="max-width:10rem"></div>
    <div class="field"><label for="nn">My note</label><textarea id="nn"></textarea></div>
    <div class="checks"><label><input type="checkbox" id="nq"> This is an exact quote (copied word for word)</label></div>
    <fieldset class="tagpick"><legend>Tag</legend>${Object.entries(TAGS).map(([k,v])=>`<label><input type="radio" name="ntag" value="${k}" ${k==="B"?"checked":""}> <strong>${k}</strong> = ${v}</label>`).join("")}</fieldset>
    <button class="btn" id="nadd">Save card</button></div>
    <div class="panel"><h3>My note cards</h3><div class="row" id="nfilter" role="group" aria-label="Filter cards"></div><p id="ncount" class="muted" style="margin:.5rem 0"></p><div id="nlist"></div>
    <button class="btn ghost" id="ncopy" style="margin-top:.6rem">Copy my note cards</button></div></div>`;
  if (!bibAll().length) $("#nshint").innerHTML = `Tip: add sources in the <button class="linkbtn" data-tool-link="cite">Citation Builder</button> first, so they show up here with a code.`;
  el.querySelectorAll("[data-tool-link]").forEach(b => b.onclick = () => openTool(b.dataset.toolLink));
  $("#ns").onchange = () => { $("#nsotherwrap").hidden = $("#ns").value !== "__other"; };
  let filter = get("cardFilter", "all");
  const draw = () => {
    const a = cardsAll(); const n = t => a.filter(c => c.tag === t).length;
    $("#nfilter").innerHTML = [["all",`All (${a.length})`],["B",`B (${n("B")})`],["I",`I (${n("I")})`],["A",`A (${n("A")})`]].map(([k,l])=>`<button class="btn ${filter===k?"":"ghost"} small" data-filt="${k}">${l}</button>`).join("");
    $("#nfilter").querySelectorAll("[data-filt]").forEach(b => b.onclick = () => { filter = b.dataset.filt; set("cardFilter", filter); draw(); });
    const low = ["B","I","A"].filter(t => n(t) < 3);
    $("#ncount").innerHTML = a.length ? (low.length ? `Research more for: <strong>${low.map(t=>TAGS[t]).join(", ")}</strong>. Most projects need the most cards in After.` : "Nice balance! Keep adding to After, where you prove change.") : "No cards yet. Most strong projects have 30 or more!";
    const shown = a.filter(c => filter === "all" || c.tag === filter).slice().reverse();
    $("#nlist").innerHTML = shown.map(c => cardHTML(c)).join("") || "";
    bindCardButtons($("#nlist"), draw);
  };
  $("#nadd").onclick = () => {
    const note = $("#nn").value.trim(); if (!note) return toast("Write your note first.");
    const sv = $("#ns").value; const tag = (el.querySelector("input[name=ntag]:checked") || {}).value || "B";
    const a = cardsAll();
    a.push({ id: "c" + uid(), src: sv && sv !== "__other" ? sv : "", srcText: sv === "__other" ? $("#nsother").value.trim() : "", page: $("#np").value.trim(), note, quote: $("#nq").checked, tag, star: false });
    set("cards", a); $("#nn").value = ""; $("#np").value = ""; $("#nq").checked = false; draw(); toast("Card saved!");
  };
  $("#ncopy").onclick = () => copyText(cardsText());
  draw();
};

/* --- Evidence Map --- */
function mapText(){
  const a = cardsAll().filter(c => c.star);
  return "MY EVIDENCE MAP\n" + ["B","I","A"].map(t => `\n${TAGS[t].toUpperCase()}\n` + a.filter(c => c.tag === t).map(c => `- ${c.quote ? `"${c.note}"` : c.note} (${cardSrcLabel(c)})`).join("\n")).join("\n") + `\n\nSO WHAT?\n${get("soWhat", "")}`;
}
TOOLS.map = (el) => {
  el.innerHTML = `<div class="panel"><h3>Evidence Map</h3>
    <p class="muted">Star your strongest note cards (☆) and they show up here. Aim for at least 2 in each section, with a primary source if you can.</p>
    <div id="mapbody"></div>
    <div class="field" style="margin-top:1rem"><label for="msw">So What? Why does this matter in history?</label><textarea id="msw"></textarea></div>
    <div class="row"><button class="btn" id="mcopy">Copy my evidence map</button><button class="btn ghost" data-tool-link="notes">Go to note cards</button><button class="btn ghost" data-tool-link="thesis">Go to Thesis Builder</button></div></div>`;
  const draw = () => {
    const a = cardsAll();
    $("#mapbody").innerHTML = ["B","I","A"].map(t => {
      const st = a.filter(c => c.tag === t && c.star), rest = a.filter(c => c.tag === t && !c.star);
      const hasP = st.some(c => { const s = cardSource(c); return s && s.ps === "P"; });
      const warn = st.length < 2 ? `Star at least ${2 - st.length} more ${TAGS[t]} card${2 - st.length > 1 ? "s" : ""}.` : (!hasP ? "Try to include a card from a primary source." : "");
      return `<div class="mapsec"><h4>${TAGS[t]} <span class="muted" style="font-weight:400">(${st.length})</span></h4>
        ${warn ? `<p class="maphint">${warn}</p>` : ""}
        <div class="mapcards">${st.map(c => cardHTML(c, {noDelete:true})).join("")}</div>
        ${rest.length ? `<details class="pickmore"><summary>Pick from your other ${TAGS[t]} cards (${rest.length})</summary><div class="mapcards">${rest.map(c => cardHTML(c, {noDelete:true})).join("")}</div></details>` : ""}
      </div>`;
    }).join("");
    bindCardButtons($("#mapbody"), draw);
  };
  $("#msw").value = get("soWhat", ""); $("#msw").addEventListener("input", e => set("soWhat", e.target.value));
  el.querySelectorAll("[data-tool-link]").forEach(b => b.onclick = () => openTool(b.dataset.toolLink));
  $("#mcopy").onclick = () => copyText(mapText());
  draw();
};

/* --- Thesis Builder (rule-based, no AI) --- */
TOOLS.thesis = (el) => {
  const pieces = [["innov","The innovation"],["tp","Time and place"],["who","Who created or spread it"],["short","The short-term change"],["long","The long-term change"],["down","A downside or problem it caused (optional)"]];
  const frames = [
    "[innovation], created by [who] in [time and place], [short-term change], which led to [long-term change].",
    "[innovation] in [time and place] changed the world by [short-term change], and it influenced [long-term change].",
    "[innovation] in [time and place] [short-term change], but it also [downside].",
  ];
  el.innerHTML = `<div class="grid2"><div class="panel"><h3>Thesis Builder</h3><p class="muted">Step 1: fill in the pieces with your own words. Use your evidence map.</p>
    ${pieces.map(([k,l])=>`<div class="field"><label for="tp-${k}">${l}</label><input type="text" id="tp-${k}" data-f="${k}"></div>`).join("")}
    <div class="field"><label for="tframe">Step 2: pick a sentence frame</label><select id="tframe" data-f="frame">${frames.map((x,i)=>`<option value="${i}">${esc(x)}</option>`).join("")}</select></div>
    <button class="btn ghost" id="tbuild">Put my words into the frame</button></div>
    <div class="panel"><h3>Step 3: edit your thesis</h3><p class="muted">The frame is just a start. Change the words so it sounds like you. Your final thesis (NHD calls it your historical argument) should be two or three sentences, in your own words.</p>
    <textarea id="tdraft" style="min-height:9rem" data-f="draft"></textarea>
    <h4 style="margin:.8rem 0 .3rem">Quick checks</h4><div id="tchecks"></div>
    <div class="checks" style="margin-top:.4rem"><label><input type="checkbox" data-f="c1"> It makes a claim someone could disagree with</label><label><input type="checkbox" data-f="c2"> It names a place</label><label><input type="checkbox" data-f="c3"> My evidence map could prove it</label></div>
    <button class="btn" id="tcopy">Copy my thesis</button></div></div>`;
  const checks = () => { const t = ($("#tdraft").value || "").trim(); const words = t ? t.split(/\s+/).length : 0;
    const rows = [
      [/\b(\d{3,4}s?|\d{1,2}(st|nd|rd|th)\s+century|centur(y|ies)|bce|bc|ce|ad|dynasty|era|empire|age)\b/i.test(t), "Includes a time (a year, century, era, or dynasty)"],
      [/\b(chang\w*|led to|lead to|impact\w*|influenc\w*|transform\w*|caus\w*|made it|allowed|resulted)\b/i.test(t), "Uses a change word (changed, led to, influenced...)"],
      [words >= 15, `Long enough to explain the change (${words} words)`],
      [t.length > 0 && !/^(my project is about|this project is about|i am going to)/i.test(t), "Makes an argument instead of announcing the topic"],
    ];
    $("#tchecks").innerHTML = rows.map(([ok,l])=>`<div class="checkrow"><span class="dot ${ok?"yes":""}">${ok?"✓":""}</span>${l}</div>`).join(""); };
  bindFields(el, "thesis", checks);
  $("#tdraft").addEventListener("input", checks);
  $("#tbuild").onclick = () => { const d = get("thesis", {}); const v = k => (d[k] || "").trim() || `[${k === "tp" ? "time and place" : k === "innov" ? "innovation" : k === "short" ? "short-term change" : k === "long" ? "long-term change" : k === "down" ? "downside" : "who"}]`;
    let s = frames[+(d.frame || 0)].replace("[innovation]", v("innov")).replace("[time and place]", v("tp")).replace("[who]", v("who")).replace("[short-term change]", v("short")).replace("[long-term change]", v("long")).replace("[downside]", v("down"));
    s = s.charAt(0).toUpperCase() + s.slice(1);
    $("#tdraft").value = s; const dd = get("thesis", {}); dd.draft = s; set("thesis", dd); checks(); toast("Now edit it so it sounds like you."); };
  $("#tcopy").onclick = () => copyText(`MY THESIS\n${$("#tdraft").value}`);
};

/* --- Word and Time Counter --- */
TOOLS.count = (el) => {
  const cats = { exhibit:["Exhibit",500,"words"], website:["Website",1200,"words"], paper:["Paper",2500,"words"], process:["Process paper",500,"words"], documentary:["Documentary",600,"time"], performance:["Performance",600,"time"] };
  const cat = get("countCat", "exhibit");
  el.innerHTML = `<div class="panel"><h3>Word and Time Counter</h3>
    <div class="field"><label for="ccat">What are you checking?</label><select id="ccat">${Object.entries(cats).map(([k,v])=>`<option value="${k}" ${k===cat?"selected":""}>${v[0]} (${v[2]==="words"?v[1].toLocaleString()+" words max":"10 minutes max"})</option>`).join("")}</select></div>
    <div id="cbody"></div></div>`;
  const draw = () => { const k = $("#ccat").value; set("countCat", k); const [name, max, kind] = cats[k];
    if (kind === "words") {
      $("#cbody").innerHTML = `<div class="field"><label for="ctext">Paste the words you wrote</label><div class="hint">${k==="paper"?"Papers need 1,500–2,500 words. ":""}Don't paste quotes from sources or image credits. They don't count toward the limit.</div><textarea id="ctext" style="min-height:12rem"></textarea></div><div class="meter" id="cm"><span></span></div><p id="cnum" style="font-weight:700"></p>`;
      const ta = $("#ctext"); ta.value = get("countText-"+k, "");
      const upd = () => { set("countText-"+k, ta.value); const n = ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0;
        $("#cm span").style.width = Math.min(100, n/max*100) + "%"; $("#cm").classList.toggle("over", n > max);
        $("#cnum").textContent = `${n.toLocaleString()} / ${max.toLocaleString()} words` + (n > max ? ` (cut ${n-max})` : k==="paper" && n < 1500 && n > 0 ? ` (need ${1500-n} more to reach 1,500)` : ""); };
      ta.addEventListener("input", upd); upd();
    } else {
      const rows = ["Intro and thesis","Before","The Innovation","After","So What? / conclusion"].concat(k==="documentary"?["Credits"]:[]);
      const saved = get("time-"+k, {});
      $("#cbody").innerHTML = `<p class="muted">Enter each section's time as minutes:seconds, like 1:30.</p><div class="tablewrap"><table class="budget"><thead><tr><th>Section</th><th>Time</th></tr></thead><tbody>${rows.map((r,i)=>`<tr><td>${r}</td><td><input type="text" inputmode="numeric" aria-label="${r} time" data-i="${i}" value="${esc(saved[i]||"")}" placeholder="0:00"></td></tr>`).join("")}</tbody></table></div><div class="meter" id="cm"><span></span></div><p id="cnum" style="font-weight:700"></p>`;
      const sec = v => { const m = String(v).trim().match(/^(\d+)(?::(\d{1,2}))?$/); return m ? (+m[1])*60 + (+(m[2]||0)) : 0; };
      const upd = () => { const s = {}; let tot = 0; $("#cbody").querySelectorAll("input").forEach(i => { s[i.dataset.i] = i.value; tot += sec(i.value); }); set("time-"+k, s);
        const mm = Math.floor(tot/60), ss = String(tot%60).padStart(2,"0");
        $("#cm span").style.width = Math.min(100, tot/max*100) + "%"; $("#cm").classList.toggle("over", tot > max);
        $("#cnum").textContent = `Total: ${mm}:${ss} / 10:00` + (tot > max ? ` (cut ${Math.floor((tot-max)/60)}:${String((tot-max)%60).padStart(2,"0")})` : ""); };
      $("#cbody").querySelectorAll("input").forEach(i => i.addEventListener("input", upd)); upd();
    } };
  $("#ccat").onchange = draw; draw();
};

function renderToolNav(){
  $("#toolNav").innerHTML = Object.entries(TOOLNAMES).map(([k,v])=>`<button data-t="${k}" aria-pressed="false">${v}</button>`).join("");
  $("#toolNav").querySelectorAll("button").forEach(b => b.onclick = () => openTool(b.dataset.t));
  openTool(get("lastTool", "funnel"));
}

/* ===================== RESEARCH ===================== */
const RESEARCH = [
  { era:"Start anywhere", links:[
    ["Library of Congress","https://www.loc.gov/","Millions of primary sources: maps, documents, photos.","Primary"],
    ["Internet History Sourcebooks","https://sourcebooks.fordham.edu/","Translated primary sources from ancient and medieval history.","Primary"],
    ["World History Encyclopedia","https://www.worldhistory.org/","Readable background articles on almost any topic.","Secondary"],
    ["NHD theme resources","https://nhd.org/en/contest/theme/","The official theme page, with topic ideas.","Help"],
  ]},
  { era:"Museum collections (artifacts)", links:[
    ["The Met Collection","https://www.metmuseum.org/art/collection","Photos of objects from every era and region.","Primary"],
    ["British Museum Collection","https://www.britishmuseum.org/collection","Artifacts from ancient and medieval worlds.","Primary"],
    ["Smithsonian Collections","https://collections.si.edu/","Objects, images, and documents.","Primary"],
  ]},
  { era:"Asia", links:[
    ["Asia for Educators (Columbia University)","https://afe.easia.columbia.edu/","Background and primary sources on China, Japan, and Korea.","Both"],
  ]},
  { era:"Laws, treaties, and documents", links:[
    ["The Avalon Project (Yale Law School)","https://avalon.law.yale.edu/","Historical documents from ancient times onward, in English.","Primary"],
  ]},
];
const SEARCH_TIPS = [
  "Search for the innovation plus \"primary source\" (example: <em>printing press primary source</em>).",
  "Try the name of a person who lived then, plus \"letter,\" \"journal,\" or \"account.\"",
  "On museum sites, search the object type plus the culture (example: <em>Roman coin</em>, <em>Maya codex</em>).",
  "Ask your school librarian about databases you can log in to for free.",
];
function renderResearch(){
  $("#researchList").innerHTML = RESEARCH.map(g => `<div class="era"><h3>${esc(g.era)}</h3><div class="linkgrid">${g.links.map(([n,u,d,t])=>`<a href="${u}" target="_blank" rel="noopener"><strong>${esc(n)}<span class="tag">${t}</span></strong><span>${esc(d)}</span></a>`).join("")}</div></div>`).join("")
    + `<div class="panel"><h3>Search tips</h3><ul class="clean">${SEARCH_TIPS.map(t=>`<li>${t}</li>`).join("")}</ul><p class="muted" style="margin:0">Avoid random websites and blogs. You can't tell where their information came from. AI chatbots are not allowed for any part of your History Day research (see the Rules tab).</p></div>`;
}

/* ===================== RULES ===================== */
function renderRules(){
  const r = [["Exhibit","Solo or group of 2–5","500 words you wrote. Up to 40\" wide, 30\" deep, 6' tall (the table doesn't count). Media up to 2 minutes, no looping, no QR codes."],
    ["Website","Solo or group of 2–5","1,200 words you wrote. Up to 3 minutes of media, including music that plays when a page loads. Built on NHDWebCentral."],
    ["Documentary","Solo or group of 2–5","10 minutes max, including your source credits at the end. You run all the equipment and software."],
    ["Performance","Solo or group of 2–5","10 minutes max, plus 5 minutes to set up."],
    ["Paper","Solo only","1,500–2,500 words."]];
  $("#rulesTable").innerHTML = `<table class="rules"><thead><tr><th>Category</th><th>Who</th><th>Limits</th></tr></thead><tbody>${r.map(x=>`<tr><td><strong>${x[0]}</strong></td><td>${x[1]}</td><td>${x[2]}</td></tr>`).join("")}</tbody></table>`;
}

/* ===================== TEXT BUILDERS ===================== */
function funnelText(){ const f = get("funnel", {}); return `TOPIC FUNNEL\nBig idea: ${f.big||""}\nNarrower: ${f.n1||""}\nNarrower: ${f.n2||""}\nFocused topic: ${f.focus||""}`; }
function themeText(){ const t = get("theme", {}); return `THEME CONNECTION\nTopic: ${t.topic||""}\nBefore: ${t.before||""}\nThe Innovation: ${t.innov||""}\nAfter: ${t.after||""}\nSo What?: ${t.sowhat||""}`; }
function questionsText(){ return `FOCUS QUESTIONS\n${get("questions",[]).map((q,i)=>`${i+1}. ${q}`).join("\n")}\n\nBIG QUESTION\n${get("bigq","")}`; }
function thesisText(){ return `MY THESIS\n${(get("thesis",{}).draft)||""}`; }
function allText(){ return ["MY HISTORY DAY WORK", funnelText(), themeText(), questionsText(), bibText(), cardsText(), mapText(), thesisText()].join("\n\n"); }

/* ===================== BACKUP ===================== */
const BACKUP_PREFIX = "HISTORYDAY-BACKUP:";
function makeBackup(){
  const data = {}; Object.keys(S).forEach(k => { if (k !== "theme" && k !== "lastTool") data[k] = S[k]; });
  const json = JSON.stringify({ v:1, year: CONFIG.year, saved: new Date().toISOString(), data });
  return BACKUP_PREFIX + btoa(unescape(encodeURIComponent(json)));
}
function readBackup(code){
  const c = code.trim().replace(/\s+/g, "");
  if (!c.startsWith(BACKUP_PREFIX)) throw new Error("That doesn't look like a History Day backup code. It should start with HISTORYDAY-BACKUP:");
  const obj = JSON.parse(decodeURIComponent(escape(atob(c.slice(BACKUP_PREFIX.length)))));
  if (!obj || !obj.data) throw new Error("This backup code is incomplete. Copy the whole code and try again.");
  return obj;
}

/* ===================== MY WORK ===================== */
function renderMyWork(){
  const box = $("#myworkBody");
  const f = get("funnel", {}), t = get("theme", {}), th = get("thesis", {});
  const qs = get("questions", []), cards = cardsAll(), starred = cards.filter(c => c.star);
  const blank = msg => `<p class="muted">${msg}</p>`;
  const sec = (id, title, tool, body, copyFn) => `<div class="panel mw" id="mw-${id}">
      <div class="mw-head"><h3>${title}</h3><div class="row">${tool ? `<button class="btn ghost small" data-open="${tool}">Open tool</button>` : ""}<button class="btn small" data-copy="${id}">Copy</button></div></div>
      ${body}</div>`;
  const n = tg => cards.filter(c => c.tag === tg).length;
  box.innerHTML = `
    <div class="panel backup">
      <h3>Back up my work</h3>
      <p>Your work is saved in this browser on this device only. If the browser is cleared or you switch computers, it's gone. Back up often: download a backup file to your Google Drive, or make a backup code and paste it at the bottom of your History Day Google Doc.</p>
      <div class="row"><button class="btn" id="bkFile">Download a backup file</button><button class="btn ghost" id="bkMake">Make a backup code</button></div>
      <div id="bkOut"></div>
      <details class="restore"><summary>Restore from a backup</summary>
        <div class="field" style="margin-top:.6rem"><label for="bkUpload">Choose a backup file</label><input type="file" id="bkUpload" accept=".json,application/json"></div>
        <div class="field"><label for="bkIn">Or paste a backup code</label><textarea id="bkIn" placeholder="HISTORYDAY-BACKUP:..."></textarea></div>
        <button class="btn ghost" id="bkCheck">Check this code</button><div id="bkMsg"></div>
      </details>
    </div>
    ${sec("funnel", "Topic funnel", "funnel", (f.big || f.focus) ? `<div class="funnel small">${[f.big,f.n1,f.n2,f.focus].map(x=>`<div>${esc(x)||"&nbsp;"}</div>`).join("")}</div>` : blank("Not started yet."), funnelText)}
    ${sec("theme", "Theme connection", "theme", (t.before||t.innov||t.after||t.sowhat) ? `<dl class="mwdl">${[["Before",t.before],["The Innovation",t.innov],["After",t.after],["So What?",t.sowhat]].map(([l,v])=>`<dt>${l}</dt><dd>${esc(v)||"<span class='muted'>(blank)</span>"}</dd>`).join("")}</dl>` : blank("Not started yet."), themeText)}
    ${sec("questions", "Focus questions", "questions", (qs.length || get("bigq","")) ? `<ol class="clean">${qs.map(q=>`<li>${esc(q)}</li>`).join("")}</ol><p><strong>BIG question:</strong> ${esc(get("bigq","")) || "<span class='muted'>(not written yet)</span>"}</p>` : blank("No questions saved yet."), questionsText)}
    ${sec("bib", "Working bibliography", "cite", `<p class="muted" style="font-size:.92rem">Add annotations, move a source between primary and secondary, or remove it.</p><div id="mwBib"></div>`, bibText)}
    ${sec("cards", "Note cards", "notes", cards.length ? `<p><strong>${cards.length}</strong> cards: B ${n("B")} · I ${n("I")} · A ${n("A")}. ${starred.length} starred for your evidence map.</p><details class="pickmore"><summary>Show all cards</summary><div class="mapcards">${cards.slice().reverse().map(c=>cardHTML(c)).join("")}</div></details>` : blank("No note cards yet."), cardsText)}
    ${sec("map", "Evidence map", "map", starred.length ? ["B","I","A"].map(tg => `<h4 style="margin:.5rem 0 .2rem">${TAGS[tg]}</h4><ul class="clean">${starred.filter(c=>c.tag===tg).map(c=>`<li>${cardNoteHTML(c)} <span class="muted">(${esc(cardSrcLabel(c))})</span></li>`).join("") || "<li class='muted'>Nothing starred yet.</li>"}</ul>`).join("") + `<h4 style="margin:.5rem 0 .2rem">So What?</h4><p>${esc(get("soWhat","")) || "<span class='muted'>(not written yet)</span>"}</p>` : blank("Star note cards to build your evidence map."), mapText)}
    ${sec("thesis", "Thesis", "thesis", th.draft ? `<p class="bigthesis">${esc(th.draft)}</p>` : blank("No thesis yet."), thesisText)}
  `;
  const copiers = { funnel: funnelText, theme: themeText, questions: questionsText, cards: cardsText, map: mapText, thesis: thesisText };
  box.querySelectorAll("[data-copy]").forEach(b => b.onclick = () => b.dataset.copy === "bib" ? copyText(bibText(), bibHTML()) : copyText(copiers[b.dataset.copy]()));
  box.querySelectorAll("[data-open]").forEach(b => b.onclick = () => { go("tools"); openTool(b.dataset.open); });
  renderBib($("#mwBib"));
  bindCardButtons($("#mw-cards"), renderMyWork);
  $("#bkMake").onclick = () => {
    const code = makeBackup();
    $("#bkOut").innerHTML = `<div class="field" style="margin-top:.8rem"><label for="bkCode">Your backup code (made ${new Date().toLocaleDateString("en-US",{month:"long",day:"numeric"})})</label><textarea id="bkCode" readonly style="min-height:6rem;font-size:.8rem">${esc(code)}</textarea></div><button class="btn small" id="bkCopy">Copy backup code</button>`;
    $("#bkCopy").onclick = () => copyText(code);
  };
  $("#bkFile").onclick = () => {
    const data = {}; Object.keys(S).forEach(k => { if (k !== "theme" && k !== "lastTool") data[k] = S[k]; });
    const blob = new Blob([JSON.stringify({ v:1, year: CONFIG.year, saved: new Date().toISOString(), data }, null, 1)], { type: "application/json" });
    const a = document.createElement("a"); const d = new Date();
    a.href = URL.createObjectURL(blob); a.download = `history-day-backup-${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}.json`;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    toast("Backup file downloaded. Save it to your Google Drive!");
  };
  $("#bkUpload").onchange = (e) => {
    const file = e.target.files && e.target.files[0]; if (!file) return;
    const r = new FileReader();
    r.onload = () => { try { const obj = JSON.parse(r.result); if (!obj || !obj.data) throw new Error(); showRestore(obj); } catch (_) { $("#bkMsg").innerHTML = `<div class="feedback try">That file isn't a History Day backup. Choose the file that starts with "history-day-backup".</div>`; } };
    r.readAsText(file);
  };
  function showRestore(obj){
    const d = obj.data;
    const when = obj.saved ? new Date(obj.saved).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}) : "an unknown date";
    $("#bkMsg").innerHTML = `<div class="feedback ok"><p>This backup is from <strong>${when}</strong>. It has ${(d.bib||[]).length} sources, ${(d.cards||[]).length} note cards, and ${(d.questions||[]).length} questions.</p>
      <p><strong>Restoring replaces everything saved on this device right now.</strong></p><button class="btn" id="bkGo">Replace my work with this backup</button></div>`;
    $("#bkGo").onclick = () => { const keep = { theme: S.theme }; S = Object.assign({}, d, keep); save(); renderStamps(); renderWeek(); renderCheckpoints(); renderMyWork(); toast("Your work is restored!"); };
  }
  $("#bkCheck").onclick = () => {
    try {
      showRestore(readBackup($("#bkIn").value));
    } catch (e) {
      $("#bkMsg").innerHTML = `<div class="feedback try">${esc(e.message && e.message.startsWith("That") || (e.message||"").startsWith("This") ? e.message : "That code didn't work. Make sure you copied the whole code, from HISTORYDAY-BACKUP: to the end.")}</div>`;
    }
  };
}

/* ===================== COPY ALL ===================== */
$("#copyAll").onclick = () => copyText(allText());

/* ===================== START ===================== */
renderStamps(); renderWeek(); renderCheckpoints(); renderToolNav(); renderResearch(); renderRules();
if (CONFIG.teacherEmail) { const p = document.querySelector("footer p"); if (p) p.innerHTML = p.innerHTML.replace("Email your teacher", `Email your teacher (<a href="mailto:${esc(CONFIG.teacherEmail)}">${esc(CONFIG.teacherEmail)}</a>)`); }
const start = (location.hash || "").slice(1);
if (["week","checkpoints","tools","mywork","research","rules"].includes(start)) go(start);
