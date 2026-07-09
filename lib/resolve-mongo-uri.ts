import dns from "dns";

// Node's `mongodb` driver resolves the `_mongodb._tcp` SRV record for
// `mongodb+srv://` URIs using its own internal `require("dns")` lookup. On some
// networks the OS's default resolver can't be reached by the driver (a link-local
// IPv6 DNS server it doesn't like); on others the opposite is true and public DNS
// (8.8.8.8/1.1.1.1) is the one that's blocked/times out while the OS default works
// fine. Rather than assuming which, try the default resolver first and only fall
// back to a scoped public-DNS resolver if that fails - and never mutate the global
// `dns` module, since `dns.setServers()` would silently break every other outbound
// lookup in the process (AI provider API calls, etc.) if public DNS is the one
// that's unreachable.
const LOOKUP_TIMEOUT_MS = 4000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("DNS lookup timed out")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

async function resolveSrvResilient(hostname: string) {
  try {
    return await withTimeout(dns.promises.resolveSrv(hostname), LOOKUP_TIMEOUT_MS);
  } catch {
    const resolver = new dns.promises.Resolver();
    resolver.setServers(["8.8.8.8", "1.1.1.1"]);
    return await withTimeout(resolver.resolveSrv(hostname), LOOKUP_TIMEOUT_MS);
  }
}

async function resolveTxtResilient(hostname: string) {
  try {
    return await withTimeout(dns.promises.resolveTxt(hostname), LOOKUP_TIMEOUT_MS);
  } catch {
    const resolver = new dns.promises.Resolver();
    resolver.setServers(["8.8.8.8", "1.1.1.1"]);
    return await withTimeout(resolver.resolveTxt(hostname), LOOKUP_TIMEOUT_MS);
  }
}

export async function resolveMongoUri(srvUri: string): Promise<string> {
  if (!srvUri.startsWith("mongodb+srv://")) return srvUri;

  const withoutScheme = srvUri.slice("mongodb+srv://".length);
  const atIndex = withoutScheme.lastIndexOf("@");
  const creds = withoutScheme.slice(0, atIndex);
  const rest = withoutScheme.slice(atIndex + 1);
  const slashIndex = rest.indexOf("/");
  const host = slashIndex === -1 ? rest : rest.slice(0, slashIndex);
  const afterSlash = slashIndex === -1 ? "" : rest.slice(slashIndex + 1);
  const [dbPart, queryPart] = afterSlash.split("?");

  const srvRecords = await resolveSrvResilient(`_mongodb._tcp.${host}`);
  const hosts = srvRecords.map((r) => `${r.name}:${r.port}`).join(",");

  const params = new URLSearchParams(queryPart || "");
  try {
    const txtRecords = await resolveTxtResilient(host);
    const txtParams = new URLSearchParams(txtRecords.map((r) => r.join("")).join("&"));
    for (const [k, v] of txtParams.entries()) {
      if (!params.has(k)) params.set(k, v);
    }
  } catch {
    // Some clusters have no TXT record - not fatal.
  }
  if (!params.has("tls") && !params.has("ssl")) params.set("tls", "true");

  const queryString = params.toString();
  return `mongodb://${creds}@${hosts}/${dbPart ?? ""}${queryString ? `?${queryString}` : ""}`;
}
