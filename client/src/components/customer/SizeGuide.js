import React from "react";
import { FiX } from "react-icons/fi";

const SizeGuide = ({ isOpen, onClose, category }) => {
  if (!isOpen) return null;

  const sizeCharts = {
    men: {
      title: "Men's Size Guide",
      headers: ["Size", "Chest (cm)", "Waist (cm)", "Hip (cm)"],
      rows: [
        ["XS", "86-91", "71-76", "86-91"],
        ["S", "91-96", "76-81", "91-96"],
        ["M", "96-101", "81-86", "96-101"],
        ["L", "101-106", "86-91", "101-106"],
        ["XL", "106-111", "91-96", "106-111"],
        ["XXL", "111-116", "96-101", "111-116"],
      ],
    },
    women: {
      title: "Women's Size Guide",
      headers: ["Size", "Bust (cm)", "Waist (cm)", "Hip (cm)"],
      rows: [
        ["XS", "78-82", "60-64", "86-90"],
        ["S", "82-86", "64-68", "90-94"],
        ["M", "86-90", "68-72", "94-98"],
        ["L", "90-94", "72-76", "98-102"],
        ["XL", "94-98", "76-80", "102-106"],
        ["XXL", "98-102", "80-84", "106-110"],
      ],
      dresses: {
        headers: ["Size", "UK", "US", "EU"],
        rows: [
          ["XS", "6", "2", "34"],
          ["S", "8", "4", "36"],
          ["M", "10", "6", "38"],
          ["L", "12", "8", "40"],
          ["XL", "14", "10", "42"],
          ["XXL", "16", "12", "44"],
        ],
      },
    },
  };

  const currentChart = sizeCharts[category] || sizeCharts.men;

  const renderTable = (headers, rows) => (
    <div className="overflow-x-auto">
      <table className="w-full text-[10px] sm:text-sm">
        <thead>
          <tr className="bg-gray-100">
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-2 sm:px-4 py-1.5 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-700"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`px-2 sm:px-4 py-1.5 sm:py-3 text-[10px] sm:text-sm ${
                    cellIndex === 0
                      ? "font-medium text-gray-800"
                      : "text-gray-600"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
        <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-xl max-w-md sm:max-w-2xl w-full max-h-[85vh] sm:max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-4 border-b border-gray-200">
            <h2 className="text-sm sm:text-xl font-bold text-gray-800">
              {currentChart.title}
            </h2>
            <button
              onClick={onClose}
              className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close size guide"
            >
              <FiX size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="px-3 sm:px-6 py-2 sm:py-4 overflow-y-auto max-h-[calc(85vh-100px)] sm:max-h-[calc(90vh-140px)]">
            {/* How to Measure */}
            <div className="mb-3 sm:mb-6 p-2 sm:p-4 bg-primary-50 rounded-lg sm:rounded-xl">
              <h3 className="text-xs sm:text-sm font-semibold text-primary-700 mb-1 sm:mb-2">
                How to Measure
              </h3>
              <ul className="text-[10px] sm:text-sm text-primary-600 space-y-0.5 sm:space-y-1">
                <li>
                  • <strong>Chest/Bust:</strong> Measure around the fullest part
                  of your chest
                </li>
                <li>
                  • <strong>Waist:</strong> Measure around your natural
                  waistline
                </li>
                <li>
                  • <strong>Hip:</strong> Measure around the fullest part of
                  your hips
                </li>
              </ul>
            </div>

            {/* Main Size Chart */}
            {currentChart.headers && (
              <div className="mb-3 sm:mb-6">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 sm:mb-3">
                  General Sizing
                </h3>
                {renderTable(currentChart.headers, currentChart.rows)}
              </div>
            )}

            {currentChart.dresses && (
              <div className="mb-3 sm:mb-6">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 sm:mb-3">
                  International Size Conversion
                </h3>
                {renderTable(
                  currentChart.dresses.headers,
                  currentChart.dresses.rows
                )}
              </div>
            )}

            {/* Tips */}
            <div className="mt-3 sm:mt-6 p-2 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Sizing Tips</h3>
              <ul className="text-[10px] sm:text-sm text-gray-600 space-y-0.5 sm:space-y-1">
                <li>
                  • If you're between sizes, we recommend sizing up for a more
                  comfortable fit
                </li>
                <li>
                  • Sizes may vary slightly between different styles and brands
                </li>
                <li>
                  • For fitted items, consider your preferred fit (relaxed vs.
                  slim)
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="px-3 sm:px-6 py-2 sm:py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full py-2 sm:py-3 text-xs sm:text-base bg-primary-600 text-white rounded-lg sm:rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;
