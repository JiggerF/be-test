import fs from 'fs';

const summary = JSON.parse(fs.readFileSync('coverage/coverage-summary.json', 'utf-8'));
const baseline = JSON.parse(fs.readFileSync('.scripts/coverage-baseline.json', 'utf-8'));

const keys = ['statements', 'branches', 'functions', 'lines'] as const;

let hasDecrease = false;
let hasIncrease = false;

for (const key of keys) {
  const curr = summary.total[key].pct;
  const base = baseline.total[key].pct;

  if (curr < base) {
    console.log(`⚠️ ${key} coverage decreased: from ${base}% -> ${curr}%`);
    hasDecrease = true;
  } else if (curr > base) {
    console.log(`⬆️ ${key} coverage improved: from ${base}% -> ${curr}%`);
    hasIncrease = true;
  } else {
    console.log(`➖ ${key} unchanged: ${curr}%`);
  }
}

if (hasDecrease) {
  console.log('\n🟡 [Tracking Only] Coverage has regressed. Not enforcing yet.');
} else if (hasIncrease) {
  console.log('\n🟢 [Tracking Only] Coverage has improved.');
} else {
  console.log('\n🔵 [Tracking Only] Coverage unchanged.');
}

// Phase 1: Always exit 0
process.exit(0);