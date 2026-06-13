---
id: userProfile
title: User Profile
sidebar_label: User Profile
---

# Skeletons.UserProfile

A **user profile avatar** with optional name display, online status indicator, and auto-color generation.

> **`UserProfile` is an alias of [`Skeletons.Profile`](./profile.md).** In the skeleton registry both names resolve to the **same factory** (`kind: "profile"`, the `widgets/profile` view), so they accept identical props and behave identically. The two names exist only as readability aliases — there is no separate "user" component. `auto_color`, `online`, and `live_status` are available on both.

---

## Signature

```js
Skeletons.UserProfile(props, style?)
```

---

## Common Props

| Prop          | Type   | Description                                                       |
| ------------- | ------ | ----------------------------------------------------------------- |
| `id`          | String | User ID — used to fetch the avatar and profile data               |
| `className`   | String | CSS class(es) to apply                                            |
| `firstname`   | String | User's first name                                                 |
| `lastname`    | String | User's last name                                                  |
| `fullname`    | String | Full display name — overrides `firstname` + `lastname`            |
| `online`      | Any    | Online status value from the model                                |
| `live_status` | Number | `1` to show a live online/offline indicator                       |
| `auto_color`  | Number | `1` to generate avatar color from the user's name. `0` to disable |
| `sys_pn`      | String | Named part — enables `onPartReady` and `ensurePart`               |

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

## `Profile` and `UserProfile`

`Skeletons.Profile` and `Skeletons.UserProfile` are **the same component** — both map to the
`profile` widget and accept the same props. Pick whichever name reads better at the call site;
there is no behavioural difference between them.

---
