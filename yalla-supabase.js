// yalla-supabase.js — Supabase client for yalla-kids frontend.
//
// The publishable ("anon") key below is SAFE to commit publicly.
// Row Level Security policies in the database control what anyone with this
// key can actually read or write. See supabase-places-seed.sql for the
// "public read places" policy.

(function () {
  var SUPA_URL = 'https://pfrtdysojqkbrhowprcd.supabase.co';
  var SUPA_KEY = 'sb_publishable_l-33FjxGDJv5gV48Li_5AA_s0HnAV5l';

  function headers() {
    return {
      apikey: SUPA_KEY,
      Authorization: 'Bearer ' + SUPA_KEY,
      Accept: 'application/json'
    };
  }

  // Fetch all places, ordered by name. Returns an array shaped to match
  // the static yalla-kids-data.js `places` entries (adds kind='place').
  async function fetchPlaces() {
    var url = SUPA_URL + '/rest/v1/places?select=*&order=name_en.asc';
    var r = await fetch(url, { headers: headers() });
    if (!r.ok) {
      var body = await r.text().catch(function () { return ''; });
      throw new Error('Supabase fetch failed: ' + r.status + ' ' + r.statusText + ' ' + body);
    }
    var rows = await r.json();
    return rows.map(function (p) { p.kind = 'place'; return p; });
  }

  window.YallaDB = {
    url: SUPA_URL,
    key: SUPA_KEY,
    fetchPlaces: fetchPlaces
  };
})();
