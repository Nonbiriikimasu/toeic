// ===== 設定 =====
const POS = ["名詞", "動詞", "形容詞", "副詞"];

// ===== 接尾辞グループ =====
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
  xnoun:{ p: 0, r: "語尾は -al ですが、これは名詞になる例外単語です(removal=除去 など)。", l: "proposal(提案), approval(承認), removal(除去), arrival(到着), refusal(拒否), denial(否定)" }
};

// ===== 品詞識別プール =====
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
  ["financial","cial","The financial report is due on Monday.","財務報告書の提出期限は月曜日だ。"],
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
  ["installation","tion","The installation will take two hours.","設置には2時間かかる。"],
  ["assistance","ance","Thank you for your assistance.","ご協力ありがとうございます。"],
  ["capacity","ty","The hall has a capacity of 300.","そのホールの収容人数は300人だ。"],
  ["generate","ate","The campaign will generate new interest.","そのキャンペーンは新たな関心を生むだろう。"],
  ["summarize","ize","Please summarize the main points.","要点をまとめてください。"],
  ["lengthen","en","They plan to lengthen the runway.","彼らは滑走路を延長する計画だ。"],
  ["continuous","ous","We offer continuous support.","私たちは継続的なサポートを提供している。"],
  ["reliable","ble","He is a reliable partner.","彼は信頼できるパートナーだ。"],
  ["currently","ly","We are currently hiring.","当社は現在採用中です。"],
  ["orderly","xly","Please leave in an orderly manner.","整然と退出してください。"]
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
    r:"冠詞(an)と名詞(speech)の間は【形容詞】。-sive で終わる impressive が形容詞です。", ja:"CEOは会議で印象的なスピーチを行った。" },
  { s:"The ____ of the project depends on our budget.", c:["complete","completion","completely","completed"], a:1,
    r:"冠詞(The)の後ろで主語になるのは【名詞】。-tion で終わる completion(完成)が名詞です。", ja:"プロジェクトの完成は私たちの予算次第だ。" },
  { s:"Employees must follow the safety rules ____.", c:["strict","strictly","strictness","stricter"], a:1,
    r:"文が完成している(動詞 follow + 目的語)ので、後ろには動詞を修飾する【副詞】が入ります。strict + ly = strictly(厳密に)。", ja:"従業員は安全規則を厳守しなければならない。" },
  { s:"The hotel offers a ____ breakfast to all guests.", c:["complimentary","compliment","complimentarily","complimenting"], a:0,
    r:"冠詞(a)と名詞(breakfast)の間は【形容詞】。complimentary(無料の)は -ary で終わる形容詞です。", ja:"そのホテルは全宿泊客に無料の朝食を提供している。" },
  { s:"Ms. Chen was promoted because of her ____ to the company.", c:["dedicate","dedicated","dedication","dedicatedly"], a:2,
    r:"所有格(her)の後ろは【名詞】。-tion で終わる dedication(献身)が正解です。", ja:"チェンさんは会社への献身ぶりが認められて昇進した。" },
  { s:"The ____ for this position must have five years of experience.", c:["apply","applicant","applicable","applied"], a:1,
    r:"冠詞(The)の後ろの主語は【名詞】。-ant / -ent は人を表す名詞にもなります(applicant=応募者)。applicable は形容詞です。", ja:"この職の応募者は5年の経験が必要だ。" },
  { s:"We were ____ with the quality of the service.", c:["satisfy","satisfied","satisfaction","satisfactorily"], a:1,
    r:"be動詞の後ろの補語で、「満足している」という状態を表す形容詞(過去分詞形)satisfied が入ります。", ja:"私たちはサービスの質に満足した。" },
  { s:"Our engineers work ____ to finish the project on time.", c:["diligent","diligently","diligence","diligences"], a:1,
    r:"動詞(work)を修飾するのは【副詞】。diligent + ly = diligently(勤勉に)です。", ja:"エンジニアたちは期限内にプロジェクトを終えるため、懸命に働いている。" },
  { s:"The training session was extremely ____.", c:["inform","information","informative","informatively"], a:2,
    r:"be動詞の補語には【形容詞】。副詞 extremely が修飾する先も形容詞です。-tive で終わる informative(有益な)が正解です。", ja:"その研修は非常に有益だった。" }
];

