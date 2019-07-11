/**
 * Check if the client is a robot
 *
 * @return {bool}
 */
export default function isRobot() {
	const isBrowser = typeof window !== 'undefined';

	return (
		(isBrowser && !('onscroll' in window)) ||
		(typeof navigator !== 'undefined' && /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent))
	);
}
