// ===== 設定 =====
const POS = ["名詞", "動詞", "形容詞", "副詞"];
const NUM_POS = 7;   // 品詞識別の出題数
const NUM_P5 = 5;    // Part 5形式の出題数

// ===== 接尾辞グループ（p: 0名詞 1動詞 2形容詞 3副詞 / l: 仲間の単語リスト）=====
const G = {
  tion: { p: 0, r: "【-tion / -sion】で終わる単語は名詞。動詞から名詞を作る語尾です。", l: "decision, extension, presentation, promotion, application, production, inspection, registration" },
  ment: { p: 0, r: "【-ment】で終わる単語は名詞。動詞に付いて「こと・もの」を表します。", l: "department, management, agreement, requirement, payment, development, statement, replacement" },
  ance: { p: 0, r: "【-ance / -ence】で終わる単語は名詞です。", l: "importance, performance, maintenance, assistance, confidence, difference, attendance, clearance" },
  ty:   { p: 0, r: "【-ty】で終わる単語は名詞。形容詞から名詞を作る語尾です。", l: "security, opportunity, capacity, facility, priority, productivity, availability, liability" },
  ness: { p: 0, r: "【-ness / -cy / -sis】で終わる単語は名詞です。", l: "business, awareness, effectiveness, readiness, willingness, policy, agency, frequency, efficiency, accuracy, basis, analysis, emphasis" },
  ate:  { p: 1, r: "【-ate】で終わる単語は動詞。「〜にする・〜する」の意味です。", l: "create, graduate, generate, indicate, evaluate, estimate, participate, negotiate" },
  fy:   { p: 1, r: "【-fy】で終わる単語は動詞です。", l: "identify, notify, qualify, specify, simplify, certify" },
  ize:  { p: 1, r: "【-ize】で終わる単語は動詞。「〜化する」のイメージです。", l: "organize, realize, specialize, summarize, prioritize, emphasize" },
  en:   { p: 1, r: "【-en】で終わる単語は動詞。「〜にする」の意味です。", l: "widen, strengthen, lengthen, shorten, sharpen" },
  ous:  { p: 2, r: "【-ous】で終わる単語は形容詞です。", l: "delicious, serious, continuous, previous, generous, ambitious" },
  ful:  { p: 2, r: "【-ful】で終わる単語は形容詞。「〜に満ちた」の意味です。", l: "successful, careful, helpful, powerful, resourceful" },
  cial: { p: 2, r: "【-cial / -tial】で終わる単語は形容詞です。", l: "financial, special, official, commercial, confidential, substantial" },
  sive: { p: 2, r: "【-sive / -tive】で終わる単語は形容詞が基本です(名詞の例外に注意)。", l: "extensive, impressive, attractive, creative, competitive, effective" },
  tic:  { p: 2, r: "【-tic】で終わる単語は形容詞です。", l: "dramatic, realistic, strategic, enthusiastic" },
  ble:  { p: 2, r: "【-ble】で終わる単語は形容詞。「〜できる」の意味が多いです。", l: "available, possible, reliable, flexible, responsible, eligible" },
  al:   { p: 2, r: "【-cal / -al / -ant / -ent】で終わる単語は形容詞が多いです。", l: "local, economical, critical, practical, professional, additional, original, efficient, convenient, significant, relevant" },
  ly:   { p: 3, r: "【形容詞 + ly】は副詞。動詞・形容詞・他の副詞・文全体を修飾します。", l: "usually, recently, currently, carefully, promptly, highly, significantly, closely, thoroughly" },
  xly:  { p: 2, r: "【名詞 + ly】は形容詞！ -ly でも副詞ではない、TOEIC頻出の引っかけです。", l: "costly(高価な), friendly(親しみやすい), timely(タイムリーな), orderly(整然とした), monthly(毎月の ※副詞用法もあり)" },
  xnoun:{ p: 0, r: "語尾は -al / -tive ですが、これは名詞になる例外単語です。", l: "proposal(提案), approval(承認), removal(除去), arrival(到着), representative(担当者), alternative(代替案), initiative(主導権)" }
};