// ===== 動詞問題プール =====
const POOL_VERB = [
  { t:"主述の一致", s:"The director of the marketing team ____ a meeting every Monday.", c:["hold","holds","holding","have held"], a:1,
    r:"主語は The director(単数)。of ~ は修飾語で、動詞の数には影響しません。every Monday は現在の習慣なので、三単現の s が付いた holds が正解です。", ja:"マーケティングチームの部長は毎週月曜日に会議を開く。" },
  { t:"主述の一致", s:"All of the employees ____ required to attend the safety training.", c:["is","are","be","being"], a:1,
    r:"All of the employees の中心は複数形の employees。複数主語なので are。is は単数主語用です。", ja:"全従業員が安全研修への出席を求められている。" },
  { t:"主述の一致", s:"Each of the managers ____ a company car.", c:["have","has","having","are having"], a:1,
    r:"Each of ~ は「それぞれ」で、単数扱いです。単数主語には has。複数形の managers に引っ張られないよう注意しましょう。", ja:"マネージャーはそれぞれ社用車を持っている。" },
  { t:"主述の一致", s:"The number of applicants ____ increased this year.", c:["have","has","are","were"], a:1,
    r:"the number of ~ は「~の数」で単数扱い(a number of ~ は「多くの~」で複数扱い)。this year と完了形から has increased になります。", ja:"今年は応募者の数が増えている。" },
  { t:"態(能動・受動)", s:"The report will ____ by the finance team by Friday.", c:["complete","be completed","completing","completes"], a:1,
    r:"主語 The report は「完成させられる」側なので受動態(be + 過去分詞)。will の後ろなので be completed です。by the finance team(行為者)も受動態のヒントです。", ja:"報告書は金曜日までに財務チームによって完成される予定だ。" },
  { t:"態(能動・受動)", s:"Ms. Lee ____ the new branch last year.", c:["was opened","opened","is opened","opening"], a:1,
    r:"後ろに目的語 the new branch があるので能動態。受動態は目的語を取れません。last year は過去を表すキーワードなので opened です。", ja:"リーさんは昨年、新支店を開設した。" },
  { t:"態(能動・受動)", s:"All invoices must ____ before the end of the month.", c:["submit","be submitted","submitting","submits"], a:1,
    r:"請求書(invoices)は「提出される」側なので受動態。助動詞 must の後ろは be + 過去分詞です。", ja:"すべての請求書は月末までに提出されなければならない。" },
  { t:"態(能動・受動)", s:"The new product line ____ at the trade show next week.", c:["will introduce","will be introduced","introduces","has introduced"], a:1,
    r:"製品ラインは「紹介される」側なので受動態。next week は未来のキーワードで、will be introduced になります。", ja:"新製品ラインは来週の見本市で発表される予定だ。" },
  { t:"時制", s:"The company ____ its headquarters to Osaka last year.", c:["moves","will move","moved","has moved"], a:2,
    r:"last year は過去の一点を表すキーワード。過去形 moved が正解です。has moved(現在完了)は last year のような過去を示す語とは使えません。", ja:"その会社は昨年、本社を大阪に移した。" },
  { t:"時制", s:"We ____ the new software since January.", c:["use","used","have used","will use"], a:2,
    r:"since January(1月から今まで)は現在完了のキーワード。have used が正解です。for ten years や since + 過去の時点も同様です。", ja:"私たちは1月から新しいソフトを使っている。" },
  { t:"時制", s:"The train ____ at 9:00 tomorrow morning.", c:["departed","departs","departing","has departed"], a:1,
    r:"tomorrow があっても、電車など確定した時刻表の予定は現在形で表します。departed(過去)・has departed(完了)は明日とは合いません。", ja:"電車は明日の朝9時に出発する。" },
  { t:"時制", s:"Mr. Park ____ here for ten years.", c:["works","worked","has worked","will work"], a:2,
    r:"for ten years(10年間)は現在完了のキーワード。過去から今まで続く継続を表す has worked が正解です。", ja:"パクさんはここで10年間働いている。" },
  { t:"時制", s:"Please call me as soon as the shipment ____.", c:["will arrive","arrives","arrived","arriving"], a:1,
    r:"as soon as / when / if など、時・条件を表す副詞節の中では、未来のことでも現在形を使います。will arrive は不可です。", ja:"荷物が届いたらすぐに電話してください。" },
  { t:"時制", s:"By the time the manager arrived, the meeting ____.", c:["already started","had already started","will start","starts"], a:1,
    r:"by the time + 過去形(到着した時点)より前に始まっていたので、過去完了 had already started が正解です。", ja:"部長が到着した時には、会議はすでに始まっていた。" },
  { t:"主述の一致", s:"The documents on the desk ____ to be signed by the director.", c:["needs","need","needing","has needed"], a:1,
    r:"主語の中心は複数形の documents。on the desk は修飾語です。複数主語なので動詞は need(s は付かない)です。", ja:"机の上の書類は部長の署名が必要だ。" },
  { t:"主述の一致", s:"Every employee ____ a security badge.", c:["wear","wears","are wearing","have worn"], a:1,
    r:"Every + 単数名詞は単数扱い。現在の習慣を表す文なので、三単現の s が付いた wears が正解です。", ja:"従業員は全員、セキュリティバッジを身につけている。" },
  { t:"態(能動・受動)", s:"Our flight ____ due to the bad weather.", c:["cancelled","was cancelled","cancel","cancelling"], a:1,
    r:"主語 flight は「キャンセルされる」側で、後ろに目的語がないので受動態(was + 過去分詞)です。due to ~(~のため)が原因を表しています。", ja:"悪天候のため、私たちの便は欠航になった。" },
  { t:"態(能動・受動)", s:"Ms. Kato ____ to vice president last week.", c:["promoted","was promoted","has promoted","promoting"], a:1,
    r:"「昇進させられた」ので受動態。後ろは目的語ではなく to ~ なので、be + promoted です。last week は過去のキーワードです。", ja:"加藤さんは先週、副社長に昇進した。" },
  { t:"時制", s:"Sales ____ steadily over the past three years.", c:["grow","grew","have grown","will grow"], a:2,
    r:"over the past three years(過去3年間)は現在完了のキーワード。have grown(増え続けてきた)が正解です。", ja:"売上は過去3年間、着実に伸びてきた。" },
  { t:"時制", s:"I will send you the file once I ____ the report.", c:["will finish","finish","finishing","finished"], a:1,
    r:"once(~したら)は時・条件を表す副詞節をつくります。未来のことでも節の中は現在形(finish)を使います。", ja:"報告書を終えたら、すぐにファイルをお送りします。" }
];

