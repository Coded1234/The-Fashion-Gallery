import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  FiCalendar,
  FiDollarSign,
  FiShoppingBag,
  FiTrendingUp,
  FiDownload,
  FiRefreshCw,
  FiBarChart2,
  FiPackage,
  FiPieChart,
  FiLayers,
} from "react-icons/fi";
import { adminAPI } from "../../utils/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [dateRange, setDateRange] = useState("month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchReport();
  }, [dateRange]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const params = { range: dateRange };
      if (dateRange === "custom" && startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }
      const { data } = await adminAPI.getSalesReport(params);
      setReportData(data);
    } catch (error) {
      console.error("Failed to fetch report:", error);
      toast.error("Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCustomDateSubmit = () => {
    if (startDate && endDate) {
      fetchReport();
    } else {
      toast.error("Please select start and end dates");
    }
  };

  const exportReport = () => {
    if (!reportData) return;
    let csv = "Sales Report\n\n";
    csv += "Summary\n";
    csv += `Total Revenue,${reportData?.summary?.totalRevenue || 0}\n`;
    csv += `Total Orders,${reportData?.summary?.totalOrders || 0}\n`;
    csv += `Average Order Value,${reportData?.summary?.averageOrderValue || 0}\n`;
    csv += `Total Items Sold,${reportData?.summary?.totalItemsSold || 0}\n\n`;
    csv += "Top Products\n";
    csv += "Product,Sold,Revenue\n";
    reportData?.topProducts?.forEach((p) => {
      csv += `${p.name},${p.sold},${p.revenue}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading && !reportData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const rangeOptions = [
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "quarter", label: "Quarter" },
    { value: "year", label: "Year" },
    { value: "custom", label: "Custom" },
  ];

  const maxRevenue =
    reportData?.revenueByDay?.length &&
    Math.max(...reportData.revenueByDay.map((d) => d.revenue));
  const maxCategoryRevenue =
    reportData?.categoryBreakdown?.length &&
    Math.max(...reportData.categoryBreakdown.map((c) => c.revenue));

  const statusColors = {
    pending: "from-amber-500 to-amber-600",
    confirmed: "from-blue-500 to-blue-600",
    processing: "from-indigo-500 to-indigo-600",
    shipped: "from-violet-500 to-violet-600",
    delivered: "from-emerald-500 to-emerald-600",
    cancelled: "from-red-500 to-red-600",
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Sales Reports
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Performance and analytics for your store
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchReport}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 transition-all"
          >
            <FiRefreshCw
              size={18}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
          <button
            onClick={exportReport}
            disabled={!reportData}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:from-primary-600 hover:to-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-sm disabled:opacity-50 transition-all"
          >
            <FiDownload size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Date range */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-gray-600">
              <FiCalendar size={18} />
              <span className="text-sm font-medium">Period</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {rangeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDateRange(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    dateRange === option.value
                      ? "bg-primary-500 text-white shadow-sm"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {dateRange === "custom" && (
              <div className="flex flex-wrap items-center gap-2 ml-auto">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <span className="text-gray-400">→</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  onClick={handleCustomDateSubmit}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: formatCurrency(reportData?.summary?.totalRevenue || 0),
            icon: FiDollarSign,
            bg: "bg-emerald-500",
            light: "bg-emerald-50",
            iconColor: "text-emerald-600",
          },
          {
            label: "Total Orders",
            value: reportData?.summary?.totalOrders ?? "—",
            icon: FiShoppingBag,
            bg: "bg-blue-500",
            light: "bg-blue-50",
            iconColor: "text-blue-600",
          },
          {
            label: "Avg. Order Value",
            value: formatCurrency(reportData?.summary?.averageOrderValue || 0),
            icon: FiTrendingUp,
            bg: "bg-violet-500",
            light: "bg-violet-50",
            iconColor: "text-violet-600",
          },
          {
            label: "Items Sold",
            value: reportData?.summary?.totalItemsSold ?? "—",
            icon: FiPackage,
            bg: "bg-amber-500",
            light: "bg-amber-50",
            iconColor: "text-amber-600",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className={`inline-flex p-2.5 rounded-xl ${stat.light}`}>
              <stat.icon size={22} className={stat.iconColor} />
            </div>
            <p className="mt-3 text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="mt-1 text-xl md:text-2xl font-bold text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue over time */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <FiBarChart2 className="text-primary-500" size={20} />
            <h2 className="font-semibold text-gray-900">Revenue Over Time</h2>
          </div>
          <div className="p-5">
            {reportData?.revenueByDay?.length ? (
              <div className="space-y-4">
                {reportData.revenueByDay.map((day, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-gray-600 font-medium">
                        {new Date(day.date).toLocaleDateString("en-GB", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="text-gray-500">
                        {day.orders} orders · {formatCurrency(day.revenue)}
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 min-w-[4px]"
                        style={{
                          width: maxRevenue
                            ? `${Math.max(
                                4,
                                (day.revenue / maxRevenue) * 100
                              )}%`
                            : "0%",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400 text-sm">
                No revenue data for this period
              </div>
            )}
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <FiLayers className="text-primary-500" size={20} />
            <h2 className="font-semibold text-gray-900">Top Selling Products</h2>
          </div>
          <div className="p-5">
            {reportData?.topProducts?.length ? (
              <ul className="space-y-3">
                {reportData.topProducts.map((product, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                          index === 0
                            ? "bg-amber-500"
                            : index === 1
                            ? "bg-gray-400"
                            : index === 2
                            ? "bg-amber-700"
                            : "bg-gray-300"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.sold} sold
                        </p>
                      </div>
                    </div>
                    <span className="flex-shrink-0 ml-2 font-semibold text-gray-900">
                      {formatCurrency(product.revenue)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-12 text-center text-gray-400 text-sm">
                No product data for this period
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sales by category */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <FiPieChart className="text-primary-500" size={20} />
            <h2 className="font-semibold text-gray-900">Sales by Category</h2>
          </div>
          <div className="p-5">
            {reportData?.categoryBreakdown?.length ? (
              <div className="space-y-4">
                {reportData.categoryBreakdown.map((cat, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {cat.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatCurrency(cat.revenue)} · {cat.orders} orders
                      </span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all duration-500"
                        style={{
                          width: maxCategoryRevenue
                            ? `${(cat.revenue / maxCategoryRevenue) * 100}%`
                            : "0%",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400 text-sm">
                No category data for this period
              </div>
            )}
          </div>
        </div>

        {/* Orders by status */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <FiBarChart2 className="text-primary-500" size={20} />
            <h2 className="font-semibold text-gray-900">Orders by Status</h2>
          </div>
          <div className="p-5">
            {reportData?.ordersByStatus &&
            Object.keys(reportData.ordersByStatus).length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(reportData.ordersByStatus).map(
                  ([status, count]) => (
                    <div
                      key={status}
                      className={`p-4 rounded-xl bg-gradient-to-br ${
                        statusColors[status] || "from-gray-400 to-gray-500"
                      } text-white shadow-sm`}
                    >
                      <p className="text-2xl font-bold">{count}</p>
                      <p className="text-sm font-medium capitalize opacity-90">
                        {status}
                      </p>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400 text-sm">
                No order status data for this period
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
