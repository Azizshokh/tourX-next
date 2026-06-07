import React, { useEffect, useRef, useState } from 'react';
import { Button, IconButton, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { getJwtToken } from '../../auth';
import { REACT_APP_API_URL } from '../../config';

const allowedImageExtensions = ['jpg', 'jpeg', 'png', 'webp'];
const allowedImageMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];
const allowedVideoExtensions = ['mp4', 'webm', 'mov'];
const allowedVideoMimeTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
const videoUploadUnavailableMessage =
	'Video upload is not available yet because the current backend upload endpoint does not accept video files.';

export interface CommentMediaState {
	images: File[];
	imagePreviews: string[];
	video: File | null;
	videoPreview: string;
	error: string;
	imageInputRef: React.RefObject<HTMLInputElement>;
	videoInputRef: React.RefObject<HTMLInputElement>;
	handleImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
	handleVideoSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
	removeImage: (index: number) => void;
	removeVideo: () => void;
	clearMedia: () => void;
	setError: (message: string) => void;
	hasMedia: boolean;
	hasVideo: boolean;
	hasImages: boolean;
}

export const COMMENT_VIDEO_UPLOAD_UNAVAILABLE = videoUploadUnavailableMessage;

const getFileExtension = (fileName: string) => fileName.split('.').pop()?.toLowerCase() ?? '';

const hasValidFileType = (file: File, allowedExtensions: string[], allowedMimeTypes: string[]) => {
	const extension = getFileExtension(file.name);
	return allowedExtensions.includes(extension) && (file.type === '' || allowedMimeTypes.includes(file.type));
};

const resetInput = (input: HTMLInputElement | null) => {
	if (input) input.value = '';
};

export const useCommentMedia = (): CommentMediaState => {
	const imageInputRef = useRef<HTMLInputElement>(null);
	const videoInputRef = useRef<HTMLInputElement>(null);
	const imagePreviewsRef = useRef<string[]>([]);
	const videoPreviewRef = useRef<string>('');
	const [images, setImages] = useState<File[]>([]);
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);
	const [video, setVideo] = useState<File | null>(null);
	const [videoPreview, setVideoPreview] = useState<string>('');
	const [error, setError] = useState<string>('');

	useEffect(() => {
		imagePreviewsRef.current = imagePreviews;
	}, [imagePreviews]);

	useEffect(() => {
		videoPreviewRef.current = videoPreview;
	}, [videoPreview]);

	useEffect(() => {
		return () => {
			imagePreviewsRef.current.forEach((preview) => URL.revokeObjectURL(preview));
			if (videoPreviewRef.current) URL.revokeObjectURL(videoPreviewRef.current);
		};
	}, []);

	const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(event.target.files ?? []);
		setError('');

		if (selectedFiles.length === 0) return;
		if (video) {
			setError('Remove the selected video before adding images.');
			resetInput(event.target);
			return;
		}
		if (images.length + selectedFiles.length > 4) {
			setError('You can attach up to 4 images.');
			resetInput(event.target);
			return;
		}
		if (selectedFiles.some((file) => !hasValidFileType(file, allowedImageExtensions, allowedImageMimeTypes))) {
			setError('Images must be jpg, jpeg, png, or webp files.');
			resetInput(event.target);
			return;
		}

		setImages((prev) => [...prev, ...selectedFiles]);
		setImagePreviews((prev) => [...prev, ...selectedFiles.map((file) => URL.createObjectURL(file))]);
		resetInput(event.target);
	};

	const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(event.target.files ?? []);
		setError('');

		if (selectedFiles.length === 0) return;
		if (images.length > 0) {
			setError('Remove selected images before adding a video.');
			resetInput(event.target);
			return;
		}
		if (selectedFiles.length > 1 || video) {
			setError('You can attach only 1 video.');
			resetInput(event.target);
			return;
		}

		const selectedVideo = selectedFiles[0];
		if (!hasValidFileType(selectedVideo, allowedVideoExtensions, allowedVideoMimeTypes)) {
			setError('Videos must be mp4, webm, or mov files.');
			resetInput(event.target);
			return;
		}

		setVideo(selectedVideo);
		setVideoPreview(URL.createObjectURL(selectedVideo));
		resetInput(event.target);
	};

	const removeImage = (index: number) => {
		setError('');
		URL.revokeObjectURL(imagePreviews[index]);
		setImages((prev) => prev.filter((_, imageIndex) => imageIndex !== index));
		setImagePreviews((prev) => prev.filter((_, imageIndex) => imageIndex !== index));
		resetInput(imageInputRef.current);
	};

	const removeVideo = () => {
		setError('');
		if (videoPreview) URL.revokeObjectURL(videoPreview);
		setVideo(null);
		setVideoPreview('');
		resetInput(videoInputRef.current);
	};

	const clearMedia = () => {
		imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
		if (videoPreview) URL.revokeObjectURL(videoPreview);
		setImages([]);
		setImagePreviews([]);
		setVideo(null);
		setVideoPreview('');
		setError('');
		resetInput(imageInputRef.current);
		resetInput(videoInputRef.current);
	};

	return {
		images,
		imagePreviews,
		video,
		videoPreview,
		error,
		imageInputRef,
		videoInputRef,
		handleImageSelect,
		handleVideoSelect,
		removeImage,
		removeVideo,
		clearMedia,
		setError,
		hasMedia: images.length > 0 || !!video,
		hasVideo: !!video,
		hasImages: images.length > 0,
	};
};

