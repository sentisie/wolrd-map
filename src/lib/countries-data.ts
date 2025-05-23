// Countries data with facts and statistics

export interface CountryYearData {
	capital: string;
	population: number;
	area: number;
	gdp: number;
	lifeExpectancy: number;
	literacy: number;
	facts: string[];
}

export interface CountryData {
	[year: string]: CountryYearData;
}

export interface CountriesData {
	[countryCode: string]: CountryData;
}

// Функция для генерации данных за все годы
const generateYearlyData = (
	baseYear: CountryYearData,
	startYear: number = 1990,
	endYear: number = 2025,
	options: {
		// Среднегодовой прирост (%)
		populationGrowthRate?: number;
		// Среднегодовой прирост ВВП (%)
		gdpGrowthRate?: number;
		// Среднегодовое изменение (абсолютное значение)
		lifeExpectancyChange?: number;
		literacyChange?: number;
	} = {}
): CountryData => {
	const result: CountryData = {};

	const {
		populationGrowthRate = 1.0,
		gdpGrowthRate = 2.5,
		lifeExpectancyChange = 0.15,
		literacyChange = 0.2,
	} = options;

	// Расчет начальных значений (обратный отсчет от базового года)
	const yearsBack = 2025 - startYear;
	const initialPopulation =
		baseYear.population / Math.pow(1 + populationGrowthRate / 100, yearsBack);
	const initialGdp =
		baseYear.gdp / Math.pow(1 + gdpGrowthRate / 100, yearsBack);
	let initialLifeExpectancy =
		baseYear.lifeExpectancy - lifeExpectancyChange * yearsBack;
	let initialLiteracy = baseYear.literacy - literacyChange * yearsBack;

	// Ограничения для минимальных значений
	initialLifeExpectancy = Math.max(initialLifeExpectancy, 45);
	initialLiteracy = Math.max(initialLiteracy, 50);

	for (let year = startYear; year <= endYear; year++) {
		const yearDiff = year - startYear;
		const currentPopulation =
			initialPopulation * Math.pow(1 + populationGrowthRate / 100, yearDiff);
		const currentGdp = initialGdp * Math.pow(1 + gdpGrowthRate / 100, yearDiff);

		// Линейное увеличение для ожидаемой продолжительности жизни и грамотности с ограничениями
		let currentLifeExpectancy =
			initialLifeExpectancy + lifeExpectancyChange * yearDiff;
		currentLifeExpectancy = Math.min(
			currentLifeExpectancy,
			baseYear.lifeExpectancy + 3
		);

		let currentLiteracy = initialLiteracy + literacyChange * yearDiff;
		currentLiteracy = Math.min(currentLiteracy, 99.9);

		result[year.toString()] = {
			...baseYear,
			population: Math.round(currentPopulation),
			gdp: Math.round(currentGdp * 10) / 10,
			lifeExpectancy: Math.round(currentLifeExpectancy * 10) / 10,
			literacy: Math.round(currentLiteracy * 10) / 10,
		};
	}

	return result;
};

