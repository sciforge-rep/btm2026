# BTM 2026 conference app: maintenance notes

Static PWA for the Brain Tumor Meeting 2026 (14–15 Oct 2026, MDC.C Berlin-Buch), served by GitHub Pages from the `main` branch root at https://sciforge-rep.github.io/btm2026/. No build step. Owner: Matthias Schmitt (organizing committee).

## Where things live

- `data/program.json`: programme (days, sessions, entries). Keep entry IDs stable; favourites reference them.
- `data/abstracts.json`: list of abstract records, one per submission, id `abs-<submissionId>`.
- `data/posters.json`: poster plan (`themes` with letter code and number range, `posters` with number/theme/presenter/title/abstractId, `format` block).
- `data/app-config.json`: event info, venues, CME, sponsors (with amounts; shown only on the CME tab), meeting info.
- `abstracts/pdf/<submissionId>.pdf`: original abstract PDFs.
- `docs/`: programme PDF and campus map.
- `images/`: icons, venue photos, `images/sponsors/` logos.
- `src/app.js`, `src/styles.css`, `index.html`: the app. `service-worker.js`: offline cache.

## Rules

- Files in `data/` reach installed apps automatically (network-first). For any change to code, styles, images or PDFs, bump `VERSION` at the top of `service-worker.js` (format `btm2026-vX.Y.Z-YYYYMMDD`).
- Abstract counts on screen are computed from the data. Do not hard-code counts.
- Never publish internal notes (e.g. the "Note" column of the organizers' poster spreadsheet) or sponsor amounts outside the CME tab.
- Keep the author's wording, spelling and title casing in abstracts; do not correct their text.
- Validate JSON and run `node --check src/app.js service-worker.js` before committing.

## Adding an abstract

1. Save the PDF as `abstracts/pdf/<id>.pdf`.
2. Append a record to `data/abstracts.json` with the same keys as existing records: `id`, `submissionId`, `title`, `format` ("Poster abstract" unless it is in the programme), `programmeId` "", `programme` null, `presentingAuthors`, `leadAuthor`, `authors` [{name, presenting, affiliationRefs}], `affiliations` [{ref, name}], `keywords`, `bodyParagraphs`, `body` (paragraphs joined by a blank line), `abstractStatus` "full", `pdfPath`, `pageCount`, `sourceFilename`, `source` "Author-submitted abstract PDF", `eveningContributor` false, `eveningContributorName` "", `searchText`.
3. `searchText` = lowercase ASCII (strip accents; ı→i, ß→ss, ø→o), non-alphanumerics replaced by single spaces, built from: title, lead author, all author names, all affiliation names, keywords, body, format, submissionId.
4. If it is a poster, add it to `data/posters.json` (see below).

## Poster numbering

Each thematic block has a letter `code` (A, B, C, … in `themes` order), and posters are numbered within their block: A1–A12, B1–B6, etc. `number` is a string such as "B3". When adding a poster, give it the next free number at the end of its block (e.g. B7); no other poster changes number. Update that theme's `numbers` range (e.g. "B1-B7") and the count in `intro`. The organizers keep a matching Excel plan; mention the new number in the reply so it can be updated.

## Poster voting

Participants vote for posters (3 votes each, anonymous codes) on the Posters tab; organisers see results at `voting-results/` with an admin key. Details, protection and SQL for common tasks: `voting/README.md`. Backend: Supabase project `btm2026-poster-voting`; settings in `data/app-config.json` → `voting`.

- Votes are stored by poster number. Once voting opens (Wed 14 Oct 2026, 08:00 Berlin time), do not renumber posters; a new poster may still get the next free number in its block.
- Never commit voting codes, code slips or the admin key.
