/**
 * Wait for an element to be present in the DOM.
 * @param selector - The CSS selector of the element to wait for.
 * @param callback - The function to call when the element is found.
 *
 * Retries every 100 milliseconds until the element is found, then calls the callback with the element.
 */
export default function waitForElement(
    selector: string,
    callback: (element: Element) => void,
): void {
    const interval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(interval);
            callback(element);
        }
    }, 100);
}
