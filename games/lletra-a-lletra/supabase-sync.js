/*
 * CloudSync — shared cloud-save module for Robert's educational games.
 *
 * Copy this file next to a game's HTML and include it, AFTER the Supabase
 * CDN script, and BEFORE the game's own <script>:
 *
 *   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 *   <script src="supabase-sync.js"></script>
 *   <script> ...game code, can now call window.CloudSync.* ... </script>
 *
 * See claude-projects/supabase-backend/README.md for the full design
 * (why anonymous auth + a recovery code, how RLS enforces isolation, how to
 * wire this into a new game). This file is intentionally duplicated into
 * each game's own folder (same pattern as nunito-400.woff2) since these are
 * single-file static games with no shared build step or asset pipeline.
 *
 * Every function here is safe to call from a game with no internet
 * connection: they all throw/reject on failure rather than hang, so callers
 * should wrap calls in try/catch and treat failure as "stay local, try
 * again next time" — never block gameplay on these.
 */
const CloudSync = (() => {
  const SUPABASE_URL = 'https://ajztdxjqhyrzuwxjhlna.supabase.co';
  // Safe to be public: this is Supabase's "publishable" client key, meant to
  // ship inside client-side code. Access control is enforced by Postgres Row
  // Level Security policies on the server, not by keeping this secret.
  const SUPABASE_KEY = 'sb_publishable_JGdDnmDU2KR3hNnAgPrBig_3L2HyD3e';

  // Lazy client creation: if the CDN script failed to load (offline, blocked,
  // slow connection), `window.supabase` won't exist yet. Creating the client
  // eagerly here would throw at page-load time and leave the WHOLE
  // `CloudSync` object undefined for the rest of the page — so instead every
  // exported function below calls getClient(), which throws a clean,
  // catchable error only at the moment it's actually needed.
  let sb = null;
  function getClient() {
    if (sb) return sb;
    if (!window.supabase) throw new Error('cloud_unavailable_offline');
    sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    return sb;
  }

  async function ensureSession() {
    const client = getClient();
    const { data: { session } } = await client.auth.getSession();
    if (session) return session;
    const { data, error } = await client.auth.signInAnonymously();
    if (error) throw error;
    return data.session;
  }

  // Excludes visually-ambiguous characters (0/O, 1/I/L) since kids write
  // these down by hand and type them back in on a different device.
  function genRecoveryCode() {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code.slice(0, 4) + '-' + code.slice(4);
  }

  /**
   * First-time setup on a device: creates a new student row tied to this
   * browser's anonymous session. Returns the recovery code — the caller
   * MUST show this to the student ("write this down") since it's the only
   * way to resume on another device.
   */
  async function joinClass(classCode, displayName) {
    await ensureSession();
    const client = getClient();
    const { data: cls, error: classErr } = await client.from('classes')
      .select('id').eq('code', classCode).single();
    if (classErr || !cls) throw new Error('class_not_found');

    const { data: { user } } = await client.auth.getUser();

    let student, err, recoveryCode;
    for (let attempt = 0; attempt < 3; attempt++) {
      recoveryCode = genRecoveryCode();
      ({ data: student, error: err } = await client.from('students')
        .insert({ auth_uid: user.id, class_id: cls.id, display_name: displayName, recovery_code: recoveryCode })
        .select().single());
      if (!err) break; // only retries on a (rare) recovery_code collision
    }
    if (err) throw err;

    return { studentId: student.id, classCode, recoveryCode };
  }

  /**
   * Re-homes an existing student row (created via joinClass elsewhere) onto
   * THIS browser's anonymous session — how a student resumes on a new
   * device, or after clearing browser data on this one.
   */
  async function claim(recoveryCode, classCode) {
    await ensureSession();
    const { data, error } = await getClient().rpc('claim_student', {
      p_recovery_code: recoveryCode, p_class_code: classCode
    });
    if (error) throw error;
    return { studentId: data.id, classCode };
  }

  /** Upsert the full progress blob for one game. Call at natural checkpoints
   *  (e.g. end of a round), not on every keystroke — keeps request volume
   *  sane for a whole class playing at once. */
  async function saveProgress(studentId, gameSlug, playerJson) {
    const { error } = await getClient().from('progress').upsert(
      { student_id: studentId, game_slug: gameSlug, player_json: playerJson, updated_at: new Date().toISOString() },
      { onConflict: 'student_id,game_slug' }
    );
    if (error) throw error;
  }

  /** Returns { player_json, updated_at } or null if this student has no
   *  cloud progress yet for this game. */
  async function loadProgress(studentId, gameSlug) {
    const { data, error } = await getClient().from('progress').select('player_json, updated_at')
      .eq('student_id', studentId).eq('game_slug', gameSlug).maybeSingle();
    if (error) throw error;
    return data;
  }

  return { joinClass, claim, saveProgress, loadProgress };
})();
