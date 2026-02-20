const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');
const le = '\r\n'; // CRLF

const oldLines = [
    '        {/* --- STATS SCROLLER (MARQUEE) --- */}',
    '        <section className="mx-auto max-w-7xl overflow-hidden py-4">',
    '          <div className="relative flex w-full flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">',
    '            <div className="flex animate-infinite-scroll-fast gap-6 py-4 w-max shrink-0">',
    '               {[...stats, ...stats, ...stats, ...stats].map((stat, i) => (',
    '                  <div key={`s-${stat.label}-${i}`} className="shrink-0 w-[200px]">',
    '                    <StatCard {...stat} />',
    '                  </div>',
    '               ))}',
    '            </div>',
    '            <div className="flex animate-infinite-scroll-fast gap-6 py-4 w-max shrink-0" aria-hidden="true">',
    '               {[...stats, ...stats, ...stats, ...stats].map((stat, i) => (',
    '                  <div key={`sd-${stat.label}-${i}`} className="shrink-0 w-[200px]">',
    '                    <StatCard {...stat} />',
    '                  </div>',
    '               ))}',
    '            </div>',
    '          </div>',
    '        </section>',
];

const newLines = [
    '        {/* --- STATS SCROLLER (MARQUEE) --- */}',
    '        <section className="mx-auto max-w-7xl overflow-hidden py-4">',
    '          <div className="relative overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">',
    '            <div className="flex animate-infinite-scroll-fast gap-6 py-4 w-max">',
    '               {/* First copy */}',
    '               {stats.map((stat, i) => (',
    '                  <div key={`s1-${stat.label}-${i}`} className="shrink-0 w-[200px]">',
    '                    <StatCard {...stat} />',
    '                  </div>',
    '               ))}',
    '               {/* Second copy for seamless loop */}',
    '               {stats.map((stat, i) => (',
    '                  <div key={`s2-${stat.label}-${i}`} className="shrink-0 w-[200px]" aria-hidden="true">',
    '                    <StatCard {...stat} />',
    '                  </div>',
    '               ))}',
    '            </div>',
    '          </div>',
    '        </section>',
];

const oldStr = oldLines.join(le);
const newStr = newLines.join(le);

if (content.includes(oldStr)) {
    content = content.replace(oldStr, newStr);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('SUCCESS: Stats section replaced!');
} else {
    console.log('ERROR: Could not find old stats section');
    // Try to find partial match
    const firstLine = oldLines[0];
    const idx = content.indexOf(firstLine);
    console.log('First line found at char index:', idx);
    if (idx >= 0) {
        const snippet = content.substring(idx, idx + 200);
        console.log('Snippet:', JSON.stringify(snippet));
    }
}
