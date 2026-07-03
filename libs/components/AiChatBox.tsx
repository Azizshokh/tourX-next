import React, { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useApolloClient, useMutation } from '@apollo/client';
import { Button, IconButton } from '@mui/material';
import Link from 'next/link';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import BackpackRoundedIcon from '@mui/icons-material/BackpackRounded';
import BeachAccessRoundedIcon from '@mui/icons-material/BeachAccessRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import DiamondRoundedIcon from '@mui/icons-material/DiamondRounded';
import FamilyRestroomRoundedIcon from '@mui/icons-material/FamilyRestroomRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import HikingRoundedIcon from '@mui/icons-material/HikingRounded';
import LocationCityRoundedIcon from '@mui/icons-material/LocationCityRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import TerrainRoundedIcon from '@mui/icons-material/TerrainRounded';
import { ASK_TOURX_AI } from '../../apollo/user/mutation';
import { GET_TOUR_PACKAGES } from '../../apollo/user/query';
import { resolveImageUrl } from '../config';
import { TourPackage, TourPackages } from '../types/tour-package/tour-package';

type ChatRole = 'assistant' | 'user';

interface AiRecommendation {
	tourPackage: TourPackage;
	reason: string;
}

interface ChatMessage {
	id: number;
	role: ChatRole;
	content: string;
	isError?: boolean;
	recommendations?: AiRecommendation[];
}

const welcomeMessage: ChatMessage = {
	id: 0,
	role: 'assistant',
	content: 'Tell me what you love, where you want to go, your budget, and who is traveling. I will find your best TourX matches.',
};

const quickSuggestions = [
	{ label: 'Beach', icon: BeachAccessRoundedIcon, prompt: 'Plan a relaxing beach escape with warm weather and beautiful coastlines.' },
	{ label: 'Nature', icon: TerrainRoundedIcon, prompt: 'Find me a nature-focused trip with scenic landscapes and outdoor experiences.' },
	{ label: 'Romantic', icon: FavoriteRoundedIcon, prompt: 'Recommend a romantic getaway for two with memorable experiences.' },
	{ label: 'City Break', icon: LocationCityRoundedIcon, prompt: 'I want a lively city break with culture, food, and iconic attractions.' },
	{ label: 'Adventure', icon: HikingRoundedIcon, prompt: 'Find an active adventure trip with exciting outdoor activities.' },
	{ label: 'Family', icon: FamilyRestroomRoundedIcon, prompt: 'Plan a comfortable family trip with activities for all ages.' },
	{ label: 'Luxury', icon: DiamondRoundedIcon, prompt: 'Show me a premium luxury trip with excellent hotels and service.' },
	{ label: 'Budget', icon: BackpackRoundedIcon, prompt: 'Find a great-value budget trip with the best experiences for the price.' },
];

const recommendationLinePattern = /^\s*\d+\.\s+/;

const extractReason = (line: string): string => {
	const match = line.match(/\.\s+(.+)$/);
	return match?.[1]?.trim() || 'A strong match for the preferences you shared.';
};

const formatPrice = (tourPackage: TourPackage): string => {
	try {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: tourPackage.packageCurrency,
			maximumFractionDigits: 0,
		}).format(tourPackage.packagePrice);
	} catch {
		return `${tourPackage.packagePrice.toLocaleString()} ${tourPackage.packageCurrency}`;
	}
};