// ===== 品詞識別プール [単語, グループ, 例文, 日本語訳] =====
const POOL_POS = [
  ["decision","tion","The board made a decision yesterday.","取締役会は昨日、決定を下した。"],
  ["registration","tion","Registration closes on Friday.","登録は金曜日に締め切られる。"],
  ["promotion","tion","She received a promotion last month.","彼女は先月昇進した。"],
  ["agreement","ment","Both parties signed the agreement.","両者は合意書に署名した。"],
  ["payment","ment","We accept payment by credit card.","クレジットカードでの支払いが可能です。"],
  ["requirement","ment","This is a requirement for all applicants.","これは全応募者の必須条件だ。"],
  ["maintenance","ance","The elevator is under maintenance.","エレベーターは整備中だ。"],
  ["attendance","ance","Attendance at the seminar is mandatory.","セミナーへの出席は必須だ。"],
  ["performance","ance","His performance exceeded expectations.","彼の成績は期待を上回った。"],
  ["security","ty","Security was tight at the event.","イベントの警備は厳重だった。"],
  ["priority","ty","Customer service is our top priority.","顧客サービスが最優先事項だ。"],
  ["availability","ty","Please check the availability of the room.","部屋の空き状況を確認してください。"],
  ["efficiency","ness","The new system improved efficiency.","新システムは効率を向上させた。"],
  ["analysis","ness","The analysis took three weeks.","その分析には3週間かかった。"],
  ["negotiate","ate","They will negotiate the contract terms.","彼らは契約条件を交渉する予定だ。"],
  ["evaluate","ate","We evaluate every employee annually.","私たちは毎年全従業員を評価する。"],
  ["participate","ate","Many staff participate in the workshop.","多くの職員が研修に参加する。"],
  ["identify","fy","Please identify the cause of the error.","エラーの原因を特定してください。"],
  ["specify","fy","Specify the delivery date on the form.","用紙に配達日を明記してください。"],
  ["simplify","fy","The update will simplify the process.","更新により手続きが簡単になる。"],
  ["organize","ize","We need to organize the meeting by Friday.","私たちは金曜日までに会議を準備する必要がある。"],
  ["prioritize","ize","You should prioritize urgent tasks.","緊急の業務を優先すべきだ。"],
  ["specialize","ize","The firm specializes in tax law.","その事務所は税法を専門としている。"],
  ["strengthen","en","The firm plans to strengthen its sales team.","その会社は営業チームを強化する予定だ。"],
  ["widen","en","They want to widen the main road.","彼らは大通りを拡幅したい。"],
  ["serious","ous","It is a serious problem.","それは深刻な問題だ。"],
  ["previous","ous","Please refer to the previous report.","前回の報告書を参照してください。"],
  ["successful","ful","She gave a successful presentation.","彼女は成功したプレゼンテーションを行った。"],
  ["helpful","ful","The staff were very helpful.","スタッフはとても親切だった。"],
  ["official","cial","The official announcement is tomorrow.","公式発表は明日だ。"],
  ["confidential","cial","Keep this document confidential.","この書類は機密にしてください。"],
  ["substantial","cial","The firm made a substantial profit.","その会社はかなりの利益を上げた。"],
  ["impressive","sive","His résumé is impressive.","彼の履歴書は印象的だ。"],
  ["competitive","sive","We offer competitive salaries.","私たちは競争力のある給与を提示している。"],
  ["strategic","tic","It was a strategic decision.","それは戦略的な決定だった。"],
  ["available","ble","The manager is not available today.","部長は今日は対応できない。"],
  ["flexible","ble","We offer flexible working hours.","私たちは柔軟な勤務時間を提供している。"],
  ["eligible","ble","You are eligible for a discount.","あなたは割引の対象です。"],
  ["relevant","al","Attach all relevant documents.","関連する書類をすべて添付してください。"],
  ["additional","al","Additional fees may apply.","追加料金がかかる場合があります。"],
  ["recently","ly","The store recently opened a new branch.","その店は最近、新しい支店を開いた。"],
  ["promptly","ly","Please reply promptly.","すぐに返信してください。"],
  ["thoroughly","ly","The team thoroughly checked the report.","チームは報告書を徹底的に確認した。"],
  ["costly","xly","A delay would be costly for the company.","遅れは会社にとって高くつくだろう。"],
  ["friendly","xly","The staff are friendly and polite.","スタッフは親切で礼儀正しい。"],
  ["timely","xly","Thank you for your timely response.","迅速なご返信をありがとうございます。"],
  ["proposal","xnoun","The manager accepted our proposal.","部長は私たちの提案を受け入れた。"],
  ["approval","xnoun","The plan needs approval from the director.","その計画には部長の承認が必要だ。"],
  ["arrival","xnoun","We await the arrival of the shipment.","私たちは荷物の到着を待っている。"],
  ["representative","xnoun","A sales representative will call you.","営業担当者がお電話します。"],
  ["alternative","xnoun","We need to find an alternative.","私たちは代替案を見つける必要がある。"]
];

