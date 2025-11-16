'use client'
import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const GeoscienceEducationAnalysis = () => {
  // 大学入学共通テスト受験者数データ（令和3-7年度）
  const commonTestData = [
    { year: 'R3', physics: 146041, chemistry: 182359, biology: 57878, geoscience: 1356 },
    { year: 'R4', physics: 148585, chemistry: 184028, biology: 58676, geoscience: 1350 },
    { year: 'R5', physics: 144914, chemistry: 182224, biology: 57895, geoscience: 1659 },
    { year: 'R6', physics: 142525, chemistry: 180779, biology: 56596, geoscience: 1792 },
    { year: 'R7', physics: 144761, chemistry: 183154, biology: 57985, geoscience: 2365 },
  ];

  // 令和7年度平均点データ
  const averageScoreData = [
    { subject: '物理', score: 58.96 },
    { subject: '化学', score: 45.34 },
    { subject: '生物', score: 52.21 },
    { subject: '地学', score: 41.64 },
  ];

  // 履修率データ（2015年度）
  const enrollmentData = [
    { subject: '地学基礎', rate: 26.9 },
    { subject: '地学', rate: 0.8 },
  ];

  // 基礎科目履修率比較（2014年度）
  const basicSubjectsComparison = [
    { subject: '物理基礎', rate: 30.4 },
    { subject: '化学基礎', rate: 94.6 },
    { subject: '生物基礎', rate: 26.3 },
    { subject: '地学基礎', rate: 27.6 },
  ];

	// 令和5年度公立高等学校における教育課程の編成・実施状況調査の結果について（全日制・普通科等）より作成
	// 参照: https://www.mext.go.jp/content/20240626-mxt_kyoiku01-000036713_02.pdf

	const basicSubjectsOffering1 = [
		{ subject: '物理基礎', rate: 30.7 },
		{ subject: '化学基礎', rate: 48.8 },
		{ subject: '生物基礎', rate: 59.2 },
		{ subject: '地学基礎', rate: 7.1 },
	];
	
	const basicSubjectsOffering2 = [
		{ subject: '物理基礎', rate: 57.7 },
		{ subject: '化学基礎', rate: 48.2 },
		{ subject: '生物基礎', rate: 37.7 },
		{ subject: '地学基礎', rate: 36.5 },
	];
	
	const specializedSubjectsOffering3 = [
		{ subject: '物理', rate: 81.0 },
		{ subject: '化学', rate: 78.2 },
		{ subject: '生物', rate: 87.7 },
		{ subject: '地学', rate: 7.4 },
	];

	const gradeOfferingData = [
		{ subject: '物理基礎', grade1: 30.7, grade2: 57.7, grade3: 9.2 },
		{ subject: '化学基礎', grade1: 48.8, grade2: 48.2, grade3: 15.0 },
		{ subject: '生物基礎', grade1: 59.2, grade2: 37.7, grade3: 18.1 },
		{ subject: '地学基礎', grade1: 7.1, grade2: 36.5, grade3: 15.6 },
		{ subject: '物理', grade1: 0.0, grade2: 43.3, grade3: 81.0 },
		{ subject: '化学', grade1: 0.0, grade2: 57.7, grade3: 78.2 },
		{ subject: '生物', grade1: 0.0, grade2: 47.5, grade3: 87.7 },
		{ subject: '地学', grade1: 0.0, grade2: 1.5, grade3: 7.4 },
	];

	const nationalUniversityGeo = [
		["北海道大学", "https://www.hokudai.ac.jp/admission/faculty/general/"],
		["弘前大学", "https://nyushi.hirosaki-u.ac.jp/faculty/requirements/"],
		["東北大学", "https://www.tnc.tohoku.ac.jp/admission.php"],
		["秋田大学", "https://www.akita-u.ac.jp/honbu/exam/ex_kind.html"],
		["山形大学", "https://www.yamagata-u.ac.jp/jp/entrance/faculty/guidelines/"], //総合問題
		["茨城大学", "https://www.ibaraki.ac.jp/admission/index.html"],
		["筑波大学", "https://ac.tsukuba.ac.jp/apply/application-guidelines/"],
		["埼玉大学", "https://www.saitama-u.ac.jp/entrance/requirements/index.html"],
		["千葉大学", "https://www.chiba-u.ac.jp/admissions/gakubu/general.html"],
		["東京大学", "https://www.u-tokyo.ac.jp/ja/admissions/undergraduate/e01_06_01.html"],
		["東京学芸大学", "https://www.u-gakugei.ac.jp/nyushi/gakubu/guidebook.html"],
		["新潟大学", "https://www.niigata-u.ac.jp/admissions/faculty/selection/"],
		["信州大学", "https://www.shinshu-u.ac.jp/ad_portal/selection/index.html"], //後期
	];
	const nationalUniversityScience = [
		["北海道大学", "https://www.hokudai.ac.jp/admission/faculty/general/"],
		["帯広畜産大学", "https://www.obihiro.ac.jp/undergrad-adm/"], //総合問題
		["弘前大学", "https://nyushi.hirosaki-u.ac.jp/faculty/requirements/"],
		["岩手大学", "https://www.iwate-u.ac.jp/admission/undergraduate/info.html"],
		["東北大学", "https://www.tnc.tohoku.ac.jp/admission.php"],
		["秋田大学", "https://www.akita-u.ac.jp/honbu/exam/ex_kind.html"],
		["山形大学", "https://www.yamagata-u.ac.jp/jp/entrance/faculty/guidelines/"],
		["福島大学", "https://nyushi.adb.fukushima-u.ac.jp/yoko-school.html"],
		["茨城大学", "https://www.ibaraki.ac.jp/admission/index.html"],
		["筑波大学", "https://ac.tsukuba.ac.jp/apply/application-guidelines/"],
		["宇都宮大学", "https://admission.utsunomiya-u.ac.jp/entrance-exam-info/faculty-entrance-exam/general/"],
		["群馬大学", "https://www.gunma-u.ac.jp/admission/g2107"],
		["埼玉大学", "https://www.saitama-u.ac.jp/entrance/requirements/index.html"],
		["千葉大学", "https://www.chiba-u.ac.jp/admissions/gakubu/general.html"],
		["東京大学", "https://www.u-tokyo.ac.jp/ja/admissions/undergraduate/e01_06_01.html"],
		["東京学芸大学", "https://www.u-gakugei.ac.jp/nyushi/gakubu/guidebook.html"],
		["東京農工大学", "https://www.tuat.ac.jp/admission/nyushi_gakubu/youkou/"],
		["東京科学大学", "https://www.isct.ac.jp/exam/undergraduate/application_guidelines/"],
		["東京海洋大学", "https://www.kaiyodai.ac.jp/entranceexamination/undergraduate/requirements/"],
		["お茶の水女子大学", "https://www.ao.ocha.ac.jp/application/faculty/index.html"],
		["電気通信大学", "https://www.uec.ac.jp/education/undergraduate/admission/senbatsu_type.html"],
		["横浜国立大学", "https://www.ynu.ac.jp/exam/faculty/essential/"],
		["新潟大学", "https://www.niigata-u.ac.jp/admissions/faculty/selection/"],
		["山梨大学", "https://www.yamanashi.ac.jp/admission"],
		["信州大学", "https://www.shinshu-u.ac.jp/ad_portal/selection/index.html"],
	];
	const nationalUniversityCommonGeo = [
		["北海道大学", "https://www.hokudai.ac.jp/admission/faculty/general/"],
		["北海道教育大学", "https://www.hokkyodai.ac.jp/exam/faculties/exam/download/"],
		["小樽商科大学", "https://nyushi.otaru-uc.ac.jp/examination/guideline/"],
		["帯広畜産大学", "https://www.obihiro.ac.jp/undergrad-adm/"],
		["弘前大学", "https://nyushi.hirosaki-u.ac.jp/faculty/requirements/"],
		["岩手大学", "https://www.iwate-u.ac.jp/admission/undergraduate/info.html"],
		["東北大学", "https://www.tnc.tohoku.ac.jp/admission.php"],
		["宮城教育大学", "https://www.miyakyo-u.ac.jp/admissions/faculty-education-info/"],
		["秋田大学", "https://www.akita-u.ac.jp/honbu/exam/ex_kind.html"],
		["山形大学", "https://www.yamagata-u.ac.jp/jp/entrance/faculty/guidelines/"],
		["福島大学", "https://nyushi.adb.fukushima-u.ac.jp/yoko.html"],
		["茨城大学", "https://www.ibaraki.ac.jp/admission/index.html"],
		["筑波大学", "https://ac.tsukuba.ac.jp/apply/application-guidelines/"],
		["筑波技術大学", "https://www.tsukuba-tech.ac.jp/admission/hs/guideline.html"],
		["宇都宮大学", "https://admission.utsunomiya-u.ac.jp/entrance-exam-info/faculty-entrance-exam/general/"],
		["群馬大学", "https://www.gunma-u.ac.jp/admission/g2107"],
		["埼玉大学", "https://www.saitama-u.ac.jp/entrance/requirements/index.html"],
		["千葉大学", "https://www.chiba-u.ac.jp/admissions/gakubu/general.html"],
		["東京大学", "https://www.u-tokyo.ac.jp/ja/admissions/undergraduate/e01_06_01.html"],
		["東京外国語大学", "https://www.tufs.ac.jp/admission/exam/guideline/"],
		["東京学芸大学", "https://www.u-gakugei.ac.jp/nyushi/gakubu/guidebook.html"],
		["東京農工大学", "https://www.tuat.ac.jp/admission/nyushi_gakubu/youkou/"],
		["東京芸術大学", "https://admissions.geidai.ac.jp/admission/"],
		["東京科学大学", "https://www.isct.ac.jp/exam/undergraduate/application_guidelines/"],
		["東京海洋大学", "https://www.kaiyodai.ac.jp/entranceexamination/undergraduate/requirements/"],
		["お茶の水女子大学", "https://www.ao.ocha.ac.jp/application/faculty/index.html"],
		["電気通信大学", "https://www.uec.ac.jp/education/undergraduate/admission/senbatsu_type.html"],
		["一橋大学", "https://juken.hit-u.ac.jp/admission/info/guidelines/index.html"],
		["横浜国立大学", "https://www.ynu.ac.jp/exam/faculty/essential/"],
		["新潟大学", "https://www.niigata-u.ac.jp/admissions/faculty/selection/"],
		["上越教育大学", "https://www.juen.ac.jp/060admissions/020faculty/005exam/index.html"],
		["山梨大学", "https://www.yamanashi.ac.jp/admission"],
		["信州大学", "https://www.shinshu-u.ac.jp/ad_portal/selection/index.html"],
	];
  const nationalUniversityWithLinks = [
		// 北海道・東北地区
		["北海道大学", "https://www.hokudai.ac.jp/admission/faculty/general/"],
		["北海道教育大学", "https://www.hokkyodai.ac.jp/exam/faculties/exam/download/"],
		["室蘭工業大学", "https://muroran-it.ac.jp/entrance/admission/exam/uee/"],
		["小樽商科大学", "https://nyushi.otaru-uc.ac.jp/examination/guideline/"],
		["帯広畜産大学", "https://www.obihiro.ac.jp/undergrad-adm/"],
		["旭川医科大学", "https://www.asahikawa-med.ac.jp/admission/exam/faculty_app_guidebook/"],
		["北見工業大学", "https://www.kitami-it.ac.jp/info/faculty/bosyuyoko/"],
		["弘前大学", "https://nyushi.hirosaki-u.ac.jp/faculty/requirements/"],
		["岩手大学", "https://www.iwate-u.ac.jp/admission/undergraduate/info.html"],
		["東北大学", "https://www.tnc.tohoku.ac.jp/admission.php"],
		["宮城教育大学", "https://www.miyakyo-u.ac.jp/admissions/faculty-education-info/"],
		["秋田大学", "https://www.akita-u.ac.jp/honbu/exam/ex_kind.html"],
		["山形大学", "https://www.yamagata-u.ac.jp/jp/entrance/faculty/guidelines/"],
		["福島大学", "https://nyushi.adb.fukushima-u.ac.jp/yoko.html"],
		// 関東・甲信越地区
		["茨城大学", "https://www.ibaraki.ac.jp/admission/index.html"],
		["筑波大学", "https://ac.tsukuba.ac.jp/apply/application-guidelines/"],
		["筑波技術大学", "https://www.tsukuba-tech.ac.jp/admission/hs/guideline.html"],
		["宇都宮大学", "https://admission.utsunomiya-u.ac.jp/entrance-exam-info/faculty-entrance-exam/general/"],
		["群馬大学", "https://www.gunma-u.ac.jp/admission/g2107"],
		["埼玉大学", "https://www.saitama-u.ac.jp/entrance/requirements/index.html"],
		["千葉大学", "https://www.chiba-u.ac.jp/admissions/gakubu/general.html"],
		["東京大学", "https://www.u-tokyo.ac.jp/ja/admissions/undergraduate/e01_06_01.html"],
		["東京外国語大学", "https://www.tufs.ac.jp/admission/exam/guideline/"],
		["東京学芸大学", "https://www.u-gakugei.ac.jp/nyushi/gakubu/guidebook.html"],
		["東京農工大学", "https://www.tuat.ac.jp/admission/nyushi_gakubu/youkou/"],
		["東京芸術大学", "https://admissions.geidai.ac.jp/admission/"],
		["東京科学大学", "https://www.isct.ac.jp/exam/undergraduate/application_guidelines/"],
		["東京海洋大学", "https://www.kaiyodai.ac.jp/entranceexamination/undergraduate/requirements/"],
		["お茶の水女子大学", "https://www.ao.ocha.ac.jp/application/faculty/index.html"],
		["電気通信大学", "https://www.uec.ac.jp/education/undergraduate/admission/senbatsu_type.html"],
		["一橋大学", "https://juken.hit-u.ac.jp/admission/info/guidelines/index.html"],
		["横浜国立大学", "https://www.ynu.ac.jp/exam/faculty/essential/"],
		["新潟大学", "https://www.niigata-u.ac.jp/admissions/faculty/selection/"],
		["長岡技術科学大学", "https://www.nagaokaut.ac.jp/admissions/exam/bachelor1/outline/index.html"],
		["上越教育大学", "https://www.juen.ac.jp/060admissions/020faculty/005exam/index.html"],
		["山梨大学", "https://www.yamanashi.ac.jp/admission"],
		["信州大学", "https://www.shinshu-u.ac.jp/ad_portal/selection/index.html"],
	];
	
  const nationalUniversityWithLinksYet = [
		// 東海・北陸・近畿地区
		["富山大学", "https://www.u-toyama.ac.jp/admission/faculty/kind_guide/"],
		["金沢大学", "https://www.kanazawa-u.ac.jp/entrance/undergraduate/guideline"],
		["福井大学", "https://www.u-fukui.ac.jp/admission/exam/undergraduate/data/"],
		["岐阜大学", "https://www.gifu-u.ac.jp/admission/information/undergraduate/guideline.html"],
		["静岡大学", "https://www.shizuoka.ac.jp/admission/faculty/guidance/guideline/"],
		["浜松医科大学", "https://www.hama-med.ac.jp/examination/application_information.html"],
		["名古屋大学", "https://www.nagoya-u.ac.jp/admissions/exam/under/guideline/"],
		["愛知教育大学", "https://www.aichi-edu.ac.jp/admissions/undergraduate/guideline/"],
		["名古屋工業大学", "https://www.nitech.ac.jp/examination/undergraduate/guideline/"],
		["豊橋技術科学大学", "https://www.tut.ac.jp/examination/info/guide.html"],
		["三重大学", "https://www.mie-u.ac.jp/exam/undergraduate/application_guide/"],
		["滋賀大学", "https://www.shiga-u.ac.jp/admission/info/guideline/"],
		["滋賀医科大学", "https://www.shiga-med.ac.jp/admission/undergraduate/requirements"],
		["京都大学", "https://www.kyoto-u.ac.jp/ja/admissions/undergraduate/general-selection/guideline"],
		["京都教育大学", "https://www.kyokyo-u.ac.jp/admissions/ug/app_guideline/"],
		["京都工芸繊維大学", "https://www.kit.ac.jp/admissions/undergraduate/guide/"],
		["大阪大学", "https://www.osaka-u.ac.jp/ja/admissions/faculty/guideline"],
		["大阪教育大学", "https://osaka-kyoiku.ac.jp/admission/exam/gakubu/"],
		["兵庫教育大学", "https://www.hyogo-u.ac.jp/admission/education/request.php"],
		["神戸大学", "https://www.kobe-u.ac.jp/admission/ug/guide/"],
		["奈良教育大学", "https://www.nara-edu.ac.jp/nyuusi/gakubu/"],
		["奈良女子大学", "https://www.nara-wu.ac.jp/nyusi/nyusi2_gaiyou/index.html"],
		["和歌山大学", "https://www.wakayama-u.ac.jp/nyushi/gakubu/yoko/"],

		// 中国・四国地区
		["鳥取大学", "https://www.tottori-u.ac.jp/admission/undergraduate/guideline/"],
		["島根大学", "https://www.shimane-u.ac.jp/admission/ug/guideline/"],
		["岡山大学", "https://www.okayama-u.ac.jp/tp/admission/guideline.html"],
		["広島大学", "https://www.hiroshima-u.ac.jp/nyushi/yoko_doga/yoko"],
		["山口大学", "https://www.yamaguchi-u.ac.jp/admission/guide/guideline/index.html"],
		["徳島大学", "https://www.tokushima-u.ac.jp/admission/admission/senbatsuyoko.html"],
		["鳴門教育大学", "https://www.naruto-u.ac.jp/entrance/ug/gakubu-guidelines.html"],
		["香川大学", "https://www.kagawa-u.ac.jp/admission/ug/guide/"],
		["愛媛大学", "https://www.ehime-u.ac.jp/entrance/undergraduate/download/"],
		["高知大学", "https://nyusi.kochi-u.ac.jp/undergraduate/guide/"],

		// 九州・沖縄地区
		["福岡教育大学", "https://www.fukuoka-edu.ac.jp/admissions/information/selection.html"],
		["九州大学（九州芸術工科大学）", "https://www.kyushu-u.ac.jp/ja/admission/undergraduate/guideline/"],
		["九州工業大学", "https://www.kyutech.ac.jp/examination/undergraduate/guideline/"],
		["佐賀大学", "https://www.saga-u.ac.jp/admission/ug/download/"],
		["長崎大学", "https://www.nagasaki-u.ac.jp/nyugaku/undergraduate/guideline/"],
		["熊本大学", "https://www.kumamoto-u.ac.jp/nyuushi/gakubu/youkou-youbou"],
		["大分大学", "https://www.oita-u.ac.jp/admission/ug/guide/"],
		["宮崎大学", "https://www.miyazaki-u.ac.jp/admission/faculty/youkou.html"],
		["鹿児島大学", "https://www.kagoshima-u.ac.jp/admissions/faculty/guideline/"],
		["鹿屋体育大学", "https://www.nifs-k.ac.jp/admission/faculty/exam/general/"],
		["琉球大学", "https://www.u-ryukyu.ac.jp/admissions/faculty/outline/"]
	];
	
	const publicUniversityWithLinks = [
	];
	
	const publicUniversityWithLinksYet = [
		// 北海道・東北地区
		["釧路公立大学", "https://www.kushiro-pu.ac.jp/entrance/"],
		["公立はこだて未来大学", "https://www.fun.ac.jp/exam"],
		["公立千歳科学技術大学", "https://www.chitose.ac.jp/admissions/"],
		["札幌市立大学", "https://www.scu.ac.jp/admission/"],
		["名寄市立大学", "https://www.nayoro.ac.jp/exam/undergraduate/"],
		["札幌医科大学", "https://web.sapmed.ac.jp/admission/undergraduate/"],
		["旭川市立大学", "https://www.asahikawa-u.ac.jp/admission/undergraduate/"],
		["青森県立保健大学", "https://www.aomori-u.ac.jp/academics/nursing-and-health-sciences/admission/"],
		["青森公立大学", "https://www.aomori-public-u.ac.jp/admissions/"],
		["岩手県立大学", "https://www.iwate-pu.ac.jp/admission/entrance-exam.html"],
		["宮城大学", "https://www.myu.ac.jp/examination/"],
		["秋田県立大学", "https://www.akita-pu.ac.jp/jyuken/jyuken"],
		["国際教養大学", "https://web.aiu.ac.jp/undergraduate/admissions/"],
		["秋田公立美術大学", "https://www.akibi.ac.jp/admissions/"],
		["山形県立保健医療大学", "https://www.yamanashi-ken.ac.jp/admissions/faculty/"], // URLは山形ではなく山梨県立大学だったため修正が必要。山形県立保健医療大学を検索
		["山形県立米沢栄養大学", "https://www.yone.ac.jp/admission/exam-info/"],
		["東北農林専門職大学", "https://www.tohoku-aff.ac.jp/admission/"],
		["会津大学", "https://www.u-aizu.ac.jp/public/admission/"],
		["福島県立医科大学", "https://www.fmu.ac.jp/byoin/nyushi/"],

		// 関東・甲信越地区
		["茨城県立医療大学", "https://www.ipu.ac.jp/exam/"],
		["群馬県立県民健康科学大学", "https://www.gps.ac.jp/admissions/"],
		["群馬県立女子大学", "https://www.gpwu.ac.jp/admission/"],
		["高崎経済大学", "https://www.tcue.ac.jp/admissions/"],
		["前橋工科大学", "https://www.maebashi-it.ac.jp/admission/"],
		["千葉県立保健医療大学", "https://www.pref.chiba.lg.jp/hoken-iryou-u/nyugaku/youkou.html"],
		["埼玉県立大学", "https://www.spu.ac.jp/admission/"],
		["東京都立大学", "https://www.tmu.ac.jp/entrance/"],
		["東京都立産業技術大学院大学", "https://aiit.ac.jp/admission/"],
		["神奈川県立保健福祉大学", "https://www.kuhs.ac.jp/entrance/"],
		["横浜市立大学", "https://www.yokohama-cu.ac.jp/admis/"],
		["川崎市立看護大学", "https://www.kawasaki-cn.ac.jp/exam/"],
		["新潟県立看護大学", "https://www.niigata-cn.ac.jp/admission/undergraduate/"],
		["新潟県立大学", "https://www.unii.ac.jp/admissions/"],
		["三条市立大学", "https://www.sanjo-u.ac.jp/admissions/"],
		["長岡造形大学", "https://www.nagaoka-id.ac.jp/admission/"],
		["都留文科大学", "https://www.tsuru.ac.jp/entrance/"],
		["山梨県立大学", "https://www.yamanashi-ken.ac.jp/admissions/faculty/"],
		["公立諏訪東京理科大学", "https://www.sus.ac.jp/admission/"],
		["長野県看護大学", "https://www.nagano-nurs.ac.jp/admissions/"],
		["長野県立大学", "https://www.u-nagano.ac.jp/admission/"],
		["長野大学", "https://www.nagano.ac.jp/exam/"],

		// 東海・北陸・近畿地区
		["富山県立大学", "https://www.pu-toyama.ac.jp/exam/"],
		["石川県立大学", "https://www.ishikawa-pu.ac.jp/exam/"],
		["石川県立看護大学", "https://www.ishikawa-nu.ac.jp/admission/"],
		["金沢美術工芸大学", "https://www.kanazawa-bidai.ac.jp/admission/"],
		["公立小松大学", "https://www.komatsu-u.ac.jp/admissions/"],
		["福井県立大学", "https://www.fpu.ac.jp/nyusi/"],
		["敦賀市立看護大学", "https://www.tsuruga-nu.ac.jp/admission/"],
		["岐阜県立看護大学", "https://www.gifu-cn.ac.jp/exam/"],
		["岐阜薬科大学", "https://www.gifu-pu.ac.jp/admission/"],
		["情報科学芸術大学院大学", "https://www.iamas.ac.jp/admission/"], // 大学院大学
		["静岡県立大学", "https://www.u-shizuoka-ken.ac.jp/admission/"],
		["静岡文化芸術大学", "https://www.suac.ac.jp/admissions/"],
		["静岡社会健康医学大学院大学", "https://www.spmu.ac.jp/admission/"], // 大学院大学
		["静岡県立農林環境専門職大学", "https://www.agr-env.ac.jp/admission/"],
		["愛知県立大学", "https://www.aichi-pu.ac.jp/admission/"],
		["愛知県立芸術大学", "https://www.aichi-fam-u.ac.jp/exam/"],
		["名古屋市立大学", "https://www.nagoya-cu.ac.jp/admissions/"],
		["三重県立看護大学", "https://www.mcn.ac.jp/admission/"],
		["滋賀県立大学", "https://www.usp.ac.jp/entrance/"],
		["京都市立芸術大学", "https://www.kcua.ac.jp/admission/"],
		["京都府立大学", "https://www.kpu.ac.jp/admissions/"],
		["京都府立医科大学", "https://www.kpu-m.ac.jp/admissions/"],
		["福知山公立大学", "https://www.fukuchiyama.ac.jp/admissions/"],
		["大阪公立大学", "https://www.omu.ac.jp/admissions/"],
		["神戸市看護大学", "https://www.kobe-ccn.ac.jp/admissions/"],
		["神戸市外国語大学", "https://www.kobe-cufs.ac.jp/admission/"],
		["兵庫県立大学", "https://www.u-hyogo.ac.jp/admission/"],
		["芸術文化観光専門職大学", "https://www.art-sky.ac.jp/admission/"],
		["奈良県立医科大学", "https://www.naramed-u.ac.jp/admissions/"],
		["奈良県立大学", "https://www.nara-pu.ac.jp/admission/"],
		["和歌山県立医科大学", "https://www.wakayama-med.ac.jp/nyuushi/"],

		// 中国・四国地区
		["公立鳥取環境大学", "https://www.kankyo-u.ac.jp/admissions/"],
		["島根県立大学", "https://www.u-shimane.ac.jp/admissions/"],
		["岡山県立大学", "https://www.oka-pu.ac.jp/exam/"],
		["新見公立大学", "https://www.niimi-u.ac.jp/admissions/"],
		["尾道市立大学", "https://www.onomichi-u.ac.jp/admissions/"],
		["県立広島大学", "https://www.pu-hiroshima.ac.jp/site/nyushi/"],
		["叡啓大学", "https://www.eikei.ac.jp/admissions/"],
		["広島市立大学", "https://www.hiroshima-cu.ac.jp/admissions/"],
		["福山市立大学", "https://www.fcu.ac.jp/admission/"],
		["下関市立大学", "https://www.shimonoseki-cu.ac.jp/admission/"],
		["山口県立大学", "https://www.yamaguchi-pu.ac.jp/exam/"],
		["山陽小野田市立山口東京理科大学", "https://www.socu.ac.jp/admission/"],
		["周南公立大学", "https://www.shunan-u.ac.jp/admission/"],
		["香川県立保健医療大学", "https://www.kagawa- Pref-u.ac.jp/admission/"],
		["愛媛県立医療技術大学", "https://www.epu.ac.jp/exam/"],
		["高知県立大学", "https://www.u-kochi.ac.jp/site/exam/"],
		["高知工科大学", "https://www.kochi-tech.ac.jp/exam/"],

		// 九州・沖縄地区
		["北九州市立大学", "https://www.kitakyu-u.ac.jp/admission/"],
		["九州歯科大学", "https://www.kyu-dent.ac.jp/juken/"],
		["福岡県立大学", "https://www.fukuoka-pu.ac.jp/exam/"],
		["福岡女子大学", "https://www.fwu.ac.jp/admissions/"],
		["長崎県立大学", "https://sun.ac.jp/admissions/"],
		["熊本県立大学", "https://www.pu-kumamoto.ac.jp/exam/"],
		["大分県立看護科学大学", "https://www.oita-nhs.ac.jp/exam/"],
		["宮崎公立大学", "https://www.miyazaki-mu.ac.jp/admission/"],
		["宮崎県立看護大学", "https://www.mpu.ac.jp/admission/"],
		["沖縄県立芸術大学", "https://www.okigei.ac.jp/entrance/"],
		["沖縄県立看護大学", "https://www.okinawa-nurs.ac.jp/admission/"],
		["名桜大学", "https://www.meio-u.ac.jp/admission/"]
	];

const nlinkElementsGeo = nationalUniversityGeo.map(([name, url], index) => (
  <React.Fragment key={name}>
    <a href={url} target="_blank" rel="noopener noreferrer">{name}</a>
    {/* 最後の要素でなければスラッシュを表示する */}
    {index < nationalUniversityGeo.length - 1 && " / "}
  </React.Fragment>
));

const nlinkElementsCommonGeo = nationalUniversityCommonGeo.map(([name, url], index) => (
  <React.Fragment key={name}>
    <a href={url} target="_blank" rel="noopener noreferrer">{name}</a>
    {/* 最後の要素でなければスラッシュを表示する */}
    {index < nationalUniversityCommonGeo.length - 1 && " / "}
  </React.Fragment>
));
	
  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 text-center mb-4 dark:text-gray-400">
            「地学」の現状
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
						　「地学」は「地球科学」の略称であり，地球を構成する物質（鉱物、岩石）から、大気、海洋、地球内部構造、さらには地球環境に影響を与える宇宙（天文学）まで、地球科学全般にわたる分野を対象とする学問である。「理系地学」とは，主として国公立大学の理系学部を受験する際に選択可能な，高校理科の専門科目「地学」を指す。現在，物理や化学，生物と違って大学入学における受験者数が少ないため，「地学」という語は主に文系志望者が選択する「地学基礎」の文脈で使用されるケースが多い。したがって専門科目としての地学を呼称する場合，地学基礎と区別する目的で「理系地学」と呼ばれる。
					</p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            　以下では高等学校および大学入試における地学教育の定量的評価を行った。教科を選択することができる高等学校における教育・選択のあり方，あるいは大学入試の実情は，直接的に大学における地球ないし海洋・大気・宇宙に関わる研究への意識，または現実社会において地球に関わる定量的なものの見方に関連し得る。あくまで様々な要素が重なったということを念頭におく必要があるが，次のような分析が得られる。
          </p>
        </header>

        {/* セクション1: 大学入学共通テストにおける受験者数の推移 */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Ⅰ　大学入学共通テスト理科専門科目の受験者数推移
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            令和3年度から令和7年度までの5年間における理科専門科目（物理・化学・生物・地学）の受験者数を分析した。データは大学入試センターが公表した各年度の実施結果概要に基づく。
          </p>
          
          <div className="h-96 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={commonTestData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="physics" stroke="#3b82f6" name="物理" strokeWidth={2} />
                <Line type="monotone" dataKey="chemistry" stroke="#ef4444" name="化学" strokeWidth={2} />
                <Line type="monotone" dataKey="biology" stroke="#10b981" name="生物" strokeWidth={2} />
                <Line type="monotone" dataKey="geoscience" stroke="#f59e0b" name="地学" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="border border-gray-300 dark:border-gray-600 p-2" >年度</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-2" colSpan={2}>物理</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-2" colSpan={2}>化学</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-2" colSpan={2}>生物</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-2" colSpan={2}>地学</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-2">理科全体</th>
                </tr>
              </thead>
              <tbody>
                {commonTestData.map((row, idx) => (
                  <tr key={idx} className="text-center">
                    <td className="border border-gray-300 dark:border-gray-600 p-2">{row.year}</td>
										
                    <td className="border border-gray-300 dark:border-gray-600 p-2">{row.physics.toLocaleString()}</td>
                    <td className="border border-gray-300 dark:border-gray-600 p-2">{((row.physics / (row.physics + row.chemistry + row.biology + row.geoscience)) * 100).toFixed(2)}%</td>
										
                    <td className="border border-gray-300 dark:border-gray-600 p-2">{row.chemistry.toLocaleString()}</td>
                    <td className="border border-gray-300 dark:border-gray-600 p-2">{((row.chemistry / (row.physics + row.chemistry + row.biology + row.geoscience)) * 100).toFixed(2)}%</td>
										
                    <td className="border border-gray-300 dark:border-gray-600 p-2">{row.biology.toLocaleString()}</td>
                    <td className="border border-gray-300 dark:border-gray-600 p-2">{((row.biology / (row.physics + row.chemistry + row.biology + row.geoscience)) * 100).toFixed(2)}%</td>
										
                    <td className="border border-gray-300 dark:border-gray-600 p-2 font-bold">{row.geoscience.toLocaleString()}</td>
                    <td className="border border-gray-300 dark:border-gray-600 p-2">{((row.geoscience / (row.physics + row.chemistry + row.biology + row.geoscience)) * 100).toFixed(2)}%</td>
                    <td className="border border-gray-300 dark:border-gray-600 p-2">{(row.physics + row.chemistry + row.biology + row.geoscience).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">データからわかること</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
              <li>化学の受験者数は一貫して最大であり、約18万人で推移している</li>
							<li>物理の受験者数は令和4年度から0.5ポイント未満の微小な減少を続けているものの，化学の受験者数の8割ほどを維持し続けている</li>
							<li>生物の受験者数はこの4つの科目の中では非常に安定して推移している</li>
              <li>地学受験者数は理科全体の1％未満である</li>
              <li>地学受験者数は，令和4年度以降0.1ポイント未満，500人未満の増加傾向にある</li>
							<li>地学受験者数は，令和6年度から令和7年度にかけて0.14ポイント，573人増加した</li>
            </ul>
          </div>
        </section>

        {/* セクション2: 令和7年度平均点の比較 */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            2. 令和7年度大学入学共通テスト平均点の科目間比較
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            令和7年度大学入学共通テストにおける理科専門科目（100点満点）の平均点を比較した。
          </p>

          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={averageScoreData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" name="平均点">
                  {averageScoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="border border-gray-300 dark:border-gray-600 p-2">科目</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-2">平均点</th>
                  <th className="border border-gray-300 dark:border-gray-600 p-2">最高点との差</th>
                </tr>
              </thead>
              <tbody>
                {averageScoreData.map((row, idx) => (
                  <tr key={idx} className="text-center">
                    <td className="border border-gray-300 dark:border-gray-600 p-2">{row.subject}</td>
                    <td className="border border-gray-300 dark:border-gray-600 p-2 font-bold">{row.score.toFixed(2)}点</td>
                    <td className="border border-gray-300 dark:border-gray-600 p-2">
                      {(58.96 - row.score).toFixed(2)}点
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">データからわかること</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
              <li>地学の平均点は41.64点であり、4科目中最低である</li>
              <li>最高点の物理（58.96点）と地学の間には17.32点の差が存在する</li>
              <li>化学（45.34点）も相対的に低い平均点を示している</li>
            </ul>
          </div>
        </section>

        {/* セクション3: 高校における履修率 */}
				<section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
					<h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
						Ⅲ 高等学校における理科科目の開設状況（学年別）
					</h2>
					<p className="text-gray-700 dark:text-gray-300 mb-6">
						令和5年度（2023年度）公立高等学校における教育課程の編成・実施状況調査の結果に基づく、普通科等における理科基礎科目および理科専門科目の学年別開設状況。
					</p>
					
					<div className="grid md:grid-cols-3 gap-2 mb-6">
						<div>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">1年次 基礎科目</h3>
							<div className="h-64">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart data={basicSubjectsOffering1} layout="vertical" margin={{ left: 10, right: 20 }}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
										<YAxis type="category" dataKey="subject" width={100} />
										<Tooltip formatter={(value: number) => [`${value}%`, '開設率']} />
										<Bar dataKey="rate" name="開設率(%)">
											{basicSubjectsOffering1.map((entry, index) => (
												// 基礎科目を地学基礎を強調する色分けに調整
												<Cell key={`cell-${index}`} fill={COLORS[index]} />
											))}
										</Bar>
									</BarChart>
								</ResponsiveContainer>
							</div>
						</div>
						
						<div>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">2年次 基礎科目</h3>
							<div className="h-64">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart data={basicSubjectsOffering2} layout="vertical" margin={{ left: 10, right: 20 }}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
										<YAxis type="category" dataKey="subject" width={100} />
										<Tooltip formatter={(value: number) => [`${value}%`, '開設率']} />
										<Bar dataKey="rate" name="開設率(%)">
											{basicSubjectsOffering2.map((entry, index) => (
												// 基礎科目を地学基礎を強調する色分けに調整
												<Cell key={`cell-${index}`} fill={COLORS[index]} />
											))}
										</Bar>
									</BarChart>
								</ResponsiveContainer>
							</div>
						</div>
						
						<div>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">3年次 専門科目</h3>
							<div className="h-64">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart data={specializedSubjectsOffering3} layout="vertical" margin={{ left: 10, right: 20 }}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
										<YAxis type="category" dataKey="subject" width={100} />
										<Tooltip formatter={(value: number) => [`${value}%`, '開設率']} />
										<Bar dataKey="rate" name="開設率(%)">
											{specializedSubjectsOffering3.map((entry, index) => (
												// 基礎科目を地学基礎を強調する色分けに調整
												<Cell key={`cell-${index}`} fill={COLORS[index]} />
											))}
										</Bar>
									</BarChart>
								</ResponsiveContainer>
							</div>
						</div>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full text-sm border-collapse">
							<caption className="text-left text-gray-600 dark:text-gray-400 mb-2 text-xs">
								表：理科科目開設状況の学年別比較（2023年度入学者対象データ）
							</caption>
							<thead className="bg-gray-100 dark:bg-gray-700">
								<tr>
									<th className="border border-gray-300 dark:border-gray-600 p-2 text-left">科目</th>
									<th className="border border-gray-300 dark:border-gray-600 p-2">1年次 開設率 (%)</th>
									<th className="border border-gray-300 dark:border-gray-600 p-2">2年次 開設率 (%)</th>
									<th className="border border-gray-300 dark:border-gray-600 p-2">3年次 開設率 (%)</th>
								</tr>
							</thead>
							<tbody>
								{gradeOfferingData.map((item, index) => (
									<tr key={item.subject} className="text-center hover:bg-gray-50 dark:hover:bg-gray-700/50">
										<td className={`border border-gray-300 dark:border-gray-600 p-2 text-left font-semibold ${item.subject.includes('基礎') || item.subject.includes('人間生活') ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}>
											{item.subject}
										</td>
										<td className="border border-gray-300 dark:border-gray-600 p-2">
											{item.grade1}%
										</td>
										<td className="border border-gray-300 dark:border-gray-600 p-2">
											{item.grade2}%
										</td>
										<td className="border border-gray-300 dark:border-gray-600 p-2">
											{item.grade3}%
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
						<h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">データからわかること</h3>
						<ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
							<li>
								1年次における基礎科目の開設状況は「生物基礎」（{basicSubjectsOffering1.find(d => d.subject === '生物基礎')?.rate}％）が最も高く、「地学基礎」（{basicSubjectsOffering1.find(d => d.subject === '地学基礎')?.rate}％）が最も低い。
							</li>
							<li>
								特に1年次での「生物基礎」と「地学基礎」の開設率には、約{((basicSubjectsOffering1.find(d => d.subject === '生物基礎')?.rate || 0) / (basicSubjectsOffering1.find(d => d.subject === '地学基礎')?.rate || 1)).toFixed(1)}倍の大きな差がある。
							</li>
							<li>
								専門科目である「物理」「化学」「生物」は主に2年次以降に開設されるが、「地学」の開設率は最も高い3年次でも{gradeOfferingData.find(d => d.subject === '地学')?.grade3}%と、他の専門科目と比べて極端に低い。
							</li>
						</ul>
					</div>
				</section>

        {/* セクション4: 大学入試における採用状況 */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Ⅳ　国公立大学（学部）における地学の受験可否
          </h2>
					
          <p className="text-gray-700 dark:text-gray-300 mb-6">
						左は共通テストで理科を使用する国公立大学{nationalUniversityWithLinks.length + publicUniversityWithLinks.length}校（うち国立大学{nationalUniversityWithLinks.length}校，公立大学{publicUniversityWithLinks.length}校）のうち地学を利用できる大学の数。
						右は二次試験で理科を使用する国公立大学{nationalUniversityScience.length + publicUniversityWithLinks.length}校（うち国立大学{nationalUniversityScience.length}校，公立大学{publicUniversityWithLinks.length}校）のうち地学を利用できる大学の数。リンク先は原則として学部入試の募集要項または入試情報全体を掲載しているページ。
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">共通テストで地学を利用できる大学</div>
              <div className="text-5xl font-bold text-green-600 dark:text-green-400 mb-2">{nationalUniversityCommonGeo.length}<span className="text-2xl mx-1">校</span></div>
              <div className="text-2xl text-gray-700 dark:text-gray-300">/ {nationalUniversityWithLinks.length + publicUniversityWithLinks.length}校</div>
              <div className="text-sm text-gray-500 dark:text-gray-500 mt-4">採用率: {((nationalUniversityCommonGeo.length / (nationalUniversityWithLinks.length + publicUniversityWithLinks.length))*100).toFixed(2)}%</div>
							<div className="text-xs">
							{nlinkElementsCommonGeo}
							</div>
            </div>

            <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">二次試験で地学を利用できる大学</div>
              <div className="text-5xl font-bold text-red-600 dark:text-red-400 mb-2">{nationalUniversityGeo.length}<span className="text-2xl mx-1">校</span></div>
              <div className="text-2xl text-gray-700 dark:text-gray-300">/ {nationalUniversityScience.length + publicUniversityWithLinks.length}校</div>
              <div className="text-sm text-gray-500 dark:text-gray-500 mt-4">採用率: {((nationalUniversityGeo.length / (nationalUniversityScience.length + publicUniversityWithLinks.length))*100).toFixed(2)}%</div>
							<div className="text-xs">
							{nlinkElementsGeo}
							</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">データからわかること</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
							<li>共通テストの理科を科すものの地学を全く利用できない大学は{((1-(nationalUniversityCommonGeo.length / (nationalUniversityWithLinks.length )))*100).toFixed(1)}%に留まる</li>
              <li>二次試験で理科を科すものの地学を全く選択できない大学は{((1-(nationalUniversityGeo.length / (nationalUniversityScience.length )))*100).toFixed(1)}%にのぼる</li>
            </ul>
          </div>
					<div className="py-4 px-2">
						<p className="text-gray-700">
							古い情報・誤情報が含まれる場合がありますので<strong className="text-red-600 font-sans">受験などの際は必ず各大学の募集要項などを確認し</strong>，このデータは参考程度にとどめてください。
						</p>
          </div>
					
        </section>

        {/* セクション5: 論理的考察 */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            5. 構造的因果関係の分析
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">5.1 因果連鎖の特定</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                観察されたデータから、以下の因果連鎖が論理的に導かれる。
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div className="text-gray-900 dark:text-gray-100">大学二次試験での地学不採用（94.0%の大学）</div>
                </div>
                <div className="ml-4 text-gray-600 dark:text-gray-400">↓</div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div className="text-gray-900 dark:text-gray-100">受験に不要な科目として認識される</div>
                </div>
                <div className="ml-4 text-gray-600 dark:text-gray-400">↓</div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div className="text-gray-900 dark:text-gray-100">高校での履修選択率が極端に低下（0.8%）</div>
                </div>
                <div className="ml-4 text-gray-600 dark:text-gray-400">↓</div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
                  <div className="text-gray-900 dark:text-gray-100">地学専門教員の採用抑制</div>
                </div>
                <div className="ml-4 text-gray-600 dark:text-gray-400">↓</div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">5</div>
                  <div className="text-gray-900 dark:text-gray-100">開講校の減少・教育の質の低下</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">5.2 定量的な不均衡の検証</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                理科4科目間の受験者数比率を分析すると、地学の構造的孤立が数値的に確認できる。
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="border border-gray-300 dark:border-gray-600 p-2">科目</th>
                      <th className="border border-gray-300 dark:border-gray-600 p-2">R7年度受験者</th>
                      <th className="border border-gray-300 dark:border-gray-600 p-2">化学比</th>
                      <th className="border border-gray-300 dark:border-gray-600 p-2">全体比</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-center">
                      <td className="border border-gray-300 dark:border-gray-600 p-2">化学</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-2">183,154</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-2">1.00</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-2">47.4%</td>
                    </tr>
                    <tr className="text-center">
                      <td className="border border-gray-300 dark:border-gray-600 p-2">物理</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-2">144,761</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-2">0.79</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-2">37.5%</td>
                    </tr>
                    <tr className="text-center">
                      <td className="border border-gray-300 dark:border-gray-600 p-2">生物</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-2">57,985</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-2">0.32</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-2">15.0%</td>
                    </tr>
                    <tr className="text-center bg-red-50 dark:bg-red-900/20">
                      <td className="border border-gray-300 dark:border-gray-600 p-2 font-bold">地学</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-2 font-bold">2,365</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-2 font-bold">0.013</td>
                      <td className="border border-gray-300 dark:border-gray-600 p-2 font-bold">0.6%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                地学の受験者数は化学の約1.3%、物理の約1.6%に相当する。この比率は、他3科目が相互に一定の競合関係にある中で、地学のみが統計的に無視し得る水準に位置することを示している。
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">5.3 教育機会の実質的喪失</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                履修率0.8%という数値は、教育制度上は選択可能であっても、実質的には学習機会が提供されていない状態を意味する。開講率データ（普通科3年生で7.4%）と合わせて考察すると、以下の論理が成立する。
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>高校の約92.6%が地学を開講していない</li>
                <li>開講校においても、実際に履修する生徒は極めて少数である</li>
                <li>結果として、地学を学ぶ機会は地理的・制度的に著しく制限されている</li>
              </ul>
            </div>
          </div>
        </section>

        {/* セクション6: 結論 */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Ⅵ　まとめ
          </h2>
          
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              データとして見る限り，大学入試においては地学は周縁化している。
            </p>
            
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">まとめ</h3>
              <ul className="list-decimal list-inside space-y-2">
                <li>令和7年度において、地学受験者は理科専門科目全体の0.6%に過ぎない</li>
                <li>高校での地学履修率は0.8%であり、約125人に1人という水準である</li>
                <li>国公立大学の94.0%が二次試験で地学を採用していない</li>
                <li>これらの数値は相互に因果関係を持ち、自己強化的な負のサイクルを形成している</li>
              </ul>
            </div>
            
            <p>
              教育課程上「地学」という科目は存在するが、上記データが示す通り、実質的な教育機会は極めて限定的である。教科の明示的な廃止の兆候は現時点では観察されないが、制度的・構造的な要因による事実上の縮小、あるいは他教科への内容吸収という方向へ転じる可能性も、現時点では排除できない。
            </p>
            
            <p>
              地学教育の必要性の有無、あるいは現状の是非については、教育政策論・災害科学・科学リテラシー論等の多角的観点からの議論が必要である。地学は物理・化学・生物の知識を横断的に必要とする性質上、必ずしも独立した「地学」という教科形態に固執する必然性はない。実際に、多くの者が地学以外の理科科目を選択し、大学で初めて関連分野を専門的に学習・研究している事実を考慮すれば、教科としての地学の不在が直ちに重大な機能不全を引き起こすとは断定できない。
            </p>
            
            <p>
              他方で、地球・宇宙という統合的視座から自然現象を理解する体系的アプローチには、個別教科に分散された知識の総和では代替し得ない価値がある。高等学校段階で習得可能な概念も少なくなく、この学習機会を一律に排除することの妥当性については、慎重な検討を要する。
            </p>
            
            <p>
              このページではそうした判断は避け、データに基づく分析に徹した。現状のデータが示す構造的課題に対し、どのような教育政策的対応が適切であるかは、本稿の範囲を超える。あくまでは、そうした議論の基礎資料として、現状を客観的に見ることを目的とする。
            </p>
            
            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded border-l-4 border-amber-500">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">本サイトの設立趣旨</h3>
              <p className="text-gray-700 dark:text-gray-300">
                人類が自然から得た知見は膨大であり、いかなる形態であれ地学に分類される知識を学ぶ意義は大きい。情報が錯綜し、体系的な理解が難しい現状において、少なくとも理論ベースの統合的なリファレンスの必要がある。本サイトは、こうした認識に基づき、こうした知見を涵養するための良質な情報を提供することを目的として構築された。
              </p>
            </div>
          </div>
        </section>

        {/* 出典 */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            データ出典
          </h2>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">大学入試センター</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>令和3年度大学入学共通テスト実施結果の概要</li>
                <li>令和4年度大学入学共通テスト実施結果の概要</li>
                <li>令和5年度大学入学共通テスト実施結果の概要</li>
                <li>令和6年度大学入学共通テスト実施結果の概要</li>
                <li>令和7年度大学入学共通テスト実施結果の概要</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">学術論文・調査報告</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>須藤靖「高校理科における地学教育の現状と課題」(2017年、東京大学大学院理学系研究科)</li>
                <li>平成27年度（2015年度）公立高等学校調査</li>
                <li>2014年度高等学校理科履修状況調査</li>
              </ul>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
              <p className="text-xs">
                本報告書は上記資料から抽出したデータに基づき作成された。数値は原典に記載されたものを使用し、独自の推計・補正は行っていない。
              </p>
            </div>
          </div>
        </section>

        {/* フッター */}
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>本分析は2025年11月時点での公開データに基づく</p>
        </footer>
      </div>
    </div>
  );
};

export default GeoscienceEducationAnalysis;