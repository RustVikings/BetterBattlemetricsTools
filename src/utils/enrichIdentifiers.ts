import { BattlemetricsPlayerIPs } from "@src/types";

/**
 * Shared ISP/ASN enrichment for BattleMetrics identifier tables.
 *
 * The identifier tables appear both inline on the player overview page and on
 * the dedicated `/identifiers` tab. BattleMetrics is a SPA, so tables mount,
 * swap and paginate without full reloads. A single, module-level MutationObserver
 * on <body> re-runs enrichment on any DOM change, which keeps working across tab
 * navigation regardless of whether our React panel is mounted.
 *
 * Enrichment can draw from multiple IP sources (e.g. the panel's React state and
 * a standalone fetch used when the panel never mounts). Sources register an
 * accessor; the enricher tries each on every pass so it always reads fresh data.
 */

type IpSource = () => BattlemetricsPlayerIPs[];

const IP_REGEX = /(\d{1,3}\.){3}\d{1,3}/;
const ENRICHED_ATTR = "data-brt-isp";
const IDENTIFIER_CELLS = "td[data-title=Identifier] + td[data-title=Type]";

const ipSources: IpSource[] = [];
let observer: MutationObserver | undefined;
let timer: ReturnType<typeof setTimeout> | undefined;

/**
 * Locate the element holding the IP text within an identifier cell: the deepest
 * (leaf) element whose text contains the IP, so we overwrite the tightest
 * wrapper and avoid clobbering sibling controls. Resilient to BattleMetrics'
 * hashed/rotating emotion class names.
 */
function findIpValueElement(cell: HTMLElement, ip: string): Element | null {
    const candidates = Array.from(cell.querySelectorAll("*")).filter(
        (node) =>
            node.childElementCount === 0 && node.textContent?.includes(ip),
    );
    return candidates[candidates.length - 1] ?? null;
}

/** Look up an IP across all registered sources. */
function findIp(ip: string): BattlemetricsPlayerIPs | undefined {
    for (const source of ipSources) {
        const match = source().find((entry) => entry.ip === ip);
        if (match) return match;
    }
    return undefined;
}

/** Enrich a single "Type" identifier cell. Idempotent (marks enriched cells). */
function enrichRow(typeCell: Element) {
    if (!typeCell.textContent?.includes("IP")) return;

    const el = typeCell.previousElementSibling as HTMLElement | null;
    if (!el) return;

    const matchedIP = el.textContent?.match(IP_REGEX)?.[0];
    if (!matchedIP) return;

    const ipEl = findIpValueElement(el, matchedIP);
    if (!ipEl || ipEl.getAttribute(ENRICHED_ATTR) === "1") return;

    const ip = findIp(matchedIP);
    if (!ip) return;

    const { isp, asn } = ip.metadata.connectionInfo;
    ipEl.innerHTML = `${ip.ip}<br/><span class="small">ISP: <a href="https://www.google.com/search?q=${isp}" title="Search: ${isp} " target="_blank" rel="noopener noreferrer">${isp}</a>  | ASN: <a href="https://ipinfo.io/${asn}" title="Search: ${asn}" target="_blank" rel="noopener noreferrer">${asn}</a></span>`;
    ipEl.setAttribute(ENRICHED_ATTR, "1");
}

/** Enrich every identifier row currently in the document. */
function enrichAll() {
    document.querySelectorAll(IDENTIFIER_CELLS).forEach(enrichRow);
}

function scheduleEnrich() {
    if (timer) return;
    timer = setTimeout(() => {
        timer = undefined;
        enrichAll();
    }, 200);
}

function ensureObserver() {
    if (observer) return;
    observer = new MutationObserver(scheduleEnrich);
    observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * Register a source of known IPs and start enriching identifier tables.
 *
 * @param getIps - Accessor for the current known IP set, re-read on every pass.
 * @returns An unregister function that removes the source and, once no sources
 *   remain, disconnects the observer.
 */
export function registerIdentifierEnrichment(getIps: IpSource): () => void {
    ipSources.push(getIps);
    ensureObserver();
    enrichAll();

    return () => {
        const index = ipSources.indexOf(getIps);
        if (index !== -1) ipSources.splice(index, 1);
        if (ipSources.length === 0) {
            observer?.disconnect();
            observer = undefined;
            if (timer) {
                clearTimeout(timer);
                timer = undefined;
            }
        }
    };
}

/** Re-run enrichment immediately (e.g. after an IP source's data changes). */
export function refreshIdentifierEnrichment(): void {
    enrichAll();
}

/** Whether any IP source is currently registered. */
export function hasIdentifierSources(): boolean {
    return ipSources.length > 0;
}
