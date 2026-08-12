import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { geistRegular, geistBold, geistBlack } from './fonts';

const WIDTH = 1200;
const HEIGHT = 630;

function fontBuffer(base64: string) {
	return Buffer.from(base64, 'base64');
}

type OgEvent = {
	name: string;
	date_time?: string;
	location?: string;
	type?: string;
};

export async function renderEventOgImage(event: OgEvent): Promise<Buffer> {
	const isPast = event.date_time ? new Date(event.date_time) < new Date() : false;
	const dateLabel = event.date_time
		? new Date(event.date_time).toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric'
			})
		: 'Date TBD';

	const badge = (label: string, filled: boolean) => ({
		type: 'div',
		props: {
			style: {
				display: 'flex',
				padding: '10px 24px',
				backgroundColor: filled ? '#facc15' : '#ffffff',
				border: '4px solid #000000',
				borderRadius: '9999px',
				fontSize: '22px',
				fontWeight: filled ? 900 : 800,
				letterSpacing: '2px',
				color: '#000000',
				textTransform: 'uppercase'
			},
			children: label
		}
	});

	const badges = [badge(isPast ? 'Past Event' : 'Upcoming Event', true)];
	if (event.type) badges.push(badge(event.type, false));

	const tree = {
		type: 'div',
		props: {
			style: {
				width: `${WIDTH}px`,
				height: `${HEIGHT}px`,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				backgroundColor: '#eef2f7',
				backgroundImage: 'linear-gradient(135deg, #eef2f7 0%, #e2ebf5 100%)',
				padding: '60px',
				fontFamily: 'Geist Sans'
			},
			children: [
				{ type: 'div', props: { style: { display: 'flex', gap: '16px' }, children: badges } },
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							fontSize: event.name.length > 40 ? '64px' : '80px',
							fontWeight: 900,
							color: '#000000',
							lineHeight: 1.05,
							letterSpacing: '-2px',
							textTransform: 'uppercase'
						},
						children: event.name
					}
				},
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							backgroundColor: '#000000',
							borderRadius: '28px',
							padding: '32px 44px'
						},
						children: [
							{
								type: 'div',
								props: {
									style: { display: 'flex', flexDirection: 'column', gap: '8px' },
									children: [
										{
											type: 'div',
											props: {
												style: { display: 'flex', fontSize: '28px', fontWeight: 800, color: '#ffffff' },
												children: dateLabel
											}
										},
										{
											type: 'div',
											props: {
												style: { display: 'flex', fontSize: '22px', fontWeight: 600, color: '#94a3b8' },
												children: event.location || 'Connecticut'
											}
										}
									]
								}
							},
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										fontSize: '24px',
										fontWeight: 900,
										color: '#facc15',
										letterSpacing: '3px'
									},
									children: 'CT FIRST TECH CHALLENGE'
								}
							}
						]
					}
				}
			]
		}
	};

	const svg = await satori(tree as unknown as Parameters<typeof satori>[0], {
		width: WIDTH,
		height: HEIGHT,
		fonts: [
			{ name: 'Geist Sans', data: fontBuffer(geistRegular), weight: 400, style: 'normal' },
			{ name: 'Geist Sans', data: fontBuffer(geistBold), weight: 700, style: 'normal' },
			{ name: 'Geist Sans', data: fontBuffer(geistBlack), weight: 900, style: 'normal' }
		]
	});

	const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } });
	return resvg.render().asPng();
}
