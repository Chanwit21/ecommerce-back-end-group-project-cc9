import assert from "node:assert/strict";
const api = "http://127.0.0.1:4200";
const web = "http://127.0.0.1:3200";
async function call(path, method = "GET", body, token) {
  const r = await fetch(api + path, {
    method,
    headers: {
      ...(token ? { Authorization: "Bearer " + token } : {}),
      ...(body ? { "content-type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return {
    status: r.status,
    data:
      r.status === 204
        ? null
        : r.headers.get("content-type")?.includes("json")
          ? await r.json()
          : await r.text(),
  };
}
assert.equal((await call("/health")).status, 200);
const catalog = await call("/catalog");
assert.equal(catalog.status, 200);
assert.ok(catalog.data.products.length >= 6);
const product = catalog.data.products[0];
const admin = (
  await call("/users/login", "POST", {
    email: "admin@ecommerce.local",
    password: "DemoShop!2026",
  })
).data.token;
const customer = (
  await call("/users/login", "POST", {
    email: "customer@ecommerce.local",
    password: "DemoShop!2026",
  })
).data.token;
assert.ok(admin && customer);
assert.equal((await call("/product", "GET", null, customer)).status, 401);
assert.equal((await call("/product", "GET", null, admin)).status, 200);
assert.equal((await call("/contactUs?offset=0")).status, 401);
assert.equal(
  (await call("/contactUs?offset=0", "GET", null, admin)).status,
  201,
);
const cart = await call(
  "/carts",
  "POST",
  { quality: 1, productId: product.id },
  customer,
);
assert.equal(cart.status, 200);
const item = cart.data.cartItem;
assert.equal(
  (await call("/carts/cart_item/" + item.id, "POST", { quality: 2 }, customer))
    .status,
  200,
);
assert.equal(
  (await call("/carts/cart_item/" + item.id, "DELETE", null, customer)).status,
  204,
);
assert.equal(
  (
    await call(
      "/carts",
      "POST",
      { quality: -1, productId: product.id },
      customer,
    )
  ).status,
  400,
);
assert.equal(
  (await call("/products?filter=%7B%7D&offset=0", "GET", null, admin)).status,
  200,
);
assert.equal((await call("/cards", "GET", null, customer)).status, 503);
assert.equal((await call("/users/login/google", "POST", {})).status, 503);

const email = "smoke-" + Date.now() + "@ecommerce.local";
assert.equal(
  (
    await call("/users/register", "POST", {
      firstName: "Smoke",
      lastName: "Test",
      email,
      password: "DemoShop!2026",
    })
  ).status,
  201,
);
assert.equal(
  (
    await call("/users/register", "POST", {
      firstName: "Smoke",
      lastName: "Test",
      email,
      password: "DemoShop!2026",
    })
  ).status,
  400,
);
const other = (
  await call("/users/login", "POST", { email, password: "DemoShop!2026" })
).data.token;
const owned = (
  await call("/carts", "POST", { quality: 1, productId: product.id }, customer)
).data.cartItem;
assert.equal(
  (await call("/carts/cart_item/" + owned.id, "POST", { quality: 2 }, other))
    .status,
  404,
);
await call("/carts/cart_item/" + owned.id, "DELETE", null, customer);
const address = (
  await call(
    "/address",
    "POST",
    {
      firstName: "Demo",
      lastName: "Test",
      address1: "Demo address",
      subDistrict: "Demo",
      district: "Demo",
      province: "Demo",
      postalCode: "10200",
      phoneNumber: "0000000000",
    },
    customer,
  )
).data.address;
assert.equal(
  (await call("/address/" + address.id, "DELETE", null, other)).status,
  400,
);
assert.equal(
  (await call("/address/" + address.id, "DELETE", null, customer)).status,
  204,
);
for (const [role, email, allowed, denied] of [
  ["ADMIN", "admin@ecommerce.local", "/admin/products", "/cart"],
  ["CUSTOMER", "customer@ecommerce.local", "/account", "/admin"],
]) {
  const login = await fetch(web + "/api/users/login", {
    method: "POST",
    headers: { origin: web, "content-type": "application/json" },
    body: JSON.stringify({ email, password: "DemoShop!2026" }),
  });
  assert.equal(login.status, 200);
  const data = await login.json();
  assert.equal(data.user.role, role);
  assert.equal(data.token, undefined);
  const set = login.headers.get("set-cookie");
  assert.match(set, /HttpOnly/i);
  const cookie = set.split(";")[0];
  assert.equal(
    (await fetch(web + allowed, { headers: { cookie }, redirect: "manual" }))
      .status,
    200,
  );
  assert.equal(
    (await fetch(web + denied, { headers: { cookie }, redirect: "manual" }))
      .status,
    307,
  );
  assert.equal(
    (
      await fetch(web + allowed, {
        headers: { cookie: cookie + "x" },
        redirect: "manual",
      })
    ).status,
    307,
  );
  const session = await fetch(web + "/api/auth/session", {
    headers: { cookie },
  });
  assert.equal(session.status, 200);
  assert.equal((await session.json()).user.role, role);
  assert.equal(
    (
      await fetch(web + "/api/auth/logout", {
        method: "POST",
        headers: { cookie, origin: "https://wrong.example" },
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await fetch(web + "/api/auth/logout", {
        method: "POST",
        headers: { cookie, origin: web },
      })
    ).status,
    200,
  );
}
for (const path of [
  "/",
  "/products/All%20Product",
  "/products/face",
  "/products/detail/" + encodeURIComponent(product.name),
  "/login",
  "/register",
  "/contact",
  "/terms",
])
  assert.equal((await fetch(web + path)).status, 200, path);
assert.equal((await fetch(web + "/admin", { redirect: "manual" })).status, 307);
console.log(
  "PASS: catalog, customer/admin auth and roles, cart CRUD/quantity, registration/duplicates, protected contact inbox, HttpOnly sessions, cookie tampering, CSRF, logout and public routes",
);