// ===== 前置詞 vs 接続詞プール =====
// ===== 語彙問題プール（意味で選ぶ Part 5 形式）=====
const POOL_VOCAB = [
  { t:"語彙", s:"The company decided to ____ its operations to Southeast Asia.", c:["expand","expend","expire","explain"], a:0,
    r:"expand(拡大する) / expend(費やす) / expire(期限が切れる) / explain(説明する)。「事業を東南アジアに広げる」なので expand です。", ja:"その会社は事業を東南アジアに拡大することに決めた。" },
  { t:"語彙", s:"All employees are required to ____ with the safety regulations.", c:["comply","apply","reply","rely"], a:0,
    r:"comply with ~(~に従う) / apply for ~(~に応募する) / reply to ~(~に返信する) / rely on ~(~に頼る)。後ろの with と結びつくのは comply です。", ja:"全従業員は安全規則に従う必要がある。" },
  { t:"語彙", s:"The warranty will ____ at the end of this month.", c:["expire","expand","exceed","examine"], a:0,
    r:"expire(期限が切れる) / expand(拡大する) / exceed(超える) / examine(調べる)。保証が「切れる」ので expire です。", ja:"保証は今月末で期限が切れる。" },
  { t:"語彙", s:"We need to ____ a meeting room for Friday's presentation.", c:["reserve","deserve","preserve","observe"], a:0,
    r:"reserve(予約する) / deserve(~に値する) / preserve(保存する) / observe(観察する)。会議室を「予約する」ので reserve です。", ja:"金曜日のプレゼンのために会議室を予約する必要がある。" },
  { t:"語彙", s:"The new tax law will ____ all small businesses.", c:["affect","suspect","inspect","neglect"], a:0,
    r:"affect(影響する) / suspect(疑う) / inspect(検査する) / neglect(怠る)。法律が「影響を与える」ので affect です。", ja:"新しい税法はすべての小規模事業者に影響を与えるだろう。" },
  { t:"語彙", s:"Our company offers a ____ benefits package to all employees.", c:["comprehensive","reluctant","hesitant","obvious"], a:0,
    r:"comprehensive(包括的な) / reluctant(気が進まない) / hesitant(ためらう) / obvious(明らかな)。福利厚生が「充実した」ので comprehensive です。", ja:"当社は全従業員に充実した福利厚生を提供している。" },
  { t:"語彙", s:"The restaurant is famous for its ____ service and fresh ingredients.", c:["prompt","vacant","tentative","hazardous"], a:0,
    r:"prompt(迅速な) / vacant(空いている) / tentative(仮の) / hazardous(危険な)。サービスが「迅速な」ので prompt です。", ja:"そのレストランは迅速なサービスと新鮮な食材で有名だ。" },
  { t:"語彙", s:"The new system is ____ more efficient than the old one.", c:["considerably","hardly","barely","seldom"], a:0,
    r:"considerably(かなり) / hardly(ほとんど~ない) / barely(かろうじて) / seldom(めったに~ない)。比較級を強めて「かなり」と言うので considerably です。", ja:"新システムは旧システムよりかなり効率的だ。" },
  { t:"語彙", s:"Sales have ____ sharply since last spring.", c:["increased","assigned","obtained","required"], a:0,
    r:"increase(増える) / assign(割り当てる) / obtain(得る) / require(必要とする)。目的語がなく sharply(急激に)が続くので、自動詞の increased です。", ja:"売上は昨年の春から急激に伸びている。" },
  { t:"語彙", s:"The package must be ____ to the customer by Thursday.", c:["delivered","devoted","demanded","decorated"], a:0,
    r:"deliver(配達する) / devote(捧げる) / demand(要求する) / decorate(飾る)。荷物が「届けられる」ので delivered です。", ja:"荷物は木曜日までにお客様へ届けなければならない。" }
];

