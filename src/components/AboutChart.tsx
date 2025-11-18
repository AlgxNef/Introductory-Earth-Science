'use client'
import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ImArrowDown } from "react-icons/im";

const GeoscienceEducationAnalysis = () => {
  // 大学入学共通テスト受験者数データ（令和3-7年度）
  const commonTestData = [
    { year: 'R3', physics: 146041, chemistry: 182359, biology: 57878, geoscience: 1356 },
    { year: 'R4', physics: 148585, chemistry: 184028, biology: 58676, geoscience: 1350 },
    { year: 'R5', physics: 144914, chemistry: 182224, biology: 57895, geoscience: 1659 },
    { year: 'R6', physics: 142525, chemistry: 180779, biology: 56596, geoscience: 1792 },
    { year: 'R7', physics: 144761, chemistry: 183154, biology: 57985, geoscience: 2365 },
  ];

	// 2024年度版 (2023年夏実施) のデータ
	const total2024 = 59; //静岡市，浜松市，豊能地区，大阪市，堺市，岡山市，北九州市の7自治体は高校理科の採用を行っていない
	const excludedList2024: string[] = [
			"栃木県", "群馬県", "東京都", "神奈川県", "山梨県", "岐阜県", "静岡県", "三重県", "京都市", "兵庫県", "奈良県", "島根県", "岡山県", "山口県", "福岡県", "福岡市","佐賀県", "長崎県", "大分県", "宮崎県"
	];
	const excluded2024 = excludedList2024.length;
	const excludedRate2024 = ((excluded2024 / total2024) * 100).toFixed(2);
	const included2024 = total2024 - excluded2024;

	// 2025年度版 (2024年夏実施) のデータ
	const excludedList2025: string[] = [
			"青森県", "栃木県", "群馬県", "東京都", "山梨県", "岐阜県", "三重県", "滋賀県", "兵庫県", "奈良県", "島根県", "岡山県", "山口県", "香川県", "福岡県", "福岡市", "佐賀県", "熊本県", "大分県"
	];
	const total2025 = 59; //静岡市，浜松市，豊能地区，大阪市，堺市，岡山市，北九州市の 7自治体は高校理科の採用を行っていない
	const excluded2025 = excludedList2025.length;
	const excludedRate2025 = ((excluded2025 / total2025) * 100).toFixed(2);
	const included2025 = total2025 - excluded2025;

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

	// 基礎科目と専門科目のリスト
	const basicSubjects = ['物理基礎', '化学基礎', '生物基礎', '地学基礎'];
	const specializedSubjects = ['物理', '化学', '生物', '地学'];

	// ------------------------------------------
	// グラフ用データの変換
	// ------------------------------------------

	// 1. 1年次 基礎科目
	const basicSubjectsOffering1 = gradeOfferingData
			.filter(d => basicSubjects.includes(d.subject))
			.map(d => ({ subject: d.subject, rate: d.grade1 }));

	// 2. 2年次 基礎科目
	const basicSubjectsOffering2 = gradeOfferingData
			.filter(d => basicSubjects.includes(d.subject))
			.map(d => ({ subject: d.subject, rate: d.grade2 }));

	// 3. 3年次 基礎科目
	const basicSubjectsOffering3 = gradeOfferingData
			.filter(d => basicSubjects.includes(d.subject))
			.map(d => ({ subject: d.subject, rate: d.grade3 }));

	// 4. 2年次 専門科目
	const specializedSubjectsOffering2 = gradeOfferingData
			.filter(d => specializedSubjects.includes(d.subject))
			.map(d => ({ subject: d.subject, rate: d.grade2 }));

	// 5. 3年次 専門科目
	const specializedSubjectsOffering3 = gradeOfferingData
			.filter(d => specializedSubjects.includes(d.subject))
			.map(d => ({ subject: d.subject, rate: d.grade3 }));

	/**
	 * 共通の BarChart コンポーネントをラップするヘルパーコンポーネント
	 * @param {string} title - グラフのタイトル
	 * @param {Array<{subject: string, rate: number}>} data - グラフデータ
	 */
	interface SubjectBarChartProps {
		title: string;
		data: { subject: string; rate: number }[];
	}
	const SubjectBarChart: React.FC<SubjectBarChartProps> = ({ title, data }) => (
			<div>
					<h3 className="text-lg font-semibold text-gray-900  mb-3">{title}</h3>
					<div className="h-64">
							<ResponsiveContainer width="100%" height="100%">
									<BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
											<YAxis type="category" dataKey="subject" width={100} />
											<Tooltip formatter={(value) => [`${value}%`, '開設率']} />
											<Bar dataKey="rate" name="開設率(%)">
													{data.map((entry, index) => (
															<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
													))}
											</Bar>
									</BarChart>
							</ResponsiveContainer>
					</div>
			</div>
	);

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
		["富山大学", "https://www.u-toyama.ac.jp/admission/undergraduate-exam/guidebook/"],
		["静岡大学", "https://www.shizuoka.ac.jp/nyushi/outline/course/"],
		["名古屋大学", "https://www.nagoya-u.ac.jp/admissions/exam/us-exam/cat/index.html"],
		["愛知教育大学", "https://www.aichi-edu.ac.jp/exam/faculty/info/general/index.html"],
		["京都大学", "https://www.kyoto-u.ac.jp/ja/admissions/undergrad/requirements"],
		["京都教育大学", "https://www.kyokyo-u.ac.jp/admission/gakubu/youkou/"],
		["大阪教育大学", "https://osaka-kyoiku.ac.jp/admission/department/"],
		["神戸大学", "https://www.office.kobe-u.ac.jp/stdnt-examinavi/documents/boshu_youkou/index.html"],
		["奈良教育大学", "https://www.nara-edu.ac.jp/admissions/claiml.html"],
		["島根大学", "https://www.shimane-u.ac.jp/nyushi/information/application/"],
		["広島大学", "https://www.hiroshima-u.ac.jp/nyushi/yoko_doga/yoko"],
		["山口大学", "https://www.yamaguchi-u.ac.jp/nyushi/yoko/index.html"],
		["香川大学", "https://www.kagawa-u.ac.jp/admission/admission_guide/guide22/"],
		["愛媛大学", "https://www.ehime-u.ac.jp/entrance/selection-guidelines/"],
		["高知大学", "https://nyusi.kochi-u.jp/nyushi/admissions"],
		["福岡教育大学", "https://www.fukuoka-edu.ac.jp/admissions/information/general.html"],
		["九州大学", "https://www.kyushu-u.ac.jp/ja/admission/faculty/selection/"],
		["長崎大学", "https://www.nagasaki-u.ac.jp/nyugaku/admission/selection/"],
		["熊本大学", "https://www.kumamoto-u.ac.jp/nyuushi/gakubunyushi/gakuseibosyuyoukoutou"],
		["鹿児島大学", "https://www.kagoshima-u.ac.jp/exam/youkou.html"],
		["琉球大学", "https://www.u-ryukyu.ac.jp/admissions/recruitment/"]
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
		["富山大学", "https://www.u-toyama.ac.jp/admission/undergraduate-exam/guidebook/"],
		["金沢大学", "https://www.kanazawa-u.ac.jp/admission/boshuyoko/"],
		["福井大学", "https://www.u-fukui.ac.jp/user_admission/examination/essential_point/"],
		["岐阜大学", "https://www.gifu-u.ac.jp/admission/f_applicant/guide.html"],
		["静岡大学", "https://www.shizuoka.ac.jp/nyushi/outline/course/"],
		["浜松医科大学", "https://www.hama-med.ac.jp/admission/faculty/guideline/index.html"],
		["名古屋大学", "https://www.nagoya-u.ac.jp/admissions/exam/us-exam/cat/index.html"],
		["愛知教育大学", "https://www.aichi-edu.ac.jp/exam/faculty/info/general/index.html"],
		["名古屋工業大学", "https://www.nitech.ac.jp/examination/gakubu/request.html"],
		["三重大学", "https://www.mie-u.ac.jp/exam/faculty/guidelines/index.html"],
		["滋賀医科大学", "https://www.shiga-med.ac.jp/admission/undergraduate/requirements"],
		["京都大学", "https://www.kyoto-u.ac.jp/ja/admissions/undergrad/requirements"],
		["京都教育大学", "https://www.kyokyo-u.ac.jp/admission/gakubu/youkou/"],
		["京都工芸繊維大学", "https://www.kit.ac.jp/test_index/school_news/undergraduate/"],
		["大阪大学", "https://www.osaka-u.ac.jp/ja/admissions/faculty/guideline"],
		["大阪教育大学", "https://osaka-kyoiku.ac.jp/admission/department/"],
		["神戸大学", "https://www.office.kobe-u.ac.jp/stdnt-examinavi/documents/boshu_youkou/index.html"],
		["奈良教育大学", "https://www.nara-edu.ac.jp/admissions/claiml.html"],
		["奈良女子大学", "https://www.nara-wu.ac.jp/nyusi/nyusi2_a.html"],
		["和歌山大学", "https://www.wakayama-u.ac.jp/admission/faculty/invitation/"],
		["鳥取大学", "https://www.admissions.adm.tottori-u.ac.jp/schedule"],
		["島根大学", "https://www.shimane-u.ac.jp/nyushi/information/application/"],
		["岡山大学", "https://www.okayama-u.ac.jp/tp/admission/kansuruyoko.html"],
		["広島大学", "https://www.hiroshima-u.ac.jp/nyushi/yoko_doga/yoko"],
		["山口大学", "https://www.yamaguchi-u.ac.jp/nyushi/yoko/index.html"],
		["徳島大学", "https://www.tokushima-u.ac.jp/admission/admission/senbatsuyoko.html"],
		["香川大学", "https://www.kagawa-u.ac.jp/admission/admission_guide/guide22/"],
		["愛媛大学", "https://www.ehime-u.ac.jp/entrance/selection-guidelines/"],
		["高知大学", "https://nyusi.kochi-u.jp/nyushi/admissions"],
		["福岡教育大学", "https://www.fukuoka-edu.ac.jp/admissions/information/general.html"],
		["九州大学", "https://www.kyushu-u.ac.jp/ja/admission/faculty/selection/"],
		["九州工業大学", "https://www.kyutech.ac.jp/examination/gs-essential-point.html"],
		["佐賀大学", "https://www.sao.saga-u.ac.jp/gakubu/gakubu_ippan.html"],
		["長崎大学", "https://www.nagasaki-u.ac.jp/nyugaku/admission/selection/"],
		["熊本大学", "https://www.kumamoto-u.ac.jp/nyuushi/gakubunyushi/gakuseibosyuyoukoutou"],
		["大分大学", "https://www.oita-u.ac.jp/06nyushi/gakubu/gakubu-ippan.html"],
		["宮崎大学", "https://www.miyazaki-u.ac.jp/exam/department-exam/selection.html"],
		["鹿児島大学", "https://www.kagoshima-u.ac.jp/exam/youkou.html"],
		["琉球大学", "https://www.u-ryukyu.ac.jp/admissions/recruitment/"]
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
		["富山大学", "https://www.u-toyama.ac.jp/admission/undergraduate-exam/guidebook/"],
		["金沢大学", "https://www.kanazawa-u.ac.jp/admission/boshuyoko/"],
		["福井大学", "https://www.u-fukui.ac.jp/user_admission/examination/essential_point/"],
		["岐阜大学", "https://www.gifu-u.ac.jp/admission/f_applicant/guide.html"],
		["静岡大学", "https://www.shizuoka.ac.jp/nyushi/outline/course/"],
		["名古屋大学", "https://www.nagoya-u.ac.jp/admissions/exam/us-exam/cat/index.html"],
		["愛知教育大学", "https://www.aichi-edu.ac.jp/exam/faculty/info/general/index.html"],
		["名古屋工業大学", "https://www.nitech.ac.jp/examination/gakubu/request.html"],
		["豊橋技術科学大学", "https://www.tut.ac.jp/exam/entrance/collect.html"],
		["三重大学", "https://www.mie-u.ac.jp/exam/faculty/guidelines/index.html"],
		["滋賀大学", "https://www.shiga-u.ac.jp/admission/examination_info/guideline/"],
		["京都大学", "https://www.kyoto-u.ac.jp/ja/admissions/undergrad/requirements"],
		["京都教育大学", "https://www.kyokyo-u.ac.jp/admission/gakubu/youkou/"],
		["京都工芸繊維大学", "https://www.kit.ac.jp/test_index/school_news/undergraduate/"],
		["大阪大学", "https://www.osaka-u.ac.jp/ja/admissions/faculty/guideline"],
		["大阪教育大学", "https://osaka-kyoiku.ac.jp/admission/department/"],
		["兵庫教育大学", "https://www.hyogo-u.ac.jp/admission/education/request.php"],
		["神戸大学", "https://www.office.kobe-u.ac.jp/stdnt-examinavi/documents/boshu_youkou/index.html"],
		["奈良教育大学", "https://www.nara-edu.ac.jp/admissions/claiml.html"],
		["奈良女子大学", "https://www.nara-wu.ac.jp/nyusi/nyusi2_a.html"],
		["和歌山大学", "https://www.wakayama-u.ac.jp/admission/faculty/invitation/"],
		["鳥取大学", "https://www.admissions.adm.tottori-u.ac.jp/schedule"],
		["島根大学", "https://www.shimane-u.ac.jp/nyushi/information/application/"],
		["岡山大学", "https://www.okayama-u.ac.jp/tp/admission/kansuruyoko.html"],
		["広島大学", "https://www.hiroshima-u.ac.jp/nyushi/yoko_doga/yoko"],
		["山口大学", "https://www.yamaguchi-u.ac.jp/nyushi/yoko/index.html"],
		["徳島大学", "https://www.tokushima-u.ac.jp/admission/admission/senbatsuyoko.html"],
		["鳴門教育大学", "https://www.naruto-u.ac.jp/e-ouen/02/005.html"],
		["香川大学", "https://www.kagawa-u.ac.jp/admission/admission_guide/guide22/"],
		["愛媛大学", "https://www.ehime-u.ac.jp/entrance/selection-guidelines/"],
		["高知大学", "https://nyusi.kochi-u.jp/nyushi/admissions"],
		["福岡教育大学", "https://www.fukuoka-edu.ac.jp/admissions/information/general.html"],
		["九州大学", "https://www.kyushu-u.ac.jp/ja/admission/faculty/selection/"],
		["九州工業大学", "https://www.kyutech.ac.jp/examination/gs-essential-point.html"],
		["佐賀大学", "https://www.sao.saga-u.ac.jp/gakubu/gakubu_ippan.html"],
		["長崎大学", "https://www.nagasaki-u.ac.jp/nyugaku/admission/selection/"],
		["熊本大学", "https://www.kumamoto-u.ac.jp/nyuushi/gakubunyushi/gakuseibosyuyoukoutou"],
		["大分大学", "https://www.oita-u.ac.jp/06nyushi/gakubu/gakubu-ippan.html"],
		["宮崎大学", "https://www.miyazaki-u.ac.jp/exam/department-exam/selection.html"],
		["鹿児島大学", "https://www.kagoshima-u.ac.jp/exam/youkou.html"],
		["鹿屋体育大学", "https://www.nifs-k.ac.jp/admission/general/about/document-request"],
		["琉球大学", "https://www.u-ryukyu.ac.jp/admissions/recruitment/"]
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
		// 東海・北陸・近畿地区
		["信州大学", "https://www.shinshu-u.ac.jp/ad_portal/selection/index.html"],
		["富山大学", "https://www.u-toyama.ac.jp/admission/undergraduate-exam/guidebook/"],
		["金沢大学", "https://www.kanazawa-u.ac.jp/admission/boshuyoko/"],
		["福井大学", "https://www.u-fukui.ac.jp/user_admission/examination/essential_point/"],
		["岐阜大学", "https://www.gifu-u.ac.jp/admission/f_applicant/guide.html"],
		["静岡大学", "https://www.shizuoka.ac.jp/nyushi/outline/course/"],
		["浜松医科大学", "https://www.hama-med.ac.jp/admission/faculty/guideline/index.html"],
		["名古屋大学", "https://www.nagoya-u.ac.jp/admissions/exam/us-exam/cat/index.html"],
		["愛知教育大学", "https://www.aichi-edu.ac.jp/exam/faculty/info/general/index.html"],
		["名古屋工業大学", "https://www.nitech.ac.jp/examination/gakubu/request.html"],
		["豊橋技術科学大学", "https://www.tut.ac.jp/exam/entrance/collect.html"],
		["三重大学", "https://www.mie-u.ac.jp/exam/faculty/guidelines/index.html"],
		["滋賀大学", "https://www.shiga-u.ac.jp/admission/examination_info/guideline/"],
		["滋賀医科大学", "https://www.shiga-med.ac.jp/admission/undergraduate/requirements"],
		["京都大学", "https://www.kyoto-u.ac.jp/ja/admissions/undergrad/requirements"],
		["京都教育大学", "https://www.kyokyo-u.ac.jp/admission/gakubu/youkou/"],
		["京都工芸繊維大学", "https://www.kit.ac.jp/test_index/school_news/undergraduate/"],
		["大阪大学", "https://www.osaka-u.ac.jp/ja/admissions/faculty/guideline"],
		["大阪教育大学", "https://osaka-kyoiku.ac.jp/admission/department/"],
		["兵庫教育大学", "https://www.hyogo-u.ac.jp/admission/education/request.php"],
		["神戸大学", "https://www.office.kobe-u.ac.jp/stdnt-examinavi/documents/boshu_youkou/index.html"],
		["奈良教育大学", "https://www.nara-edu.ac.jp/admissions/claiml.html"],
		["奈良女子大学", "https://www.nara-wu.ac.jp/nyusi/nyusi2_a.html"],
		["和歌山大学", "https://www.wakayama-u.ac.jp/admission/faculty/invitation/"],
		["鳥取大学", "https://www.admissions.adm.tottori-u.ac.jp/schedule"],
		["島根大学", "https://www.shimane-u.ac.jp/nyushi/information/application/"],
		["岡山大学", "https://www.okayama-u.ac.jp/tp/admission/kansuruyoko.html"],
		["広島大学", "https://www.hiroshima-u.ac.jp/nyushi/yoko_doga/yoko"],
		["山口大学", "https://www.yamaguchi-u.ac.jp/nyushi/yoko/index.html"],
		["徳島大学", "https://www.tokushima-u.ac.jp/admission/admission/senbatsuyoko.html"],
		["鳴門教育大学", "https://www.naruto-u.ac.jp/e-ouen/02/005.html"],
		["香川大学", "https://www.kagawa-u.ac.jp/admission/admission_guide/guide22/"],
		["愛媛大学", "https://www.ehime-u.ac.jp/entrance/selection-guidelines/"],
		["高知大学", "https://nyusi.kochi-u.jp/nyushi/admissions"],
		["福岡教育大学", "https://www.fukuoka-edu.ac.jp/admissions/information/general.html"],
		["九州大学", "https://www.kyushu-u.ac.jp/ja/admission/faculty/selection/"],
		["九州工業大学", "https://www.kyutech.ac.jp/examination/gs-essential-point.html"],
		["佐賀大学", "https://www.sao.saga-u.ac.jp/gakubu/gakubu_ippan.html"],
		["長崎大学", "https://www.nagasaki-u.ac.jp/nyugaku/admission/selection/"],
		["熊本大学", "https://www.kumamoto-u.ac.jp/nyuushi/gakubunyushi/gakuseibosyuyoukoutou"],
		["大分大学", "https://www.oita-u.ac.jp/06nyushi/gakubu/gakubu-ippan.html"],
		["宮崎大学", "https://www.miyazaki-u.ac.jp/exam/department-exam/selection.html"],
		["鹿児島大学", "https://www.kagoshima-u.ac.jp/exam/youkou.html"],
		["鹿屋体育大学", "https://www.nifs-k.ac.jp/admission/general/about/document-request"],
		["琉球大学", "https://www.u-ryukyu.ac.jp/admissions/recruitment/"]
	];
	
  const nationalUniversityWithLinksYet = [

		// 中国・四国地区

		// 九州・沖縄地区
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
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <header className="py-8">
          <h1 className="text-4xl font-bold text-slate-900 text-center mb-4 ">
            理系地学入門とは
          </h1>
          <p className="text-lg text-gray-600 ">
						　「地学」は「地球科学」の略称であり，地球を構成する物質（鉱物，岩石）から，大気，海洋，地球内部構造，さらには地球環境に影響を与える宇宙（天文学）まで，地球科学全般にわたる分野を対象とする学問である。「理系地学」とは，主として国公立大学の理系学部を受験する際に選択可能な，高校理科の専門科目「地学」を指す。現在，物理や化学，生物と違って大学入学における受験者数が少ないため，「地学」という語は主に文系志望者が選択する「地学基礎」の文脈で使用されるケースが多い。したがって専門科目としての地学を呼称する場合，地学基礎と区別する目的で「理系地学」と呼ばれる。本サイトの設立趣旨に代えて，次のようなデータを示す。
					</p>
        </header>
				

        {/* セクション1: 高校教員採用率 */}
				<section className="bg-white  rounded-lg shadow-md p-6 mb-8">
						<h2 className="text-2xl font-semibold text-gray-900  mb-4">
								Ⅰ　高校教員採用試験における理科（地学）の募集状況
						</h2>
						
						<p className="text-gray-700  py-4"> 情報誌教員養成セミナー記載の各年度の全国教員採用試験実施内容一覧に基づく，高校理科の教員を募集しているものの，募集教科に「地学」のない（「理科（物理・化学・生物）」など）都道府県市（2024年度は{total2024}，2025年度は{total2025}の自治体が対象）の数。「理科」単独，または「物理・化学・生物・地学」などの表記をしている自治体を除外することで計上。
						</p>

						<div className="grid md:grid-cols-2 gap-6">
								{/* 2024年度版の分析結果 */}
								<div className="p-6 bg-red-50  rounded-lg">
										<div className="text-sm text-gray-600  mb-2">2024年度版（2023年夏実施）</div>
										<div className="text-xl font-bold text-red-700  mb-3">地学教員を募集しない自治体数</div>
										<div className="text-5xl font-bold text-red-600  mb-2">{excluded2024}<span className="text-2xl mx-1">自治体</span></div>
										<div className="text-2xl text-gray-700 ">/ {total2024}自治体</div>
										<div className="text-sm text-gray-500  mt-4">不実施率: <span className="text-lg font-semibold">{excludedRate2024}</span> ％</div>
										
										<h4 className="mt-4 text-sm font-semibold text-red-700  border-t border-red-300  pt-3">【地学教員を募集しない自治体】</h4>
										<div className="text-xs">
												{excludedList2024.map((name, index) => (
														<React.Fragment key={name}>
															<span>{name}</span>
															{index < excludedList2024.length - 1 && " / "}
														</React.Fragment>
												))}
										</div>
								</div>

								{/* 2025年度版の分析結果 */}
								<div className="p-6 bg-blue-50  rounded-lg">
										<div className="text-sm text-gray-600  mb-2">2025年度版（2024年夏実施）</div>
										<div className="text-xl font-bold text-blue-700  mb-3">地学教員を募集しない自治体数</div>
										<div className="text-5xl font-bold text-blue-600  mb-2">{excluded2025}<span className="text-2xl mx-1">自治体</span></div>
										<div className="text-2xl text-gray-700 ">/ {total2025}自治体</div>
										<div className="text-sm text-gray-500  mt-4">不実施率: <span className="text-lg font-semibold">{excludedRate2025}</span> ％</div>
										
										<h4 className="mt-4 text-sm font-semibold text-blue-700  border-t border-blue-300  pt-3">【地学教員を募集しない自治体】</h4>
										<div className="text-xs">
												{excludedList2025.map((name, index) => (
														<React.Fragment key={name}>
															<span>{name}</span>
															{index < excludedList2025.length - 1 && " / "}
														</React.Fragment>
												))}
										</div>
								</div>
						</div>
						
						<div className="p-2">
							<p className="text-left text-gray-600  text-xs">
								古い情報・誤情報が含まれる場合がありますので<strong className="text-red-600 font-sans">採用試験を受ける際などは必ず各自治体の募集要項などを確認し</strong>，このデータは参考程度にとどめてください。
							</p>
						</div>

						<div className="p-4 bg-blue-50  rounded">
						<h3 className="font-semibold text-gray-900  mb-2">データからわかること</h3>
								<ul className="list-disc list-inside text-gray-700  space-y-1">
										<li>「理科」のみ記載がある場合も多く，残りの自治体で必ずしも地学教員として従事できるとは限らない</li>
										<li>5の自治体（神奈川県/静岡県/京都市/長崎県/宮崎県）は2024年度には地学教員（理科としての採用を含む）採用枠があったが，2025年度にはなくなり，一方で4の自治体（青森県/滋賀県/香川県/熊本県）では2024年度の採用枠はなかったが2025年度に採用枠が設けられた
</li>
										<li>採用枠が設けられた年度であっても受験者数は他科目の1/10ほど〔例：令和７年度東京都公立学校教員採用候補者選考（８年度採用）結果によると物理・化学・生物・地学の受験者数はそれぞれ95，110，123，15人〕</li>
								</ul>
						</div>
				</section>

        {/* セクション2: 高校における履修率 */}
				<section className="bg-white  rounded-lg shadow-md p-6 mb-8">
					<h2 className="text-2xl font-semibold text-gray-900  mb-4">
						Ⅱ　高等学校における理科科目の開設状況（学年別）
					</h2>
					<p className="text-gray-700  mb-6">
						令和5年度（2023年度）公立高等学校における教育課程の編成・実施状況調査の結果に基づく，普通科等における理科基礎科目および理科専門科目の学年別開設状況。
					</p>
					
					<div className="p-4">
							{/* 基礎科目 (1-3年次) の表示 - 3列グリッド */}
							<div className="grid md:grid-cols-3 gap-6 mb-8">
									<SubjectBarChart 
											title="1年次 基礎科目" 
											data={basicSubjectsOffering1} 
									/>
									<SubjectBarChart 
											title="2年次 基礎科目" 
											data={basicSubjectsOffering2} 
									/>
									<SubjectBarChart 
											title="3年次 基礎科目" 
											data={basicSubjectsOffering3} 
									/>
							</div>

							{/* 専門科目 (2-3年次) の表示 - 2列グリッド */}
							<div className="grid md:grid-cols-2 gap-6 mb-6">
									<SubjectBarChart 
											title="2年次 専門科目" 
											data={specializedSubjectsOffering2} 
									/>
									<SubjectBarChart 
											title="3年次 専門科目" 
											data={specializedSubjectsOffering3} 
									/>
							</div>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full text-sm border-collapse">
							<caption className="text-left text-gray-600  mb-2 text-xs">
								表：理科科目開設状況の学年別比較（2023年度入学者対象データ）
							</caption>
							<thead className="bg-gray-100 ">
								<tr>
									<th className="border border-gray-300  p-2 text-left">科目</th>
									<th className="border border-gray-300  p-2">1年次 開設率 (%)</th>
									<th className="border border-gray-300  p-2">2年次 開設率 (%)</th>
									<th className="border border-gray-300  p-2">3年次 開設率 (%)</th>
								</tr>
							</thead>
							<tbody>
								{gradeOfferingData.map((item, index) => (
									<tr key={item.subject} className="text-center hover:bg-gray-50 :bg-gray-700/50">
										<td className={`border border-gray-300  p-2 text-left font-semibold ${item.subject.includes('基礎') || item.subject.includes('人間生活') ? 'bg-blue-50/50 ' : ''}`}>
											{item.subject}
										</td>
										<td className="border border-gray-300  p-2">
											{item.grade1}%
										</td>
										<td className="border border-gray-300  p-2">
											{item.grade2}%
										</td>
										<td className="border border-gray-300  p-2">
											{item.grade3}%
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="mt-6 p-4 bg-blue-50  rounded">
					<h3 className="font-semibold text-gray-900  mb-2">データからわかること</h3>
					<ul className="list-disc list-inside text-gray-700  space-y-1">
						<li>
						1年次の基礎科目は生物基礎が50％を超える一方，地学基礎は10％を切って顕著に少ない
						</li>
						<li>
						2年次の基礎科目は化学基礎が1年次とほとんど変わらない一方で物理基礎と地学基礎が増加し，4科目の差は最大でも20ポイントほど
						</li>
						<li>
						3年次の基礎科目は大きく減少し，4科目の差も最大でも10ポイント以下に縮小
						</li>
					<li>
					専門科目は2年次から開設が始まり，特に3年次で80%前後の非常に高い開設率を示す
					</li>
					<li>
					2年次の専門科目は，物理・化学・生物が約40%であるのに対し，地学は2％ほどである
					</li>
					<li>
					3年次の専門科目は，物理・化学・生物が約80%ほどに増加しているのに対し，地学は10％を切る
					</li>
					</ul>
					</div>

				</section>

        {/* セクション3: 大学入学共通テストにおける受験者数の推移 */}
        <section className="bg-white  rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900  mb-4">
            Ⅲ　大学入学共通テスト理科専門科目の受験者数推移
          </h2>
          <p className="text-gray-700  py-4">
            令和3年度から令和7年度までの各年度の大学入学共通テスト実施結果に基づく，理科専門科目（物理・化学・生物・地学）の受験者数。
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
              <thead className="bg-gray-100 ">
                <tr>
                  <th className="border border-gray-300  p-2" >年度</th>
                  <th className="border border-gray-300  p-2" colSpan={2}>物理</th>
                  <th className="border border-gray-300  p-2" colSpan={2}>化学</th>
                  <th className="border border-gray-300  p-2" colSpan={2}>生物</th>
                  <th className="border border-gray-300  p-2" colSpan={2}>地学</th>
                  <th className="border border-gray-300  p-2">理科全体</th>
                </tr>
              </thead>
              <tbody>
                {commonTestData.map((row, idx) => (
                  <tr key={idx} className="text-center">
                    <td className="border border-gray-300  p-2">{row.year}</td>
										
                    <td className="border border-gray-300  p-2">{row.physics.toLocaleString()}</td>
                    <td className="border border-gray-300  p-2">{((row.physics / (row.physics + row.chemistry + row.biology + row.geoscience)) * 100).toFixed(2)}%</td>
										
                    <td className="border border-gray-300  p-2">{row.chemistry.toLocaleString()}</td>
                    <td className="border border-gray-300  p-2">{((row.chemistry / (row.physics + row.chemistry + row.biology + row.geoscience)) * 100).toFixed(2)}%</td>
										
                    <td className="border border-gray-300  p-2">{row.biology.toLocaleString()}</td>
                    <td className="border border-gray-300  p-2">{((row.biology / (row.physics + row.chemistry + row.biology + row.geoscience)) * 100).toFixed(2)}%</td>
										
                    <td className="border border-gray-300  p-2 bg-slate-100 font-semibold">{row.geoscience.toLocaleString()}</td>
                    <td className="border border-gray-300  p-2 bg-slate-100 font-semibold">{((row.geoscience / (row.physics + row.chemistry + row.biology + row.geoscience)) * 100).toFixed(2)}%</td>
                    <td className="border border-gray-300  p-2">{(row.physics + row.chemistry + row.biology + row.geoscience).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-blue-50  rounded">
            <h3 className="font-semibold text-gray-900  mb-2">データからわかること</h3>
            <ul className="list-disc list-inside text-gray-700  space-y-1">
              <li>化学の受験者数は一貫して最大であり，約18万人で推移している</li>
							<li>物理の受験者数は令和4年度から0.5ポイント未満の微小な減少を続けているものの，化学の受験者数の8割ほどを維持し続けている</li>
							<li>生物の受験者数はこの4つの科目の中では非常に安定して推移している</li>
              <li>地学受験者数は理科全体の1％未満である</li>
              <li>地学受験者数は，令和4年度以降0.1ポイント未満，500人未満の増加傾向にある</li>
							<li>地学受験者数は，令和6年度から令和7年度にかけて0.14ポイント，573人増加した</li>
            </ul>
          </div>
        </section>
				
        {/* セクション4: 大学入試における採用状況 */}
        <section className="bg-white  rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900  mb-4">
            Ⅳ　国立大学（学部）における地学の受験可否
          </h2>
					
          <p className="text-gray-700  py-4">
						各大学の入学者募集要項に基づく，地学の試験を利用・実施している国立大学とその数。左は共通テストで理科を使用する国立大学{nationalUniversityWithLinks.length}校のうち地学を利用できる大学の数。
						右は二次試験で理科を使用する国立大学{nationalUniversityScience.length}校のうち地学を利用できる大学の数。総合問題や面接の内容を含めていない場合がある。リンク先は原則として学部入試の募集要項または入試情報全体を掲載しているページ。
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-green-50  rounded-lg">
              <div className="text-sm text-gray-600  mb-2">共通テストで地学を利用できる大学</div>
              <div className="text-5xl font-bold text-green-600  mb-2">{nationalUniversityCommonGeo.length}<span className="text-2xl mx-1">校</span></div>
              <div className="text-2xl text-gray-700 ">/ {nationalUniversityWithLinks.length + publicUniversityWithLinks.length}校</div>
              <div className="text-sm text-gray-500  mt-4">採用率: <span className="text-lg font-semibold">{((nationalUniversityCommonGeo.length / (nationalUniversityWithLinks.length + publicUniversityWithLinks.length))*100).toFixed(2)}</span> ％</div>
							<h4 className="mt-4 text-sm font-semibold text-green-700  border-t border-green-300  pt-3">【共通テストで地学を利用できる大学】</h4>
							<div className="text-xs">
							{nlinkElementsCommonGeo}
							</div>
            </div>

            <div className="p-6 bg-red-50  rounded-lg">
              <div className="text-sm text-gray-600  mb-2">二次試験で地学を利用できる大学</div>
              <div className="text-5xl font-bold text-red-600  mb-2">{nationalUniversityGeo.length}<span className="text-2xl mx-1">校</span></div>
              <div className="text-2xl text-gray-700 ">/ {nationalUniversityScience.length + publicUniversityWithLinks.length}校</div>
              <div className="text-sm text-gray-500  mt-4">採用率: <span className="text-lg font-semibold">{((nationalUniversityGeo.length / (nationalUniversityScience.length + publicUniversityWithLinks.length))*100).toFixed(2)}</span> ％</div>
							<h4 className="mt-4 text-sm font-semibold text-red-700  border-t border-red-300  pt-3">【二次試験で地学を利用できる大学】</h4>
							<div className="text-xs">
							{nlinkElementsGeo}
							</div>
            </div>
          </div>
					<div className="py-4 px-2">
						<p className="text-left text-gray-600  text-xs">
							古い情報・誤情報が含まれる場合がありますので<strong className="text-red-600 font-sans">受験などの際は必ず各大学の募集要項などを確認し</strong>，このデータは参考程度にとどめてください。
						</p>
          </div>

          <div className="mt-2 p-4 bg-blue-50  rounded">
            <h3 className="font-semibold text-gray-900  mb-2">データからわかること</h3>
            <ul className="list-disc list-inside text-gray-700  space-y-1">
							<li>共通テストの理科を科すものの地学を全く利用できない大学は{((1-(nationalUniversityCommonGeo.length / (nationalUniversityWithLinks.length )))*100).toFixed(1)}%に留まる</li>
              <li>二次試験で理科を科すものの地学を全く選択できない大学は{((1-(nationalUniversityGeo.length / (nationalUniversityScience.length )))*100).toFixed(1)}%にのぼる</li>
							<li>
							二次試験で理科を科す大学群には，医学教育に特化していて地学とは直接的な関連性がない医科系単科大学（浜松医科大学・滋賀医科大学），特定の工学分野に特化していて地学とは直接的な関連性がない工業系単科大学（名古屋工業大学・九州工業大学）やその類型（電気通信大学）が含まれている
							</li>
            </ul>
          </div>
					
        </section>

        {/* セクション5: 論理的考察 */}
        <section className="bg-white  rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900  mb-4">
            Ⅴ　因果関係など
          </h2>
          
          <div className="space-y-6">
            <div>
              <p className="text-gray-700  py-2">
                　地学が受験教科として選ばれないその他の理由など。
              </p>
              <div className="bg-gray-100  p-8 mx-6 my-4 rounded space-y-2">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 text-red-600 text-4xl flex items-center justify-center font-bold">❶</div>
                  <div className="text-gray-900 ">物理・化学・生物・数学の横断的な知識が必要</div>
                </div>
                <div className="flex items-center space-x-4 pt-2">
                  <div className="w-8 h-8 text-black/20 text-4xl flex items-center justify-center font-bold"><ImArrowDown /></div>
                  <div className="text-gray-900 "></div>
                </div>
								
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 text-orange-600 text-4xl flex items-center justify-center font-bold">❷</div>
                  <div className="text-gray-900 ">大学教養課程の物理・化学分野の必要性・専門性・難易度が高い</div>
                </div>
                <div className="flex items-center space-x-4 pt-2">
                  <div className="w-8 h-8 text-black/20 text-4xl flex items-center justify-center font-bold"><ImArrowDown /></div>
                  <div className="text-gray-900 "></div>
                </div>
								
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 text-green-600 text-4xl flex items-center justify-center font-bold">❸</div>
                  <div className="text-gray-900 ">大学二次試験で地学を採用しない</div>
                </div>
                <div className="flex items-center space-x-4 pt-2">
                  <div className="w-8 h-8 text-black/20 text-4xl flex items-center justify-center font-bold"><ImArrowDown /></div>
                  <div className="text-gray-900 "></div>
                </div>
								
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 text-emerald-600 text-4xl flex items-center justify-center font-bold">❹</div>
                  <div className="text-gray-900 ">受験に不要な科目として認識される</div>
                </div>
                <div className="flex items-center space-x-4 pt-2">
                  <div className="w-8 h-8 text-black/20 text-4xl flex items-center justify-center font-bold"><ImArrowDown /></div>
                  <div className="text-gray-900 "></div>
                </div>
								
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 text-cyan-800 text-4xl flex items-center justify-center font-bold">❺</div>
                  <div className="text-gray-900 ">高校における開設率の低下</div>
                </div>
                <div className="flex items-center space-x-4 pt-2">
                  <div className="w-8 h-8 text-black/20 text-4xl flex items-center justify-center font-bold"><ImArrowDown /></div>
                  <div className="text-gray-900 "></div>
                </div>
								
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 text-blue-800 text-4xl flex items-center justify-center font-bold">❻</div>
                  <div className="text-gray-900 ">地学専門教員の採用抑制</div>
                </div>
                <div className="flex items-center space-x-4 pt-2">
                  <div className="w-8 h-8 text-black/20 text-4xl flex items-center justify-center font-bold"><ImArrowDown /></div>
                  <div className="text-gray-900 "></div>
                </div>
								
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 text-violet-800 text-4xl flex items-center justify-center font-bold">❼</div>
                  <div className="text-gray-900 ">教科書の需要・機会が低下</div>
                </div>
              </div>
            </div>
						<div className="mt-2 p-4 bg-blue-50  rounded">
							<ul className="list-none list-inside text-gray-700  space-y-1">
								<li>❶　地学は，地球の構造や気象，宇宙，地震などを扱う学問で，これらの現象を理解するには物理の力学や波動，化学の反応や物質の性質，生物の進化や環境，数学の微積分などが必要になり，高校生が各分野の基礎を十分に学ばないうちに地学を選択しようとすると，広範な知識の要求に難しさを感じる</li>
								<li>❷　大学では，物理や化学は専門科目として重視され，授業も高度で難易度が高い上，物理では数式を使って自然現象をモデル化したり，化学では分子構造や反応機構を学ぶなど，理系学生にとって必要不可欠であり優先度が高い</li>
								
								<li>➌　理系の二次試験，特に医学部や工学部では，物理・化学・生物（若干数の大学では生物も選択できない）は選択できるが地学は選択できないところが多い</li>
								<li>❹　文系においては環境や防災意識の高まりからか共通テストを利用できる大学は増えたが，収益性が低い，学部・学科がない，目的が環境や防災のみに終始しているなどから理系の受験機会は制限されている</li>
								<li>❺　高校カリキュラムは，形式的には多様な科目が用意されるが，実質的には大学入試の合否に直結する科目が重視される</li>
								<li>❻　国公立高校における地学教員の採用枠が少なく，採用を行っていない年次があるほか，採用年次であっても応募者が少ないことなどの指摘がある</li>
								<li>❼　出版社にとって需要の少ない教科書は採算が取れにくくなり，質の高い教材を開発・出版するインセンティブが低下し，市場に出回る地学の教材の種類や機会は減少の一途をたどる（現在理系地学の教科書はわずか1社のみが発行している）</li>
							</ul>
						</div>
          </div>
        </section>

        {/* セクション6: 結論 */}
        <section className="bg-white  rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900  mb-4">
            Ⅵ　まとめ
          </h2>
          
          <div className="space-y-4 text-gray-700 ">
            <p className="text-gray-700  py-2">
              諸データを見ると，大学入試において地学は周縁化の傾向が強い。
            </p>
            
            <div className="bg-gray-100  p-4 rounded">
              <h3 className="font-semibold text-gray-900  mb-2">まとめ</h3>
              <ul className="list-decimal list-inside space-y-2">
                <li>高校地学教員の採用の機会少ないうえ，応募人数が他の1/10ほどと少ない</li>
                <li>専門科目としての地学の開講率が10％を超えず，著しく低い</li>
								<li>共通テストの受験者数は全体の1%を超えず，著しく低い</li>
                <li>国公立大学では半分ほどの大学で二次試験に地学を利用できない</li>
                <li>これらの背景には様々な根本的・構造的課題がある</li>
              </ul>
            </div>
            
            <p>
              　かつての教育過程で，内容的に現在の「地学基礎」に当たる「地学Ⅰ」の履修率が数％であったことにくらべれば，現在の地学基礎の開講率を見るとそれほど縮小・廃止の方向に必ずしも進んでいるわけではない。しかし，こと「地学」においては，教育課程上科目が存在しても，未だ実質的な教育機会は極めて限定的であると言わざるを得ない。
            </p>
            <p>	　2025年度より，高校各教科で教育指導要領の改訂により新課程に移行し，理科の各科目は内容や構成が変更された。これを受け，物理では「宇宙の晴れ上がり」を原子分野に含むようになった。生物では，この改正により「全球凍結」「示準化石」「示相化石」「大陸移動説」「収束進化」といった地学でいうところの地球の歴史に関連する内容が削除される傾向に転じた。
						</p>
          </div>
        </section>

        {/* 出典 */}
        <section className="bg-white  rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900  mb-4">
            データ出典・参考文献
          </h2>
          <div className="text-sm text-gray-600  space-y-2">
					
						<div>
							<h3 className="font-semibold text-gray-900 mb-2">教員採用試験対策サイト</h3>
							<ul className="list-disc list-inside space-y-1 ml-4">
								<li><cite className="hover:text-gray-500 not-italic"><a href="https://book.jiji.com/basic/app_guide/" target="_blank" rel="noopener noreferrer">教員採用試験データ｜教員採用試験対策サイト（時事通信出版局）</a></cite></li>
							</ul>
						</div>

						<div>
							<h3 className="font-semibold text-gray-900 mb-2">文部科学省</h3>
							<ul className="list-disc list-inside space-y-1 ml-4">
								<li><cite className="hover:text-gray-500 not-italic"><a href="https://www.mext.go.jp/a_menu/shotou/new-cs/1368209_00001.htm" target="_blank" rel="noopener noreferrer">令和5年度公立高等学校における教育課程の編成・実施状況調査の結果について（文部科学省）</a></cite></li>
							</ul>
						</div>

            <div>
              <h3 className="font-semibold text-gray-900  mb-2">大学入試センター</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
								<li><cite className="hover:text-gray-500 not-italic"><a href="https://www.dnc.ac.jp/albums/abm.php?d=733&f=abm00005261.pdf&n=%E4%BB%A4%E5%92%8C%EF%BC%97%E5%B9%B4%E5%BA%A6%E5%A4%A7%E5%AD%A6%E5%85%A5%E5%AD%A6%E5%85%B1%E9%80%9A%E3%83%86%E3%82%B9%E3%83%88_%E5%AE%9F%E6%96%BD%E7%B5%90%E6%9E%9C%E3%81%AE%E6%A6%82%E8%A6%81.pdf" target="_blank" rel="noopener noreferrer">令和3年度大学入学共通テスト実施結果の概要（大学入試センター）</a></cite></li>
								<li><cite className="hover:text-gray-500 not-italic"><a href="https://www.dnc.ac.jp/albums/abm.php?d=58&f=abm00000702.pdf&n=%E4%BB%A4%E5%92%8C%EF%BC%94%E5%B9%B4%E5%BA%A6%E5%A4%A7%E5%AD%A6%E5%85%A5%E5%AD%A6%E5%85%B1%E9%80%9A%E3%83%86%E3%82%B9%E3%83%88%E5%AE%9F%E6%96%BD%E7%B5%90%E6%9E%9C%E3%81%AE%E6%A6%82%E8%A6%81.pdf" target="_blank" rel="noopener noreferrer">令和4年度大学入学共通テスト実施結果の概要（大学入試センター）</a></cite></li>
								<li><cite className="hover:text-gray-500 not-italic"><a href="https://www.dnc.ac.jp/albums/abm.php?d=494&f=abm00003434.pdf&n=%E5%AE%9F%E6%96%BD%E7%B5%90%E6%9E%9C%E3%81%AE%E6%A6%82%E8%A6%81R5.pdf" target="_blank" rel="noopener noreferrer">令和5年度大学入学共通テスト実施結果の概要（大学入試センター）</a></cite></li>
								<li><cite className="hover:text-gray-500 not-italic"><a href="https://www.dnc.ac.jp/albums/abm.php?d=654&f=abm00004367.pdf&n=%E4%BB%A4%E5%92%8C%EF%BC%96%E5%B9%B4%E5%BA%A6%E8%A9%A6%E9%A8%93_%E4%BB%A4%E5%92%8C%EF%BC%96%E5%B9%B4%E5%BA%A6%E5%A4%A7%E5%AD%A6%E5%85%A5%E5%AD%A6%E5%85%B1%E9%80%9A%E3%83%86%E3%82%B9%E3%83%88_%E5%AE%9F%E6%96%BD%E7%B5%90%E6%9E%9C%E3%81%AE%E6%A6%82%E8%A6%81.pdf" target="_blank" rel="noopener noreferrer">令和6年度大学入学共通テスト実施結果の概要（大学入試センター）</a></cite></li>
								<li><cite className="hover:text-gray-500 not-italic"><a href="https://www.dnc.ac.jp/albums/abm.php?d=733&f=abm00005261.pdf&n=%E4%BB%A4%E5%92%8C%EF%BC%97%E5%B9%B4%E5%BA%A6%E5%A4%A7%E5%AD%A6%E5%85%A5%E5%AD%A6%E5%85%B1%E9%80%9A%E3%83%86%E3%82%B9%E3%83%88_%E5%AE%9F%E6%96%BD%E7%B5%90%E6%9E%9C%E3%81%AE%E6%A6%82%E8%A6%81.pdf" target="_blank" rel="noopener noreferrer">令和7年度大学入学共通テスト実施結果の概要（大学入試センター）</a></cite></li>
              </ul>
            </div>
						
            <div>
              <h3 className="font-semibold text-gray-900  mb-2">学術論文・調査報告・その他資料</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
								<li><cite className="hover:text-gray-500 not-italic"><a href="https://www.mext.go.jp/a_menu/shotou/new-cs/1407074.htm" target="_blank" rel="noopener noreferrer">高等学校学習指導要領解説 理科編（文部科学省）</a></cite></li>
								<li><cite className="hover:text-gray-500 not-italic"><a href="https://www.jstage.jst.go.jp/article/jgeography1889/105/6/105_6_718/_article/-char/ja/" target="_blank" rel="noopener noreferrer">高校の地学教育の現状と課題｜深田地質研究所（吉岡直人）</a></cite></li>
								<li><cite className="hover:text-gray-500 not-italic"><a href="https://www.metsoc.jp/tenki/pdf/2014/2014_03_0029.pdf" target="_blank" rel="noopener noreferrer">日本の気象学の現状と展望｜日本気象学会（日本気象学会36－37期学術委員会および同委員会が依頼した執筆者グループ）</a></cite></li>
								<li>
								<cite className="hover:text-gray-500 not-italic"><a href="https://www.tandfonline.com/doi/abs/10.5408/1089-9995-56.2.113" target="_blank" rel="noopener noreferrer">An Analysis of the Bachelor of Science in Geology Degree as Offered in the United States｜Journal of Geoscience Education Volume 56 p. 113-119（Carl N. Drummond & Jane M. Markin）</a></cite>
								</li>
								<li>
								<cite className="hover:text-gray-500 not-italic"><a href="https://www.mext.go.jp/a_menu/shotou/kyoukasho/kentei/kekka.htm" target="_blank" rel="noopener noreferrer">（2022年3月）令和3年度教科用図書検定結果の概要（文部科学省）</a></cite>
								</li>
								
              </ul>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-300 ">
              <p className="text-xs">
                データは2025年11月現在
              </p>
            </div>
          </div>
        </section>

        {/* フッター */}
        <footer className="mt-12 text-center text-sm text-gray-500 ">
          <p>AlgxNef</p>
        </footer>
      </div>
    </div>
  );
};

export default GeoscienceEducationAnalysis;