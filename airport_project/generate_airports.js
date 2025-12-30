const fs = require('fs');
const path = require('path');

// 你要生成的機場 IATA 名單
const wanted = new Set(['ABX','ADL','AKJ','AKL','ALH','AMS','AOJ','APW','ARM','ASP','AVV','AXT','AYQ','BCI','BDB','BHQ','BKK','BKQ','BLR','BME','BNE','BNK','BQB','BWT','BXG','BYP','CAN','CBR','CCK','CDG','CEB','CFS','CGK','CHC','CJF','CJU','CKG','CNJ','CNS','CNX','CRK','CTS','DAD','DBO','DEL','DFW','DIL','DOH','DPO','DPS','DRW','DUD','EMD','FCO','FKS','FRA','FSZ','FUK','GET','GFF','GLT','GMP','GYZ','HAN','HBA','HGH','HID','HIJ','HIR','HKD','HKG','HKT','HLZ','HNA','HND','HNL','HSG','HTI','HVB','IAH','ICN','ISA','ISG','JFK','JNB','KCZ','KGC','KGI','KHH','KIJ','KIX','KMI','KMJ','KMQ','KNX','KOJ','KTA','KTI','KUL','LAX','LEA','LHR','LNO','LRE','LST','MCY','MEL','MFM','MGB','MIM','MKY','MNL','MOV','MQL','MRA','MUC','MXP','MYJ','NAN','NGO','NLK','NOU','NRT','NTL','OAG','OCM','ODD','OIT','OKA','OKJ','ONS','ONT','OOD','OOL','OOM','ORD','PBO','PEK','PEN','PER','PHE','PHX','PLO','POM','PPP','PQC','PQQ','PRG','PUS','PVG','RAR','RGN','RMQ','ROK','ROR','SCL','SDJ','SEA','SFO','SGN','SHA','SIN','SYD','SZX','TAK','TBU','TFU','TMW','TNN','TOY','TPE','TSA','TSV','UKB','VIE','VLI','WEI','WGA','WLE','WLG','WLP','WTB','WYA','XCH','XMN','YGJ','YVR','YYZ','ZNE','ZQN']);

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