const POOL_PC = [
  { s:"The office will be closed ____ the holidays.", c:["during","while","because","although"], a:0,
    r:"後ろは名詞(the holidays)なので前置詞 during。while は後ろに S+V が続く接続詞です。(during + 名詞 / while + S+V)", ja:"事務所は休暇期間中は閉まる。" },
  { s:"____ the manager was away, the assistant handled the calls.", c:["During","While","Despite","Due to"], a:1,
    r:"後ろが S+V(the manager was away)なので接続詞 while。During / Despite / Due to はすべて前置詞で、後ろに名詞が必要です。", ja:"部長が不在の間、アシスタントが電話に対応した。" },
  { s:"The flight was delayed ____ heavy snow.", c:["because","because of","although","while"], a:1,
    r:"後ろは名詞(heavy snow)なので前置詞句 because of。because は S+V が続く接続詞です。(because of + 名詞 / because + S+V)", ja:"大雪のため、その便は遅れた。" },
  { s:"The flight was delayed ____ it snowed heavily.", c:["because","because of","despite","due to"], a:0,
    r:"後ろが S+V(it snowed heavily)なので接続詞 because。because of / due to / despite は前置詞で、節は続けられません。", ja:"大雪が降ったため、その便は遅れた。" },
  { s:"____ the high price, the product sold well.", c:["Although","Despite","Even though","Because"], a:1,
    r:"後ろは名詞(the high price)なので前置詞 Despite(= in spite of)。Although / Even though / Because は接続詞で S+V が必要です。", ja:"価格が高いにもかかわらず、その商品はよく売れた。" },
  { s:"____ the product was expensive, it sold well.", c:["Despite","In spite of","Although","Due to"], a:2,
    r:"後ろが S+V(the product was expensive)なので接続詞 Although。Despite / In spite of は前置詞です。(Although + S+V / Despite + 名詞)", ja:"その商品は高価だったが、よく売れた。" },
  { s:"The event was canceled ____ the bad weather.", c:["due to","since","as","though"], a:0,
    r:"後ろは名詞(the bad weather)なので前置詞 due to(= owing to)。since / as / though は接続詞で、S+V を伴います。", ja:"悪天候のため、イベントは中止された。" },
  { s:"We have not received any complaints ____ the new system was introduced.", c:["since","during","despite","owing to"], a:0,
    r:"後ろが S+V(the new system was introduced)なので接続詞 since(~以来)。during / despite / owing to は前置詞です。", ja:"新システムの導入以来、苦情は一件も受けていない。" },
  { s:"____ his lack of experience, he was hired as a manager.", c:["Even though","Notwithstanding","Because","While"], a:1,
    r:"後ろは名詞(his lack of experience)なので前置詞 Notwithstanding(= despite)。Even though / Because / While は接続詞です。", ja:"経験不足にもかかわらず、彼は部長として採用された。" },
  { s:"Sales dropped ____ the economic slowdown.", c:["owing to","as","because","although"], a:0,
    r:"後ろは名詞(the economic slowdown)なので前置詞 owing to(= due to)。as / because / although は接続詞で S+V が必要です。", ja:"景気の減速により、売上は落ち込んだ。" },
  { s:"____ she was tired, she finished the report.", c:["Despite","Though","In spite of","Owing to"], a:1,
    r:"後ろが S+V(she was tired)なので接続詞 Though(= although)。Despite / In spite of / Owing to は前置詞です。", ja:"彼女は疲れていたが、報告書を仕上げた。" },
  { s:"Please keep your phone off ____ the presentation.", c:["while","during","because","though"], a:1,
    r:"後ろは名詞(the presentation)なので前置詞 during。同じ「~の間」でも while は後ろに S+V が必要です。", ja:"プレゼンテーション中は携帯電話の電源を切ってください。" },
  { s:"The staff worked overtime ____ the deadline was approaching.", c:["as","despite","due to","during"], a:0,
    r:"後ろが S+V(the deadline was approaching)なので接続詞。as は「~なので」の意味で使えます。despite / due to / during は前置詞です。", ja:"締め切りが近づいていたため、スタッフは残業した。" },
  { s:"He studied law at night ____ he worked at the bank.", c:["during","while","despite","in spite of"], a:1,
    r:"後ろが S+V(he worked at the bank)なので接続詞 while(~する間に)。during / despite / in spite of は前置詞です。", ja:"彼は銀行で働きながら、夜に法律を勉強した。" },
  { s:"____ the renovation, the museum will remain open.", c:["During","While","Although","Because"], a:0,
    r:"後ろは名詞(the renovation)なので前置詞 During。While / Although / Because は後ろに S+V が必要な接続詞です。", ja:"改装中も、美術館は開館したままだ。" },
  { s:"Customers can park for free ____ they shop in our store.", c:["during","while","despite","because of"], a:1,
    r:"後ろが S+V(they shop)なので接続詞 while。during / despite / because of は前置詞で、名詞が必要です。", ja:"お客様は店内でお買い物中は無料で駐車できる。" },
  { s:"The meeting was postponed ____ the director's illness.", c:["because","because of","although","so that"], a:1,
    r:"後ろは名詞句(the director's illness)なので前置詞句 because of。because は S+V が続く接続詞です。", ja:"部長の病気のため、会議は延期された。" },
  { s:"____ our efforts, we could not meet the deadline.", c:["Although","In spite of","Because","Even though"], a:1,
    r:"後ろは名詞(our efforts)なので前置詞句 In spite of(= despite)。Although / Because / Even though は接続詞です。", ja:"私たちの努力にもかかわらず、締め切りに間に合わなかった。" },
  { s:"____ the shop was crowded, we found a table quickly.", c:["Despite","Though","In spite of","Due to"], a:1,
    r:"後ろが S+V(the shop was crowded)なので接続詞 Though。Despite / In spite of / Due to は前置詞です。", ja:"店は混んでいたが、私たちはすぐに席を見つけた。" },
  { s:"We will begin the tour ____ everyone has arrived.", c:["once","during","despite","owing to"], a:0,
    r:"後ろが S+V(everyone has arrived)なので接続詞 once(~したらすぐ)。during / despite / owing to は前置詞です。", ja:"全員が到着したら、ツアーを始めます。" }
];

