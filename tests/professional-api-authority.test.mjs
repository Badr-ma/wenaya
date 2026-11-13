import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getLiveProfessionalBySlug } from '@/lib/professionals-detail';

process.env.WENAYA_API_URL = 'https://api.example.test';

test('approved API services retain their prices, including 1 MAD, without rewriting profile information', async (t) => {
  const services = [
    { id: 191, name: 'Réunion pédagogique', price: 1, duration: 30, type: 'video' },
    { id: 126, name: 'Bilan Neuropsychologie', price: 1000, duration: 90, type: 'practice' },
  ];
  let reviewsUrl;
  t.mock.method(globalThis, 'fetch', async (input) => {
    const url = String(input);
    if (url.includes('getProfessionalBySlug')) return Response.json({ error: false, data: {
      user: { id: 42, first_name: 'Test', last_name: 'Professional', slug: 'test-professional', username: 'RawUserName' },
      professional: { slug: 'test-professional', appointment_information: '<p>Bilan neuropsychologique : 4000 dhs</p>' },
      specialities: [{ id: 7, fr_name: 'Neuropsychologie', en_name: 'Neuropsychology' }],
    } });
    if (url.includes('getAllSpecialityWithCaresByProfessional')) return Response.json({ error: false, data: {
      specialities: [{ id: 7, name: 'Neuropsychologie', cares: [{ id: 1, name: 'Care', services }] }], packs: [],
    } });
    reviewsUrl = url;
    return Response.json({ error: false, data: { reviews: { data: [], total: 0 } } });
  });
  const professional = await getLiveProfessionalBySlug('test-professional', 'fr');
  assert.equal(professional.services.length, 2);
  assert.equal(new URL(reviewsUrl).pathname, '/api/v1/getReviewsByProfessionalSlug/test-professional');
  assert.equal(professional.availabilityApi.userName, 'RawUserName');
  assert.deepEqual(professional.services.map(s => ({ id: s.id, price: s.price, duration: s.duration })), [
    { id: '191', price: '1 MAD', duration: '30 min' },
    { id: '126', price: '1000 MAD', duration: '90 min' },
  ]);
  assert.match(professional.appointmentInfo.join(' '), /4000 dhs/);
});
