const fs = require('fs');
const path = require('path');

// 你要生成的機場 IATA 名單
const wanted = new Set([
  "AKJ","AKL","AMS","AOJ","AXT","BKK","BNE","CAN","CDG","CEB","CGK","CJU","CKG","CNX","CRK",
  "CTS","DAD","DFW","DPS","FCO","FKS","FRA","FSZ","FUK","GMP","HAN","HIJ","HKD","HKG","HKT",
  "HNA","HND","HSG","IAH","ICN","ISG","JFK","KCZ","KHH","KIJ","KIX","KMI","KMJ","KMQ",
  "KOJ","KTI","KUL","LAX","LHR","MEL","MFM","MNL","MUC","MXP","MYJ","NGO","NRT","OIT","OKA",
  "OKJ","ONT","ORD","PEK","PEN","PHX","PNH","PRG","PUS","PVG","RGN","RMQ","ROR","SDJ","SEA",
  "SFO","SGN","SHA","SIN","SYD","SZX","TAK","TFU","TNN","TOY","TPE","TSA","UKB","VIE","YGJ",
  "YVR","YYZ"
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