const AiChatBox = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [messageInput, setMessageInput] = useState('');
	const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
	const messageIdRef = useRef(1);
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null);
	const apolloClient = useApolloClient();
	const [askTourxAI, { loading }] = useMutation(ASK_TOURX_AI);

	useEffect(() => {
		if (isOpen) bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
	}, [isOpen, loading, messages]);

	const appendMessage = (message: Omit<ChatMessage, 'id'>) => {
		const nextMessage = { ...message, id: messageIdRef.current++ };
		setMessages((current) => [...current, nextMessage]);
	};

	const buildConversation = (nextUserMessage: ChatMessage) => {
		return [...messages.slice(1), nextUserMessage]
			.slice(-10)
			.map(({ role, content }) => `${role === 'user' ? 'Customer' : 'TourX AI'}: ${content}`)
			.join('\n');
	};

	const hydrateRecommendations = async (answer: string): Promise<Pick<ChatMessage, 'content' | 'recommendations'>> => {
		const recommendationLines = answer.split('\n').filter((line) => recommendationLinePattern.test(line));
		if (!recommendationLines.length) return { content: answer };

		try {
			const { data } = await apolloClient.query<{ getTourPackages: TourPackages }>({
				query: GET_TOUR_PACKAGES,
				variables: {
					input: { page: 1, limit: 100, sort: 'createdAt', direction: 'DESC', search: {} },
				},
				fetchPolicy: 'network-only',
			});

			const recommendations = (data?.getTourPackages?.list ?? [])
				.filter((tourPackage) => recommendationLines.some((line) => line.includes(tourPackage.packageTitle)))
				.slice(0, 3)
				.map((tourPackage) => {
					const sourceLine = recommendationLines.find((line) => line.includes(tourPackage.packageTitle)) ?? '';
					return { tourPackage, reason: extractReason(sourceLine) };
				});

			if (recommendations.length) {
				const content = answer
					.split('\n')
					.filter((line) => !recommendationLinePattern.test(line))
					.join('\n')
					.trim();
				return { content: content || 'Here are my best TourX matches for you:', recommendations };
			}
		} catch {
			// Keep the original assistant response when package-card hydration is unavailable.
		}

		return { content: answer };
	};

	const handleSubmit = async (event?: FormEvent) => {
		event?.preventDefault();
		const content = messageInput.trim();
		if (!content || loading) return;

		const userMessage: ChatMessage = {
			id: messageIdRef.current++,
			role: 'user',
			content,
		};
		const conversation = buildConversation(userMessage);
		setMessages((current) => [...current, userMessage]);
		setMessageInput('');
		setIsOpen(true);

		try {
			const { data } = await askTourxAI({ variables: { input: { message: conversation } } });
			const answer = data?.askTourxAI?.trim();
			if (!answer) throw new Error('TourX AI returned an empty answer.');
			const hydratedAnswer = await hydrateRecommendations(answer);
			appendMessage({ role: 'assistant', ...hydratedAnswer });
		} catch (error: any) {
			const errorMessage =
				error?.graphQLErrors?.[0]?.message ||
				error?.networkError?.message ||
				'Sorry, I could not reach the TourX assistant. Please try again.';
			appendMessage({ role: 'assistant', content: errorMessage, isError: true });
		}
	};

	const chooseSuggestion = (prompt: string) => {
		setMessageInput(prompt);
		setIsOpen(true);
		requestAnimationFrame(() => inputRef.current?.focus());
	};

	const clearConversation = () => {
		setMessages([welcomeMessage]);
		setMessageInput('');
		messageIdRef.current = 1;
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			void handleSubmit();
		}
	};

	return (
		<div className={`ai-chat-box${isOpen ? ' is-open' : ''}`}>
			<form className="ai-chat-search" onSubmit={handleSubmit}>
				<textarea
					ref={inputRef}
					value={messageInput}
					onChange={(event) => setMessageInput(event.target.value)}
					onFocus={() => setIsOpen(true)}
					onKeyDown={handleKeyDown}
					placeholder="Describe your dream trip, budget, interests, or traveler count..."
					rows={1}
					maxLength={1000}
					disabled={loading}
					aria-label="Describe your dream trip"
				/>
				<Button
					type="submit"
					disabled={!messageInput.trim() || loading}
					aria-label="Ask TourX AI"
					endIcon={<SendRoundedIcon />}
				>
					<span className="ai-submit-label">Ask AI</span>
				</Button>
			</form>

			<div className="ai-quick-suggestions" aria-label="Trip inspiration">
				{quickSuggestions.map((suggestion) => {
					const SuggestionIcon = suggestion.icon;
					return (
						<Button
							type="button"
							variant="outlined"
							key={suggestion.label}
							startIcon={<SuggestionIcon />}
							onClick={() => chooseSuggestion(suggestion.prompt)}
						>
							{suggestion.label}
						</Button>
					);
				})}
			</div>

			{isOpen && (
				<section className="ai-chat-panel" aria-label="TourX AI travel assistant">
					<header className="ai-chat-header">
						<div className="ai-chat-avatar"><SmartToyRoundedIcon /></div>
						<div className="ai-chat-heading">
							<strong>TourX AI Travel Assistant</strong>
							<span><i /> Recommendations from live TourX packages</span>
						</div>
						<div className="ai-chat-actions">
							<IconButton onClick={clearConversation} aria-label="Clear TourX AI conversation">
								<DeleteOutlineRoundedIcon />
							</IconButton>
							<IconButton onClick={() => setIsOpen(false)} aria-label="Close TourX AI conversation">
								<CloseRoundedIcon />
							</IconButton>
						</div>
					</header>

					<div className="ai-chat-messages" aria-live="polite">
						<div className="ai-chat-intro">
							<AutoAwesomeRoundedIcon />
							<span>Personalized for your travel style</span>
						</div>
						{messages.map((message) => (
							<div
								key={message.id}
								className={`ai-chat-row ${message.role}${message.recommendations?.length ? ' has-recommendations' : ''}`}
							>
								{message.role === 'assistant' ? (
									<>
										<div className="ai-message-avatar"><SmartToyRoundedIcon /></div>
										<div className="ai-assistant-response">
											<p className={message.isError ? 'error' : ''}>{message.content}</p>
											{!!message.recommendations?.length && (
												<div className="ai-recommendation-list">
													{message.recommendations.map(({ tourPackage, reason }) => (
														<article className="ai-recommendation-card" key={tourPackage._id}>
															<img
																src={resolveImageUrl(tourPackage.packageImages?.[0], '/img/banner/TourX%20background.png')}
																alt={tourPackage.packageTitle}
															/>
															<div className="ai-recommendation-content">
																<span>{tourPackage.packageCountry}</span>
																<h3>{tourPackage.packageTitle}</h3>
																<div className="ai-recommendation-meta">
																	<strong>{formatPrice(tourPackage)}</strong>
																	<small>{tourPackage.durationDays} days</small>
																</div>
																<p>{reason}</p>
																<Link href={{ pathname: '/tour-package/detail', query: { id: tourPackage._id } }}>
																	View Package
																</Link>
															</div>
														</article>
													))}
												</div>
											)}
										</div>
									</>
								) : (
									<p>{message.content}</p>
								)}
							</div>
						))}
						{loading && (
							<div className="ai-chat-row assistant">
								<div className="ai-message-avatar"><SmartToyRoundedIcon /></div>
								<div className="ai-chat-typing" aria-label="TourX AI is thinking">
									<span /><span /><span />
								</div>
							</div>
						)}
						<div ref={bottomRef} />
					</div>
				</section>
			)}
		</div>
	);
};

export default AiChatBox;