// ===== 代名詞・関係詞・比較プール =====
const POOL_MISC = [
  { t:"代名詞(所有格)", s:"Mr. Smith submitted ____ quarterly report to the director.", c:["he","his","him","himself"], a:1,
    r:"名詞(quarterly report)の前には【所有格】が入ります。his(彼の)が正解です。", ja:"スミス氏は部長に四半期報告書を提出した。" },
  { t:"代名詞(再帰代名詞)", s:"The CEO ____ inspected the new factory in Nagoya.", c:["he","his","him","himself"], a:3,
    r:"主語(The CEO)を強調する「CEO自身が」という意味で【再帰代名詞 himself】が入ります。", ja:"CEO自らが名古屋の新工場を視察した。" },
  { t:"代名詞(所有代名詞)", s:"Her sales figures were higher than ____.", c:["my","me","mine","myself"], a:2,
    r:"「私のもの(my sales figures)」を意味する【所有代名詞 mine】が入ります。than my は後ろに名詞が必要です。", ja:"彼女の売上数字は私のものより高かった。" },
  { t:"代名詞(指示代名詞)", s:"The products made in Japan are better than ____ imported from overseas.", c:["that","those","this","them"], a:1,
    r:"複数名詞(products)の繰り返しを避ける指示代名詞は【those】です。(単数なら that)", ja:"日本製の製品は海外から輸入されたものより優れている。" },
  { t:"関係代名詞(主格)", s:"We need to hire a technician ____ has experience with robotics.", c:["who","which","whose","whom"], a:0,
    r:"先行詞が「人(technician)」で、直後に動詞(has)が続いているため【主格の who】が正解です。", ja:"ロボット工学の経験がある技術者を雇う必要がある。" },
  { t:"関係代名詞(所有格)", s:"The company interviewed a candidate ____ background is in digital marketing.", c:["who","which","whose","whom"], a:2,
    r:"先行詞(candidate)と直後の名詞(background)の間で「〜の」という所有関係が成り立つため【whose】が正解です。", ja:"その会社はデジタルマーケティングの経歴を持つ候補者と面接した。" },
  { t:"関係代名詞(目的格/物)", s:"This is the software ____ the IT department recommended.", c:["who","whom","whose","which"], a:3,
    r:"先行詞が「物(software)」なので【which】(または that)が正解です。", ja:"これがIT部門が推奨したソフトウェアです。" },
  { t:"関係副詞(場所)", s:"This is the facility ____ all our products are tested.", c:["where","when","which","who"], a:0,
    r:"先行詞が「場所(facility)」で、後ろに完全な文(S+V+受動態)が続いているため【関係副詞 where】が正解です。", ja:"ここが当社の全製品がテストされる施設です。" },
  { t:"比較(比較級)", s:"This year's revenue is much ____ than last year's.", c:["high","higher","highest","highly"], a:1,
    r:"than(〜より)があるため【比較級 higher】が正解です。much は比較級を強調します(× much high)。", ja:"今年の収益は去年より大幅に高い。" },
  { t:"比較(原級構文)", s:"The new computer runs as ____ as the previous model.", c:["fast","faster","fastest","fastly"], a:0,
    r:"as ... as(〜と同じくらい)の間には【原級】が入ります。動詞 runs を修飾する副詞の原級 fast が正解です。", ja:"新しいコンピューターは以前のモデルと同じくらい速く動作する。" },
  { t:"比較(最上級)", s:"Ms. Davis is the ____ qualified applicant for the position.", c:["more","most","much","many"], a:1,
    r:"the + 【最上級】+ 名詞 の形です。most qualified(最も適任な)が正解です。", ja:"デイビスさんはその職に最も適した応募者だ。" },
  { t:"比較(倍数表現)", s:"The new factory produces twice as ____ goods as the old one.", c:["many","much","more","most"], a:0,
    r:"「倍数 + as many + 可算名詞の複数形 + as」の形です。goods(製品)は可算名詞の複数形なので many です。", ja:"新工場は旧工場の2倍の製品を生産している。" },
  { t:"代名詞(目的格)", s:"Please contact ____ if you have any questions.", c:["we","our","us","ours"], a:2,
    r:"動詞 contact の目的語になるので【目的格 us】が入ります。we は主格、our は所有格、ours は所有代名詞です。", ja:"ご質問があれば、私たちにご連絡ください。" },
  { t:"代名詞(再帰代名詞)", s:"The manager asked the staff to do the work ____.", c:["they","their","them","themselves"], a:3,
    r:"主語(the staff)自身が行うことを表す【再帰代名詞 themselves】が入ります(自分たちで)。", ja:"部長はスタッフに、その仕事を自分たちでやるよう頼んだ。" },
  { t:"関係代名詞(主格)", s:"Employees ____ complete the form will receive a bonus.", c:["who","whom","whose","which"], a:0,
    r:"先行詞が人(Employees)で、直後に動詞(complete)が来るため【主格 who】です。", ja:"用紙を記入した従業員は賞与を受け取る。" },
  { t:"関係代名詞(非制限用法)", s:"The conference, ____ was held in Tokyo, attracted 500 people.", c:["that","which","who","whose"], a:1,
    r:"カンマの後ろ(非制限用法)では that は使えません。先行詞が物(conference)なので【which】が正解です。", ja:"その会議は東京で開かれ、500人を集めた。" },
  { t:"比較(比較級)", s:"Our new model is far ____ than the old one.", c:["reliable","more reliable","most reliable","reliably"], a:1,
    r:"than があるので比較級。reliable のような長い形容詞は more を付けます。far は比較級を強調します。", ja:"新モデルは旧モデルよりはるかに信頼できる。" },
  { t:"関係代名詞(所有格)", s:"The staff members ____ names are listed below will attend the seminar.", c:["who","which","whose","whom"], a:2,
    r:"先行詞(staff members)と名詞(names)が「〜の」の関係にあるので【whose】が正解です。", ja:"下に名前が載っているスタッフがセミナーに出席する。" }
];

