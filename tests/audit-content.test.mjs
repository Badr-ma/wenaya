import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeApiSpeciality } from '@/lib/practice-adapter';
import { relatedPractices } from '@/lib/practice-editorial';

test('nested backend entities are readable while backend identity, image and title are preserved', () => {
  const record = { id: 9005, fr_name: 'Pratique API', fr_slug: 'pratique-api', description: 'Une description &amp;nbsp; de pratique suffisamment longue.', image_web: 'https://api.example.test/image.jpg' };
  const practice = normalizeApiSpeciality(record, 'fr');
  assert.equal(practice.title, record.fr_name);
  assert.equal(practice.description, 'Une description de pratique suffisamment longue.');
  assert.equal(practice.image, record.image_web);
  assert.equal(practice.slug, 'pratique-api-9005');
});

test('malformed numeric entities cannot crash the live practice adapter', () => {
  assert.doesNotThrow(() => normalizeApiSpeciality({id:9006,fr_name:'API',description:'Example &#99999999999; and &#xFFFFFFFF; backend content'},'fr'));
});

test('neuropsychology recommendations include only available relevant live records', () => {
  const current = {slug:'neuropsychologie',category:'mentalHealth'};
  const input = [{slug:'cupping-therapy-hijama',category:'manualTherapies'},{slug:'orthophonie',category:'childDevelopment'},{slug:'psychologie',category:'mentalHealth'},current];
  assert.deepEqual(relatedPractices(input,current).map(p=>p.slug),['orthophonie','psychologie']);
  assert.deepEqual(relatedPractices([current],current),[]);
});