export const uploadCommentImages = async (files: File[]): Promise<string[]> => {
	if (files.length === 0) return [];

	const token = getJwtToken();
	const formData = new FormData();
	const map: Record<string, string[]> = {};

	formData.append(
		'operations',
		JSON.stringify({
			query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) {
				imagesUploader(files: $files, target: $target)
			}`,
			variables: {
				files: files.map(() => null),
				target: 'comment',
			},
		}),
	);

	files.forEach((file, index) => {
		map[String(index)] = [`variables.files.${index}`];
	});

	formData.append('map', JSON.stringify(map));

	files.forEach((file, index) => {
		formData.append(String(index), file);
	});

	const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
			'apollo-require-preflight': true,
			Authorization: `Bearer ${token}`,
		},
	});

	if (response.data?.errors?.length) throw new Error(response.data.errors[0]?.message ?? 'Image upload failed.');
	return response.data?.data?.imagesUploader ?? [];
};

export const CommentMediaPicker = ({ media }: { media: CommentMediaState }) => {
	return (
		<Stack gap={'10px'} sx={{ mt: '12px', mb: '12px' }}>
			<Stack direction={'row'} gap={'10px'} alignItems={'center'} flexWrap={'wrap'}>
				<Button variant="outlined" size="small" disabled={media.hasVideo} onClick={() => media.imageInputRef.current?.click()}>
					Add images
				</Button>
				<Button variant="outlined" size="small" disabled={media.hasImages} onClick={() => media.videoInputRef.current?.click()}>
					Add video
				</Button>
				<Typography variant="caption" color="text.secondary">
					Up to 4 images or 1 video
				</Typography>
			</Stack>

			<input
				ref={media.imageInputRef}
				type="file"
				hidden
				multiple
				accept=".jpg,.jpeg,.png,.webp,image/jpg,image/jpeg,image/png,image/webp"
				onChange={media.handleImageSelect}
				disabled={media.hasVideo}
			/>
			<input
				ref={media.videoInputRef}
				type="file"
				hidden
				accept=".mp4,.webm,.mov,video/mp4,video/webm,video/quicktime"
				onChange={media.handleVideoSelect}
				disabled={media.hasImages}
			/>

			{media.error && (
				<Typography variant="caption" color="error">
					{media.error}
				</Typography>
			)}

			{media.imagePreviews.length > 0 && (
				<Stack direction={'row'} gap={'8px'} flexWrap={'wrap'}>
					{media.imagePreviews.map((preview, index) => (
						<Stack key={preview} sx={{ position: 'relative', width: 86, height: 86 }}>
							<img
								src={preview}
								alt={`selected image ${index + 1}`}
								style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }}
							/>
							<IconButton
								size="small"
								onClick={() => media.removeImage(index)}
								sx={{
									position: 'absolute',
									top: 2,
									right: 2,
									width: 22,
									height: 22,
									background: 'rgba(0,0,0,0.55)',
									color: '#fff',
									':hover': { background: 'rgba(0,0,0,0.75)' },
								}}
							>
								×
							</IconButton>
						</Stack>
					))}
				</Stack>
			)}

			{media.videoPreview && (
				<Stack sx={{ position: 'relative', width: '100%', maxWidth: 360 }}>
					<video src={media.videoPreview} controls style={{ width: '100%', borderRadius: 6 }} />
					<IconButton
						size="small"
						onClick={media.removeVideo}
						sx={{
							position: 'absolute',
							top: 4,
							right: 4,
							width: 24,
							height: 24,
							background: 'rgba(0,0,0,0.55)',
							color: '#fff',
							':hover': { background: 'rgba(0,0,0,0.75)' },
						}}
					>
						×
					</IconButton>
				</Stack>
			)}
		</Stack>
	);
};

const resolveMediaUrl = (url: string) => {
	if (/^(https?:)?\/\//.test(url) || url.startsWith('blob:')) return url;
	return `${REACT_APP_API_URL}/${url}`;
};

export const CommentMediaDisplay = ({ images, video }: { images?: string[]; video?: string | null }) => {
	const visibleImages = images?.filter(Boolean) ?? [];
	const visibleVideo = video?.trim();

	if (visibleImages.length === 0 && !visibleVideo) return null;

	return (
		<Stack gap={'8px'} sx={{ mt: '10px' }}>
			{visibleImages.length > 0 && (
				<Stack direction={'row'} gap={'8px'} flexWrap={'wrap'}>
					{visibleImages.map((image) => (
						<img
							src={resolveMediaUrl(image)}
							alt="comment attachment"
							key={image}
							style={{ width: 94, height: 94, objectFit: 'cover', borderRadius: 6 }}
						/>
					))}
				</Stack>
			)}
			{visibleVideo && (
				<video src={resolveMediaUrl(visibleVideo)} controls style={{ width: '100%', maxWidth: 420, borderRadius: 6 }} />
			)}
		</Stack>
	);
};