// ===== モード定義 =====
const MODES = [
  { id: 1, name: "品詞識別クイズ", desc: "接尾辞ルール・形容詞の例外・語形変化(12問)" },
  { id: 2, name: "動詞問題クイズ", desc: "主述の一致・態・時制(10問)" },
  { id: 3, name: "前置詞 vs 接続詞クイズ", desc: "後ろは名詞？ それとも S+V？(10問)" },
  { id: 4, name: "代名詞・関係詞・比較クイズ", desc: "格の使い分け・whose/where・比較級・最上級(10問)" },
  { id: 5, name: "Part 5 総合予想模試", desc: "全ジャンルの4択穴埋め問題からランダム出題(10 / 20 / 30問)" }
];

// ===== ユーティリティ =====
const $ = (id) => document.getElementById(id);
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

const toPos = ([word, g, en, ja]) => {
  const grp = G[g];
  const mates = grp.l.split(", ").filter(w => w.split("(")[0] !== word).join(", ");
  return { type: "pos", cat: "品詞識別", word, answer: grp.p, rule: grp.r, mates, en, ja };
};
const toP5 = (q, cat) => ({ type: "p5", cat, sentence: q.s, choices: q.c, answer: q.a, reason: q.r, ja: q.ja });

function build(mode, n) {
  const pos = () => shuffle(POOL_POS).map(toPos);
  const form = () => shuffle(POOL_P5).map(q => toP5(q, "語形変化"));
  const verb = () => shuffle(POOL_VERB).map(q => toP5(q, "動詞(" + q.t + ")"));
  const pc = () => shuffle(POOL_PC).map(q => toP5(q, "前置詞 vs 接続詞"));
  const misc = () => shuffle(POOL_MISC).map(q => toP5(q, q.t));
  const vocab = () => shuffle(POOL_VOCAB).map(q => toP5(q, "語彙"));
  if (mode === 1) return pos().slice(0, 7).concat(form().slice(0, 5));
  if (mode === 2) return verb().slice(0, 10);
  if (mode === 3) return pc().slice(0, 10);
  if (mode === 4) return misc().slice(0, 10);
  // 総合模試は「4択の穴埋め問題」だけから出題（品詞単語クイズは含めない）
  return shuffle(form().concat(verb(), pc(), misc(), vocab())).slice(0, n);
}

