import { Send } from "lucide-react";
import { THEMES } from "../constants";
import useThemeStore from "../store/useThemeStore";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  {
    id: 2,
    content: "I'm doing great! Just working working on some new features.",
    isSent: true,
  },
];
const SettingPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        <div className="flex-col gap-1">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70">
            Choose a theme for your chat interface
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-5 items-center">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`relative border-base-content/20 hover:border-base-content-40 border-1 hover:border-base-content/40 overflow-hidden outline-offset-2 rounded-lg transition-colors ${
                theme === t ? "bg-base-100 outline-1 " : ""
              }`}
              onClick={() => setTheme(t)}
              data-theme={t}
            >
              <div className="grid grid-cols-4 h-4 bg-linear-to-r from-primary to-neutral"></div>

              <span className="text-[13px] font-bold truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
              <div className="p-2 w-full rounded-md overflow-hidden">
                <div className="flex flex-wrap gap-2.5 font-bold">
                  <div className="rounded bg-primary size-6 text-primary-content lg:w-6">
                    A
                  </div>
                  <div className="rounded bg-secondary size-6 text-secondary-content lg:w-6">
                    A
                  </div>
                  <div className="rounded bg-accent size-6 text-accent-content lg:w-6">
                    A
                  </div>
                  <div className="rounded bg-neutral size-6 text-neutral-content lg:w-6">
                    A
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 h-4 bg-linear-to-r from-primary-content to-neutral-content"></div>
            </button>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-3">Preview</h3>

        <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
          <div className="p-4 bg-base-content/100">
            <div className="max-w-lg mx-auto">
              <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                  <div className="fleex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-semibold">
                      J
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">John Doe</h3>
                      <p className="text-xs text-base-content/70">Online</p>
                    </div>
                  </div>
                </div>
                <div className="p4 space-y-4 min-h-[200px] overflow-y-auto bg-base-100">
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isSent ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`rounded-xl p-3 shadow-sm max-w-[80%] ${
                          message.isSent
                            ? "bg-primary text-primary-content"
                            : " bg-base-200"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-[10px] mt-1.5 ${
                            message.isSent
                              ? "text-primary-content/70"
                              : "text-base-content/70"
                          }`}
                        >
                          12:00
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-base-300 bg-base-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value="This is a preview"
                      className="input input-bordered flex-1 text-sm h-10"
                      readOnly
                    />
                    <button className="btn btn-primary h-10 min-h-0">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
