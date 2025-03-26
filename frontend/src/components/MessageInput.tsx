import { type ChangeEvent, FormEvent, useRef, useState } from "react";
import useChatStore from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imgPreview, setImgPreview] = useState<string | ArrayBuffer | null>(
    null
  );
  const [messageData, setMessageData] = useState<{
    txt: string;
    img: string | ArrayBuffer | null;
  }>({ txt: "", img: null });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { sendMessage, isSendingMessage } = useChatStore();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];

    if (!file.type.startsWith("image/")) {
      toast.error("Plase select an image file.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setImgPreview(base64Image);
      setMessageData({ ...messageData, img: base64Image });
    };
  };
  const removeImage = () => {
    setImgPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text.trim() && !imgPreview) return;
    scrollTo(0, 0);

    try {
      setText("");
      setImgPreview(null);
      await sendMessage({ text: text.trim(), image: imgPreview });
      setMessageData({ txt: "", img: null });

      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.log("Failded to send message:", err);
    }
  };

  return (
    <div className="p-4 w-full">
      {imgPreview && (
        <div className="mb-3 flex items-center ga-2">
          <div className="relative">
            <img
              src={typeof imgPreview === "string" ? imgPreview : undefined}
              alt="Preview"
              className="size-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSendMessage}>
        <div className="flex-1 flex gap-2 items-center">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            type="button"
            className={`sm-flex btn btn-circle ${
              imgPreview ? "text-emerald-500" : "text-zinc-400"
            }`}
          >
            <Image size={20} />
          </button>
          <input
            placeholder="Type a message..."
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setMessageData({ ...messageData, txt: e.target.value });
            }}
            className="w-full input input-bordered rounded-lg inputsm sm:input-md"
          />

          <button type="submit" disabled={isSendingMessage}>
            <Send
              size={22}
              className={`${
                imgPreview || text.trim() ? "" : "text-primary-content/40"
              }`}
            />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
