const fs = require('fs');
const path = require('path');

// 你要生成的機場 IATA 名單
const wanted = new Set(['ADJ', 'ADL', 'AKJ', 'AKL',  'AMS', 'AOJ', 'AVV', 'AXT', 'AYQ', 'BKK', 'BNE', 'BNK', 'BQB', 'CAN', 'CBR', 'CDG', 'CEB', 'CGK', 'CHC', 'CJU', 'CKG', 'CNS', 'CNX', 'CRK', 'CTS', 'DAD', 'DFW', 'DPS', 'DRW', 'DUD', 'FCO', 'FKS', 'FRA', 'FSZ', 'FUK', 'GMP', 'HAN', 'HBA', 'HGH', 'HIJ', 'HKD', 'HKG', 'HKT', 'HLZ', 'HNA', 'HND', 'HSG', 'HVB', 'IAH', 'ICN', 'ISG', 'JFK', 'KCZ', 'KHH', 'KIJ', 'KIX', 'KMI', 'KMJ', 'KMQ', 'KOJ', 'KTI', 'KUL', 'LAX', 'LHR', 'LST', 'MCY', 'MEL', 'MFM', 'MKY', 'MNL', 'MUC', 'MXP', 'MYJ', 'NAN', 'NGO', 'NRT', 'NTL', 'OIT', 'OKA', 'OKJ', 'ONT', 'OOL', 'ORD', 'PEK', 'PEN', 'PER', 'PHX', 'PPP', 'PQC', 'PRG', 'PUS', 'PVG', 'RAR', 'RGN', 'RMQ', 'ROR', 'SDJ', 'SEA', 'SFO', 'SGN', 'SHA', 'SIN', 'SYD', 'SZX', 'TAK', 'TFU', 'TNN', 'TOY', 'TPE', 'TSA', 'TSV', 'UKB', 'VIE', 'VLI', 'WLG', 'XMN', 'YGJ', 'YVR', 'YYZ', 'ZQN']);

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
