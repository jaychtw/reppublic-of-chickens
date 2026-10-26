import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  checks,
  decodeSave,
  DEBATE_LENGTH,
  emptyMeal,
  FOOD_FULLNESS,
  fullness,
  loadSave,
  makeDeck,
  MEALS,
  newSave,
  practicalHalls,
  recordScore,
  repairIssue,
  satisfaction,
  scoreMeal,
  shuffle,
  socialScore,
  unlocked,
} from '../src/core';
import { debate } from '../src/debate';
import { citizenNames, en, patientData, repairData, treatments, zh } from '../src/i18n';

test('A new republic has zero satisfaction, no checks and no ending', () => {
  const state = newSave();
  assert.equal(satisfaction(state), 0);
  assert.equal(checks(state), 0);
  assert.equal(unlocked(state), false);
  assert.equal(state.ending.choice, null);
});
for (const hall of practicalHalls) {
  test(`${hall}: 79 does not award a check; 80 does, and a later zero cannot revoke it`, () => {
    let state = newSave();
    state = recordScore(state, hall, 79);
    assert.equal(state.scores[hall].checked, false);
    state = recordScore(state, hall, 80);
    assert.equal(state.scores[hall].checked, true);
    state = recordScore(state, hall, 100);
    state = recordScore(state, hall, 0);
    assert.deepEqual(state.scores[hall], { latest: 0, best: 100, checked: true });
  });
}
test('Satisfaction uses latest scores including unplayed zeroes; Town contributes no score', () => {
  let state = recordScore(newSave(), 'mess', 100);
  assert.equal(satisfaction(state), 25);
  state.town.completed = true;
  assert.equal(satisfaction(state), 25);
  state = recordScore(state, 'mess', 20);
  assert.equal(satisfaction(state), 5);
  assert.equal(checks(state), 2);
});
test('The ending unlocks only with all five independent checks', () => {
  let state = newSave();
  for (const hall of practicalHalls) state = recordScore(state, hall, 80);
  assert.equal(checks(state), 4);
  assert.equal(unlocked(state), false);
  state.town.completed = true;
  assert.equal(unlocked(state), true);
  const before = structuredClone(state);
  recordScore(state, 'mess', 10);
  assert.deepEqual(state, before, 'score updates are immutable');
});
for (const [attempts, score] of [
  [8, 100],
  [10, 100],
  [11, 90],
  [13, 90],
  [14, 80],
  [16, 80],
  [17, 70],
  [20, 70],
  [21, 60],
  [100, 60],
]) {
  test(`Memory scoring: ${attempts} attempts → ${score}%`, () =>
    assert.equal(socialScore(attempts), score));
}
test('Scores reject incomplete or impossible inputs', () => {
  for (const score of [-1, 101, NaN, 80.5, Infinity])
    assert.throws(() => recordScore(newSave(), 'social', score));
  for (const attempts of [0, 7, 8.5, NaN]) assert.throws(() => socialScore(attempts));
});
test('Shuffled decks always contain exactly eight duplicated identities', () => {
  for (let n = 0; n < 100; n++) {
    const deck = makeDeck();
    assert.equal(deck.length, 16);
    for (let i = 0; i < 8; i++) assert.equal(deck.filter((x) => x === i).length, 2);
  }
  const source = [1, 2, 3, 4];
  assert.deepEqual(
    shuffle(source, () => 0),
    [2, 3, 4, 1],
  );
  assert.deepEqual(source, [1, 2, 3, 4]);
});
for (const [index, meal] of MEALS.entries()) {
  test(`Curated lunch ${index + 1} has a valid, supply-conserving 100% solution`, () => {
    assert.equal(scoreMeal(meal.solution, index).score, 100);
    meal.solution.forEach((row, i) => {
      assert.equal(fullness(row), meal.targets[i]);
      assert.ok(row[meal.wants[i]] >= meal.needs[i]);
    });
    [0, 1, 2].forEach((f) =>
      assert.equal(
        meal.solution.reduce((n, row) => n + row[f], 0),
        3,
      ),
    );
  });
}
test('Lunch scoring separates fullness and nutrition and rejects invented supply', () => {
  assert.deepEqual(scoreMeal(emptyMeal(), 0), { score: 0, full: 0, nutrition: 0 });
  assert.deepEqual(FOOD_FULLNESS, [2, 1, 3]);
  const allocation = [
    [3, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  assert.equal(
    scoreMeal(allocation, 0).full,
    20,
    'overfeeding does not increase a group’s fullness award',
  );
  assert.throws(() =>
    scoreMeal(
      [
        [3, 0, 0],
        [1, 0, 0],
        [0, 0, 0],
      ],
      0,
    ),
  );
  assert.throws(() => scoreMeal([[0, -1, 0]], 0));
});
test('All valid progress and settings round-trip through versioned JSON', () => {
  let state = newSave(true);
  for (const hall of practicalHalls) state = recordScore(state, hall, 90);
  state.language = 'zh-TW';
  state.muted = false;
  state.town = { position: 18, completed: true };
  state.residential = {
    fixed: [true, false, true, false, true, false, true, false, true, false],
    round: 3,
  };
  state.ending = { choice: 'road', seen: true };
  assert.deepEqual(decodeSave(JSON.stringify(state)), state);
});
test('Import validates versions, ranges, object shapes and consistency', () => {
  const mutations: ((s: any) => void)[] = [
    (s) => (s.version = 2),
    (s) => (s.language = 'xx'),
    (s) => (s.muted = 'false'),
    (s) => (s.scores = null),
    (s) => (s.scores.social.latest = -1),
    (s) => (s.scores.social.best = 101),
    (s) => (s.scores.social.checked = true),
    (s) => {
      s.scores.mess.latest = 50;
      s.scores.mess.best = 20;
    },
    (s) => (s.town.position = DEBATE_LENGTH),
    (s) => (s.residential.fixed = [true]),
    (s) => (s.residential.fixed[0] = 1),
    (s) => (s.residential.round = -1),
    (s) => (s.ending.choice = 'keep'),
    (s) => (s.ending.choice = 'other'),
    (s) => (s.ending.seen = true),
  ];
  for (const mutate of mutations) {
    const state = newSave();
    mutate(state);
    assert.throws(() => decodeSave(JSON.stringify(state)));
  }
  for (const input of ['null', '[]', '{', 'x'.repeat(100001)])
    assert.throws(() => decodeSave(input));
});
test('Corrupt or inaccessible storage recovers without throwing', () => {
  assert.equal(loadSave({ getItem: () => '{broken' }).warning, true);
  assert.equal(
    loadSave({
      getItem: () => {
        throw new Error('blocked');
      },
    }).warning,
    true,
  );
  assert.deepEqual(loadSave({ getItem: () => null }).save, newSave());
});
test('English and Traditional Chinese cover every UI key and every authored content item', () => {
  assert.deepEqual(Object.keys(en).sort(), Object.keys(zh).sort());
  for (const key of Object.keys(en) as (keyof typeof en)[]) {
    assert.ok(en[key].trim());
    assert.ok(zh[key].trim());
  }
  assert.equal(zh.title, '雞窩共和國');
  assert.equal(debate.length, DEBATE_LENGTH);
  assert.equal(repairData.length, 10);
  assert.equal(patientData.length, 5);
  assert.equal(treatments.length, 5);
  assert.equal(citizenNames.length, 8);
  for (const line of debate) {
    assert.ok(line.text[0].length > 25);
    assert.match(line.text[1], /[\u3400-\u9fff]/);
    assert.ok(line.speaker >= 0 && line.speaker <= 2);
  }
  for (const p of patientData) {
    assert.ok(p.clue.every(Boolean));
    assert.ok(treatments[p.treatment]);
  }
  for (const r of repairData) {
    assert.ok(r.title.every(Boolean));
    assert.ok(r.steps.every((s) => s.every(Boolean)));
    assert.ok(r.position.every((n) => n > 5 && n < 95));
  }
});
test('Locked English ending strings are exact', () => {
  assert.equal(en.prompt, 'Now, decide the fate you share.');
  assert.equal(en.keep, 'Keep Our Republic');
  assert.equal(en.road, 'The Road Frequently Taken');
  assert.equal(en.keepLine, "Status quo, you know, is Latin for ‘the mess we're in.’");
  assert.equal(en.roadLine, 'Chickens are what chickens are after all.');
});

test('Repairs persist before completion, award a check at eight, and can continue to ten', () => {
  let state = newSave();
  for (let i = 0; i < 7; i++) state = repairIssue(state, i);
  assert.equal(state.residential.fixed.filter(Boolean).length, 7);
  assert.equal(
    state.scores.residential.latest,
    null,
    'unfinished condition does not replace the last completed round',
  );
  assert.equal(state.scores.residential.checked, false);
  state = repairIssue(state, 7);
  assert.equal(state.scores.residential.latest, 80);
  assert.equal(state.scores.residential.checked, true);
  state = repairIssue(state, 8);
  state = repairIssue(state, 9);
  assert.equal(state.scores.residential.latest, 100);
  assert.deepEqual(repairIssue(state, 9), state, 'repeated repair is idempotent');
  assert.throws(() => repairIssue(state, 10));
});
