require("dotenv").config();
const fs = require("fs");
fs.mkdirSync("data", { recursive: true });
const db = require("../src/database/models");
const bcrypt = require("bcryptjs");
(async () => {
  if (process.env.DB_DIALECT && process.env.DB_DIALECT !== "sqlite")
    throw Error("Demo seed is SQLite-only");
  await db.sequelize.sync();
  for (const [email, role, name] of [
    ["admin@ecommerce.local", "ADMIN", "Admin"],
    ["customer@ecommerce.local", "CUSTOMER", "Customer"],
  ]) {
    const [user] = await db.User.findOrCreate({
      where: { email },
      defaults: {
        role,
        firstName: name,
        lastName: "Demo",
        password: await bcrypt.hash("DemoShop!2026", 12),
      },
    });
    await db.Cart.findOrCreate({ where: { userId: user.id } });
  }
  for (const [name, category, price, image] of [
    ["Soft Rose Lipstick", "lips", 590, "vanilla.png"],
    ["Everyday Skin Tint", "face", 890, "elixir.png"],
    ["Golden Hour Palette", "eyes", 1290, "kidbox.png"],
    ["Petal Blush", "sheek", 690, "musk.webp"],
    ["Daily Glow Body", "body", 990, "elixir.png"],
    ["Velvet Lip Balm", "lips", 390, "vanilla.png"],
  ]) {
    const [product] = await db.Product.findOrCreate({
      where: { name },
      defaults: {
        cetagory: category,
        price,
        description:
          "A carefully selected everyday beauty essential. Demo product for local development.",
        ingredient: "Demo product",
        colorName: "Rose",
        color: "#d5868d",
        countStock: "25",
      },
    });
    await db.ProductImage.findOrCreate({
      where: { productId: product.id, imageUrl: "/assets/mocks/" + image },
    });
  }
  const [geo] = await db.Geography.findOrCreate({ where: { name: "Central" } });
  const [province] = await db.Province.findOrCreate({
    where: { code: "10" },
    defaults: { name: "กรุงเทพมหานคร", geoId: geo.id },
  });
  const [amphur] = await db.Amphur.findOrCreate({
    where: { code: "1001" },
    defaults: {
      name: "พระนคร",
      postalCode: "10200",
      geoId: geo.id,
      provinceId: province.id,
    },
  });
  await db.District.findOrCreate({
    where: { code: "100101" },
    defaults: {
      name: "พระบรมมหาราชวัง",
      geoId: geo.id,
      provinceId: province.id,
      amphurId: amphur.id,
    },
  });
  console.log("Seeded local demo accounts, products and location");
  await db.sequelize.close();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
