export function findElementSiblingSameType(elem: HTMLElement, next: boolean): HTMLElement | null {
    let currElem: HTMLElement | null = elem;
    do {
        // TODO: Need to check if element is an HTMLElement (e.g. an SVGElement)
        currElem = (next ? currElem.nextElementSibling : currElem.previousElementSibling) as HTMLElement | null;
    }
    while (currElem && currElem.nodeName != elem.nodeName);
    return currElem;
}

export function findElementSibling(elem: HTMLElement, next: boolean, filter: (e: HTMLElement) => boolean): HTMLElement | null {
    let currElem: HTMLElement | null = elem;
    do {
        // TODO: Need to check if element is an HTMLElement (e.g. an SVGElement)
        currElem = (next ? currElem.nextElementSibling : currElem.previousElementSibling) as HTMLElement | null;
    }
    while (currElem && !filter(currElem));
    return currElem;
}