import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Scene } from '../../domain/value-objects/Scene.js';
import { Storyboard } from '../../domain/value-objects/Storyboard.js';

describe('Scene Value Object', () => {
  it('instantiates successfully with valid properties', () => {
    const scene = new Scene({
      id: 'scene-1',
      type: 'hook',
      title: 'Attention grabbing hook',
      subtitle: 'Supporting punchline',
      durationSeconds: 3.5,
      sfxCue: 'boom.wav'
    });

    assert.equal(scene.id, 'scene-1');
    assert.equal(scene.type, 'hook');
    assert.equal(scene.durationSeconds, 3.5);
    assert.equal(scene.sfxCue, 'boom.wav');
  });

  it('throws an error if duration is zero or negative', () => {
    assert.throws(() => {
      new Scene({
        id: 'bad-scene',
        type: 'hook',
        title: 'Invalid',
        durationSeconds: 0
      });
    }, /duration must be positive/);

    assert.throws(() => {
      new Scene({
        id: 'bad-scene-2',
        type: 'hook',
        title: 'Invalid negative',
        durationSeconds: -2
      });
    }, /duration must be positive/);
  });
});

describe('Storyboard Value Object', () => {
  const scene1 = new Scene({ id: 's1', type: 'hook', title: 'Hook', durationSeconds: 3.0 });
  const scene2 = new Scene({ id: 's2', type: 'reveal', title: 'Reveal', durationSeconds: 4.5 });
  const scene3 = new Scene({ id: 's3', type: 'outro', title: 'Outro', durationSeconds: 2.5 });

  it('calculates total duration across all scenes', () => {
    const sb = new Storyboard([scene1, scene2, scene3]);
    assert.equal(sb.getTotalDurationSeconds(), 10.0);
  });

  it('retrieves the hook scene', () => {
    const sb = new Storyboard([scene1, scene2, scene3]);
    const hook = sb.getHook();
    assert.ok(hook);
    assert.equal(hook.id, 's1');
  });

  it('retrieves the outro scene', () => {
    const sb = new Storyboard([scene1, scene2, scene3]);
    const outro = sb.getOutro();
    assert.ok(outro);
    assert.equal(outro.id, 's3');
  });

  it('throws an error if instantiated with empty scenes', () => {
    assert.throws(() => {
      new Storyboard([]);
    }, /Storyboard must contain at least one scene/);
  });
});
