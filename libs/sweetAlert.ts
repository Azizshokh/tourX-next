import Swal from 'sweetalert2';
import 'animate.css';
import { Messages } from './config';

// ── TourX base mixin ─────────────────────────────────────────────────────────

const tourxSwal = Swal.mixin({
	background: '#ffffff',
	color: '#0d1c32',
	confirmButtonColor: '#ff8a00',
	cancelButtonColor: '#f1f5f9',
	customClass: {
		popup: 'tourx-swal',
		title: 'tourx-swal-title',
		htmlContainer: 'tourx-swal-body',
		confirmButton: 'tourx-swal-confirm',
		cancelButton: 'tourx-swal-cancel',
	},
});

const tourxToast = Swal.mixin({
	toast: true,
	position: 'top-end',
	showConfirmButton: false,
	timerProgressBar: true,
	customClass: {
		popup: 'tourx-toast',
	},
});

// ── Exports ──────────────────────────────────────────────────────────────────

export const sweetErrorHandling = async (err: any) => {
	await tourxSwal.fire({
		icon: 'error',
		title: 'Something went wrong',
		text: err.message,
		showConfirmButton: true,
		confirmButtonText: 'OK',
	});
};

export const sweetTopSuccessAlert = async (msg: string, duration: number = 2000) => {
	await tourxSwal.fire({
		icon: 'success',
		title: msg.replace('Definer: ', ''),
		showConfirmButton: false,
		timer: duration,
	});
};

export const sweetContactAlert = async (msg: string, duration: number = 10000) => {
	await tourxSwal.fire({
		title: msg,
		showClass: { popup: 'animate__bounceIn' },
		showConfirmButton: false,
		timer: duration,
	});
};

export const sweetConfirmAlert = (msg: string): Promise<boolean> => {
	return new Promise(async (resolve) => {
		const response = await tourxSwal.fire({
			icon: 'question',
			text: msg,
			showClass: { popup: 'animate__bounceIn' },
			showCancelButton: true,
			showConfirmButton: true,
			confirmButtonText: 'Confirm',
			cancelButtonText: 'Cancel',
		});
		resolve(response?.isConfirmed ?? false);
	});
};

export const sweetLoginConfirmAlert = (msg: string): Promise<boolean> => {
	return new Promise(async (resolve) => {
		const response = await tourxSwal.fire({
			icon: 'question',
			text: msg,
			showCancelButton: true,
			showConfirmButton: true,
			confirmButtonText: 'Login',
			cancelButtonText: 'Cancel',
		});
		resolve(response?.isConfirmed ?? false);
	});
};

export const sweetErrorAlert = async (msg: string, duration: number = 3000) => {
	await tourxSwal.fire({
		icon: 'error',
		title: msg,
		showConfirmButton: false,
		timer: duration,
	});
};

export const sweetMixinErrorAlert = async (msg: string, duration: number = 3000) => {
	await tourxSwal.fire({
		icon: 'error',
		title: msg,
		showConfirmButton: false,
		timer: duration,
	});
};

export const sweetMixinSuccessAlert = async (msg: string, duration: number = 2000) => {
	await tourxSwal.fire({
		icon: 'success',
		title: msg,
		showConfirmButton: false,
		timer: duration,
	});
};

export const sweetBasicAlert = async (text: string) => {
	await tourxSwal.fire({ text });
};

export const sweetWarningAlert = async (title: string, text: string, confirmButtonText: string = 'OK') => {
	await tourxSwal.fire({
		icon: 'warning',
		title,
		text,
		showConfirmButton: true,
		confirmButtonText,
		confirmButtonColor: '#ff8a00',
	});
};

export const sweetErrorHandlingForAdmin = async (err: any) => {
	const errorMessage = err.message ?? Messages.error1;
	await tourxSwal.fire({
		icon: 'error',
		title: 'Error',
		text: errorMessage,
		showConfirmButton: true,
		confirmButtonText: 'OK',
	});
};

export const sweetTopSmallSuccessAlert = async (
	msg: string,
	duration: number = 2000,
	enable_forward: boolean = false,
) => {
	await tourxToast.fire({
		icon: 'success',
		title: msg,
		timer: duration,
	});

	if (enable_forward) window.location.reload();
};
