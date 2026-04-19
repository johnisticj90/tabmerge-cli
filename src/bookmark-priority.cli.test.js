const fs = require('fs');
const os = require('os');
const path = require('path');
const { main } = require('./bookmark-priority.cli');

function writeTmp(data) {
  const f = path.join(os.tmpdir(), `bp-test-${Date.now()}.json`);
  fs.writeFileSync(f, JSON.stringify(data));
  return f;
}

function capture(fn) {
  const out = [];
  const orig = console.log;
  console.log = (...a) => out.push(a.join(' '));
  fn();
  console.log = orig;
  return out.join('\n');
}

const bms = [
  { url: 'http://a.com', title: 'A' },
  { url: 'http://b.com', title: 'B', priority: 'high' },
];

test('set command assigns priority', () => {
  const f = writeTmp(bms);
  const out = capture(() => main(['set', 'critical', f]));
  const result = JSON.parse(out);
  expect(result.every(b => b.priority === 'critical')).toBe(true);
});

test('filter command filters by priority', () => {
  const f = writeTmp(bms);
  const out = capture(() => main(['filter', 'high', f]));
  const result = JSON.parse(out);
  expect(result).toHaveLength(1);
  expect(result[0].url).toBe('http://b.com');
});

test('atleast command filters at or above', () => {
  const data = [
    { url: 'http://a.com', priority: 'low' },
    { url: 'http://b.com', priority: 'high' },
    { url: 'http://c.com', priority: 'critical' },
  ];
  const f = writeTmp(data);
  const out = capture(() => main(['atleast', 'high', f]));
  const result = JSON.parse(out);
  expect(result).toHaveLength(2);
});

test('sort desc command', () => {
  const data = [
    { url: 'http://a.com', priority: 'low' },
    { url: 'http://b.com', priority: 'critical' },
  ];
  const f = writeTmp(data);
  const out = capture(() => main(['sort', 'desc', f]));
  const result = JSON.parse(out);
  expect(result[0].priority).toBe('critical');
});

test('clear command removes priority', () => {
  const f = writeTmp(bms);
  const out = capture(() => main(['clear', f]));
  const result = JSON.parse(out);
  expect(result.every(b => b.priority === undefined)).toBe(true);
});