// Полные данные по странам с историческими данными
const countriesData: CountriesData = {
	USA: generateYearlyData(
		{
			capital: "Washington D.C.",
			population: 331002651,
			area: 9833517,
			gdp: 68309,
			lifeExpectancy: 78.79,
			literacy: 99,
			facts: [
				"США имеют крупнейшую экономику в мире с ВВП более 25 триллионов долларов.",
				"В стране находятся 63 национальных парка, при этом Йеллоустоун был первым, основанным в 1872 году.",
				"Конституция США - старейшая действующая письменная национальная конституция.",
				"В Пентагоне, штаб-квартире Министерства обороны, в два раза больше туалетов, чем необходимо, поскольку он был построен во времена расовой сегрегации.",
			],
		},
		1990,
		2025,
		{
			populationGrowthRate: 0.9,
			gdpGrowthRate: 4.0,
			lifeExpectancyChange: 0.12,
			literacyChange: 0.05,
		}
	),

	RUS: generateYearlyData(
		{
			capital: "Москва",
			population: 145934462,
			area: 17098246,
			gdp: 11585,
			lifeExpectancy: 72.5,
			literacy: 99.7,
			facts: [
				"Россия занимает самую большую территорию в мире, ее площадь составляет более 17 миллионов квадратных километров.",
				"Транссибирская магистраль – самая длинная железная дорога в мире, протяженностью около 9289 километров.",
				"Озеро Байкал – самое глубокое озеро в мире и крупнейший источник пресной воды.",
				"Москва имеет самое большое количество миллиардеров среди городов мира.",
			],
		},
		1990,
		2025,
		{
			populationGrowthRate: -0.1, // Отрицательный прирост для отражения демографической ситуации
			gdpGrowthRate: 3.0,
			lifeExpectancyChange: 0.18,
			literacyChange: 0.02,
		}
	),

	CHN: generateYearlyData(
		{
			capital: "Пекин",
			population: 1411750000,
			area: 9596961,
			gdp: 10500,
			lifeExpectancy: 77.1,
			literacy: 96.8,
			facts: [
				"Китай является самой густонаселенной страной в мире с населением более 1,4 миллиарда человек.",
				"Великая Китайская стена – крупнейшее рукотворное сооружение в мире, ее длина составляет около 21 тысячи километров.",
				"В Китае строится больше высотных зданий, чем во всех других странах вместе взятых.",
				"Китайская письменность – старейшая из используемых в мире систем письма.",
			],
		},
		1990,
		2025,
		{
			populationGrowthRate: 0.8,
			gdpGrowthRate: 8.5,
			lifeExpectancyChange: 0.25,
			literacyChange: 0.4,
		}
	),

	DEU: generateYearlyData(
		{
			capital: "Берлин",
			population: 83190556,
			area: 357022,
			gdp: 46208,
			lifeExpectancy: 81.2,
			literacy: 99,
			facts: [
				"Германия является четвертой по величине экономикой в мире.",
				"Немецкий язык является одним из десяти наиболее распространенных языков в мире.",
				"В Германии находится более 300 сортов хлеба и 1500 сортов колбасы.",
				"Германия является родиной многих известных композиторов, включая Баха, Бетховена и Брамса.",
			],
		},
		1990,
		2025,
		{
			populationGrowthRate: 0.3,
			gdpGrowthRate: 3.0,
			lifeExpectancyChange: 0.15,
			literacyChange: 0.02,
		}
	),

	JPN: generateYearlyData(
		{
			capital: "Токио",
			population: 125700000,
			area: 377975,
			gdp: 40193,
			lifeExpectancy: 84.6,
			literacy: 99,
			facts: [
				"Япония состоит из 6852 островов.",
				"Токио – самый населенный мегаполис в мире с населением около 37 миллионов человек.",
				"В Японии самая высокая продолжительность жизни в мире.",
				"Гора Фудзи – самая высокая гора в Японии и популярное место для туристов и паломников.",
			],
		},
		1990,
		2025,
		{
			populationGrowthRate: -0.2, // Отрицательный прирост для отражения демографической ситуации
			gdpGrowthRate: 2.0,
			lifeExpectancyChange: 0.15,
			literacyChange: 0.01,
		}
	),

	GBR: generateYearlyData(
		{
			capital: "Лондон",
			population: 67886011,
			area: 243610,
			gdp: 40284,
			lifeExpectancy: 81.2,
			literacy: 99,
			facts: [
				"Великобритания включает Англию, Шотландию, Уэльс и Северную Ирландию.",
				"Лондонский метрополитен, открытый в 1863 году, является старейшей подземной железной дорогой в мире.",
				"Футбол, как современная игра с правилами, зародился в Англии в 19 веке.",
				"Биг-Бен – это название не башни, а большого колокола внутри нее.",
			],
		},
		1990,
		2025,
		{
			populationGrowthRate: 0.6,
			gdpGrowthRate: 2.5,
			lifeExpectancyChange: 0.12,
			literacyChange: 0.02,
		}
	),

	FRA: generateYearlyData(
		{
			capital: "Париж",
			population: 65273511,
			area: 551695,
			gdp: 39257,
			lifeExpectancy: 82.5,
			literacy: 99,
			facts: [
				"Франция – самая посещаемая страна в мире, ежегодно принимающая около 90 миллионов туристов.",
				"В стране производится более 400 видов сыра.",
				"Эйфелева башня была построена в 1889 году и изначально задумывалась как временное сооружение.",
				"Французская кухня внесена в список нематериального культурного наследия ЮНЕСКО.",
			],
		},
		1990,
		2025,
		{
			populationGrowthRate: 0.5,
			gdpGrowthRate: 2.3,
			lifeExpectancyChange: 0.14,
			literacyChange: 0.04,
		}
	),

	IND: generateYearlyData(
		{
			capital: "Нью-Дели",
			population: 1380004385,
			area: 3287263,
			gdp: 1927,
			lifeExpectancy: 69.7,
			literacy: 74.4,
			facts: [
				"Индия – вторая по численности населения страна в мире после Китая.",
				"В Индии находится Тадж-Махал, одно из семи новых чудес света.",
				"Индия – крупнейшая демократия в мире по численности населения.",
				"Шахматы были изобретены в Индии примерно в 6 веке нашей эры.",
			],
		},
		1990,
		2025,
		{
			populationGrowthRate: 1.8,
			gdpGrowthRate: 6.0,
			lifeExpectancyChange: 0.3,
			literacyChange: 0.6,
		}
	),

	BRA: generateYearlyData(
		{
			capital: "Бразилиа",
			population: 212559417,
			area: 8515767,
			gdp: 6796,
			lifeExpectancy: 75.9,
			literacy: 93.2,
			facts: [
				"Бразилия – пятая по величине страна в мире и крупнейшая в Южной Америке.",
				"Амазонский лес, большая часть которого находится в Бразилии, производит около 20% кислорода на Земле.",
				"Карнавал в Рио-де-Жанейро – крупнейший фестиваль в мире, привлекающий миллионы туристов ежегодно.",
				"Бразилия – единственная южноамериканская страна, где официальным языком является португальский.",
			],
		},
		1990,
		2025,
		{
			populationGrowthRate: 1.5,
			gdpGrowthRate: 3.5,
			lifeExpectancyChange: 0.25,
			literacyChange: 0.4,
		}
	),

	CAN: generateYearlyData(
		{
			capital: "Оттава",
			population: 37742154,
			area: 9984670,
			gdp: 43258,
			lifeExpectancy: 82.3,
			literacy: 99,
			facts: [
				"Канада – вторая по величине страна в мире после России.",
				"В Канаде больше озер, чем во всех других странах вместе взятых.",
				"Канада имеет самую длинную береговую линию в мире – 243,042 км.",
				"Кленовый сироп – важный экспорт Канады, страна производит 71% мирового запаса.",
			],
		},
		1990,
		2025,
		{
			populationGrowthRate: 1.1,
			gdpGrowthRate: 3.2,
			lifeExpectancyChange: 0.14,
			literacyChange: 0.02,
		}
	),

	// Добавляем новые страны
	AUS: generateYearlyData(
		{
			capital: "Канберра",
			population: 25687041,
			area: 7692024,
			gdp: 51885,
			lifeExpectancy: 83.4,
			literacy: 99,
			facts: [
				"Австралия – единственная страна, которая занимает целый континент.",
				"Большой Барьерный риф у побережья Австралии – крупнейшая в мире коралловая система, видимая из космоса.",
				"Австралия – дом для некоторых из самых ядовитых существ в мире, включая пауков, змей и медуз.",
				"Около 85% австралийцев живут не дальше 50 км от побережья.",
			],
		},
		1990,
		2025,
		{
			populationGrowthRate: 1.4,
			gdpGrowthRate: 3.3,
			lifeExpectancyChange: 0.13,
			literacyChange: 0.01,
		}
	),

	MEX: generateYearlyData(
		{
			capital: "Мехико",
			population: 126014024,
			area: 1964375,
			gdp: 8329,
			lifeExpectancy: 75.1,
			literacy: 95.4,
			facts: [
				"Мехико - столица Мексики и самый старый город в Северной Америке.",
				"Мексика является домом для древнейших цивилизаций Америки, включая ацтеков и майя.",
				"Мексиканская кухня была признана ЮНЕСКО нематериальным культурным наследием человечества.",
				"В Мексике насчитывается более 30 объектов Всемирного наследия ЮНЕСКО.",
			],
		},
		1990,
		2025,
		{
			populationGrowthRate: 1.6,
			gdpGrowthRate: 2.8,
			lifeExpectancyChange: 0.22,
			literacyChange: 0.35,
		}
	),

	ZAF: generateYearlyData(
		{
			capital: "Претория",
			population: 59308690,
			area: 1221037,
			gdp: 6001,
			lifeExpectancy: 64.9,
			literacy: 94.3,
			facts: [
				"ЮАР – единственная страна в мире с тремя официальными столицами: Претория (административная), Кейптаун (законодательная) и Блумфонтейн (судебная).",
				"В ЮАР 11 официальных языков, что является одним из самых высоких показателей в мире.",
				"ЮАР – крупнейший производитель платины, хрома и марганца в мире.",
				"Настольная гора в Кейптауне – одна из старейших гор в мире, её возраст около 600 миллионов лет.",
			],
		},
		1990,
		2025,
		{
			populationGrowthRate: 1.7,
			gdpGrowthRate: 2.5,
			lifeExpectancyChange: 0.1,
			literacyChange: 0.4,
		}
	),
};

export default countriesData;
