---
id: profile
title: Profile
sidebar_label: Profile
---

# Skeletons.Profile

A **user profile display element** — renders an avatar or profile representation for a given user or entity, identified by `id` or name fields.

---

## Signature

```js
Skeletons.Profile(props, style?)
```

---

## Common Props

| Prop        | Type   | Description                                               |
| ----------- | ------ | --------------------------------------------------------- |
| `className` | String | CSS class(es) to apply                                    |
| `id`        | String | User or entity ID — used to fetch and display the profile |
| `type`      | String | Display type — e.g. `"thumb"` for a thumbnail avatar      |
| `firstname` | String | First name — used when displaying a static profile        |
| `lastname`  | String | Last name                                                 |
| `fullname`  | String | Full display name — overrides `firstname` + `lastname`    |
| `active`    | Number | `0` to render in inactive state                           |
| `dataset`   | Object | `data-*` attributes                                       |

---

## Examples

### Live user avatar by ID

```js
Skeletons.Profile({
  className: `${fig}__avatar`,
  type: "thumb",
  id: ui.mget("peer_id"),
  active: 0,
  dataset: { active: 0 },
});
```

### Static profile with name

```js
Skeletons.Profile({
  className: `${fig}__profile`,
  id: ui.mget("entity_id"),
  firstname: "My",
  lastname: "Entity",
  fullname: "My Entity",
});
```

---
