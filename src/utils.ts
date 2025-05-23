export async function verifyA(domain: string): Promise<boolean> {
    const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=A`, {
        headers: {
            'Accept': 'application/dns-json'
        }
    });

    if (!response.ok) return false;

    const data = await response.json();
    const ips = data.Answer?.map((a: any) => a.data) || [];

    return ips.includes('152.53.90.161');
}