// ===== Part 5 プール =====
const POOL_P5 = [
  { s:"The company announced a ____ increase in sales.", c:["significant","significantly","signify","significance"], a:0,
    r:"冠詞(a)と名詞(increase)の間には、名詞を修飾する【形容詞】が入ります。significant(-ant)が形容詞です。", ja:"その会社は大幅な売上増加を発表した。" },
  { s:"Ms. Tanaka ____ reviewed the contract before signing it.", c:["careful","carefully","care","caring"], a:1,
    r:"主語と動詞(reviewed)の間は、動詞を修飾する【副詞】の位置です。careful + ly = carefully。", ja:"田中さんは署名する前に契約書を注意深く確認した。" },
  { s:"Please submit your ____ for the position by Friday.", c:["apply","applicable","application","applying"], a:2,
    r:"所有格(your)の後ろには【名詞】が来ます。-tion で終わる application が名詞です。", ja:"その職への応募書類を金曜日までに提出してください。" },
  { s:"The new policy will ____ the efficiency of our workflow.", c:["improvement","improve","improving","improvable"], a:1,
    r:"助動詞(will)の後ろには【動詞の原形】が入ります。improvement は名詞(-ment)、improvable は形容詞(-ble)です。", ja:"新しい方針は私たちの作業効率を改善するだろう。" },
  { s:"The manager found the schedule ____ for all participants.", c:["conveniently","convenience","convenient","convene"], a:2,
    r:"find + O + C(〜だと分かる)の C には【形容詞】が入ります。-ent で終わる convenient が形容詞です。", ja:"部長はその日程が全参加者にとって都合がよいと分かった。" },
  { s:"We offer ____ prices for bulk orders.", c:["competitive","competition","compete","competitively"], a:0,
    r:"名詞(prices)を前から修飾するのは【形容詞】。-tive で終わる competitive が形容詞です。", ja:"大量注文には競争力のある価格を提供しています。" },
  { s:"The sales team is ____ that it will meet this quarter's target.", c:["confidence","confident","confidently","confide"], a:1,
    r:"be動詞の後ろの補語には【形容詞】が入ります。-ent で終わる confident が形容詞です(confidence は名詞)。", ja:"営業チームは今期の目標を達成できると確信している。" },
  { s:"Our new product has been ____ received by customers.", c:["positive","positively","positivity","position"], a:1,
    r:"has been と過去分詞(received)の間は、動詞を修飾する【副詞】の位置です。positive + ly = positively。", ja:"当社の新製品は顧客から好意的に受け入れられている。" },
  { s:"The ____ of the new building was completed ahead of schedule.", c:["construct","constructive","construction","constructively"], a:2,
    r:"冠詞(The)の後ろで主語になるのは【名詞】。-tion で終わる construction が名詞です。", ja:"新ビルの建設は予定より早く完了した。" },
  { s:"We will ____ you of any changes in the schedule.", c:["notification","notify","notifying","notable"], a:1,
    r:"助動詞(will)の後ろには【動詞の原形】。-fy で終わる notify が動詞です。", ja:"スケジュールの変更があればお知らせします。" },
  { s:"The CEO gave an ____ speech at the conference.", c:["impress","impression","impressive","impressively"], a:2,
    r:"冠詞(an)と名詞(speech)の間は【形容詞】。-sive で終わる impressive が形容詞です。", ja:"CEOは会議で印象的なスピーチを行った。" }
];

// ===== ユーティリティ =====
const $ = (id) => document.getElementById(id);
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

