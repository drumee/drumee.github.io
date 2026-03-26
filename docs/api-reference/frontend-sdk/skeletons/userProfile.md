---
id: userProfile
title: User Profile
sidebar_label: User Profile
---

# Skeletons.UserProfile

A **user profile avatar** with optional name display, online status indicator, and auto-color generation. More user-specific than [`Skeletons.Profile`](./profile.md) — designed specifically for Drumee user accounts.

---

## Signature

```js
Skeletons.UserProfile(props, style?)
```

---

## Common Props

| Prop          | Type   | Description                                                                 |
| ------------- | ------ | --------------------------------------------------------------------------- |
| `id`          | String | User ID — used to fetch the avatar and profile data                         |
| `className`   | String | CSS class(es) to apply                                                      |
| `firstname`   | String | User's first name                                                           |
| `lastname`    | String | User's last name                                                            |
| `fullname`    | String | Full display name — overrides `firstname` + `lastname`                      |
| `online`      | Any    | Online status value from the model                                          |
| `live_status` | Number | `1` to show a live online/offline indicator                                 |
| `auto_color`  | Number | `1` to generate avatar color from the user's name. `0` to disable           |
| `sys_pn`      | String | Named part — enables `onPartReady` and `ensurePart`                         |
| `state`       | Number | State (`0` or `1`) — reflects to `data-state` on the element                |
| `radio`       | String | Channel ID — all widgets in the same channel reset to `0` except the active |
| `radiotoggle` | Number | Toggle mode (`1` or `0`) — switches state between `0` and `1` on each click |

---

## Examples

### Basic avatar with name

```js
Skeletons.UserProfile({
  className: `${fig}__avatar`,
  id: ui.mget("uid"),
  firstname: ui.mget("firstname"),
  lastname: ui.mget("lastname"),
});
```

### Auto-color avatar (no photo)

```js
Skeletons.UserProfile({
  className: `${fig}__avatar`,
  id: ui.mget("user_id"),
  auto_color: 1,
});
```

### With live online status

```js
Skeletons.UserProfile({
  className: `${fig}__profile`,
  id: ui.mget("user_id"),
  fullname: displayName,
  online: ui.mget("online"),
  live_status: 1,
  sys_pn: "profile",
});
```

### Named part only (minimal)

```js
Skeletons.UserProfile({
  auto_color: 0,
  sys_pn: "my-profile",
});
```

---

## `Profile` vs `UserProfile`

|                  | `Skeletons.Profile` | `Skeletons.UserProfile` |
| ---------------- | ------------------- | ----------------------- |
| For any entity   | ✅                  | ❌                      |
| For Drumee users | ✅                  | ✅                      |
| `auto_color`     | ❌                  | ✅                      |
| `live_status`    | ❌                  | ✅                      |
| `online`         | ❌                  | ✅                      |

> Use `Profile` for generic entities (support tickets, bots, etc.). Use `UserProfile` for real Drumee user accounts.

---
