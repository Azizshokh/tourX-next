export const REACT_APP_API_URL = `${process.env.REACT_APP_API_URL}`;

export const availablePackageOptions = ['flightIncluded', 'hotelIncluded', 'guideIncluded'];
export const packageCurrencies = ['USD', 'KRW', 'UZS', 'EUR'];
export const packageCountries = [
	'Japan',
	'South Korea',
	'France',
	'Italy',
	'Switzerland',
	'UAE (Dubai)',
	'Thailand',
	'Indonesia (Bali)',
	'Maldives',
	'USA',
	'United Kingdom',
	'Spain',
	'Turkey',
	'Iceland',
	'Greece',
];
export const packageCities = ['Seoul', 'Busan', 'Jeju', 'Tokyo', 'Tashkent', 'Bangkok', 'Istanbul', 'New York'];
export const packageDurations = [1, 2, 3, 4, 5, 7, 10, 14, 21, 30];

export const Messages = {
	error1: 'Something went wrong!',
	error2: 'Please login first!',
	error3: 'Please fulfill all inputs!',
	error4: 'Message is empty!',
	error5: 'Only images with jpeg, jpg, png format allowed!',
};

export const topPackageRank = 3;
