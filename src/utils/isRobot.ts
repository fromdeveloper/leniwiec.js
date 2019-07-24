/**
 * Check if the user is a robot
 *
 * @return {boolean}
 */
export default function isRobot(): boolean {
	const isBrowser: boolean = typeof window !== 'undefined';

	return (
		(isBrowser && !('onscroll' in window)) ||
		(typeof navigator !== 'undefined' && /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent))
	);
}
