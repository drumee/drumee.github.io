# UI source bugs found during the Frontend SDK doc audit

These are **code** defects (not documentation issues) surfaced while verifying
`docs/api-reference/frontend-sdk/` against the real sources. The docs have been corrected to
describe intended/actual behaviour; these underlying bugs remain and should be triaged by the
UI team. Repos: `@drumee/ui-essentials`, `@drumee/ui-core`.

Line numbers reflect the working copies at audit time and may drift.

---

## `@drumee/ui-essentials` — `socket/utils.js`

### 1. `sanitize()` strips misspelled handler keys — **HIGH**
`socket/utils.js:192-195`
```js
delete opt.widgetId;
delete opt.uiHandler;
delete opt.partHander;    // ← missing "d": should be partHandler
delete opt.errorHander;   // ← missing "d": should be errorHandler
```
`sanitize()` is meant to strip UI-only fields from a payload before it is sent to the server.
Because `partHander`/`errorHander` are misspelled, the real keys `partHandler` and
`errorHandler` are **never removed** — they get serialized and sent over the wire. Fix the
spelling (and consider keeping the misspelled deletes temporarily for back-compat if any caller
relies on them).

### 2. `setAuthorization(key, null)` deletes then re-inserts `null` — **MEDIUM**
`socket/utils.js:205-211`
```js
export function setAuthorization(key, value) {
  if (!key && !value) return;
  if (key && !value) {
    Sessions.delete(key);
  }
  Sessions.set(key, value);   // ← runs even after the delete above
}
```
Calling `setAuthorization("k", null)` to clear a token deletes the entry and then immediately
re-inserts `k → null`. The intended "remove token" path needs a `return` (or `else`) after
`Sessions.delete(key)`.

### 3. `preparePayload()` reads `.service` off the args array — **LOW**
`socket/utils.js:~151`
In the object-style branch, `service = args.service; delete args.service` operates on the
`args` array object rather than `args[0]`. It happens to work via a later fallback, but the
intermediate access is dead/confusing code. Worth cleaning up.

---

## `@drumee/ui-core` — `letc/mfs.js`

### 4. `pluginUrl()` references an unresolved `protocol` — **HIGH**
`letc/mfs.js:670-673`
```js
pluginUrl() {
  const { endpointPath } = bootstrap();      // protocol NOT destructured
  ...
  return `${protocol}://${this.mget(_a.vhost)}${endpointPath}#/${path}`;  // protocol is undefined here
}
```
Compare `srcUrl()` two methods up, which correctly does `let { protocol } = bootstrap();`
(`letc/mfs.js:663`). `pluginUrl()` omits that destructure, so `protocol` is unresolved —
producing a malformed URL or a `ReferenceError`. Add `const { protocol, endpointPath } = bootstrap();`.

### 5. `DATEFORMAT` uses the month token in the time position — **MEDIUM**
`letc/mfs.js:47`
```js
const DATEFORMAT = "DD MMM YY HH:MM:ss";
```
In moment/day.js format strings, `MM` is **month**, not minutes (which is `mm`); seconds should
be `ss` (already correct). As written, the "minutes" slot renders the 2-digit month, so a time
formatted at 10:34 displays as `10:<month>:ss`. Should be `"DD MMM YY HH:mm:ss"`.

### 6. `autolink` / `Autolinker` fully commented out — **MEDIUM**
`letc/widgets/text/editable/index.js` (import line ~6, usage ~144 and ~807-810)
The entire `Autolinker` integration is commented out, so the `autolink` prop that callers pass
to `Skeletons.RichText` is silently inert. Either restore the feature or remove the dead prop
handling. (The doc has been updated to note it is not implemented.)

### 7. `skeleton/list/scroll.js` is dead code with a broken `require` — **LOW**
`letc/.../skeleton/list/scroll.js`
The standalone scroll-list skeleton `require("../builder/list/smart")` resolves to a
non-existent path and is never referenced by the registry. In `toolkit/skeletons.js`,
`List.Scroll` is mapped to `require("./skeleton/list/smart")` — i.e. it's just an **alias** of
`List.Smart`. Either delete `scroll.js` or fix it to be a real distinct variant. (Docs now
describe `List.Scroll` as an alias.)

### 8. `append()` adds an `undefined` child when a function input throws — **LOW**
`letc/widgets/box/index.js:337-343`
On the function-input path, `catch (e) { this.warn(...) }` leaves `skl` undefined and then falls
through to `this.collection.add(undefined)` / splice of `undefined`. Unlike `feed()`/`prepend()`,
which leave the part unchanged, `append()` inserts an undefined child. Should early-return on
catch.

---

## Cross-reference (server-side, out of scope for this audit but found earlier)

- `server-core/lib/utils/mfs.js` `special_dir()` has a **duplicate `case -1`** (the second is
  dead code), so its `-3` falls through to the default `__avatar__`. Noted during the earlier
  Technology-docs audit; tracked here only as a pointer.

---

### Suggested triage order
1. **#1 sanitize spelling** (payload leakage of handler refs) and **#4 pluginUrl** (broken URL) — highest impact.
2. **#2 setAuthorization** and **#5 DATEFORMAT** — visible-but-bounded correctness bugs.
3. **#6 autolink** — decide restore vs remove.
4. **#3 / #7 / #8** — code hygiene.
