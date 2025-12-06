const fs = require('fs');
const path = require('path');

// 你要生成的機場 IATA 名單
const wanted = new Set([
"ADJ","ADL","AKJ","AKL","AMS","AOJ","AVV","AXT","AYQ","BKK","BNK","BNE","BQB","CBR","CEB","CKG","CNX","CNS","CRK","CTS","DAD","DFW","DRW","DPS","FCO","FKS","FRA","FUK","FSZ","GMP","HBA","HKT","HKD","HKG","HND","HNA","HGH","HIJ","HLZ","HVB","IAH","ICN","JFK","KCZ","KHH","KIJ","KLI","KMI","KMJ","KMQ","KIX","KTI","KOJ","KUL","LAX","LST","LHR","MCY","MEL","MKY","MFM","MNL","MUC","MXP","MYJ","NAN","NRT","NTL","OIT","OKA","OKJ","ONT","OOL","PEN","PER","PHX","PRG","PQC","PVG","PPP","PUS","RAR","RGN","SDJ","SFO","SHA","SGN","SZX","SEA","SIN","SYD","TAK","TFU","TOY","TNN","TPE","TSV","TSA","UKB","VIE","XMN","YGJ","YVR","YYZ","ZQN"
]);

// 讀 airports.dat
const data = fs.readFileSync(path.join(__dirname, 'airports.dat'), 'utf8');
const lines = data.split('\n');

const out = [];

for (const line of lines) {
  if (!line.trim()) continue;
  const fields = line.split(',');
  const iata = fields[4].replace(/"/g, '');
  if (wanted.has(iata)) {
    out.push({
      name: fields[1].replace(/"/g, ''),
      iata: iata,
      icao: fields[5].replace(/"/g, ''),
      lat: parseFloat(fields[6]),
      lng: parseFloat(fields[7]),
      country: fields[3].replace(/"/g, '')
    });
    wanted.delete(iata);
  }
}

if (wanted.size > 0) {
  console.warn("以下 IATA 未找到，請確認拼寫或資料庫是否缺失:", Array.from(wanted));
}

fs.writeFileSync('airports.json', JSON.stringify(out, null, 2));
console.log("完成！已生成 airports.json，總共", out.length, "個機場");
