import fs from 'node:fs/promises';
const base = new URL(process.argv[2] || 'http://localhost:3000');
if (!['localhost','127.0.0.1','[::1]'].includes(base.hostname)) throw new Error('Use a local verification server.');
const decode = value => value.replace(/&(amp|apos|quot|lt|gt);/g, (_, key) => ({amp:'&',apos:"'",quot:'"',lt:'<',gt:'>'})[key]);
const stripScripts = html => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
const report = { checkedAt: new Date().toISOString(), base: base.origin, shopExcluded: true, submissionsPerformed: false, sitemap: [], links: [], legacy: [], practices: {}, forms: [], issues: [] };
const scope = ['/', '/en', '/corporate', '/en/corporate', '/contact-us?type=booking', '/en/contact-us?type=booking', '/clinique/wenaya-casablanca', '/en/clinic/wenaya-casablanca', '/soins-a-domicile', '/pratiques/neuropsychologie', '/en/pratiques/neuropsychologie', '/professional/amine-bennani', '/en/professional/amine-bennani'];
const snapshots = new Map();
async function read(path) {
 const response = await fetch(new URL(path, base), { redirect: 'manual', signal: AbortSignal.timeout(30000) });
 const html = await response.text();
 return { response, html, body: stripScripts(html) };
}
const sitemap = await read('/sitemap.xml');
if (sitemap.response.status !== 200) throw new Error('Sitemap HTTP ' + sitemap.response.status);
const urls = [...sitemap.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(decode(m[1])));
const paths = [...new Set(urls.map(u => u.pathname + u.search))].filter(p => !/^\/(?:en\/)?produits(?:\/|$)/.test(p));
let index = 0;
async function worker() {
 while (index < paths.length) {
  const path = paths[index++];
  try {
   const {response,html,body} = await read(path);
   const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
   const row = {path,status:response.status,h1:(body.match(/<h1\b/g)||[]).length,canonical,noindex:/name="robots" content="[^"]*noindex/.test(html)};
   report.sitemap.push(row);
   if (scope.includes(path)) snapshots.set(path,{html,body});
   if (row.status!==200||row.h1!==1||!canonical||row.noindex||/dev-website|localhost/.test(canonical)) report.issues.push({check:'sitemap',...row});
  } catch(error) {report.issues.push({check:'sitemap',path,error:error.message});}
  if (report.sitemap.length%40===0) console.log('Crawled '+report.sitemap.length+'/'+paths.length);
 }
}
await Promise.all([worker(),worker(),worker()]);
for (const path of scope) if (!snapshots.has(path)) {const {html,body}=await read(path);snapshots.set(path,{html,body});}
const targets = new Set();
for (const [path,{html,body}] of snapshots) {
 for(const m of body.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
  const href = decode(m[1]);
  if (!href||/^(tel:|mailto:|javascript:)/.test(href)) continue;
  const url=new URL(href,new URL(path,base));
  if(url.origin!==base.origin||/^\/(?:en\/)?(?:produits|compte|login|signup)(?:\/|$)/.test(url.pathname))continue;
  if(url.hash&&url.pathname===new URL(path,base).pathname&&url.search===new URL(path,base).search){
   const id=decodeURIComponent(url.hash.slice(1));
   if(id&&!body.includes('id="'+id+'"')) report.issues.push({check:'anchor',path,href});
  } else targets.add(url.pathname+url.search);
 }
 const expected = path.startsWith('/en')?'Monday–Saturday, 9:00–19:00':'Du lundi au samedi, 09h00–19h00';
 if(!path.includes('/professional/')&&!body.includes(expected))report.issues.push({check:'opening-hours-copy',path});
 const walk=value=>{if(!value||typeof value!=='object')return;if(value.openingHoursSpecification)for(const h of value.openingHoursSpecification)if(h.opens!=='09:00'||h.closes!=='19:00'||h.dayOfWeek?.length!==6)report.issues.push({check:'opening-hours-schema',path});Object.values(value).forEach(walk);};
 for(const match of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g))walk(JSON.parse(match[1]));
}
async function hops(path) {
 const chain=[];
 for(let n=0;n<4;n++) {const {response}=await read(path);const location=response.headers.get('location');chain.push({path,status:response.status,location});if(!location||response.status<300||response.status>=400)break;const u=new URL(location,base);if(u.origin!==base.origin)break;path=u.pathname+u.search;}
 return chain;
}
for(const target of targets){const chain=await hops(target);report.links.push({target,chain});if(chain.at(-1)?.status!==200)report.issues.push({check:'link',target,chain});}
const inventory=JSON.parse(await fs.readFile('docs/audit/2026-11-12-live-sitemap-inventory.json','utf8'));
const oldUrls=[...new Set(inventory.sitemaps.flatMap(s=>s.urls))];
for(const oldUrl of oldUrls){const u=new URL(decode(oldUrl));const chain=await hops(u.pathname+u.search);report.legacy.push({oldUrl,chain});if(chain.length>2||chain.at(-1)?.status!==200||chain.slice(0,-1).some(h=>h.status!==301))report.issues.push({check:'legacy',oldUrl,chain});}
const practiceLinks = new Set();
for(let page=1;page<=50;page++){
 const {response,body}=await read('/pratiques'+(page>1?'?page='+page:''));
 if(response.status!==200){report.issues.push({check:'practice-page',page,status:response.status});break;}
 for(const m of body.matchAll(/<a\b[^>]*href="(\/pratiques\/[^"?#]+)"/g))practiceLinks.add(m[1]);
 const hasNext=new RegExp('<a[^>]*href="/pratiques\\?page='+(page+1)+'"').test(body);
 if(!hasNext)break;
}
const frSitemapPractices=paths.filter(p=>p.startsWith('/pratiques/'));
report.practices={listingLinks:practiceLinks.size,sitemapFrenchLinks:frSitemapPractices.length,allDiscoverable:frSitemapPractices.every(p=>practiceLinks.has(p))};
if(!report.practices.allDiscoverable)report.issues.push({check:'practice-discovery',...report.practices});
for(const path of ['/api/contact','/api/professionals/waiting-list']){const response=await fetch(new URL(path,base),{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});const body=await response.json();report.forms.push({path,status:response.status,success:body.success});if(response.status!==400||body.success!==false)report.issues.push({check:'invalid-form',path,status:response.status});}
await fs.writeFile('docs/audit/2026-11-13-final-verification.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({pages:report.sitemap.length,links:report.links.length,legacy:report.legacy.length,practices:report.practices,issues:report.issues}));
if(report.issues.length)process.exitCode=1;
