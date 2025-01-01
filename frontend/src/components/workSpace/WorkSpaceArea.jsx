import { useCallback, useEffect, useState } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  NavLink,
  useParams,
} from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setBot } from "../../redux/botSlice";
import style from "./workSpaceAera.module.css";
import BotPage from "../botPage/BotPage";
import ResponsePage from "../responsePage/ResponsePage";
import Cookies from "js-cookie";
import axios from "axios";

const WorkSpaceArea = ({ isBotSaved }) => {
  const tokenId = Cookies.get("tokenId");
  const { folderName, botName, botId } = useParams();
  const data = useSelector((store) => store?.bot?.data || {});
  const updateData = useSelector(
    (store) => store?.botUpdateReducer?.updateData || {}
  );
  const [botDetails, setBotDetails] = useState([]);
  const [skeleton, setSkeleton] = useState(isBotSaved);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mainRoute = location.pathname.split("/")[3];
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const isDarkMode = theme === "dark";

  const handleBotNameChange = (e) => {
    const newBotName = e.target.value;
    const updatedData = isBotSaved
      ? { ...updateData, botName: newBotName }
      : {
          ...(JSON.parse(localStorage.getItem("storeBot")) || {}),
          botName: newBotName,
        };
    updatedData.botName = newBotName;

    isBotSaved
      ? dispatch(setBotUpdate(updatedData))
      : localStorage.setItem("storeBot", JSON.stringify(updatedData));

    dispatch(setBot(updatedData));
  };

  const fetchFolderDetails = useCallback(async () => {
    if (!folderName || !botName) {
      return toast.error("Invalid folder or bot name.");
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/get_folder_details`,
        {
          headers: { Authorization: tokenId },
          withCredentials: true,
        }
      );
      const folder = response.data.allFolder.find(
        (folder) => folder.folderName === folderName
      );
      const bot = folder?.allBots.find((bot) => bot.botName === botName);
      setBotDetails(bot ? [bot] : []);
      setSkeleton(false);
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
      navigate("/");
    }
  }, [navigate, folderName, botName, tokenId]);

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const handleShare = () => {
    const shareData = {
      title: "Folder Details",
      text: `Check out the folder details: ${window.location.href}`,
    };

    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => toast.success("Folder shared successfully!"))
        .catch((error) => toast.error(`Error sharing: ${error.message}`));
    } else {
      navigator.clipboard.writeText(shareData.text);
      toast.success("Link copied to clipboard!");
    }
  };

  useEffect(() => {
    if (folderName && botName) {
      fetchFolderDetails();
    }
  }, [fetchFolderDetails, folderName, botName]);
  const handleBotSave = async () => {
    if (!data?.botName) return toast.error("Please enter a bot name.");
    if (data?.botArr?.length === 0) return toast.error("Bot can't be empty.");

    const toastId = toast.loading("Creating...");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/save_bot`,
        { data, folder: folderName },
        {
          headers: {
            Authorization: tokenId,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        toast.success(response.data.msg, { id: toastId, duration: 1000 });
        localStorage.removeItem("storeBot");
        navigate(`/folder/${folderName}`);
      } else {
        toast.error(response.data.msg, { id: toastId, duration: 1000 });
      }
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
      navigate("/");
    }
  };

  return (
    <div className={style.workSpaceMainContainer}>
      <header>
        <div className={style.left}>
          <input
            value={isBotSaved ? updateData?.botName || botName : data?.botName}
            type="text"
            onChange={handleBotNameChange}
            placeholder="Enter Bot Name"
          />
        </div>
        <div className={style.center}>
          <NavLink
            to={
              isBotSaved
                ? `/folder/${folderName}/bot/${botName}/${botId}`
                : `/folder/${folderName}/bot`
            }
            className={({ isActive }) =>
              `${isActive ? style.botText : ""} ${style.navTxt}`
            }
          >
            Flow
          </NavLink>

          <NavLink
            to={`/folder/${folderName}/response/${botName}/${botId}`}
            className={({ isActive }) =>
              `${isActive ? style.botText : ""} ${style.navTxt}`
            }
          >
            Response
          </NavLink>
        </div>
        <div className={style.right}>
          <span className={style.lightLabel}>Light</span>
          <input
            type="checkbox"
            className={style.checkbox}
            id="themeToggle"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />
          <label className={style.label} htmlFor="themeToggle">
            <span className={style.slider}></span>
          </label>
          <span className={style.darkLabel}>Dark</span>
          <button onClick={handleShare} className={style.shareBtn}>
            Share
          </button>
          <button
            onClick={handleBotSave}
            className={
              data?.botArr?.length !== 0 && data?.botName?.length !== 0
                ? style.saveBtn
                : style.notUpdateBtn
            }
          >
            Save
          </button>
          <div
            onClick={() => navigate("/folder/main")}
            style={{ color: "#F55050", fontSize: "1.4rem", cursor: "pointer" }}
          >
            <RxCross2 />
          </div>
        </div>
      </header>
      {mainRoute === "bot" && (
        <BotPage
          isBotSaved={isBotSaved}
          botDetails={botDetails}
          skeleton={skeleton}
        />
      )}
      {mainRoute === "response" && <ResponsePage isBotSaved={isBotSaved} />}
      <Outlet />
    </div>
  );
};

export default WorkSpaceArea;
