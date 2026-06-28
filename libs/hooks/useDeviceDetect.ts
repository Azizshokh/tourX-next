import { useEffect, useState } from 'react';

const useDeviceDetect = (): string => {
	const [device, setDevice] = useState('desktop');

	useEffect(() => {
		const mediaQuery = window.matchMedia('(max-width: 767px)');
		const updateDevice = () => setDevice(mediaQuery.matches ? 'mobile' : 'desktop');

		updateDevice();
		if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', updateDevice);
		else mediaQuery.addListener(updateDevice);

		return () => {
			if (mediaQuery.removeEventListener) mediaQuery.removeEventListener('change', updateDevice);
			else mediaQuery.removeListener(updateDevice);
		};
	}, []);

	return device;
};

export default useDeviceDetect;
