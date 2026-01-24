
const { sequelize, Order, OrderItem, Product } = require("../models");
const { Op } = require("sequelize");

async function testReport() {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");

    const range = "month";
    const now = new Date();
    let start = new Date();
    if (range === "week") start.setDate(now.getDate() - 7);
    else if (range === "month") start.setMonth(now.getMonth() - 1);
    else if (range === "year") start.setFullYear(now.getFullYear() - 1);

    const dateWhere = {
      createdAt: {
        [Op.gte]: start,
      },
    };

    const orderWhere = {
      paymentStatus: "paid",
      ...dateWhere,
    };

    console.log("Fetching summary...");
    const summaryData = await Order.findOne({
      where: orderWhere,
      attributes: [
        [sequelize.fn("SUM", sequelize.col("total_amount")), "totalRevenue"],
        [sequelize.fn("COUNT", sequelize.col("id")), "totalOrders"],
        [sequelize.fn("AVG", sequelize.col("total_amount")), "averageOrderValue"],
        [sequelize.fn("SUM", sequelize.col("total_items")), "totalItemsSold"],
      ],
      raw: true,
    });
    console.log("Summary:", summaryData);

    console.log("Fetching revenue by day...");
    const revenueByDay = await Order.findAll({
      where: orderWhere,
      attributes: [
        [sequelize.fn("DATE", sequelize.col("created_at")), "date"],
        [sequelize.fn("SUM", sequelize.col("total_amount")), "revenue"],
        [sequelize.fn("COUNT", sequelize.col("id")), "orders"],
      ],
      group: [sequelize.fn("DATE", sequelize.col("created_at"))],
      order: [[sequelize.fn("DATE", sequelize.col("created_at")), "ASC"]],
      raw: true,
    });
    console.log("RevenueByDay count:", revenueByDay.length);

    console.log("Fetching top products...");
    const topProducts = await OrderItem.findAll({
      attributes: [
        "productName",
        [sequelize.fn("SUM", sequelize.col("quantity")), "sold"],
        [
          sequelize.fn("SUM", sequelize.literal("quantity * price")),
          "revenue",
        ],
      ],
      include: [
        {
          model: Order,
          attributes: [],
          where: orderWhere,
        },
      ],
      group: ["productName"],
      order: [[sequelize.literal("sold"), "DESC"]],
      limit: 5,
      raw: true,
    });
    console.log("Top Products:", topProducts);

    console.log("Fetching category breakdown...");
    const categoryBreakdown = await OrderItem.findAll({
      attributes: [
        [sequelize.col("product.category"), "category"],
        [
          sequelize.fn("COUNT", sequelize.fn("DISTINCT", sequelize.col("OrderItem.order_id"))),
          "orders",
        ],
        [
          sequelize.fn("SUM", sequelize.literal('"OrderItem"."quantity" * "OrderItem"."price"')),
          "revenue",
        ],
      ],
      include: [
        {
          model: Product,
          as: "product",
          attributes: [],
          required: true,
        },
        {
          model: Order,
          attributes: [],
          where: orderWhere,
        },
      ],
      group: [sequelize.col("product.category")],
      raw: true,
    });
    console.log("Category Breakdown:", categoryBreakdown);

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await sequelize.close();
  }
}

testReport();