function buildQuestions() {
  const pos = shuffle(POOL_POS).slice(0, NUM_POS).map(([word, g, en, ja]) => {
    const grp = G[g];
    const mates = grp.l.split(", ").filter(w => w.split("(")[0] !== word).join(", ");
    return { type: "pos", word, answer: grp.p, rule: grp.r, mates, en, ja };
  });
  const p5 = shuffle(POOL_P5).slice(0, NUM_P5).map(q => ({ type: "p5", sentence: q.s, choices: q.c, answer: q.a, reason: q.r, ja: q.ja }));
  return pos.concat(p5);
}

// ===== 動作ロジック =====
let QUESTIONS = [], idx = 0, score = 0, answered = false, history = [];

function start() {
  QUESTIONS = buildQuestions();
  idx = 0; score = 0; history = [];
  $("end").classList.add("hide");
  $("quiz").classList.remove("hide");
  show();
}

function show() {
  const q = QUESTIONS[idx];
  answered = false;
  $("bar").style.width = (idx / QUESTIONS.length * 100) + "%";
  $("result").classList.add("hide");
  $("next").classList.add("hide");
  $("meta").textContent = "第 " + (idx + 1) + " 問 / " + QUESTIONS.length + "　(" + (q.type === "pos" ? "品詞識別" : "Part 5 実践問題") + ")";

  const box = $("options");
  box.innerHTML = "";
  let choices;
  if (q.type === "pos") {
    $("question").innerHTML = '次の単語の品詞は？<div class="word">' + q.word + "</div>";
    choices = POS;
    box.className = "opts two";
  } else {
    $("question").textContent = q.sentence;
    choices = q.choices.map((c, i) => "(" + "ABCD"[i] + ") " + c);
    box.className = "opts";
  }
  choices.forEach((text, i) => {
    const b = document.createElement("button");
    b.className = "opt";
    b.textContent = text;
    b.onclick = () => answer(i);
    box.appendChild(b);
  });
}

function answer(i) {
  if (answered) return;
  answered = true;
  const q = QUESTIONS[idx];
  const ok = i === q.answer;
  if (ok) score++;
  history.push(ok);

  const btns = $("options").children;
  for (let k = 0; k < btns.length; k++) {
    btns[k].disabled = true;
    if (k === q.answer) btns[k].classList.add("ok");
    else if (k === i) btns[k].classList.add("ng");
  }

  const correct = q.type === "pos" ? POS[q.answer] : "(" + "ABCD"[q.answer] + ") " + q.choices[q.answer];
  let html = '<div class="head">' + (ok ? "⭕ 正解！" : "❌ 不正解") + "</div>";
  html += "<p><b>正解:</b> " + correct + "</p>";
  if (q.type === "pos") {
    html += "<p><b>ルール:</b> " + q.rule + "</p>";
    html += "<p><b>同じ特徴の単語:</b> " + q.mates + "</p>";
    html += '<p><b>例文:</b><br><span class="en">' + q.en + "</span><br>" + q.ja + "</p>";
  } else {
    html += "<p><b>解説:</b> " + q.reason + "</p>";
    html += '<p><b>完成文:</b><br><span class="en">' + q.sentence.replace("____", q.choices[q.answer]) + "</span><br>" + q.ja + "</p>";
  }
  const r = $("result");
  r.className = "res " + (ok ? "ok" : "ng");
  r.innerHTML = html;

  const n = $("next");
  n.textContent = idx === QUESTIONS.length - 1 ? "結果を見る" : "次の問題へ";
  n.classList.remove("hide");
  n.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function next() {
  idx++;
  if (idx < QUESTIONS.length) show(); else finish();
}

function finish() {
  $("quiz").classList.add("hide");
  $("end").classList.remove("hide");
  $("score").textContent = score + " / " + QUESTIONS.length;
  const rate = score / QUESTIONS.length;
  $("comment").textContent = rate === 1 ? "全問正解！完璧です！" : rate >= 0.7 ? "よくできました！あと一歩です。" : "接尾辞ルールを見直して、もう一度挑戦しましょう。";
  $("review").innerHTML = '<ul class="list">' + history.map((ok, i) => {
    const q = QUESTIONS[i];
    return "<li>" + (ok ? "⭕" : "❌") + " 第" + (i + 1) + "問: " + (q.type === "pos" ? q.word : q.sentence) + "</li>";
  }).join("") + "</ul>";
}

$("next").onclick = next;
$("retry").onclick = start;
start();
