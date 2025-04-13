import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, ChevronDown, ChevronUp } from "lucide-react";

const Table = ({
  columns,
  data,
  loading,
  error,
  emptyState,
  onRowClick,
  rowActions,
}) => {
  const [sortConfig, setSortConfig] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutside = Object.values(dropdownRefs.current).every(
        (ref) => ref && !ref.contains(event.target)
      );

      if (clickedOutside) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const handleToggleDropdown = (id, e) => {
    e.stopPropagation();
    setOpenDropdownId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Loading data...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
          <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mr-3">
            <span className="text-red-500 text-sm">!</span>
          </div>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
          {emptyState.icon && (
            <div className="mx-auto mb-3 text-gray-400">{emptyState.icon}</div>
          )}
          <p>{emptyState.message}</p>
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`p-4 text-sm font-medium text-gray-500 ${
                      column.sortable ? "cursor-pointer" : ""
                    }`}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center">
                      {column.title}
                      {column.sortable && (
                        <span className="ml-1">
                          {sortConfig?.key === column.key ? (
                            sortConfig.direction === "ascending" ? (
                              <ChevronUp size={14} />
                            ) : (
                              <ChevronDown size={14} />
                            )
                          ) : (
                            <ChevronDown size={14} className="text-gray-300" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                {rowActions && (
                  <th className="p-4 text-sm font-medium text-gray-500 text-right">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {columns.map((column) => (
                    <td key={`${item.id}-${column.key}`} className="p-4">
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))}
                  {rowActions && (
                    <td className="p-4 text-right">
                      <div className="relative">
                        <button
                          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                          onClick={(e) => handleToggleDropdown(item.id, e)}
                        >
                          <MoreVertical size={18} />
                        </button>

                        {openDropdownId === item.id && (
                          <div
                            ref={(el) => (dropdownRefs.current[item.id] = el)}
                            className="absolute right-0 top-full mt-1 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-100 w-48"
                          >
                            {rowActions(item).map((action, index) => (
                              <button
                                key={index}
                                className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onClick(item);
                                  setOpenDropdownId(null);
                                }}
                              >
                                {action.icon && (
                                  <span className="mr-2">{action.icon}</span>
                                )}
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Table;
