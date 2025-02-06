import { useState } from "react";
import { MdClose, MdAdd } from "react-icons/md";

const TagInput = ({ tags, setTags }) => {
  const [inputVal, setInputVal] = useState("");

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const addNewTag = () => {
    const trimmedTag = inputVal.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags((prevTags) => [...prevTags, trimmedTag]); // Add the trimmed tag
    }
    setInputVal(""); // Clear input after adding
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addNewTag();
    }
  };

  return (
    <div>
      {tags?.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-2 text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded"
            >
              #{tag} {/* Directly display tag */}
              <button
                onClick={() => handleRemoveTag(tag)}
                aria-label={`Remove tag: ${tag}`}
                className="text-red-500 hover:text-red-700"
              >
                <MdClose />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mt-3">
        <input
          type="text"
          value={inputVal}
          className="text-sm bg-transparent border px-3 py-2 rounded outline-none"
          placeholder="Add Tags"
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="w-8 h-8 flex items-center justify-center rounded border-blue-700"
          onClick={addNewTag}
          disabled={!inputVal.trim()}
        >
          <MdAdd className="text-2xl text-blue-700 hover:text-white" />
        </button>
      </div>
    </div>
  );
};

export default TagInput;
