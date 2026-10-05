import assert from 'node:assert/strict';
import { test } from 'node:test';
import { generateAutoReplyContent, generateEmailContent } from '../lib/email';

test('contact email treats visitor content as text and preserves message line breaks', () => {
  const message = '<script>alert("hello")</script>\r\nSecond line & more';
  const { htmlContent, textContent } = generateEmailContent({ name: '<img src=x onerror=alert(1)>', email: 'test@example.com', subject: '"Build" & learn', message, timestamp: new Date('2026-10-04T12:00:00Z') });
  assert.ok(!htmlContent.includes('<script>'));
  assert.ok(!htmlContent.includes('<img src=x'));
  assert.ok(htmlContent.includes('&lt;img src=x onerror=alert(1)&gt;'));
  assert.ok(htmlContent.includes('&quot;Build&quot; &amp; learn'));
  assert.ok(htmlContent.includes('&lt;/script&gt;<br>Second line &amp; more'));
  assert.ok(textContent.includes(message));
  assert.ok(textContent.includes('2026-10-04T12:00:00.000Z'));
});

test('confirmation escapes visitor text and links to the current profile routes', () => {
  const { htmlContent, textContent } = generateAutoReplyContent({ name: 'Chan <Dinh>', email: 'test@example.com', subject: '<a href="https://untrusted.test">hello</a>', message: 'Hello' });
  assert.ok(htmlContent.includes('Chan &lt;Dinh&gt;'));
  assert.ok(!htmlContent.includes('<a href="https://untrusted.test">'));
  assert.ok(htmlContent.includes('href="https://chandinh.dev/linkedin"'));
  assert.ok(htmlContent.includes('https://chandinh.dev/favicon-128x128.png?v=cd1'));
  assert.ok(textContent.includes('Chan <Dinh>'));
});
