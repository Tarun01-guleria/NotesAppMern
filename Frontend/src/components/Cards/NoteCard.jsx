import {
  MdContentCopy,
  MdCreate,
  MdDelete,
  MdOutlinePushPin,
} from "react-icons/md";
import moment from "moment";
import { toast } from "react-toastify";
const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onPinNote,
  onEdit,
  onDelete,
}) => {
  const copyToClipboard = () => {
    if (!content) {
      toast.warn("Nothing to copy!");
      return;
    }
    navigator.clipboard.writeText(content);
    toast.success("Note copied to clipboard!");
  };
  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out mx-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h6 className="text-sm font-medium">{title}</h6>
          <span className="text-sm text-green-700">
            {moment(date).format("Do MMM YYYY ")}
          </span>
        </div>
        <MdOutlinePushPin
          className={`icon-btn ${
            isPinned ? "text-[#2B85FF]" : "text-slate-300"
          }`}
          onClick={onPinNote}
        />
      </div>
      <p className="text-xs text-slate-600 mt-2">{content?.slice(0, 60)}</p>
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-slate-500">
          {tags.map((item) => `#${item} `)}
        </div>
        <div className="flex gap-2 ">
          <MdCreate
            className="icon-btn hover:text-green-600"
            onClick={onEdit}
          />
          <MdDelete
            className="icon-btn hover:text-red-500"
            onClick={onDelete}
          />
          <MdContentCopy
            className="icon-btn hover:text-blue-500"
            onClick={copyToClipboard}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
