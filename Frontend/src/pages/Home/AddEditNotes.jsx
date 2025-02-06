import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import TagInput from "../../components/Input/TagInput";
import axios from "axios";
import { toast } from "react-toastify";
import { Env } from "../../env";

const AddEditNotes = ({ onClose, noteData, type, getAllNotes }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");

  const [tags, setTags] = useState(() => {
    if (!noteData?.tags) return [];
    // Check if the tags are already an array
    if (Array.isArray(noteData.tags)) {
      return noteData.tags;
    }
    // If it's a stringified array, parse it
    try {
      return JSON.parse(noteData.tags);
    } catch (e) {
      return []; // If parsing fails, return an empty array
    }
  });

  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(noteData?.image || ""); // Show existing image if editing
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  let recognition;

  // Speech Recognition
  if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
    recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setContent((prevContent) => prevContent + " " + transcript);
      toast.success("Audio transcribed successfully!");
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      toast.error("Speech recognition failed.");
    };
  } else {
    toast.error("Your browser does not support speech recognition.");
  }

  const startRecording = () => {
    if (recognition) {
      setIsRecording(true);
      recognition.start();

      setTimeout(() => {
        if (isRecording) {
          stopRecording();
          toast.info("Recording stopped after 1 minute.");
        }
      }, 60000);
    }
  };

  const stopRecording = () => {
    if (recognition) {
      setIsRecording(false);
      recognition.stop();
    }
  };

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // API Calls
  const editNote = async (stringifiedTags) => {
    const noteId = noteData._id;
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("tags", stringifiedTags);
      if (image) {
        formData.append("image", image);
      }

      const res = await axios.post(
        `http://localhost:8001/api/note/edit/${noteId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!res.data.success) {
        setError(res.data.message);
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);
      getAllNotes();
      onClose();
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  const addNewNote = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("tags", tags.length > 0 ? JSON.stringify(tags) : "");
      if (image) {
        formData.append("image", image);
      }

      const res = await axios.post(
        Env.API_BASE_URL + "/api/note/add",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!res.data.success) {
        setError(res.data.message);
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);
      getAllNotes();
      onClose();

      setTitle("");
      setContent("");
      setTags([]);
      setImage(null);
      setPreviewImage("");
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }
    if (!content) {
      setError("Please enter the content");
      return;
    }

    setError("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-300"
        onClick={onClose}
      >
        <MdClose />
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label text-red-400 uppercase">Title</label>
        <input
          type="text"
          className="text-sm text-slate-950 outline-none px-3"
          placeholder="Title.."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label text-red-400 uppercase">Content</label>
        <textarea
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Content..."
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {/* Image Upload */}
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label text-red-400 uppercase">
          Upload Image
        </label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="w-32 h-32 object-cover mt-2 rounded"
          />
        )}
      </div>

      <div className="flex gap-4 mt-3">
        <button
          className={`p-2 text-sm cursor-pointer text-white rounded ${
            isRecording ? "bg-red-500" : "bg-blue-500"
          }`}
          onClick={startRecording}
          disabled={isRecording}
        >
          {isRecording ? "Recording..." : "Start Recording"}
        </button>
        <button
          className="p-2 bg-gray-500 rounded text-sm text-white cursor-pointer"
          onClick={stopRecording}
          disabled={!isRecording}
        >
          Stop Recording
        </button>
      </div>

      <div className="mt-3">
        <label className="input-label text-red-400 uppercase">Tags</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      <button
        className="btn-primary font-medium mt-5 p-3 cursor-pointer"
        onClick={handleAddNote}
      >
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;
