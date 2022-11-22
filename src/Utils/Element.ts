export function findElementSibling(elem: HTMLElement, next: boolean, filter: (e: HTMLElement) => boolean, isPagedList: boolean = false): HTMLElement | null {
    let currElem: HTMLElement | null = elem;

    do {
        // TODO: Need to check if element is an HTMLElement (e.g. an SVGElement)
        let newElem = (next ? currElem.nextElementSibling : currElem.previousElementSibling) as HTMLElement | null;

        if (!newElem && isPagedList) {
            let pageElem = currElem.parentElement!, currPageElem: HTMLElement | null = pageElem;

            // Locate the next/previous page
            do {
                currPageElem = (next ? currPageElem.nextElementSibling : currPageElem.previousElementSibling) as HTMLElement | null;
            }
            while (currPageElem && (currPageElem.nodeName != pageElem.nodeName || !currPageElem.firstElementChild));

            if (currPageElem)
                newElem = (next ? currPageElem.firstElementChild : currPageElem.lastElementChild) as HTMLElement | null;
        }

        currElem = newElem;
    }
    while (currElem && !filter(currElem));

    return currElem;
}