// ===== グローバル状態管理 =====
let QUESTIONS = [], idx = 0, score = 0, answered = false, log = [], curMode = 1, curCount = 10;
let timerLimit = 0; // 0: なし, 10, 15, 20
let timerId = null;
let startTime = 0;
let timeLogs = []; // 各問の所要秒数

function go(name) {
  ["home", "quiz", "end"].forEach(s => $(s).classList.toggle("hide", s !== name));
  window.scrollTo(0, 0);
}

function renderHome() {
  const menu = $("menu");
  menu.innerHTML = "";
  MODES.forEach(m => {
    const b = document.createElement("button");
    b.className = "mode";
    b.innerHTML = "<b>モード" + m.id + "：" + m.name + "</b><span>" + m.desc + "</span>";
    b.onclick = () => {
      if (m.id === 5) { $("counts").classList.remove("hide"); $("counts").scrollIntoView({ behavior: "smooth", block: "nearest" }); }
      else begin(m.id, 0);
    };
    menu.appendChild(b);
  });
  $("counts").classList.add("hide");
}

function begin(mode, n) {
  curMode = mode; curCount = n;
  QUESTIONS = build(mode, n);
  idx = 0; score = 0; log = []; timeLogs = [];
  go("quiz");
  show();
}

function updateAcc() {
  $("acc").textContent = log.length ? "正解率 " + Math.round(score / log.length * 100) + "%（" + score + "/" + log.length + "）" : "正解率 --";
}

