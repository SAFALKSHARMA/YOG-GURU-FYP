import React, { useState } from "react";

const AddBlog = () => {
  const [items, setItems] = useState([]); // Empty array to start

  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
  });

  const handleAddItem = () => {
    if (newItem.name.trim() === "" || newItem.description.trim() === "") return;

    setItems([
      ...items,
      {
        id: Date.now(), // Using timestamp for unique ID
        name: newItem.name,
        description: newItem.description,
      },
    ]);

    setNewItem({ name: "", description: "" });
  };

  return (
    <div className="font-sans max-w-2xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Item List</h2>

      {/* Add Item Form */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <input
          type="text"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          placeholder="Item name"
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          value={newItem.description}
          onChange={(e) =>
            setNewItem({ ...newItem, description: e.target.value })
          }
          placeholder="Item description"
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        <button
          onClick={handleAddItem}
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Item
        </button>
      </div>

      {/* Items Table - Only shows if there are items */}
      {items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-left border-b border-gray-200">Name</th>
                <th className="p-4 text-left border-b border-gray-200">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="p-4 font-medium">{item.name}</td>
                  <td className="p-4 text-gray-600">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">
          No items yet. Add your first item above.
        </p>
      )}
    </div>
  );
};

export default AddBlog;
