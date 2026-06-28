import { useEffect, useState } from 'react';

const useDeviceDetect = (): string => {
	const [device, setDevice] = useState('desktop');

	useEffect(() => {
		const userAgent = navigator.userAgent;
		const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
		const mediaQuery = window.matchMedia('(max-width: 900px)');
		const updateDevice = () => setDevice(isMobileUserAgent || mediaQuery.matches ? 'mobile' : 'desktop');

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