function show() {
  clearInterval(timerId);
  const q = QUESTIONS[idx];
  answered = false;
  $("bar").style.width = (idx / QUESTIONS.length * 100) + "%";
  $("result").classList.add("hide");
  $("next").classList.add("hide");
  $("meta").textContent = "第 " + (idx + 1) + " 問 / " + QUESTIONS.length + " (" + q.cat + ")";
  updateAcc();

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
    b.onclick = () => answer(i, false);
    box.appendChild(b);
  });

  // 時間計測開始（時刻ベースなので、ずれ・タブ切替に強い）
  startTime = Date.now();
  const badge = $("timerBadge");
  if (timerLimit > 0) {
    const deadline = startTime + timerLimit * 1000;
    badge.classList.remove("hide", "warn");
    const tick = () => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      badge.textContent = "⏱️ " + left + "秒";
      if (left <= 5) badge.classList.add("warn");
      if (left <= 0) { clearInterval(timerId); answer(-1, true); }
    };
    tick();
    timerId = setInterval(tick, 250);
  } else {
    badge.classList.add("hide");
  }
}

function answer(i, isTimeUp) {
  if (answered) return;
  answered = true;
  clearInterval(timerId);

  // 回答時間計測（秒）
  const elapsed = Math.min((Date.now() - startTime) / 1000, timerLimit || 999);
  const roundedTime = Math.round(elapsed * 10) / 10;
  timeLogs.push(roundedTime);

  const q = QUESTIONS[idx];
  const ok = !isTimeUp && i === q.answer;
  if (ok) score++;
  log.push(ok);
  updateAcc();

  const btns = $("options").children;
  for (let k = 0; k < btns.length; k++) {
    btns[k].disabled = true;
    if (k === q.answer) btns[k].classList.add("ok");
    else if (k === i) btns[k].classList.add("ng");
  }

  const correct = q.type === "pos" ? POS[q.answer] : "(" + "ABCD"[q.answer] + ") " + q.choices[q.answer];
  
  let headText = ok ? "⭕ 正解！" : (isTimeUp ? "❌ 時間切れ！（解答なし）" : "❌ 不正解");
  let html = '<div class="head">' + headText + ' <span style="font-size:0.9rem; font-weight:normal; color:var(--sub);">(' + roundedTime + '秒)</span></div>';
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
  clearInterval(timerId);
  go("end");
  const pct = Math.round(score / QUESTIONS.length * 100);
  
  // 平均タイム計算
  const totalTime = timeLogs.reduce((a, b) => a + b, 0);
  const avgTime = (totalTime / timeLogs.length).toFixed(1);

  $("score").textContent = score + " / " + QUESTIONS.length;
  $("pct").textContent = "正解率 " + pct + "%";
  $("avgTime").textContent = "⏱️ 平均回答時間: " + avgTime + " 秒 / 問 (合計 " + Math.round(totalTime) + " 秒)";

  $("comment").textContent = pct === 100 ? "全問正解！素晴らしい解答スピードです！" : pct >= 70 ? "合格ラインです！復習してさらにスピードを上げましょう。" : "解説を見直して、もう一度挑戦しましょう。";
  
  $("review").innerHTML = '<ul class="list">' + log.map((ok, i) => {
    const q = QUESTIONS[i];
    const t = timeLogs[i] !== undefined ? " (" + timeLogs[i] + "秒)" : "";
    return "<li>" + (ok ? "⭕" : "❌") + " 第" + (i + 1) + "問" + t + ": " + (q.type === "pos" ? q.word : q.sentence) + "</li>";
  }).join("") + "</ul>";
}

// ===== イベント登録 =====
document.addEventListener("click", (e) => {
  const b = e.target.closest(".t-btn");
  if (!b) return;
  document.querySelectorAll(".t-btn").forEach(x => x.classList.remove("active"));
  b.classList.add("active");
  timerLimit = Number(b.dataset.t);
});
timerLimit = Number((document.querySelector(".t-btn.active") || { dataset: { t: 0 } }).dataset.t);

$("next").onclick = next;
$("retry").onclick = () => begin(curMode, curCount);
$("toHome").onclick = () => { renderHome(); go("home"); };
$("back").onclick = () => {
  if (confirm("トップに戻りますか？\n進行中の結果は失われます。")) {
    clearInterval(timerId);
    renderHome();
    go("home");
  }
};
$("cancelCount").onclick = () => $("counts").classList.add("hide");
document.querySelectorAll("[data-n]").forEach(b => { b.onclick = () => begin(5, Number(b.dataset.n)); });

renderHome();
go("home");
