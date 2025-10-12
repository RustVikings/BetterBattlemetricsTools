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
