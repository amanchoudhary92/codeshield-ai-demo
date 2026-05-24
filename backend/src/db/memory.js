const scans = [];

export function saveScan(scan) {
  const record = { id: scans.length + 1, createdAt: new Date().toISOString(), ...scan };
  scans.push(record);
  return record;
}

export function listScans() {
  return scans.slice().reverse();
}
