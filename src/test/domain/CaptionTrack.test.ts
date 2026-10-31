import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CaptionTrack } from '../../domain/value-objects/CaptionTrack.js';

describe('CaptionTrack Value Object', () => {
  const words = [
    { word: 'Welcome', start: 0.0, end: 0.5 },
    { word: 'to', start: 0.6, end: 0.8 },
    { word: 'the', start: 0.9, end: 1.1 },
    { word: 'masterclass', start: 1.2, end: 2.0 }
  ];

  it('finds active word matching current timestamp', () => {
    const track = new CaptionTrack(words);
    const active = track.getActiveWord(1.5);
    assert.ok(active);
    assert.equal(active.word, 'masterclass');
  });

  it('returns undefined if timestamp does not fall inside any word window', () => {
    const track = new CaptionTrack(words);
    const active = track.getActiveWord(0.55); // between Welcome (0.5) and to (0.6)
    assert.equal(active, undefined);
  });

  it('generates full joined transcript string', () => {
    const track = new CaptionTrack(words);
    assert.equal(track.getFullTranscript(), 'Welcome to the masterclass');
  });

  it('handles empty word list gracefully', () => {
    const track = new CaptionTrack([]);
    assert.equal(track.getActiveWord(1.0), undefined);
    assert.equal(track.getFullTranscript(), '');
  });
});
